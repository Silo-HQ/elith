"""
Elith TUI - Terminal User Interface
Built with Textual - matches Bob Shell aesthetic exactly
"""

import sys
from pathlib import Path

# Add both parent and tui directory to path for imports
tui_dir = Path(__file__).parent
project_root = tui_dir.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(tui_dir))

from textual.app import App, ComposeResult
from textual.binding import Binding
from textual.widgets import Header, Footer

# Import screens - try multiple import patterns
try:
    from tui.screens.welcome import WelcomeScreen
    from tui.screens.workspace import WorkspaceScreen
    from tui.screens.execution import ExecutionScreen
    from tui.screens.proposals import ProposalsScreen
    from tui.screens.results import ResultsScreen
except ImportError:
    try:
        from screens.welcome import WelcomeScreen
        from screens.workspace import WorkspaceScreen
        from screens.execution import ExecutionScreen
        from screens.proposals import ProposalsScreen
        from screens.results import ResultsScreen
    except ImportError:
        from .screens.welcome import WelcomeScreen
        from .screens.workspace import WorkspaceScreen
        from .screens.execution import ExecutionScreen
        from .screens.proposals import ProposalsScreen
        from .screens.results import ResultsScreen


class ElithApp(App):
    """Elith Terminal UI Application"""

    CSS = """
    Screen {
        background: #0D1117;
    }
    """

    BINDINGS = [
        Binding("ctrl+c", "quit", "Quit", show=True),
        Binding("ctrl+l", "clear", "Clear", show=False),
        Binding("ctrl+e", "export", "Export", show=False),
    ]

    def on_mount(self) -> None:
        """Initialize the app with welcome screen"""
        self.push_screen(WelcomeScreen())

    def action_clear(self) -> None:
        """Clear output"""
        pass

    def action_export(self) -> None:
        """Export Bob report"""
        pass


def main():
    """Entry point for the TUI"""
    app = ElithApp()
    app.run()


if __name__ == "__main__":
    main()

# Made with Bob
