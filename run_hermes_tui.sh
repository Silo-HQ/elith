#!/bin/bash

# Elith Hermes-Inspired TUI Launcher
# Launches the enhanced TUI with Hermes Agent patterns

set -e

echo "🚀 Starting Elith Hermes-Inspired TUI..."
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Run ./install.sh first."
    exit 1
fi

# Activate virtual environment
source venv/bin/activate

# Check if backend is running
if ! curl -s http://localhost:8000/api/models > /dev/null 2>&1; then
    echo "⚠️  Backend not detected on http://localhost:8000"
    echo "   Start it with: python -m uvicorn backend.main:app --reload --port 8000"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "✓ Launching Hermes-inspired TUI..."
echo ""
echo "Features:"
echo "  • Streaming responses with delta updates"
echo "  • Live tool execution visualization"
echo "  • Message queue for busy periods"
echo "  • Thinking/reasoning display"
echo ""
echo "Keyboard shortcuts:"
echo "  Ctrl+C - Quit"
echo "  Ctrl+N - New session"
echo "  Ctrl+L - Clear chat"
echo ""

# Run the Hermes-inspired TUI
python3 -m tui.app_hermes

echo ""
echo "👋 Goodbye!"

# Made with Bob
