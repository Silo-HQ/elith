# Elith
**Every model. Bob-level. Your choice.**

> Elith is a universal repo-aware agent framework that gives every AI model
> the same codebase skills IBM Bob has natively.

*IBM Bob Hackathon 2026 — lablab.ai*

## 🎯 Like OpenCode, But Universal

Elith follows the same CLI pattern as [OpenCode](https://github.com/opencode-ai/opencode):
- **Default TUI launch**: Just run `elith` to start the interactive interface
- **Clean command structure**: Subcommands for specific operations
- **Python-native**: Uses Textual (Python's Bubble Tea equivalent)

## Quick Start

```bash
# Install dependencies
./setup.sh

# Install CLI globally (optional)
./install.sh

# Launch interactive TUI (default behavior)
elith

# Or run directly
python3 cli.py
```

## Usage

**Interactive Mode (Default)**
```bash
elith                     # Launches TUI - just like OpenCode
```

**Non-Interactive Commands**
```bash
elith explain .           # Explain repository architecture
elith architect --problem "auth system"  # Generate proposals
elith refactor src/app.py # Refactor a file
elith test-gen src/utils.py  # Generate tests
elith models              # List available models
elith version             # Show version
elith --help              # Show all commands
```

## Verification

Run the compatibility test to verify Elith matches OpenCode's behavior:
```bash
./test_opencode_compatibility.sh
```

See [`VERIFY_TUI.md`](VERIFY_TUI.md) for detailed comparison with OpenCode.
