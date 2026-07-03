#!/bin/bash
# commit-all-websites.sh
# Commit and push all website changes to git

set -e

WEBSITES_DIR="/home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites"
COMMIT_MESSAGE="${1:-Update website files}"

echo "========================================"
echo "  Commit All Websites"
echo "========================================"
echo ""
echo "Commit message: $COMMIT_MESSAGE"
echo ""

COMMITTED=0
FAILED=0

for dir in "$WEBSITES_DIR"/*/; do
    # Check if it's a directory and has .git
    if [ -d "$dir" ] && [ -d "$dir/.git" ]; then
        site_name=$(basename "$dir")
        echo "Processing: $site_name"
        
        cd "$dir"
        
        # Check if there are changes to commit
        if [ -n "$(git status --porcelain)" ]; then
            echo "  Changes detected, committing..."
            
            # Add all changes
            git add -A
            
            # Commit with message
            if git commit -m "$COMMIT_MESSAGE"; then
                echo "  ✅ Committed"
                
                # Push to main
                if git push origin main; then
                    echo "  ✅ Pushed to main"
                    COMMITTED=$((COMMITTED + 1))
                else
                    echo "  ❌ Push failed"
                    FAILED=$((FAILED + 1))
                fi
            else
                echo "  ❌ Commit failed"
                FAILED=$((FAILED + 1))
            fi
        else
            echo "  ℹ️  No changes"
        fi
        
        echo ""
    fi
done

echo "========================================"
echo "  Summary"
echo "========================================"
echo "Committed & Pushed: $COMMITTED"
echo "Failed: $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "✅ All changes committed successfully!"
else
    echo "⚠️  Some sites failed to commit/push"
fi
