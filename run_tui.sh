#!/bin/bash
# Elith TUI Runner Script
# This script ensures the TUI runs correctly from any directory

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Change to project root
cd "$SCRIPT_DIR"

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
else
    echo "Virtual environment not found. Creating one..."
    python3 -m venv venv
    source venv/bin/activate
    pip install textual pyfiglet
fi

# Run the TUI as a module from project root
python3 -m tui.app

# Made with Bob
