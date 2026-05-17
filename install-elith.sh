#!/bin/bash
# Elith CLI Installer
# Usage: curl -fsSL https://raw.githubusercontent.com/your-org/elith/main/install-elith.sh | bash

set -e

INSTALL_DIR="${HOME}/.elith"
BIN_DIR="${HOME}/.local/bin"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Elith CLI Installer"
echo "  Universal repo-aware AI agent framework"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check Python version
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    echo "   Please install Python 3.10 or higher first."
    exit 1
fi

PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
REQUIRED_VERSION="3.10"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Python $REQUIRED_VERSION or higher is required (found $PYTHON_VERSION)"
    exit 1
fi

echo "✓ Python $PYTHON_VERSION detected"

# Create directories
echo "📁 Creating installation directories..."
mkdir -p "$INSTALL_DIR"
mkdir -p "$BIN_DIR"

# Copy repository to install directory
echo "📦 Installing Elith..."
if [ -d "$INSTALL_DIR/elith" ]; then
    echo "   Removing existing installation..."
    rm -rf "$INSTALL_DIR/elith"
fi

echo "   Copying files..."
mkdir -p "$INSTALL_DIR"
cp -r "$SCRIPT_DIR" "$INSTALL_DIR/elith"
cd "$INSTALL_DIR/elith"

# Create virtual environment
echo "🐍 Setting up Python virtual environment..."
python3 -m venv "$INSTALL_DIR/venv"
source "$INSTALL_DIR/venv/bin/activate"

# Install package
echo "📦 Installing Elith and dependencies..."
pip install --upgrade pip > /dev/null 2>&1
pip install -e . > /dev/null 2>&1

# Create wrapper script
echo "🔗 Creating command wrapper..."
cat > "$BIN_DIR/elith" << 'EOF'
#!/bin/bash
source "$HOME/.elith/venv/bin/activate"
exec python "$HOME/.elith/elith/elith_cli.py" "$@"
EOF

chmod +x "$BIN_DIR/elith"

# Check if BIN_DIR is in PATH
if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
    echo ""
    echo "⚠️  $BIN_DIR is not in your PATH"
    echo ""
    echo "Add this to your shell profile (~/.bashrc, ~/.zshrc, etc.):"
    echo ""
    echo "    export PATH=\"\$HOME/.local/bin:\$PATH\""
    echo ""
    echo "Then reload your shell:"
    echo "    source ~/.bashrc  # or ~/.zshrc"
    echo ""
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Elith CLI installed successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "  1. Run: elith init"
echo "  2. Configure your AI provider"
echo "  3. Start using: elith"
echo ""
echo "For help: elith --help"
echo ""

# Made with Bob
