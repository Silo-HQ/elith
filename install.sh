#!/bin/bash
# Elith CLI Installation Script
# This creates a global 'elith' command

set -e

echo "🚀 Installing Elith..."
echo ""

# Get the absolute path to the project directory
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Install Python dependencies
echo "📦 Installing Python dependencies..."
if [ ! -d "$PROJECT_DIR/venv" ]; then
    python3 -m venv "$PROJECT_DIR/venv"
fi
source "$PROJECT_DIR/venv/bin/activate"
pip install -r "$PROJECT_DIR/requirements.txt" --quiet
echo "✓ Python dependencies installed"
echo ""

# Install TUI dependencies
echo "📦 Installing TUI dependencies..."
cd "$PROJECT_DIR/tui"
npm install --silent
echo "✓ TUI dependencies installed"
echo ""

# Setup backend service
echo "🔧 Setting up backend service..."
cd "$PROJECT_DIR"

# Determine install path (match Homebrew behavior)
if [ -d "/opt/homebrew/bin" ]; then
    INSTALL_PATH="/opt/homebrew/bin/elith"
else
    INSTALL_PATH="/usr/local/bin/elith"
fi

# Check if we need sudo
INSTALL_DIR=$(dirname "$INSTALL_PATH")
if [ -w "$INSTALL_DIR" ]; then
    SUDO=""
else
    SUDO="sudo"
    echo "📝 Note: sudo access required to install to $INSTALL_DIR"
fi

# Create the wrapper script that launches TUI directly
cat > /tmp/elith << EOF
#!/bin/bash
# Elith TUI launcher - Direct TypeScript execution
cd "$PROJECT_DIR/tui" && npx tsx src/index.tsx "\$@"
EOF

# Install the wrapper
$SUDO mv /tmp/elith "$INSTALL_PATH"
$SUDO chmod +x "$INSTALL_PATH"
echo "✓ Global command installed"
echo ""

# Start backend service
echo "🚀 Starting backend service..."
source "$PROJECT_DIR/venv/bin/activate"
python3 "$PROJECT_DIR/cli.py" service start
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Elith installed successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Quick Start:"
echo "  1. Run: elith"
echo "  2. Start coding!"
echo ""
echo "Commands:"
echo "  elith                  - Start interactive mode"
echo "  elith init             - Configure providers"
echo "  elith service status   - Check backend status"
echo "  elith --help           - Show all commands"
echo ""
echo "Configuration: ~/.elith/config.toml"
echo "Backend logs: ~/.elith/backend.log"
echo ""

# Made with Bob
