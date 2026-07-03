#!/bin/bash

# NAI Demo-Ready Sprint - Heartbeat 3 - Batch 1 Build Verification Script
# Sites 1-17

BASE_DIR="/home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites"
REPORT_FILE="$BASE_DIR/H3_BATCH1_OPENCODE_REPORT.md"

SITES=(
  "adaptive-reuse-planner"
  "aidflow-navigator"
  "ai-docent"
  "ai-docent-pro"
  "artist-commission-form"
  "auto-detail-booking"
  "blueprint-analyzer"
  "boat-storage-waitlist"
  "box-builder"
  "boxflow-estimator"
  "cashflow-tracker"
  "charter-booking"
  "civic-insight-engine"
  "compassionate-planner"
  "contractor-match"
  "curbside-pickup-tracker"
  "eligibility-lite"
)

# Initialize report
cat > "$REPORT_FILE" << 'EOF'
# H3 Batch 1 Build Verification Report
**Date:** $(date '+%Y-%m-%d %H:%M:%S %Z')
**Tool:** opencode CLI
**Sites:** 17 (Batch 1)

## Summary
| Site | npm install | npm build | dist/index.html | Vite Base | Status |
|------|-------------|-----------|-----------------|-----------|--------|
EOF

echo "🔧 Starting build verification for ${#SITES[@]} sites..."
echo ""

for site in "${SITES[@]}"; do
  SITE_DIR="$BASE_DIR/$site"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📁 Processing: $site"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  if [ ! -d "$SITE_DIR" ]; then
    echo "  ❌ Directory not found: $SITE_DIR"
    echo "| $site | N/A | N/A | N/A | N/A | ❌ MISSING |" >> "$REPORT_FILE"
    continue
  fi
  
  cd "$SITE_DIR" || continue
  
  # Check for package.json
  if [ ! -f "package.json" ]; then
    echo "  ❌ package.json not found"
    echo "| $site | ❌ No pkg.json | N/A | N/A | N/A | ❌ FAIL |" >> "$REPORT_FILE"
    continue
  fi
  
  # Run npm install
  echo "  📦 Running npm install..."
  if npm install 2>&1 | tail -5; then
    INSTALL_STATUS="✅"
    echo "     ✅ npm install completed"
  else
    INSTALL_STATUS="❌"
    echo "     ❌ npm install failed"
  fi
  
  # Run npm run build
  echo "  🔨 Running npm run build..."
  if npm run build 2>&1 | tail -10; then
    BUILD_STATUS="✅"
    echo "     ✅ npm build completed"
  else
    BUILD_STATUS="❌"
    echo "     ❌ npm build failed"
  fi
  
  # Check for dist/index.html
  echo "  🔍 Checking dist/index.html..."
  if [ -f "dist/index.html" ]; then
    DIST_STATUS="✅"
    echo "     ✅ dist/index.html exists"
  else
    DIST_STATUS="❌"
    echo "     ❌ dist/index.html NOT found"
  fi
  
  # Check vite.config.js for base path
  echo "  ⚙️  Checking vite.config.js base path..."
  VITE_BASE="N/A"
  if [ -f "vite.config.js" ]; then
    BASE_PATH=$(grep -oP "base:\s*['\"]\K[^'\"]+" vite.config.js 2>/dev/null || echo "NOT_SET")
    if [ "$BASE_PATH" = "NOT_SET" ] || [ -z "$BASE_PATH" ]; then
      VITE_BASE="⚠️ NOT SET"
    else
      VITE_BASE="$BASE_PATH"
    fi
    echo "     Base path: $VITE_BASE"
  else
    VITE_BASE="❌ No vite.config.js"
    echo "     ❌ vite.config.js not found"
  fi
  
  # Determine overall status
  if [ "$INSTALL_STATUS" = "✅" ] && [ "$BUILD_STATUS" = "✅" ] && [ "$DIST_STATUS" = "✅" ]; then
    OVERALL_STATUS="✅ PASS"
  else
    OVERALL_STATUS="❌ FAIL"
  fi
  
  # Append to report
  echo "| $site | $INSTALL_STATUS | $BUILD_STATUS | $DIST_STATUS | $VITE_BASE | $OVERALL_STATUS |" >> "$REPORT_FILE"
  
  echo ""
done

# Add detailed section to report
cat >> "$REPORT_FILE" << 'EOF'

## Detailed Results

EOF

for site in "${SITES[@]}"; do
  SITE_DIR="$BASE_DIR/$site"
  echo "### $site" >> "$REPORT_FILE"
  
  if [ ! -d "$SITE_DIR" ]; then
    echo "- **Status:** ❌ Directory not found" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    continue
  fi
  
  cd "$SITE_DIR" || continue
  
  # Check dist folder contents
  if [ -d "dist" ]; then
    echo "- **dist/ folder:** ✅ Exists" >> "$REPORT_FILE"
    FILE_COUNT=$(find dist -type f 2>/dev/null | wc -l)
    echo "- **Files in dist/:** $FILE_COUNT" >> "$REPORT_FILE"
    if [ -f "dist/index.html" ]; then
      echo "- **dist/index.html:** ✅ Present" >> "$REPORT_FILE"
    else
      echo "- **dist/index.html:** ❌ Missing" >> "$REPORT_FILE"
    fi
  else
    echo "- **dist/ folder:** ❌ Not found" >> "$REPORT_FILE"
  fi
  
  # Check vite config
  if [ -f "vite.config.js" ]; then
    echo "- **vite.config.js:** ✅ Present" >> "$REPORT_FILE"
    BASE_LINE=$(grep -n "base:" vite.config.js 2>/dev/null | head -1 || echo "No base configuration found")
    echo "- **Base config:** \`$BASE_LINE\`" >> "$REPORT_FILE"
  else
    echo "- **vite.config.js:** ❌ Not found" >> "$REPORT_FILE"
  fi
  
  echo "" >> "$REPORT_FILE"
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Build verification complete!"
echo "📊 Report saved to: $REPORT_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
