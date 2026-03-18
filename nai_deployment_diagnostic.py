#!/usr/bin/env python3
"""
NAI Deployment Diagnostic Tool
Diagnoses 404 errors on Tier 1 sites and provides actionable remediation steps.
"""

import json
import socket
import ssl
import subprocess
import sys
import time
import urllib.request
from datetime import datetime
from urllib.parse import urlparse

# Tier 1 Sites
TIER1_SITES = {
    "city-of-ashtabula-building-dept": {
        "name": "City of Ashtabula Building Dept",
        "url": "https://newashtabula.vercel.app/city-of-ashtabula-building-dept",
        "priority": "P0"
    },
    "ashtabula-area-chamber-of-commerce": {
        "name": "Ashtabula Area Chamber of Commerce", 
        "url": "https://newashtabula.vercel.app/ashtabula-area-chamber-of-commerce",
        "priority": "P0"
    },
    "lakeland-sbdc": {
        "name": "Lakeland SBDC",
        "url": "https://newashtabula.vercel.app/lakeland-sbdc",
        "priority": "P0"
    },
    "ashtabula-county-commissioners": {
        "name": "Ashtabula County Commissioners",
        "url": "https://newashtabula.vercel.app/ashtabula-county-commissioners",
        "priority": "P0"
    }
}

# Alternative base URLs to test
ALT_BASE_URLS = [
    "https://newashtabula.vercel.app",
    "https://newashtabula-git-main.vercel.app",
    "https://newashtabula-nai.vercel.app"
]

class DeploymentDiagnostic:
    """Diagnose NAI deployment issues."""
    
    def __init__(self):
        self.results = {}
        self.recommendations = []
        self.ssl_context = ssl.create_default_context()
        self.ssl_context.check_hostname = False
        self.ssl_context.verify_mode = ssl.CERT_NONE
    
    def check_dns_resolution(self, hostname):
        """Check if domain resolves."""
        try:
            ip = socket.gethostbyname(hostname)
            return {"status": "ok", "ip": ip, "error": None}
        except socket.gaierror as e:
            return {"status": "fail", "ip": None, "error": str(e)}
    
    def check_http_response(self, url, follow_redirects=True):
        """Check HTTP response with detailed diagnostics."""
        try:
            headers = {
                "User-Agent": "NAI-Diagnostic/1.0 (Deployment Check)"
            }
            request = urllib.request.Request(url, headers=headers, method='GET')
            
            start = time.time()
            response = urllib.request.urlopen(
                request, 
                context=self.ssl_context, 
                timeout=30
            )
            elapsed = time.time() - start
            
            return {
                "status": "success",
                "code": response.getcode(),
                "url": response.geturl(),
                "headers": dict(response.headers),
                "elapsed_ms": round(elapsed * 1000, 2),
                "error": None
            }
        except urllib.error.HTTPError as e:
            return {
                "status": "http_error",
                "code": e.code,
                "url": e.url,
                "headers": dict(e.headers) if e.headers else {},
                "elapsed_ms": None,
                "error": str(e)
            }
        except urllib.error.URLError as e:
            return {
                "status": "url_error",
                "code": None,
                "url": url,
                "headers": {},
                "elapsed_ms": None,
                "error": str(e.reason)
            }
        except Exception as e:
            return {
                "status": "exception",
                "code": None,
                "url": url,
                "headers": {},
                "elapsed_ms": None,
                "error": str(e)
            }
    
    def check_site(self, site_id, site_info):
        """Run full diagnostic on a single site."""
        url = site_info["url"]
        parsed = urlparse(url)
        hostname = parsed.hostname
        path = parsed.path
        
        print(f"\n{'='*60}")
        print(f"🔍 Diagnosing: {site_info['name']}")
        print(f"   URL: {url}")
        print(f"   Priority: {site_info['priority']}")
        print(f"{'='*60}")
        
        result = {
            "site_id": site_id,
            "name": site_info["name"],
            "url": url,
            "tests": {},
            "findings": [],
            "recommendations": []
        }
        
        # 1. DNS Resolution
        print("\n📡 DNS Resolution Test...")
        dns = self.check_dns_resolution(hostname)
        result["tests"]["dns"] = dns
        if dns["status"] == "ok":
            print(f"   ✅ Resolves to: {dns['ip']}")
        else:
            print(f"   ❌ DNS Failed: {dns['error']}")
            result["findings"].append("DNS_RESOLUTION_FAILED")
            result["recommendations"].append("Check domain registration and DNS configuration")
        
        # 2. HTTP Response
        print("\n🌐 HTTP Response Test...")
        http = self.check_http_response(url)
        result["tests"]["http"] = http
        
        if http["status"] == "success":
            print(f"   ✅ HTTP {http['code']} in {http['elapsed_ms']}ms")
            result["findings"].append("SITE_ACCESSIBLE")
        elif http["status"] == "http_error":
            print(f"   ❌ HTTP {http['code']}: {http['error']}")
            if http['code'] == 404:
                result["findings"].append("HTTP_404_NOT_FOUND")
                result["recommendations"].append("Path does not exist - check Vercel routing configuration")
                result["recommendations"].append("Verify build output includes this path")
                result["recommendations"].append("Check vercel.json rewrites configuration")
            elif http['code'] == 500:
                result["findings"].append("HTTP_500_SERVER_ERROR")
                result["recommendations"].append("Server error - check Vercel function logs")
        else:
            print(f"   ❌ Error: {http['error']}")
            result["findings"].append(f"CONNECTION_FAILED: {http['status']}")
        
        # 3. Check root domain
        print("\n🏠 Root Domain Test...")
        root_url = f"{parsed.scheme}://{hostname}"
        root_http = self.check_http_response(root_url)
        result["tests"]["root_http"] = root_http
        
        if root_http["status"] == "success":
            print(f"   ✅ Root domain accessible (HTTP {root_http['code']})")
            if "404" in str(result["findings"]):
                result["recommendations"].append("Root works but path fails - SPA routing issue likely")
        else:
            print(f"   ❌ Root domain failed: {root_http.get('code', 'N/A')}")
            result["findings"].append("ROOT_DOMAIN_FAILED")
        
        # 4. Check alternative URLs
        print("\n🔗 Alternative URL Tests...")
        alt_results = []
        for alt_base in ALT_BASE_URLS:
            alt_url = f"{alt_base}{path}"
            alt_http = self.check_http_response(alt_url)
            alt_results.append({
                "url": alt_url,
                "status": alt_http["status"],
                "code": alt_http.get("code")
            })
            status_icon = "✅" if alt_http["status"] == "success" else "❌"
            print(f"   {status_icon} {alt_url} -> {alt_http.get('code', 'FAIL')}")
        result["tests"]["alternatives"] = alt_results
        
        # Summary
        print(f"\n{'-'*60}")
        print(f"📊 Summary for {site_info['name']}:")
        if "HTTP_404_NOT_FOUND" in result["findings"]:
            print(f"   🔴 CRITICAL: Site returning 404")
            print(f"   🔧 Likely cause: Deployment/routing misconfiguration")
        elif "SITE_ACCESSIBLE" in result["findings"]:
            print(f"   🟢 Site is accessible")
        else:
            print(f"   🟡 Site has connectivity issues")
        
        if result["recommendations"]:
            print(f"\n   📋 Recommendations:")
            for rec in result["recommendations"]:
                print(f"      • {rec}")
        
        self.results[site_id] = result
        return result
    
    def generate_remediation_plan(self):
        """Generate remediation plan based on findings."""
        print(f"\n{'='*60}")
        print("🔧 DEPLOYMENT REMEDIATION PLAN")
        print(f"{'='*60}")
        
        all_404 = all(
            "HTTP_404_NOT_FOUND" in r["findings"] 
            for r in self.results.values()
        )
        
        if all_404:
            print("\n🔴 ALL SITES RETURNING 404")
            print("\nThis indicates a systemic deployment issue.\n")
            
            plan = [
                ("IMMEDIATE (Next 15 min)", [
                    "Check Vercel dashboard for deployment status",
                    "Verify latest deployment succeeded",
                    "Check build logs for errors",
                    "Verify Git repository sync status"
                ]),
                ("SHORT-TERM (Next 30 min)", [
                    "Review vercel.json routing configuration",
                    "Check if SPA fallback is configured",
                    "Verify all 77 site paths are in build output",
                    "Test deployment with 'vercel --prod' if needed"
                ]),
                ("MEDIUM-TERM (Next 2 hours)", [
                    "Redeploy if configuration was fixed",
                    "Run full QA suite post-deployment",
                    "Verify all Tier 1 sites load correctly",
                    "Update deployment documentation"
                ])
            ]
            
            for phase, steps in plan:
                print(f"\n{phase}:")
                for step in steps:
                    print(f"  ☐ {step}")
            
            print(f"\n{'='*60}")
            print("VERCEL CLI COMMANDS TO TRY:")
            print(f"{'='*60}")
            print("  cd ~/ai-stack/websites/new-ashtabula-initiative")
            print("  vercel --version              # Check CLI")
            print("  vercel list                   # List deployments")
            print("  vercel inspect newashtabula   # Check deployment details")
            print("  vercel --prod                 # Force redeploy")
            print(f"{'='*60}")
            
            return plan
        else:
            print("\n🟡 MIXED RESULTS - Check individual site reports above")
            return []
    
    def generate_report(self, output_file):
        """Generate JSON report."""
        report = {
            "timestamp": datetime.now().isoformat(),
            "tool": "NAI Deployment Diagnostic v1.0",
            "summary": {
                "total_sites": len(self.results),
                "sites_with_404": sum(
                    1 for r in self.results.values() 
                    if "HTTP_404_NOT_FOUND" in r["findings"]
                ),
                "sites_accessible": sum(
                    1 for r in self.results.values() 
                    if "SITE_ACCESSIBLE" in r["findings"]
                )
            },
            "results": self.results,
            "blocker_status": "CRITICAL" if all(
                "HTTP_404_NOT_FOUND" in r["findings"] 
                for r in self.results.values()
            ) else "PARTIAL"
        }
        
        with open(output_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"\n📝 Detailed report saved: {output_file}")
        return report
    
    def run_all(self):
        """Run full diagnostic suite."""
        print(f"{'='*60}")
        print("NAI DEPLOYMENT DIAGNOSTIC TOOL")
        print(f"{'='*60}")
        print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"Sites to check: {len(TIER1_SITES)}")
        
        for site_id, site_info in TIER1_SITES.items():
            self.check_site(site_id, site_info)
        
        # Generate remediation plan
        self.generate_remediation_plan()
        
        # Generate report
        report = self.generate_report("nai_deployment_diagnostic_report.json")
        
        # Final summary
        print(f"\n{'='*60}")
        print("FINAL SUMMARY")
        print(f"{'='*60}")
        print(f"Sites checked: {report['summary']['total_sites']}")
        print(f"Returning 404: {report['summary']['sites_with_404']}")
        print(f"Accessible: {report['summary']['sites_accessible']}")
        print(f"Blocker Status: {report['blocker_status']}")
        print(f"{'='*60}")
        
        return report


def main():
    diagnostic = DeploymentDiagnostic()
    report = diagnostic.run_all()
    
    # Exit with error code if critical blocker
    if report["blocker_status"] == "CRITICAL":
        print("\n⚠️  CRITICAL BLOCKER DETECTED")
        print("   NAI outreach cannot resume until deployment is fixed.")
        sys.exit(1)
    else:
        print("\n✅ No critical blockers detected")
        sys.exit(0)


if __name__ == "__main__":
    main()
