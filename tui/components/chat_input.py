"""
Chat Input Component
Clean input bar inspired by OpenCode's editor component
"""

from textual.app import ComposeResult
from textual.containers import Container
from textual.widgets import Input, Static
from textual.reactive import reactive
from ..theme import get_theme


class ChatInput(Container):
    """
    Chat input component with prompt prefix
    Matches OpenCode's clean editor design
    """
    
    DEFAULT_CSS = """
    ChatInput {
        height: 3;
        dock: bottom;
        background: #0A0A0A;
        border-top: solid #27272A;
    }
    
    ChatInput.focused {
        border-top: solid #A855F7;
    }
    
    ChatInput #prompt {
        width: 2;
        height: 1;
        content-align: center middle;
        color: #A855F7;
        background: #0A0A0A;
        text-style: bold;
    }
    
    ChatInput #input {
        width: 1fr;
        height: 1;
        background: #0A0A0A;
        border: none;
        padding: 0 1;
    }
    
    ChatInput #input:focus {
        border: none;
    }
    """
    
    value = reactive("")
    
    def compose(self) -> ComposeResult:
        """Create child widgets"""
        theme = get_theme()
        yield Static(">", id="prompt")
        yield Input(
            placeholder="Enter your prompt, /commands, @file references...",
            id="input"
        )
    
    def on_mount(self) -> None:
        """Focus input on mount"""
        self.query_one("#input", Input).focus()
    
    def on_input_submitted(self, event: Input.Submitted) -> None:
        """Handle input submission"""
        if event.value.strip():
            self.value = event.value
            self.post_message(self.Submitted(event.input, event.value))
            event.input.value = ""
    
    def on_focus(self) -> None:
        """Add focused class"""
        self.add_class("focused")
    
    def on_blur(self) -> None:
        """Remove focused class"""
        self.remove_class("focused")
    
    class Submitted(Input.Submitted):
        """Message sent when input is submitted"""
        pass

# Made with Bob
