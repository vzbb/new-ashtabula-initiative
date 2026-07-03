#!/bin/bash
# verify-deployment.sh — Post-Deploy Smoke Tests for zoning-clerk
# Usage: ./verify-deployment.sh [URL]

set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'

PASS=0; FAIL=0

pass() { echo -e "${GREEN}✓${NC} $1"; ((PASS++)); }
fail() { echo -e "${RED}✗${NC} $1"; ((FAIL++)); }
log() { echo -e "${BLUE}▶${NC} $1"; }

# Determine target URL
if [[ -n "${1:-}" ]]; then
    BASE_URL="$1"
elif firebase projects:list &>/dev/null 2>&1; then
    # Try to auto-detect from Firebase
    BASE_URL=$(firebase hosting:channel:list 2>/dev/null | grep -o 'https://[^[:space:]]*web.app' | head -1 || echo "")
fi

if [[ -z "${BASE_URL:-}" ]]; then
    echo "Usage: $0 <deployment-url>"
    echo "Example: $0 https://zoning-clerk--staging-abc123.web.app"
    exit 1
fi

log "Testing deployment: $BASE_URL"
echo ""

# Test 1: Root loads
log "Test 1: Root page loads..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL" 2>/dev/null || echo "000")
if [[ "$HTTP_CODE" == "200" ]]; then
    pass "Root page returns 200 OK"
else
    fail "Root page returned HTTP $HTTP_CODE"
fi

# Test 2: HTML contains app marker
log "Test 2: App bundle loaded..."
HTML_CONTENT=$(curl -s "$BASE_URL" 2>/dev/null || echo "")
if echo "$HTML_CONTENT" | grep -q "zoning-clerk\|Zoning Clerk\|ChatAssistant"; then
    pass "App markup detected"
else
    fail "App markup not found (possible build issue)"
fi

# Test 3: JS assets exist
log "Test 3: JavaScript bundles..."
JS_FILES=$(echo "$HTML_CONTENT" | grep -oE 'src="[^"]+\.js"' | sed 's/src="//;s/"$//' || echo "")
if [[ -n "$JS_FILES" ]]; then
    for js in $JS_FILES; do
        if [[ "$js" == /* ]]; then
            JS_URL="$BASE_URL$js"
        elif [[ "$js" == http* ]]; then
            JS_URL="$js"
        else
            JS_URL="$BASE_URL/$js"
        fi
        JS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$JS_URL" 2>/dev/null || echo "000")
        if [[ "$JS_CODE" == "200" ]]; then
            pass "JS bundle loads: $(basename "$js")"
            break
        fi
    done
else
    fail "No JS bundles found in HTML"
fi

# Test 4: CSS assets exist
log "Test 4: CSS stylesheets..."
CSS_FILES=$(echo "$HTML_CONTENT" | grep -oE 'href="[^"]+\.css"' | sed 's/href="//;s/"$//' || echo "")
if [[ -n "$CSS_FILES" ]]; then
    pass "CSS stylesheet detected"
else
    fail "No CSS found (Tailwind may have failed)"
fi

# Test 5: API connectivity (CORS preflight simulation)
log "Test 5: API connectivity..."
# Note: We can't test actual Gemini API without keys, but we can check the app loads
if echo "$HTML_CONTENT" | grep -q "generative\|gemini\|chat"; then
    pass "Chat component detected"
else
    warn "Chat component markup not detected (may be lazy-loaded)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "Results: ${GREEN}$PASS passed${NC}, ${RED}$FAIL failed${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ $FAIL -eq 0 ]]; then
    echo ""
    echo "🎉 Deployment verification passed!"
    echo ""
    echo "Next steps:"
    echo "  1. Open $BASE_URL in browser"
    echo "  2. Test chat: 'When are Architectural Review Board meetings?'"
    echo "  3. Share with city@noirsys.com for review"
    exit 0
else
    echo ""
    echo "⚠️  Some tests failed. Check the build or deployment."
    exit 1
fi
