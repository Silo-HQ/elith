"""Execution screen for multi-model task execution."""

from textual.app import ComposeResult
from textual.screen import Screen
from textual.containers import Container, Vertical, Horizontal
from textual.widgets import Header, Footer, Static

from ..components.status_bar import StatusBar
from ..components.output_panel import OutputPanel
from ..components.progress_bar import ProgressBar
from ..components.model_dot import ModelDot


class ExecutionScreen(Screen):
    """Screen for displaying multi-model execution progress."""

    BINDINGS = [
        ("escape", "back", "Back"),
        ("ctrl+c", "quit", "Quit"),
    ]

    DEFAULT_CSS = """
    ExecutionScreen {
        background: #0A0A0A;
    }

    ExecutionScreen .execution-header {
        height: 3;
        border: solid cyan;
        padding: 1;
        margin-bottom: 1;
    }

    ExecutionScreen .execution-title {
        color: cyan;
        text-style: bold;
    }

    ExecutionScreen .model-panel {
        height: auto;
        border: solid white;
        padding: 1;
        margin: 1;
    }

    ExecutionScreen .model-header {
        color: cyan;
        text-style: bold;
    }

    ExecutionScreen .overall-progress {
        margin: 1;
        padding: 1;
        border: solid #A855F7;
    }
    """

    def __init__(self, models: list[str] | None = None, operation: str = "architect") -> None:
        """Initialize execution screen.
        
        Args:
            models: List of model names to execute
            operation: Operation being performed
        """
        super().__init__()
        self.models = models or ["bob", "claude", "gemini"]
        self.operation = operation
        self.model_outputs: dict[str, list[str]] = {model: [] for model in self.models}
        self.model_progress: dict[str, float] = {model: 0.0 for model in self.models}

    def compose(self) -> ComposeResult:
        """Compose the execution screen layout."""
        yield Header()
        
        # Execution header
        yield Container(
            Static(
                f"[cyan]═══ EXECUTING: {self.operation.upper()} ═══[/cyan]",
                classes="execution-title"
            ),
            classes="execution-header"
        )

        # Model execution panels
        for model in self.models:
            yield Container(
                Horizontal(
                    ModelDot(model, status="running"),
                    Static(f" {model.upper()} Output", classes="model-header"),
                ),
                OutputPanel(
                    output_lines=self.model_outputs.get(model, []),
                    model=model
                ),
                ProgressBar(label=f"{model.upper()} Progress", total=100.0),
                classes="model-panel"
            )

        # Overall progress
        yield Container(
            ProgressBar(label="Overall Progress", total=100.0),
            classes="overall-progress"
        )

        yield StatusBar(
            mode="Execution",
            model=self.models[0] if self.models else "bob",
            tokens_used=45,
            auto_approve="Edit"
        )
        yield Footer()

    def add_output(self, model: str, line: str) -> None:
        """Add output line for a model.
        
        Args:
            model: Model name
            line: Output line to add
        """
        if model in self.model_outputs:
            self.model_outputs[model].append(line)
            # Update the output panel for this model
            # In a real implementation, you'd query and update the specific panel

    def update_model_progress(self, model: str, progress: float) -> None:
        """Update progress for a specific model.
        
        Args:
            model: Model name
            progress: Progress value (0-100)
        """
        if model in self.model_progress:
            self.model_progress[model] = progress
            # Update overall progress (average of all models)
            overall = sum(self.model_progress.values()) / len(self.model_progress)
            # In a real implementation, you'd query and update the progress bars

    def set_model_status(self, model: str, status: str) -> None:
        """Update status for a specific model.
        
        Args:
            model: Model name
            status: Status (running, done, error)
        """
        # In a real implementation, you'd query and update the model dot

    def action_back(self) -> None:
        """Go back to workspace screen."""
        self.app.pop_screen()

    def action_quit(self) -> None:
        """Quit the application."""
        self.app.exit()

# Made with Bob
