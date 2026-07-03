import sys
import subprocess
import os

site = sys.argv[1]
output_file = f"audit_results/{site}.txt"

# Check if we already did this one
if os.path.exists(output_file):
    sys.exit(0)

prompt = f"""Analyze 'websites/{site}/index.html' and its main source file (likely 'src/App.tsx' or 'src/App.jsx'). 
1. Check if the UI is centered (mx-auto, justify-center, etc.) (Score 0-10).
2. Assess branding quality (Score 0-10) and check for Lorem Ipsum.
Output ONLY a single line in this format:
SITE: {site} | CENTERING: N | BRANDING: N | LOREM: bool | NOTES: your summary here"""

cmd = [
    'gemini',
    '--model', 'gemini-2.5-flash-lite',
    '--yolo',
    '--extensions', '',
    '--prompt', prompt
]

try:
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
    output = result.stdout
    # Try to find the specific line
    import re
    match = re.search(r'SITE:.*\|.*\|.*\|.*\|.*', output)
    if match:
        line = match.group(0)
        with open(output_file, 'w') as f:
            f.write(line)
    else:
        # Fallback to whole output if no match
        with open(output_file, 'w') as f:
            f.write(f"ERROR: Could not find output line for {site}. Raw output: " + output[-200:])
except Exception as e:
    with open(output_file, 'w') as f:
        f.write(f"ERROR: {str(e)} for {site}")
