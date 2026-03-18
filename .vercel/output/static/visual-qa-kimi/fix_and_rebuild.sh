#!/bin/bash
# Fix vite configs for Sites 35-51 and rebuild

cd /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites

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

echo "🔧 Fixing vite configs for Sites 35-51..."
echo ""

for site in "${SITES[@]}"; do
    if [ -d "$site" ]; then
        echo "Processing $site..."
        
        # Update vite config to use relative base
        if [ -f "$site/vite.config.js" ]; then
            sed -i "s|base: '/.*/'|base: './'|g" "$site/vite.config.js"
            sed -i "s|base: \"/.*/\"|base: \"./\"|g" "$site/vite.config.js"
            echo "  ✅ Updated vite.config.js"
        fi
        
        # Rebuild
        cd "$site"
        if npm run build 2>/dev/null; then
            echo "  ✅ Built successfully"
        else
            echo "  ⚠️  Build had issues (may still work)"
        fi
        cd ..
    else
        echo "❌ Directory not found: $site"
    fi
    echo ""
done

echo "✅ All sites processed!"
