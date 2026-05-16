"""
StatusPanel widget - Display system status, models, and metrics
"""

from textual.widgets import Static
from textual.containers import Vertical, VerticalScroll
from rich.table import Table
from rich.text import Text
from rich.panel import Panel
from typing import List, Dict, Any, Optional


class StatusPanel(VerticalScroll):
    """
    Status panel showing:
    - Active models and their states
    - Current operation
    - Progress indicators
    - Token usage
    - Session information
    """
    
    DEFAULT_CSS = """
    StatusPanel {
        background: #0F0F0F;
        border: solid #27272A;
        padding: 1;
        scrollbar-gutter: stable;
    }
    
    StatusPanel:focus {
        border: solid #A855F7;
    }
    
    StatusPanel .status-section {
        margin: 1 0;
    }
    
    StatusPanel .model-active {
        color: #10B981;
        text-style: bold;
    }
    
    StatusPanel .model-inactive {
        color: #71717A;
    }
    
    StatusPanel .metric-label {
        color: #A855F7;
        text-style: bold;
    }
    
    StatusPanel .metric-value {
        color: #E4E4E7;
    }
    
    StatusPanel .status-good {
        color: #10B981;
    }
    
    StatusPanel .status-warning {
        color: #FBBF24;
    }
    
    StatusPanel .status-error {
        color: #EF4444;
    }
    """
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.models = []
        self.current_operation = None
        self.session_id = None
        self.token_usage = {"used": 0, "total": 0}
        self.backend_status = "disconnected"
    
    def on_mount(self) -> None:
        """Initialize status panel"""
        self.update_display()
    
    def update_display(self) -> None:
        """Update the entire status display"""
        self.remove_children()
        
        # Backend status
        self.mount(self.create_backend_status())
        
        # Models section
        self.mount(self.create_models_section())
        
        # Current operation
        if self.current_operation:
            self.mount(self.create_operation_section())
        
        # Session info
        if self.session_id:
            self.mount(self.create_session_section())
        
        # Metrics
        self.mount(self.create_metrics_section())
    
    def create_backend_status(self) -> Static:
        """Create backend status indicator"""
        text = Text()
        text.append("Backend: ", style="bold")
        
        if self.backend_status == "connected":
            text.append("● Connected", style="bold green")
        elif self.backend_status == "connecting":
            text.append("◐ Connecting...", style="bold yellow")
        else:
            text.append("○ Disconnected", style="bold red")
        
        return Static(text, classes="status-section")
    
    def create_models_section(self) -> Static:
        """Create models list"""
        if not self.models:
            text = Text("No models available", style="italic #71717A")
            return Static(text, classes="status-section")
        
        # Create table
        table = Table(
            show_header=False,
            box=None,
            padding=(0, 1),
            collapse_padding=True
        )
        table.add_column("Status", width=2)
        table.add_column("Model", style="#E4E4E7")
        table.add_column("Provider", style="#71717A")
        
        for model in self.models:
            status = "●" if model.get("active", False) else "○"
            status_style = "green" if model.get("active", False) else "#71717A"
            
            table.add_row(
                Text(status, style=status_style),
                model.get("name", "Unknown"),
                model.get("provider", "Unknown")
            )
        
        return Static(table, classes="status-section")
    
    def create_operation_section(self) -> Static:
        """Create current operation display"""
        text = Text()
        text.append("Operation: ", style="bold #A855F7")
        text.append(self.current_operation, style="#E4E4E7")
        
        return Static(text, classes="status-section")
    
    def create_session_section(self) -> Static:
        """Create session info display"""
        text = Text()
        text.append("Session: ", style="bold #A855F7")
        text.append(self.session_id[:8] + "...", style="#71717A")
        
        return Static(text, classes="status-section")
    
    def create_metrics_section(self) -> Static:
        """Create metrics display"""
        table = Table(
            show_header=False,
            box=None,
            padding=(0, 1),
            collapse_padding=True
        )
        table.add_column("Metric", style="bold #A855F7")
        table.add_column("Value", style="#E4E4E7")
        
        # Token usage
        if self.token_usage["total"] > 0:
            usage_pct = (self.token_usage["used"] / self.token_usage["total"]) * 100
            table.add_row(
                "Tokens",
                f"{self.token_usage['used']:,} / {self.token_usage['total']:,} ({usage_pct:.1f}%)"
            )
        
        # Add more metrics as needed
        
        return Static(table, classes="status-section")
    
    async def update_models(self, models: List[Dict[str, Any]]) -> None:
        """Update the models list"""
        self.models = models
        self.update_display()
    
    async def set_active_model(self, model_name: str) -> None:
        """Mark a model as active"""
        for model in self.models:
            model["active"] = (model.get("name") == model_name)
        self.update_display()
    
    async def update_backend_status(self, status: str) -> None:
        """Update backend connection status"""
        self.backend_status = status
        self.update_display()
    
    async def update_operation(self, operation: Optional[str]) -> None:
        """Update current operation"""
        self.current_operation = operation
        self.update_display()
    
    async def update_session(self, session_id: Optional[str]) -> None:
        """Update session ID"""
        self.session_id = session_id
        self.update_display()
    
    async def update_token_usage(self, used: int, total: int) -> None:
        """Update token usage metrics"""
        self.token_usage = {"used": used, "total": total}
        self.update_display()
    
    def get_active_model(self) -> Optional[str]:
        """Get the currently active model"""
        for model in self.models:
            if model.get("active", False):
                return model.get("name")
        return None

# Made with Bob
