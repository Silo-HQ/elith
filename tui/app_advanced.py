"""
Advanced TUI for Elith - Hermes Agent Style
Multi-panel layout with rich documentation viewer, file tree, and live output
"""

from textual.app import App, ComposeResult
from textual.containers import Container, Horizontal, Vertical, VerticalScroll
from textual.widgets import Header, Footer, Static, Tree, Label
from textual.binding import Binding
from textual.reactive import reactive
from rich.markdown import Markdown
from rich.syntax import Syntax
from rich.table import Table
from rich.panel import Panel
from rich.text import Text
import httpx
import asyncio
from pathlib import Path
from typing import Optional, Dict, Any
import json

# Import custom widgets (to be created)
from tui.widgets.document_viewer import DocumentViewer
from tui.widgets.file_tree import FileTree
from tui.widgets.status_panel import StatusPanel
from tui.widgets.output_stream import OutputStream
from tui.widgets.command_palette import CommandPalette

API_BASE = "http://localhost:8000/api"


class AdvancedElithTUI(App):
    """
    Advanced TUI with multi-panel layout inspired by Hermes Agent
    
    Layout:
    ┌─────────────────────────────────────────────────────────────┐
    │ Header                                                      │
    ├──────────────┬──────────────────────────────────────────────┤
    │              │                                              │
    │  Sidebar     │  Main Content Area                          │
    │  (25%)       │  (75%)                                      │
    │              │                                              │
    │  - Files     │  ┌────────────────────────────────────────┐ │
    │  - Models    │  │ Documentation Viewer                   │ │
    │  - Status    │  │ (Markdown, Tables, Code)               │ │
    │              │  └────────────────────────────────────────┘ │
    │              │  ┌────────────────────────────────────────┐ │
    │              │  │ Live Output Stream                     │ │
    │              │  │ (SSE from backend)                     │ │
    │              │  └────────────────────────────────────────┘ │
    ├──────────────┴──────────────────────────────────────────────┤
    │ Footer (Status + Shortcuts)                                │
    └─────────────────────────────────────────────────────────────┘
    """
    
    CSS = """
    Screen {
        background: #0A0A0A;
    }
    
    Header {
        background: #1A1A1A;
        color: #A855F7;
        text-style: bold;
    }
    
    Footer {
        background: #1A1A1A;
        color: #71717A;
    }
    
    #sidebar {
        width: 25%;
        background: #0F0F0F;
        border-right: solid #27272A;
    }
    
    #main-content {
        width: 75%;
        background: #0A0A0A;
    }
    
    #doc-viewer {
        height: 60%;
        border: solid #27272A;
        background: #0F0F0F;
        padding: 1 2;
    }
    
    #output-stream {
        height: 40%;
        border: solid #27272A;
        background: #0F0F0F;
        padding: 1 2;
        margin-top: 1;
    }
    
    .section-title {
        background: #1A1A1A;
        color: #A855F7;
        text-style: bold;
        padding: 0 1;
        margin-bottom: 1;
    }
    
    .status-item {
        color: #71717A;
        padding: 0 1;
    }
    
    .model-active {
        color: #10B981;
    }
    
    .model-inactive {
        color: #EF4444;
    }
    """
    
    BINDINGS = [
        Binding("ctrl+c", "quit", "Quit", priority=True),
        Binding("ctrl+n", "new_session", "New Session"),
        Binding("ctrl+h", "show_help", "Help"),
        Binding("ctrl+p", "command_palette", "Commands"),
        Binding("ctrl+f", "toggle_files", "Files"),
        Binding("ctrl+m", "toggle_models", "Models"),
        Binding("ctrl+s", "toggle_status", "Status"),
        Binding("f1", "view_docs", "Docs"),
        Binding("f2", "view_output", "Output"),
    ]
    
    TITLE = "ELITH - AI-Powered Code Assistant"
    
    # Reactive state
    current_view = reactive("docs")
    sidebar_tab = reactive("files")
    backend_connected = reactive(False)
    current_session = reactive(None)
    
    def __init__(self):
        super().__init__()
        self.client = httpx.AsyncClient(timeout=30.0)
        self.repo_path = Path.cwd()
        self.models = []
        self.session_id = None
        
    async def on_mount(self) -> None:
        """Initialize app on mount"""
        await self.check_backend()
        await self.load_models()
        await self.load_documentation()
    
    def compose(self) -> ComposeResult:
        """Create the UI layout"""
        yield Header()
        
        with Horizontal():
            # Sidebar (25%)
            with Vertical(id="sidebar"):
                yield Static("📁 Files", classes="section-title")
                yield FileTree(str(self.repo_path))
                
                yield Static("🤖 Models", classes="section-title")
                yield StatusPanel()
            
            # Main content area (75%)
            with Vertical(id="main-content"):
                # Documentation viewer (60%)
                yield DocumentViewer(id="doc-viewer")
                
                # Output stream (40%)
                yield OutputStream(id="output-stream")
        
        yield Footer()
    
    async def check_backend(self) -> None:
        """Check if backend is running"""
        try:
            response = await self.client.get(f"{API_BASE}/models")
            self.backend_connected = response.status_code == 200
            if self.backend_connected:
                self.notify("✓ Backend connected", severity="information")
        except Exception as e:
            self.backend_connected = False
            self.notify(f"✗ Backend not available: {e}", severity="error")
    
    async def load_models(self) -> None:
        """Load available models from backend"""
        if not self.backend_connected:
            return
        
        try:
            response = await self.client.get(f"{API_BASE}/models")
            data = response.json()
            self.models = data.get("models", [])
            
            # Update status panel
            status_panel = self.query_one(StatusPanel)
            await status_panel.update_models(self.models)
            
        except Exception as e:
            self.notify(f"Failed to load models: {e}", severity="error")
    
    async def load_documentation(self) -> None:
        """Load project documentation"""
        doc_viewer = self.query_one(DocumentViewer)
        
        # Load main architecture doc
        arch_doc = self.repo_path / "obsidian-template" / "architecture" / "elith-architecture.md"
        if arch_doc.exists():
            content = arch_doc.read_text()
            await doc_viewer.update_content(content)
        else:
            # Show default welcome content
            welcome = """
# Welcome to ELITH

## Advanced AI-Powered Code Assistant

ELITH provides intelligent code analysis, architecture proposals, and automated refactoring.

### Quick Start

1. **Scan Repository**: Press `Ctrl+P` and type `/scan`
2. **Execute Task**: Press `Ctrl+P` and type `/execute`
3. **View Models**: Press `Ctrl+M` to see available models
4. **Browse Files**: Press `Ctrl+F` to navigate project files

### Features

- 🔍 **Smart Context Selection**: Only loads relevant files
- 🤖 **Multi-Model Support**: Claude, GPT, Gemini, Ollama
- 📊 **Real-time Streaming**: Live output from AI models
- 📝 **Architecture Proposals**: Novel, codebase-specific designs
- 🔄 **Automated Refactoring**: Safe, tested code improvements

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+C` | Quit |
| `Ctrl+N` | New Session |
| `Ctrl+H` | Help |
| `Ctrl+P` | Command Palette |
| `Ctrl+F` | Toggle Files |
| `Ctrl+M` | Toggle Models |
| `F1` | View Documentation |
| `F2` | View Output |

---

*Press `Ctrl+H` for more help*
"""
            await doc_viewer.update_content(welcome)
    
    async def action_quit(self) -> None:
        """Quit the application"""
        await self.client.aclose()
        self.exit()
    
    async def action_new_session(self) -> None:
        """Start a new session"""
        self.session_id = None
        output_stream = self.query_one(OutputStream)
        await output_stream.clear()
        self.notify("New session started", severity="information")
    
    async def action_show_help(self) -> None:
        """Show help documentation"""
        doc_viewer = self.query_one(DocumentViewer)
        help_content = """
# ELITH Help

## Commands

Type these in the command palette (`Ctrl+P`):

- `/scan` - Scan repository for context
- `/execute <operation> <prompt>` - Execute an operation
- `/models` - List available models
- `/model <name>` - Switch to a model
- `/clear` - Clear output
- `/help` - Show this help

## Operations

- `explain` - Explain code functionality
- `architect` - Generate architecture proposals
- `refactor` - Suggest code improvements
- `test-gen` - Generate test cases

## Examples

```
/execute explain What does the context engine do?
/execute architect Design a caching layer
/execute refactor Improve error handling in main.py
/execute test-gen Create tests for the API router
```

## Keyboard Shortcuts

See the footer for available shortcuts.

---

*Press `F1` to return to documentation*
"""
        await doc_viewer.update_content(help_content)
    
    async def action_command_palette(self) -> None:
        """Show command palette"""
        # TODO: Implement command palette modal
        self.notify("Command palette (coming soon)", severity="information")
    
    async def action_toggle_files(self) -> None:
        """Toggle file tree visibility"""
        self.sidebar_tab = "files"
        self.notify("Showing files", severity="information")
    
    async def action_toggle_models(self) -> None:
        """Toggle models panel"""
        self.sidebar_tab = "models"
        self.notify("Showing models", severity="information")
    
    async def action_toggle_status(self) -> None:
        """Toggle status panel"""
        self.sidebar_tab = "status"
        self.notify("Showing status", severity="information")
    
    async def action_view_docs(self) -> None:
        """Switch to documentation view"""
        self.current_view = "docs"
        await self.load_documentation()
    
    async def action_view_output(self) -> None:
        """Switch to output view"""
        self.current_view = "output"
        output_stream = self.query_one(OutputStream)
        output_stream.focus()


def main():
    """Run the advanced TUI"""
    app = AdvancedElithTUI()
    app.run()


if __name__ == "__main__":
    main()

# Made with Bob
