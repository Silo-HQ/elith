"""
Elith TUI - Redesigned with OpenCode-inspired architecture
Clean, professional interface with purple accents
"""

import sys
from pathlib import Path
from datetime import datetime
import os
import httpx
import asyncio
import json
from typing import AsyncGenerator

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
from textual.worker import Worker, WorkerState

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
        
        # Send to backend asynchronously
        self.send_to_backend(event.value)
    
    @staticmethod
    async def call_backend(message: str, model: str = "openrouter") -> AsyncGenerator[str, None]:
        """Call backend API and stream response"""
        backend_url = os.getenv("ELITH_BACKEND_URL", "http://localhost:8000")
        repo_path = os.getcwd()
        
        try:
            async with httpx.AsyncClient(timeout=300.0) as client:
                async with client.stream(
                    "POST",
                    f"{backend_url}/api/chat/stream",
                    json={
                        "message": message,
                        "model": model,
                        "repo_path": repo_path
                    }
                ) as response:
                    if response.status_code != 200:
                        yield f"Error: Backend returned status {response.status_code}\n"
                        return
                    
                    # Process SSE stream
                    async for line in response.aiter_lines():
                        if line.startswith("data: "):
                            data_str = line[6:]  # Remove "data: " prefix
                            try:
                                import json
                                data = json.loads(data_str)
                                
                                if "error" in data:
                                    yield f"Error: {data['error']}\n"
                                    return
                                elif "chunk" in data:
                                    yield data["chunk"]
                                elif data.get("done"):
                                    return
                            except Exception:
                                # Plain text chunk
                                yield data_str
        
        except httpx.ConnectError:
            yield "Error: Cannot connect to backend. Make sure the backend server is running:\n\nuvicorn backend.main:app --reload --port 8000"
        except Exception as e:
            yield f"Error: {str(e)}"
    
    def send_to_backend(self, message: str) -> None:
        """Send message to backend and stream response"""
        messages = self.query_one("#messages", MessagesPanel)
        
        # Add initial message
        loading_time = datetime.now().strftime("%H:%M")
        messages.add_message(
            "assistant",
            "",
            "bob",
            loading_time
        )
        
        # Stream response
        async def stream_response():
            """Stream response from backend"""
            response_text = ""
            async for chunk in self.call_backend(message):
                response_text += chunk
                messages.update_last_message(response_text)
        
        # Run streaming in worker
        self.run_worker(
            stream_response(),
            name="backend_stream",
            description="Streaming from backend"
        )
    
    def on_worker_state_changed(self, event: Worker.StateChanged) -> None:
        """Handle worker state changes"""
        if event.worker.name == "backend_call":
            if event.state == WorkerState.SUCCESS:
                # Get the response
                response = event.worker.result
                
                # Update the last message with the response
                messages = self.query_one("#messages", MessagesPanel)
                if response:
                    messages.update_last_message(str(response))
                else:
                    messages.update_last_message("No response from backend")
            
            elif event.state == WorkerState.ERROR:
                # Show error
                messages = self.query_one("#messages", MessagesPanel)
                error_msg = str(event.worker.error) if event.worker.error else "Unknown error"
                messages.update_last_message(f"Error: {error_msg}")
    
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
