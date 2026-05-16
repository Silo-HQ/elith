#!/bin/bash
# Test script to verify TUI runs without errors

cd "$(dirname "$0")"

echo "Testing TypeScript TUI..."
echo "Starting TUI (will auto-exit after 3 seconds)..."

# Run the TUI and kill it after 3 seconds
npm run dev &
PID=$!
sleep 3
kill $PID 2>/dev/null

echo ""
echo "Test complete. If you saw the TUI interface above, it's working!"
echo ""
echo "To run the TUI normally, use:"
echo "  npm run dev"
echo "or"
echo "  ./run.sh"

# Made with Bob
