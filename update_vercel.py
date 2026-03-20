from __future__ import annotations

import json
from pathlib import Path

from siteflow import find_best_build_root, load_public_slugs, site_dir_for_slug

ROOT = Path(__file__).resolve().parent


def route_dest_for_slug(slug: str) -> str | None:
    site_dir = site_dir_for_slug(slug)
    build_root = find_best_build_root(site_dir)
    if build_root is None:
        return None

    try:
        rel_path = build_root.relative_to(ROOT).as_posix()
    except ValueError:
        return None

    return f"/{rel_path}/$1"


def build_routes() -> list[dict[str, str]]:
    routes: list[dict[str, str]] = []

    for slug in load_public_slugs():
        dest = route_dest_for_slug(slug)
        if dest is None:
            continue
        routes.append({"src": f"/{slug}/?(.*)", "dest": dest})

    routes.sort(key=lambda item: len(item["src"]), reverse=True)
    routes.append({"src": "/all-mvps/?(.*)", "dest": "/landing-page/all-mvps.html"})
    routes.append({"src": "/(.*)", "dest": "/landing-page/index.html"})
    return routes


def main() -> None:
    vercel_config = {
        "version": 2,
        "name": "new-ashtabula-initiative",
        "routes": build_routes(),
    }

    (ROOT / "vercel.json").write_text(json.dumps(vercel_config, indent=2) + "\n")
    print("vercel.json updated successfully with build-aware routes.")


if __name__ == "__main__":
    main()
