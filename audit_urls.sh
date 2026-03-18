#!/usr/bin/env bash
# URL Audit Script for NAI - Check all 68 sites

cd /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative

OUTPUT_FILE="URL_AUDIT_REPORT_$(date +%Y%m%d-%H%M).json"

echo "{\"auditDate\": \"$(date -Iseconds)\"," > "$OUTPUT_FILE"
echo "\"sites\": [" >> "$OUTPUT_FILE"

FIRST=true

cat ALL_WEBSITE_LINKS.md | grep -E "^\| \*\*" | while IFS='|' read -r name url rest; do
    site_name=$(echo "$name" | sed 's/[* ]//g')
    site_url=$(echo "$url" | sed 's/ //g')
    
    # Test the URL
    status=$(curl -s -o /dev/null -w "%{http_code}" "$site_url" --max-time 10 2>/dev/null)
    
    # Check if it redirects to main page (content check)
    content_check=$(curl -s "$site_url" --max-time 10 2>/dev/null | grep -c "Modernizing Ashtabula" || echo "0")
    
    if [ "$status" = "200" ] && [ "$content_check" = "0" ]; then
        actual_status="OK"
    elif [ "$status" = "200" ] && [ "$content_check" -gt "0" ]; then
        actual_status="REDIRECT_TO_MAIN"
    else
        actual_status="ERROR_$status"
    fi
    
    if [ "$FIRST" = "true" ]; then
        FIRST=false
    else
        echo "," >> "$OUTPUT_FILE"
    fi
    
    cat >> "$OUTPUT_FILE" << EOF
  {
    "name": "$site_name",
    "url": "$site_url",
    "httpStatus": $status,
    "actualStatus": "$actual_status"
  }
EOF
    
    echo "$site_name: $actual_status"
done

echo "" >> "$OUTPUT_FILE"
echo "]}" >> "$OUTPUT_FILE"

echo ""
echo "Report saved to: $OUTPUT_FILE"
