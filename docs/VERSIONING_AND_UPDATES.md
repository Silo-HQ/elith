# Versioning and Update Strategy

## Current Version

**Version**: `0.1.0`
**Status**: Beta/Development
**Release Date**: 2026-05-17

## Versioning Logic

Elith follows **Semantic Versioning (SemVer)**: `MAJOR.MINOR.PATCH`

### Version Format: `X.Y.Z`

- **MAJOR (X)**: Breaking changes, incompatible API changes
  - Example: `1.0.0` → `2.0.0` (complete rewrite, different config format)
  
- **MINOR (Y)**: New features, backward-compatible additions
  - Example: `0.1.0` → `0.2.0` (new provider added, new commands)
  
- **PATCH (Z)**: Bug fixes, backward-compatible fixes
  - Example: `0.1.0` → `0.1.1` (fix service manager bug, update docs)

### Pre-release Versions

- **Alpha**: `0.1.0-alpha.1` - Early development, unstable
- **Beta**: `0.1.0-beta.1` - Feature complete, testing phase
- **RC**: `0.1.0-rc.1` - Release candidate, final testing

## Version Locations

All version numbers must be synchronized across:

1. **`cli.py`** - Line 1-2
   ```python
   __version__ = "0.1.0"
   ```

2. **`package.json`** - Line 2
   ```json
   "version": "0.1.0"
   ```

3. **`pyproject.toml`** - Line 3
   ```toml
   version = "0.1.0"
   ```

4. **`elith.rb`** (Homebrew formula) - Line 4
   ```ruby
   version "0.1.0"
   ```

5. **`backend/main.py`** - API version
   ```python
   app = FastAPI(title="Elith API", version="0.1.0")
   ```

## Update Methods

### 1. Homebrew Update

```bash
# Check for updates
brew update
brew upgrade elith

# Or force reinstall
brew reinstall elith
```

**How it works:**
- Homebrew checks the tap repository for new formula versions
- Downloads and installs the new version
- Preserves user config in `~/.elith/config.toml`

### 2. npm/pnpm/bun Update

```bash
# Check current version
elith --version

# Update to latest
npm update -g elith
# or
pnpm update -g elith
# or
bun update -g elith

# Update to specific version
npm install -g elith@0.2.0
```

**How it works:**
- npm checks registry for new versions
- Downloads and installs via `postinstall.js` script
- Runs Python setup automatically

### 3. Curl Installer Update

```bash
# Re-run installer (detects existing installation)
curl -fsSL https://elith.silohq.tech/install.sh | bash

# Or use update flag
curl -fsSL https://elith.silohq.tech/install.sh | bash -s -- --update
```

**How it works:**
- Detects existing installation in `~/.elith/`
- Backs up config before updating
- Pulls latest code and reinstalls

### 4. Manual Update (Development)

```bash
cd /path/to/elith
git pull origin main
pip install -e . --upgrade
```

## Auto-Update Check

### Planned Feature (Not Yet Implemented)

```bash
# Check for updates automatically
elith update check

# Update to latest version
elith update install

# Enable auto-update notifications
elith config set auto_update_check true
```

**Implementation Plan:**
```python
# backend/utils/update_checker.py
def check_for_updates():
    current = __version__
    latest = fetch_latest_version_from_github()
    if latest > current:
        print(f"Update available: {current} → {latest}")
        print("Run: elith update install")
```

## Breaking Changes Policy

### Major Version Updates (1.0.0 → 2.0.0)

**User Action Required:**
1. Read migration guide: `docs/MIGRATION_v2.md`
2. Backup config: `cp ~/.elith/config.toml ~/.elith/config.toml.backup`
3. Update: `brew upgrade elith` (or npm/curl method)
4. Run migration: `elith migrate --from v1 --to v2`
5. Test: `elith service status`

**What We Guarantee:**
- Migration scripts provided
- Config auto-conversion when possible
- Clear deprecation warnings in previous version

### Minor Version Updates (0.1.0 → 0.2.0)

**User Action Required:**
- Just update: `brew upgrade elith`
- No config changes needed
- New features available immediately

**What We Guarantee:**
- Backward compatibility
- Existing features work unchanged
- Config format remains compatible

### Patch Version Updates (0.1.0 → 0.1.1)

**User Action Required:**
- Just update: `brew upgrade elith`
- No changes needed

**What We Guarantee:**
- Bug fixes only
- No new features
- No config changes

## Version Compatibility Matrix

| Elith Version | Python | Node.js | Homebrew | OS |
|---------------|--------|---------|----------|-----|
| 0.1.0 | ≥3.10 | ≥18.0 | ≥4.0 | macOS 11+, Linux |
| 0.2.0 | ≥3.10 | ≥18.0 | ≥4.0 | macOS 11+, Linux, Windows |
| 1.0.0 | ≥3.11 | ≥20.0 | ≥4.0 | macOS 12+, Linux, Windows |

## Release Process

### 1. Pre-Release Checklist

```bash
# Run tests
pytest tests/

# Update version in all files
./scripts/bump_version.sh 0.2.0

# Update CHANGELOG.md
vim CHANGELOG.md

# Commit version bump
git add .
git commit -m "chore: bump version to 0.2.0"
git tag v0.2.0
```

### 2. Release Checklist

```bash
# Push to GitHub
git push origin main
git push origin v0.2.0

# Publish to npm
npm publish

# Update Homebrew formula
cd homebrew-elith
vim elith.rb  # Update version and sha256
git commit -am "chore: update to v0.2.0"
git push

# Create GitHub release
gh release create v0.2.0 --notes "Release notes here"
```

### 3. Post-Release Checklist

- [ ] Verify Homebrew install: `brew install silo-hq/elith/elith`
- [ ] Verify npm install: `npm install -g elith`
- [ ] Test curl installer: `curl -fsSL https://elith.silohq.tech/install.sh | bash`
- [ ] Update documentation website
- [ ] Announce on social media/Discord

## Changelog Format

### CHANGELOG.md Structure

```markdown
# Changelog

## [0.2.0] - 2026-05-20

### Added
- New OpenAI provider support
- `elith update` command for auto-updates
- WebSocket streaming for real-time responses

### Changed
- Improved service manager performance
- Updated TUI with better error messages

### Fixed
- Backend crash on port conflict
- Memory leak in context engine

### Deprecated
- `--legacy-mode` flag (will be removed in 1.0.0)

### Security
- Updated dependencies with security patches

## [0.1.1] - 2026-05-18

### Fixed
- Service manager PID tracking bug
- TUI connection timeout issue
```

## Deprecation Policy

### Deprecation Timeline

1. **Announce** (Version N): Feature marked as deprecated
   ```python
   @deprecated(version="0.2.0", removal="1.0.0")
   def old_function():
       warnings.warn("Use new_function() instead")
   ```

2. **Warn** (Version N+1): Warnings in logs
   ```
   WARNING: old_function() is deprecated and will be removed in v1.0.0
   ```

3. **Remove** (Version N+2): Feature removed
   - Only in major version updates
   - Migration guide provided

## Error Handling During Updates

### Common Update Errors

#### 1. Port Conflict After Update
```bash
Error: Backend failed to start - port 8000 already in use

Solution:
elith service stop
elith service start
```

#### 2. Config Format Changed
```bash
Error: Invalid config format

Solution:
elith config migrate
# or
mv ~/.elith/config.toml ~/.elith/config.toml.old
elith init
```

#### 3. Dependency Conflict
```bash
Error: psutil version mismatch

Solution:
pip install --upgrade psutil
# or
brew reinstall elith
```

#### 4. Permission Denied
```bash
Error: Permission denied writing to ~/.elith/

Solution:
sudo chown -R $USER ~/.elith/
elith service restart
```

## Version Check Command

### Current Implementation

```bash
elith --version
# Output: Elith v0.1.0
```

### Planned Enhancement

```bash
elith version
# Output:
# Elith v0.1.0
# Python: 3.14.4
# Backend: Running (PID 37895)
# Latest: v0.2.0 (update available)
# 
# Run 'elith update install' to upgrade
```

## Rollback Strategy

### If Update Fails

#### Homebrew
```bash
# List installed versions
brew list --versions elith

# Rollback to previous version
brew switch elith 0.1.0
```

#### npm
```bash
# Install specific version
npm install -g elith@0.1.0
```

#### Manual
```bash
# Restore from backup
cd ~/.elith/
rm -rf elith/
cp -r elith.backup/ elith/
```

## Future Improvements

### Planned for v0.2.0
- [ ] `elith update check` - Check for updates
- [ ] `elith update install` - Auto-update
- [ ] `elith version --detailed` - Show all component versions
- [ ] Auto-backup before updates

### Planned for v1.0.0
- [ ] Delta updates (only download changed files)
- [ ] Rollback command: `elith update rollback`
- [ ] Update notifications in TUI
- [ ] Version pinning: `elith config set version 0.2.0`

## Summary

**Current State:**
- ✅ Version defined in all files
- ✅ Manual update via Homebrew/npm/curl
- ✅ Semantic versioning adopted
- ❌ Auto-update not yet implemented
- ❌ Migration scripts not yet created

**Update Process:**
1. Check version: `elith --version`
2. Update via your install method:
   - Homebrew: `brew upgrade elith`
   - npm: `npm update -g elith`
   - curl: Re-run installer
3. Verify: `elith service status`

**No Errors Guaranteed:**
- Patch updates (0.1.0 → 0.1.1): Zero breaking changes
- Minor updates (0.1.0 → 0.2.0): Backward compatible
- Major updates (0.1.0 → 1.0.0): Migration guide provided

**Version Sync:**
All version numbers are synchronized across `cli.py`, `package.json`, `pyproject.toml`, `elith.rb`, and `backend/main.py`.