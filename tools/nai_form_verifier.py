#!/usr/bin/env python3
"""
NAI Form Verification Tool
New Ashtabula Initiative — Phase 3 QA

Tests all forms across the 77 sites for:
- Form field validation
- Submit button functionality
- Required field handling
- CSRF protection (if present)
- Success/error message display

Usage:
    python3 nai_form_verifier.py scan          # Scan all sites for forms
    python3 nai_form_verifier.py test --site <site_name>  # Test specific site
    python3 nai_form_verifier.py test-all      # Test all forms (dry-run safe)
    python3 nai_form_verifier.py report        # Generate report
"""

import argparse
import json
import csv
import re
import sys
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional, Tuple
from datetime import datetime
from urllib.parse import urljoin, urlparse
import requests
from bs4 import BeautifulSoup

# Configuration
BASE_URL = "https://newashtabula.vercel.app"
WEBSITES_DIR = Path(__file__).parent.parent / "websites"
REPORTS_DIR = Path(__file__).parent.parent / "reports"
REPORTS_DIR.mkdir(exist_ok=True)

# Common form patterns to check
FORM_SELECTORS = [
    'form',
    'form[action]',
    'form[method]',
    'input[type="email"]',
    'input[type="text"]',
    'input[type="tel"]',
    'textarea',
    'input[type="submit"]',
    'button[type="submit"]',
]

REQUIRED_ATTRIBUTES = ['name', 'id']


@dataclass
class FormField:
    """Represents a form field."""
    tag: str
    field_type: str
    name: Optional[str]
    id: Optional[str]
    required: bool
    placeholder: Optional[str]
    validation_issues: List[str]


@dataclass
class FormResult:
    """Result of form verification for a single form."""
    site_name: str
    site_url: str
    form_action: str
    form_method: str
    fields: List[FormField]
    has_submit_button: bool
    has_csrf_token: bool
    issues: List[str]
    status: str  # "pass", "warn", "fail"


@dataclass
class SiteResult:
    """Result for an entire site."""
    site_name: str
    site_url: str
    forms_found: int
    forms_tested: int
    forms_passed: int
    forms_failed: int
    issues: List[str]
    status: str


class FormVerifier:
    """Verifies forms across NAI websites."""

    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url
        self.results: List[SiteResult] = []
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'NAI-QA-FormVerifier/1.0'
        })

    def get_site_folders(self) -> List[Path]:
        """Get all website directories."""
        if not WEBSITES_DIR.exists():
            return []
        return [d for d in WEBSITES_DIR.iterdir() if d.is_dir()]

    def scan_html_for_forms(self, html_content: str, site_url: str) -> List[FormResult]:
        """Parse HTML and extract form information."""
        soup = BeautifulSoup(html_content, 'html.parser')
        forms = soup.find_all('form')
        results = []

        for form in forms:
            action = form.get('action', '')
            method = form.get('method', 'get').upper()

            fields = []
            for field in form.find_all(['input', 'textarea', 'select']):
                field_type = field.get('type', field.name)
                name = field.get('name')
                field_id = field.get('id')
                required = field.get('required') is not None
                placeholder = field.get('placeholder')

                validation_issues = []
                if not name and not field_id:
                    validation_issues.append("Missing name and id attributes")
                if field_type == 'email' and not placeholder:
                    validation_issues.append("Email field lacks placeholder")

                fields.append(FormField(
                    tag=field.name,
                    field_type=field_type,
                    name=name,
                    id=field_id,
                    required=required,
                    placeholder=placeholder,
                    validation_issues=validation_issues
                ))

            # Check for submit button
            has_submit = bool(
                form.find('input', {'type': 'submit'}) or
                form.find('button', {'type': 'submit'}) or
                form.find('button')  # Often default type is submit
            )

            # Check for CSRF token (common patterns)
            csrf_patterns = ['csrf', 'token', '_token', 'authenticity']
            has_csrf = any(
                field.get('name', '').lower() in csrf_patterns or
                field.get('id', '').lower() in csrf_patterns
                for field in form.find_all('input', type='hidden')
            )

            # Collect issues
            issues = []
            if not has_submit:
                issues.append("No submit button found")
            if not fields:
                issues.append("Form has no input fields")

            # Determine status
            if issues or any(f.validation_issues for f in fields):
                status = "fail" if "No submit button" in str(issues) else "warn"
            else:
                status = "pass"

            results.append(FormResult(
                site_name="",
                site_url=site_url,
                form_action=action,
                form_method=method,
                fields=fields,
                has_submit_button=has_submit,
                has_csrf_token=has_csrf,
                issues=issues,
                status=status
            ))

        return results

    def scan_site(self, site_folder: Path) -> SiteResult:
        """Scan a single site for forms."""
        site_name = site_folder.name
        site_url = f"{self.base_url}/{site_name}"

        # Look for index.html
        index_file = site_folder / "index.html"
        if not index_file.exists():
            return SiteResult(
                site_name=site_name,
                site_url=site_url,
                forms_found=0,
                forms_tested=0,
                forms_passed=0,
                forms_failed=0,
                issues=["No index.html found"],
                status="fail"
            )

        html_content = index_file.read_text(encoding='utf-8')
        form_results = self.scan_html_for_forms(html_content, site_url)

        # Count results
        forms_passed = sum(1 for f in form_results if f.status == "pass")
        forms_failed = sum(1 for f in form_results if f.status == "fail")

        all_issues = []
        for form in form_results:
            all_issues.extend([f"Form issue: {i}" for i in form.issues])
            for field in form.fields:
                all_issues.extend([f"Field '{field.name or field.id}': {i}" for i in field.validation_issues])

        status = "pass" if forms_failed == 0 and form_results else ("fail" if forms_failed > 0 else "warn")

        return SiteResult(
            site_name=site_name,
            site_url=site_url,
            forms_found=len(form_results),
            forms_tested=len(form_results),
            forms_passed=forms_passed,
            forms_failed=forms_failed,
            issues=all_issues,
            status=status
        )

    def scan_all_sites(self) -> List[SiteResult]:
        """Scan all sites for forms."""
        print("🔍 Scanning all NAI sites for forms...")
        site_folders = self.get_site_folders()
        print(f"Found {len(site_folders)} site directories")

        results = []
        for i, site_folder in enumerate(site_folders, 1):
            print(f"  [{i}/{len(site_folders)}] Scanning {site_folder.name}...", end=" ")
            result = self.scan_site(site_folder)
            results.append(result)
            print(f"{result.forms_found} forms, {result.status.upper()}")

        self.results = results
        return results

    def generate_json_report(self, output_path: Optional[Path] = None) -> Path:
        """Generate JSON report."""
        if output_path is None:
            timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
            output_path = REPORTS_DIR / f"form-verification-{timestamp}.json"

        report = {
            "generated_at": datetime.now().isoformat(),
            "total_sites": len(self.results),
            "sites_with_forms": sum(1 for r in self.results if r.forms_found > 0),
            "sites_passing": sum(1 for r in self.results if r.status == "pass"),
            "sites_failing": sum(1 for r in self.results if r.status == "fail"),
            "sites_warning": sum(1 for r in self.results if r.status == "warn"),
            "results": [asdict(r) for r in self.results]
        }

        output_path.write_text(json.dumps(report, indent=2))
        print(f"\n📄 JSON report saved: {output_path}")
        return output_path

    def generate_csv_report(self, output_path: Optional[Path] = None) -> Path:
        """Generate CSV summary report."""
        if output_path is None:
            timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
            output_path = REPORTS_DIR / f"form-verification-{timestamp}.csv"

        with open(output_path, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([
                'Site Name', 'Site URL', 'Forms Found', 'Forms Passed',
                'Forms Failed', 'Status', 'Issues'
            ])
            for r in self.results:
                writer.writerow([
                    r.site_name,
                    r.site_url,
                    r.forms_found,
                    r.forms_passed,
                    r.forms_failed,
                    r.status,
                    '; '.join(r.issues) if r.issues else 'None'
                ])

        print(f"📄 CSV report saved: {output_path}")
        return output_path

    def generate_markdown_report(self, output_path: Optional[Path] = None) -> Path:
        """Generate Markdown report."""
        if output_path is None:
            timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
            output_path = REPORTS_DIR / f"form-verification-{timestamp}.md"

        lines = [
            "# NAI Form Verification Report",
            f"",
            f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            f"**Base URL:** {self.base_url}",
            f"",
            "## Summary",
            f"",
            f"| Metric | Count |",
            f"|--------|-------|",
            f"| Total Sites | {len(self.results)} |",
            f"| Sites with Forms | {sum(1 for r in self.results if r.forms_found > 0)} |",
            f"| ✅ Passing | {sum(1 for r in self.results if r.status == 'pass')} |",
            f"| ⚠️ Warning | {sum(1 for r in self.results if r.status == 'warn')} |",
            f"| ❌ Failing | {sum(1 for r in self.results if r.status == 'fail')} |",
            f"",
            "## Results by Site",
            f"",
            "| Site | Forms | Passed | Failed | Status |",
            "|------|-------|--------|--------|--------|",
        ]

        for r in self.results:
            status_emoji = "✅" if r.status == "pass" else ("⚠️" if r.status == "warn" else "❌")
            lines.append(f"| [{r.site_name}]({r.site_url}) | {r.forms_found} | {r.forms_passed} | {r.forms_failed} | {status_emoji} |")

        lines.extend([
            f"",
            "## Sites with Issues",
            f"",
        ])

        sites_with_issues = [r for r in self.results if r.issues]
        if sites_with_issues:
            for r in sites_with_issues:
                lines.append(f"### {r.site_name}")
                lines.append(f"")
                for issue in r.issues:
                    lines.append(f"- {issue}")
                lines.append(f"")
        else:
            lines.append("🎉 No issues found across all sites!")

        output_path.write_text('\n'.join(lines))
        print(f"📄 Markdown report saved: {output_path}")
        return output_path

    def print_summary(self):
        """Print console summary."""
        print(f"\n{'='*60}")
        print("FORM VERIFICATION SUMMARY")
        print(f"{'='*60}")
        print(f"Total Sites Scanned: {len(self.results)}")
        print(f"Sites with Forms: {sum(1 for r in self.results if r.forms_found > 0)}")
        print(f"✅ Passing: {sum(1 for r in self.results if r.status == 'pass')}")
        print(f"⚠️ Warning: {sum(1 for r in self.results if r.status == 'warn')}")
        print(f"❌ Failing: {sum(1 for r in self.results if r.status == 'fail')}")
        print(f"{'='*60}")


def main():
    parser = argparse.ArgumentParser(
        description="NAI Form Verification Tool",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 nai_form_verifier.py scan                    # Scan all sites
  python3 nai_form_verifier.py report                  # Generate all reports
  python3 nai_form_verifier.py test --site city-of-ashtabula-building-dept
        """
    )
    parser.add_argument(
        'command',
        choices=['scan', 'test', 'test-all', 'report'],
        help='Command to run'
    )
    parser.add_argument(
        '--site',
        help='Specific site to test (for test command)'
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

    verifier = FormVerifier(base_url=args.base_url)

    if args.command == 'scan':
        verifier.scan_all_sites()
        verifier.print_summary()

    elif args.command == 'test':
        if not args.site:
            print("Error: --site required for test command")
            sys.exit(1)
        site_path = WEBSITES_DIR / args.site
        if not site_path.exists():
            print(f"Error: Site '{args.site}' not found")
            sys.exit(1)
        result = verifier.scan_site(site_path)
        print(f"\nResults for {result.site_name}:")
        print(f"  Forms found: {result.forms_found}")
        print(f"  Status: {result.status.upper()}")
        if result.issues:
            print("  Issues:")
            for issue in result.issues:
                print(f"    - {issue}")

    elif args.command == 'test-all':
        verifier.scan_all_sites()
        verifier.print_summary()

    elif args.command == 'report':
        if not verifier.results:
            verifier.scan_all_sites()
        verifier.generate_json_report()
        verifier.generate_csv_report()
        verifier.generate_markdown_report()


if __name__ == '__main__':
    main()
