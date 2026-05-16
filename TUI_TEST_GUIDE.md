# Elith TUI Testing Guide

## Prerequisites

✅ Dependencies installed:
- textual (v8.2.6+)
- rich (v15.0.0+)
- pyfiglet (v1.0.4+)

✅ Package structure fixed:
- `tui/__init__.py` created

## Launch Commands

### Option 1: Using the launch script (Recommended)
```bash
./run_new_tui.sh
```

### Option 2: Direct Python module execution
```bash
python3 -m tui.app_new
```

### Option 3: From project root
```bash
cd /Users/basiljoy/my_project/elith
python3 -m tui.app_new
```

## What to Test

### 1. Basic Interface
- [ ] TUI launches without errors
- [ ] Purple accent colors visible (#A855F7)
- [ ] Pure black background (#0A0A0A)
- [ ] Header shows "Elith" in purple
- [ ] Footer shows keybindings

### 2. Keybindings
- [ ] `Ctrl+C` - Quit application
- [ ] `Ctrl+N` - New session
- [ ] `Ctrl+K` - Commands menu
- [ ] `Ctrl+H` - Help screen

### 3. Chat Interface
- [ ] Messages panel displays correctly
- [ ] Chat input box is visible at bottom
- [ ] Can type in the input box
- [ ] Input box accepts multi-line text

### 4. Status Bar
- [ ] Bottom status bar shows:
  - Auto-approve status
  - Token usage (0%)
  - Message count (0/40)
  - Active model (Bob ●)
  - Current mode (Code)

### 5. Visual Design
- [ ] Clean, professional appearance
- [ ] OpenCode-inspired layout
- [ ] Purple accents on black background
- [ ] Readable text contrast
- [ ] Proper spacing and padding

## Expected Behavior

### On Launch
1. TUI should open in full terminal window
2. Header displays "Elith" in purple
3. Empty messages panel in center
4. Chat input box at bottom
5. Status bar at very bottom
6. Footer with keybindings

### During Use
1. Typing in input box should show text
2. Pressing Enter should send message (when backend connected)
3. Messages should appear in messages panel
4. Status bar should update with activity

## Troubleshooting

### Error: "No module named 'textual'"
```bash
pip3 install textual rich pyfiglet
```

### Error: "No module named 'tui'"
- Ensure you're in the project root directory
- Verify `tui/__init__.py` exists

### Error: "No module named 'tui.components'"
- Verify `tui/components/__init__.py` exists
- Check all component files are present

### TUI doesn't display correctly
- Ensure terminal supports 256 colors
- Try resizing terminal window
- Check terminal emulator compatibility

## Next Steps After TUI Test

Once TUI launches successfully:

1. **Test Backend Integration**
   ```bash
   # Terminal 1: Start backend
   uvicorn backend.main:app --reload --port 8000
   
   # Terminal 2: Launch TUI
   python3 -m tui.app_new
   ```

2. **Test with Claude Provider**
   - Set `ANTHROPIC_API_KEY` in `.env`
   - Send a message in TUI
   - Verify Claude responds with repository awareness

3. **Test Skills Integration**
   - Ask Claude to "list files in this directory"
   - Verify it calls `list_files` skill
   - Check response shows actual files

## Known Issues

- Backend integration not yet connected in TUI
- Messages are displayed but not sent to backend yet
- Need to wire TUI → FastAPI → Providers → Skills

## Success Criteria

✅ TUI launches without errors
✅ Interface displays correctly
✅ Keybindings work
✅ Can type in input box
✅ Visual design matches specification

---

**Status:** TUI is ready for testing
**Next:** Connect TUI to backend API endpoints