#!/bin/bash
# Version bump script for Elith
# Usage: ./scripts/bump_version.sh <new_version>
# Example: ./scripts/bump_version.sh 0.2.0

set -e

if [ -z "$1" ]; then
    echo "Error: Version number required"
    echo "Usage: ./scripts/bump_version.sh <version>"
    echo "Example: ./scripts/bump_version.sh 0.2.0"
    exit 1
fi

NEW_VERSION="$1"

# Validate version format (X.Y.Z)
if ! [[ "$NEW_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[a-z]+\.[0-9]+)?$ ]]; then
    echo "Error: Invalid version format"
    echo "Expected: X.Y.Z or X.Y.Z-alpha.N"
    echo "Got: $NEW_VERSION"
    exit 1
fi

echo "🔄 Bumping version to $NEW_VERSION..."

# Get project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# 1. Update cli.py
echo "📝 Updating cli.py..."
sed -i.bak "s/__version__ = \".*\"/__version__ = \"$NEW_VERSION\"/" cli.py
rm cli.py.bak

# 2. Update package.json
echo "📝 Updating package.json..."
sed -i.bak "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" package.json
rm package.json.bak

# 3. Update pyproject.toml
echo "📝 Updating pyproject.toml..."
sed -i.bak "s/version = \".*\"/version = \"$NEW_VERSION\"/" pyproject.toml
rm pyproject.toml.bak

# 4. Update elith.rb (Homebrew formula)
echo "📝 Updating elith.rb..."
sed -i.bak "s/version \".*\"/version \"$NEW_VERSION\"/" elith.rb
rm elith.rb.bak

# 5. Update backend/main.py
echo "📝 Updating backend/main.py..."
sed -i.bak "s/version=\".*\"/version=\"$NEW_VERSION\"/" backend/main.py
rm backend/main.py.bak

# Verify changes
echo ""
echo "✅ Version updated in all files:"
echo "   - cli.py: $(grep '__version__' cli.py)"
echo "   - package.json: $(grep '"version"' package.json | head -1)"
echo "   - pyproject.toml: $(grep 'version =' pyproject.toml)"
echo "   - elith.rb: $(grep 'version "' elith.rb)"
echo "   - backend/main.py: $(grep 'version=' backend/main.py | head -1)"

echo ""
echo "📋 Next steps:"
echo "   1. Update CHANGELOG.md with release notes"
echo "   2. Commit changes: git add . && git commit -m 'chore: bump version to $NEW_VERSION'"
echo "   3. Create tag: git tag v$NEW_VERSION"
echo "   4. Push: git push origin main && git push origin v$NEW_VERSION"
echo "   5. Publish: npm publish"
echo "   6. Update Homebrew tap"
echo ""
echo "🎉 Version bump complete!"

# Made with Bob
