"""
Elith TUI - Redesigned with OpenCode-inspired architecture
Clean, professional interface with purple accents
Integrated with backend API for real AI responses
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
from textual.containers import Container, Horizontal, Vertical
from textual.widgets import Header, Footer, Static
from textual.reactive import reactive
from textual.worker import Worker, WorkerState

from .theme import get_theme
from .components.chat_input import ChatInput
from .components.messages_panel import MessagesPanel
from .components.banner import Banner


# Backend API configuration
API_BASE = "http://localhost:8000/api"


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
    
    active_model = reactive("lmstudio")
    status = reactive("idle")
    message_count = reactive(0)
    
    def render(self) -> str:
        """Render status bar content"""
        status_text = {
            "idle": "Ready",
            "processing": "Processing...",
            "streaming": "Streaming response...",
            "error": "Error"
        }.get(self.status, "Ready")
        
        return f"Status: {status_text} | Messages: {self.message_count} | Model: {self.active_model} ● | Mode: Chat"


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
    Integrated with backend API
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
        Binding("ctrl+h", "help", "Help", show=True),
    ]
    
    def __init__(self):
        super().__init__()
        self.title = "ELITH"
        self.sub_title = "AI-Powered Code Assistant"
        self.session_id: Optional[str] = None
        self.current_model = "lmstudio"
        self.repo_path = "."
    
    def compose(self) -> ComposeResult:
        """Create the app layout"""
        yield Header()
        yield ChatScreen()
        yield StatusBar(id="status")
        yield Footer()
    
    def on_mount(self) -> None:
        """Initialize the app"""
        # Add welcome message with banner
        try:
            messages = self.query_one("#messages", MessagesPanel)
            
            # Add ASCII art banner
            from .components.banner import BANNER_ART
            messages.add_message(
                "system",
                BANNER_ART + "\n\nWelcome to Elith! Type your prompt or use /commands to get started.\n\nBackend: http://localhost:8000",
                "elith",
                datetime.now().strftime("%H:%M")
            )
            
            # Check backend connection
            self.run_worker(self.check_backend(), exclusive=True)
        except Exception as e:
            pass
    
    async def check_backend(self) -> None:
        """Check if backend is available"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{API_BASE}/models", timeout=2.0)
                if response.status_code == 200:
                    data = response.json()
                    models = data.get("available", [])
                    if models:
                        self.current_model = models[0]
                        status = self.query_one("#status", StatusBar)
                        status.active_model = self.current_model
                        
                        messages = self.query_one("#messages", MessagesPanel)
                        messages.add_message(
                            "system",
                            f"✓ Backend connected. Available models: {', '.join(models)}",
                            "elith",
                            datetime.now().strftime("%H:%M")
                        )
        except Exception as e:
            messages = self.query_one("#messages", MessagesPanel)
            messages.add_message(
                "system",
                f"⚠ Backend not available: {str(e)}\nMake sure the backend is running: python -m uvicorn backend.main:app --reload --port 8000",
                "elith",
                datetime.now().strftime("%H:%M")
            )
    
    def on_chat_input_submitted(self, event: ChatInput.Submitted) -> None:
        """Handle chat input submission"""
        messages = self.query_one("#messages", MessagesPanel)
        status = self.query_one("#status", StatusBar)
        
        # Add user message
        messages.add_message(
            "user",
            event.value,
            "",
            datetime.now().strftime("%H:%M")
        )
        
        # Update message count
        status.message_count += 1
        
        # Check for commands
        if event.value.startswith("/"):
            self.handle_command(event.value)
            return
        
        # Process with AI
        status.status = "processing"
        self.run_worker(self.process_message(event.value), exclusive=True)
    
    def handle_command(self, command: str) -> None:
        """Handle slash commands"""
        messages = self.query_one("#messages", MessagesPanel)
        
        if command == "/help":
            help_text = """Available commands:
- /help - Show this help message
- /models - List available models
- /model <name> - Switch to a different model
- /clear - Clear chat history
- /repo <path> - Set repository path (default: .)

Regular prompts will be sent to the AI for processing."""
            messages.add_message(
                "system",
                help_text,
                "elith",
                datetime.now().strftime("%H:%M")
            )
        
        elif command == "/models":
            self.run_worker(self.list_models(), exclusive=True)
        
        elif command.startswith("/model "):
            model_name = command.split(" ", 1)[1].strip()
            self.current_model = model_name
            status = self.query_one("#status", StatusBar)
            status.active_model = model_name
            messages.add_message(
                "system",
                f"Switched to model: {model_name}",
                "elith",
                datetime.now().strftime("%H:%M")
            )
        
        elif command == "/clear":
            messages.clear_messages()
            messages.add_message(
                "system",
                "Chat history cleared.",
                "elith",
                datetime.now().strftime("%H:%M")
            )
        
        elif command.startswith("/repo "):
            repo_path = command.split(" ", 1)[1].strip()
            self.repo_path = repo_path
            messages.add_message(
                "system",
                f"Repository path set to: {repo_path}",
                "elith",
                datetime.now().strftime("%H:%M")
            )
        
        else:
            messages.add_message(
                "system",
                f"Unknown command: {command}\nType /help for available commands.",
                "elith",
                datetime.now().strftime("%H:%M")
            )
    
    async def list_models(self) -> None:
        """List available models from backend"""
        messages = self.query_one("#messages", MessagesPanel)
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{API_BASE}/models", timeout=5.0)
                if response.status_code == 200:
                    data = response.json()
                    available = data.get("available", [])
                    configured = data.get("configured", [])
                    
                    model_list = "Available models:\n"
                    for model in available:
                        status_icon = "✓" if model in configured else "○"
                        current = " (current)" if model == self.current_model else ""
                        model_list += f"\n{status_icon} {model}{current}"
                    
                    messages.add_message(
                        "system",
                        model_list,
                        "elith",
                        datetime.now().strftime("%H:%M")
                    )
                else:
                    messages.add_message(
                        "system",
                        f"Failed to fetch models: {response.status_code}",
                        "elith",
                        datetime.now().strftime("%H:%M")
                    )
        except Exception as e:
            messages.add_message(
                "system",
                f"Error fetching models: {str(e)}",
                "elith",
                datetime.now().strftime("%H:%M")
            )
    
    async def process_message(self, prompt: str) -> None:
        """Process message with AI backend"""
        messages = self.query_one("#messages", MessagesPanel)
        status = self.query_one("#status", StatusBar)
        
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
                    
                    # Stream the response
                    status.status = "streaming"
                    await self.stream_response(self.session_id)
                else:
                    messages.add_message(
                        "system",
                        f"Error: {response.status_code} - {response.text}",
                        "elith",
                        datetime.now().strftime("%H:%M")
                    )
                    status.status = "error"
        
        except Exception as e:
            messages.add_message(
                "system",
                f"Error processing message: {str(e)}",
                "elith",
                datetime.now().strftime("%H:%M")
            )
            status.status = "error"
        
        finally:
            if status.status != "error":
                status.status = "idle"
    
    async def stream_response(self, session_id: str) -> None:
        """Stream AI response using SSE"""
        messages = self.query_one("#messages", MessagesPanel)
        response_content = []
        current_model = None
        
        try:
            async with httpx.AsyncClient() as client:
                async with client.stream("GET", f"{API_BASE}/stream/{session_id}", timeout=60.0) as response:
                    async for line in response.aiter_lines():
                        if line.startswith("data: "):
                            try:
                                import json
                                data = json.loads(line[6:])
                                
                                if data.get("type") == "output":
                                    content = data.get("content", "")
                                    model = data.get("model", self.current_model)
                                    
                                    if current_model is None:
                                        current_model = model
                                    
                                    response_content.append(content)
                                
                                elif data.get("type") == "done":
                                    # Add complete response
                                    if response_content:
                                        messages.add_message(
                                            "assistant",
                                            "\n".join(response_content),
                                            current_model or self.current_model,
                                            datetime.now().strftime("%H:%M")
                                        )
                                    break
                                
                                elif data.get("type") == "error":
                                    messages.add_message(
                                        "system",
                                        f"Error: {data.get('error', 'Unknown error')}",
                                        "elith",
                                        datetime.now().strftime("%H:%M")
                                    )
                                    break
                            
                            except json.JSONDecodeError:
                                continue
        
        except Exception as e:
            messages.add_message(
                "system",
                f"Streaming error: {str(e)}",
                "elith",
                datetime.now().strftime("%H:%M")
            )
    
    def action_new_session(self) -> None:
        """Start a new session"""
        messages = self.query_one("#messages", MessagesPanel)
        status = self.query_one("#status", StatusBar)
        
        messages.clear_messages()
        status.message_count = 0
        self.session_id = None
        
        messages.add_message(
            "system",
            "New session started.",
            "elith",
            datetime.now().strftime("%H:%M")
        )
    
    def action_help(self) -> None:
        """Show help dialog"""
        self.handle_command("/help")


def main():
    """Entry point for the TUI"""
    app = ElithApp()
    app.run()


if __name__ == "__main__":
    main()

# Made with Bob
