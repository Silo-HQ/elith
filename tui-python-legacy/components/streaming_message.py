"""
Streaming Message Component
Displays messages with delta-based updates inspired by Hermes Agent
"""

from textual.app import ComposeResult
from textual.containers import Container
from textual.widgets import Static, Markdown
from textual.reactive import reactive
from rich.text import Text
from datetime import datetime

# Import from tui package
import sys
from pathlib import Path
tui_dir = Path(__file__).parent.parent
sys.path.insert(0, str(tui_dir))

from theme import get_theme
from styles import get_model_style, get_muted_style


class StreamingMessage(Container):
    """
    Message that can be updated incrementally as content streams in
    Inspired by Hermes Agent's delta-based message display
    """
    
    DEFAULT_CSS = """
    StreamingMessage {
        width: 100%;
        height: auto;
        padding: 1 2;
    }
    
    StreamingMessage.streaming {
        border-left: thick $primary;
    }
    
    StreamingMessage .message-header {
        color: $primary;
        text-style: bold;
        margin-bottom: 1;
    }
    
    StreamingMessage .message-content {
        color: $text;
        padding: 0 1;
    }
    
    StreamingMessage .message-timestamp {
        color: $text-muted;
        text-style: italic;
    }
    
    StreamingMessage .streaming-indicator {
        color: $primary;
        text-style: bold;
    }
    """
    
    content = reactive("")
    is_streaming = reactive(False)
    role = reactive("assistant")
    model = reactive("")
    timestamp = reactive("")
    
    def __init__(
        self,
        role: str = "assistant",
        model: str = "",
        initial_content: str = "",
        **kwargs
    ):
        super().__init__(**kwargs)
        self.role = role
        self.model = model
        self.content = initial_content
        self.timestamp = datetime.now().strftime("%H:%M")
        self.is_streaming = False
        self._content_widget = None
    
    def compose(self) -> ComposeResult:
        """Create the message layout"""
        # Header with role/model and timestamp
        if self.role == "user":
            header = Text("You", style="bold #FFFFFF")
        else:
            header = Text(f"● {self.model.upper()}", style=get_model_style(self.model))
        
        if self.timestamp:
            header.append(f"  {self.timestamp}", style=get_muted_style())
        
        yield Static(header, classes="message-header")
        
        # Content area (will be updated)
        if self.content:
            if self._should_render_markdown():
                self._content_widget = Markdown(self.content, classes="message-content")
            else:
                self._content_widget = Static(self.content, classes="message-content")
            yield self._content_widget
        else:
            self._content_widget = Static("", classes="message-content")
            yield self._content_widget
        
        # Streaming indicator
        if self.is_streaming:
            yield Static("▊", classes="streaming-indicator")
    
    def _should_render_markdown(self) -> bool:
        """Check if content should be rendered as markdown"""
        return bool(
            self.content and
            (self.content.strip().startswith("```") or "\n```" in self.content)
        )
    
    def start_streaming(self) -> None:
        """Begin streaming mode"""
        self.is_streaming = True
        self.add_class("streaming")
    
    def append_delta(self, delta: str) -> None:
        """Append incremental content (delta update)"""
        self.content += delta
        self._update_content()
    
    def complete_streaming(self, final_content: str = None) -> None:
        """Finalize the message"""
        if final_content is not None:
            self.content = final_content
        self.is_streaming = False
        self.remove_class("streaming")
        self._update_content()
        
        # Remove streaming indicator
        try:
            indicator = self.query_one(".streaming-indicator")
            indicator.remove()
        except:
            pass
    
    def _update_content(self) -> None:
        """Update the content widget"""
        if self._content_widget is None:
            return
        
        # Decide if we need to switch between Static and Markdown
        should_be_markdown = self._should_render_markdown()
        is_markdown = isinstance(self._content_widget, Markdown)
        
        if should_be_markdown and not is_markdown:
            # Switch to Markdown
            old_widget = self._content_widget
            self._content_widget = Markdown(self.content, classes="message-content")
            self.mount(self._content_widget, before=old_widget)
            old_widget.remove()
        elif not should_be_markdown and is_markdown:
            # Switch to Static
            old_widget = self._content_widget
            self._content_widget = Static(self.content, classes="message-content")
            self.mount(self._content_widget, before=old_widget)
            old_widget.remove()
        else:
            # Update existing widget
            if is_markdown:
                # For Markdown, we need to update the source
                self._content_widget.update(self.content)
            else:
                # For Static, update the renderable
                self._content_widget.update(self.content)
    
    def watch_is_streaming(self, is_streaming: bool) -> None:
        """React to streaming state changes"""
        if is_streaming:
            self.add_class("streaming")
        else:
            self.remove_class("streaming")


class MessageTranscript(Container):
    """
    Container for all messages with auto-scroll
    Inspired by Hermes Agent's transcript management
    """
    
    DEFAULT_CSS = """
    MessageTranscript {
        width: 100%;
        height: 1fr;
        overflow-y: auto;
        padding: 1 0;
    }
    
    MessageTranscript:focus {
        border: none;
    }
    """
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._active_stream = None
    
    def add_user_message(self, content: str) -> None:
        """Add a user message to the transcript"""
        message = StreamingMessage(
            role="user",
            model="",
            initial_content=content
        )
        self.mount(message)
        self.scroll_end(animate=True)
    
    def start_assistant_message(self, model: str) -> StreamingMessage:
        """Start a new streaming assistant message"""
        message = StreamingMessage(
            role="assistant",
            model=model,
            initial_content=""
        )
        message.start_streaming()
        self.mount(message)
        self.scroll_end(animate=True)
        self._active_stream = message
        return message
    
    def append_to_stream(self, delta: str) -> None:
        """Append content to the active streaming message"""
        if self._active_stream:
            self._active_stream.append_delta(delta)
            self.scroll_end(animate=False)
    
    def complete_stream(self, final_content: str = None) -> None:
        """Complete the active streaming message"""
        if self._active_stream:
            self._active_stream.complete_streaming(final_content)
            self._active_stream = None
    
    def add_system_message(self, content: str) -> None:
        """Add a system message"""
        message = StreamingMessage(
            role="system",
            model="elith",
            initial_content=content
        )
        self.mount(message)
        self.scroll_end(animate=True)
    
    def clear_messages(self) -> None:
        """Clear all messages"""
        self.query("StreamingMessage").remove()
        self._active_stream = None

# Made with Bob
