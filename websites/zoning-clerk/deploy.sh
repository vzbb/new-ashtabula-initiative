#!/bin/bash
# zoning-clerk deploy.sh — One-Command Firebase Deployment
# Usage: ./deploy.sh [staging|production]

set -euo pipefail

# Colors
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'

log() { echo -e "${BLUE}[$(date +%H:%M:%S)]${NC} $*"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }
success() { echo -e "${GREEN}[✓]${NC} $*"; }

# Config
DEPLOY_ENV="${1:-staging}"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIST_DIR="$PROJECT_ROOT/dist"

log "zoning-clerk deployment starting..."
log "Environment: $DEPLOY_ENV"

# Pre-flight checks
log "Running pre-flight checks..."

# Check Node/npm
if ! command -v npm &>/dev/null; then
    error "npm not found. Install Node.js first."
fi
success "Node available: $(node --version)"

# Check Firebase CLI
if ! command -v firebase &>/dev/null; then
    log "Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi
success "Firebase CLI: $(firebase --version)"

# Verify build exists
if [[ ! -d "$DIST_DIR" ]]; then
    warn "dist/ not found. Building now..."
    npm run build
fi

if [[ ! -f "$DIST_DIR/index.html" ]]; then
    error "dist/index.html missing. Build may have failed."
fi
success "Build artifacts verified"

# Check environment
if [[ -z "${GEMINI_API_KEY:-}" ]]; then
    error "GEMINI_API_KEY not set. Export it first:\n  export GEMINI_API_KEY='your-key-here'"
fi
success "Gemini API key configured"

# Verify Firebase login
if ! firebase projects:list &>/dev/null 2>&1; then
    warn "Not logged into Firebase. Opening browser..."
    firebase login
fi
success "Firebase authenticated"

# Deploy
log "Starting deployment to $DEPLOY_ENV..."
echo ""

if [[ "$DEPLOY_ENV" == "production" ]]; then
    firebase deploy --only hosting
else
    # Staging: use preview channel
    firebase hosting:channel:deploy staging --expires 7d
fi

# Get deployed URL
if [[ "$DEPLOY_ENV" == "production" ]]; then
    DEPLOY_URL=$(firebase hosting:channel:list 2>/dev/null | grep -o 'https://[^[:space:]]*web.app' | head -1 || echo "")
else
    DEPLOY_URL=$(firebase hosting:channel:list 2>/dev/null | grep staging | grep -o 'https://[^[:space:]]*' | head -1 || echo "")
fi

echo ""
success "Deployment complete! 🚀"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [[ -n "$DEPLOY_URL" ]]; then
    echo "  URL: $DEPLOY_URL"
fi
echo "  Test: Ask \"When are Architectural Review Board meetings?\""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Offer to run verification
read -rp "Run verification tests? [Y/n]: " RUN_VERIFY
if [[ ! "$RUN_VERIFY" =~ ^[Nn]$ ]]; then
    "$PROJECT_ROOT/verify-deployment.sh" "${DEPLOY_URL:-}"
fi

exit 0
