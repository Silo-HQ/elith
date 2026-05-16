#!/bin/bash
# Run the new Elith TUI

# Check if textual is installed
if ! python3 -c "import textual" 2>/dev/null; then
    echo "Installing required dependencies..."
    pip3 install --user textual rich
fi

# Run the new TUI
python3 -m tui.app_new

# Made with Bob
