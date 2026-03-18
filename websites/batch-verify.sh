#!/bin/bash
# Batch screenshot verification script

cd /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites

sites=("resource-compass" "truck-wash-booking" "volunteer-scheduler" "wedding-lead-form" "resource-compass-pro" "ride-ready" "virtual-concierge" "service-scheduler" "service-scheduler-sms" "plating-tracker-pro" "policy-pal" "pocket-historian" "pocket-sommelier-pro" "snow-plow-tracker" "visual-portfolio" "rental-availability" "visitor-parking-finder" "pocket-sommelier" "pocket-historian-pro")

port=5210

for site in "${sites[@]}"; do
  if [ -d "$site" ] && [ ! -d "$site/screenshots" ]; then
    echo "Skipping $site - no screenshots dir"
    continue
  fi
  
  if [ -d "$site/screenshots" ] && [ "$(ls -A $site/screenshots)" ]; then
    echo "Skipping $site - already verified"
    continue
  fi
  
  echo "Verifying $site on port $port..."
  
  # Start dev server
  (cd "$site" && npm run dev -- --port $port &>/dev/null 2>&1 &)
  server_pid=$!
  
  # Wait for server
  sleep 5
  
  # Take screenshots
  node screenshot-script.mjs $port
  
  # Kill server
  kill $server_pid 2>/dev/null
  
  ((port++))
done

echo "Batch verification complete!"
