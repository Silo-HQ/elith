"""
Elith TUI - Redesigned with OpenCode-inspired architecture
Clean, professional interface with purple accents
"""

import sys
from pathlib import Path
from datetime import datetime

# Add paths for imports
tui_dir = Path(__file__).parent
project_root = tui_dir.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(tui_dir))

from textual.app import App, ComposeResult
from textual.binding import Binding
from textual.containers import Container, Horizontal, Vertical
from textual.widgets import Header, Footer, Static
from textual.reactive import reactive

from .theme import get_theme
from .components.chat_input import ChatInput
from .components.messages_panel import MessagesPanel


class StatusBar(Static):
    """Bottom status bar showing session info"""
    
    DEFAULT_CSS = """
    StatusBar {
        dock: bottom;
        height: 1;
        background: #121212;
        color: #888888;
        padding: 0 2;
    }
    """
    
    active_model = reactive("Bob")
    token_usage = reactive("0%")
    message_count = reactive("0/40")
    
    def render(self) -> str:
        """Render status bar content"""
        theme = get_theme()
        return f"Auto-approve: Edit (shift+tab)   Tokens: {self.token_usage} | {self.message_count} | {self.active_model} ● | Mode: Code"


class ChatScreen(Container):
    """Main chat screen with messages and input"""
    
    DEFAULT_CSS = """
    ChatScreen {
        width: 100%;
        height: 100%;
        background: #0A0A0A;
    }
    
    ChatScreen Vertical {
        width: 100%;
        height: 100%;
    }
    """
    
    def compose(self) -> ComposeResult:
        """Create the chat interface"""
        with Vertical():
            yield MessagesPanel(id="messages")
            yield ChatInput(id="input")


class ElithApp(App):
    """
    Elith Terminal UI Application
    Redesigned with OpenCode-inspired clean architecture
    """
    
    CSS = """
Screen {
    background: #0A0A0A;
}

Header {
    background: #121212;
    color: #A855F7;
    text-style: bold;
}

Footer {
    background: #121212;
}
"""
    
    BINDINGS = [
        Binding("ctrl+c", "quit", "Quit", show=True),
        Binding("ctrl+n", "new_session", "New Session", show=True),
        Binding("ctrl+s", "switch_session", "Switch Session", show=False),
        Binding("ctrl+k", "commands", "Commands", show=True),
        Binding("ctrl+h", "help", "Help", show=True),
        Binding("ctrl+l", "logs", "Logs", show=False),
    ]
    
    def __init__(self):
        super().__init__()
        self.title = "ELITH"
        self.sub_title = "AI-Powered Code Assistant"
    
    def compose(self) -> ComposeResult:
        """Create the app layout"""
        yield Header()
        yield ChatScreen()
        yield StatusBar(id="status")
        yield Footer()
    
    def on_mount(self) -> None:
        """Initialize the app"""
        # Add welcome message
        try:
            messages = self.query_one("#messages", MessagesPanel)
            messages.add_message(
                "system",
                "Welcome to Elith! Type your prompt or use /commands to get started.",
                "elith",
                datetime.now().strftime("%H:%M")
            )
        except Exception as e:
            # Silently handle if messages panel not ready yet
            pass
    
    def on_chat_input_submitted(self, event: ChatInput.Submitted) -> None:
        """Handle chat input submission"""
        messages = self.query_one("#messages", MessagesPanel)
        
        # Add user message
        messages.add_message(
            "user",
            event.value,
            "",
            datetime.now().strftime("%H:%M")
        )
        
        # TODO: Process the message and get AI response
        # For now, just echo back
        messages.add_message(
            "assistant",
            f"You said: {event.value}\n\nThis is a placeholder response. The backend integration is pending.",
            "bob",
            datetime.now().strftime("%H:%M")
        )
    
    def action_new_session(self) -> None:
        """Start a new session"""
        messages = self.query_one("#messages", MessagesPanel)
        messages.clear_messages()
        messages.add_message(
            "system",
            "New session started.",
            "elith",
            datetime.now().strftime("%H:%M")
        )
    
    def action_switch_session(self) -> None:
        """Switch to a different session"""
        # TODO: Implement session switcher dialog
        pass
    
    def action_commands(self) -> None:
        """Show commands dialog"""
        # TODO: Implement commands dialog
        pass
    
    def action_help(self) -> None:
        """Show help dialog"""
        # TODO: Implement help dialog
        pass
    
    def action_logs(self) -> None:
        """Show logs"""
        # TODO: Implement logs view
        pass


def main():
    """Entry point for the TUI"""
    app = ElithApp()
    app.run()


if __name__ == "__main__":
    main()

# Made with Bob
