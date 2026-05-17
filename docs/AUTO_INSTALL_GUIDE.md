# Elith Auto-Install Guide

## One-Command Installation & Usage

Elith now features automatic service management - just install and run!

## Installation

### Method 1: Homebrew (Recommended)

```bash
# Install Elith
brew install /path/to/elith.rb

# That's it! Everything is installed.
```

### Method 2: Local Install Script

```bash
cd elith
./install-elith.sh
```

### Method 3: Direct pip Install

```bash
cd elith
python3 -m venv venv
source venv/bin/activate
pip install -e .
```

## Usage

### First Run - Auto Setup

```bash
elith
```

On first run, Elith will:
1. Guide you through provider setup (Claude, LMStudio, or OpenRouter)
2. Auto-start the backend service
3. Launch the interactive TUI

**That's it!** No manual backend startup needed.

### Subsequent Runs

```bash
elith  # Just run it - backend auto-starts if needed
```

## What Happens Automatically

When you run `elith`:

1. **Backend Check**: Checks if backend is running on port 8000
2. **Auto-Start**: If not running, starts backend automatically in background
3. **Health Check**: Waits for backend to be ready (max 30 seconds)
4. **Launch TUI**: Opens interactive terminal interface
5. **Persistent**: Backend keeps running even after you exit

## Service Management

### Check Backend Status

```bash
elith service status
```

Output:
```
✓ Backend is running
  Port: 8000
  PID: 12345
  Logs: /Users/you/.elith/backend.log
```

### Manual Service Control

```bash
# Start backend manually
elith service start

# Stop backend
elith service stop

# Restart backend
elith service restart
```

### Disable Auto-Start

If you want to manage the backend yourself:

```bash
elith --no-backend  # Run without auto-starting backend
```

## Configuration

### Initial Setup

```bash
elith init  # Reconfigure providers anytime
```

Configuration is stored in: `~/.elith/config.toml`

### Example Configuration

```toml
[default]
model = "lmstudio"

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

## Commands

### Interactive Mode

```bash
elith           # Auto-starts backend, launches TUI
elith chat      # Same as above
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

### Service Commands

```bash
elith service start    # Start backend
elith service stop     # Stop backend
elith service restart  # Restart backend
elith service status   # Check status
```

### Options

```bash
elith --version        # Show version
elith --help           # Show help
elith --verbose        # Verbose output
elith --no-backend     # Don't auto-start backend
elith --model claude   # Override default model
```

## File Locations

| File | Location | Purpose |
|------|----------|---------|
| Config | `~/.elith/config.toml` | Provider settings |
| Backend PID | `~/.elith/backend.pid` | Process ID |
| Backend Logs | `~/.elith/backend.log` | Service logs |
| Session Reports | `./bob-reports/` | Task outputs |

## Troubleshooting

### Backend Won't Start

```bash
# Check logs
cat ~/.elith/backend.log

# Try manual start
elith service start

# Check port availability
lsof -i :8000
```

### Port Already in Use

If port 8000 is taken:

```bash
# Stop any existing backend
elith service stop

# Or kill the process
lsof -ti :8000 | xargs kill -9

# Restart
elith service start
```

### Configuration Issues

```bash
# Reconfigure
elith init

# Check config
cat ~/.elith/config.toml
```

### TUI Not Available

If TUI fails to load:

```bash
# Install TUI dependencies
cd tui
npm install

# Or use CLI mode
elith "your command here"
```

## Architecture

### How Auto-Start Works

1. **Service Manager** ([`backend/utils/service_manager.py`](../backend/utils/service_manager.py))
   - Checks if backend is running
   - Starts uvicorn in background if needed
   - Manages PID file and logs
   - Handles cleanup

2. **CLI Integration** ([`cli.py`](../cli.py))
   - Calls service manager before operations
   - Provides service management commands
   - Handles errors gracefully

3. **Process Management**
   - Backend runs as detached process
   - Survives CLI exit
   - Can be controlled via `elith service` commands

### Backend Lifecycle

```
User runs: elith
    ↓
Check port 8000
    ↓
Not running? → Start uvicorn in background
    ↓
Wait for health check
    ↓
Launch TUI/Execute command
    ↓
User exits
    ↓
Backend keeps running ✓
```

## Comparison: Before vs After

### Before (Manual)

```bash
# Terminal 1
source venv/bin/activate
python -m uvicorn backend.main:app --reload --port 8000

# Terminal 2
./run_tui.sh

# Terminal 3
# Your actual work
```

### After (Automatic)

```bash
elith  # Everything auto-starts!
```

## Advanced Usage

### Custom Backend Port

Edit `~/.elith/config.toml`:

```toml
[backend]
port = 8080
```

### Development Mode

```bash
# Keep backend in foreground for debugging
python -m uvicorn backend.main:app --reload --port 8000

# Run CLI without auto-start
elith --no-backend
```

### Multiple Instances

```bash
# Stop current backend
elith service stop

# Start on different port (requires config change)
# Then run elith
```

## Integration with Homebrew

The Homebrew formula ([`elith.rb`](../elith.rb)) automatically:

- Installs Python dependencies
- Installs Node.js for TUI
- Creates config directories
- Sets up PATH

After `brew install elith`, just run `elith`!

## FAQ

**Q: Does the backend restart when I run `elith` again?**  
A: No, it checks if backend is running and reuses it.

**Q: How do I stop the backend?**  
A: `elith service stop`

**Q: Can I use Elith without the backend?**  
A: Yes, use `elith --no-backend` for CLI-only mode.

**Q: Where are the logs?**  
A: `~/.elith/backend.log`

**Q: What if port 8000 is taken?**  
A: Stop the conflicting service or configure a different port.

**Q: Does this work on Windows?**  
A: The service manager uses Unix-specific features. Windows support coming soon.

## Next Steps

1. Install: `brew install elith` or `./install-elith.sh`
2. Run: `elith`
3. Follow setup wizard
4. Start coding!

---

**Made with Bob** 🤖