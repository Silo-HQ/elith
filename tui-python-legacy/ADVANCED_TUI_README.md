# Advanced TUI - Hermes Agent Style

## Overview

The Advanced TUI is a sophisticated terminal interface inspired by Hermes Agent, featuring:

- **Multi-panel layout** with sidebar and main content area
- **Rich documentation viewer** with markdown rendering and syntax highlighting
- **Interactive file tree** for project navigation
- **Live status panel** showing models, operations, and metrics
- **Real-time output stream** with SSE integration
- **Command palette** for quick actions

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Header (Title + Status)                                     │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│  Sidebar     │  Main Content Area                          │
│  (25%)       │  (75%)                                      │
│              │                                              │
│  ┌────────┐  │  ┌────────────────────────────────────────┐ │
│  │ Files  │  │  │ Documentation Viewer                   │ │
│  │ Tree   │  │  │ - Markdown rendering                   │ │
│  └────────┘  │  │ - Syntax highlighting                  │ │
│              │  │ - Tables & code blocks                 │ │
│  ┌────────┐  │  └────────────────────────────────────────┘ │
│  │ Models │  │                                              │
│  │ Status │  │  ┌────────────────────────────────────────┐ │
│  └────────┘  │  │ Live Output Stream                     │ │
│              │  │ - Real-time SSE updates                │ │
│              │  │ - Model attribution                    │ │
│              │  │ - Syntax highlighting                  │ │
│              │  └────────────────────────────────────────┘ │
├──────────────┴──────────────────────────────────────────────┤
│ Footer (Keyboard Shortcuts)                                │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
tui/
├── app_advanced.py              # Main application
├── widgets/
│   ├── __init__.py
│   ├── document_viewer.py       # Markdown viewer
│   ├── file_tree.py             # File navigator
│   ├── status_panel.py          # Status display
│   ├── output_stream.py         # Live output
│   └── command_palette.py       # Command interface
└── ADVANCED_TUI_README.md       # This file
```

## Components

### 1. DocumentViewer

**Purpose**: Display rich markdown content with syntax highlighting

**Features**:
- Full markdown support (headings, lists, tables, code blocks)
- Syntax highlighting for code blocks (Python, JS, TS, etc.)
- Scrollable content
- Auto-rendering on content update

**Usage**:
```python
doc_viewer = self.query_one(DocumentViewer)
await doc_viewer.update_content(markdown_content)
```

### 2. FileTree

**Purpose**: Interactive file system navigator

**Features**:
- Hierarchical directory structure
- File type icons (🐍 Python, 📜 JS, 📘 TS, etc.)
- Expandable/collapsible directories
- File selection events
- Filters out common directories (.git, node_modules, etc.)

**Usage**:
```python
file_tree = FileTree(str(repo_path))
# Listen for FileSelected events
```

### 3. StatusPanel

**Purpose**: Display system status and metrics

**Features**:
- Backend connection status
- Available models list with active indicators
- Current operation display
- Session information
- Token usage metrics

**Usage**:
```python
status_panel = self.query_one(StatusPanel)
await status_panel.update_models(models)
await status_panel.set_active_model("claude-3-5-sonnet")
await status_panel.update_operation("explain")
```

### 4. OutputStream

**Purpose**: Live streaming output from backend

**Features**:
- Real-time SSE event processing
- Model attribution with color coding
- Syntax highlighting for code in responses
- Timestamps for messages
- Auto-scroll (toggleable)
- Message formatting (user, assistant, system, error)

**Usage**:
```python
output_stream = self.query_one(OutputStream)
output_stream.write_user_message("Explain this code")
output_stream.write_assistant_message("This code...", model="claude")
output_stream.process_sse_event(event)
```

### 5. CommandPalette

**Purpose**: Quick command execution interface

**Features**:
- Modal command input
- Command suggestions with descriptions
- Fuzzy search filtering
- Keyboard navigation

**Commands**:
- `/scan [path]` - Scan repository
- `/execute <operation> <prompt>` - Execute operation
- `/models` - List models
- `/model <name>` - Switch model
- `/clear` - Clear output
- `/help` - Show help
- `/repo` - Repository info
- `/status` - System status

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+C` | Quit application |
| `Ctrl+N` | New session |
| `Ctrl+H` | Show help |
| `Ctrl+P` | Open command palette |
| `Ctrl+F` | Toggle file tree |
| `Ctrl+M` | Toggle models panel |
| `Ctrl+S` | Toggle status panel |
| `F1` | View documentation |
| `F2` | View output |

## Running the Advanced TUI

### Method 1: Using the run script

```bash
./run_advanced_tui.sh
```

### Method 2: Direct Python execution

```bash
source venv/bin/activate
python3 -m tui.app_advanced
```

### Method 3: From anywhere (if installed globally)

```bash
elith-advanced
```

## Backend Integration

The Advanced TUI connects to the FastAPI backend at `http://localhost:8000/api`.

### Required Backend Endpoints

- `GET /api/models` - List available models
- `POST /api/scan` - Scan repository
- `POST /api/execute` - Execute operation
- `GET /api/stream/{session_id}` - SSE stream
- `GET /api/results/{session_id}` - Get results

### SSE Event Format

```json
{
  "type": "start|chunk|complete|error|progress",
  "data": {
    "model": "claude-3-5-sonnet",
    "operation": "explain",
    "content": "...",
    "progress": 50,
    "message": "Processing..."
  }
}
```

## Customization

### Theme Colors

Edit the CSS in each widget file to customize colors:

```python
DEFAULT_CSS = """
Widget {
    background: #0F0F0F;  # Dark background
    border: solid #27272A;  # Border color
    color: #E4E4E7;  # Text color
}

Widget:focus {
    border: solid #A855F7;  # Purple accent
}
"""
```

### Model Colors

Edit `MODEL_COLORS` in `output_stream.py`:

```python
MODEL_COLORS = {
    "claude": "#A855F7",  # Purple
    "gpt": "#10B981",     # Green
    "gemini": "#3B82F6",  # Blue
    "ollama": "#F59E0B",  # Orange
    "bob": "#EC4899",     # Pink
}
```

### File Icons

Edit `ICONS` in `file_tree.py`:

```python
ICONS = {
    "directory": "📁",
    "python": "🐍",
    "javascript": "📜",
    # Add more...
}
```

## Development

### Adding New Widgets

1. Create widget file in `tui/widgets/`
2. Inherit from appropriate Textual widget
3. Define `DEFAULT_CSS` for styling
4. Implement required methods
5. Add to `__init__.py`
6. Import in `app_advanced.py`

Example:

```python
# tui/widgets/my_widget.py
from textual.widgets import Static

class MyWidget(Static):
    DEFAULT_CSS = """
    MyWidget {
        background: #0F0F0F;
    }
    """
    
    def on_mount(self) -> None:
        self.update("Hello!")
```

### Adding New Commands

Edit `COMMANDS` in `command_palette.py`:

```python
COMMANDS = [
    {
        "name": "/mycommand",
        "description": "Do something cool",
        "args": "<arg1> <arg2>",
    },
    # ...
]
```

Then handle in `app_advanced.py`:

```python
async def handle_command(self, command: str) -> None:
    if command.startswith("/mycommand"):
        # Handle command
        pass
```

## Troubleshooting

### Import Errors

If you see import errors for `textual` or `rich`:

```bash
pip install textual rich
```

### Backend Connection Failed

Ensure the backend is running:

```bash
python -m uvicorn backend.main:app --reload --port 8000
```

### Widget Not Displaying

Check the CSS and ensure the widget is mounted:

```python
def compose(self) -> ComposeResult:
    yield MyWidget()  # Make sure this is called
```

### SSE Streaming Not Working

1. Check backend logs for errors
2. Verify session ID is correct
3. Ensure httpx is installed: `pip install httpx`

## Performance Tips

1. **Limit file tree depth**: Skip deep nested directories
2. **Buffer output**: Don't write every character individually
3. **Lazy load**: Only load visible content
4. **Debounce updates**: Batch rapid updates together
5. **Use async**: Keep UI responsive with async operations

## Future Enhancements

- [ ] Search functionality in documentation
- [ ] File content preview on selection
- [ ] Syntax highlighting themes
- [ ] Custom keyboard shortcuts
- [ ] Split panes for multiple views
- [ ] Tabs for multiple documents
- [ ] History navigation
- [ ] Export output to file
- [ ] Screenshot/recording capability
- [ ] Plugin system for extensions

## Contributing

When contributing to the Advanced TUI:

1. Follow the existing code style
2. Add docstrings to all classes and methods
3. Update this README with new features
4. Test with multiple terminal emulators
5. Ensure keyboard shortcuts don't conflict
6. Keep CSS organized and commented

## Resources

- [Textual Documentation](https://textual.textualize.io/)
- [Rich Documentation](https://rich.readthedocs.io/)
- [Elith Project Spec](../docs/ADVANCED_TUI_SPEC.md)
- [Original TUI](./app.py)

---

**Created**: May 16, 2026  
**Branch**: feature/main/tui  
**Status**: Initial Implementation  
**Maintainer**: Elith Team