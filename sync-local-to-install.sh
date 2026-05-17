#!/bin/bash
# Sync local development build to installed version
# Usage: ./sync-local-to-install.sh

set -e

SOURCE="/Volumes/DataVault/Projects/elith"
TARGET="$HOME/.elith/elith"

echo "🔄 Syncing local build to installation..."
echo ""

# Check if source exists
if [ ! -d "$SOURCE" ]; then
    echo "❌ Error: Source directory not found: $SOURCE"
    exit 1
fi

# Check if target exists
if [ ! -d "$TARGET" ]; then
    echo "❌ Error: Target directory not found: $TARGET"
    echo "   Run 'elith init' first to create installation"
    exit 1
fi

# Stop backend if running
echo "📍 Stopping backend..."
elith service stop 2>/dev/null || true

# Copy main files
echo "📝 Copying main files..."
cp "$SOURCE/cli.py" "$TARGET/cli.py"
cp "$SOURCE/requirements.txt" "$TARGET/requirements.txt"
cp "$SOURCE/.env.example" "$TARGET/.env.example"

# Copy backend directory
echo "📦 Copying backend..."
rsync -av --delete \
    --exclude='__pycache__' \
    --exclude='*.pyc' \
    --exclude='.pytest_cache' \
    "$SOURCE/backend/" "$TARGET/backend/"

# Copy TUI if it exists
if [ -d "$SOURCE/tui" ]; then
    echo "🖥️  Copying TUI..."
    rsync -av --delete \
        --exclude='__pycache__' \
        --exclude='*.pyc' \
        "$SOURCE/tui/" "$TARGET/tui/"
fi

# Update dependencies
echo "📚 Updating dependencies..."
source "$HOME/.elith/venv/bin/activate"
pip install -r "$TARGET/requirements.txt" --upgrade --quiet

# Restart backend
echo "🚀 Starting backend..."
elith service start

# Verify
echo ""
echo "✅ Local build synced successfully!"
echo ""
echo "📊 Status:"
elith --version
elith service status

echo ""
echo "💡 Tip: Run 'elith service restart' if you see any issues"

# Made with Bob
