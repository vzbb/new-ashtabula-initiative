import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SITEMAP_PATH = ROOT / 'SITEMAP.md'
SITE_ROOTS = [
    ROOT / 'websites',
]


def load_sites_from_sitemap() -> list[str]:
    text = SITEMAP_PATH.read_text()
    pattern = re.compile(r'\[/([a-z0-9-]+)/\]\(https://new-ashtabula-initiative\.vercel\.app/[^)]+\)')
    sites: list[str] = []
    seen: set[str] = set()
    for site in pattern.findall(text):
        if site not in seen:
            seen.add(site)
            sites.append(site)
    return sites


sites = load_sites_from_sitemap()

for site in sites:
    config_path = None
    for site_root in SITE_ROOTS:
        config_path_js = site_root / site / 'vite.config.js'
        config_path_ts = site_root / site / 'vite.config.ts'
        if config_path_js.exists():
            config_path = config_path_js
            break
        if config_path_ts.exists():
            config_path = config_path_ts
            break

    if config_path:
        with open(config_path, 'r') as f:
            content = f.read()

        # If 'base:' is already present, update it; otherwise add it
        if 'base:' in content:
            content = re.sub(r"base:\s*['\"].*?['\"]", f"base: '/{site}/'", content)
            print(f"Updated base in {config_path}")
        else:
            # Look for export default defineConfig({
            if 'export default defineConfig({' in content:
                content = content.replace(
                    'export default defineConfig({',
                    f"export default defineConfig({{\n  base: '/{site}/',"
                )
                print(f"Added base to {config_path}")
            # Case for functional config
            elif 'export default defineConfig(({mode}) => {' in content:
                 content = content.replace(
                    'return {',
                    f"return {{\n    base: '/{site}/',"
                )
                 print(f"Added base (functional) to {config_path}")
            elif 'export default defineConfig( ({ mode }) => {' in content:
                 content = content.replace(
                    'return {',
                    f"return {{\n    base: '/{site}/',"
                )
                 print(f"Added base (functional-spaced) to {config_path}")
            else:
                print(f"Could not find insertion point in {config_path}")
                
        with open(config_path, 'w') as f:
            f.write(content)
