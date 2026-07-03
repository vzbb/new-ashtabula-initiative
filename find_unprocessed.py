import json

# Read the visual analysis report
with open('/home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/sitemap_screenshots/visual_analysis_report.json', 'r') as f:
    report = json.load(f)

# Get list of existing lead research files
import os
existing_files = set()
if os.path.exists('/home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/lead_research_json/'):
    for f in os.listdir('/home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/lead_research_json/'):
        if f.endswith('.json'):
            existing_files.add(f.replace('.json', ''))

# Find slugs needing research
needs_research = []
for item in report['items']:
    slug = item['slug']
    research_needed = item.get('branding_analysis', {}).get('research_needed', False)
    
    if research_needed and slug not in existing_files:
        needs_research.append({
            'slug': slug,
            'title': item.get('source_title', 'N/A'),
            'target_brand_entity': item.get('branding_analysis', {}).get('target_brand_entity'),
            'research_prompt': item.get('branding_analysis', {}).get('research_prompt', 'N/A'),
            'target_brand_status': item.get('branding_analysis', {}).get('target_brand_status', 'unknown')
        })

# Print results
print(f"Total items in report: {len(report['items'])}")
print(f"Existing lead research files: {len(existing_files)}")
print(f"\nMVPs needing research (no JSON yet):")
print("=" * 80)
for i, item in enumerate(needs_research, 1):
    print(f"\n{i}. {item['slug']}")
    print(f"   Title: {item['title']}")
    print(f"   Target Entity: {item['target_brand_entity']}")
    print(f"   Status: {item['target_brand_status']}")
    print(f"   Research Prompt: {item['research_prompt'][:100]}..." if len(item['research_prompt']) > 100 else f"   Research Prompt: {item['research_prompt']}")

print(f"\n\nTotal unprocessed MVPs needing research: {len(needs_research)}")
