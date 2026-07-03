#!/usr/bin/env python3
"""
NAI API Integration Tester
New Ashtabula Initiative — Phase 3 QA

Tests API endpoints and integrations across NAI sites:
- Health check endpoints
- External API connectivity
- CORS configuration
- Response validation
- Error handling

Usage:
    python3 nai_api_tester.py scan              # Discover API endpoints
    python3 nai_api_tester.py test --endpoint   # Test specific endpoint
    python3 nai_api_tester.py test-all          # Run all API tests
    python3 nai_api_tester.py report            # Generate report
"""

import argparse
import json
import csv
import re
import sys
from pathlib import Path
from dataclasses import dataclass, asdict, field
from typing import List, Dict, Optional, Tuple, Any
from datetime import datetime
from urllib.parse import urljoin, urlparse
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

# Configuration
BASE_URL = "https://newashtabula.vercel.app"
WEBSITES_DIR = Path(__file__).parent.parent / "websites"
REPORTS_DIR = Path(__file__).parent.parent / "reports"
REPORTS_DIR.mkdir(exist_ok=True)

# Request timeout
TIMEOUT = 10

# Common API patterns to check in code
API_PATTERNS = [
    r'fetch\([\'"]([^\'"]+)[\'"]',
    r'axios\.[getpostputdelete]+\([\'"]([^\'"]+)[\'"]',
    r'\.then\(response\s*=>',
    r'apiUrl\s*[=:]\s*[\'"]([^\'"]+)[\'"]',
    r'endpoint\s*[=:]\s*[\'"]([^\'"]+)[\'"]',
    r'url\s*[=:]\s*[\'"](https?://[^\'"]+)[\'"]',
]

# Common API endpoint patterns
ENDPOINT_PATTERNS = [
    '/api/',
    '/api/v1/',
    '/api/v2/',
    '/.netlify/functions/',
    '/_vercel/',
    '/api/auth/',
    '/api/contact',
    '/api/submit',
    '/api/form',
]


@dataclass
class APIEndpoint:
    """Represents a discovered API endpoint."""
    path: str
    method: str
    source: str  # Where it was found (file/line)
    is_external: bool
    domain: Optional[str] = None


@dataclass
class APITestResult:
    """Result of testing an API endpoint."""
    endpoint: str
    method: str
    status_code: Optional[int]
    response_time_ms: float
    success: bool
    error_message: Optional[str]
    cors_enabled: bool
    content_type: Optional[str]
    issues: List[str] = field(default_factory=list)


@dataclass
class SiteAPIResult:
    """API test results for a single site."""
    site_name: str
    site_url: str
    endpoints_discovered: int
    endpoints_tested: int
    endpoints_passing: int
    endpoints_failing: int
    external_apis: List[str]
    results: List[APITestResult]
    issues: List[str]
    status: str


class APITester:
    """Tests API integrations across NAI websites."""

    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url
        self.results: List[SiteAPIResult] = []
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'NAI-QA-APITester/1.0',
            'Accept': 'application/json, text/plain, */*'
        })

    def get_site_folders(self) -> List[Path]:
        """Get all website directories."""
        if not WEBSITES_DIR.exists():
            return []
        return [d for d in WEBSITES_DIR.iterdir() if d.is_dir()]

    def scan_file_for_apis(self, file_path: Path) -> List[APIEndpoint]:
        """Scan a file for API endpoint references."""
        endpoints = []
        try:
            content = file_path.read_text(encoding='utf-8', errors='ignore')
            lines = content.split('\n')

            for line_num, line in enumerate(lines, 1):
                for pattern in API_PATTERNS:
                    matches = re.finditer(pattern, line, re.IGNORECASE)
                    for match in matches:
                        # Extract the URL/path
                        url = match.group(1) if match.groups() else match.group(0)
                        if url and len(url) > 3:
                            # Determine if external
                            is_external = url.startswith('http')
                            domain = None
                            if is_external:
                                try:
                                    domain = urlparse(url).netloc
                                except:
                                    pass

                            endpoints.append(APIEndpoint(
                                path=url,
                                method='GET',  # Default assumption
                                source=f"{file_path.name}:{line_num}",
                                is_external=is_external,
                                domain=domain
                            ))

            # Also look for explicit endpoint patterns
            for endpoint_pattern in ENDPOINT_PATTERNS:
                if endpoint_pattern in content:
                    # Find lines with this pattern
                    for line_num, line in enumerate(lines, 1):
                        if endpoint_pattern in line:
                            # Extract the full path
                            match = re.search(rf'["\']({re.escape(endpoint_pattern)}[^"\']*)["\']', line)
                            if match:
                                path = match.group(1)
                                if not any(e.path == path for e in endpoints):
                                    endpoints.append(APIEndpoint(
                                        path=path,
                                        method='GET',
                                        source=f"{file_path.name}:{line_num}",
                                        is_external=False
                                    ))

        except Exception as e:
            pass

        return endpoints

    def scan_site_for_apis(self, site_folder: Path) -> List[APIEndpoint]:
        """Scan a site directory for API references."""
        all_endpoints = []

        # Scan HTML and JS files
        for ext in ['*.html', '*.js', '*.jsx', '*.ts', '*.tsx']:
            for file_path in site_folder.rglob(ext):
                endpoints = self.scan_file_for_apis(file_path)
                all_endpoints.extend(endpoints)

        # Deduplicate
        seen = set()
        unique = []
        for ep in all_endpoints:
            key = f"{ep.method}:{ep.path}"
            if key not in seen:
                seen.add(key)
                unique.append(ep)

        return unique

    def test_endpoint(self, endpoint: APIEndpoint, site_url: str) -> APITestResult:
        """Test a single API endpoint."""
        import time

        # Construct full URL
        if endpoint.is_external:
            url = endpoint.path
        else:
            url = urljoin(site_url, endpoint.path)

        start_time = time.time()
        issues = []

        try:
            response = self.session.request(
                method=endpoint.method,
                url=url,
                timeout=TIMEOUT,
                allow_redirects=True
            )
            elapsed = (time.time() - start_time) * 1000

            # Check CORS
            cors_enabled = 'access-control-allow-origin' in response.headers

            # Determine success
            success = response.status_code < 400
            if response.status_code == 404:
                success = False
                issues.append("Endpoint returned 404")
            elif response.status_code >= 500:
                success = False
                issues.append(f"Server error: {response.status_code}")

            return APITestResult(
                endpoint=url,
                method=endpoint.method,
                status_code=response.status_code,
                response_time_ms=round(elapsed, 2),
                success=success,
                error_message=None,
                cors_enabled=cors_enabled,
                content_type=response.headers.get('content-type'),
                issues=issues
            )

        except requests.exceptions.Timeout:
            return APITestResult(
                endpoint=url,
                method=endpoint.method,
                status_code=None,
                response_time_ms=(time.time() - start_time) * 1000,
                success=False,
                error_message="Request timeout",
                cors_enabled=False,
                issues=[f"Timeout after {TIMEOUT}s"]
            )
        except requests.exceptions.ConnectionError as e:
            return APITestResult(
                endpoint=url,
                method=endpoint.method,
                status_code=None,
                response_time_ms=(time.time() - start_time) * 1000,
                success=False,
                error_message="Connection error",
                cors_enabled=False,
                issues=[f"Connection failed: {str(e)[:50]}"]
            )
        except Exception as e:
            return APITestResult(
                endpoint=url,
                method=endpoint.method,
                status_code=None,
                response_time_ms=(time.time() - start_time) * 1000,
                success=False,
                error_message=str(e),
                cors_enabled=False,
                issues=[f"Error: {str(e)[:50]}"]
            )

    def test_site_apis(self, site_folder: Path) -> SiteAPIResult:
        """Test all APIs for a single site."""
        site_name = site_folder.name
        site_url = f"{self.base_url}/{site_name}"

        print(f"  Scanning {site_name}...", end=" ")

        # Discover endpoints
        endpoints = self.scan_site_for_apis(site_folder)

        if not endpoints:
            print("0 APIs found")
            return SiteAPIResult(
                site_name=site_name,
                site_url=site_url,
                endpoints_discovered=0,
                endpoints_tested=0,
                endpoints_passing=0,
                endpoints_failing=0,
                external_apis=[],
                results=[],
                issues=[],
                status="pass"  # No APIs is fine for static sites
            )

        # Filter to unique external domains for reporting
        external_domains = list(set(
            ep.domain for ep in endpoints
            if ep.is_external and ep.domain
        ))

        # Test endpoints (limit to avoid overwhelming)
        test_endpoints = endpoints[:10]  # Test first 10 discovered
        results = []

        for ep in test_endpoints:
            result = self.test_endpoint(ep, site_url)
            results.append(result)

        passing = sum(1 for r in results if r.success)
        failing = sum(1 for r in results if not r.success)

        all_issues = []
        for r in results:
            all_issues.extend(r.issues)

        status = "fail" if failing > 0 else "pass"

        print(f"{len(endpoints)} APIs, {passing}/{len(results)} passing")

        return SiteAPIResult(
            site_name=site_name,
            site_url=site_url,
            endpoints_discovered=len(endpoints),
            endpoints_tested=len(results),
            endpoints_passing=passing,
            endpoints_failing=failing,
            external_apis=external_domains,
            results=results,
            issues=all_issues,
            status=status
        )

    def test_all_sites(self) -> List[SiteAPIResult]:
        """Test APIs across all sites."""
        print("🔍 Testing API integrations across NAI sites...")
        site_folders = self.get_site_folders()
        print(f"Found {len(site_folders)} site directories\n")

        results = []
        for i, site_folder in enumerate(site_folders, 1):
            result = self.test_site_apis(site_folder)
            results.append(result)

        self.results = results
        return results

    def generate_json_report(self, output_path: Optional[Path] = None) -> Path:
        """Generate JSON report."""
        if output_path is None:
            timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
            output_path = REPORTS_DIR / f"api-test-{timestamp}.json"

        report = {
            "generated_at": datetime.now().isoformat(),
            "base_url": self.base_url,
            "total_sites": len(self.results),
            "sites_with_apis": sum(1 for r in self.results if r.endpoints_discovered > 0),
            "sites_passing": sum(1 for r in self.results if r.status == "pass"),
            "sites_failing": sum(1 for r in self.results if r.status == "fail"),
            "total_apis_discovered": sum(r.endpoints_discovered for r in self.results),
            "external_services_used": list(set(
                domain
                for r in self.results
                for domain in r.external_apis
            )),
            "results": [
                {
                    **asdict(r),
                    "results": [asdict(t) for t in r.results]
                }
                for r in self.results
            ]
        }

        output_path.write_text(json.dumps(report, indent=2))
        print(f"\n📄 JSON report saved: {output_path}")
        return output_path

    def generate_csv_report(self, output_path: Optional[Path] = None) -> Path:
        """Generate CSV summary report."""
        if output_path is None:
            timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
            output_path = REPORTS_DIR / f"api-test-{timestamp}.csv"

        with open(output_path, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([
                'Site Name', 'Site URL', 'APIs Found', 'APIs Tested',
                'Passing', 'Failing', 'External Services', 'Status', 'Issues'
            ])
            for r in self.results:
                writer.writerow([
                    r.site_name,
                    r.site_url,
                    r.endpoints_discovered,
                    r.endpoints_tested,
                    r.endpoints_passing,
                    r.endpoints_failing,
                    ', '.join(r.external_apis) if r.external_apis else 'None',
                    r.status,
                    '; '.join(r.issues) if r.issues else 'None'
                ])

        print(f"📄 CSV report saved: {output_path}")
        return output_path

    def generate_markdown_report(self, output_path: Optional[Path] = None) -> Path:
        """Generate Markdown report."""
        if output_path is None:
            timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
            output_path = REPORTS_DIR / f"api-test-{timestamp}.md"

        all_external = list(set(
            domain
            for r in self.results
            for domain in r.external_apis
        ))

        lines = [
            "# NAI API Integration Test Report",
            f"",
            f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            f"**Base URL:** {self.base_url}",
            f"",
            "## Summary",
            f"",
            f"| Metric | Count |",
            f"|--------|-------|",
            f"| Total Sites | {len(self.results)} |",
            f"| Sites with APIs | {sum(1 for r in self.results if r.endpoints_discovered > 0)} |",
            f"| ✅ Passing | {sum(1 for r in self.results if r.status == 'pass')} |",
            f"| ❌ Failing | {sum(1 for r in self.results if r.status == 'fail')} |",
            f"| Total APIs Discovered | {sum(r.endpoints_discovered for r in self.results)} |",
            f"",
        ]

        if all_external:
            lines.extend([
                "## External Services Used",
                f"",
            ])
            for domain in sorted(all_external):
                lines.append(f"- `{domain}`")
            lines.append(f"")

        lines.extend([
            "## Results by Site",
            f"",
            "| Site | APIs | Tested | Pass | Fail | Status |",
            "|------|------|--------|------|------|--------|",
        ])

        for r in self.results:
            if r.endpoints_discovered > 0:
                status_emoji = "✅" if r.status == "pass" else "❌"
                lines.append(f"| [{r.site_name}]({r.site_url}) | {r.endpoints_discovered} | {r.endpoints_tested} | {r.endpoints_passing} | {r.endpoints_failing} | {status_emoji} |")

        lines.extend([
            f"",
            "## Sites with API Issues",
            f"",
        ])

        sites_with_issues = [r for r in self.results if r.issues and r.endpoints_discovered > 0]
        if sites_with_issues:
            for r in sites_with_issues:
                lines.append(f"### {r.site_name}")
                lines.append(f"")
                lines.append(f"**External APIs:** {', '.join(r.external_apis) if r.external_apis else 'None'}")
                lines.append(f"")
                for test_result in r.results:
                    if not test_result.success:
                        lines.append(f"- ❌ `{test_result.method} {test_result.endpoint}`")
                        lines.append(f"  - Status: {test_result.status_code or 'N/A'}")
                        lines.append(f"  - Error: {test_result.error_message or 'Unknown'}")
                lines.append(f"")
        else:
            lines.append("🎉 No API issues found across all sites with APIs!")

        output_path.write_text('\n'.join(lines))
        print(f"📄 Markdown report saved: {output_path}")
        return output_path

    def print_summary(self):
        """Print console summary."""
        total_apis = sum(r.endpoints_discovered for r in self.results)
        sites_with_apis = sum(1 for r in self.results if r.endpoints_discovered > 0)

        print(f"\n{'='*60}")
        print("API INTEGRATION TEST SUMMARY")
        print(f"{'='*60}")
        print(f"Total Sites Scanned: {len(self.results)}")
        print(f"Sites with APIs: {sites_with_apis}")
        print(f"Total APIs Discovered: {total_apis}")
        print(f"✅ Passing: {sum(1 for r in self.results if r.status == 'pass')}")
        print(f"❌ Failing: {sum(1 for r in self.results if r.status == 'fail')}")
        print(f"{'='*60}")


def main():
    parser = argparse.ArgumentParser(
        description="NAI API Integration Tester",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 nai_api_tester.py scan           # Scan all sites for APIs
  python3 nai_api_tester.py report         # Generate all reports
  python3 nai_api_tester.py test-all       # Test all discovered APIs
        """
    )
    parser.add_argument(
        'command',
        choices=['scan', 'test', 'test-all', 'report'],
        help='Command to run'
    )
    parser.add_argument(
        '--endpoint',
        help='Specific endpoint to test'
    )
    parser.add_argument(
        '--base-url',
        default=BASE_URL,
        help=f'Base URL for sites (default: {BASE_URL})'
    )
    parser.add_argument(
        '--output-dir',
        type=Path,
        default=REPORTS_DIR,
        help=f'Output directory for reports (default: {REPORTS_DIR})'
    )

    args = parser.parse_args()

    tester = APITester(base_url=args.base_url)

    if args.command == 'scan':
        tester.test_all_sites()
        tester.print_summary()

    elif args.command == 'test-all':
        tester.test_all_sites()
        tester.print_summary()

    elif args.command == 'report':
        if not tester.results:
            tester.test_all_sites()
        tester.generate_json_report()
        tester.generate_csv_report()
        tester.generate_markdown_report()


if __name__ == '__main__':
    main()
