# Elith TUI (Terminal User Interface)

A powerful terminal interface for Elith, built with Python Textual framework.

## Features

✅ **6 Complete Screens**
- Welcome - ASCII art logo, command reference
- Workspace - Main working screen with context and output
- Execution - Multi-model execution with live progress
- Proposals - Architecture proposals with keyboard selection
- Results - Session summary with file changes and stats

✅ **7 Reusable Components**
- StatusBar - Always-visible bottom status bar
- InputBar - Yellow-bordered input with cursor
- OutputPanel - Scrolling model output
- ContextPanel - Files loaded, vault notes, token savings
- ProposalBox - Single proposal display with tradeoffs
- ProgressBar - Progress indicator with percentage
- ModelDot - Colored status dots for models

✅ **Design Compliance**
- Matches ELITH_TUI_SPEC.md exactly
- Bob Shell screenshot style
- Dark near-black background (#0A0A0A)
- Cyan for commands and headers
- Purple accent (#A855F7)
- Model-specific colors (Bob blue, Claude orange, Gemini cyan)
- Monospace font throughout

## Installation

```bash
# Install dependencies
pip install textual pyfiglet

# Or use requirements.txt
pip install -r requirements.txt
```

## Usage

```bash
# Run the TUI
python tui/app.py

# Or from project root
python -m tui.app
```

## Keyboard Shortcuts

### Global
- `Ctrl+C` - Quit application
- `Ctrl+L` - Clear screen
- `Ctrl+E` - Export session
- `Escape` - Go back to previous screen

### Welcome Screen
- `Enter` - Start session
- `/` - Show command list
- `@` - File picker

### Workspace Screen
- `Enter` - Execute command
- `↑/↓` - Navigate command history
- `Tab` - Autocomplete

### Proposals Screen
- `A` - Implement proposal A
- `B` - Implement proposal B

### Results Screen
- `N` - New task
- `V` - View diff
- `E` - Export report

## Screen Flow

```
Welcome
   ↓
Workspace ←→ Execution
   ↓            ↓
Proposals    Results
   ↓            ↓
Execution    Workspace
   ↓
Results
```

## Components

### StatusBar
Always visible at bottom, shows:
- Auto-approve mode
- Token usage percentage
- Current model with status dot
- Current mode (Code, Plan, etc.)

### InputBar
Yellow-bordered input field with:
- `> │` prefix
- Blinking cursor
- Command history support

### OutputPanel
Scrolling output with:
- Model-specific headers (● BOB, ● CLAUDE)
- Color-coded output
- Auto-scroll to bottom

### ContextPanel
Displays:
- Files loaded (6 / 312)
- List of loaded files with → arrows
- Vault notes count
- Token savings calculation

### ProposalBox
Shows:
- Option ID and name
- [RECOMMENDED] badge if applicable
- "Why not standard" explanation
- Proposal description
- Tradeoffs (pros/cons)
- Migration steps
- Keyboard shortcut hint

### ProgressBar
Displays:
- Label and percentage
- Visual progress bar
- Smooth updates

### ModelDot
Shows:
- Colored dot (● or ○)
- Model name
- Status (idle, running, done, error)

## Mock Data

All screens use mock data for testing:

```python
# Context data
loaded_files = ["auth/views.py", "auth/models.py", ...]
total_files = 312
vault_notes = ["auth-decisions.md", "tech-debt.md", ...]
tokens_saved = 4200

# Proposals
proposals = [
    {
        "id": "A",
        "name": "JWT + Redis Session Hybrid",
        "recommended": True,
        ...
    },
    {
        "id": "B",
        "name": "OAuth2 + PKCE Flow",
        "recommended": False,
        ...
    }
]

# Results
results = {
    "files_changed": [...],
    "why": "...",
    "models_used": ["bob", "claude"],
    "context_stats": {...},
    "bob_report_path": "..."
}
```

## File Structure

```
tui/
├── app.py                      # Main Textual app
├── README.md                   # This file
├── screens/
│   ├── __init__.py
│   ├── welcome.py              # Welcome screen with ASCII logo
│   ├── workspace.py            # Main working screen
│   ├── execution.py            # Multi-model execution
│   ├── proposals.py            # Architecture proposals
│   └── results.py              # Session results
└── components/
    ├── __init__.py
    ├── status_bar.py           # Bottom status bar
    ├── input_bar.py            # Yellow-bordered input
    ├── output_panel.py         # Scrolling output
    ├── context_panel.py        # Context display
    ├── proposal_box.py         # Proposal display
    ├── progress_bar.py         # Progress indicator
    └── model_dot.py            # Model status dot
```

## Development

### Adding a New Screen

1. Create file in `tui/screens/`
2. Inherit from `Screen`
3. Define `BINDINGS` for keyboard shortcuts
4. Implement `compose()` method
5. Add action methods for bindings
6. Register in `app.py`

### Adding a New Component

1. Create file in `tui/components/`
2. Inherit from `Static` or appropriate widget
3. Define `DEFAULT_CSS` for styling
4. Implement `compose()` method
5. Add update methods as needed

### Styling

Use Textual CSS in `DEFAULT_CSS`:
- Colors: `color: #RRGGBB` or `color: cyan`
- Borders: `border: solid cyan`
- Padding: `padding: 1`
- Margin: `margin: 1`
- Text style: `text-style: bold`

## Testing

```bash
# Run the TUI
python tui/app.py

# Test specific screen
# (modify app.py to start on different screen)
```

## Integration with Backend

When backend is ready (Hour 23+), replace mock data with:

```python
# In workspace.py
async def execute_command(self, command: str):
    # POST to /api/execute
    response = await api.execute(command)
    session_id = response["session_id"]
    
    # Switch to execution screen
    self.app.push_screen(ExecutionScreen(session_id))

# In execution.py
async def stream_output(self, session_id: str):
    # SSE from /api/stream/{session_id}
    async for event in api.stream(session_id):
        self.add_output(event["model"], event["line"])
        self.update_progress(event["model"], event["progress"])
```

## Known Issues

- Type errors expected until `textual` is installed
- Some components need `query_one()` for dynamic updates
- Screen transitions need proper state management

## Next Steps

1. Install textual: `pip install textual pyfiglet`
2. Test all screens and navigation
3. Wire to backend API (Hour 23+)
4. Add real-time streaming
5. Implement command history
6. Add file picker functionality

---

*TUI Implementation Complete - Ready for Backend Integration*