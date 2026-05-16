"""
Workspace Screen - Main working screen with context + output
"""

from textual.app import ComposeResult
from textual.containers import Container, Horizontal, Vertical
from textual.screen import Screen
from textual.widgets import Static, Input, Footer

from ..components.status_bar import StatusBar
from ..components.context_panel import ContextPanel
from ..components.output_panel import OutputPanel


class WorkspaceScreen(Screen):
    """Main workspace screen"""

    CSS = """
    WorkspaceScreen {
        background: #0D1117;
    }

    #header {
        height: 3;
        background: #0D1117;
        border-bottom: solid #888888;
        content-align: center middle;
        color: #FFFFFF;
    }

    #main-container {
        height: 1fr;
    }

    #input-container {
        height: 3;
        background: #0D1117;
        border-top: solid #888888;
    }

    #input-bar {
        border: solid #FFD700;
        background: #0D1117;
        color: #FFFFFF;
    }
    """

    def compose(self) -> ComposeResult:
        """Create the workspace layout"""
        yield Static("ELITH  ──  ~/projects/myapp  ──  Bob ●  Claude ●  Gemini ○", id="header")
        
        with Container(id="main-container"):
            yield ContextPanel()
            yield OutputPanel()
        
        with Container(id="input-container"):
            yield Input(placeholder="> │ Enter your prompt, /commands, @file references", id="input-bar")
        
        yield StatusBar()

    def on_input_submitted(self, event: Input.Submitted) -> None:
        """Handle input submission"""
        command = event.value
        if command.startswith('/architect'):
            from screens.execution import ExecutionScreen
            self.app.push_screen(ExecutionScreen())
        elif command.startswith('/'):
            # Handle other commands
            pass

# Made with Bob
