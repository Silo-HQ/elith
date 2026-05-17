# Elith Installation Methods

Multiple ways to install Elith - choose what works best for you!

## 🚀 Quick Install (Recommended)

### Method 1: Curl Install Script

**One-line installation:**
```bash
curl -fsSL https://elith.silohq.tech/install.sh | sh
```

**What it does:**
- ✅ Checks Python 3.10+ is installed
- ✅ Clones Elith repository to `~/.elith/repo`
- ✅ Creates Python virtual environment
- ✅ Installs all dependencies
- ✅ Installs TUI dependencies (if Node.js available)
- ✅ Creates `elith` command in `~/.local/bin`

**After installation:**
```bash
elith  # Start using immediately!
```

---

## 📦 Package Manager Installs

### Method 2: npm (Node.js Package Manager)

```bash
npm install -g @elith/cli
```

**Requirements:**
- Node.js 18+
- Python 3.10+ (installed automatically on first run)

**Usage:**
```bash
elith  # Backend auto-installs on first run
```

### Method 3: pnpm (Fast Package Manager)

```bash
pnpm add -g @elith/cli
```

**Benefits:**
- Faster installation
- Disk space efficient
- Same functionality as npm

### Method 4: bun (Ultra-fast Runtime)

```bash
bun add -g @elith/cli
```

**Benefits:**
- Fastest installation
- Modern JavaScript runtime
- Full compatibility

---

## 🍺 Homebrew (macOS/Linux)

### Method 5: Homebrew Formula

```bash
brew install elith
```

**What it installs:**
- Python dependencies
- Node.js (for TUI)
- All required packages
- Creates `elith` command globally

**Advantages:**
- System-wide installation
- Automatic updates via `brew upgrade`
- Clean uninstall via `brew uninstall elith`

---

## 🛠️ Development Installs

### Method 6: Local Install Script

**For development or local testing:**

```bash
cd elith
./install-elith.sh
```

**What it does:**
- Installs to `~/.elith/`
- Creates virtual environment
- Installs in editable mode
- Links `elith` command

### Method 7: Direct pip Install

**For Python developers:**

```bash
cd elith
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -e .
```

**Usage:**
```bash
source venv/bin/activate  # Activate venv first
elith
```

---

## 📋 Comparison Table

| Method | Speed | Auto-Update | Global | Best For |
|--------|-------|-------------|--------|----------|
| **Curl** | ⚡⚡⚡ | Manual | ✅ | Quick start |
| **npm** | ⚡⚡ | `npm update -g` | ✅ | Node.js users |
| **pnpm** | ⚡⚡⚡ | `pnpm update -g` | ✅ | Fast installs |
| **bun** | ⚡⚡⚡⚡ | `bun update -g` | ✅ | Modern stack |
| **Homebrew** | ⚡⚡ | `brew upgrade` | ✅ | macOS/Linux |
| **Local Script** | ⚡⚡ | `git pull` | ✅ | Development |
| **pip** | ⚡ | `git pull` | ❌ | Python devs |

---

## 🎯 Which Method Should I Use?

### For End Users
**Recommended:** Curl install or Homebrew
```bash
# Fastest
curl -fsSL https://elith.dev/install.sh | sh

# Or if you use Homebrew
brew install elith
```

### For Node.js Developers
**Recommended:** npm/pnpm/bun
```bash
npm install -g @elith/cli
# or
pnpm add -g @elith/cli
# or
bun add -g @elith/cli
```

### For Python Developers
**Recommended:** pip install
```bash
pip install -e .
```

### For Contributors
**Recommended:** Local install script
```bash
./install-elith.sh
```

---

## 📦 What Gets Installed?

All methods install:

### Core Components
- **Python Backend** (`~/.elith/repo/backend/`)
  - FastAPI server
  - AI provider integrations
  - Skill system
  - Context engine

- **CLI Tool** (`~/.elith/repo/cli.py`)
  - Command-line interface
  - Service manager
  - Configuration wizard

- **TUI** (`~/.elith/repo/tui/`)
  - Terminal user interface
  - Real-time streaming
  - Interactive features

### Configuration
- **Config Directory:** `~/.elith/`
- **Config File:** `~/.elith/config.toml`
- **PID File:** `~/.elith/backend.pid`
- **Logs:** `~/.elith/backend.log`

---

## 🔄 Updating Elith

### Curl Install
```bash
curl -fsSL https://elith.dev/install.sh | sh
```

### npm/pnpm/bun
```bash
npm update -g @elith/cli
# or
pnpm update -g @elith/cli
# or
bun update -g @elith/cli
```

### Homebrew
```bash
brew upgrade elith
```

### Local/pip Install
```bash
cd ~/.elith/repo  # or your local repo
git pull origin main
pip install -e .
```

---

## 🗑️ Uninstalling Elith

### Curl Install
```bash
rm -rf ~/.elith
rm ~/.local/bin/elith
```

### npm/pnpm/bun
```bash
npm uninstall -g @elith/cli
# or
pnpm remove -g @elith/cli
# or
bun remove -g @elith/cli

# Optionally remove data
rm -rf ~/.elith
```

### Homebrew
```bash
brew uninstall elith
rm -rf ~/.elith  # Optional: remove data
```

### Local/pip Install
```bash
pip uninstall elith
rm -rf ~/.elith
```

---

## 🐛 Troubleshooting

### "Command not found: elith"

**For curl/local install:**
```bash
# Add to PATH
export PATH="$HOME/.local/bin:$PATH"

# Add to shell profile
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

**For npm/pnpm/bun:**
```bash
# Check npm global bin path
npm config get prefix

# Should be in PATH, if not:
export PATH="$(npm config get prefix)/bin:$PATH"
```

### "Python not found"

```bash
# macOS
brew install python@3.10

# Ubuntu/Debian
sudo apt install python3.10

# Windows
# Download from https://www.python.org/downloads/
```

### "Node.js not found" (for TUI)

```bash
# macOS
brew install node

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Windows
# Download from https://nodejs.org/
```

### Permission Errors

```bash
# For npm global installs
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH

# Or use sudo (not recommended)
sudo npm install -g @elith/cli
```

---

## 🎓 Post-Installation

After installing via any method:

1. **Run Elith:**
   ```bash
   elith
   ```

2. **Follow Setup Wizard:**
   - Choose AI provider (Claude, LMStudio, OpenRouter)
   - Enter API key (if needed)
   - Configure preferences

3. **Start Using:**
   ```bash
   elith "explain this repository"
   elith service status
   elith --help
   ```

---

## 📚 Additional Resources

- **Main Documentation:** [README.md](../README.md)
- **Auto-Install Guide:** [AUTO_INSTALL_GUIDE.md](AUTO_INSTALL_GUIDE.md)
- **Installation Details:** [INSTALL.md](../INSTALL.md)
- **Quick Start:** [QUICKSTART.md](../QUICKSTART.md)

---

## 🆘 Need Help?

- **GitHub Issues:** https://github.com/Silo-HQ/elith/issues
- **Discussions:** https://github.com/Silo-HQ/elith/discussions
- **Documentation:** https://github.com/Silo-HQ/elith

---

**Made with Bob** 🤖