#!/bin/bash
# Screenshot Sites 35-51 using file:// protocol

SITES=(
    "landlord-repair-queue"
    "lawn-quote-tool"
    "license-wizard"
    "local-grocer-go"
    "marina-slip-waitlist"
    "mobile-notary"
    "mytrip-planner"
    "mytrip-planner-export"
    "parts-finder"
    "parts-finder-request"
    "permit-whisperer"
    "pet-matchmaker"
    "plating-tracker"
    "plating-tracker-pro"
    "pocket-historian"
    "pocket-historian-pro"
    "pocket-sommelier"
)

BASE_DIR="/home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites"
OUTPUT_DIR="/home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/visual-qa-kimi/screenshots"
CHROME="/usr/bin/google-chrome"

echo "🎬 Screenshot Capture — Kimi Batch (Sites 35-51)"
echo "================================================"
echo ""

for site in "${SITES[@]}"; do
    echo "📸 Processing: $site"
    
    SITE_DIR="$BASE_DIR/$site/dist"
    SITE_OUT="$OUTPUT_DIR/$site"
    mkdir -p "$SITE_OUT"
    
    FILE_URL="file://$SITE_DIR/index.html"
    
    # Desktop screenshot
    echo "  📱 Desktop (1920x1080)..."
    "$CHROME" \
        --headless \
        --disable-gpu \
        --no-sandbox \
        --window-size=1920,1080 \
        --screenshot="$SITE_OUT/desktop.png" \
        --virtual-time-budget=3000 \
        --run-all-compositor-stages-before-draw \
        "$FILE_URL" 2>/dev/null
    
    if [ -f "$SITE_OUT/desktop.png" ]; then
        SIZE=$(du -h "$SITE_OUT/desktop.png" | cut -f1)
        echo "    ✅ Desktop saved ($SIZE)"
    else
        echo "    ❌ Desktop failed"
    fi
    
    # Mobile screenshot
    echo "  📱 Mobile (375x667)..."
    "$CHROME" \
        --headless \
        --disable-gpu \
        --no-sandbox \
        --window-size=375,667 \
        --screenshot="$SITE_OUT/mobile.png" \
        --virtual-time-budget=3000 \
        --run-all-compositor-stages-before-draw \
        "$FILE_URL" 2>/dev/null
    
    if [ -f "$SITE_OUT/mobile.png" ]; then
        SIZE=$(du -h "$SITE_OUT/mobile.png" | cut -f1)
        echo "    ✅ Mobile saved ($SIZE)"
    else
        echo "    ❌ Mobile failed"
    fi
    
    echo ""
done

echo "================================================"
echo "✅ Screenshot capture complete!"
echo "📁 Output: $OUTPUT_DIR"
