"""
OutputStream widget - Live streaming output from backend
"""

from textual.widgets import Static, RichLog
from textual.containers import VerticalScroll
from rich.text import Text
from rich.syntax import Syntax
from rich.panel import Panel
from datetime import datetime
from typing import Optional, Dict, Any
import re


class OutputStream(RichLog):
    """
    Live output stream with:
    - Real-time SSE updates
    - Model attribution
    - Syntax highlighting
    - Timestamps
    - Auto-scroll
    """
    
    DEFAULT_CSS = """
    OutputStream {
        background: #0F0F0F;
        border: solid #27272A;
        padding: 1 2;
        scrollbar-gutter: stable;
    }
    
    OutputStream:focus {
        border: solid #A855F7;
    }
    
    OutputStream .timestamp {
        color: #71717A;
    }
    
    OutputStream .model-badge {
        color: #A855F7;
        text-style: bold;
    }
    
    OutputStream .user-message {
        color: #60A5FA;
    }
    
    OutputStream .assistant-message {
        color: #E4E4E7;
    }
    
    OutputStream .system-message {
        color: #FBBF24;
    }
    
    OutputStream .error-message {
        color: #EF4444;
        text-style: bold;
    }
    
    OutputStream .success-message {
        color: #10B981;
    }
    """
    
    # Model colors for attribution
    MODEL_COLORS = {
        "claude": "#A855F7",  # Purple
        "gpt": "#10B981",     # Green
        "gemini": "#3B82F6",  # Blue
        "ollama": "#F59E0B",  # Orange
        "bob": "#EC4899",     # Pink
    }
    
    def __init__(self, **kwargs):
        super().__init__(
            max_lines=1000,
            wrap=True,
            highlight=True,
            markup=True,
            **kwargs
        )
        self.auto_scroll = True
        self.current_model = None
    
    def on_mount(self) -> None:
        """Initialize output stream"""
        self.write_system_message("Output stream initialized. Waiting for messages...")
    
    def write_message(
        self,
        content: str,
        role: str = "assistant",
        model: Optional[str] = None,
        timestamp: bool = True
    ) -> None:
        """Write a message to the output stream"""
        text = Text()
        
        # Add timestamp
        if timestamp:
            now = datetime.now().strftime("%H:%M:%S")
            text.append(f"[{now}] ", style="#71717A")
        
        # Add model badge
        if model:
            model_color = self.get_model_color(model)
            text.append(f"[{model}] ", style=f"bold {model_color}")
        
        # Add role indicator
        if role == "user":
            text.append("You: ", style="bold #60A5FA")
        elif role == "assistant":
            text.append("AI: ", style="bold #E4E4E7")
        elif role == "system":
            text.append("System: ", style="bold #FBBF24")
        
        # Add content
        text.append(content)
        
        self.write(text)
        
        if self.auto_scroll:
            self.scroll_end(animate=False)
    
    def write_user_message(self, content: str) -> None:
        """Write a user message"""
        self.write_message(content, role="user", model=None)
    
    def write_assistant_message(self, content: str, model: Optional[str] = None) -> None:
        """Write an assistant message"""
        self.write_message(content, role="assistant", model=model or self.current_model)
    
    def write_system_message(self, content: str) -> None:
        """Write a system message"""
        self.write_message(content, role="system", model=None)
    
    def write_error(self, content: str) -> None:
        """Write an error message"""
        text = Text()
        text.append("❌ Error: ", style="bold red")
        text.append(content, style="red")
        self.write(text)
        
        if self.auto_scroll:
            self.scroll_end(animate=False)
    
    def write_success(self, content: str) -> None:
        """Write a success message"""
        text = Text()
        text.append("✓ ", style="bold green")
        text.append(content, style="green")
        self.write(text)
        
        if self.auto_scroll:
            self.scroll_end(animate=False)
    
    def write_code_block(self, code: str, language: str = "python") -> None:
        """Write a syntax-highlighted code block"""
        try:
            syntax = Syntax(
                code,
                language,
                theme="monokai",
                line_numbers=True,
                word_wrap=False,
                background_color="#1A1A1A"
            )
            self.write(syntax)
        except Exception:
            # Fallback to plain text
            self.write(code)
        
        if self.auto_scroll:
            self.scroll_end(animate=False)
    
    def write_streaming_chunk(self, chunk: str, model: Optional[str] = None) -> None:
        """Write a streaming chunk (no newline)"""
        # For streaming, we append to the last line
        # This is a simplified version - real implementation would need buffering
        text = Text(chunk)
        self.write(text)
        
        if self.auto_scroll:
            self.scroll_end(animate=False)
    
    def write_separator(self) -> None:
        """Write a visual separator"""
        text = Text("─" * 60, style="#27272A")
        self.write(text)
    
    def set_current_model(self, model: str) -> None:
        """Set the current model for attribution"""
        self.current_model = model
    
    def get_model_color(self, model: str) -> str:
        """Get color for a model"""
        model_lower = model.lower()
        for key, color in self.MODEL_COLORS.items():
            if key in model_lower:
                return color
        return "#A855F7"  # Default purple
    
    def toggle_auto_scroll(self) -> None:
        """Toggle auto-scroll"""
        self.auto_scroll = not self.auto_scroll
        status = "enabled" if self.auto_scroll else "disabled"
        self.write_system_message(f"Auto-scroll {status}")
    
    def process_sse_event(self, event: Dict[str, Any]) -> None:
        """Process an SSE event from the backend"""
        event_type = event.get("type", "unknown")
        data = event.get("data", {})
        
        if event_type == "start":
            model = data.get("model", "Unknown")
            operation = data.get("operation", "Unknown")
            self.write_separator()
            self.write_system_message(f"Starting {operation} with {model}")
            self.set_current_model(model)
            
        elif event_type == "chunk":
            content = data.get("content", "")
            self.write_streaming_chunk(content, self.current_model)
            
        elif event_type == "complete":
            self.write_separator()
            self.write_success("Operation completed")
            
        elif event_type == "error":
            error = data.get("error", "Unknown error")
            self.write_error(error)
            
        elif event_type == "progress":
            progress = data.get("progress", 0)
            message = data.get("message", "")
            self.write_system_message(f"[{progress}%] {message}")
    
    def format_markdown(self, content: str) -> None:
        """Format and write markdown content"""
        # Simple markdown parsing for code blocks
        code_block_pattern = r'```(\w+)?\n(.*?)```'
        matches = list(re.finditer(code_block_pattern, content, re.DOTALL))
        
        if not matches:
            # No code blocks, write as plain text
            self.write(Text(content))
            return
        
        # Write content with code blocks
        last_end = 0
        for match in matches:
            # Write text before code block
            if match.start() > last_end:
                text_before = content[last_end:match.start()]
                if text_before.strip():
                    self.write(Text(text_before))
            
            # Write code block
            language = match.group(1) or "text"
            code = match.group(2)
            self.write_code_block(code, language)
            
            last_end = match.end()
        
        # Write remaining text
        if last_end < len(content):
            text_after = content[last_end:]
            if text_after.strip():
                self.write(Text(text_after))

# Made with Bob
