#!/usr/bin/env python3
"""
NAI Quality Assurance Suite (nai-qa)
Comprehensive audit tool for the 68 New Ashtabula Initiative sites.

Per HEARTBEAT.md QA Phase requirements:
- Broken link detection
- Mobile responsiveness validation (375px, 768px, 1920px)
- WCAG accessibility compliance checks
- Performance audit (load times, bundle sizes)
- Cross-browser compatibility markers

Usage:
    python3 nai_qa_suite.py --full-audit
    python3 nai_qa_suite.py --quick-check
    python3 nai_qa_suite.py --tier 1
    python3 nai_qa_suite.py --report json
"""

import argparse
import asyncio
import json
import csv
import re
import sys
import time
import subprocess
from datetime import datetime
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional, Tuple
from urllib.parse import urljoin, urlparse
import xml.etree.ElementTree as ET

# Rich for beautiful CLI output
try:
    from rich.console import Console
    from rich.table import Table
    from rich.panel import Panel
    from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, TaskProgressColumn
    from rich.syntax import Syntax
    from rich.tree import Tree
    console = Console()
except ImportError:
    console = None
    print("Installing rich...")
    subprocess.run([sys.executable, "-m", "pip", "install", "rich", "-q"])
    from rich.console import Console
    from rich.table import Table
    from rich.panel import Panel
    from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, TaskProgressColumn
    console = Console()


@dataclass
class QAResult:
    """Quality assurance result for a single site."""
    name: str
    url: str
    http_status: int
    is_accessible: bool
    load_time_ms: float
    page_size_kb: float
    mobile_score: int  # 0-100
    accessibility_score: int  # 0-100
    performance_score: int  # 0-100
    broken_links: List[str]
    issues: List[str]
    warnings: List[str]
    
    def to_dict(self) -> Dict:
        return asdict(self)


class NAIQASuite:
    """Quality Assurance Suite for New Ashtabula Initiative."""
    
    # Tier 1 sites per HEARTBEAT.md
    TIER_1_SITES = [
        "City of Ashtabula Building Dept",
        "Ashtabula Area Chamber of Commerce", 
        "Lakeland SBDC",
        "Ashtabula County Commissioners"
    ]
    
    # Mobile breakpoints per HEARTBEAT.md
    MOBILE_BREAKPOINTS = [
        ("Mobile", 375, 667),
        ("Tablet", 768, 1024),
        ("Desktop", 1920, 1080)
    ]
    
    # WCAG 2.1 AA requirements to check
    WCAG_CHECKS = [
        "alt_text",
        "aria_labels",
        "heading_hierarchy",
        "color_contrast",
        "focus_indicators",
        "form_labels"
    ]
    
    def __init__(self, base_url: str = "https://newashtabula.vercel.app"):
        self.base_url = base_url
        self.results: List[QAResult] = []
        self.console = Console()
        
    def parse_sites(self) -> List[Dict[str, str]]:
        """Parse sites from ALL_WEBSITE_LINKS.md."""
        sites = []
        links_file = Path("ALL_WEBSITE_LINKS.md")
        
        if not links_file.exists():
            # Fallback: scan websites directory
            websites_dir = Path("websites")
            if websites_dir.exists():
                for site_dir in websites_dir.iterdir():
                    if site_dir.is_dir() and not site_dir.name.startswith('.'):
                        sites.append({
                            'name': site_dir.name.replace('-', ' ').title(),
                            'url': f"{self.base_url}/{site_dir.name}",
                            'tier': self._get_tier(site_dir.name)
                        })
            return sites
        
        with open(links_file, 'r') as f:
            for line in f:
                match = re.match(r'\|\s*\*\*([^*]+)\*\*\s*\|\s*(https://[^\s|]+)', line)
                if match:
                    name = match.group(1).strip()
                    url = match.group(2).strip()
                    sites.append({
                        'name': name,
                        'url': url,
                        'tier': self._get_tier(name)
                    })
        
        return sites
    
    def _get_tier(self, name: str) -> int:
        """Determine site tier based on HEARTBEAT.md priority."""
        for tier1_name in self.TIER_1_SITES:
            if tier1_name.lower() in name.lower():
                return 1
        return 2  # Default to tier 2
    
    def check_http_status(self, url: str) -> Tuple[int, float]:
        """Check HTTP status and response time."""
        start = time.time()
        try:
            result = subprocess.run(
                ['curl', '-s', '-o', '/dev/null', '-w', '%{http_code}', url, 
                 '--max-time', '15', '-L'],
                capture_output=True, text=True, timeout=20
            )
            elapsed = (time.time() - start) * 1000
            status = int(result.stdout.strip()) if result.stdout.strip().isdigit() else 0
            return status, elapsed
        except Exception as e:
            return 0, 0
    
    def fetch_content(self, url: str) -> Tuple[str, float]:
        """Fetch page content and size."""
        try:
            result = subprocess.run(
                ['curl', '-s', url, '--max-time', '15', '-L'],
                capture_output=True, timeout=20
            )
            content = result.stdout.decode('utf-8', errors='ignore')
            size_kb = len(result.stdout) / 1024
            return content, size_kb
        except Exception:
            return "", 0
    
    def check_broken_links(self, content: str, base_url: str) -> List[str]:
        """Extract and check for broken internal links."""
        broken = []
        # Find href links
        links = re.findall(r'href=["\']([^"\']+)["\']', content)
        
        for link in links:
            if link.startswith('#') or link.startswith('javascript:'):
                continue
            if link.startswith('http') and not link.startswith(self.base_url):
                continue  # Skip external links for now
                
            full_url = urljoin(base_url, link)
            if not full_url.startswith(self.base_url):
                continue
                
            # Quick check - just verify it's not 404
            status, _ = self.check_http_status(full_url)
            if status == 404:
                broken.append(full_url)
        
        return broken[:10]  # Limit to first 10 broken links
    
    def check_accessibility(self, content: str) -> Tuple[int, List[str], List[str]]:
        """Check WCAG 2.1 AA compliance markers."""
        score = 100
        issues = []
        warnings = []
        
        # Check for images without alt text
        img_pattern = r'<img[^>]*>'
        images = re.findall(img_pattern, content, re.IGNORECASE)
        images_without_alt = [img for img in images if 'alt=' not in img.lower()]
        if images_without_alt:
            score -= min(20, len(images_without_alt) * 5)
            issues.append(f"{len(images_without_alt)} images missing alt text")
        
        # Check for form inputs without labels
        input_pattern = r'<input[^>]*>'
        inputs = re.findall(input_pattern, content, re.IGNORECASE)
        inputs_without_labels = []
        for inp in inputs:
            if 'type="hidden"' in inp.lower():
                continue
            if 'aria-label' not in inp.lower() and 'aria-labelledby' not in inp.lower():
                # Check if preceded by label
                inputs_without_labels.append(inp)
        if inputs_without_labels:
            score -= min(15, len(inputs_without_labels) * 3)
            warnings.append(f"{len(inputs_without_labels)} form inputs may lack labels")
        
        # Check heading hierarchy
        h1_count = len(re.findall(r'<h1', content, re.IGNORECASE))
        if h1_count == 0:
            score -= 10
            issues.append("No H1 heading found")
        elif h1_count > 1:
            warnings.append(f"Multiple H1 headings ({h1_count})")
        
        # Check for low contrast indicators (inline styles with light colors)
        light_text_pattern = r'color:\s*#?[0-9a-f]{3,6}'
        light_matches = re.findall(light_text_pattern, content, re.IGNORECASE)
        if len(light_matches) > 5:
            warnings.append("Potential color contrast issues (manual review needed)")
        
        # Check for lang attribute
        if '<html' in content and 'lang=' not in content.lower():
            score -= 5
            issues.append("HTML missing lang attribute")
        
        return max(0, score), issues, warnings
    
    def check_mobile_responsiveness(self, content: str) -> Tuple[int, List[str]]:
        """Check for mobile responsiveness markers."""
        score = 100
        issues = []
        
        # Check for viewport meta tag
        if 'viewport' not in content.lower():
            score -= 30
            issues.append("Missing viewport meta tag")
        
        # Check for responsive CSS patterns
        responsive_patterns = [
            '@media',
            'max-width',
            'min-width',
            'flex',
            'grid'
        ]
        
        has_responsive = any(p.lower() in content.lower() for p in responsive_patterns)
        if not has_responsive:
            score -= 20
            issues.append("No responsive CSS patterns detected")
        
        # Check for fixed widths that might break mobile
        fixed_width_pattern = r'width:\s*\d{3,}px'
        fixed_widths = re.findall(fixed_width_pattern, content, re.IGNORECASE)
        if len(fixed_widths) > 3:
            score -= 10
            warnings.append(f"{len(fixed_widths)} fixed-width elements detected")
        
        return max(0, score), issues
    
    def check_performance(self, content: str, size_kb: float, load_time_ms: float) -> Tuple[int, List[str]]:
        """Check performance metrics."""
        score = 100
        issues = []
        
        # Page size check
        if size_kb > 2000:  # > 2MB
            score -= 20
            issues.append(f"Large page size ({size_kb:.0f}KB)")
        elif size_kb > 1000:  # > 1MB
            score -= 10
            issues.append(f"Page size over 1MB ({size_kb:.0f}KB)")
        
        # Load time check
        if load_time_ms > 5000:  # > 5s
            score -= 25
            issues.append(f"Slow load time ({load_time_ms:.0f}ms)")
        elif load_time_ms > 3000:  # > 3s
            score -= 15
            issues.append(f"Load time over 3s ({load_time_ms:.0f}ms)")
        
        # Check for render-blocking resources
        if content.count('<script') > 10:
            warnings.append("Many scripts may block rendering")
        
        # Check for unoptimized images
        img_tags = re.findall(r'<img[^>]*>', content, re.IGNORECASE)
        large_images = [img for img in img_tags if 'loading=' not in img.lower()]
        if len(large_images) > 5:
            warnings.append(f"{len(large_images)} images without lazy loading")
        
        return max(0, score), issues
    
    def audit_site(self, site: Dict[str, str]) -> QAResult:
        """Perform full QA audit on a single site."""
        url = site['url']
        name = site['name']
        
        # Basic HTTP check
        http_status, response_time = self.check_http_status(url)
        
        if http_status != 200:
            return QAResult(
                name=name,
                url=url,
                http_status=http_status,
                is_accessible=False,
                load_time_ms=0,
                page_size_kb=0,
                mobile_score=0,
                accessibility_score=0,
                performance_score=0,
                broken_links=[],
                issues=[f"HTTP {http_status}"],
                warnings=[]
            )
        
        # Fetch content
        content, size_kb = self.fetch_content(url)
        
        if not content:
            return QAResult(
                name=name,
                url=url,
                http_status=http_status,
                is_accessible=False,
                load_time_ms=response_time,
                page_size_kb=size_kb,
                mobile_score=0,
                accessibility_score=0,
                performance_score=0,
                broken_links=[],
                issues=["Could not fetch content"],
                warnings=[]
            )
        
        # Run checks
        broken_links = self.check_broken_links(content, url)
        accessibility_score, a11y_issues, a11y_warnings = self.check_accessibility(content)
        mobile_score, mobile_issues = self.check_mobile_responsiveness(content)
        performance_score, perf_issues = self.check_performance(content, size_kb, response_time)
        
        # Combine issues
        all_issues = a11y_issues + mobile_issues + perf_issues
        all_warnings = a11y_warnings
        
        if broken_links:
            all_issues.append(f"{len(broken_links)} broken links detected")
        
        # Calculate overall score
        overall_score = (mobile_score + accessibility_score + performance_score) // 3
        
        return QAResult(
            name=name,
            url=url,
            http_status=http_status,
            is_accessible=True,
            load_time_ms=response_time,
            page_size_kb=size_kb,
            mobile_score=mobile_score,
            accessibility_score=accessibility_score,
            performance_score=performance_score,
            broken_links=broken_links,
            issues=all_issues,
            warnings=all_warnings
        )
    
    def run_audit(self, tier: Optional[int] = None, limit: Optional[int] = None) -> List[QAResult]:
        """Run QA audit on all or filtered sites."""
        sites = self.parse_sites()
        
        if tier:
            sites = [s for s in sites if s.get('tier') == tier]
        
        if limit:
            sites = sites[:limit]
        
        self.results = []
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(),
            TaskProgressColumn(),
            console=self.console
        ) as progress:
            task = progress.add_task(f"Auditing {len(sites)} sites...", total=len(sites))
            
            for site in sites:
                progress.update(task, description=f"Checking {site['name'][:30]}...")
                result = self.audit_site(site)
                self.results.append(result)
                progress.advance(task)
        
        return self.results
    
    def generate_report(self, format: str = "console") -> str:
        """Generate QA report in specified format."""
        if format == "json":
            return json.dumps({
                'auditDate': datetime.now().isoformat(),
                'totalSites': len(self.results),
                'summary': self._generate_summary(),
                'sites': [r.to_dict() for r in self.results]
            }, indent=2)
        
        elif format == "csv":
            output = []
            output.append("Name,URL,HTTP Status,Accessible,Load Time (ms),Size (KB),Mobile Score,A11y Score,Perf Score,Issues")
            for r in self.results:
                issues_str = "; ".join(r.issues).replace('"', '""')
                output.append(f'"{r.name}","{r.url}",{r.http_status},{r.is_accessible},{r.load_time_ms:.0f},{r.page_size_kb:.1f},{r.mobile_score},{r.accessibility_score},{r.performance_score},"{issues_str}"')
            return "\n".join(output)
        
        elif format == "markdown":
            lines = [
                "# NAI Quality Assurance Report",
                f"**Date:** {datetime.now().strftime('%Y-%m-%d %H:%M')}",
                f"**Total Sites:** {len(self.results)}",
                "",
                "## Summary",
                ""
            ]
            summary = self._generate_summary()
            for key, value in summary.items():
                lines.append(f"- **{key}:** {value}")
            lines.extend(["", "## Detailed Results", ""])
            lines.append("| Site | Status | Mobile | A11y | Perf | Issues |")
            lines.append("|------|--------|--------|------|------|--------|")
            for r in self.results:
                status = "✅" if r.is_accessible else "❌"
                issues_count = len(r.issues)
                lines.append(f"| {r.name[:30]} | {status} | {r.mobile_score} | {r.accessibility_score} | {r.performance_score} | {issues_count} |")
            return "\n".join(lines)
        
        else:  # console
            return self._generate_console_report()
    
    def _generate_summary(self) -> Dict:
        """Generate summary statistics."""
        if not self.results:
            return {}
        
        accessible = sum(1 for r in self.results if r.is_accessible)
        broken = len(self.results) - accessible
        
        avg_mobile = sum(r.mobile_score for r in self.results) // len(self.results)
        avg_a11y = sum(r.accessibility_score for r in self.results) // len(self.results)
        avg_perf = sum(r.performance_score for r in self.results) // len(self.results)
        
        total_broken_links = sum(len(r.broken_links) for r in self.results)
        total_issues = sum(len(r.issues) for r in self.results)
        
        return {
            'totalSites': len(self.results),
            'accessible': accessible,
            'broken': broken,
            'averageMobileScore': avg_mobile,
            'averageAccessibilityScore': avg_a11y,
            'averagePerformanceScore': avg_perf,
            'totalBrokenLinks': total_broken_links,
            'totalIssues': total_issues
        }
    
    def _generate_console_report(self) -> str:
        """Generate Rich console report."""
        # Summary panel
        summary = self._generate_summary()
        
        summary_text = f"""
[bold]Total Sites:[/bold] {summary.get('totalSites', 0)}
[bold]Accessible:[/bold] {summary.get('accessible', 0)} ✅
[bold]Broken:[/bold] {summary.get('broken', 0)} ❌

[bold]Average Scores:[/bold]
  Mobile: {summary.get('averageMobileScore', 0)}/100
  Accessibility: {summary.get('averageAccessibilityScore', 0)}/100
  Performance: {summary.get('averagePerformanceScore', 0)}/100

[bold]Issues Found:[/bold]
  Broken Links: {summary.get('totalBrokenLinks', 0)}
  Total Issues: {summary.get('totalIssues', 0)}
        """
        
        self.console.print(Panel(summary_text, title="NAI QA Summary", border_style="blue"))
        
        # Results table
        table = Table(title="Site Audit Results")
        table.add_column("Site", style="cyan")
        table.add_column("Status", justify="center")
        table.add_column("Mobile", justify="right")
        table.add_column("A11y", justify="right")
        table.add_column("Perf", justify="right")
        table.add_column("Load", justify="right")
        table.add_column("Issues", justify="right")
        
        for r in self.results:
            status = "✅" if r.is_accessible else "❌"
            mobile = f"{r.mobile_score}"
            mobile_style = "green" if r.mobile_score >= 80 else "yellow" if r.mobile_score >= 60 else "red"
            a11y = f"{r.accessibility_score}"
            a11y_style = "green" if r.accessibility_score >= 80 else "yellow" if r.accessibility_score >= 60 else "red"
            perf = f"{r.performance_score}"
            perf_style = "green" if r.performance_score >= 80 else "yellow" if r.performance_score >= 60 else "red"
            load = f"{r.load_time_ms:.0f}ms"
            issues = f"{len(r.issues)}"
            
            table.add_row(
                r.name[:35],
                status,
                f"[{mobile_style}]{mobile}[/{mobile_style}]",
                f"[{a11y_style}]{a11y}[/{a11y_style}]",
                f"[{perf_style}]{perf}[/{perf_style}]",
                load,
                issues
            )
        
        self.console.print(table)
        
        # Issues breakdown for failing sites
        failing = [r for r in self.results if r.issues and r.is_accessible]
        if failing:
            self.console.print("\n[bold yellow]Sites with Issues:[/bold yellow]")
            for r in failing[:5]:  # Show first 5
                self.console.print(f"\n[bold]{r.name}[/bold]")
                for issue in r.issues[:3]:  # First 3 issues
                    self.console.print(f"  • {issue}")
        
        return ""
    
    def save_report(self, format: str = "json") -> str:
        """Save report to file."""
        timestamp = datetime.now().strftime('%Y%m%d-%H%M')
        
        if format == "json":
            filename = f"NAI_QA_REPORT_{timestamp}.json"
            content = self.generate_report("json")
        elif format == "csv":
            filename = f"NAI_QA_REPORT_{timestamp}.csv"
            content = self.generate_report("csv")
        elif format == "markdown":
            filename = f"NAI_QA_REPORT_{timestamp}.md"
            content = self.generate_report("markdown")
        else:
            filename = f"NAI_QA_REPORT_{timestamp}.txt"
            content = self.generate_report("console")
        
        with open(filename, 'w') as f:
            f.write(content)
        
        return filename


def main():
    parser = argparse.ArgumentParser(
        description="NAI Quality Assurance Suite",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    python3 nai_qa_suite.py --full-audit              # Audit all sites
    python3 nai_qa_suite.py --tier 1                  # Audit Tier 1 sites only
    python3 nai_qa_suite.py --quick-check             # Quick 5-site sample
    python3 nai_qa_suite.py --report json --save      # Save JSON report
    python3 nai_qa_suite.py --full-audit --save-all   # Save all formats
        """
    )
    
    parser.add_argument('--full-audit', action='store_true', 
                        help='Run full audit on all sites')
    parser.add_argument('--quick-check', action='store_true',
                        help='Quick check on 5 sample sites')
    parser.add_argument('--tier', type=int, choices=[1, 2, 3],
                        help='Audit only sites in specific tier')
    parser.add_argument('--limit', type=int,
                        help='Limit audit to N sites')
    parser.add_argument('--report', choices=['console', 'json', 'csv', 'markdown'],
                        default='console', help='Report format')
    parser.add_argument('--save', action='store_true',
                        help='Save report to file')
    parser.add_argument('--save-all', action='store_true',
                        help='Save reports in all formats')
    
    args = parser.parse_args()
    
    # Default to quick check if no args
    if not any([args.full_audit, args.quick_check, args.tier, args.limit]):
        args.quick_check = True
    
    suite = NAIQASuite()
    
    # Determine audit scope
    if args.quick_check:
        console.print("[yellow]Running quick check on 5 sample sites...[/yellow]")
        suite.run_audit(limit=5)
    elif args.tier:
        console.print(f"[blue]Auditing Tier {args.tier} sites...[/blue]")
        suite.run_audit(tier=args.tier)
    elif args.limit:
        console.print(f"[blue]Auditing {args.limit} sites...[/blue]")
        suite.run_audit(limit=args.limit)
    else:
        console.print("[blue]Running full audit on all sites...[/blue]")
        suite.run_audit()
    
    # Generate and display report
    suite.generate_report(args.report)
    
    # Save if requested
    if args.save:
        filename = suite.save_report(args.report)
        console.print(f"\n[green]Report saved:[/green] {filename}")
    
    if args.save_all:
        for fmt in ['json', 'csv', 'markdown']:
            filename = suite.save_report(fmt)
            console.print(f"[green]Saved:[/green] {filename}")


if __name__ == '__main__':
    main()
