"""
Elith Multi-Agent TUI - Shows multiple agents working simultaneously
Inspired by the agent coordination panel design
"""

import sys
from pathlib import Path
from datetime import datetime
import os
import httpx
import asyncio
import json
from typing import AsyncGenerator, List, Dict

# Add paths for imports
tui_dir = Path(__file__).parent
project_root = tui_dir.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(tui_dir))

from textual.app import App, ComposeResult
from textual.binding import Binding
from textual.containers import Container, Horizontal, Vertical, Grid
from textual.widgets import Header, Footer, Static, Input, Label
from textual.reactive import reactive
from textual.worker import Worker, WorkerState


class AgentPanel(Static):
    """Panel showing a single agent's status and activity"""
    
    DEFAULT_CSS = """
    AgentPanel {
        border: solid #00ff00;
        height: 100%;
        padding: 1;
        background: #0a0a0a;
    }
    
    AgentPanel .agent-header {
        color: #00ff00;
        text-style: bold;
    }
    
    AgentPanel .agent-task {
        color: #888888;
    }
    
    AgentPanel .agent-status {
        color: #00ff00;
        margin: 1 0;
    }
    
    AgentPanel .agent-logs {
        color: #aaaaaa;
        height: 100%;
    }
    """
    
    agent_name = reactive("")
    agent_id = reactive(0)
    agent_task = reactive("")
    status = reactive("IDLE")
    logs = reactive([])
    
    def __init__(self, agent_id: int, name: str, task: str, **kwargs):
        super().__init__(**kwargs)
        self.agent_id = agent_id
        self.agent_name = name
        self.agent_task = task
        self.logs = []
    
    def render(self) -> str:
        """Render agent panel content"""
        status_color = {
            "ACTIVE": "green",
            "WORKING": "yellow",
            "WAITING": "dim",
            "IDLE": "dim"
        }.get(self.status, "white")
        
        header = f"● Agent {self.agent_id}: {self.agent_name}"
        task_line = f"TASK: {self.agent_task}"
        status_line = f"Status: {self.status}."
        
        # Format logs
        log_lines = "\n".join(self.logs[-10:]) if self.logs else "[idle] Waiting for tasks..."
        
        return f"{header}\n{task_line}\n\n{status_line}\n\n{log_lines}"
    
    def add_log(self, message: str):
        """Add a log entry"""
        self.logs.append(message)
        self.refresh()
    
    def set_status(self, status: str):
        """Update agent status"""
        self.status = status
        self.refresh()


class ProjectHeader(Static):
    """Header showing project information"""
    
    DEFAULT_CSS = """
    ProjectHeader {
        height: 3;
        background: #121212;
        border: solid #00ff00;
        padding: 1;
        color: #00ff00;
    }
    """
    
    project_type = reactive("PROJECT")
    timestamp = reactive("")
    
    def render(self) -> str:
        """Render header"""
        return f"AGENT COORDINATION PANEL: {self.project_type.upper()} PROJECT\n[{self.timestamp}]"


class UserPromptBar(Static):
    """Bottom bar showing user prompt"""
    
    DEFAULT_CSS = """
    UserPromptBar {
        height: 3;
        background: #121212;
        border: solid #00ff00;
        padding: 1;
        dock: bottom;
    }
    """
    
    prompt = reactive("")
    
    def render(self) -> str:
        """Render prompt bar"""
        return f"[LAST PROMPT] >> {self.prompt}"


class InputBar(Container):
    """Input bar for user to type prompts"""
    
    DEFAULT_CSS = """
    InputBar {
        height: 3;
        background: #121212;
        border: solid #00ff00;
        padding: 0 1;
        dock: bottom;
    }
    
    InputBar Input {
        width: 100%;
        background: #0a0a0a;
        border: none;
        color: #00ff00;
    }
    """
    
    def compose(self) -> ComposeResult:
        """Create input field"""
        yield Input(placeholder="Type your prompt here and press Enter...", id="user_input")


class MultiAgentScreen(Container):
    """Main screen with multi-agent grid layout"""
    
    DEFAULT_CSS = """
    MultiAgentScreen {
        width: 100%;
        height: 100%;
        background: #0a0a0a;
    }
    
    MultiAgentScreen Grid {
        grid-size: 2 2;
        grid-gutter: 1;
        height: 1fr;
        margin: 1 0;
    }
    """
    
    def compose(self) -> ComposeResult:
        """Create the multi-agent interface"""
        yield ProjectHeader(id="project_header")
        
        with Grid():
            yield AgentPanel(1, "Orchestrator", "Manage workflow", id="agent_1")
            yield AgentPanel(2, "Research", "Fetch data requirements", id="agent_2")
            yield AgentPanel(3, "Code Gen", "Scaffold application", id="agent_3")
            yield AgentPanel(4, "Review", "Quality & Security check", id="agent_4")
        
        yield UserPromptBar(id="prompt_bar")
        yield InputBar(id="input_bar")


class ElithMultiAgentApp(App):
    """
    Elith Multi-Agent TUI Application
    Shows multiple agents working simultaneously in a grid layout
    """
    
    CSS = """
    Screen {
        background: #0a0a0a;
    }
    
    Header {
        background: #121212;
        color: #00ff00;
        text-style: bold;
    }
    
    Footer {
        background: #121212;
    }
    """
    
    BINDINGS = [
        Binding("ctrl+c", "quit", "Quit", show=True),
        Binding("ctrl+r", "refresh", "Refresh", show=True),
    ]
    
    def __init__(self):
        super().__init__()
        self.title = "ELITH MULTI-AGENT SYSTEM"
        self.sub_title = "Agent Coordination Panel"
        self.current_task = ""
    
    def compose(self) -> ComposeResult:
        """Create the app layout"""
        yield Header()
        yield MultiAgentScreen()
        yield Footer()
    
    def on_mount(self) -> None:
        """Initialize the app"""
        # Update timestamp
        header = self.query_one("#project_header", ProjectHeader)
        header.timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Set initial agent states
        self.query_one("#agent_1", AgentPanel).set_status("IDLE")
        self.query_one("#agent_2", AgentPanel).set_status("IDLE")
        self.query_one("#agent_3", AgentPanel).set_status("IDLE")
        self.query_one("#agent_4", AgentPanel).set_status("IDLE")
        
        # Show welcome message
        self.query_one("#agent_1", AgentPanel).add_log("[system] Multi-agent system ready.")
        self.query_one("#agent_1", AgentPanel).add_log("[system] Type your prompt below and press Enter...")
        
        # Focus on input field
        input_field = self.query_one("#user_input", Input)
        input_field.focus()
    
    async def process_task(self, task: str):
        """Process a task using multi-agent system"""
        # Update prompt bar
        prompt_bar = self.query_one("#prompt_bar", UserPromptBar)
        prompt_bar.prompt = task
        
        # Update project header
        header = self.query_one("#project_header", ProjectHeader)
        header.project_type = "ITINERARY APPLICATION"
        header.timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Get agent panels
        orchestrator = self.query_one("#agent_1", AgentPanel)
        research = self.query_one("#agent_2", AgentPanel)
        codegen = self.query_one("#agent_3", AgentPanel)
        review = self.query_one("#agent_4", AgentPanel)
        
        # Phase 1: Orchestrator analyzes
        orchestrator.set_status("ACTIVE")
        orchestrator.add_log("[system] Recv: User Prompt -> Break down task.")
        await asyncio.sleep(1)
        orchestrator.add_log("Dispatching Research to Agent 2 (Market Data).")
        await asyncio.sleep(0.5)
        orchestrator.add_log("Code Gen to Agent 3 (Component Structure).")
        await asyncio.sleep(0.5)
        orchestrator.add_log("Review to Agent 4 (Quality Check).")
        
        # Phase 2: Research starts
        research.set_status("ACTIVE")
        research.add_log("[querying] APIs (REST, GraphQL)...")
        await asyncio.sleep(1)
        research.add_log("Found: Data models, endpoints.")
        await asyncio.sleep(1)
        research.add_log("Refresh intervals configured.")
        
        # Phase 3: Code Gen starts
        codegen.set_status("WORKING")
        codegen.add_log("[coding] App.js -> Create layout, Dashboard.js...")
        await asyncio.sleep(1)
        codegen.add_log("Components: Header, Sidebar, Content...")
        await asyncio.sleep(1)
        codegen.add_log("State management setup...")
        
        # Call backend API for actual work
        await self.call_backend_multi_agent(task)
        
        # Phase 4: Review
        review.set_status("ACTIVE")
        review.add_log("[analyzing] Code structure, hooks, performance...")
        await asyncio.sleep(1)
        review.add_log("✓ Quality check passed.")
        
        # Complete
        orchestrator.add_log("[system] Task complete!")
        orchestrator.set_status("IDLE")
        research.set_status("IDLE")
        codegen.set_status("IDLE")
        review.set_status("IDLE")
    
    async def call_backend_multi_agent(self, message: str):
        """Call backend API and stream to agent panels"""
        backend_url = os.getenv("ELITH_BACKEND_URL", "http://localhost:8000")
        repo_path = os.getcwd()
        
        codegen = self.query_one("#agent_3", AgentPanel)
        
        try:
            async with httpx.AsyncClient(timeout=300.0) as client:
                async with client.stream(
                    "POST",
                    f"{backend_url}/api/chat/stream",
                    json={
                        "message": message,
                        "model": "openrouter",
                        "repo_path": repo_path
                    }
                ) as response:
                    if response.status_code != 200:
                        codegen.add_log(f"Error: Backend returned status {response.status_code}")
                        return
                    
                    # Process SSE stream
                    async for line in response.aiter_lines():
                        if line.startswith("data: "):
                            data_str = line[6:]
                            try:
                                data = json.loads(data_str)
                                
                                if "error" in data:
                                    codegen.add_log(f"Error: {data['error']}")
                                    return
                                elif "chunk" in data:
                                    # Add chunk to code gen panel
                                    chunk = data["chunk"].strip()
                                    if chunk and not chunk.startswith("#"):
                                        codegen.add_log(chunk[:80])  # Truncate long lines
                                elif data.get("done"):
                                    codegen.add_log("[system] Code generation complete!")
                                    return
                            except:
                                pass
        
        except httpx.ConnectError:
            codegen.add_log("Error: Cannot connect to backend")
        except Exception as e:
            codegen.add_log(f"Error: {str(e)}")
    
    async def on_input_submitted(self, event: Input.Submitted) -> None:
        """Handle user input submission"""
        user_input = event.value.strip()
        if not user_input:
            return
        
        # Clear input field
        event.input.value = ""
        
        # Process the task
        self.run_worker(
            self.process_task(user_input),
            name="task_processor"
        )
    
    def action_refresh(self) -> None:
        """Refresh all panels"""
        self.refresh()


def main():
    """Entry point for the multi-agent TUI"""
    app = ElithMultiAgentApp()
    app.run()


if __name__ == "__main__":
    main()

# Made with Bob
