#!/usr/bin/env node
/**
 * URL Live Testing Script
 * Tests all markdown URLs against the live Vercel deployment
 */

import https from 'https';
import fs from 'fs';

const BASE_URL = 'new-ashtabula-initiative.vercel.app';
const CONCURRENCY = 10;

// Read markdown and extract URLs
const markdownPath = '/home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/ALL_WEBSITE_LINKS.md';
const markdown = fs.readFileSync(markdownPath, 'utf8');

const urlRegex = /https:\/\/new-ashtabula-initiative\.vercel\.app\/([^/]+)\//g;
const paths = [];
let match;
while ((match = urlRegex.exec(markdown)) !== null) {
  if (!paths.includes(match[1])) {
    paths.push(match[1]);
  }
}

console.log(`🧪 Testing ${paths.length} unique URLs...\n`);

function testUrl(path) {
  return new Promise((resolve) => {
    const options = {
      hostname: BASE_URL,
      port: 443,
      path: `/${path}/`,
      method: 'GET',
      headers: {
        'User-Agent': 'NAI-URL-Tester/1.0'
      },
      timeout: 15000
    };

    const req = https.request(options, (res) => {
      const status = res.statusCode;
      const success = status >= 200 && status < 400;
      resolve({ path, status: status || 0, success });
    });

    req.on('error', (err) => {
      resolve({ path, status: 0, success: false, error: err.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ path, status: 0, success: false, error: 'Timeout' });
    });

    req.end();
  });
}

async function runTests() {
  const results = {
    passed: [],
    failed: [],
    errors: []
  };

  // Process in batches for concurrency control
  for (let i = 0; i < paths.length; i += CONCURRENCY) {
    const batch = paths.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map(testUrl));
    
    batchResults.forEach(result => {
      if (result.success) {
        results.passed.push(result);
        process.stdout.write(`✅ /${result.path}/ (${result.status})\n`);
      } else {
        results.failed.push(result);
        process.stdout.write(`❌ /${result.path}/ (${result.status}${result.error ? ' - ' + result.error : ''})\n`);
      }
    });
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST RESULTS');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${results.passed.length}/${paths.length}`);
  console.log(`❌ Failed: ${results.failed.length}/${paths.length}`);
  
  if (results.failed.length > 0) {
    console.log('\n❌ FAILED URLs:');
    results.failed.forEach(f => {
      console.log(`   - /${f.path}/ (${f.status}${f.error ? ' - ' + f.error : ''})`);
    });
  }

  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    total: paths.length,
    passed: results.passed.length,
    failed: results.failed.length,
    passRate: ((results.passed.length / paths.length) * 100).toFixed(1) + '%',
    failedUrls: results.failed
  };
  
  fs.writeFileSync(
    '/home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/URL_TEST_RESULTS.json',
    JSON.stringify(report, null, 2)
  );
  
  console.log('\n📄 Report saved to URL_TEST_RESULTS.json');
  
  return results.failed.length === 0;
}

runTests().then(success => {
  process.exit(success ? 0 : 1);
});
