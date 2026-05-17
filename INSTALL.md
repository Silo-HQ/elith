# Elith CLI Installation Guide

Multiple installation methods for the Elith CLI tool.

## Quick Install (Recommended)

### Method 1: Local Install Script (Recommended)

From the Elith repository directory:

```bash
./install-elith.sh
```

This will:
- Install Elith to `~/.elith/`
- Create a virtual environment
- Install all dependencies
- Add `elith` command to `~/.local/bin/`

After installation:
```bash
export PATH="$HOME/.local/bin:$PATH"  # Add to ~/.bashrc or ~/.zshrc
elith init  # Configure your AI provider
elith       # Start using
```

### Method 2: Direct pip Install

From the Elith repository directory:

```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install in editable mode
pip install -e .

# Now you can use elith
elith --help
```

## Manual Installation

### Prerequisites

- Python 3.10 or higher
- pip
- git

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/elith.git
   cd elith
   ```

2. **Create virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install package:**
   ```bash
   pip install -e .
   ```

4. **Verify installation:**
   ```bash
   elith --version
   elith --help
   ```

## Development Installation

For contributors and developers:

```bash
git clone https://github.com/your-org/elith.git
cd elith
python3 -m venv venv
source venv/bin/activate
pip install -e ".[dev]"  # Includes dev dependencies
```

## Configuration

After installation, run the setup wizard:

```bash
elith init
```

This will guide you through:
1. Choosing a default AI provider (Claude, LMStudio, or OpenRouter)
2. Entering API keys (if needed)
3. Setting model preferences

Configuration is stored in `~/.elith/config.toml`

### Manual Configuration

Create `~/.elith/config.toml`:

```toml
[default]
model = "lmstudio"  # or "claude" or "openrouter"

[claude]
api_key = "sk-ant-..."
model = "claude-sonnet-4-20250514"

[lmstudio]
base_url = "http://localhost:1234/v1"
model = "local-model"

[openrouter]
api_key = "sk-or-v1-..."
model = "openai/gpt-4o"
```

## Provider Setup

### Claude (Anthropic)

1. Get API key from https://console.anthropic.com/
2. Run `elith init` and select Claude
3. Enter your API key

### LM Studio (Local)

1. Download and install LM Studio from https://lmstudio.ai/
2. Load a model in LM Studio
3. Start the local server (default: http://localhost:1234)
4. Run `elith init` and select LM Studio

### OpenRouter

1. Get API key from https://openrouter.ai/
2. Run `elith init` and select OpenRouter
3. Enter your API key and choose a model

## Usage

### Interactive Mode (REPL)

```bash
elith
# or
elith chat
```

### One-Shot Commands

```bash
elith "explain this repository"
elith explain backend/
elith refactor src/main.py --focus "readability"
elith test-gen backend/auth.py
elith architect --problem "add websocket support"
elith scan
elith models
```

### Slash Commands (in REPL)

- `/model <provider>` - Switch AI provider
- `/scan` - Re-scan repository
- `/files` - List loaded files
- `/skills` - List available skills
- `/clear` - Clear conversation history
- `/export` - Save session to markdown
- `/help` - Show help
- `exit` or `quit` - Exit REPL

## Troubleshooting

### Command not found

Add to your shell profile (~/.bashrc, ~/.zshrc):
```bash
export PATH="$HOME/.local/bin:$PATH"
```

Then reload:
```bash
source ~/.bashrc  # or ~/.zshrc
```

### Python version error

Elith requires Python 3.10+. Check your version:
```bash
python3 --version
```

Install Python 3.10+ if needed:
- macOS: `brew install python@3.10`
- Ubuntu: `sudo apt install python3.10`
- Windows: Download from python.org

### Module not found errors

Reinstall dependencies:
```bash
cd /path/to/elith
source venv/bin/activate
pip install --upgrade pip
pip install -e .
```

### LM Studio connection error

1. Ensure LM Studio is running
2. Check the server is started (look for "Server running on http://localhost:1234")
3. Verify the base URL in config matches LM Studio's server address

### API key errors

1. Check your API key is correct in `~/.elith/config.toml`
2. Verify the key has proper permissions
3. For Claude: Check https://console.anthropic.com/
4. For OpenRouter: Check https://openrouter.ai/keys

## Uninstallation

### Curl/Manual Install

```bash
rm -rf ~/.elith
rm ~/.local/bin/elith
```

### Homebrew

```bash
brew uninstall elith
```

## Support

- Documentation: https://github.com/your-org/elith
- Issues: https://github.com/your-org/elith/issues
- Discussions: https://github.com/your-org/elith/discussions