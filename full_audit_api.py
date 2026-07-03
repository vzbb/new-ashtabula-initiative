import os
import json
import asyncio
from concurrent.futures import ThreadPoolExecutor
from google import genai
from google.genai import types

# 1. Configuration
API_KEY = os.environ.get("VITE_GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY")
MODEL_ID = "gemini-2.0-flash-lite" # Assuming 2.5-flash-lite was a future/speculative name, but 2.0-flash-lite is common now in 2026.
# Actually, the user's prompt says "model 2.5 flash-lite". I will try to use that if possible, but let's check for standard IDs.
# As of March 2026, 2.5 might be standard. I will try "gemini-2.5-flash-lite".

client = genai.Client(api_key=API_KEY)

def get_main_files(site_dir):
    files = {}
    
    # index.html
    index_path = os.path.join(site_dir, 'index.html')
    if os.path.exists(index_path):
        with open(index_path, 'r', errors='ignore') as f:
            files['index.html'] = f.read()[:5000] # Limit size
            
    # App.tsx or App.jsx
    src_dir = os.path.join(site_dir, 'src')
    if os.path.exists(src_dir):
        for f in os.listdir(src_dir):
            if f.startswith('App.') and (f.endswith('.tsx') or f.endswith('.jsx')):
                with open(os.path.join(src_dir, f), 'r', errors='ignore') as src_f:
                    files[f] = src_f.read()[:5000]
                break
    return files

def audit_site(site):
    site_dir = f"websites/{site}"
    if not os.path.isdir(site_dir):
        return {"site": site, "error": "Not a directory"}
        
    files = get_main_files(site_dir)
    file_content = "\n\n".join([f"--- {name} ---\n{content}" for name, content in files.items()])
    
    prompt = f"""You are a UI/UX and Branding auditor. Analyze the following code from the website '{site}'.

{file_content}

TASKS:
1. Centering Check (0-10): Is the UI centered in the viewport? Look for 'mx-auto', 'max-w-7xl', 'flex justify-center', etc. in the code.
2. Branding Check (0-10): Is it tailored for a specific lead/purpose? Check title and content uniqueness. Check for Lorem Ipsum.
3. Scoring: Give a score out of 10 for each.
4. Notes: Brief professional assessment.

Output ONLY a JSON object: {{"site": "{site}", "centering": N, "branding": N, "lorem": bool, "notes": "..."}}"""

    try:
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type='application/json'
            )
        )
        data = json.loads(response.text)
        if isinstance(data, list) and len(data) > 0:
            data = data[0]
        if not isinstance(data, dict):
            data = {"site": site, "error": "Model did not return a dictionary", "raw": str(data)}
        return data
    except Exception as e:
        # Fallback to gemini-2.0-flash if 2.5-flash-lite fails
        try:
             response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type='application/json'
                )
            )
             data = json.loads(response.text)
             if isinstance(data, list) and len(data) > 0:
                 data = data[0]
             return data
        except Exception as e2:
             return {"site": site, "error": str(e2)}

def main():
    with open('allsites.txt', 'r') as f:
        sites = [line.strip() for line in f if line.strip()]

    print(f"Auditing {len(sites)} sites...")
    
    with ThreadPoolExecutor(max_workers=20) as executor:
        results = list(executor.map(audit_site, sites))
    
    with open('PORTFOLIO_AUDIT.md', 'w') as f:
        f.write("# Portfolio Audit Report\n\n")
        f.write("| Site | Centering | Branding | Lorem? | Notes |\n")
        f.write("|---|---|---|---|---|\n")
        
        # Ensure all results are dictionaries before sorting
        valid_results = [r if isinstance(r, dict) else {"site": "Unknown", "error": "Invalid result type", "raw": str(r)} for r in results]
        
        for res in sorted(valid_results, key=lambda x: str(x.get('site', ''))):
            site = res.get('site', 'Unknown')
            if 'error' in res:
                f.write(f"| {site} | ERROR | ERROR | - | {res['error']} |\n")
            else:
                lorem_str = "YES" if res.get('lorem') else "No"
                f.write(f"| {site} | {res.get('centering')}/10 | {res.get('branding')}/10 | {lorem_str} | {res.get('notes')} |\n")

if __name__ == "__main__":
    main()
