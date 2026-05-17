#!/bin/bash
# Uninstall Elith completely

set -e

echo "🗑️  Uninstalling Elith..."
echo ""

# Stop backend if running
echo "📍 Stopping backend service..."
if command -v elith &> /dev/null; then
    elith service stop 2>/dev/null || true
fi

# Remove Homebrew installation
if brew list elith-local &> /dev/null; then
    echo "🍺 Removing Homebrew installation..."
    brew uninstall elith-local
fi

# Remove global command
if [ -f "/opt/homebrew/bin/elith" ]; then
    echo "🔧 Removing global command..."
    rm -f /opt/homebrew/bin/elith
fi

# Remove ~/.elith directory
if [ -d "$HOME/.elith" ]; then
    echo "📁 Removing ~/.elith directory..."
    rm -rf "$HOME/.elith"
fi

# Remove npm global package if installed
if npm list -g @elith/cli &> /dev/null; then
    echo "📦 Removing npm global package..."
    npm uninstall -g @elith/cli
fi

echo ""
echo "✅ Elith uninstalled successfully!"
echo ""
echo "💡 To reinstall: curl -fsSL https://elith.silohq.tech/install.sh | sh"
echo ""

# Made with Bob
