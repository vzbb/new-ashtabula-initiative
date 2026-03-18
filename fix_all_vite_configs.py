import os
import re

with open('allsites.txt', 'r') as f:
    sites = [line.strip() for line in f if line.strip()]

for site in sites:
    config_path_js = os.path.join('websites', site, 'vite.config.js')
    config_path_ts = os.path.join('websites', site, 'vite.config.ts')
    
    config_path = None
    if os.path.exists(config_path_js):
        config_path = config_path_js
    elif os.path.exists(config_path_ts):
        config_path = config_path_ts
        
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
