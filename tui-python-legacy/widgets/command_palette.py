"""
CommandPalette widget - Quick command execution
"""

from textual.widgets import Input, ListView, ListItem, Label
from textual.containers import Container, Vertical
from textual.screen import ModalScreen
from rich.text import Text
from typing import List, Callable, Optional, Dict, Any


class CommandPalette(ModalScreen):
    """
    Command palette for quick actions:
    - /scan - Scan repository
    - /execute - Execute operation
    - /models - List models
    - /model - Switch model
    - /clear - Clear output
    - /help - Show help
    """
    
    DEFAULT_CSS = """
    CommandPalette {
        align: center middle;
    }
    
    #palette-container {
        width: 60;
        height: auto;
        max-height: 30;
        background: #1A1A1A;
        border: solid #A855F7;
        padding: 1;
    }
    
    #command-input {
        width: 100%;
        background: #0F0F0F;
        border: solid #27272A;
        margin-bottom: 1;
    }
    
    #command-input:focus {
        border: solid #A855F7;
    }
    
    #suggestions-list {
        width: 100%;
        height: auto;
        max-height: 20;
        background: #0F0F0F;
        border: solid #27272A;
    }
    
    .suggestion-item {
        padding: 0 1;
    }
    
    .suggestion-item:hover {
        background: #27272A;
    }
    
    .command-name {
        color: #A855F7;
        text-style: bold;
    }
    
    .command-desc {
        color: #71717A;
    }
    """
    
    COMMANDS = [
        {
            "name": "/scan",
            "description": "Scan repository for context",
            "args": "[path]",
        },
        {
            "name": "/execute",
            "description": "Execute an operation",
            "args": "<operation> <prompt>",
        },
        {
            "name": "/models",
            "description": "List available models",
            "args": "",
        },
        {
            "name": "/model",
            "description": "Switch to a model",
            "args": "<model_name>",
        },
        {
            "name": "/clear",
            "description": "Clear output stream",
            "args": "",
        },
        {
            "name": "/help",
            "description": "Show help documentation",
            "args": "",
        },
        {
            "name": "/repo",
            "description": "Show repository information",
            "args": "",
        },
        {
            "name": "/status",
            "description": "Show system status",
            "args": "",
        },
    ]
    
    def __init__(self, on_command: Callable[[str], None], **kwargs):
        super().__init__(**kwargs)
        self.on_command = on_command
        self.filtered_commands = self.COMMANDS.copy()
    
    def compose(self):
        with Vertical(id="palette-container"):
            yield Input(
                placeholder="Type a command...",
                id="command-input"
            )
            yield ListView(id="suggestions-list")
    
    def on_mount(self) -> None:
        """Focus input when mounted"""
        self.query_one(Input).focus()
        self.update_suggestions("")
    
    def on_input_changed(self, event: Input.Changed) -> None:
        """Update suggestions as user types"""
        self.update_suggestions(event.value)
    
    def on_input_submitted(self, event: Input.Submitted) -> None:
        """Execute command when user presses Enter"""
        command = event.value.strip()
        if command:
            self.execute_command(command)
    
    def on_list_view_selected(self, event: ListView.Selected) -> None:
        """Execute command when user selects from list"""
        if event.item:
            command_name = event.item.children[0].renderable.plain
            self.query_one(Input).value = command_name + " "
            self.query_one(Input).focus()
    
    def update_suggestions(self, query: str) -> None:
        """Update command suggestions based on query"""
        suggestions_list = self.query_one(ListView)
        suggestions_list.clear()
        
        # Filter commands
        query_lower = query.lower()
        self.filtered_commands = [
            cmd for cmd in self.COMMANDS
            if query_lower in cmd["name"].lower() or
               query_lower in cmd["description"].lower()
        ]
        
        # Add suggestions to list
        for cmd in self.filtered_commands:
            text = Text()
            text.append(cmd["name"], style="bold #A855F7")
            if cmd["args"]:
                text.append(f" {cmd['args']}", style="#71717A")
            text.append(f"\n  {cmd['description']}", style="#71717A")
            
            suggestions_list.append(ListItem(Label(text), classes="suggestion-item"))
    
    def execute_command(self, command: str) -> None:
        """Execute the command"""
        self.on_command(command)
        self.dismiss()
    
    def on_key(self, event) -> None:
        """Handle keyboard shortcuts"""
        if event.key == "escape":
            self.dismiss()


class CommandInput(Input):
    """
    Simplified command input for inline use (not modal)
    """
    
    DEFAULT_CSS = """
    CommandInput {
        width: 100%;
        background: #0F0F0F;
        border: solid #27272A;
        padding: 0 1;
    }
    
    CommandInput:focus {
        border: solid #A855F7;
    }
    """
    
    def __init__(self, on_command: Callable[[str], None], **kwargs):
        super().__init__(
            placeholder="Type a command or message...",
            **kwargs
        )
        self.on_command = on_command
    
    def on_input_submitted(self, event: Input.Submitted) -> None:
        """Execute command when user presses Enter"""
        command = event.value.strip()
        if command:
            self.on_command(command)
            self.value = ""  # Clear input

# Made with Bob
