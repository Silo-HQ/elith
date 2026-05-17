# Elith Configuration Wizard Implementation

## Overview
Enhanced the Elith CLI with an interactive configuration wizard featuring arrow key navigation. The wizard now runs automatically on first use, eliminating the need for a separate `elith init` command.

## Key Features

### 1. Arrow Key Navigation
- **↑/↓ arrows**: Navigate between provider options
- **Enter**: Select the highlighted provider
- **Ctrl+C**: Cancel setup

### 2. First-Time Setup Flow
When running `elith` for the first time (no config found):
```bash
$ elith
Welcome to Elith! Let's get you set up.

╭────────────────────────────────╮
│ Elith Configuration Wizard     │
│ Let's set up your AI providers │
╰────────────────────────────────╯

Available providers:
Use ↑/↓ arrow keys to navigate, Enter to select

→ Claude (Anthropic)
  Cloud-based, most capable
  LM Studio (Local)
  Run models locally, privacy-focused
  OpenRouter (Multiple models)
  Access to multiple providers
```

### 3. Provider Configuration
After selecting a provider, you'll be prompted for:

**Claude:**
- Anthropic API key
- Model name (default: claude-sonnet-4-20250514)

**LM Studio:**
- API URL (default: http://localhost:1234/v1)
- Model name (default: local-model)

**OpenRouter:**
- OpenRouter API key
- Model name (default: openai/gpt-4o)

### 4. Automatic Continuation
After configuration completes, Elith automatically starts instead of requiring a second command.

## Implementation Details

### Changes to `cli.py`

1. **Enhanced `init_wizard()` function** (lines 87-189):
   - Added `termios` and `tty` imports for raw terminal input
   - Implemented arrow key detection using escape sequences
   - Added visual menu with highlighted selection
   - Improved provider descriptions

2. **Modified main flow** (lines 320-335):
   - Removed the "Run setup wizard now?" confirmation
   - Wizard runs automatically when no config is found
   - Better error handling with KeyboardInterrupt support
   - Kept `elith init` command for backwards compatibility

3. **Added Rich imports** (line 22):
   - `Live` and `Text` for future enhancements

### Technical Implementation

**Arrow Key Detection:**
```python
# Arrow keys send escape sequences:
# Up arrow: \x1b[A
# Down arrow: \x1b[B

if ch == '\x1b':
    next1, next2 = sys.stdin.read(2)
    if next1 == '[':
        if next2 == 'A':  # Up
            selected_idx = (selected_idx - 1) % len(providers)
        elif next2 == 'B':  # Down
            selected_idx = (selected_idx + 1) % len(providers)
```

**Menu Rendering:**
- Uses ANSI escape codes to move cursor up
- Re-renders entire menu on each selection change
- Highlights selected item with cyan color and arrow

## Testing

### Test the Arrow Navigation
Run the demo script:
```bash
python test_wizard.py
```

This demonstrates the arrow key navigation without modifying your actual config.

### Test First-Time Setup
To test the full wizard flow:
```bash
# Backup existing config
mv ~/.elith/config.toml ~/.elith/config.toml.backup

# Run elith (wizard will start automatically)
elith

# Restore config
mv ~/.elith/config.toml.backup ~/.elith/config.toml
```

### Test with Existing Config
```bash
# With config present, elith runs normally
elith

# Or explicitly run init
elith init
```

## User Experience Flow

### Before (Old Flow)
```bash
$ elith
No configuration found. Run elith init to set up.
Run setup wizard now? [y/n]: y

Available providers:
  1. Claude (Anthropic)
  2. LM Studio (Local)
  3. OpenRouter (Multiple models)

Which provider would you like to use by default? [1/2/3] (2): 2
# ... configuration ...
✓ Configuration complete!
Run elith to start using Elith

$ elith  # Need to run again
```

### After (New Flow)
```bash
$ elith
Welcome to Elith! Let's get you set up.

# Interactive arrow key menu appears
# User selects with arrows and Enter
# Configuration completes
✓ Configuration complete!
Starting Elith...

# Elith starts immediately
```

## Benefits

1. **Better UX**: Visual, interactive selection instead of typing numbers
2. **Fewer Steps**: No need to run `elith` twice
3. **More Intuitive**: Arrow keys are familiar to all users
4. **Better Descriptions**: Each provider shows its key benefit
5. **Graceful Cancellation**: Ctrl+C properly handled

## Backwards Compatibility

- `elith init` command still works for manual reconfiguration
- Existing config files are fully compatible
- No breaking changes to command-line arguments

## Future Enhancements

Potential improvements:
- Add color-coded status indicators for each provider
- Show estimated setup time for each option
- Add "Test Connection" step after configuration
- Support for configuring multiple providers at once
- Provider-specific validation (e.g., test API keys)