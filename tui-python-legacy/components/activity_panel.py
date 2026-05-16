"""
Activity Panel Component
Shows live tool execution and system status inspired by Hermes Agent
"""

from typing import Optional, Dict
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


class ToolActivity(Static):
    """Individual tool execution display"""
    
    DEFAULT_CSS = """
    ToolActivity {
        width: 100%;
        height: auto;
        padding: 0 1;
        color: $text;
    }
    
    ToolActivity.active {
        color: $primary;
    }
    
    ToolActivity.complete {
        color: $success;
    }
    
    ToolActivity.error {
        color: $error;
    }
    """
    
    status = reactive("active")
    
    def __init__(
        self,
        tool_id: str,
        tool_name: str,
        preview: str = "",
        **kwargs
    ):
        super().__init__(**kwargs)
        self.tool_id = tool_id
        self.tool_name = tool_name
        self.preview = preview
        self.status = "active"
    
    def render(self) -> Text:
        """Render the tool activity"""
        theme = get_theme()
        
        # Status icon
        if self.status == "active":
            icon = "⟳"
            color = theme.primary
        elif self.status == "complete":
            icon = "✓"
            color = theme.success
        elif self.status == "error":
            icon = "✗"
            color = theme.error
        else:
            icon = "○"
            color = theme.text_muted
        
        # Build display text
        text = Text()
        text.append(f"[tool:{self.tool_name}] ", style=f"bold {color}")
        text.append(self.preview or f"Executing {self.tool_name}...", style=color)
        text.append(f" {icon}", style=f"bold {color}")
        
        return text
    
    def update_progress(self, preview: str) -> None:
        """Update the progress preview"""
        self.preview = preview
        self.refresh()
    
    def mark_complete(self) -> None:
        """Mark as complete"""
        self.status = "complete"
        self.remove_class("active")
        self.add_class("complete")
        self.refresh()
    
    def mark_error(self, error: str = "") -> None:
        """Mark as error"""
        self.status = "error"
        if error:
            self.preview = f"Error: {error}"
        self.remove_class("active")
        self.add_class("error")
        self.refresh()


class ThinkingDisplay(Static):
    """Display for model reasoning/thinking"""
    
    DEFAULT_CSS = """
    ThinkingDisplay {
        width: 100%;
        height: auto;
        padding: 0 1;
        color: $text-muted;
        text-style: italic;
    }
    """
    
    def __init__(self, text: str = "", **kwargs):
        super().__init__(**kwargs)
        self.thinking_text = text
    
    def render(self) -> Text:
        """Render thinking text"""
        text = Text()
        text.append("💭 ", style="bold #A855F7")
        text.append(self.thinking_text, style="italic #888888")
        return text
    
    def update_thinking(self, delta: str) -> None:
        """Append to thinking text"""
        self.thinking_text += delta
        self.refresh()
    
    def set_thinking(self, text: str) -> None:
        """Set complete thinking text"""
        self.thinking_text = text
        self.refresh()


class ActivityPanel(Container):
    """
    Live activity lane showing tool execution and thinking
    Inspired by Hermes Agent's activity visualization
    """
    
    DEFAULT_CSS = """
    ActivityPanel {
        width: 100%;
        height: auto;
        max-height: 15;
        border: solid $accent;
        border-title-color: $primary;
        padding: 1 2;
        overflow-y: auto;
    }
    
    ActivityPanel.hidden {
        display: none;
    }
    
    ActivityPanel Vertical {
        width: 100%;
        height: auto;
    }
    """
    
    is_visible = reactive(False)
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.border_title = "Activity"
        self._tools: Dict[str, ToolActivity] = {}
        self._thinking: Optional[ThinkingDisplay] = None
    
    def compose(self) -> ComposeResult:
        """Create the activity panel layout"""
        yield Vertical()
    
    def on_mount(self) -> None:
        """Initialize visibility"""
        if not self.is_visible:
            self.add_class("hidden")
    
    def show(self) -> None:
        """Show the activity panel"""
        self.is_visible = True
        self.remove_class("hidden")
    
    def hide(self) -> None:
        """Hide the activity panel"""
        self.is_visible = False
        self.add_class("hidden")
    
    def add_tool(self, tool_id: str, tool_name: str, preview: str = "") -> None:
        """Add a new tool activity"""
        self.show()
        
        tool = ToolActivity(
            tool_id=tool_id,
            tool_name=tool_name,
            preview=preview
        )
        tool.add_class("active")
        
        self._tools[tool_id] = tool
        
        # Mount to the vertical container
        container = self.query_one(Vertical)
        container.mount(tool)
    
    def update_tool(self, tool_id: str, preview: str) -> None:
        """Update tool progress"""
        if tool_id in self._tools:
            self._tools[tool_id].update_progress(preview)
    
    def complete_tool(self, tool_id: str) -> None:
        """Mark tool as complete"""
        if tool_id in self._tools:
            self._tools[tool_id].mark_complete()
            # Auto-remove after a delay
            self.set_timer(2.0, lambda: self._remove_tool(tool_id))
    
    def error_tool(self, tool_id: str, error: str = "") -> None:
        """Mark tool as error"""
        if tool_id in self._tools:
            self._tools[tool_id].mark_error(error)
    
    def _remove_tool(self, tool_id: str) -> None:
        """Remove a tool from display"""
        if tool_id in self._tools:
            tool = self._tools[tool_id]
            tool.remove()
            del self._tools[tool_id]
            
            # Hide panel if no more activities
            if not self._tools and not self._thinking:
                self.hide()
    
    def add_thinking(self, text: str) -> None:
        """Add or update thinking display"""
        self.show()
        
        if self._thinking is None:
            self._thinking = ThinkingDisplay(text)
            container = self.query_one(Vertical)
            container.mount(self._thinking)
        else:
            self._thinking.set_thinking(text)
    
    def append_thinking(self, delta: str) -> None:
        """Append to thinking text"""
        if self._thinking:
            self._thinking.update_thinking(delta)
        else:
            self.add_thinking(delta)
    
    def clear_thinking(self) -> None:
        """Clear thinking display"""
        if self._thinking:
            self._thinking.remove()
            self._thinking = None
            
            # Hide panel if no more activities
            if not self._tools:
                self.hide()
    
    def clear_all(self) -> None:
        """Clear all activities"""
        for tool in self._tools.values():
            tool.remove()
        self._tools.clear()
        
        if self._thinking:
            self._thinking.remove()
            self._thinking = None
        
        self.hide()
    
    def get_active_count(self) -> int:
        """Get count of active tools"""
        return len([t for t in self._tools.values() if t.status == "active"])

# Made with Bob
