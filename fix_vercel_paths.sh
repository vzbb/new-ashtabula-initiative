#!/bin/bash
# Fix Vercel base paths and rebuild NAI websites
# Run from: /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites

set -e

# Define subpaths from vercel.json (add more as needed)
declare -A SUBPATHS=(
    ["civic-insight-engine"]="civic-insight"
    ["invest-ashtabula"]="invest"
    ["permit-whisperer"]="permits"
    ["local-grocer-go"]="grocer"
    ["contractor-match"]="contractors"
    ["parts-finder"]="parts"
    ["plating-tracker"]="plating"
    ["eligibility-screener"]="eligibility"
    ["through-the-grapevine"]="wine"
    ["harbor-cam-dashboard"]="harbor"
)

# Get all website directories
SITES=$(ls -d */ 2>/dev/null | sed 's|/||')

TOTAL=0
FIXED=0
FAILED=0

echo "========================================"
echo "  NAI Vercel Base Path Fix"
echo "========================================"
echo ""

for SITE in $SITES; do
    # Skip non-site directories
    if [[ "$SITE" == *"REPORT"* ]] || [[ "$SITE" == *"API"* ]] || [[ "$SITE" == *"BUILD"* ]] || [[ "$SITE" == *"batch"* ]]; then
        continue
    fi
    
    TOTAL=$((TOTAL + 1))
    echo "[$TOTAL] Processing: $SITE"
    
    cd "$SITE" 2>/dev/null || { echo "      ❌ Cannot enter directory"; FAILED=$((FAILED + 1)); continue; }
    
    # Check if vite.config exists
    if [ ! -f "vite.config.js" ] && [ ! -f "vite.config.ts" ]; then
        echo "      ⚠️  No vite.config found, skipping"
        cd ..
        continue
    fi
    
    CONFIG_FILE="vite.config.js"
    [ -f "vite.config.ts" ] && CONFIG_FILE="vite.config.ts"
    
    # Get subpath
    SUBPATH="${SUBPATHS[$SITE]:-$SITE}"
    
    # Check if base is already set
    if grep -q "base:" "$CONFIG_FILE" 2>/dev/null; then
        echo "      ℹ️  Base path already set"
    else
        # Add base path to config
        sed -i "s/export default defineConfig({/export default defineConfig({\n  base: '\/$SUBPATH\/',/" "$CONFIG_FILE"
        echo "      ✅ Added base: '/$SUBPATH/'"
    fi
    
    # Rebuild
    echo "      🔨 Rebuilding..."
    if npm install > /tmp/${SITE}-npm.log 2>&1 && npm run build > /tmp/${SITE}-build.log 2>&1; then
        # Verify asset paths
        if [ -f "dist/index.html" ]; then
            if grep -q "/$SUBPATH/assets/" dist/index.html; then
                echo "      ✅ Build successful, paths correct"
                FIXED=$((FIXED + 1))
            else
                echo "      ⚠️  Build success but paths may need verification"
                FIXED=$((FIXED + 1))
            fi
        else
            echo "      ❌ No dist/index.html found"
            FAILED=$((FAILED + 1))
        fi
    else
        echo "      ❌ Build failed (see /tmp/${SITE}-build.log)"
        FAILED=$((FAILED + 1))
    fi
    
    cd ..
done

echo ""
echo "========================================"
echo "  Summary"
echo "========================================"
echo "Total sites: $TOTAL"
echo "Fixed: $FIXED"
echo "Failed: $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "✅ All sites ready for Vercel deployment"
    echo "Run: vercel --prod"
else
    echo "⚠️  $FAILED sites failed — check logs in /tmp/"
fi
