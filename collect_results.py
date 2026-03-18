import os
import json

def main():
    print("# Portfolio Audit Report")
    print("| Site | Centering | Branding | Lorem? | Notes |")
    print("|---|---|---|---|---|")

    audit_dir = 'audit_results'
    if not os.path.exists(audit_dir):
        print("No audit results found.")
        return

    files = sorted(os.listdir(audit_dir))
    for f in files:
        if not f.endswith('.json'):
            continue
            
        file_path = os.path.join(audit_dir, f)
        try:
            with open(file_path, 'r') as jf:
                data = json.load(jf)
                
            site = data.get('site', f[:-5])
            centering = data.get('centering', 'N/A')
            branding = data.get('branding', 'N/A')
            lorem = data.get('lorem', 'N/A')
            notes = data.get('notes', '').replace('|', '\\|') # Escape pipes for markdown
            
            if 'error' in data:
                print(f"| {site} | ERROR | ERROR | - | {data['error']} |")
            else:
                lorem_str = "YES" if lorem is True else ("No" if lorem is False else "N/A")
                print(f"| {site} | {centering}/10 | {branding}/10 | {lorem_str} | {notes} |")
        except Exception as e:
            print(f"| {f[:-5]} | ERROR | ERROR | - | Corrupt JSON: {str(e)} |")

if __name__ == "__main__":
    main()
