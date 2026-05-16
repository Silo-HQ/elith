#!/bin/bash
# Elith CLI Uninstallation Script
# Removes the global 'elith' command

set -e

echo "🗑️  Uninstalling Elith CLI..."

INSTALL_PATH="/usr/local/bin/elith"

# Check if elith is installed
if [ ! -f "$INSTALL_PATH" ]; then
    echo "❌ Elith CLI is not installed at $INSTALL_PATH"
    exit 1
fi

# Check if we need sudo
if [ -w "/usr/local/bin" ]; then
    SUDO=""
else
    SUDO="sudo"
    echo "📝 Note: sudo access required to remove from /usr/local/bin"
fi

# Remove the wrapper script
$SUDO rm "$INSTALL_PATH"

echo "✅ Elith CLI uninstalled successfully!"
echo ""
echo "The 'elith' command has been removed from your system."
echo ""
echo "To reinstall, run: ./install.sh"
echo ""

# Made with Bob