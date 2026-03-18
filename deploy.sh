#!/bin/bash
#
# NAI Deployment Automation Script
# Builds all MVPs and deploys to Vercel
#

set -e

echo "🚀 New Ashtabula Initiative — Deployment Automation"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base directory
NAI_DIR="/home/tt/.openclaw/workspace/projects/new-ashtabula-initiative"
WEBSITES_DIR="$NAI_DIR/websites"

# Track successes/failures
SUCCESS_COUNT=0
FAILED_SITES=()

echo "📦 Step 1: Building all MVPs..."
echo ""

# Tier 1 - Priority sites
TIER1=(
  "civic-insight-engine"
  "invest-ashtabula"
  "permit-whisperer"
  "local-grocer-go/client:local-grocer-go"
  "contractor-match"
)

# Tier 2 - Supporting sites
TIER2=(
  "parts-finder"
  "plating-tracker"
  "eligibility-screener"
  "harbor-cam-dashboard"
  "gotl-weekend-planner"
)

echo "🏗️  Building Tier 1 (Priority Sites)..."
for site in "${TIER1[@]}"; do
  # Handle special case for local-grocer-go (client subdir)
  if [[ "$site" == *":"* ]]; then
    IFS=':' read -r dir name <<< "$site"
    SITE_DIR="$WEBSITES_DIR/$dir"
    SITE_NAME="$name"
  else
    SITE_DIR="$WEBSITES_DIR/$site"
    SITE_NAME="$site"
  fi
  
  if [ -d "$SITE_DIR" ] && [ -f "$SITE_DIR/package.json" ]; then
    echo -n "  Building $SITE_NAME... "
    if (cd "$SITE_DIR" && npm run build > /dev/null 2>&1); then
      echo -e "${GREEN}✅${NC}"
      ((SUCCESS_COUNT++))
    else
      echo -e "${RED}❌${NC}"
      FAILED_SITES+=("$SITE_NAME")
    fi
  fi
done

echo ""
echo "🏗️  Building Tier 2 (Supporting Sites)..."
for site in "${TIER2[@]}"; do
  SITE_DIR="$WEBSITES_DIR/$site"
  
  if [ -d "$SITE_DIR" ] && [ -f "$SITE_DIR/package.json" ]; then
    echo -n "  Building $site... "
    if (cd "$SITE_DIR" && npm run build > /dev/null 2>&1); then
      echo -e "${GREEN}✅${NC}"
      ((SUCCESS_COUNT++))
    else
      echo -e "${RED}❌${NC}"
      FAILED_SITES+=("$site")
    fi
  fi
done

echo ""
echo "📊 Build Summary:"
echo "  ✅ Successful: $SUCCESS_COUNT"
echo "  ❌ Failed: ${#FAILED_SITES[@]}"

if [ ${#FAILED_SITES[@]} -gt 0 ]; then
  echo ""
  echo "${YELLOW}Failed sites:${NC}"
  for site in "${FAILED_SITES[@]}"; do
    echo "  - $site"
  done
fi

echo ""
echo "🚀 Step 2: Deploying to Vercel..."
echo ""

cd "$NAI_DIR"

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
  echo -e "${RED}Error: Vercel CLI not found${NC}"
  echo "Install with: npm i -g vercel"
  exit 1
fi

# Check if logged in
if ! vercel whoami > /dev/null 2>&1; then
  echo -e "${YELLOW}Not logged in to Vercel. Please login:${NC}"
  vercel login
fi

echo "Deploying to Vercel..."
echo ""

# Deploy
vercel --prod

echo ""
echo "=================================================="
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo ""
echo "Live URL: https://newashtabula.vercel.app"
echo ""
echo "Test these key URLs:"
echo "  - https://newashtabula.vercel.app/"
echo "  - https://newashtabula.vercel.app/civic-insight/"
echo "  - https://newashtabula.vercel.app/invest/"
echo "  - https://newashtabula.vercel.app/permits/"
echo "  - https://newashtabula.vercel.app/grocer/"
echo "  - https://newashtabula.vercel.app/contractors/"
echo ""
