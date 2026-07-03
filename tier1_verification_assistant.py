#!/usr/bin/env python3
"""
NAI Tier 1 Verification Assistant (Standard Library Only)
Automates programmatic checks for Tier 1 demo sites using only Python stdlib.

Usage:
    python3 tier1_verification_assistant_stdlib.py [--site <number>]
    
Examples:
    python3 tier1_verification_assistant_stdlib.py --site 1  # Check City of Ashtabula only
    python3 tier1_verification_assistant_stdlib.py           # Check all Tier 1 sites
"""

import argparse
import json
import re
import ssl
import sys
import time
import urllib.request
from datetime import datetime
from typing import Dict, List, Optional
from urllib.parse import urlparse


# Tier 1 Site Definitions
TIER1_SITES = {
    1: {
        "name": "City of Ashtabula Building Dept",
        "url": "https://newashtabula.vercel.app/city-of-ashtabula-building-dept",
        "target_buyer": "Municipal Government",
        "demo_flow": "Permit application → Status tracking"
    },
    2: {
        "name": "Ashtabula Area Chamber of Commerce",
        "url": "https://newashtabula.vercel.app/ashtabula-area-chamber-of-commerce",
        "target_buyer": "Economic Development",
        "demo_flow": "Membership info → Contact form"
    },
    3: {
        "name": "Lakeland SBDC",
        "url": "https://newashtabula.vercel.app/lakeland-sbdc",
        "target_buyer": "Small Business Development Center",
        "demo_flow": "Services overview → Appointment booking"
    },
    4: {
        "name": "Ashtabula County Commissioners",
        "url": "https://newashtabula.vercel.app/ashtabula-county-commissioners",
        "target_buyer": "County Government",
        "demo_flow": "Department directory → Contact"
    }
}


class Tier1Verifier:
    """Automated verification for Tier 1 NAI sites (stdlib only)."""
    
    def __init__(self):
        self.results: List[Dict] = []
        # Create SSL context that allows us to connect to HTTPS sites
        self.ssl_context = ssl.create_default_context()
        self.ssl_context.check_hostname = False
        self.ssl_context.verify_mode = ssl.CERT_NONE
    
    def fetch_page(self, url: str) -> tuple:
        """Fetch page and return (success, html_content, status_code, load_time, error)."""
        try:
            headers = {
                "User-Agent": "NAI-Tier1-Verifier/1.0 (Quality Assurance)"
            }
            request = urllib.request.Request(url, headers=headers)
            
            start_time = time.time()
            response = urllib.request.urlopen(request, context=self.ssl_context, timeout=15)
            load_time = time.time() - start_time
            
            html = response.read().decode('utf-8', errors='ignore')
            status = response.getcode()
            
            return (True, html, status, load_time, None)
        except urllib.error.HTTPError as e:
            return (False, "", e.code, 0, str(e))
        except urllib.error.URLError as e:
            return (False, "", 0, 0, str(e.reason))
        except Exception as e:
            return (False, "", 0, 0, str(e))
    
    def check_page_load(self, url: str) -> Dict:
        """Check if page loads without errors."""
        success, html, status, load_time, error = self.fetch_page(url)
        
        if success and status == 200:
            return {
                "check_name": "Page Load",
                "passed": True,
                "details": f"Page loaded in {load_time:.2f}s (HTTP {status})",
                "severity": "info"
            }
        elif not success:
            return {
                "check_name": "Page Load",
                "passed": False,
                "details": f"Failed: {error}",
                "severity": "critical"
            }
        else:
            return {
                "check_name": "Page Load",
                "passed": False,
                "details": f"HTTP {status}",
                "severity": "critical"
            }
    
    def check_h1_heading(self, html: str) -> Dict:
        """Check if H1 heading is present."""
        h1_pattern = re.compile(r'<h1[^>]*>(.*?)</h1>', re.IGNORECASE | re.DOTALL)
        matches = h1_pattern.findall(html)
        
        if matches:
            h1_text = re.sub(r'<[^>]+>', '', matches[0]).strip()
            h1_display = h1_text[:50] + "..." if len(h1_text) > 50 else h1_text
            return {
                "check_name": "H1 Heading",
                "passed": True,
                "details": f"Found: '{h1_display}'",
                "severity": "info"
            }
        return {
            "check_name": "H1 Heading",
            "passed": False,
            "details": "No H1 heading found",
            "severity": "warning"
        }
    
    def check_forms(self, html: str) -> Dict:
        """Check for form presence."""
        form_pattern = re.compile(r'<form[^>]*>', re.IGNORECASE)
        forms = form_pattern.findall(html)
        
        # Also check for React form containers
        react_form_pattern = re.compile(r'class=["\'][^"\']*(?:form|contact|signup)[^"\']*["\']', re.IGNORECASE)
        react_forms = react_form_pattern.findall(html)
        
        if forms:
            return {
                "check_name": "Forms",
                "passed": True,
                "details": f"Found {len(forms)} form(s)",
                "severity": "info"
            }
        elif react_forms:
            return {
                "check_name": "Forms",
                "passed": True,
                "details": f"Found {len(react_forms)} potential React form containers",
                "severity": "info"
            }
        return {
            "check_name": "Forms",
            "passed": False,
            "details": "No forms detected (static scan)",
            "severity": "warning"
        }
    
    def check_responsive_meta(self, html: str) -> Dict:
        """Check for responsive viewport meta tag."""
        viewport_pattern = re.compile(r'<meta[^>]*name=["\']viewport["\'][^>]*>', re.IGNORECASE)
        viewport_match = viewport_pattern.search(html)
        
        if viewport_match and 'width=device-width' in viewport_match.group(0):
            return {
                "check_name": "Responsive Meta",
                "passed": True,
                "details": "Viewport meta configured correctly",
                "severity": "info"
            }
        return {
            "check_name": "Responsive Meta",
            "passed": False,
            "details": "Missing or improper viewport meta",
            "severity": "warning"
        }
    
    def check_mobile_indicators(self, html: str) -> Dict:
        """Check for mobile-friendly indicators."""
        has_viewport = 'width=device-width' in html
        tailwind_pattern = re.compile(r'class=["\'][^"\']*(sm:|md:|lg:|xl:)[^"\']*["\']')
        has_tailwind = bool(tailwind_pattern.search(html))
        
        if has_viewport and has_tailwind:
            return {
                "check_name": "Mobile Indicators",
                "passed": True,
                "details": "Viewport + Tailwind responsive classes detected",
                "severity": "info"
            }
        elif has_viewport:
            return {
                "check_name": "Mobile Indicators",
                "passed": True,
                "details": "Viewport meta present (basic mobile support)",
                "severity": "info"
            }
        return {
            "check_name": "Mobile Indicators",
            "passed": False,
            "details": "No mobile responsiveness indicators",
            "severity": "warning"
        }
    
    def check_cta_indicators(self, html: str) -> Dict:
        """Check for call-to-action indicators."""
        cta_patterns = [
            r'class=["\'][^"\']*(?:btn|button|cta)[^"\']*["\']',
            r'<button[^>]*>',
            r'Apply|Contact|Submit|Get Started|Learn More|Sign Up',
        ]
        
        cta_count = 0
        for pattern in cta_patterns:
            matches = re.findall(pattern, html, re.IGNORECASE)
            cta_count += len(matches)
        
        if cta_count > 0:
            return {
                "check_name": "CTA Elements",
                "passed": True,
                "details": f"Found ~{min(cta_count, 20)} CTA indicators",
                "severity": "info"
            }
        return {
            "check_name": "CTA Elements",
            "passed": False,
            "details": "No clear CTA elements detected",
            "severity": "warning"
        }
    
    def check_scripts(self, html: str) -> Dict:
        """Check for JavaScript (indicates React/interactive elements)."""
        script_pattern = re.compile(r'<script[^>]*>')
        scripts = script_pattern.findall(html)
        
        if len(scripts) > 0:
            return {
                "check_name": "JavaScript",
                "passed": True,
                "details": f"Found {len(scripts)} script tag(s) (interactive content present)",
                "severity": "info"
            }
        return {
            "check_name": "JavaScript",
            "passed": True,
            "details": "No JavaScript detected (static page)",
            "severity": "info"
        }
    
    def verify_site(self, site_num: int) -> Dict:
        """Run full verification on a single site."""
        site_info = TIER1_SITES[site_num]
        print(f"\n🔍 Verifying: {site_info['name']}")
        print(f"   URL: {site_info['url']}")
        print("-" * 60)
        
        # Fetch page
        load_result = self.check_page_load(site_info['url'])
        print(f"   {'✅' if load_result['passed'] else '❌'} {load_result['check_name']}: {load_result['details']}")
        
        checks = [load_result]
        html = ""
        
        if load_result['passed']:
            success, html, status, load_time, error = self.fetch_page(site_info['url'])
            
            # Run content checks
            content_checks = [
                self.check_h1_heading(html),
                self.check_forms(html),
                self.check_responsive_meta(html),
                self.check_mobile_indicators(html),
                self.check_cta_indicators(html),
                self.check_scripts(html),
            ]
            checks.extend(content_checks)
            
            for check in content_checks:
                icon = "✅" if check['passed'] else "⚠️" if check['severity'] == 'warning' else "❌"
                print(f"   {icon} {check['check_name']}: {check['details']}")
        else:
            print(f"   ⚠️  Page failed to load - skipping content checks")
        
        # Console errors note
        print(f"   ℹ️  Console Errors: ⚠️ MANUAL CHECK REQUIRED (open browser console)")
        
        # Overall result
        critical_failures = [c for c in checks if not c['passed'] and c['severity'] == 'critical']
        overall_pass = len(critical_failures) == 0
        
        print("-" * 60)
        print(f"   Result: {'✅ PASS' if overall_pass else '❌ FAIL'}")
        
        return {
            "site_name": site_info['name'],
            "url": site_info['url'],
            "target_buyer": site_info['target_buyer'],
            "demo_flow": site_info['demo_flow'],
            "timestamp": datetime.now().isoformat(),
            "overall_pass": overall_pass,
            "checks": checks,
            "manual_checklist": {
                "Page loads without console errors": False,
                "Hero section displays correctly": False,
                "Form renders with all fields visible": False,
                "Form validation works": False,
                "Submit button responds": False,
                "Mobile layout (375px) adapts": False,
                "Tablet layout (768px) adapts": False,
                "Contact information accurate": False,
                "Browser compatibility verified": False,
            }
        }
    
    def run_verification(self, site_num: Optional[int] = None) -> List[Dict]:
        """Run verification on specified site or all Tier 1 sites."""
        sites_to_check = [site_num] if site_num else list(TIER1_SITES.keys())
        
        print("=" * 70)
        print("NAI TIER 1 VERIFICATION ASSISTANT")
        print("Standard Library Edition - No external dependencies")
        print("=" * 70)
        
        for num in sites_to_check:
            if num not in TIER1_SITES:
                print(f"⚠️  Invalid site number: {num}")
                continue
            
            report = self.verify_site(num)
            self.results.append(report)
        
        return self.results
    
    def generate_markdown_report(self, output_file: str):
        """Generate verification report in markdown format."""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        lines = [
            "# NAI Tier 1 Verification Report",
            "",
            f"**Generated:** {timestamp}",
            "**Tool:** Tier 1 Verification Assistant v1.0",
            "**Scope:** Automated checks + Manual checklist",
            "",
            "## Executive Summary",
            "",
        ]
        
        # Summary
        total = len(self.results)
        passed = sum(1 for r in self.results if r['overall_pass'])
        
        lines.extend([
            f"| Metric | Count |",
            f"|--------|-------|",
            f"| Sites Checked | {total} |",
            f"| Automated Pass | {passed}/{total} |",
            f"| Manual Review Required | {total} |",
            "",
            "## Detailed Results",
            "",
        ])
        
        # Per-site details
        for report in self.results:
            status = "✅ PASS" if report['overall_pass'] else "❌ FAIL"
            lines.extend([
                f"### {report['site_name']}",
                "",
                f"**Status:** {status}",
                f"**URL:** {report['url']}",
                f"**Target Buyer:** {report['target_buyer']}",
                f"**Demo Flow:** {report['demo_flow']}",
                f"**Timestamp:** {report['timestamp']}",
                "",
                "#### Automated Checks",
                "",
                "| Check | Status | Details |",
                "|-------|--------|--------|",
            ])
            
            for check in report['checks']:
                icon = "✅" if check['passed'] else "⚠️" if check['severity'] == 'warning' else "❌"
                details = check['details'].replace('|', '\\|')
                lines.append(f"| {check['check_name']} | {icon} | {details} |")
            
            lines.append("| Console Errors | ℹ️ | ⚠️ MANUAL CHECK REQUIRED |")
            
            lines.extend([
                "",
                "#### Manual Verification Checklist",
                "",
                "The following require human verification (browser testing):",
                "",
            ])
            
            for item, checked in report['manual_checklist'].items():
                box = "[x]" if checked else "[ ]"
                lines.append(f"- {box} {item}")
            
            lines.append("")
        
        # Sign-off
        lines.extend([
            "---",
            "",
            "## Sign-Off",
            "",
            "**Automated Verification:** Tier 1 Verification Assistant",
            f"**Date:** {timestamp}",
            "",
            "**Manual Verification By:** _______________",
            "**Date:** _______________",
            "",
            "### Ready for Outreach",
            "",
        ])
        
        for report in self.results:
            auto = "✅" if report['overall_pass'] else "❌"
            lines.append(f"- [ ] {report['site_name']} (Auto: {auto}, Manual: ☐)")
        
        lines.extend([
            "",
            "**All Tier 1 Sites Verified:** ☐ Yes ☐ No",
            "",
            "**Blockers for Outreach:**",
            "- ",
            "",
        ])
        
        with open(output_file, 'w') as f:
            f.write('\n'.join(lines))
        
        print(f"\n📝 Report saved: {output_file}")
    
    def generate_json_report(self, output_file: str):
        """Generate JSON report."""
        data = {
            "timestamp": datetime.now().isoformat(),
            "total_sites": len(self.results),
            "passed_automated": sum(1 for r in self.results if r['overall_pass']),
            "sites": self.results
        }
        
        with open(output_file, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"📝 JSON report saved: {output_file}")


def main():
    parser = argparse.ArgumentParser(
        description="NAI Tier 1 Verification Assistant (Stdlib Only)"
    )
    parser.add_argument('--site', type=int, choices=[1, 2, 3, 4],
                        help='Verify specific site (1-4)')
    parser.add_argument('--output', '-o', type=str, default='tier1_verification_report.md',
                        help='Output markdown file')
    parser.add_argument('--json', type=str, help='Output JSON file')
    
    args = parser.parse_args()
    
    # Run verification
    verifier = Tier1Verifier()
    verifier.run_verification(site_num=args.site)
    
    print("\n" + "=" * 70)
    print("GENERATING REPORTS")
    print("=" * 70)
    
    # Generate reports
    verifier.generate_markdown_report(args.output)
    if args.json:
        verifier.generate_json_report(args.json)
    
    print("\n" + "=" * 70)
    print("VERIFICATION COMPLETE")
    print("=" * 70)
    print(f"\n⚠️  NOTE: Automated checks finished.")
    print(f"   Manual verification of checklist items is required before outreach.")


if __name__ == "__main__":
    main()
