#!/bin/bash

# Batch screenshot script for NAI website verification
# Usage: ./batch-screenshots.sh

cd /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites

# Sites that need screenshots (42 remaining)
SITES=(
  "adaptive-reuse-planner:5201"
  "eligibility-pro:5202"
  "eligibility-screener:5203"
  "engineers-assistant:5204"
  "event-permit-express:5205"
  "farm-stand-finder:5206"
  "fence-quote:5207"
  "harvest-alert:5208"
  "hvac-tuneup:5209"
  "insta-book:5210"
  "insta-book-stripe:5211"
  "instant-dirt-quote:5212"
  "landlord-repair-queue:5213"
  "lawn-quote-tool:5214"
  "license-wizard:5215"
  "marina-slip-waitlist:5216"
  "mobile-notary:5217"
  "mytrip-planner:5218"
  "mytrip-planner-export:5219"
  "parts-finder:5220"
  "parts-finder-request:5221"
  "pet-matchmaker:5222"
  "plating-tracker:5223"
  "plating-tracker-pro:5224"
  "pocket-historian:5225"
  "pocket-historian-pro:5226"
  "pocket-sommelier:5227"
  "pocket-sommelier-pro:5228"
  "policy-pal:5229"
  "rental-availability:5230"
  "resource-compass:5231"
  "resource-compass-pro:5232"
  "ride-ready:5233"
  "service-scheduler:5234"
  "service-scheduler-sms:5235"
  "snow-plow-tracker:5236"
  "truck-wash-booking:5237"
  "virtual-concierge:5238"
  "visitor-parking-finder:5239"
  "visual-portfolio:5240"
  "volunteer-scheduler:5241"
  "wedding-lead-form:5242"
)

TOTAL=${#SITES[@]}
COMPLETED=0
FAILED=()

echo "=========================================="
echo "  NAI Website Verification - Batch Mode"
echo "  Sites to process: $TOTAL"
echo "=========================================="
echo ""

for entry in "${SITES[@]}"; do
  IFS=':' read -r SITE PORT <<< "$entry"
  COMPLETED=$((COMPLETED + 1))
  
  echo ""
  echo "[$COMPLETED/$TOTAL] Processing: $SITE (port $PORT)"
  echo "------------------------------------------"
  
  # Check if site directory exists
  if [ ! -d "$SITE" ]; then
    echo "  ⚠️  Directory not found, skipping..."
    FAILED+=("$SITE:directory_missing")
    continue
  fi
  
  cd "$SITE"
  
  # Create screenshots directory
  mkdir -p screenshots
  
  # Check if node_modules exists
  if [ ! -d "node_modules" ]; then
    echo "  📦 Installing dependencies..."
    npm install --silent 2>/dev/null
    if [ $? -ne 0 ]; then
      echo "  ❌ npm install failed"
      FAILED+=("$SITE:npm_install_failed")
      cd ..
      continue
    fi
  fi
  
  # Start dev server in background
  echo "  🚀 Starting dev server on port $PORT..."
  npm run dev -- --port $PORT > /tmp/dev-server-$PORT.log 2>&1 &
  SERVER_PID=$!
  
  # Wait for server to be ready
  sleep 4
  
  # Check if server is running
  if ! kill -0 $SERVER_PID 2>/dev/null; then
    echo "  ❌ Dev server failed to start"
    FAILED+=("$SITE:dev_server_failed")
    cd ..
    continue
  fi
  
  # Wait a bit more for server to fully initialize
  sleep 2
  
  # Run screenshot script
  echo "  📸 Capturing screenshots..."
  node ../screenshot-script.mjs $PORT > /tmp/screenshot-$PORT.log 2>&1
  
  if [ $? -eq 0 ]; then
    # Move screenshots to project's screenshots folder
    mv screenshots/01-home-desktop.png "screenshots/$SITE-desktop.png" 2>/dev/null
    mv screenshots/02-home-mobile.png "screenshots/$SITE-mobile.png" 2>/dev/null
    echo "  ✅ Screenshots captured successfully"
  else
    echo "  ⚠️  Screenshot capture had issues (check /tmp/screenshot-$PORT.log)"
    FAILED+=("$SITE:screenshot_failed")
  fi
  
  # Kill dev server
  kill $SERVER_PID 2>/dev/null
  wait $SERVER_PID 2>/dev/null
  
  cd ..
  echo "  ✓ Done with $SITE"
done

echo ""
echo "=========================================="
echo "  BATCH PROCESSING COMPLETE"
echo "=========================================="
echo "  Total: $TOTAL"
echo "  Completed: $COMPLETED"
echo "  Failed: ${#FAILED[@]}"
echo ""

if [ ${#FAILED[@]} -gt 0 ]; then
  echo "  Failed sites:"
  for fail in "${FAILED[@]}"; do
    echo "    - $fail"
  done
fi

echo ""
