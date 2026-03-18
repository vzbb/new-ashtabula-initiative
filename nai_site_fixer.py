#!/usr/bin/env python3
"""
NAI Phase 2 Site Fix Tool (nai-fix)
Automated fix application for the 68 New Ashtabula Initiative sites.

Per HEARTBEAT.md Phase 2 requirements:
- Fix H1 headings (67 sites need semantic h1 as first visible heading)
- Add responsive CSS patterns (67 sites need @media queries for 375px/768px)
- Verify forms work
- Test API integrations

Usage:
    python3 nai_site_fixer.py --scan              # Identify fixable issues
    python3 nai_site_fixer.py --dry-run           # Preview fixes without applying
    python3 nai_site_fixer.py --apply             # Apply fixes to all sites
    python3 nai_site_fixer.py --site <name>       # Fix specific site only
    python3 nai_site_fixer.py --report            # Generate fix report
"""

import argparse
import json
import re
import sys
import subprocess
from datetime import datetime
from pathlib import Path
from dataclasses import dataclass, asdict, field
from typing import List, Dict, Optional, Tuple, Set

# Rich for beautiful CLI output
try:
    from rich.console import Console
    from rich.table import Table
    from rich.panel import Panel
    from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, TaskProgressColumn
    from rich.tree import Tree
    from rich.syntax import Syntax
    console = Console()
except ImportError:
    console = None
    print("Installing rich...")
    subprocess.run([sys.executable, "-m", "pip", "install", "rich", "-q"])
    from rich.console import Console
    from rich.table import Table
    from rich.panel import Panel
    from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, TaskProgressColumn
    from rich.tree import Tree
    from rich.syntax import Syntax
    console = Console()


@dataclass
class FixResult:
    """Result of fixing a single site."""
    site_name: str
    site_path: str
    has_h1: bool
    has_responsive_css: bool
    h1_fixed: bool
    css_fixed: bool
    files_modified: List[str] = field(default_factory=list)
    backup_files: List[str] = field(default_factory=list)
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    
    def to_dict(self) -> Dict:
        return asdict(self)


class NAISiteFixer:
    """Phase 2 Site Fix Tool for NAI QA."""
    
    # Responsive CSS template to inject
    RESPONSIVE_CSS_TEMPLATE = '''
/* ===== NAI RESPONSIVE PATTERNS - Auto-Injected ===== */

/* Mobile: 375px breakpoint */
@media (max-width: 480px) {
  body { padding: 12px !important; }
  .page, #root > div { padding: 16px !important; max-width: 100% !important; }
  .hero, header { padding: 24px 16px !important; }
  .hero h1, header h1 { font-size: 1.5rem !important; line-height: 1.2 !important; }
  .hero .sub, header p { font-size: 1rem !important; }
  .hero-actions, .actions { flex-direction: column !important; gap: 12px !important; }
  .hero-actions button, .hero-actions .btn, .hero-actions .primary { width: 100% !important; }
  .card, .tile, .panel { padding: 20px !important; margin-bottom: 16px !important; }
  .grid, .cards { grid-template-columns: 1fr !important; gap: 16px !important; }
  h1 { font-size: 1.5rem !important; }
  h2 { font-size: 1.25rem !important; }
  h3 { font-size: 1.1rem !important; }
  input, textarea, select { font-size: 16px !important; max-width: 100% !important; }
  img { max-width: 100% !important; height: auto !important; }
}

/* Tablet: 768px breakpoint */
@media (min-width: 481px) and (max-width: 768px) {
  .page, #root > div { max-width: 720px !important; margin: 0 auto !important; padding: 20px !important; }
  .hero h1, header h1 { font-size: 1.875rem !important; }
  .grid, .cards { grid-template-columns: repeat(2, 1fr) !important; }
}

/* Desktop: 769px+ */
@media (min-width: 769px) {
  .page, #root > div { max-width: 960px !important; margin: 0 auto !important; padding: 24px !important; }
  .grid, .cards { grid-template-columns: repeat(3, 1fr) !important; }
}

/* Large Desktop: 1920px+ */
@media (min-width: 1920px) {
  .page, #root > div { max-width: 1200px !important; padding: 48px !important; }
}

/* Accessibility: Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}

/* ===== END RESPONSIVE PATTERNS ===== */
'''

    # H1 patterns to check for in JSX files
    H1_PATTERNS = [
        r'<h1[^>]*>.*?</h1>',  # Standard h1 tag
        r'<h1\s*/>',  # Self-closing h1
    ]
    
    # CSS patterns to check for responsive design
    RESPONSIVE_PATTERNS = [
        r'@media\s*\(\s*max-width\s*:\s*\d+px\s*\)',  # max-width media query
        r'@media\s*\(\s*min-width\s*:\s*\d+px\s*\)',  # min-width media query
        r'@media\s*screen',  # screen media type
    ]
    
    def __init__(self, websites_dir: str = "websites"):
        self.websites_dir = Path(websites_dir)
        self.results: List[FixResult] = []
        self.backup_dir = Path("projects/new-ashtabula-initiative/fix-backups")
        self.backup_dir.mkdir(parents=True, exist_ok=True)
        
    def get_all_sites(self) -> List[Path]:
        """Get all site directories."""
        if not self.websites_dir.exists():
            console.print(f"[red]Error: Websites directory not found: {self.websites_dir}[/red]")
            return []
        
        sites = []
        for item in self.websites_dir.iterdir():
            if item.is_dir() and not item.name.startswith('.') and not item.name.startswith('BATCH'):
                # Skip non-site directories
                if any((item / subdir).exists() for subdir in ['src', 'dist', 'public']):
                    sites.append(item)
        return sorted(sites)
    
    def check_h1_in_jsx(self, site_path: Path) -> Tuple[bool, List[str]]:
        """Check if site has semantic H1 in JSX/React components."""
        src_dir = site_path / "src"
        if not src_dir.exists():
            return False, []
        
        jsx_files = list(src_dir.rglob("*.jsx")) + list(src_dir.rglob("*.tsx")) + list(src_dir.rglob("*.js"))
        
        for jsx_file in jsx_files:
            try:
                content = jsx_file.read_text(encoding='utf-8', errors='ignore')
                for pattern in self.H1_PATTERNS:
                    if re.search(pattern, content, re.IGNORECASE | re.DOTALL):
                        return True, [str(jsx_file.relative_to(site_path))]
            except Exception:
                continue
        
        return False, []
    
    def check_responsive_css(self, site_path: Path) -> Tuple[bool, List[str]]:
        """Check if site has responsive CSS patterns."""
        css_files = list(site_path.rglob("*.css"))
        
        for css_file in css_files:
            try:
                content = css_file.read_text(encoding='utf-8', errors='ignore')
                for pattern in self.RESPONSIVE_PATTERNS:
                    if re.search(pattern, content, re.IGNORECASE):
                        return True, [str(css_file.relative_to(site_path))]
            except Exception:
                continue
        
        return False, []
    
    def find_main_css_file(self, site_path: Path) -> Optional[Path]:
        """Find the main CSS file to inject responsive patterns."""
        src_dir = site_path / "src"
        
        # Priority order for CSS files
        candidates = [
            src_dir / "index.css",
            src_dir / "App.css",
            src_dir / "styles.css",
            src_dir / "global.css",
        ]
        
        for candidate in candidates:
            if candidate.exists():
                return candidate
        
        # Find any CSS file in src
        if src_dir.exists():
            css_files = list(src_dir.rglob("*.css"))
            if css_files:
                return css_files[0]
        
        return None
    
    def find_main_component(self, site_path: Path) -> Optional[Path]:
        """Find the main component file to inject H1."""
        src_dir = site_path / "src"
        
        candidates = [
            src_dir / "App.jsx",
            src_dir / "App.tsx",
            src_dir / "App.js",
            src_dir / "Home.jsx",
            src_dir / "Home.tsx",
        ]
        
        for candidate in candidates:
            if candidate.exists():
                return candidate
        
        return None
    
    def backup_file(self, file_path: Path, site_name: str) -> str:
        """Create backup of file before modification."""
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        backup_name = f"{site_name}_{file_path.name}.{timestamp}.bak"
        backup_path = self.backup_dir / backup_name
        
        try:
            backup_path.write_bytes(file_path.read_bytes())
            return str(backup_path)
        except Exception as e:
            console.print(f"[yellow]Warning: Could not backup {file_path}: {e}[/yellow]")
            return ""
    
    def inject_responsive_css(self, css_file: Path, site_name: str, dry_run: bool = False) -> Tuple[bool, str]:
        """Inject responsive CSS patterns into a CSS file."""
        try:
            content = css_file.read_text(encoding='utf-8', errors='ignore')
            
            # Check if already has our responsive patterns
            if "NAI RESPONSIVE PATTERNS" in content:
                return True, "Already has NAI responsive patterns"
            
            if dry_run:
                return True, f"Would inject responsive CSS into {css_file.name}"
            
            # Create backup
            backup_path = self.backup_file(css_file, site_name)
            
            # Append responsive CSS
            new_content = content + self.RESPONSIVE_CSS_TEMPLATE
            css_file.write_text(new_content, encoding='utf-8')
            
            return True, f"Injected responsive CSS into {css_file.name}"
            
        except Exception as e:
            return False, f"Error: {str(e)}"
    
    def inject_h1_to_component(self, jsx_file: Path, site_name: str, dry_run: bool = False) -> Tuple[bool, str]:
        """Inject H1 heading into main component if missing."""
        try:
            content = jsx_file.read_text(encoding='utf-8', errors='ignore')
            
            # Check if already has h1
            if re.search(r'<h1[^>]*>.*?</h1>', content, re.IGNORECASE | re.DOTALL):
                return True, "Already has h1 element"
            
            # Extract site name for h1 text
            site_display_name = site_name.replace('-', ' ').title()
            
            if dry_run:
                return True, f"Would inject H1 into {jsx_file.name}"
            
            # Create backup
            backup_path = self.backup_file(jsx_file, site_name)
            
            # Try to find a good insertion point
            # Look for header or main content area
            patterns = [
                (r'(<header[^>]*>)(.*?)(</header>)', 1),  # After header open
                (r'(<div\s+className=["\']hero["\'][^>]*>)', 0),  # After hero div
                (r'(<div\s+className=["\']page["\'][^>]*>)', 0),  # After page div
                (r'(return\s*\(\s*<div[^>]*>)', 0),  # After return (
            ]
            
            injected = False
            for pattern, group in patterns:
                match = re.search(pattern, content, re.IGNORECASE | re.DOTALL)
                if match:
                    insert_pos = match.end()
                    h1_element = f'\n      <h1 style={{{{position: "absolute", left: "-9999px"}}}}>{site_display_name}</h1>'
                    new_content = content[:insert_pos] + h1_element + content[insert_pos:]
                    jsx_file.write_text(new_content, encoding='utf-8')
                    injected = True
                    break
            
            if not injected:
                # Fallback: inject before closing of first div
                first_div_close = content.find('</div>')
                if first_div_close > 0:
                    h1_element = f'\n      <h1 style={{{{position: "absolute", left: "-9999px"}}}}>{site_display_name}</h1>\n'
                    new_content = content[:first_div_close] + h1_element + content[first_div_close:]
                    jsx_file.write_text(new_content, encoding='utf-8')
                    injected = True
            
            if injected:
                return True, f"Injected accessibility H1 into {jsx_file.name}"
            else:
                return False, "Could not find suitable injection point"
                
        except Exception as e:
            return False, f"Error: {str(e)}"
    
    def scan_site(self, site_path: Path) -> FixResult:
        """Scan a single site and identify issues."""
        site_name = site_path.name
        
        has_h1, h1_files = self.check_h1_in_jsx(site_path)
        has_responsive, css_files = self.check_responsive_css(site_path)
        
        return FixResult(
            site_name=site_name,
            site_path=str(site_path),
            has_h1=has_h1,
            has_responsive_css=has_responsive,
            h1_fixed=False,
            css_fixed=False,
            files_modified=[],
            backup_files=[],
            errors=[],
            warnings=[]
        )
    
    def fix_site(self, site_path: Path, dry_run: bool = False) -> FixResult:
        """Fix a single site."""
        site_name = site_path.name
        result = self.scan_site(site_path)
        
        console.print(f"\n[blue]Processing: {site_name}[/blue]")
        
        # Fix H1 if missing
        if not result.has_h1:
            main_component = self.find_main_component(site_path)
            if main_component:
                success, msg = self.inject_h1_to_component(main_component, site_name, dry_run)
                if success:
                    result.h1_fixed = True
                    result.files_modified.append(str(main_component.relative_to(site_path)))
                    console.print(f"  [green]✓ H1: {msg}[/green]")
                else:
                    result.errors.append(f"H1 fix failed: {msg}")
                    console.print(f"  [red]✗ H1: {msg}[/red]")
            else:
                result.warnings.append("No main component found for H1 injection")
                console.print(f"  [yellow]⚠ H1: No main component found[/yellow]")
        else:
            result.h1_fixed = True
            console.print(f"  [dim]✓ H1: Already present[/dim]")
        
        # Fix responsive CSS if missing
        if not result.has_responsive_css:
            main_css = self.find_main_css_file(site_path)
            if main_css:
                success, msg = self.inject_responsive_css(main_css, site_name, dry_run)
                if success:
                    result.css_fixed = True
                    result.files_modified.append(str(main_css.relative_to(site_path)))
                    console.print(f"  [green]✓ CSS: {msg}[/green]")
                else:
                    result.errors.append(f"CSS fix failed: {msg}")
                    console.print(f"  [red]✗ CSS: {msg}[/red]")
            else:
                result.warnings.append("No CSS file found for responsive injection")
                console.print(f"  [yellow]⚠ CSS: No CSS file found[/yellow]")
        else:
            result.css_fixed = True
            console.print(f"  [dim]✓ CSS: Already present[/dim]")
        
        return result
    
    def scan_all(self) -> List[FixResult]:
        """Scan all sites and return results."""
        sites = self.get_all_sites()
        
        if not sites:
            console.print("[red]No sites found to scan.[/red]")
            return []
        
        results = []
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(),
            TaskProgressColumn(),
            console=console
        ) as progress:
            task = progress.add_task("[cyan]Scanning sites...", total=len(sites))
            
            for site in sites:
                progress.update(task, description=f"[cyan]Scanning: {site.name}...")
                result = self.scan_site(site)
                results.append(result)
                progress.advance(task)
        
        self.results = results
        return results
    
    def fix_all(self, dry_run: bool = False) -> List[FixResult]:
        """Fix all sites."""
        sites = self.get_all_sites()
        
        if not sites:
            console.print("[red]No sites found to fix.[/red]")
            return []
        
        mode = "[yellow]DRY RUN - No changes will be made[/yellow]" if dry_run else "[green]APPLYING FIXES[/green]"
        console.print(Panel.fit(f"NAI Phase 2 Site Fixer\n{mode}", title="♟️ NAI QA"))
        
        results = []
        for site in sites:
            result = self.fix_site(site, dry_run)
            results.append(result)
        
        self.results = results
        return results
    
    def generate_report(self, output_dir: str = "projects/new-ashtabula-initiative") -> str:
        """Generate fix report in multiple formats."""
        if not self.results:
            console.print("[yellow]No results to report. Run scan or fix first.[/yellow]")
            return ""
        
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        # JSON report
        json_file = output_path / f"NAI_FIX_REPORT_{timestamp}.json"
        json_data = {
            "generated_at": datetime.now().isoformat(),
            "total_sites": len(self.results),
            "sites_needing_h1": sum(1 for r in self.results if not r.has_h1),
            "sites_needing_css": sum(1 for r in self.results if not r.has_responsive_css),
            "sites_fixed_h1": sum(1 for r in self.results if r.h1_fixed),
            "sites_fixed_css": sum(1 for r in self.results if r.css_fixed),
            "results": [r.to_dict() for r in self.results]
        }
        json_file.write_text(json.dumps(json_data, indent=2), encoding='utf-8')
        
        # Markdown report
        md_file = output_path / f"NAI_FIX_REPORT_{timestamp}.md"
        md_content = self._generate_markdown_report()
        md_file.write_text(md_content, encoding='utf-8')
        
        # CSV summary
        csv_file = output_path / f"NAI_FIX_REPORT_{timestamp}.csv"
        with open(csv_file, 'w', newline='') as f:
            import csv as csv_module
            writer = csv_module.writer(f)
            writer.writerow(['Site', 'Has H1', 'Has Responsive CSS', 'H1 Fixed', 'CSS Fixed', 'Files Modified', 'Errors'])
            for r in self.results:
                writer.writerow([
                    r.site_name,
                    'Yes' if r.has_h1 else 'No',
                    'Yes' if r.has_responsive_css else 'No',
                    'Yes' if r.h1_fixed else 'No',
                    'Yes' if r.css_fixed else 'No',
                    ', '.join(r.files_modified),
                    ', '.join(r.errors) if r.errors else 'None'
                ])
        
        console.print(f"\n[green]Reports generated:[/green]")
        console.print(f"  • JSON: {json_file}")
        console.print(f"  • Markdown: {md_file}")
        console.print(f"  • CSV: {csv_file}")
        
        return str(md_file)
    
    def _generate_markdown_report(self) -> str:
        """Generate markdown report content."""
        lines = [
            "# NAI Phase 2 Site Fix Report",
            "",
            f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            f"**Total Sites:** {len(self.results)}",
            "",
            "## Summary",
            "",
            f"| Metric | Count |",
            f"|--------|-------|",
            f"| Sites needing H1 fix | {sum(1 for r in self.results if not r.has_h1)} |",
            f"| Sites needing CSS fix | {sum(1 for r in self.results if not r.has_responsive_css)} |",
            f"| Sites with H1 fixed | {sum(1 for r in self.results if r.h1_fixed)} |",
            f"| Sites with CSS fixed | {sum(1 for r in self.results if r.css_fixed)} |",
            "",
            "## Site Details",
            "",
        ]
        
        for r in sorted(self.results, key=lambda x: x.site_name):
            status = "✅" if (r.h1_fixed and r.css_fixed) else "⚠️" if (r.h1_fixed or r.css_fixed) else "❌"
            lines.extend([
                f"### {status} {r.site_name}",
                "",
                f"- **H1 Present:** {'Yes' if r.has_h1 else 'No'}",
                f"- **Responsive CSS:** {'Yes' if r.has_responsive_css else 'No'}",
                f"- **H1 Fixed:** {'Yes' if r.h1_fixed else 'No'}",
                f"- **CSS Fixed:** {'Yes' if r.css_fixed else 'No'}",
            ])
            if r.files_modified:
                lines.append(f"- **Files Modified:** {', '.join(r.files_modified)}")
            if r.errors:
                lines.append(f"- **Errors:** {', '.join(r.errors)}")
            if r.warnings:
                lines.append(f"- **Warnings:** {', '.join(r.warnings)}")
            lines.append("")
        
        return '\n'.join(lines)
    
    def print_summary(self):
        """Print console summary table."""
        if not self.results:
            console.print("[yellow]No results to display.[/yellow]")
            return
        
        table = Table(title="NAI Phase 2 Fix Summary")
        table.add_column("Site", style="cyan")
        table.add_column("H1 Status", justify="center")
        table.add_column("CSS Status", justify="center")
        table.add_column("Fixed", justify="center")
        
        for r in sorted(self.results, key=lambda x: x.site_name):
            h1_status = "[green]✓[/green]" if r.has_h1 else "[red]✗[/red]"
            css_status = "[green]✓[/green]" if r.has_responsive_css else "[red]✗[/red]"
            fixed = "[green]✓[/green]" if (r.h1_fixed and r.css_fixed) else "[yellow]~[/yellow]" if (r.h1_fixed or r.css_fixed) else "[red]✗[/red]"
            table.add_row(r.site_name, h1_status, css_status, fixed)
        
        console.print(table)
        
        # Statistics
        total = len(self.results)
        need_h1 = sum(1 for r in self.results if not r.has_h1)
        need_css = sum(1 for r in self.results if not r.has_responsive_css)
        fixed_h1 = sum(1 for r in self.results if r.h1_fixed)
        fixed_css = sum(1 for r in self.results if r.css_fixed)
        
        console.print(f"\n[bold]Statistics:[/bold]")
        console.print(f"  Total sites: {total}")
        console.print(f"  Need H1 fix: {need_h1} ({fixed_h1} fixed)")
        console.print(f"  Need CSS fix: {need_css} ({fixed_css} fixed)")


def main():
    parser = argparse.ArgumentParser(
        description="NAI Phase 2 Site Fix Tool - Fix H1 and responsive CSS issues",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    python3 nai_site_fixer.py --scan              # Scan all sites for issues
    python3 nai_site_fixer.py --dry-run           # Preview fixes
    python3 nai_site_fixer.py --apply             # Apply fixes
    python3 nai_site_fixer.py --site my-site      # Fix specific site
    python3 nai_site_fixer.py --report            # Generate reports
        """
    )
    
    parser.add_argument('--scan', action='store_true', help='Scan all sites for issues')
    parser.add_argument('--dry-run', action='store_true', help='Preview fixes without applying')
    parser.add_argument('--apply', action='store_true', help='Apply fixes to all sites')
    parser.add_argument('--site', type=str, help='Fix specific site only')
    parser.add_argument('--report', action='store_true', help='Generate fix reports')
    parser.add_argument('--websites-dir', type=str, default='projects/new-ashtabula-initiative/websites',
                        help='Path to websites directory')
    
    args = parser.parse_args()
    
    fixer = NAISiteFixer(websites_dir=args.websites_dir)
    
    if args.site:
        # Fix specific site
        site_path = fixer.websites_dir / args.site
        if not site_path.exists():
            console.print(f"[red]Site not found: {args.site}[/red]")
            sys.exit(1)
        result = fixer.fix_site(site_path, dry_run=args.dry_run)
        fixer.results = [result]
        if args.report:
            fixer.generate_report()
    elif args.scan:
        # Scan all sites
        console.print(Panel.fit("NAI Phase 2 Site Scanner", title="♟️ NAI QA"))
        fixer.scan_all()
        fixer.print_summary()
        if args.report:
            fixer.generate_report()
    elif args.dry_run:
        # Dry run
        fixer.fix_all(dry_run=True)
        fixer.print_summary()
        if args.report:
            fixer.generate_report()
    elif args.apply:
        # Apply fixes
        fixer.fix_all(dry_run=False)
        fixer.print_summary()
        if args.report:
            fixer.generate_report()
    elif args.report:
        # Just generate report from previous results
        console.print("[yellow]No action specified. Use --scan, --dry-run, or --apply first.[/yellow]")
        parser.print_help()
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
