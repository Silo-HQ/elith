#!/bin/bash

# Elith TUI Global Installation Script
# Installs the TUI globally so it can be accessed from anywhere

set -e

echo "🚀 Installing Elith TUI globally..."

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building TypeScript..."
npm run build

# Install globally using npm link
echo "🔗 Creating global symlink..."
npm link

echo ""
echo "✅ Installation complete!"
echo ""
echo "You can now run 'elith-tui' from anywhere in your terminal!"
echo ""
echo "Usage:"
echo "  elith-tui          # Start the TUI"
echo ""
echo "To uninstall:"
echo "  npm unlink -g elith-tui"
echo ""

# Made with Bob
