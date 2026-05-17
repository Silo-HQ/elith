# Local Development Updates Guide

## Overview

When developing Elith locally, you have a local build that's different from the published Homebrew formula. This guide explains how to update your local development installation.

## Current Setup

You have **two** Homebrew formulas:

1. **`elith-local.rb`** - For local development (uses local git repo)
2. **`elith.rb`** - For production (uses GitHub releases)

## Local Development Update Process

### Method 1: Using Homebrew with Local Formula

#### Initial Setup (One-time)
```bash
# Create local tap (if not already done)
brew tap-new silo-hq/elith

# Install from local formula
brew install --build-from-source ./elith-local.rb
```

#### Update Local Build
```bash
# 1. Make your code changes
vim cli.py
vim backend/main.py

# 2. Commit changes to dev branch
git add .
git commit -m "feat: add new feature"

# 3. Update local formula if needed
vim elith-local.rb  # Update version if needed

# 4. Reinstall from local source
brew reinstall --build-from-source ./elith-local.rb

# 5. Verify update
elith --version
```

### Method 2: Direct Development (Recommended for Active Development)

This is **faster** for rapid development cycles:

```bash
# 1. Use the project's virtual environment directly
cd /Volumes/DataVault/Projects/elith
source .venv/bin/activate

# 2. Install in editable mode
pip install -e .

# 3. Run directly from source
python cli.py --version

# 4. Or use the wrapper
./cli.py --version

# 5. Changes take effect immediately (no reinstall needed)
```

### Method 3: Manual Update Script

Create a quick update script for local development:

```bash
# Save as: update-local.sh
#!/bin/bash
cd /Volumes/DataVault/Projects/elith

# Pull latest changes (if working with git)
git pull origin dev

# Update dependencies
source .venv/bin/activate
pip install -r requirements.txt --upgrade

# Copy to ~/.elith/ (if using that installation)
cp cli.py ~/.elith/elith/cli.py
cp backend/utils/service_manager.py ~/.elith/elith/backend/utils/service_manager.py

# Restart backend
elith service restart

echo "✅ Local build updated!"
```

## Comparison: Local vs Production Updates

### Local Development Build

**Location:** `/Volumes/DataVault/Projects/elith`

**Update Command:**
```bash
# Option A: Reinstall via Homebrew
brew reinstall --build-from-source ./elith-local.rb

# Option B: Direct from source (faster)
cd /Volumes/DataVault/Projects/elith
source .venv/bin/activate
pip install -e .

# Option C: Manual copy
cp cli.py ~/.elith/elith/cli.py
elith service restart
```

**When to use:**
- Active development
- Testing new features
- Debugging issues
- Before publishing to production

### Production Build

**Location:** Installed via Homebrew from GitHub

**Update Command:**
```bash
brew upgrade elith
```

**When to use:**
- Stable releases only
- Production environments
- End users

## Current Installation Detection

Check which installation you're using:

```bash
# Check which elith is being used
which elith

# Possible outputs:
# /opt/homebrew/bin/elith          → Homebrew (production)
# /Users/halfsilver/.local/bin/elith → Manual install
# /usr/local/bin/elith              → npm install

# Check if it's pointing to local source
cat $(which elith)

# If it shows /Volumes/DataVault/Projects/elith → Local build
# If it shows /opt/homebrew/Cellar/elith → Homebrew build
```

## Your Current Setup

Based on our earlier work, you have:

```bash
# Active installation
which elith
# Output: /Users/halfsilver/.local/bin/elith

# This points to
cat /Users/halfsilver/.local/bin/elith
# #!/bin/bash
# source "$HOME/.elith/venv/bin/activate"
# exec python "$HOME/.elith/elith/cli.py" "$@"

# Which uses files from
ls ~/.elith/elith/
# This is a COPY of your local repo
```

## Update Your Current Setup

### Quick Update (Recommended)

```bash
# 1. Update the source
cd /Volumes/DataVault/Projects/elith
git pull origin dev  # or make your changes

# 2. Copy updated files to ~/.elith/
cp cli.py ~/.elith/elith/cli.py
cp backend/utils/service_manager.py ~/.elith/elith/backend/utils/service_manager.py
cp -r backend/providers/*.py ~/.elith/elith/backend/providers/
cp -r backend/skills/*.py ~/.elith/elith/backend/skills/

# 3. Update dependencies if needed
source ~/.elith/venv/bin/activate
pip install -r requirements.txt --upgrade

# 4. Restart backend
elith service restart

# 5. Verify
elith --version
```

### Automated Update Script

Create this script for easy updates:

```bash
# Save as: sync-local-to-install.sh
#!/bin/bash
set -e

SOURCE="/Volumes/DataVault/Projects/elith"
TARGET="$HOME/.elith/elith"

echo "🔄 Syncing local build to installation..."

# Copy main files
cp "$SOURCE/cli.py" "$TARGET/cli.py"
cp "$SOURCE/requirements.txt" "$TARGET/requirements.txt"

# Copy backend
cp -r "$SOURCE/backend/"*.py "$TARGET/backend/"
cp -r "$SOURCE/backend/providers/"*.py "$TARGET/backend/providers/"
cp -r "$SOURCE/backend/skills/"*.py "$TARGET/backend/skills/"
cp -r "$SOURCE/backend/utils/"*.py "$TARGET/backend/utils/"
cp -r "$SOURCE/backend/routes/"*.py "$TARGET/backend/routes/"

# Update dependencies
source "$HOME/.elith/venv/bin/activate"
pip install -r "$TARGET/requirements.txt" --upgrade --quiet

# Restart backend
elith service restart

echo "✅ Local build synced successfully!"
elith --version
```

Make it executable:
```bash
chmod +x sync-local-to-install.sh
```

Use it:
```bash
./sync-local-to-install.sh
```

## Testing Local Changes

### Before Syncing

Test in the source directory first:

```bash
cd /Volumes/DataVault/Projects/elith
source .venv/bin/activate

# Test directly
python cli.py --version
python cli.py service status

# Test backend
python -m uvicorn backend.main:app --reload --port 8001

# Test in another terminal
curl http://localhost:8001/health
```

### After Syncing

Test the installed version:

```bash
elith --version
elith service status
elith service restart
```

## Homebrew Local Formula Updates

If you want to use Homebrew for local development:

### Update elith-local.rb

```ruby
class ElithLocal < Formula
  desc "AI-powered code assistant"
  homepage "https://elith.silohq.tech"
  url "file:///Volumes/DataVault/Projects/elith", using: :git, branch: "dev"
  version "0.1.0-local"  # Update this when you make changes

  depends_on "python@3.14"

  def install
    # Create virtualenv
    virtualenv_install_with_resources
    
    # Install the package
    system libexec/"bin/pip", "install", "-e", "."
    
    # Create wrapper script
    (bin/"elith").write <<~EOS
      #!/bin/bash
      source "#{libexec}/bin/activate"
      exec python "#{libexec}/lib/python3.14/site-packages/elith/cli.py" "$@"
    EOS
  end

  test do
    system "#{bin}/elith", "--version"
  end
end
```

### Install/Update via Homebrew

```bash
# First time
brew install --build-from-source ./elith-local.rb

# After making changes
brew reinstall --build-from-source ./elith-local.rb

# Or force rebuild
brew uninstall elith-local
brew install --build-from-source ./elith-local.rb
```

## Best Practices

### For Active Development

1. **Use direct source** (fastest):
   ```bash
   cd /Volumes/DataVault/Projects/elith
   source .venv/bin/activate
   python cli.py [command]
   ```

2. **Use sync script** (when you want to test installed version):
   ```bash
   ./sync-local-to-install.sh
   elith [command]
   ```

### For Testing Before Release

1. **Test with local Homebrew formula**:
   ```bash
   brew reinstall --build-from-source ./elith-local.rb
   elith [command]
   ```

2. **Test all installation methods**:
   - Homebrew local
   - npm local (`npm link`)
   - Manual install

### For Production Release

1. **Bump version**:
   ```bash
   ./scripts/bump_version.sh 0.2.0
   ```

2. **Update CHANGELOG.md**

3. **Commit and tag**:
   ```bash
   git commit -am "chore: bump version to 0.2.0"
   git tag v0.2.0
   git push origin main --tags
   ```

4. **Update production formula** (`elith.rb`)

5. **Test production install**:
   ```bash
   brew uninstall elith-local
   brew install silo-hq/elith/elith
   ```

## Summary

**For your current setup:**

```bash
# Quick update (copy files)
cp /Volumes/DataVault/Projects/elith/cli.py ~/.elith/elith/cli.py
elith service restart

# Full update (use sync script)
./sync-local-to-install.sh

# Development (direct from source)
cd /Volumes/DataVault/Projects/elith
source .venv/bin/activate
python cli.py --version
```

**`brew upgrade elith` will NOT work for local builds** because:
- It looks for updates in the Homebrew tap (GitHub)
- Your local changes aren't in the tap yet
- You need to use `brew reinstall --build-from-source ./elith-local.rb` instead

**Recommended workflow:**
1. Develop in `/Volumes/DataVault/Projects/elith`
2. Test with `python cli.py` directly
3. When ready, sync to `~/.elith/` with sync script
4. Test installed version with `elith` command
5. When stable, publish and use `brew upgrade elith`