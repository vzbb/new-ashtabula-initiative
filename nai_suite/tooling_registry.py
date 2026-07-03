from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REPO_ROOT = ROOT.parent
REGISTRY_PATH = REPO_ROOT / "NAI_TOOLCHAIN.json"
DOC_PATH = REPO_ROOT / "NAI_TOOLCHAIN.md"


def load_registry() -> dict[str, object]:
    return json.loads(REGISTRY_PATH.read_text())


def render_markdown(data: dict[str, object]) -> str:
    entries = data.get("entries", [])
    grouped: dict[str, list[dict[str, object]]] = {"core": [], "support": [], "legacy": []}
    for entry in entries:
        if not isinstance(entry, dict):
            continue
        grouped.setdefault(str(entry.get("status", "support")), []).append(entry)

    lines = [
        "# NAI Toolchain",
        "",
        "> Canonical source: `NAI_TOOLCHAIN.json`",
        ">",
        "> Use this file to tell which scripts are core to the NAI suite, which are support utilities, and which are legacy/one-off artifacts.",
        "",
        "## How To Read This",
        "",
        "- `core`: integral to the active NAI workflow or user-facing wrapper.",
        "- `support`: useful utilities, diagnostics, or helpers, but not required for the main workflow.",
        "- `legacy`: one-off, archival, or older scripts that should not be treated as canonical parts of the suite.",
        "",
    ]

    for status in ["core", "support", "legacy"]:
        lines.append(f"## {status.title()}")
        lines.append("")
        lines.append("| Path | Type | Role | Notes |")
        lines.append("|------|------|------|-------|")
        for entry in grouped.get(status, []):
            lines.append(
                f"| `{entry.get('path','')}` | {entry.get('type','')} | {entry.get('role','')} | {entry.get('notes','')} |"
            )
        lines.append("")
    return "\n".join(lines)


def write_markdown() -> Path:
    path = DOC_PATH
    path.write_text(render_markdown(load_registry()) + "\n")
    return path


def print_summary() -> None:
    data = load_registry()
    entries = [entry for entry in data.get("entries", []) if isinstance(entry, dict)]
    for status in ["core", "support", "legacy"]:
        bucket = [entry for entry in entries if entry.get("status") == status]
        print(f"{status.upper()} ({len(bucket)})")
        for entry in bucket:
            print(f"  - {entry['path']}: {entry['role']}")
        print("")


if __name__ == "__main__":
    write_markdown()
    print_summary()
