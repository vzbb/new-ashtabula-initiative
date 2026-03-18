import re
import os
import subprocess
import time
import sys

SITEMAP_FILE = 'SITEMAP.md'
OUTPUT_DIR = 'sitemap_screenshots'

def parse_sitemap():
    urls = []
    with open(SITEMAP_FILE, 'r') as f:
        for line in f:
            # Look for table rows: | # | Site | URL | Description |
            # Example: | 1 | Civic Insight Engine | [/civic-insight/](https://new-ashtabula-initiative.vercel.app/civic-insight/) | ...
            if not line.strip().startswith('|'):
                continue
            
            parts = [p.strip() for p in line.split('|')]
            if len(parts) < 5:
                continue
                
            # The URL column is index 3
            url_col = parts[3]
            
            # Extract URL from markdown link: [path](url)
            match = re.search(r'\((https?://[^)]+)\)', url_col)
            if match:
                urls.append(match.group(1))
    return urls

def run_devtools_command(args):
    """Runs a chrome-devtools command."""
    cmd = ['chrome-devtools'] + args
    try:
        subprocess.run(cmd, check=True, capture_output=True, text=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error running command {' '.join(cmd)}: {e.stderr}")
        return False

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    urls = parse_sitemap()
    print(f"Found {len(urls)} URLs in {SITEMAP_FILE}")
    
    if not urls:
        print("No URLs found. Exiting.")
        return

    # Start with the first URL
    first_url = urls[0]
    print(f"Starting with {first_url}...")
    
    # Open a new page for the first URL
    # We use new_page to ensure we have a clean slate, or navigate if one is open.
    # Since we can't easily check what's open and valid via script without parsing list_pages,
    # we'll just try to open a new one for the first, then navigate.
    
    # Actually, let's just use navigate_page on the current page if it exists, or new_page.
    # But to be safe and simple, let's assume we can just new_page the first one.
    # Ideally, we should check if the server is running. The CLI tool handles the server implicitly.
    
    # Let's try to navigate the current page first. If it fails (no page), we'll create one.
    # But wait, chrome-devtools CLI creates a session.
    
    # Let's just use `navigate_page` for all. If no page is open, `navigate_page` might fail or might pick the first one.
    # The safest bet is `new_page` for the first one.
    
    # However, to be robust, let's list pages first.
    try:
        subprocess.run(['chrome-devtools', 'list_pages'], check=True, capture_output=True)
    except Exception:
        print("Chrome DevTools might not be ready or no pages listable.")
        
    # We will loop through all URLs
    for i, url in enumerate(urls):
        slug = url.rstrip('/').split('/')[-1]
        if not slug:
            slug = 'home'
        
        filename = os.path.join(OUTPUT_DIR, f"{i+1:03d}_{slug}.png")
        
        print(f"Processing ({i+1}/{len(urls)}): {url} -> {filename}")
        
        if i == 0:
             # For the first one, ensure we have a page. 
             # We'll use new_page which opens a tab.
             if not run_devtools_command(['new_page', url]):
                 print("Failed to open new page. Stopping.")
                 break
        else:
             if not run_devtools_command(['navigate_page', '--url', url]):
                 print(f"Failed to navigate to {url}. Skipping.")
                 continue
        
        # Wait a bit for render (naive wait)
        time.sleep(2)
        
        # Take screenshot
        if not run_devtools_command(['take_screenshot', '--filePath', filename]):
            print(f"Failed to take screenshot for {url}")
            
    print("Done.")

if __name__ == "__main__":
    main()
