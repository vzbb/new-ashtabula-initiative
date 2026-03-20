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
    index_path = None
    for site_root in SITE_ROOTS:
        candidate = site_root / site / 'dist' / 'index.html'
        if candidate.exists():
            index_path = candidate
            break

    if index_path:
        with open(index_path, 'r') as f:
            content = f.read()
        
        # We want to ensure all assets are prefixed with /site-name/
        # First, remove existing prefixes to avoid double-prefixing
        # Actually, simpler to just replace any "src=" or "href=" that doesn't have the prefix
        
        # If it has src="assets/", change to src="/site-name/assets/"
        # If it has src="/assets/", change to src="/site-name/assets/"
        # If it has src="./assets/", change to src="/site-name/assets/"
        
        patterns = [
            ('src="assets/', f'src="/{site}/assets/'),
            ('src="/assets/', f'src="/{site}/assets/'),
            ('src="./assets/', f'src="/{site}/assets/'),
            ('href="assets/', f'href="/{site}/assets/'),
            ('href="/assets/', f'href="/{site}/assets/'),
            ('href="./assets/', f'href="/{site}/assets/'),
            ('href="/favicon.ico', f'href="/{site}/favicon.ico'),
            ('href="favicon.ico', f'href="/{site}/favicon.ico'),
            ('href="./favicon.ico', f'href="/{site}/favicon.ico'),
            ('src="/vite.svg', f'src="/{site}/vite.svg'),
            ('src="vite.svg', f'src="/{site}/vite.svg'),
            ('src="./vite.svg', f'src="/{site}/vite.svg'),
        ]
        
        new_content = content
        for old, new in patterns:
            new_content = new_content.replace(old, new)
            
        if new_content != content:
            with open(index_path, 'w') as f:
                f.write(new_content)
            print(f"Fixed paths in {index_path}")
