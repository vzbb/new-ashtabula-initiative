#!/usr/bin/env python3
"""URL Audit for NAI - Check all 68 sites"""

import subprocess
import json
import re
from datetime import datetime

def test_url(url):
    """Test if URL returns proper site or redirects to main."""
    try:
        # Get HTTP status
        result = subprocess.run(
            ['curl', '-s', '-o', '/dev/null', '-w', '%{http_code}', url, '--max-time', '10'],
            capture_output=True, text=True, timeout=15
        )
        status = result.stdout.strip()
        
        if status != '200':
            return {'httpStatus': status, 'actualStatus': f'ERROR_{status}'}
        
        # Check content - if it contains main page text, it's a redirect
        content_result = subprocess.run(
            ['curl', '-s', url, '--max-time', '10'],
            capture_output=True, text=True, timeout=15
        )
        content = content_result.stdout
        
        # Check for main page markers
        if 'Modernizing Ashtabula' in content and 'Three Pillars' in content:
            return {'httpStatus': 200, 'actualStatus': 'REDIRECT_TO_MAIN'}
        
        # Check if it has unique content (good sign)
        if len(content) > 5000:  # Substantial content
            return {'httpStatus': 200, 'actualStatus': 'OK'}
        
        return {'httpStatus': 200, 'actualStatus': 'UNKNOWN'}
        
    except Exception as e:
        return {'httpStatus': '000', 'actualStatus': f'ERROR: {str(e)}'}

def parse_sites():
    """Parse sites from markdown file."""
    sites = []
    with open('ALL_WEBSITE_LINKS.md', 'r') as f:
        for line in f:
            # Match pattern: | **Name** | https://url |
            match = re.match(r'\|\s*\*\*([^*]+)\*\*\s*\|\s*(https://[^\s|]+)', line)
            if match:
                name = match.group(1).strip()
                url = match.group(2).strip()
                sites.append({'name': name, 'url': url})
    return sites

def main():
    print("🔍 Auditing NAI Sites...")
    print("=" * 60)
    
    sites = parse_sites()
    print(f"Found {len(sites)} sites to check\n")
    
    results = []
    ok_count = 0
    redirect_count = 0
    error_count = 0
    
    for i, site in enumerate(sites, 1):
        print(f"[{i}/{len(sites)}] Testing {site['name']}...", end=' ')
        result = test_url(site['url'])
        result['name'] = site['name']
        result['url'] = site['url']
        results.append(result)
        
        status = result['actualStatus']
        if status == 'OK':
            ok_count += 1
            print(f"✅ OK")
        elif status == 'REDIRECT_TO_MAIN':
            redirect_count += 1
            print(f"⚠️  REDIRECT")
        else:
            error_count += 1
            print(f"❌ {status}")
    
    # Save JSON report
    report = {
        'auditDate': datetime.now().isoformat(),
        'totalSites': len(sites),
        'summary': {
            'ok': ok_count,
            'redirectToMain': redirect_count,
            'error': error_count
        },
        'sites': results
    }
    
    output_file = f"URL_AUDIT_REPORT_{datetime.now().strftime('%Y%m%d-%H%M')}.json"
    with open(output_file, 'w') as f:
        json.dump(report, f, indent=2)
    
    print("\n" + "=" * 60)
    print("📊 SUMMARY")
    print("=" * 60)
    print(f"✅ Working properly:     {ok_count}")
    print(f"⚠️  Redirecting to main:  {redirect_count}")
    print(f"❌ Errors/broken:        {error_count}")
    print(f"\n📄 Report saved: {output_file}")
    
    # Save CSV too
    csv_file = f"URL_AUDIT_REPORT_{datetime.now().strftime('%Y%m%d-%H%M')}.csv"
    with open(csv_file, 'w') as f:
        f.write("Name,URL,HTTP Status,Actual Status\n")
        for r in results:
            f.write(f"\"{r['name']}\",\"{r['url']}\",{r['httpStatus']},{r['actualStatus']}\n")
    print(f"📄 CSV saved: {csv_file}")

if __name__ == '__main__':
    main()
