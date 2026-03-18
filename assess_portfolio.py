import os
import re

def assess_site(site_dir):
    score_layout = 5  # Start average
    score_brand = 5   # Start average
    
    index_path = os.path.join(site_dir, 'index.html')
    app_path = os.path.join(site_dir, 'src', 'App.tsx')
    if not os.path.exists(app_path):
        app_path = os.path.join(site_dir, 'src', 'App.jsx')
    if not os.path.exists(app_path):
        app_path = os.path.join(site_dir, 'src', 'main.tsx')

    # 1. Check Title
    title = "Unknown"
    if os.path.exists(index_path):
        with open(index_path, 'r', errors='ignore') as f:
            content = f.read()
            m = re.search(r'<title>(.*?)</title>', content)
            if m:
                title = m.group(1)
                if "Vite" in title or "React" in title or "App" == title:
                    score_brand -= 3
                else:
                    score_brand += 2

    # 2. Check Layout & Content
    h1 = "Unknown"
    has_lorem = False
    has_centering = False
    has_custom_colors = False
    
    if os.path.exists(app_path):
        with open(app_path, 'r', errors='ignore') as f:
            content = f.read()
            
            # H1
            m_h1 = re.search(r'<h1[^>]*>(.*?)</h1>', content, re.DOTALL)
            if m_h1:
                h1_raw = m_h1.group(1).strip()
                # Remove tags from H1
                h1 = re.sub(r'<[^>]+>', '', h1_raw).strip()[:30]
            
            # Lorem
            if "Lorem ipsum" in content or "lorem ipsum" in content:
                has_lorem = True
                score_brand -= 2
                score_layout -= 1
            
            # Centering
            if "mx-auto" in content or "justify-center" in content or "items-center" in content or "container" in content:
                has_centering = True
                score_layout += 3
            else:
                score_layout -= 2
                
            # Colors (look for non-standard tailwind colors often used in branding)
            # Standard: slate, gray, zinc, neutral, stone, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose
            # If they use specific ones like "amber", "emerald", "indigo", "rose" it implies some design choice.
            # If they ONLY use "gray" or "slate" or "black" or "white", it might be generic.
            branded_colors = ["amber", "emerald", "indigo", "rose", "cyan", "violet", "fuchsia", "lime", "teal", "sky", "orange"]
            for color in branded_colors:
                if f"bg-{color}" in content or f"text-{color}" in content:
                    has_custom_colors = True
                    score_brand += 1
                    break

    # Normalize Scores
    score_layout = max(0, min(10, score_layout))
    score_brand = max(0, min(10, score_brand))
    
    return {
        "title": title,
        "h1": h1,
        "lorem": has_lorem,
        "centered": has_centering,
        "colors": has_custom_colors,
        "score_layout": score_layout,
        "score_brand": score_brand
    }

def main():
    print("| Site | Title | H1 | Centered? | Lorem? | Brand Score | Layout Score | Notes |")
    print("|---|---|---|---|---|---|---|---|")
    
    with open('allsites.txt', 'r') as f:
        sites = [line.strip() for line in f if line.strip()]
        
    for site in sorted(sites):
        site_dir = os.path.join('websites', site)
        if not os.path.isdir(site_dir):
            continue
            
        data = assess_site(site_dir)
        
        notes = []
        if data['lorem']: notes.append("Remove Lorem")
        if not data['centered']: notes.append("Fix Layout")
        if "Vite" in data['title']: notes.append("Fix Title")
        if not data['colors']: notes.append("Add Color")
        
        note_str = ", ".join(notes) if notes else "Looks Good"
        
        print(f"| {site} | {data['title']} | {data['h1']} | {'Yes' if data['centered'] else 'NO'} | {'YES' if data['lorem'] else 'No'} | {data['score_brand']} | {data['score_layout']} | {note_str} |")

if __name__ == "__main__":
    main()
