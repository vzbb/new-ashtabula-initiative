#!/usr/bin/env python3
"""
Visual QA Script for NAI Sites 35-51 (Kimi Agent)
Screenshot → Fix → Deploy → Verify → NEVER STOP
"""

import subprocess
import time
import os
import json
from pathlib import Path
import http.server
import socketserver
import threading
import signal
import sys

# Configuration
BASE_DIR = Path("/home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites")
OUTPUT_DIR = Path("/home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/visual-qa-kimi/screenshots")
REPORT_FILE = Path("/home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/VISUAL_QA_SCREENSHOTS_KIMI.md")
CHROME_BIN = "/usr/bin/google-chrome"

# Sites 35-51
SITES = [
    (35, "landlord-repair-queue"),
    (36, "lawn-quote-tool"),
    (37, "license-wizard"),
    (38, "local-grocer-go"),
    (39, "marina-slip-waitlist"),
    (40, "mobile-notary"),
    (41, "mytrip-planner"),
    (42, "mytrip-planner-export"),
    (43, "parts-finder"),
    (44, "parts-finder-request"),
    (45, "permit-whisperer"),
    (46, "pet-matchmaker"),
    (47, "plating-tracker"),
    (48, "plating-tracker-pro"),
    (49, "pocket-historian"),
    (50, "pocket-historian-pro"),
    (51, "pocket-sommelier"),
]

# Ensure output directory exists
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Global server control
server_running = False
httpd = None

def start_server(port, directory):
    """Start a simple HTTP server for the given directory"""
    global server_running, httpd
    
    os.chdir(directory)
    handler = http.server.SimpleHTTPRequestHandler
    httpd = socketserver.TCPServer(("", port), handler)
    server_running = True
    
    def serve():
        while server_running:
            try:
                httpd.handle_request()
            except:
                break
    
    thread = threading.Thread(target=serve, daemon=True)
    thread.start()
    return thread

def stop_server():
    """Stop the HTTP server"""
    global server_running, httpd
    server_running = False
    if httpd:
        try:
            httpd.shutdown()
        except:
            pass
        httpd = None

def capture_screenshot(url, output_file, width=1920, height=1080, delay=3):
    """Capture screenshot using Chrome headless"""
    
    cmd = [
        CHROME_BIN,
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-web-security",
        "--run-all-compositor-stages-before-draw",
        "--disable-renderer-backgrounding",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--force-color-profile=srgb",
        "--metrics-recording-only",
        f"--window-size={width},{height}",
        f"--screenshot={output_file}",
        f"--virtual-time-budget={delay * 1000}",
        url
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0 and Path(output_file).exists():
            size = Path(output_file).stat().st_size
            print(f"  ✅ Screenshot saved: {output_file} ({size / 1024:.1f} KB)")
            return True
        else:
            print(f"  ❌ Screenshot failed: {result.stderr[:200]}")
            return False
            
    except subprocess.TimeoutExpired:
        print(f"  ⏱️ Screenshot timeout: {output_file}")
        return False
    except Exception as e:
        print(f"  ❌ Screenshot error: {e}")
        return False

def analyze_site(site_num, site_name):
    """Screenshot and analyze a single site"""
    
    site_dir = BASE_DIR / site_name / "dist"
    if not site_dir.exists():
        print(f"  ⚠️  No dist folder for {site_name}, trying to build...")
        return False
    
    port = 8000 + site_num
    base_url = f"http://localhost:{port}"
    
    # Start server
    original_dir = os.getcwd()
    server_thread = start_server(port, str(site_dir))
    time.sleep(1)  # Let server start
    
    try:
        site_output = OUTPUT_DIR / site_name
        site_output.mkdir(exist_ok=True)
        
        print(f"\n📸 Site {site_num}: {site_name}")
        
        # Desktop screenshot
        desktop_file = site_output / "desktop.png"
        desktop_ok = capture_screenshot(base_url, str(desktop_file), 1920, 1080, 3)
        
        # Mobile screenshot  
        mobile_file = site_output / "mobile.png"
        mobile_ok = capture_screenshot(base_url, str(mobile_file), 375, 667, 3)
        
        results = {
            "site": site_name,
            "num": site_num,
            "desktop": str(desktop_file) if desktop_ok else None,
            "mobile": str(mobile_file) if mobile_ok else None,
            "desktop_size": desktop_file.stat().st_size / 1024 if desktop_ok else 0,
            "mobile_size": mobile_file.stat().st_size / 1024 if mobile_ok else 0,
        }
        
        return results
        
    finally:
        stop_server()
        os.chdir(original_dir)

def main():
    print("=" * 60)
    print("🎬 NAI Visual QA — Kimi Agent (Sites 35-51)")
    print("=" * 60)
    print("Method: Screenshot → Fix → Deploy → Verify → NEVER STOP")
    print()
    
    # Check Chrome
    if not Path(CHROME_BIN).exists():
        print(f"❌ Chrome not found at {CHROME_BIN}")
        return 1
    
    print(f"📁 Base directory: {BASE_DIR}")
    print(f"📸 Output directory: {OUTPUT_DIR}")
    print(f"🌐 Chrome: {CHROME_BIN}")
    print()
    
    all_results = []
    
    for site_num, site_name in SITES:
        try:
            result = analyze_site(site_num, site_name)
            if result:
                all_results.append(result)
        except Exception as e:
            print(f"  ❌ Error processing {site_name}: {e}")
        
        time.sleep(0.5)  # Brief pause between sites
    
    # Print summary
    print("\n" + "=" * 60)
    print("📊 SCREENSHOT SUMMARY")
    print("=" * 60)
    
    for r in all_results:
        status = "✅" if r["desktop"] and r["mobile"] else "⚠️"
        print(f"{status} Site {r['num']}: {r['site']}")
        if r["desktop"]:
            print(f"   Desktop: {r['desktop_size']:.1f} KB")
        if r["mobile"]:
            print(f"   Mobile: {r['mobile_size']:.1f} KB")
    
    print(f"\n📁 Screenshots saved to: {OUTPUT_DIR}")
    print("\n➡️  Next: Review screenshots for visual issues")
    
    return 0

if __name__ == "__main__":
    exit(main())
