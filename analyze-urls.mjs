#!/usr/bin/env node
/**
 * URL Mapping Analysis Tool
 * Compares markdown URLs against vercel.json routes
 */

import fs from 'fs';
import path from 'path';

// Read files
const markdownPath = '/home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/ALL_WEBSITE_LINKS.md';
const vercelPath = '/home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/vercel.json';
const websitesDir = '/home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites';

const markdown = fs.readFileSync(markdownPath, 'utf8');
const vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
const websiteDirs = fs.readdirSync(websitesDir).filter(d => {
  const fullPath = path.join(websitesDir, d);
  return fs.statSync(fullPath).isDirectory() && !d.startsWith('.') && d !== 'node_modules' && d !== 'screenshots';
});

// Extract URLs from markdown
const urlRegex = /https:\/\/new-ashtabula-initiative\.vercel\.app\/([^/]+)\//g;
const markdownUrls = [];
let match;
while ((match = urlRegex.exec(markdown)) !== null) {
  markdownUrls.push(match[1]);
}

// Extract source paths from vercel.json routes
const vercelRoutes = vercel.routes.filter(r => r.src !== '/(.*)').map(r => {
  const srcMatch = r.src.match(/^\/([^/?]+)/);
  return srcMatch ? srcMatch[1] : null;
}).filter(Boolean);

// Check dist folders exist
const distCheck = {};
websiteDirs.forEach(dir => {
  const distPath = path.join(websitesDir, dir, 'dist');
  const hasDist = fs.existsSync(distPath);
  distCheck[dir] = hasDist;
});

console.log('=== URL MAPPING ANALYSIS ===\n');

console.log('📊 Markdown URLs count:', markdownUrls.length);
console.log('📊 Vercel routes count:', vercelRoutes.length);
console.log('📊 Website directories count:', websiteDirs.length);

// Find mismatches
const markdownSet = new Set(markdownUrls);
const vercelSet = new Set(vercelRoutes);

console.log('\n=== MISMATCHES ===\n');

// URLs in markdown but not in vercel.json
const missingFromVercel = [...markdownSet].filter(u => !vercelSet.has(u));
if (missingFromVercel.length > 0) {
  console.log('❌ URLs in markdown but MISSING from vercel.json routes:');
  missingFromVercel.forEach(u => console.log(`   - /${u}/`));
} else {
  console.log('✅ All markdown URLs have vercel.json routes');
}

// URLs in vercel but not in markdown
const missingFromMarkdown = [...vercelSet].filter(u => !markdownSet.has(u));
if (missingFromMarkdown.length > 0) {
  console.log('\n⚠️ Routes in vercel.json but NOT in markdown (may be intentional):');
  missingFromMarkdown.forEach(u => console.log(`   - /${u}/`));
} else {
  console.log('✅ All vercel routes are in markdown');
}

// Check dist folders
console.log('\n=== DIST FOLDER CHECK ===\n');
const missingDist = websiteDirs.filter(dir => !distCheck[dir]);
if (missingDist.length > 0) {
  console.log('❌ Directories WITHOUT dist/ folder:');
  missingDist.forEach(d => console.log(`   - ${d}`));
} else {
  console.log('✅ All website directories have dist/ folder');
}

// Route-to-directory mapping check
console.log('\n=== ROUTE-TO-DIRECTORY MAPPING ===\n');
const mappingIssues = [];
vercel.routes.forEach(route => {
  if (route.src === '/(.*)') return; // Skip catch-all
  
  const srcMatch = route.src.match(/^\/([^/?]+)/);
  if (!srcMatch) return;
  
  const srcPath = srcMatch[1];
  const destMatch = route.dest.match(/\/websites\/([^/]+)/);
  if (!destMatch) return;
  
  const destDir = destMatch[1];
  
  // Check if destination directory exists
  if (!websiteDirs.includes(destDir)) {
    mappingIssues.push({
      route: srcPath,
      destDir: destDir,
      issue: 'Directory does not exist'
    });
  } else if (!distCheck[destDir]) {
    mappingIssues.push({
      route: srcPath,
      destDir: destDir,
      issue: 'dist/ folder missing'
    });
  }
});

if (mappingIssues.length > 0) {
  console.log('❌ Mapping issues found:');
  mappingIssues.forEach(issue => {
    console.log(`   - /${issue.route}/ → ${issue.destDir}: ${issue.issue}`);
  });
} else {
  console.log('✅ All routes map to existing directories with dist/');
}

// Final summary
console.log('\n=== SUMMARY ===\n');
console.log(`Total URLs in markdown: ${markdownUrls.length}`);
console.log(`Total routes in vercel.json: ${vercelRoutes.length}`);
console.log(`Missing from vercel.json: ${missingFromVercel.length}`);
console.log(`Extra in vercel.json: ${missingFromMarkdown.length}`);
console.log(`Mapping issues: ${mappingIssues.length}`);
console.log(`Missing dist folders: ${missingDist.length}`);

// Save detailed report
const report = {
  timestamp: new Date().toISOString(),
  markdownUrls: markdownUrls.sort(),
  vercelRoutes: vercelRoutes.sort(),
  websiteDirs: websiteDirs.sort(),
  missingFromVercel,
  missingFromMarkdown,
  missingDist,
  mappingIssues
};

fs.writeFileSync('/home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/URL_MAPPING_REPORT.json', JSON.stringify(report, null, 2));
console.log('\n📄 Detailed report saved to URL_MAPPING_REPORT.json');
