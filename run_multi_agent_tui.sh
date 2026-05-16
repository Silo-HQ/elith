#!/bin/bash

# Launch script for Multi-Agent TUI

echo "🚀 Starting Elith Multi-Agent TUI"
echo ""

# Check if backend is running
if ! curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "⚠️  Warning: Backend not detected at http://localhost:8000"
    echo "   Start backend in another terminal:"
    echo "   uvicorn backend.main:app --reload --port 8000"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Launch multi-agent TUI
python3 -m tui.app_multi_agent

# Made with Bob
