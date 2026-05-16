"""
Messages Panel Component
Displays chat messages with clean styling inspired by OpenCode
"""

from textual.app import ComposeResult
from textual.containers import VerticalScroll
from textual.widgets import Static, Markdown
from textual.reactive import reactive
from rich.text import Text
from ..theme import get_theme
from ..styles import get_model_style, get_muted_style


class Message(Static):
    """Single message in the chat"""
    
    DEFAULT_CSS = """
    Message {
        width: 100%;
        height: auto;
        padding: 1 2;
        background: #0A0A0A;
    }
    
    Message .message-header {
        color: #A855F7;
        text-style: bold;
        margin-bottom: 1;
    }
    
    Message .message-content {
        color: #FFFFFF;
    }
    
    Message .message-timestamp {
        color: #888888;
        text-style: italic;
    }
    """
    
    def __init__(self, role: str, content: str, model: str = "", timestamp: str = ""):
        super().__init__()
        self.role = role
        self.msg_content = content
        self.model = model
        self.timestamp = timestamp
    
    def compose(self) -> ComposeResult:
        """Render the message"""
        theme = get_theme()
        
        # Header with role and model
        if self.role == "user":
            header = Text("You", style="bold")
        else:
            header = Text(f"● {self.model.upper()}", style=get_model_style(self.model))
        
        if self.timestamp:
            header.append(f"  {self.timestamp}", style=get_muted_style())
        
        yield Static(header, classes="message-header")
        
        # Content
        if isinstance(self.msg_content, str) and (self.msg_content.strip().startswith("```") or "\n```" in self.msg_content):
            # Render as markdown if it contains code blocks
            yield Markdown(self.msg_content, classes="message-content")
        else:
            yield Static(str(self.msg_content), classes="message-content")


class MessagesPanel(VerticalScroll):
    """
    Scrollable messages panel
    Inspired by OpenCode's messages component
    """
    
    DEFAULT_CSS = """
    MessagesPanel {
        width: 100%;
        height: 1fr;
        background: #0A0A0A;
        border: none;
        padding: 1 0;
    }
    
    MessagesPanel:focus {
        border: none;
    }
    """
    
    messages = reactive([])
    
    def add_message(self, role: str, content: str, model: str = "", timestamp: str = "") -> None:
        """Add a new message to the panel"""
        message = Message(role, content, model, timestamp)
        self.mount(message)
        self.scroll_end(animate=True)
    
    def clear_messages(self) -> None:
        """Clear all messages"""
        self.query("Message").remove()

# Made with Bob
