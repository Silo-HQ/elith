#!/bin/bash

# Elith TypeScript TUI Runner
# Runs the TypeScript TUI with tsx for development

cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Run the TUI
npm run dev

# Made with Bob
