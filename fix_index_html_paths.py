import os

with open('allsites.txt', 'r') as f:
    sites = [line.strip() for line in f if line.strip()]

for site in sites:
    index_path = os.path.join('websites', site, 'dist', 'index.html')
    if os.path.exists(index_path):
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
