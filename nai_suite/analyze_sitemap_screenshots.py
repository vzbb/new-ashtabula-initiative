#!/usr/bin/env python3
from __future__ import annotations

import argparse
import base64
import datetime as dt
import json
import mimetypes
import os
import re
import sys
import time
import urllib.error
import urllib.request
from collections import Counter
from dataclasses import dataclass
from html import escape
from pathlib import Path
from typing import Any

from nai_suite.siteflow import load_public_slugs


DEFAULT_IMAGE_DIR = Path("sitemap_screenshots")
DEFAULT_OUTPUT = DEFAULT_IMAGE_DIR / "visual_analysis_report.json"
DEFAULT_FAST_MODEL = os.environ.get(
    "OPENROUTER_MODEL_FAST",
    os.environ.get("OPENROUTER_MODEL", "google/gemini-3.1-flash-lite-preview"),
)
DEFAULT_DEEP_MODEL = os.environ.get("OPENROUTER_MODEL_DEEP", "google/gemini-3.1-pro-preview")
DEFAULT_FAST_REASONING = os.environ.get("OPENROUTER_REASONING_FAST", "medium")
DEFAULT_DEEP_REASONING = os.environ.get("OPENROUTER_REASONING_DEEP", "high")
DEFAULT_VERIFY_REASONING = os.environ.get("OPENROUTER_REASONING_VERIFY", DEFAULT_DEEP_REASONING)
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
GALLERY_FILE = DEFAULT_IMAGE_DIR / "index.html"

FOCUSED_BRANDING_EXEMPLARS = [
    {
        "slug": "compassionate",
        "expected_branding_status": "branded",
        "expected_target_brand_entity": "Ducro Funeral Services",
        "note": "Clearly anchored to a specific funeral-services buyer with explicit service-area and company identity cues.",
    },
    {
        "slug": "farm-stand",
        "expected_branding_status": "unbranded",
        "expected_target_brand_entity": None,
        "note": "Generic template-like concept; do not force a buyer if the screenshot does not resolve to a concrete business.",
    },
    {
        "slug": "fence-quote",
        "expected_branding_status": "unbranded",
        "expected_target_brand_entity": None,
        "note": "Still a generic quote/generator concept rather than a specific named fencing company.",
    },
    {
        "slug": "rennick-market",
        "expected_branding_status": "branded",
        "expected_target_brand_entity": "Rennick Meat Market",
        "note": "The title itself points to a real named market business; branding should preserve that identity.",
    },
    {
        "slug": "trumbull-locker",
        "expected_branding_status": "branded",
        "expected_target_brand_entity": "Trumbull Meat Locker",
        "note": "The title itself points to a real named meat-locker business; branding should preserve that identity.",
    },
]


@dataclass
class ScreenshotRecord:
    image_path: Path
    metadata_path: Path | None
    url: str | None
    title: str | None
    source: str | None
    warnings: list[str]
    image_size: int
    modified_at: str


def load_dotenv(path: Path = Path(".env")) -> None:
    if not path.exists():
        return

    for raw_line in path.read_text().splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip()
        if not key or key in os.environ:
            continue
        if value and ((value[0] == value[-1]) and value[0] in {'"', "'"}):
            value = value[1:-1]
        os.environ[key] = value


def prepare_analysis_output(output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    if output_path.exists():
        output_path.unlink()
    if GALLERY_FILE.exists():
        GALLERY_FILE.unlink()


def slug_from_path(path: Path) -> str:
    stem = path.stem
    if "_" in stem:
        stem = stem.split("_", 1)[1]
    return stem


def parse_metadata_file(path: Path | None) -> dict[str, str]:
    if path is None or not path.exists():
        return {}

    data: dict[str, str] = {}
    for raw_line in path.read_text().splitlines():
        if ":" not in raw_line:
            continue
        key, value = raw_line.split(":", 1)
        data[key.strip()] = value.strip()
    return data


def normalize_text(value: Any) -> str:
    text = str(value or "").strip().lower()
    text = re.sub(r"\s+", " ", text)
    text = text.strip(" \t\r\n\"'`.,;:()[]{}")
    return text


def reasoning_effort_for_quality(quality: str, override: str | None = None) -> str | None:
    if override:
        return override
    return DEFAULT_DEEP_REASONING if quality == "deep" else DEFAULT_FAST_REASONING


def ensure_online_variant(model: str) -> str:
    if model.endswith(":online"):
        return model
    return f"{model}:online"


def build_few_shot_examples(records_by_slug: dict[str, dict[str, Any]]) -> str:
    blocks: list[str] = []
    for exemplar in FOCUSED_BRANDING_EXEMPLARS:
        item = records_by_slug.get(exemplar["slug"])
        if not item:
            continue
        overall = item.get("overall_assessment", {}) if isinstance(item, dict) else {}
        branding = item.get("branding_analysis", {}) if isinstance(item, dict) else {}
        layout = item.get("layout_analysis", {}) if isinstance(item, dict) else {}
        blocks.append(
            "\n".join(
                [
                    f"Example slug: {item.get('slug')}",
                    f"Title: {item.get('source_title') or item.get('capture_metadata', {}).get('title') or ''}",
                    f"URL: {item.get('source_url') or item.get('capture_metadata', {}).get('url') or ''}",
                    f"Observed screenshot notes: design={overall.get('design_score_10', '')}, brand_presence={branding.get('brand_presence', '')}, center_alignment={layout.get('center_alignment', '')}, status={overall.get('status', '')}",
                    f"Observed target: {branding.get('target_brand_entity') or 'none'}",
                    f"Observed target status: {branding.get('target_brand_status') or 'unknown'}",
                    f"Observed branding status: {branding.get('branding_status') or 'unknown'}",
                    f"Calibration expectation: branding_status={exemplar['expected_branding_status']}; target_brand_entity={exemplar['expected_target_brand_entity'] or 'null'}; note={exemplar['note']}",
                ]
            )
        )
    if not blocks:
        return ""
    return "\n\n".join(["Few-shot calibration examples:", *[f"- {block.replace(chr(10), chr(10) + '  ')}" for block in blocks]])


def normalize_branding_analysis(analysis: dict[str, Any]) -> dict[str, Any]:
    branding = analysis.get("branding_analysis", {})
    overall = analysis.get("overall_assessment", {}) if isinstance(analysis.get("overall_assessment", {}), dict) else {}
    if not isinstance(branding, dict):
        return analysis

    target_entity = branding.get("target_brand_entity")
    research_needed = bool(branding.get("research_needed"))
    try:
        brand_quality_score = int(round(float(branding.get("brand_quality_score_10") or overall.get("branding_score_10", 0))))
    except (TypeError, ValueError):
        brand_quality_score = int(round(float(overall.get("branding_score_10", 0) or 0)))
    target_brand_status = str(branding.get("target_brand_status") or "").strip()
    if target_brand_status not in {"specific", "needs_research", "rejected"}:
        target_brand_status = "needs_research"

    branding_status = str(branding.get("branding_status") or "").strip()
    if branding_status not in {"branded", "partial", "unbranded"}:
        brand_presence = str(branding.get("brand_presence") or "").strip()
        if brand_presence == "strong":
            branding_status = "branded"
        elif brand_presence == "moderate":
            branding_status = "partial"
        else:
            branding_status = "unbranded"

    target_verification = branding.get("target_brand_verification")
    if isinstance(target_verification, dict):
        verified = bool(target_verification.get("verified"))
        if verified and target_brand_status == "specific":
            target_entity = target_verification.get("target_brand_entity") or target_entity
            research_needed = False
        elif target_verification.get("research_needed") is not None:
            research_needed = bool(target_verification.get("research_needed"))
            if not research_needed and target_brand_status != "specific":
                research_needed = True

    branding["target_brand_entity"] = target_entity
    branding["target_brand_status"] = target_brand_status
    branding["research_needed"] = research_needed
    branding["branding_status"] = branding_status
    branding["brand_quality_score_10"] = brand_quality_score
    branding["branding_work_remaining_10"] = max(0, 10 - brand_quality_score)
    branding["branding_refinement_score_10"] = branding["branding_work_remaining_10"]
    if not branding.get("target_brand_reasoning"):
        if target_brand_status == "specific" and target_entity:
            branding["target_brand_reasoning"] = f"Specific target entity identified as {target_entity}."
        else:
            branding["target_brand_reasoning"] = "No specific target entity could be verified from the screenshot; target research is needed."
    if not branding.get("research_prompt"):
        branding["research_prompt"] = "Run target-buyer research for this MVP before branding decisions are finalized."
    analysis["branding_analysis"] = branding
    return analysis


def verify_branding_analysis_with_web(
    analysis: dict[str, Any],
    api_key: str,
    model: str,
    quality: str,
    temperature: float,
    max_tokens: int,
) -> dict[str, Any]:
    branding = analysis.get("branding_analysis", {})
    if not isinstance(branding, dict):
        return analysis

    target_entity = branding.get("target_brand_entity")
    if not target_entity:
        return analysis

    slug = str(analysis.get("slug") or analysis.get("capture_metadata", {}).get("slug") or "")
    source_url = str(analysis.get("source_url") or analysis.get("capture_metadata", {}).get("url") or "")
    title = str(analysis.get("source_title") or analysis.get("capture_metadata", {}).get("title") or "")

    try:
        verification = verify_target_brand_with_web(
            api_key=api_key,
            model=model,
            target_entity=str(target_entity),
            slug=slug,
            title=title,
            source_url=source_url,
            quality=quality,
            temperature=temperature,
            max_tokens=max_tokens,
        )
    except Exception as exc:
        verification = {
            "verified": False,
            "confidence": 0.0,
            "target_brand_status": "needs_research",
            "target_brand_entity": None,
            "research_needed": True,
            "verification_reasoning": f"Web verification failed: {exc}",
            "evidence": [],
            "evidence_domains": [],
        }

    if not isinstance(verification, dict):
        verification = {}

    verified = bool(verification.get("verified"))
    target_brand_status = str(verification.get("target_brand_status") or "needs_research").strip()
    if target_brand_status not in {"specific", "needs_research", "rejected"}:
        target_brand_status = "needs_research"
    research_needed = bool(verification.get("research_needed")) or not verified or target_brand_status != "specific"
    evidence_domains = verification.get("evidence_domains", [])
    evidence = verification.get("evidence", [])

    if verified and target_brand_status == "specific":
        branding["target_brand_entity"] = verification.get("target_brand_entity") or target_entity
        branding["target_brand_status"] = "specific"
        branding["research_needed"] = False
        branding["target_brand_reasoning"] = verification.get("verification_reasoning") or branding.get("target_brand_reasoning")
    else:
        branding["target_brand_entity"] = None
        branding["target_brand_status"] = "needs_research"
        branding["research_needed"] = True
        branding["target_brand_reasoning"] = verification.get("verification_reasoning") or branding.get("target_brand_reasoning")

    branding["target_brand_verification"] = {
        "verified": verified,
        "confidence": verification.get("confidence", 0.0),
        "target_brand_status": target_brand_status,
        "research_needed": research_needed,
        "evidence": evidence if isinstance(evidence, list) else [],
        "evidence_domains": evidence_domains if isinstance(evidence_domains, list) else [],
    }
    analysis["branding_analysis"] = branding
    return normalize_branding_analysis(analysis)


def collect_screenshots(
    image_dir: Path,
    limit: int | None = None,
    canonical_slugs: set[str] | None = None,
    selected_slugs: set[str] | None = None,
) -> list[ScreenshotRecord]:
    allowed = {".png", ".jpg", ".jpeg", ".webp"}
    images = sorted(
        path for path in image_dir.iterdir()
        if path.is_file() and path.suffix.lower() in allowed
    )

    latest_by_slug: dict[str, ScreenshotRecord] = {}
    duplicates: list[tuple[str, Path, Path]] = []
    for image_path in images:
        metadata_path = image_dir / f"{image_path.stem}.txt"
        metadata = parse_metadata_file(metadata_path)
        stat = image_path.stat()
        record = ScreenshotRecord(
            image_path=image_path,
            metadata_path=metadata_path if metadata_path.exists() else None,
            url=metadata.get("url"),
            title=metadata.get("title"),
            source=metadata.get("source"),
            warnings=[w.strip() for w in metadata.get("warnings", "").split(",") if w.strip() and w.strip() != "none"],
            image_size=stat.st_size,
            modified_at=dt.datetime.fromtimestamp(stat.st_mtime).isoformat(),
        )
        slug = slug_from_path(image_path)
        if canonical_slugs is not None and slug not in canonical_slugs:
            continue
        if selected_slugs is not None and slug not in selected_slugs:
            continue
        existing = latest_by_slug.get(slug)
        if existing is None:
            latest_by_slug[slug] = record
            continue
        if record.modified_at >= existing.modified_at:
            duplicates.append((slug, existing.image_path, image_path))
            latest_by_slug[slug] = record
        else:
            duplicates.append((slug, image_path, existing.image_path))

    records = sorted(latest_by_slug.values(), key=lambda rec: rec.image_path.name)

    if limit is not None:
        records = records[:limit]

    if duplicates:
        print(f"Pruned {len(duplicates)} duplicate/older screenshots by slug")

    return records


def image_to_data_url(image_path: Path) -> tuple[str, str]:
    mime_type, _ = mimetypes.guess_type(image_path.name)
    mime_type = mime_type or "image/png"
    encoded = base64.b64encode(image_path.read_bytes()).decode("ascii")
    return f"data:{mime_type};base64,{encoded}", mime_type


def build_prompt(record: ScreenshotRecord, few_shot_examples: str | None = None) -> str:
    examples_block = f"\n\n{few_shot_examples}\n" if few_shot_examples else ""
    return f"""
You are a strict visual QA and product-design analyst for AI-generated MVP web apps.

Analyze the screenshot in exhaustive detail. Focus on:
- obvious product issues or broken experience
- layout alignment and whether the page is centered, left-aligned, or uneven
- awkward gaps, margins, padding, clipping, overflow, or collapsed spacing
- branding quality and whether the page feels meaningfully branded or suitable for productized reuse
- aesthetic quality, polish, trust signals, hierarchy, and content clarity
- quick fixes that would most improve the page with minimal effort
- white-label fit / reuse potential when a site is meant to be broadly deployable to similar customers
- whether the page looks shell-like, incomplete, or visually empty

Important:
- Not every MVP is supposed to be white-labeled.
- Judge white-label fit as an opportunity metric, not as an accusation of weakness.
- A bespoke, one-off site can score low on white-label fit and still be a strong, well-branded MVP.
- If a site looks generic, explain whether that genericness is a problem or actually useful for reuse.
- Branding is a first-class axis, separate from product quality.
- If the page is clearly branded to a real target buyer, explicitly name that buyer/entity in `target_brand_entity`.
- Only name a concrete real-world organization, business, institution, or municipal entity that is actually the target buyer.
- Do not use abstract placeholders or project labels as the target, such as:
  - "New Ashtabula Initiative"
  - "Ashtabula Community"
  - "community"
  - "initiative"
  - "project"
  - "portal"
  - product-style names like "Finder", "Quote", "Planner", "Tracker", "Navigator", or "Whisperer"
- If no concrete buyer/entity can be confidently named, set `target_brand_entity` to null and set `research_needed` to true.
- If the page is not clearly branded, set `branding_status` to `unbranded` or `partial` as appropriate, and explain that target research is needed rather than inventing a buyer.
- If the page is partially branded, set `branding_status` to `partial` and explain what is missing.

{examples_block}
Use only the screenshot and the metadata below. Be specific and concrete.
If something looks good, say why. If something looks weak, say exactly what is weak.

Return a single JSON object only, with this schema:
{{
  "screenshot_file": string,
  "slug": string,
  "source_url": string|null,
  "source_title": string|null,
  "source_type": string|null,
  "overall_assessment": {{
    "status": "excellent"|"good"|"mixed"|"poor"|"broken",
    "design_score_10": number,
    "branding_score_10": number,
    "clarity_score_10": number,
    "white_label_fit_10": number,
    "first_impression": string,
    "executive_summary": string
  }},
  "layout_analysis": {{
    "center_alignment": "centered"|"mostly_centered"|"left_aligned"|"full_width"|"mixed"|"unclear",
    "alignment_notes": string,
    "spacing_notes": string,
    "margin_notes": string,
    "whitespace_notes": string,
    "visual_hierarchy_notes": string,
    "content_density": "too_sparse"|"balanced"|"too_dense"|"unclear"
  }},
  "branding_analysis": {{
    "brand_presence": "strong"|"moderate"|"weak"|"almost_none",
    "branding_status": "branded"|"partial"|"unbranded",
    "brand_quality_score_10": number,
    "brand_consistency_notes": string,
    "generic_or_reuse_signals": [string],
    "distinctive_brand_elements": [string],
    "target_brand_entity": string|null,
    "target_brand_reasoning": string,
    "research_needed": boolean,
    "research_prompt": string,
    "white_label_fit": {{
      "rating": "high"|"medium"|"low",
      "reasoning": string
    }}
  }},
  "aesthetic_analysis": {{
    "color_notes": string,
    "typography_notes": string,
    "component_quality_notes": string,
    "polish_notes": string,
    "trust_signal_notes": string
  }},
  "issues": [
    {{
      "category": string,
      "severity": "low"|"medium"|"high"|"critical",
      "issue": string,
      "evidence": string,
      "quick_fix": string,
      "effort": "small"|"medium"|"large"
    }}
  ],
  "quick_fixes": [
    {{
      "priority": 1,
      "action": string,
      "why": string,
      "effort": "small"|"medium"|"large",
      "impact": "low"|"medium"|"high"
    }}
  ],
  "orchestration_notes": {{
    "likely_next_dev_actions": [string],
    "shared_pattern_warning": boolean,
    "looks_shell_like": boolean,
    "needs_branding_pass": boolean,
    "needs_layout_pass": boolean,
    "needs_content_pass": boolean
  }},
  "confidence": number
}}

Constraints:
- JSON only. No markdown.
- Use strings, numbers, booleans, arrays, and objects only.
- Be detailed, but do not invent hidden information.
- If the page is obviously incomplete or blank, say so plainly.

Metadata:
- file: {record.image_path.name}
- slug: {slug_from_path(record.image_path)}
- url: {record.url or ""}
- title: {record.title or ""}
- source: {record.source or ""}
- warnings: {", ".join(record.warnings) if record.warnings else "none"}
""".strip()


def build_branding_prompt(
    record: ScreenshotRecord,
    baseline: dict[str, Any] | None = None,
    few_shot_examples: str | None = None,
) -> str:
    overall = baseline.get("overall_assessment", {}) if isinstance(baseline, dict) else {}
    layout = baseline.get("layout_analysis", {}) if isinstance(baseline, dict) else {}
    aesthetic = baseline.get("aesthetic_analysis", {}) if isinstance(baseline, dict) else {}
    issues = baseline.get("issues", []) if isinstance(baseline, dict) else []
    quick_fixes = baseline.get("quick_fixes", []) if isinstance(baseline, dict) else []
    baseline_branding = baseline.get("branding_analysis", {}) if isinstance(baseline, dict) else {}
    context = []
    if baseline:
        context.append(f"Existing overall status: {overall.get('status', '')}, design={overall.get('design_score_10', '')}, brand={overall.get('branding_score_10', '')}, clarity={overall.get('clarity_score_10', '')}, wl_fit={overall.get('white_label_fit_10', '')}")
        context.append(f"Existing layout: center_alignment={layout.get('center_alignment', '')}; content_density={layout.get('content_density', '')}; alignment_notes={layout.get('alignment_notes', '')}")
        context.append(f"Existing aesthetic: polish={aesthetic.get('polish_notes', '')}; trust={aesthetic.get('trust_signal_notes', '')}")
        if isinstance(issues, list) and issues:
            first_issue = issues[0] if isinstance(issues[0], dict) else {}
            context.append(f"Existing top issue: {first_issue.get('issue', '')}")
        if isinstance(quick_fixes, list) and quick_fixes:
            first_fix = quick_fixes[0] if isinstance(quick_fixes[0], dict) else {}
            context.append(f"Existing top quick fix: {first_fix.get('action', '')}")
        context.append(f"Existing branding: status={baseline_branding.get('branding_status', '')}; brand_presence={baseline_branding.get('brand_presence', '')}; target={baseline_branding.get('target_brand_entity', '') or 'none'}; research_needed={baseline_branding.get('research_needed', '')}")

    examples_block = f"\n\n{few_shot_examples}\n" if few_shot_examples else ""
    context_block = "\n".join(f"- {line}" for line in context) if context else "None"
    return f"""
You are revising only the branding / target-buyer layer for an MVP screenshot.

The product/layout report already exists. Keep it as baseline context and focus on the branding judgment:
- Is the site clearly branded or still generic?
- If branded, how strong is the branding?
- Is there a real target buyer/entity?
- If not, explicitly say research is needed.
- Do not invent a vague target.
- Use the web search verification pass when a target entity is named.

Return a single JSON object only with this schema:
{{
  "branding_analysis": {{
    "brand_presence": "strong"|"moderate"|"weak"|"almost_none",
    "branding_status": "branded"|"partial"|"unbranded",
    "brand_quality_score_10": number,
    "branding_work_remaining_10": number,
    "branding_refinement_score_10": number,
    "brand_consistency_notes": string,
    "generic_or_reuse_signals": [string],
    "distinctive_brand_elements": [string],
    "target_brand_entity": string|null,
    "target_brand_reasoning": string,
    "research_needed": boolean,
    "research_prompt": string,
    "white_label_fit": {{
      "rating": "high"|"medium"|"low",
      "reasoning": string
    }}
  }},
  "confidence": number,
  "notes": string
}}

Important:
- Do not rewrite the product/layout assessment unless the branding evidence clearly demands it.
- If the site is clearly tied to a real named organization, keep that entity explicit.
- If the site is generic or only a concept/template, set `target_brand_entity` to null and `research_needed` to true.
- If the brand is real but still rough, `branding_status` can still be `branded` while `branding_work_remaining_10` stays high.
- Use the same concrete, non-generic target rules as the full analysis pass.

Few-shot calibration examples:
{examples_block or "- none available"}

Baseline context:
{context_block}

Metadata:
- file: {record.image_path.name}
- slug: {slug_from_path(record.image_path)}
- url: {record.url or ""}
- title: {record.title or ""}
- source: {record.source or ""}
- warnings: {", ".join(record.warnings) if record.warnings else "none"}
""".strip()


def extract_json_object(text: str) -> dict[str, Any]:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", cleaned, flags=re.S)
        if match:
            return json.loads(match.group(0))
        raise


def call_openrouter(
    api_key: str,
    model: str,
    prompt: str,
    image_data_url: str | None,
    temperature: float,
    max_tokens: int,
    reasoning_effort: str | None = None,
    use_web_search: bool = False,
) -> dict[str, Any]:
    request_model = ensure_online_variant(model) if use_web_search else model
    payload = {
        "model": request_model,
        "response_format": {"type": "json_object"},
        "plugins": ([{"id": "web"}, {"id": "response-healing"}] if use_web_search else [{"id": "response-healing"}]),
        "messages": [
            {
                "role": "system",
                "content": "You are a meticulous visual QA analyst. Output valid JSON only.",
            },
            {"role": "user", "content": [{"type": "text", "text": prompt}] + ([{"type": "image_url", "image_url": {"url": image_data_url}}] if image_data_url else [])},
        ],
        "temperature": temperature,
        "max_completion_tokens": max_tokens,
    }
    if reasoning_effort:
        payload["reasoning"] = {"effort": reasoning_effort}

    request = urllib.request.Request(
        OPENROUTER_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://new-ashtabula-initiative.vercel.app",
            "X-Title": "New Ashtabula Initiative Screenshot QA",
        },
        method="POST",
    )

    with urllib.request.urlopen(request, timeout=180) as response:
        body = response.read().decode("utf-8")

    data = json.loads(body)
    content = data["choices"][0]["message"]["content"]
    if isinstance(content, list):
        content = "".join(part.get("text", "") for part in content if isinstance(part, dict))
    return extract_json_object(content)


def verify_target_brand_with_web(
    api_key: str,
    model: str,
    target_entity: str,
    slug: str,
    title: str | None,
    source_url: str | None,
    quality: str,
    temperature: float,
    max_tokens: int,
) -> dict[str, Any]:
    prompt = f"""
You are verifying whether a proposed target buyer/entity is a real, concrete, externally identifiable organization or business that plausibly matches this MVP.

Use web search to confirm the entity before accepting it. Do not invent a better target. If the candidate is generic, vague, project-like, or unsupported by evidence, reject it and mark the site as needing research.

Return a single JSON object only with this schema:
{{
  "verified": boolean,
  "confidence": number,
  "target_brand_status": "specific"|"needs_research"|"rejected",
  "target_brand_entity": string|null,
  "research_needed": boolean,
  "verification_reasoning": string,
  "evidence": [string],
  "evidence_domains": [string]
}}

Rules:
- A valid target must be a concrete real-world business, organization, institution, or municipality.
- Bare geography or region labels are not valid targets unless the site is explicitly for that government body or institution.
- Reject generic labels, project names, community labels, or product names.
- If you cannot verify the entity, set `target_brand_entity` to null and `research_needed` to true.
- If the entity is verified but the fit is weak or ambiguous, use `needs_research`.
- Keep the result concise and grounded in the web evidence.

Context:
- proposed_target: {target_entity}
- slug: {slug}
- title: {title or ""}
- source_url: {source_url or ""}
""".strip()

    return call_openrouter(
        api_key=api_key,
        model=model,
        prompt=prompt,
        image_data_url=None,
        temperature=temperature,
        max_tokens=max_tokens,
        reasoning_effort=reasoning_effort_for_quality(quality, DEFAULT_VERIFY_REASONING),
        use_web_search=True,
    )


def summarize_results(items: list[dict[str, Any]]) -> dict[str, Any]:
    issue_counter = Counter()
    severity_counter = Counter()
    branding_counter = Counter()
    branding_status_counter = Counter()
    target_status_counter = Counter()
    white_label_counter = Counter()
    shell_like = 0
    branding_pass = 0
    layout_pass = 0
    content_pass = 0
    research_needed = 0

    for item in items:
        issues = item.get("issues", [])
        for issue in issues:
            if isinstance(issue, dict):
                issue_counter[issue.get("category", "unknown")] += 1
                severity_counter[issue.get("severity", "unknown")] += 1

        branding = item.get("branding_analysis", {})
        brand_presence = branding.get("brand_presence")
        if brand_presence:
            branding_counter[brand_presence] += 1
        branding_status = branding.get("branding_status")
        if branding_status:
            branding_status_counter[branding_status] += 1
        target_status = branding.get("target_brand_status")
        if target_status:
            target_status_counter[target_status] += 1
        research_needed += int(bool(branding.get("research_needed")))
        white_label = branding.get("white_label_fit", branding.get("white_label_potential", {}))
        if white_label.get("rating"):
            white_label_counter[white_label["rating"]] += 1

        orchestration = item.get("orchestration_notes", {})
        shell_like += int(bool(orchestration.get("looks_shell_like")))
        branding_pass += int(bool(orchestration.get("needs_branding_pass")))
        layout_pass += int(bool(orchestration.get("needs_layout_pass")))
        content_pass += int(bool(orchestration.get("needs_content_pass")))

    return {
        "issue_counts_by_category": dict(issue_counter.most_common()),
        "issue_counts_by_severity": dict(severity_counter.most_common()),
        "brand_presence_counts": dict(branding_counter.most_common()),
        "branding_status_counts": dict(branding_status_counter.most_common()),
        "target_brand_status_counts": dict(target_status_counter.most_common()),
        "white_label_fit_counts": dict(white_label_counter.most_common()),
        "shell_like_count": shell_like,
        "needs_branding_pass_count": branding_pass,
        "needs_layout_pass_count": layout_pass,
        "needs_content_pass_count": content_pass,
        "research_needed_count": research_needed,
    }


def render_gallery_index(image_dir: Path, report: dict[str, Any]) -> None:
    items = report.get("items", [])
    by_slug: dict[str, dict[str, Any]] = {}
    if isinstance(items, list):
        for item in items:
            if isinstance(item, dict):
                slug = str(item.get("slug") or "").strip()
                if slug:
                    by_slug[slug] = item

    def safe(value: Any, fallback: str = "") -> str:
        if value is None:
            return fallback
        return str(value)

    def summary_chip(label: str, value: Any, tone: str = "") -> str:
        tone_class = f" tone-{tone}" if tone else ""
        return f'<span class="chip{tone_class}"><span>{label}</span><strong>{safe(value)}</strong></span>'

    card_items: list[dict[str, Any]] = []
    allowed = {".png", ".jpg", ".jpeg", ".webp"}
    for image_path in sorted(path for path in image_dir.iterdir() if path.is_file() and path.suffix.lower() in allowed):
        stem = image_path.stem
        slug = stem.split("_", 1)[1] if "_" in stem else stem
        metadata_path = image_dir / f"{stem}.txt"
        metadata = parse_metadata_file(metadata_path)
        analysis = by_slug.get(slug, {})

        overall = analysis.get("overall_assessment", {}) if isinstance(analysis, dict) else {}
        branding = analysis.get("branding_analysis", {}) if isinstance(analysis, dict) else {}
        layout = analysis.get("layout_analysis", {}) if isinstance(analysis, dict) else {}
        orchestration = analysis.get("orchestration_notes", {}) if isinstance(analysis, dict) else {}
        quick_fixes = analysis.get("quick_fixes", []) if isinstance(analysis, dict) else []
        first_fix = ""
        target_brand_entity = None
        target_brand_reasoning = ""
        research_needed = False
        target_verification: dict[str, Any] = {}
        brand_quality_score = ""
        branding_work_remaining = ""
        first_issue = ""
        if isinstance(quick_fixes, list) and quick_fixes:
            first = quick_fixes[0] if isinstance(quick_fixes[0], dict) else {}
            first_fix = safe(first.get("action"))

        warnings = [w.strip() for w in metadata.get("warnings", "").split(",") if w.strip() and w.strip() != "none"]
        warning_html = "".join(f'<span class="warning">{escape(w)}</span>' for w in warnings)
        design_score = overall.get("design_score_10", 0) if isinstance(overall.get("design_score_10", 0), (int, float)) else 0
        brand_presence = safe(branding.get("brand_presence"))
        branding_status = safe(branding.get("branding_status") or ("branded" if brand_presence == "strong" else ("unbranded" if brand_presence in {"weak", "almost_none"} else "partial")))
        deep_help = bool(
            design_score < 5
            or overall.get("status") in {"poor", "broken"}
            or brand_presence in {"weak", "almost_none"}
            or bool(orchestration.get("looks_shell_like"))
            or bool(orchestration.get("needs_branding_pass"))
            or bool(orchestration.get("needs_layout_pass"))
        )
        generic_or_underbranded = branding_status in {"partial", "unbranded"}
        analysis_html = ""
        if analysis:
            aesthetic = analysis.get("aesthetic_analysis", {}) if isinstance(analysis, dict) else {}
            issues = analysis.get("issues", []) if isinstance(analysis, dict) else []
            quick_fixes = analysis.get("quick_fixes", []) if isinstance(analysis, dict) else []
            branding_status = safe(
                branding.get("branding_status")
                or (
                    "branded"
                    if branding.get("brand_presence") == "strong"
                    else "unbranded" if branding.get("brand_presence") in {"weak", "almost_none"} else "partial"
                )
            )
            target_brand_entity = safe(branding.get("target_brand_entity"))
            target_brand_reasoning = safe(branding.get("target_brand_reasoning"))
            research_needed = bool(branding.get("research_needed"))
            target_verification = branding.get("target_brand_verification", {})
            brand_quality_score = safe(branding.get("brand_quality_score_10") or overall.get("branding_score_10"))
            branding_work_remaining = safe(branding.get("branding_work_remaining_10"))
            if isinstance(issues, list) and issues:
                issue = issues[0] if isinstance(issues[0], dict) else {}
                first_issue = safe(issue.get("issue"))
            issue_rows = []
            if isinstance(issues, list):
                for issue in issues[:3]:
                    if not isinstance(issue, dict):
                        continue
                    issue_rows.append(
                        f"""
                        <div class="item-row">
                          <span>{escape(safe(issue.get('severity')))} · {escape(safe(issue.get('category')))}</span>
                          <strong>{escape(safe(issue.get('issue')))}</strong>
                          <em>{escape(safe(issue.get('quick_fix')))}</em>
                        </div>
                        """
                    )
            quick_fix_rows = []
            if isinstance(quick_fixes, list):
                for fix in quick_fixes[:3]:
                    if not isinstance(fix, dict):
                        continue
                    quick_fix_rows.append(
                        f"""
                        <div class="item-row">
                          <span>Priority {escape(safe(fix.get('priority')))} · {escape(safe(fix.get('impact')))} impact</span>
                          <strong>{escape(safe(fix.get('action')))}</strong>
                          <em>{escape(safe(fix.get('why')))}</em>
                        </div>
                        """
                    )
            analysis_html = f"""
              <div class="analysis-grid">
                <div><span>Status</span><strong>{escape(safe(overall.get('status')))}</strong></div>
                <div><span>Design</span><strong>{escape(safe(overall.get('design_score_10')))}</strong></div>
                <div><span>Brand</span><strong>{escape(safe(branding.get('brand_presence')))}</strong></div>
                <div><span>Layout</span><strong>{escape(safe(layout.get('center_alignment')))}</strong></div>
                <div><span>WL fit</span><strong>{escape(safe(overall.get('white_label_fit_10')))}</strong></div>
                <div><span>Fix</span><strong>{escape(first_fix or 'None')}</strong></div>
              </div>
              <div class="analysis-summary">
                <div><span>Brand status</span><strong>{escape(branding_status)}</strong></div>
                <div><span>Brand quality</span><strong>{escape(brand_quality_score)}</strong></div>
                <div><span>Brand work remaining</span><strong>{escape(branding_work_remaining)}</strong></div>
                <div><span>Target brand entity</span><strong>{escape(target_brand_entity or 'unassigned')}</strong></div>
                <div><span>Research needed</span><strong>{escape(safe(research_needed))}</strong></div>
                <div><span>First impression</span><strong>{escape(safe(overall.get('first_impression')))}</strong></div>
                <div><span>Executive summary</span><strong>{escape(safe(overall.get('executive_summary')))}</strong></div>
                <div><span>Brand notes</span><strong>{escape(safe(branding.get('brand_consistency_notes')))}</strong></div>
                <div><span>Layout notes</span><strong>{escape(safe(layout.get('alignment_notes')))}</strong></div>
                <div><span>Spacing</span><strong>{escape(safe(layout.get('spacing_notes')))}</strong></div>
                <div><span>Hierarchy</span><strong>{escape(safe(layout.get('visual_hierarchy_notes')))}</strong></div>
                <div><span>Aesthetic</span><strong>{escape(safe(aesthetic.get('polish_notes')))}</strong></div>
                <div><span>Trust</span><strong>{escape(safe(aesthetic.get('trust_signal_notes')))}</strong></div>
              </div>
              <details class="json-details">
                <summary>Deep analysis</summary>
                <div class="detail-row"><span>First issue</span><strong>{escape(first_issue or 'None')}</strong></div>
                <div class="detail-row"><span>Branding status</span><strong>{escape(branding_status)}</strong></div>
                <div class="detail-row"><span>Target brand entity</span><strong>{escape(target_brand_entity or 'None')}</strong></div>
                <div class="detail-row"><span>Target brand reasoning</span><strong>{escape(target_brand_reasoning or 'None')}</strong></div>
                <div class="detail-row"><span>Research needed</span><strong>{escape(safe(research_needed))}</strong></div>
                <div class="detail-row"><span>Research prompt</span><strong>{escape(safe(branding.get('research_prompt')))}</strong></div>
                <div class="detail-row"><span>Brand work remaining</span><strong>{escape(branding_work_remaining)}</strong></div>
                <div class="detail-row"><span>Target verification</span><strong>{escape(safe(target_verification.get('verified') if isinstance(target_verification, dict) else ''))}</strong></div>
                <div class="detail-row"><span>Verification confidence</span><strong>{escape(safe(target_verification.get('confidence') if isinstance(target_verification, dict) else ''))}</strong></div>
                <div class="detail-row"><span>Verification evidence</span><strong>{escape(', '.join(target_verification.get('evidence_domains', [])[:4]) if isinstance(target_verification, dict) and isinstance(target_verification.get('evidence_domains', []), list) else '')}</strong></div>
                <div class="detail-row"><span>White-label fit</span><strong>{escape(safe(branding.get('white_label_fit', {}).get('rating') if isinstance(branding.get('white_label_fit', {}), dict) else ''))}</strong></div>
                <div class="detail-row"><span>White-label reasoning</span><strong>{escape(safe(branding.get('white_label_fit', {}).get('reasoning') if isinstance(branding.get('white_label_fit', {}), dict) else ''))}</strong></div>
                <div class="detail-row"><span>Generic signals</span><strong>{escape(', '.join(branding.get('generic_or_reuse_signals', [])[:4]) if isinstance(branding.get('generic_or_reuse_signals', []), list) else '')}</strong></div>
                <div class="detail-row"><span>Distinctive brand elements</span><strong>{escape(', '.join(branding.get('distinctive_brand_elements', [])[:4]) if isinstance(branding.get('distinctive_brand_elements', []), list) else '')}</strong></div>
                <div class="detail-row"><span>Content density</span><strong>{escape(safe(layout.get('content_density')))}</strong></div>
                <div class="detail-row"><span>Needs branding</span><strong>{escape(safe(orchestration.get('needs_branding_pass')))}</strong></div>
                <div class="detail-row"><span>Needs layout</span><strong>{escape(safe(orchestration.get('needs_layout_pass')))}</strong></div>
                <div class="detail-row"><span>Needs content</span><strong>{escape(safe(orchestration.get('needs_content_pass')))}</strong></div>
                <div class="detail-row"><span>Likely next actions</span><strong>{escape(', '.join(orchestration.get('likely_next_dev_actions', [])[:4]) if isinstance(orchestration.get('likely_next_dev_actions', []), list) else '')}</strong></div>
              </details>
              <details class="json-details">
                <summary>Issues and quick fixes</summary>
                <div class="mini-stack">
                  <div class="mini-stack-title">Top issues</div>
                  {''.join(issue_rows) if issue_rows else '<div class="analysis-empty">No structured issues recorded.</div>'}
                </div>
                <div class="mini-stack">
                  <div class="mini-stack-title">Top quick fixes</div>
                  {''.join(quick_fix_rows) if quick_fix_rows else '<div class="analysis-empty">No structured quick fixes recorded.</div>'}
                </div>
              </details>
            """
        else:
            analysis_html = '<div class="analysis-empty">No JSON analysis available yet.</div>'

        card_items.append(
            {
                "slug": slug,
                "design_score": design_score,
                "brand_presence": brand_presence,
                "branding_status": branding_status,
                "target_brand_status": safe(branding.get("target_brand_status")),
                "target_brand_entity": target_brand_entity,
                "research_needed": research_needed,
                "status": safe(overall.get("status")),
                "white_label_fit": safe(overall.get("white_label_fit_10")),
                "deep_help": deep_help,
                "generic_or_underbranded": generic_or_underbranded,
                "analysis_html": analysis_html,
                "warning_html": warning_html,
                "title": metadata.get("title") or "Untitled",
                "source": metadata.get("source") or "local",
                "body_chars": metadata.get("body_chars") or "0",
                "first_fix": first_fix,
                "image_name": image_path.name,
            }
        )

    def render_card(item: dict[str, Any]) -> str:
        status = safe(item.get("status"))
        design = safe(item.get("design_score"))
        brand_presence_local = safe(item.get("brand_presence"))
        branding_status_local = safe(item.get("branding_status"))
        target_brand_status_local = safe(item.get("target_brand_status"))
        target_brand_entity_local = safe(item.get("target_brand_entity"))
        research_needed_local = bool(item.get("research_needed"))
        white_label_fit = safe(item.get("white_label_fit"))
        first_fix_local = safe(item.get("first_fix"))
        deep_help_class = " deep-help" if item.get("deep_help") else ""
        generic_class = " generic" if item.get("generic_or_underbranded") else ""
        badge = '<span class="status tone-deep">deep help</span>' if item.get("deep_help") else f'<span class="status">{escape(status)}</span>'
        return f"""
            <a class="card{deep_help_class}{generic_class}" href="{escape(item.get('image_name', ''))}" target="_blank" rel="noreferrer"
               data-slug="{escape(item.get('slug', ''))}"
                data-design="{escape(design)}"
                data-brand="{escape(brand_presence_local)}"
               data-branding-status="{escape(branding_status_local)}"
               data-target-status="{escape(target_brand_status_local)}"
               data-target-entity="{escape(target_brand_entity_local)}"
               data-research-needed="{str(research_needed_local).lower()}"
                data-status="{escape(status)}"
                data-white-label="{escape(white_label_fit)}"
                data-deep-help="{str(bool(item.get('deep_help'))).lower()}"
               data-generic="{str(bool(item.get('generic_or_underbranded'))).lower()}"
               data-title="{escape(safe(item.get('title')))}">
              <img src="{escape(item.get('image_name', ''))}" alt="{escape(item.get('slug', ''))} screenshot" loading="lazy" />
              <div class="meta">
                <div class="headline">
                  <strong>{escape(item.get('slug', ''))}</strong>
                  {badge}
                </div>
                <span class="title">{escape(safe(item.get('title')))}</span>
                <div class="stats">
                  <span>{escape(safe(item.get('source')))} · {escape(safe(item.get('body_chars')))} chars</span>
                  <span>Design {escape(design)}</span>
                  <span>Brand {escape(brand_presence_local)}</span>
                  <span>B-Status {escape(branding_status_local)}</span>
                  <span>WL {escape(white_label_fit)}</span>
                  <span>Target {escape(target_brand_entity_local or ('research' if research_needed_local else 'unassigned'))}</span>
                </div>
                {f'<div class="mini-fix">{escape(first_fix_local)}</div>' if first_fix_local else ''}
                <div class="warnings">{item.get('warning_html','')}</div>
                {item.get('analysis_html','')}
              </div>
            </a>
        """

    deep_help_items = sorted((item for item in card_items if item.get("deep_help")), key=lambda item: (
        item.get("design_score", 0),
        0 if item.get("brand_presence") in {"almost_none", "weak"} else 1,
        item.get("slug", ""),
    ))
    all_items = sorted(card_items, key=lambda item: (
        -float(item.get("design_score", 0) or 0),
        -1 if item.get("brand_presence") == "strong" else 0,
        item.get("slug", ""),
    ))
    counts = {
        "all": len(card_items),
        "deep": len(deep_help_items),
        "branded": sum(1 for item in card_items if item.get("branding_status") == "branded" and float(item.get("design_score", 0) or 0) >= 7),
        "generic": sum(1 for item in card_items if item.get("branding_status") in {"partial", "unbranded"}),
        "hard": sum(1 for item in card_items if float(item.get("design_score", 0) or 0) < 5),
        "polish": sum(1 for item in card_items if 5 <= float(item.get("design_score", 0) or 0) <= 6),
    }
    deep_help_cards = "".join(render_card(item) for item in deep_help_items)
    all_cards = "".join(render_card(item) for item in all_items)

    summary_obj = report.get("summary", {}) if isinstance(report, dict) else {}
    html = f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>NAI Sitemap Screenshots</title>
    <style>
      :root {{
        color-scheme: dark;
        --bg: #0b1020;
        --panel: #11182b;
        --panel-2: #18213a;
        --text: #e5eefc;
        --muted: #9fb0ce;
        --accent: #8dd3ff;
        --warn: #ffd38d;
      }}
      * {{ box-sizing: border-box; }}
      body {{
        margin: 0;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        background: radial-gradient(circle at top, #152447 0, var(--bg) 45%);
        color: var(--text);
      }}
      header {{ padding: 24px 20px 12px; max-width: 1440px; margin: 0 auto; }}
      h1 {{ margin: 0 0 8px; font-size: clamp(1.5rem, 2.2vw, 2.4rem); }}
      p {{ margin: 0; color: var(--muted); line-height: 1.45; }}
      .summary {{ display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }}
      .chip {{ display: inline-flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 999px; background: rgba(141, 211, 255, 0.08); border: 1px solid rgba(141, 211, 255, 0.14); font-size: 12px; }}
      .chip strong {{ color: var(--text); }}
      .chip.tone-warn {{ background: rgba(255, 211, 141, 0.08); border-color: rgba(255, 211, 141, 0.16); }}
      .controls {{ max-width: 1440px; margin: 0 auto; padding: 0 16px 10px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }}
      .controls button, .controls select {{ color: var(--text); border: 1px solid rgba(141, 211, 255, 0.18); border-radius: 999px; padding: 8px 11px; font: inherit; font-size: 12px; }}
      .controls button {{ display: inline-flex; flex-direction: column; align-items: flex-start; gap: 2px; min-width: 122px; background: rgba(141, 211, 255, 0.1); }}
      .controls button span {{ font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.82; }}
      .controls button strong {{ font-size: 14px; line-height: 1; }}
      .controls button.active {{ transform: translateY(-1px); box-shadow: 0 0 0 1px rgba(141, 211, 255, 0.16), 0 10px 18px rgba(0, 0, 0, 0.16); }}
      .controls button[data-filter="all"] {{ background: rgba(141, 211, 255, 0.12); }}
      .controls button[data-filter="deep"] {{ background: rgba(255, 131, 131, 0.12); border-color: rgba(255, 131, 131, 0.24); }}
      .controls button[data-filter="branded"] {{ background: rgba(131, 255, 189, 0.12); border-color: rgba(131, 255, 189, 0.22); }}
      .controls button[data-filter="generic"] {{ background: rgba(255, 211, 141, 0.12); border-color: rgba(255, 211, 141, 0.22); }}
      .controls button[data-filter="hard"] {{ background: rgba(255, 154, 154, 0.12); border-color: rgba(255, 154, 154, 0.24); }}
      .controls button[data-filter="polish"] {{ background: rgba(173, 198, 255, 0.12); border-color: rgba(173, 198, 255, 0.22); }}
      .controls button.active[data-filter="all"] {{ background: rgba(141, 211, 255, 0.28); }}
      .controls button.active[data-filter="deep"] {{ background: rgba(255, 131, 131, 0.24); }}
      .controls button.active[data-filter="branded"] {{ background: rgba(131, 255, 189, 0.24); }}
      .controls button.active[data-filter="generic"] {{ background: rgba(255, 211, 141, 0.24); }}
      .controls button.active[data-filter="hard"] {{ background: rgba(255, 154, 154, 0.24); }}
      .controls button.active[data-filter="polish"] {{ background: rgba(173, 198, 255, 0.24); }}
      .controls .counter {{ margin-left: auto; color: var(--muted); font-size: 12px; }}
      .section {{ max-width: 1440px; margin: 0 auto; padding: 6px 16px 0; }}
      .section h2 {{ margin: 18px 0 6px; font-size: 1rem; }}
      .section p {{ margin: 0 0 10px; color: var(--muted); font-size: 12px; }}
      .grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 10px; }}
      .focus-panel {{ max-width: 1440px; margin: 0 auto; padding: 6px 16px 4px; }}
      .focus-panel h2 {{ margin: 18px 0 6px; font-size: 1rem; }}
      .focus-panel p {{ margin: 0 0 10px; color: var(--muted); font-size: 12px; }}
      .focus-panel .grid {{ grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); }}
      .focus-panel[hidden] {{ display: none !important; }}
      .card {{ display: block; text-decoration: none; color: inherit; background: linear-gradient(180deg, var(--panel), var(--panel-2)); border: 1px solid rgba(141, 211, 255, 0.12); border-radius: 14px; overflow: hidden; box-shadow: 0 10px 28px rgba(0, 0, 0, 0.22); }}
      .card.deep-help {{ border-color: rgba(255, 131, 131, 0.36); box-shadow: 0 12px 30px rgba(255, 131, 131, 0.08); }}
      .card.generic {{ border-color: rgba(255, 211, 141, 0.18); }}
      .card img {{ width: 100%; aspect-ratio: 16 / 9; object-fit: cover; display: block; background: #0c1222; }}
      .meta {{ padding: 10px 10px 12px; }}
      .headline {{ display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 4px; }}
      .meta strong {{ display: block; font-size: 0.92rem; line-height: 1.25; }}
      .title {{ display: block; color: var(--muted); line-height: 1.35; font-size: 12px; margin-bottom: 8px; }}
      .status {{ flex: 0 0 auto; padding: 3px 7px; border-radius: 999px; background: rgba(141, 211, 255, 0.12); color: var(--accent); font-size: 10px; text-transform: uppercase; letter-spacing: 0.04em; }}
      .status.tone-deep {{ background: rgba(255, 131, 131, 0.14); color: #ffb2b2; }}
      .stats {{ display: flex; flex-wrap: wrap; gap: 4px 8px; color: var(--muted); font-size: 11px; line-height: 1.35; margin-bottom: 8px; }}
      .stats span {{ padding: 2px 0; }}
      .mini-fix {{ font-size: 11px; color: #d8e8ff; line-height: 1.35; margin-bottom: 8px; }}
      .analysis-grid {{ display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px 10px; font-size: 11px; color: var(--muted); margin-top: 8px; }}
      .analysis-grid div, .detail-row {{ display: flex; flex-direction: column; gap: 2px; }}
      .analysis-grid span, .detail-row span {{ font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: #8ea0c5; }}
      .analysis-grid strong, .detail-row strong {{ color: var(--text); font-size: 11px; line-height: 1.35; }}
      .analysis-summary {{ display: grid; grid-template-columns: 1fr; gap: 6px; margin-top: 8px; }}
      .analysis-summary > div {{ display: flex; flex-direction: column; gap: 2px; }}
      .analysis-summary span {{ font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: #8ea0c5; }}
      .analysis-summary strong {{ color: var(--text); font-size: 11px; line-height: 1.35; }}
      .warnings {{ display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }}
      .warning {{ display: inline-block; padding: 3px 7px; border-radius: 999px; background: rgba(255, 211, 141, 0.12); color: var(--warn); font-size: 10px; }}
      .json-details {{ margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.08); }}
      .json-details summary {{ cursor: pointer; color: var(--accent); font-size: 11px; list-style: none; }}
      .json-details summary::-webkit-details-marker {{ display: none; }}
      .json-details > div {{ margin-top: 6px; }}
      .mini-stack {{ margin-top: 8px; padding: 8px; border-radius: 10px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); }}
      .mini-stack-title {{ font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: #8ea0c5; margin-bottom: 6px; }}
      .item-row {{ display: flex; flex-direction: column; gap: 3px; padding: 6px 0; border-top: 1px solid rgba(255, 255, 255, 0.06); }}
      .item-row:first-child {{ border-top: 0; padding-top: 0; }}
      .item-row span {{ font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: #8ea0c5; }}
      .item-row strong {{ font-size: 11px; color: var(--text); line-height: 1.35; }}
      .item-row em {{ font-size: 11px; color: var(--muted); line-height: 1.35; font-style: normal; }}
      .analysis-empty {{ margin-top: 8px; font-size: 11px; color: var(--muted); }}
      body.focus-mode .analysis-summary,
      body.focus-mode .json-details,
      body.focus-mode .warnings,
      body.focus-mode .mini-fix {{ display: none !important; }}
      body.focus-mode .card .meta {{ padding-bottom: 10px; }}
      body.focus-mode .card {{ box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18); }}
      footer {{ max-width: 1440px; margin: 0 auto; padding: 0 20px 32px; color: var(--muted); font-size: 12px; }}
      code {{ color: var(--accent); }}
    </style>
  </head>
  <body>
    <header>
      <h1>NAI Sitemap Screenshots</h1>
      <p>{len(card_items)} captures generated by <code>./nai analyze-screenshots</code>.</p>
      <div class="summary">
        <span class="chip tone-warn"><span>Issues</span><strong>{sum(summary_obj.get('issue_counts_by_category', {}).values()) if isinstance(summary_obj.get('issue_counts_by_category', {}), dict) else 0}</strong></span>
        <span class="chip"><span>Deep help</span><strong>{len(deep_help_items)}</strong></span>
        <span class="chip"><span>Shell-like</span><strong>{summary_obj.get('shell_like_count', 0)}</strong></span>
        <span class="chip"><span>Brand pass</span><strong>{summary_obj.get('needs_branding_pass_count', 0)}</strong></span>
        <span class="chip"><span>Layout pass</span><strong>{summary_obj.get('needs_layout_pass_count', 0)}</strong></span>
        <span class="chip"><span>Content pass</span><strong>{summary_obj.get('needs_content_pass_count', 0)}</strong></span>
        <span class="chip"><span>Research needed</span><strong>{summary_obj.get('research_needed_count', 0)}</strong></span>
      </div>
    </header>
    <div class="controls">
      <button type="button" class="active" data-filter="all"><span>All</span><strong>{counts['all']}</strong></button>
      <button type="button" data-filter="deep"><span>Deep help</span><strong>{counts['deep']}</strong></button>
      <button type="button" data-filter="branded"><span>Branded</span><strong>{counts['branded']}</strong></button>
      <button type="button" data-filter="generic"><span>Generic</span><strong>{counts['generic']}</strong></button>
      <button type="button" data-filter="hard"><span>Hard fix</span><strong>{counts['hard']}</strong></button>
      <button type="button" data-filter="polish"><span>Polish</span><strong>{counts['polish']}</strong></button>
      <select id="sort-select" aria-label="Sort gallery">
        <option value="design-desc">Sort: Design high to low</option>
        <option value="design-asc">Sort: Design low to high</option>
        <option value="brand-desc">Sort: Brand high to low</option>
        <option value="brand-asc">Sort: Brand low to high</option>
        <option value="slug-asc">Sort: Slug A-Z</option>
      </select>
      <span id="filter-status" class="counter"></span>
    </div>
    <section class="focus-panel" data-focus-panel hidden>
      <h2 id="focus-title">Focused Results</h2>
      <p id="focus-desc">Choose a filter to populate this results lane.</p>
      <main class="grid" data-focus-grid></main>
    </section>
    <section class="section" data-gallery-section="all" data-section-kind="all">
      <h2>All Sites</h2>
      <p>Full gallery with deeper analysis embedded in each card.</p>
      <main class="grid" data-gallery-grid="all-sites">
        {all_cards}
      </main>
    </section>
    <script>
      const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
      const sortSelect = document.getElementById('sort-select');
      const filterStatus = document.getElementById('filter-status');
      const focusPanel = document.querySelector('[data-focus-panel]');
      const focusTitle = document.getElementById('focus-title');
      const focusDesc = document.getElementById('focus-desc');
      const focusGrid = document.querySelector('[data-focus-grid]');
      const allSection = document.querySelector('[data-section-kind="all"]');
      const catalogCards = Array.from(allSection.querySelectorAll('.card'));

      function getCardValue(card, key) {{
        const raw = card.dataset[key];
        if (raw === undefined) return '';
        const num = Number(raw);
        return Number.isFinite(num) ? num : raw;
      }}

      function sortCards(grid, mode) {{
        const cards = Array.from(grid.querySelectorAll('.card'));
        cards.sort((a, b) => {{
          const da = Number(getCardValue(a, 'design') || 0);
          const db = Number(getCardValue(b, 'design') || 0);
          const ba = (getCardValue(a, 'brand') || '').toString();
          const bb = (getCardValue(b, 'brand') || '').toString();
          const sa = (getCardValue(a, 'slug') || '').toString();
          const sb = (getCardValue(b, 'slug') || '').toString();
          switch (mode) {{
            case 'design-asc':
              return da - db || sa.localeCompare(sb);
            case 'design-desc':
              return db - da || sa.localeCompare(sb);
            case 'brand-asc':
              return ba.localeCompare(bb) || sa.localeCompare(sb);
            case 'brand-desc':
              return bb.localeCompare(ba) || sa.localeCompare(sb);
            case 'slug-asc':
            default:
              return sa.localeCompare(sb);
          }}
        }});
        cards.forEach(card => grid.appendChild(card));
      }}

      function matchesFilter(card, filter) {{
        const deep = card.dataset.deepHelp === 'true';
        const generic = card.dataset.generic === 'true';
        const brandStatus = card.dataset.brandingStatus || '';
        const targetStatus = card.dataset.targetStatus || '';
        const targetEntity = card.dataset.targetEntity || '';
        const researchNeeded = card.dataset.researchNeeded === 'true';
        const design = Number(card.dataset.design || 0);
        const status = (card.dataset.status || '').toLowerCase();
        if (filter === 'all') return true;
        if (filter === 'deep') return deep;
        if (filter === 'branded') {{
          return brandStatus === 'branded'
            && !generic
            && design >= 7
            && status !== 'broken'
            && (
              targetStatus === 'specific'
              || researchNeeded === false
              || Boolean(targetEntity)
            );
        }}
        if (filter === 'generic') return generic || brandStatus !== 'branded';
        if (filter === 'hard') return design < 5 || status === 'poor' || status === 'broken';
        if (filter === 'polish') return design >= 5 && design <= 6;
        return true;
      }}

      function applyFilter(filter) {{
        const visibleCards = catalogCards.filter(card => matchesFilter(card, filter));
        const focused = filter !== 'all';
        document.body.classList.toggle('focus-mode', focused);
        if (focusPanel) {{
          focusPanel.hidden = !focused;
        }}
        if (allSection) {{
          allSection.hidden = focused;
        }}
        if (focusGrid) {{
          focusGrid.innerHTML = '';
          visibleCards.forEach(card => focusGrid.appendChild(card.cloneNode(true)));
          applySort(sortSelect.value);
        }}
        if (focusTitle && focusDesc) {{
          const labels = {{
            all: ['All Sites', 'Browse the full portfolio with the current sort order.'],
            deep: ['Needs Deep Help', 'High-priority rescue lane for the sites that need real design, layout, or code attention.'],
            branded: ['Branded-Ready', 'Sites that already look strong and mostly need verification or small refinements.'],
            generic: ['Generic / Underbranded', 'Candidates for productization, lead research, or stronger branding work.'],
            hard: ['Hard Fix', 'The most broken or low-design sites that need code/layout rescue first.'],
            polish: ['Polish', 'Mostly functional sites that need cleanup, content, or configuration fixes.'],
          }};
          const value = labels[filter] || labels.all;
          focusTitle.textContent = value[0];
          focusDesc.textContent = `${{value[1]}} Showing ${{visibleCards.length}} matching card(s).`;
        }}
        if (filterStatus) {{
          filterStatus.textContent = focused ? `${{visibleCards.length}} focused / ${{catalogCards.length}} total` : `${{catalogCards.length}} total`;
        }}
        if (focused && focusPanel) {{
          focusPanel.scrollIntoView({{ behavior: 'smooth', block: 'start' }});
        }}
      }}

      function applySort(mode) {{
        if (focusGrid && !focusPanel.hidden) {{
          sortCards(focusGrid, mode);
        }}
        if (allSection) {{
          const grid = allSection.querySelector('[data-gallery-grid]');
          if (grid) sortCards(grid, mode);
        }}
      }}

      filterButtons.forEach(button => {{
        button.addEventListener('click', () => {{
          filterButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          applyFilter(button.dataset.filter || 'all');
        }});
      }});

      sortSelect.addEventListener('change', () => applySort(sortSelect.value));

      applySort(sortSelect.value);
      applyFilter('all');
    </script>
    <footer>
      Generated from <code>visual_analysis_report.json</code>.
    </footer>
  </body>
</html>
"""
    GALLERY_FILE.write_text(html)


def archive_analysis_artifacts(output_path: Path, report: dict[str, Any], image_dir: Path) -> Path | None:
    archive_root = image_dir.parent / f".{image_dir.name}_analysis_archive"
    archive_root.mkdir(parents=True, exist_ok=True)

    timestamp = dt.datetime.now(dt.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    archive_dir = archive_root / timestamp
    suffix = 1
    while archive_dir.exists():
        archive_dir = archive_root / f"{timestamp}-{suffix}"
        suffix += 1
    archive_dir.mkdir(parents=True, exist_ok=True)

    manifest = {
        "archived_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "generated_at": report.get("generated_at"),
        "image_dir": report.get("image_dir"),
        "output_file": report.get("output_file"),
        "model": report.get("model"),
        "quality": report.get("quality"),
        "selected_slugs": report.get("selected_slugs"),
        "item_count": report.get("item_count"),
        "summary": report.get("summary", {}),
        "artifacts": [],
    }

    if output_path.exists():
        archived_output = archive_dir / output_path.name
        archived_output.write_text(output_path.read_text())
        manifest["artifacts"].append(archived_output.name)

    if GALLERY_FILE.exists():
        archived_gallery = archive_dir / GALLERY_FILE.name
        archived_gallery.write_text(GALLERY_FILE.read_text())
        manifest["artifacts"].append(archived_gallery.name)

    manifest_path = archive_dir / "manifest.json"
    manifest["artifacts"].append(manifest_path.name)
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False))
    return archive_dir


def main() -> int:
    parser = argparse.ArgumentParser(description="Analyze sitemap screenshots with a vision model and write a JSON report.")
    parser.add_argument("--image-dir", type=Path, default=DEFAULT_IMAGE_DIR, help="directory containing screenshot images")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT, help="path to write the JSON report")
    parser.add_argument("--model", default=None, help="OpenRouter model id to use explicitly")
    parser.add_argument(
        "--quality",
        choices=["fast", "deep"],
        default="fast",
        help="model preset to use when --model is not set",
    )
    parser.add_argument(
        "--slugs",
        nargs="*",
        default=None,
        help="optional list of site slugs to analyze instead of the full gallery",
    )
    parser.add_argument(
        "--slugs-file",
        type=Path,
        default=None,
        help="path to a newline-delimited list of slugs to analyze",
    )
    parser.add_argument("--limit", type=int, default=None, help="optional limit for testing")
    parser.add_argument("--temperature", type=float, default=0.2, help="sampling temperature")
    parser.add_argument("--max-tokens", type=int, default=2200, help="maximum completion tokens per image")
    parser.add_argument("--sleep", type=float, default=0.0, help="seconds to sleep between requests")
    parser.add_argument("--focus", action=argparse.BooleanOptionalAction, default=False, help="use few-shot calibration examples when the analysis is targeting a narrow branding question")
    parser.add_argument("--branding-only", action=argparse.BooleanOptionalAction, default=False, help="only revise branding/target fields and merge them into the existing report")
    parser.add_argument("--verify-targets", action=argparse.BooleanOptionalAction, default=True, help="use web search to verify candidate target entities")
    parser.add_argument("--api-key-env", default="OPENROUTER_API_KEY", help="environment variable that stores the OpenRouter key")
    args = parser.parse_args()

    load_dotenv()
    api_key = os.getenv(args.api_key_env)
    if not api_key:
        print(f"Missing API key. Set {args.api_key_env} first.", file=sys.stderr)
        return 1

    if not args.image_dir.exists():
        print(f"Image directory not found: {args.image_dir}", file=sys.stderr)
        return 1

    model = args.model
    if not model:
        model = DEFAULT_DEEP_MODEL if args.quality == "deep" else DEFAULT_FAST_MODEL

    selected_slugs: set[str] | None = None
    if args.slugs_file is not None:
        if not args.slugs_file.exists():
            print(f"Slug file not found: {args.slugs_file}", file=sys.stderr)
            return 1
        selected_slugs = {line.strip() for line in args.slugs_file.read_text().splitlines() if line.strip() and not line.strip().startswith("#")}
    if args.slugs is not None:
        selected_slugs = set(args.slugs) if selected_slugs is None else selected_slugs | set(args.slugs)

    records = collect_screenshots(args.image_dir, args.limit, set(load_public_slugs()), selected_slugs)
    if not records:
        print(f"No screenshots found in {args.image_dir}", file=sys.stderr)
        return 1

    few_shot_examples = ""
    baseline_report: dict[str, Any] = {}
    baseline_by_slug: dict[str, dict[str, Any]] = {}
    if (args.focus or args.branding_only) and args.output.exists():
        try:
            baseline_report = json.loads(args.output.read_text())
            prior_items = baseline_report.get("items", [])
            if isinstance(prior_items, list):
                for item in prior_items:
                    if isinstance(item, dict):
                        slug = str(item.get("slug") or "").strip()
                        if slug:
                            baseline_by_slug[slug] = item
                if args.focus:
                    few_shot_examples = build_few_shot_examples(baseline_by_slug)
        except (OSError, json.JSONDecodeError, ValueError):
            few_shot_examples = ""
            baseline_report = {}
            baseline_by_slug = {}

    prepare_analysis_output(args.output)
    if args.branding_only and args.max_tokens < 3000:
        args.max_tokens = 3000
    if args.focus and args.max_tokens < 2600:
        args.max_tokens = 2600
    report: dict[str, Any] = {
        "generated_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "image_dir": str(args.image_dir.resolve()),
        "output_file": str(args.output.resolve()),
        "model": model,
        "quality": args.quality if not args.model else "custom",
        "selected_slugs": sorted(selected_slugs) if selected_slugs else None,
        "temperature": args.temperature,
        "max_tokens": args.max_tokens,
        "item_count": len(records),
        "items": [],
        "summary": {},
    }
    if baseline_report and (args.focus or args.branding_only):
        report = baseline_report
        if not isinstance(report.get("items"), list):
            report["items"] = []
        report["generated_at"] = dt.datetime.now(dt.timezone.utc).isoformat()
        report["image_dir"] = str(args.image_dir.resolve())
        report["output_file"] = str(args.output.resolve())
        report["model"] = model
        report["quality"] = args.quality if not args.model else "custom"
        report["selected_slugs"] = sorted(selected_slugs) if selected_slugs else None
        report["temperature"] = args.temperature
        report["max_tokens"] = args.max_tokens
        report["item_count"] = len(report["items"])

    report_items_by_slug: dict[str, dict[str, Any]] = {}
    if isinstance(report.get("items"), list):
        for item in report["items"]:
            if isinstance(item, dict):
                slug = str(item.get("slug") or "").strip()
                if slug:
                    report_items_by_slug[slug] = item

    for index, record in enumerate(records, start=1):
        print(f"[{index}/{len(records)}] Analyzing {record.image_path.name}")
        image_data_url, _ = image_to_data_url(record.image_path)
        prompt = build_branding_prompt(record, baseline_by_slug.get(slug_from_path(record.image_path)) if args.branding_only else None, few_shot_examples if args.focus else None) if args.branding_only else build_prompt(record, few_shot_examples if args.focus else None)

        if args.branding_only and baseline_by_slug.get(slug_from_path(record.image_path)):
            analysis = dict(baseline_by_slug[slug_from_path(record.image_path)])
            analysis["branding_analysis"] = {}
        else:
            try:
                analysis = call_openrouter(
                    api_key=api_key,
                    model=model,
                    prompt=prompt,
                    image_data_url=image_data_url,
                    temperature=args.temperature,
                    max_tokens=args.max_tokens,
                    reasoning_effort=reasoning_effort_for_quality(args.quality),
                )
            except (urllib.error.URLError, urllib.error.HTTPError, json.JSONDecodeError, KeyError, ValueError) as exc:
                analysis = {
                    "screenshot_file": record.image_path.name,
                    "slug": slug_from_path(record.image_path),
                    "source_url": record.url,
                    "source_title": record.title,
                    "source_type": record.source,
                    "overall_assessment": {
                        "status": "broken",
                        "design_score_10": 0,
                        "branding_score_10": 0,
                        "clarity_score_10": 0,
                        "white_label_fit_10": 0,
                        "first_impression": "analysis_failed",
                        "executive_summary": f"Model call failed: {exc}",
                    },
                    "layout_analysis": {
                        "center_alignment": "unclear",
                        "alignment_notes": "",
                        "spacing_notes": "",
                        "margin_notes": "",
                        "whitespace_notes": "",
                        "visual_hierarchy_notes": "",
                        "content_density": "unclear",
                    },
                    "branding_analysis": {
                        "brand_presence": "almost_none",
                        "branding_status": "unbranded",
                        "brand_quality_score_10": 0,
                        "branding_work_remaining_10": 10,
                        "branding_refinement_score_10": 10,
                        "brand_consistency_notes": "",
                        "generic_or_reuse_signals": [],
                        "distinctive_brand_elements": [],
                        "target_brand_entity": None,
                        "target_brand_reasoning": "Analysis failed before a visual judgment could be produced.",
                        "research_needed": True,
                        "research_prompt": "Run target-buyer research for this MVP before branding decisions are finalized.",
                        "white_label_fit": {
                            "rating": "high",
                            "reasoning": "Analysis failed before a visual judgment could be produced.",
                        },
                    },
                    "aesthetic_analysis": {
                        "color_notes": "",
                        "typography_notes": "",
                        "component_quality_notes": "",
                        "polish_notes": "",
                        "trust_signal_notes": "",
                    },
                    "issues": [
                        {
                            "category": "analysis",
                            "severity": "critical",
                            "issue": "Vision model analysis failed",
                            "evidence": str(exc),
                            "quick_fix": "Retry with a different OpenRouter model or check the API key and network connection.",
                            "effort": "small",
                        }
                    ],
                    "quick_fixes": [
                        {
                            "priority": 1,
                            "action": "Retry the screenshot analysis with a different model",
                            "why": "The report could not be generated for this screenshot.",
                            "effort": "small",
                            "impact": "high",
                        }
                    ],
                    "orchestration_notes": {
                        "likely_next_dev_actions": ["retry_analysis"],
                        "shared_pattern_warning": False,
                        "looks_shell_like": True,
                        "needs_branding_pass": True,
                        "needs_layout_pass": True,
                        "needs_content_pass": True,
                    },
                    "confidence": 0.0,
                    "error": str(exc),
                }

        if args.branding_only:
            branding_result = call_openrouter(
                api_key=api_key,
                model=model,
                prompt=prompt,
                image_data_url=image_data_url,
                temperature=args.temperature,
                max_tokens=args.max_tokens,
                reasoning_effort=reasoning_effort_for_quality(args.quality),
                use_web_search=True,
            )
            if not isinstance(branding_result, dict):
                branding_result = {}
            if isinstance(branding_result.get("branding_analysis"), dict):
                analysis["branding_analysis"] = branding_result["branding_analysis"]
            else:
                analysis["branding_analysis"] = branding_result
            analysis["confidence"] = branding_result.get("confidence", analysis.get("confidence", 0.0))
            analysis["notes"] = branding_result.get("notes", "")
            analysis = normalize_branding_analysis(analysis)
            if args.verify_targets:
                analysis = verify_branding_analysis_with_web(
                    analysis=analysis,
                    api_key=api_key,
                    model=model,
                    quality=args.quality,
                    temperature=args.temperature,
                    max_tokens=args.max_tokens,
                )
        else:
            analysis = normalize_branding_analysis(analysis)
            if args.verify_targets:
                analysis = verify_branding_analysis_with_web(
                    analysis=analysis,
                    api_key=api_key,
                    model=model,
                    quality=args.quality,
                    temperature=args.temperature,
                    max_tokens=args.max_tokens,
                )
        analysis["capture_metadata"] = {
            "image_path": str(record.image_path),
            "metadata_path": str(record.metadata_path) if record.metadata_path else None,
            "url": record.url,
            "title": record.title,
            "source": record.source,
            "warnings": record.warnings,
            "slug": slug_from_path(record.image_path),
            "image_size": record.image_size,
            "modified_at": record.modified_at,
        }

        report_items_by_slug[slug_from_path(record.image_path)] = analysis
        report["items"] = list(report_items_by_slug.values())
        report["item_count"] = len(report["items"])
        report["summary"] = summarize_results(report["items"])
        args.output.write_text(json.dumps(report, indent=2, ensure_ascii=False))
        render_gallery_index(args.image_dir, report)

        if args.sleep > 0:
            time.sleep(args.sleep)

    archive_dir = archive_analysis_artifacts(args.output, report, args.image_dir)
    if archive_dir is not None:
        print(f"Archived analysis artifacts at {archive_dir}")
    print(f"Wrote {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
