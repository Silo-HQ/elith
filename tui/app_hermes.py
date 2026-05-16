"""
Elith TUI - Hermes Agent Inspired
Professional agent interface with streaming, tool visualization, and queue management
"""

import sys
import asyncio
import httpx
from pathlib import Path
from datetime import datetime
from typing import Optional

# Add paths for imports
tui_dir = Path(__file__).parent
project_root = tui_dir.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(tui_dir))

from textual.app import App, ComposeResult
from textual.binding import Binding
from textual.containers import Container, Vertical
from textual.widgets import Header, Footer, Static
from textual.reactive import reactive
from textual.worker import Worker

from tui.components.streaming_message import MessageTranscript
from tui.components.chat_input import ChatInput
from tui.components.activity_panel import ActivityPanel
from tui.components.queue_preview import QueuePreview, QueueManager
from tui.theme import get_theme


# Backend API configuration
API_BASE = "http://localhost:8000/api"


class EnhancedStatusBar(Static):
    """Enhanced status bar with model, activity, and token info"""
    
    DEFAULT_CSS = """
    EnhancedStatusBar {
        dock: bottom;
        height: 1;
        color: $text-muted;
        padding: 0 2;
    }
    """
    
    active_model = reactive("lmstudio")
    status = reactive("idle")
    message_count = reactive(0)
    active_tools = reactive(0)
    token_count = reactive(0)
    
    def render(self) -> str:
        """Render enhanced status bar"""
        status_text = {
            "idle": "Ready",
            "processing": "Processing...",
            "streaming": "Streaming...",
            "error": "Error",
            "busy": "Busy"
        }.get(self.status, "Ready")
        
        # Build status string
        parts = [
            f"● {self.active_model}",
            f"Status: {status_text}",
            f"Messages: {self.message_count}"
        ]
        
        if self.active_tools > 0:
            parts.append(f"Tools: {self.active_tools} active")
        
        if self.token_count > 0:
            parts.append(f"Tokens: {self.token_count}")
        
        return " | ".join(parts)


class HermesApp(App):
    """
    Elith TUI with Hermes Agent-inspired architecture
    Features: streaming messages, tool visualization, queue management
    """
    
    CSS = """
Screen {
    background: $surface;
}

Header {
    background: $surface;
    color: $primary;
    text-style: bold;
}

Footer {
    background: $surface;
}

#main-container {
    width: 100%;
    height: 100%;
}

#content-area {
    width: 100%;
    height: 1fr;
}
"""
    
    BINDINGS = [
        Binding("ctrl+c", "quit", "Quit", show=True),
        Binding("ctrl+n", "new_session", "New Session", show=True),
        Binding("ctrl+l", "clear", "Clear", show=True),
        Binding("ctrl+q", "toggle_queue", "Queue", show=False),
        Binding("ctrl+a", "toggle_activity", "Activity", show=False),
    ]
    
    def __init__(self):
        super().__init__()
        self.title = "ELITH"
        self.sub_title = "Hermes-Inspired Agent Interface"
        self.session_id: Optional[str] = None
        self.current_model = "lmstudio"
        self.repo_path = "."
        self.is_busy = False
        self.queue_manager: Optional[QueueManager] = None
    
    def compose(self) -> ComposeResult:
        """Create the app layout"""
        yield Header()
        
        with Container(id="main-container"):
            with Vertical(id="content-area"):
                yield MessageTranscript(id="transcript")
                yield ActivityPanel(id="activity")
                yield QueuePreview(id="queue")
                yield ChatInput(id="input")
        
        yield EnhancedStatusBar(id="status")
        yield Footer()
    
    def on_mount(self) -> None:
        """Initialize the app"""
        # Initialize queue manager
        queue_preview = self.query_one("#queue", QueuePreview)
        self.queue_manager = QueueManager(queue_preview)
        
        # Add welcome message
        transcript = self.query_one("#transcript", MessageTranscript)
        transcript.add_system_message(
            "Welcome to Elith! Hermes Agent-inspired interface.\n\n"
            "Features:\n"
            "• Streaming responses with delta updates\n"
            "• Live tool execution visualization\n"
            "• Message queue for busy periods\n"
            "• Thinking/reasoning display\n\n"
            "Backend: http://localhost:8000"
        )
        
        # Check backend connection
        self.run_worker(self.check_backend(), exclusive=False)
    
    async def check_backend(self) -> None:
        """Check if backend is available"""
        transcript = self.query_one("#transcript", MessageTranscript)
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{API_BASE}/models", timeout=2.0)
                if response.status_code == 200:
                    data = response.json()
                    models = data.get("available", [])
                    if models:
                        self.current_model = models[0]
                        status = self.query_one("#status", EnhancedStatusBar)
                        status.active_model = self.current_model
                        
                        transcript.add_system_message(
                            f"✓ Backend connected\nAvailable models: {', '.join(models)}"
                        )
        except Exception as e:
            transcript.add_system_message(
                f"⚠ Backend not available: {str(e)}\n"
                "Make sure backend is running:\n"
                "python -m uvicorn backend.main:app --reload --port 8000"
            )
    
    def on_chat_input_submitted(self, event: ChatInput.Submitted) -> None:
        """Handle chat input submission"""
        transcript = self.query_one("#transcript", MessageTranscript)
        status = self.query_one("#status", EnhancedStatusBar)
        
        # Check if it's a command
        if event.value.startswith("/"):
            self.handle_command(event.value)
            return
        
        # Add user message to transcript
        transcript.add_user_message(event.value)
        status.message_count += 1
        
        # If busy, queue the message
        if self.is_busy:
            self.queue_manager.add(event.value)
            return
        
        # Process immediately
        self.is_busy = True
        status.status = "processing"
        self.run_worker(self.process_message(event.value), exclusive=False)
    
    def handle_command(self, command: str) -> None:
        """Handle slash commands"""
        transcript = self.query_one("#transcript", MessageTranscript)
        
        if command == "/help":
            help_text = """Available commands:
- /help - Show this help
- /models - List available models
- /model <name> - Switch model
- /clear - Clear chat history
- /repo <path> - Set repository path
- /queue - Show queue status
- /activity - Toggle activity panel

Regular prompts are sent to the AI."""
            transcript.add_system_message(help_text)
        
        elif command == "/models":
            self.run_worker(self.list_models(), exclusive=False)
        
        elif command.startswith("/model "):
            model_name = command.split(" ", 1)[1].strip()
            self.current_model = model_name
            status = self.query_one("#status", EnhancedStatusBar)
            status.active_model = model_name
            transcript.add_system_message(f"Switched to model: {model_name}")
        
        elif command == "/clear":
            transcript.clear_messages()
            activity = self.query_one("#activity", ActivityPanel)
            activity.clear_all()
            self.queue_manager.clear()
            transcript.add_system_message("Chat history cleared.")
        
        elif command.startswith("/repo "):
            repo_path = command.split(" ", 1)[1].strip()
            self.repo_path = repo_path
            transcript.add_system_message(f"Repository path: {repo_path}")
        
        elif command == "/queue":
            count = self.queue_manager.get_count()
            transcript.add_system_message(f"Queue: {count} messages pending")
        
        elif command == "/activity":
            self.action_toggle_activity()
        
        else:
            transcript.add_system_message(
                f"Unknown command: {command}\nType /help for available commands."
            )
    
    async def list_models(self) -> None:
        """List available models"""
        transcript = self.query_one("#transcript", MessageTranscript)
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{API_BASE}/models", timeout=5.0)
                if response.status_code == 200:
                    data = response.json()
                    available = data.get("available", [])
                    
                    model_list = "Available models:\n"
                    for model in available:
                        current = " (current)" if model == self.current_model else ""
                        model_list += f"\n● {model}{current}"
                    
                    transcript.add_system_message(model_list)
        except Exception as e:
            transcript.add_system_message(f"Error fetching models: {str(e)}")
    
    async def process_message(self, prompt: str) -> None:
        """Process message with streaming"""
        transcript = self.query_one("#transcript", MessageTranscript)
        status = self.query_one("#status", EnhancedStatusBar)
        activity = self.query_one("#activity", ActivityPanel)
        
        try:
            # Execute operation
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{API_BASE}/execute",
                    json={
                        "model": self.current_model,
                        "operation": "explain",
                        "repo_path": self.repo_path,
                        "prompt": prompt
                    },
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    self.session_id = data.get("session_id")
                    
                    # Start streaming
                    status.status = "streaming"
                    await self.stream_response(self.session_id)
                else:
                    transcript.add_system_message(
                        f"Error: {response.status_code} - {response.text}"
                    )
                    status.status = "error"
        
        except Exception as e:
            transcript.add_system_message(f"Error: {str(e)}")
            status.status = "error"
        
        finally:
            self.is_busy = False
            if status.status != "error":
                status.status = "idle"
            
            # Auto-drain queue
            if self.queue_manager.should_auto_drain():
                next_message = self.queue_manager.pop_next()
                if next_message:
                    self.is_busy = True
                    status.status = "processing"
                    self.run_worker(
                        self.process_message(next_message),
                        exclusive=False
                    )
    
    async def stream_response(self, session_id: str) -> None:
        """Stream AI response with event handling"""
        transcript = self.query_one("#transcript", MessageTranscript)
        activity = self.query_one("#activity", ActivityPanel)
        status = self.query_one("#status", EnhancedStatusBar)
        
        # Start streaming message
        streaming_msg = transcript.start_assistant_message(self.current_model)
        
        try:
            async with httpx.AsyncClient() as client:
                async with client.stream(
                    "GET",
                    f"{API_BASE}/stream/{session_id}",
                    timeout=60.0
                ) as response:
                    async for line in response.aiter_lines():
                        if line.startswith("data: "):
                            try:
                                import json
                                data = json.loads(line[6:])
                                event_type = data.get("type")
                                
                                if event_type == "output":
                                    # Append delta to streaming message
                                    content = data.get("content", "")
                                    transcript.append_to_stream(content)
                                
                                elif event_type == "tool_call":
                                    # Show tool activity
                                    tool_name = data.get("tool", "unknown")
                                    tool_id = data.get("tool_id", str(id(data)))
                                    activity.add_tool(
                                        tool_id,
                                        tool_name,
                                        f"Executing {tool_name}..."
                                    )
                                    status.active_tools = activity.get_active_count()
                                
                                elif event_type == "tool_complete":
                                    # Complete tool
                                    tool_id = data.get("tool_id", "")
                                    if tool_id:
                                        activity.complete_tool(tool_id)
                                    status.active_tools = activity.get_active_count()
                                
                                elif event_type == "thinking":
                                    # Show thinking
                                    thinking = data.get("content", "")
                                    activity.add_thinking(thinking)
                                
                                elif event_type == "done":
                                    # Complete streaming
                                    transcript.complete_stream()
                                    
                                    # Update token count if available
                                    usage = data.get("usage", {})
                                    if usage:
                                        total = usage.get("total_tokens", 0)
                                        status.token_count += total
                                    break
                                
                                elif event_type == "error":
                                    transcript.complete_stream()
                                    transcript.add_system_message(
                                        f"Error: {data.get('error', 'Unknown error')}"
                                    )
                                    break
                            
                            except json.JSONDecodeError:
                                continue
        
        except Exception as e:
            transcript.complete_stream()
            transcript.add_system_message(f"Streaming error: {str(e)}")
    
    def action_new_session(self) -> None:
        """Start a new session"""
        transcript = self.query_one("#transcript", MessageTranscript)
        activity = self.query_one("#activity", ActivityPanel)
        status = self.query_one("#status", EnhancedStatusBar)
        
        transcript.clear_messages()
        activity.clear_all()
        self.queue_manager.clear()
        status.message_count = 0
        status.token_count = 0
        self.session_id = None
        self.is_busy = False
        
        transcript.add_system_message("New session started.")
    
    def action_clear(self) -> None:
        """Clear chat history"""
        self.handle_command("/clear")
    
    def action_toggle_queue(self) -> None:
        """Toggle queue visibility"""
        queue = self.query_one("#queue", QueuePreview)
        if queue.has_class("hidden"):
            queue.remove_class("hidden")
        else:
            queue.add_class("hidden")
    
    def action_toggle_activity(self) -> None:
        """Toggle activity panel visibility"""
        activity = self.query_one("#activity", ActivityPanel)
        if activity.is_visible:
            activity.hide()
        else:
            activity.show()


def main():
    """Entry point for Hermes-inspired TUI"""
    app = HermesApp()
    app.run()


if __name__ == "__main__":
    main()

# Made with Bob
