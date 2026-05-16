"""Output panel component for scrolling model output."""

from textual.widgets import RichLog
from textual.containers import ScrollableContainer


class OutputPanel(ScrollableContainer):
    """Scrolling output panel with model-specific headers."""

    DEFAULT_CSS = """
    OutputPanel {
        height: auto;
        border: solid white;
        padding: 1;
    }

    OutputPanel .model-header {
        color: cyan;
        text-style: bold;
    }

    OutputPanel .output-line {
        color: white;
    }
    """

    def __init__(self, output_lines: list[str] | None = None, model: str = "bob") -> None:
        """Initialize output panel.
        
        Args:
            output_lines: List of output lines
            model: Model name for header
        """
        super().__init__()
        self.output_lines = output_lines or []
        self.model = model

    def add_line(self, line: str) -> None:
        """Add a line to the output.
        
        Args:
            line: Line to add
        """
        self.output_lines.append(line)
        # In a real implementation, update the display

# Made with Bob
