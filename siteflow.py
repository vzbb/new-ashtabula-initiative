from __future__ import annotations

import json
import re
import shutil
import subprocess
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SITEMAP_PATH = ROOT / "SITEMAP.md"
WEBSITES_DIR = ROOT / "websites"

SHORT_MAPPINGS: dict[str, str] = {
    "civic-insight": "civic-insight-engine",
    "contractors": "contractor-match",
    "eligibility": "eligibility-screener",
    "harbor": "harbor-cam-dashboard",
    "invest": "invest-ashtabula",
    "grocer": "local-grocer-go",
    "permits": "permit-whisperer",
    "parts": "parts-finder",
    "plating": "plating-tracker",
    "site-ops": "site-ops-pro",
    "adaptive-reuse": "adaptive-reuse-planner",
    "blueprint": "blueprint-analyzer",
    "boxflow": "boxflow-estimator",
    "cashflow": "cashflow-tracker",
    "landlord": "landlord-repair-queue",
    "lawn": "lawn-quote-tool",
    "hvac": "hvac-tuneup",
    "snow-plow": "snow-plow-tracker",
    "dirt-quote": "instant-dirt-quote",
    "rental": "rental-availability",
    "engineers": "engineers-assistant",
    "curbside": "curbside-pickup-tracker",
    "farm-stand": "farm-stand-finder",
    "notary": "mobile-notary",
    "auto-detail": "auto-detail-booking",
    "truck-wash": "truck-wash-booking",
    "concierge": "virtual-concierge",
    "parking": "visitor-parking-finder",
    "routes": "route-optimizer",
    "charter": "charter-booking",
    "marina": "marina-slip-waitlist",
    "compassionate": "compassionate-planner",
    "aidflow": "aidflow-navigator",
    "boat-storage": "boat-storage-waitlist",
    "harvest": "harvest-alert",
    "artist-commission": "artist-commission-form",
    "gotl": "gotl-weekend-planner",
    "pet-match": "pet-matchmaker",
    "portfolio": "visual-portfolio",
    "volunteer": "volunteer-scheduler",
    "wedding": "wedding-lead-form",
    "license": "license-wizard",
    "event-permit": "event-permit-express",
    "zoning": "zoning-clerk",
    "govtech": "govtech-box",
    "historian-pro": "pocket-historian-pro",
    "historian": "pocket-historian",
    "sommelier-pro": "pocket-sommelier-pro",
    "sommelier": "pocket-sommelier",
    "resource-pro": "resource-compass-pro",
    "resource": "resource-compass",
    "scheduler-sms": "service-scheduler-sms",
    "scheduler": "service-scheduler",
    "plating-pro": "plating-tracker-pro",
    "parts-request": "parts-finder-request",
    "mytrip-export": "mytrip-planner-export",
    "mytrip": "mytrip-planner",
}


def load_public_slugs() -> list[str]:
    text = SITEMAP_PATH.read_text()
    pattern = re.compile(r"\[/([a-z0-9-]+)/\]\(https://new-ashtabula-initiative\.vercel\.app/[^)]+\)")
    slugs: list[str] = []
    seen: set[str] = set()
    for slug in pattern.findall(text):
        if slug not in seen:
            seen.add(slug)
            slugs.append(slug)
    return slugs


def site_name_for_slug(slug: str) -> str:
    return SHORT_MAPPINGS.get(slug, slug)


def site_dir_for_slug(slug: str) -> Path:
    return WEBSITES_DIR / site_name_for_slug(slug)


def read_json(path: Path) -> dict:
    return json.loads(path.read_text())


def package_dirs(site_dir: Path) -> list[Path]:
    if not site_dir.exists():
        return []

    excluded = {
        "node_modules",
        ".vercel",
        "dist",
        "dist2",
        "build",
        "out",
    }
    dirs: list[Path] = []
    for pkg in site_dir.rglob("package.json"):
        rel_parts = pkg.parent.relative_to(site_dir).parts
        if len(rel_parts) > 2:
            continue
        if any(part in excluded or part.startswith(".") for part in rel_parts):
            continue
        dirs.append(pkg.parent)
    dirs.sort(key=lambda p: (len(p.relative_to(site_dir).parts), str(p)))
    return dirs


@lru_cache(maxsize=None)
def package_has_build_script(package_dir: str) -> bool:
    pkg = Path(package_dir) / "package.json"
    if not pkg.exists():
        return False
    data = read_json(pkg)
    scripts = data.get("scripts", {})
    return "build" in scripts


def ensure_node_modules(package_dir: Path) -> None:
    node_modules = package_dir / "node_modules"
    if node_modules.exists():
        return

    lockfile = package_dir / "package-lock.json"
    ci_cmd = ["npm", "ci", "--include=dev", "--no-audit", "--no-fund", "--ignore-scripts", "--legacy-peer-deps"]
    install_cmd = ["npm", "install", "--include=dev", "--no-audit", "--no-fund", "--ignore-scripts", "--legacy-peer-deps"]

    if lockfile.exists():
        try:
            subprocess.run(ci_cmd, cwd=package_dir, check=True)
            return
        except subprocess.CalledProcessError:
            pass

    subprocess.run(install_cmd, cwd=package_dir, check=True)


def build_workdir(site_dir: Path) -> Path | None:
    if not site_dir.exists():
        return None

    if (site_dir / "package.json").exists() and package_has_build_script(str(site_dir)):
        return site_dir

    for candidate in package_dirs(site_dir):
        if candidate == site_dir:
            continue
        if package_has_build_script(str(candidate)):
            return candidate

    if (site_dir / "package.json").exists():
        return site_dir
    return None


def run_site_build(site_dir: Path) -> Path:
    workdir = build_workdir(site_dir)
    if workdir is None:
        raise RuntimeError(f"No package.json build target found in {site_dir}")

    root_build = site_dir / "index.html"
    if workdir == site_dir and root_build.exists() and index_kind(root_build) == "built":
        normalize_build_output(site_dir)
        return site_dir

    for package_dir in package_dirs(site_dir):
        ensure_node_modules(package_dir)

    subprocess.run(["npm", "run", "build"], cwd=workdir, check=True)
    return normalize_build_output(site_dir) or workdir


def index_kind(index_html: Path) -> str:
    text = index_html.read_text(errors="ignore")
    if "/src/main.jsx" in text or "/src/main.tsx" in text:
        return "shell"
    if "/assets/" in text or "<script type=\"module\" crossorigin src=" in text:
        return "built"
    return "other"


def candidate_build_roots(site_dir: Path) -> list[Path]:
    if not site_dir.exists():
        return []

    explicit = [
        site_dir / "dist",
        site_dir / "dist2",
        site_dir / "build",
        site_dir / "out",
        site_dir / "client" / "dist",
        site_dir / "client" / "dist2",
        site_dir / "client" / "build",
        site_dir / "my-app" / "dist",
        site_dir / "my-app" / "build",
    ]

    roots: list[Path] = []
    for candidate in explicit:
        index_html = candidate / "index.html"
        if index_html.exists() and index_kind(index_html) == "built":
            roots.append(candidate)

    root_index = site_dir / "index.html"
    if root_index.exists() and index_kind(root_index) == "built":
        roots.append(site_dir)

    for child in sorted(site_dir.iterdir(), key=lambda p: p.name):
        if not child.is_dir():
            continue
        if child.name.startswith(".") or child.name in {"src", "public", "node_modules", ".vercel"}:
            continue
        index_html = child / "index.html"
        if index_html.exists() and index_kind(index_html) == "built":
            roots.append(child)

    unique: list[Path] = []
    seen: set[Path] = set()
    for root in roots:
        resolved = root.resolve()
        if resolved in seen:
            continue
        seen.add(resolved)
        unique.append(root)
    return unique


def find_best_build_root(site_dir: Path) -> Path | None:
    roots = candidate_build_roots(site_dir)
    if roots:
        return roots[0]
    return None


def normalize_build_output(site_dir: Path) -> Path | None:
    build_root = find_best_build_root(site_dir)
    if build_root is None:
        return None

    if build_root.resolve() == site_dir.resolve():
        return site_dir

    dist = site_dir / "dist"
    if build_root.resolve() == dist.resolve():
        return dist

    if dist.exists():
        if dist.is_symlink() or dist.is_file():
            dist.unlink()
        else:
            shutil.rmtree(dist)

    shutil.copytree(build_root, dist)
    return dist


def detect_asset_aliases(index_html: Path) -> list[str]:
    if not index_html.exists():
        return []

    text = index_html.read_text(errors="ignore")
    aliases: set[str] = set()
    patterns = [
        re.compile(r'["\']/(?!/)([^/"\']+)/assets/'),
        re.compile(r'["\']/(?!/)([^/"\']+)/vite\.svg'),
        re.compile(r'["\']/(?!/)([^/"\']+)/images/'),
    ]
    for pattern in patterns:
        for match in pattern.findall(text):
            alias = match.strip()
            if alias:
                aliases.add(alias)
    return sorted(aliases)


def needs_api_client_shim(site_dir: Path) -> bool:
    if not site_dir.exists():
        return False

    src_dir = site_dir / "src"
    if not src_dir.exists():
        return False

    local_shim = src_dir / "api-client.js"
    if local_shim.exists():
        return False

    for source_file in src_dir.rglob("*"):
        if source_file.suffix not in {".js", ".jsx", ".ts", ".tsx"}:
            continue
        if "./api-client.js" in source_file.read_text(errors="ignore"):
            return True

    return False
