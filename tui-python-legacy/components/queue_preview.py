"""
Queue Preview Component
Shows pending messages inspired by Hermes Agent's queue system
"""

from typing import List
from textual.app import ComposeResult
from textual.containers import Container, Vertical
from textual.widgets import Static
from textual.reactive import reactive
from rich.text import Text

# Import from tui package
import sys
from pathlib import Path
tui_dir = Path(__file__).parent.parent
sys.path.insert(0, str(tui_dir))

from theme import get_theme


class QueuedMessage(Static):
    """Individual queued message display"""
    
    DEFAULT_CSS = """
    QueuedMessage {
        width: 100%;
        height: auto;
        padding: 0 1;
        color: $text-muted;
    }
    
    QueuedMessage.editing {
        color: $primary;
        text-style: bold;
    }
    """
    
    def __init__(self, index: int, content: str, **kwargs):
        super().__init__(**kwargs)
        self.index = index
        self.content = content
        self.is_editing = False
    
    def render(self) -> Text:
        """Render the queued message"""
        theme = get_theme()
        
        text = Text()
        text.append(f"{self.index + 1}. ", style="bold #888888")
        
        # Truncate long messages
        display_content = self.content
        if len(display_content) > 60:
            display_content = display_content[:57] + "..."
        
        if self.is_editing:
            text.append(display_content, style="bold #A855F7")
            text.append(" ✎", style="bold #A855F7")
        else:
            text.append(display_content, style="#888888")
        
        return text
    
    def set_editing(self, editing: bool) -> None:
        """Set editing state"""
        self.is_editing = editing
        if editing:
            self.add_class("editing")
        else:
            self.remove_class("editing")
        self.refresh()


class QueuePreview(Container):
    """
    Preview of queued messages
    Inspired by Hermes Agent's queue visualization
    """
    
    DEFAULT_CSS = """
    QueuePreview {
        width: 100%;
        height: auto;
        max-height: 8;
        border: solid $accent;
        border-title-color: $text-muted;
        padding: 1 2;
        overflow-y: auto;
    }
    
    QueuePreview.hidden {
        display: none;
    }
    
    QueuePreview Vertical {
        width: 100%;
        height: auto;
    }
    """
    
    queue_count = reactive(0)
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.border_title = "Queue (0)"
        self._messages: List[QueuedMessage] = []
        self._editing_index: int = -1
    
    def compose(self) -> ComposeResult:
        """Create the queue preview layout"""
        yield Vertical()
    
    def on_mount(self) -> None:
        """Initialize as hidden"""
        self.add_class("hidden")
    
    def add_message(self, content: str) -> None:
        """Add a message to the queue"""
        index = len(self._messages)
        message = QueuedMessage(index, content)
        self._messages.append(message)
        
        container = self.query_one(Vertical)
        container.mount(message)
        
        self.queue_count = len(self._messages)
        self.border_title = f"Queue ({self.queue_count})"
        self.remove_class("hidden")
    
    def remove_message(self, index: int) -> None:
        """Remove a message from the queue"""
        if 0 <= index < len(self._messages):
            message = self._messages.pop(index)
            message.remove()
            
            # Reindex remaining messages
            for i, msg in enumerate(self._messages):
                msg.index = i
                msg.refresh()
            
            self.queue_count = len(self._messages)
            self.border_title = f"Queue ({self.queue_count})"
            
            if self.queue_count == 0:
                self.add_class("hidden")
    
    def get_message(self, index: int) -> str:
        """Get message content by index"""
        if 0 <= index < len(self._messages):
            return self._messages[index].content
        return ""
    
    def update_message(self, index: int, content: str) -> None:
        """Update a message in the queue"""
        if 0 <= index < len(self._messages):
            self._messages[index].content = content
            self._messages[index].refresh()
    
    def set_editing(self, index: int) -> None:
        """Mark a message as being edited"""
        # Clear previous editing state
        if self._editing_index >= 0 and self._editing_index < len(self._messages):
            self._messages[self._editing_index].set_editing(False)
        
        # Set new editing state
        if 0 <= index < len(self._messages):
            self._messages[index].set_editing(True)
            self._editing_index = index
        else:
            self._editing_index = -1
    
    def clear_editing(self) -> None:
        """Clear editing state"""
        if self._editing_index >= 0 and self._editing_index < len(self._messages):
            self._messages[self._editing_index].set_editing(False)
        self._editing_index = -1
    
    def get_next_message(self) -> tuple[int, str]:
        """Get the next message to send"""
        if self._messages:
            return (0, self._messages[0].content)
        return (-1, "")
    
    def clear_all(self) -> None:
        """Clear all queued messages"""
        for message in self._messages:
            message.remove()
        self._messages.clear()
        self.queue_count = 0
        self.border_title = "Queue (0)"
        self.add_class("hidden")
        self._editing_index = -1
    
    def is_empty(self) -> bool:
        """Check if queue is empty"""
        return len(self._messages) == 0
    
    def get_count(self) -> int:
        """Get queue count"""
        return len(self._messages)


class QueueManager:
    """
    Manages message queue logic
    Inspired by Hermes Agent's queue system
    """
    
    def __init__(self, preview: QueuePreview):
        self.preview = preview
        self._auto_drain_enabled = True
    
    def add(self, message: str) -> None:
        """Add message to queue"""
        self.preview.add_message(message)
    
    def remove(self, index: int) -> None:
        """Remove message from queue"""
        self.preview.remove_message(index)
    
    def get_next(self) -> tuple[int, str]:
        """Get next message to send"""
        return self.preview.get_next_message()
    
    def pop_next(self) -> str:
        """Get and remove next message"""
        index, content = self.get_next()
        if index >= 0:
            self.remove(index)
            return content
        return ""
    
    def should_auto_drain(self) -> bool:
        """Check if should auto-drain queue"""
        return self._auto_drain_enabled and not self.preview.is_empty()
    
    def enable_auto_drain(self) -> None:
        """Enable auto-drain"""
        self._auto_drain_enabled = True
    
    def disable_auto_drain(self) -> None:
        """Disable auto-drain (when editing)"""
        self._auto_drain_enabled = False
    
    def clear(self) -> None:
        """Clear all queued messages"""
        self.preview.clear_all()
    
    def is_empty(self) -> bool:
        """Check if queue is empty"""
        return self.preview.is_empty()
    
    def get_count(self) -> int:
        """Get queue count"""
        return self.preview.get_count()

# Made with Bob
