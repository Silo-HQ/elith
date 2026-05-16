# Quick Start - New Elith TUI

## How to Run the New UI

### Option 1: Using the Run Script (Easiest)

```bash
./run_new_tui.sh
```

This script will:
1. Check if dependencies are installed
2. Install them if needed (textual, rich)
3. Launch the new TUI

### Option 2: Manual Installation

```bash
# Install dependencies
pip3 install --user textual rich

# Run the TUI
python3 -m tui.app_new
```

### Option 3: Using Virtual Environment (Recommended for Development)

```bash
# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
pip install textual rich

# Run the TUI
python -m tui.app_new
```

## What You'll See

When you run the new TUI, you'll see:

```
┌─────────────────────────────────────────────────────────────┐
│ ELITH                                                       │
│ AI-Powered Code Assistant                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ● ELITH  09:25                                             │
│ Welcome to Elith! Type your prompt or use /commands to     │
│ get started.                                                │
│                                                             │
│                                                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ > │ Enter your prompt, /commands, @file references...      │
├─────────────────────────────────────────────────────────────┤
│ Auto-approve: Edit   Tokens: 0% | 0/40 | Bob ● | Mode: Code│
├─────────────────────────────────────────────────────────────┤
│ ^C Quit  ^N New Session  ^K Commands  ^H Help              │
└─────────────────────────────────────────────────────────────┘
```

## Keyboard Shortcuts

- **Ctrl+C** - Quit the application
- **Ctrl+N** - Start a new session
- **Ctrl+K** - Open commands dialog (coming soon)
- **Ctrl+H** - Show help (coming soon)
- **Ctrl+S** - Switch sessions (coming soon)
- **Ctrl+L** - View logs (coming soon)
- **Enter** - Send message
- **Esc** - Cancel/close dialogs

## Features

### Currently Working:
- ✅ Clean chat interface
- ✅ Message input with > prompt
- ✅ Message display with timestamps
- ✅ Purple accent colors
- ✅ Keyboard shortcuts
- ✅ Scrollable message history
- ✅ New session command

### Coming Soon:
- ⏳ Backend API integration
- ⏳ Real AI responses
- ⏳ Command dialog (ctrl+k)
- ⏳ Session switcher (ctrl+s)
- ⏳ File references (@file)
- ⏳ Help system (ctrl+h)
- ⏳ Logs view (ctrl+l)

## Testing the UI

Try these commands:

```bash
# Start the UI
./run_new_tui.sh

# Type a message and press Enter
> Hello, Elith!

# Start a new session
Press Ctrl+N

# Quit
Press Ctrl+C
```

## Troubleshooting

### "No module named 'textual'"
```bash
pip3 install --user textual rich
```

### "externally-managed-environment" error
```bash
# Use virtual environment instead
python3 -m venv venv
source venv/bin/activate
pip install textual rich
python -m tui.app_new
```

### UI doesn't display correctly
- Make sure your terminal supports colors
- Try resizing your terminal window
- Use a modern terminal (iTerm2, Windows Terminal, etc.)

## Comparison with Old UI

### Old UI:
- Multiple screens with navigation
- Complex component hierarchy
- Inconsistent styling
- Hard to maintain

### New UI:
- Single clean chat interface
- Simple component structure
- Consistent purple theme
- Easy to extend

## Next Steps

1. **Test the UI**: Run it and try the features
2. **Provide Feedback**: What works? What's missing?
3. **Backend Integration**: Connect to real AI models
4. **Add Features**: Commands, sessions, file references

## Files Created

- [`tui/theme.py`](tui/theme.py) - Color theme system
- [`tui/styles.py`](tui/styles.py) - Style functions
- [`tui/components/chat_input.py`](tui/components/chat_input.py) - Input component
- [`tui/components/messages_panel.py`](tui/components/messages_panel.py) - Messages display
- [`tui/app_new.py`](tui/app_new.py) - Main application
- [`run_new_tui.sh`](run_new_tui.sh) - Launch script
- [`tui/NEW_TUI_IMPLEMENTATION.md`](tui/NEW_TUI_IMPLEMENTATION.md) - Technical docs

## Support

If you encounter issues:
1. Check the terminal output for errors
2. Verify dependencies are installed
3. Try running in a virtual environment
4. Check [`tui/NEW_TUI_IMPLEMENTATION.md`](tui/NEW_TUI_IMPLEMENTATION.md) for details

---

**Ready to try it?** Run: `./run_new_tui.sh`