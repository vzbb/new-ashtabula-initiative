#!/bin/bash

# cycle.sh - Iterates through app directories and runs 'npm run dev' briefly

for dir in */; do
    if [ -f "${dir}package.json" ]; then
        echo "========================================"
        echo "Launching: ${dir}"
        echo "========================================"
        
        # Use timeout to run the command for 8 seconds.
        # --foreground ensures it handles signals correctly.
        # We send SIGINT (Ctrl+C) to allow clean shutdown.
        (cd "$dir" && timeout --foreground --signal=SIGINT 8s npm run dev)
        
        echo -e "
Moving to next project...
"
        sleep 1
    fi
done

echo "Cycle complete!"
