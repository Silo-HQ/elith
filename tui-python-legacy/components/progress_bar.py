"""Progress bar component for showing task progress."""

from textual.app import ComposeResult
from textual.widgets import ProgressBar as TextualProgressBar, Static
from textual.containers import Container


class ProgressBar(Static):
    """Custom progress bar with label and percentage."""

    DEFAULT_CSS = """
    ProgressBar {
        height: auto;
        padding: 0 1;
    }

    ProgressBar .progress-label {
        color: cyan;
        text-style: bold;
    }

    ProgressBar .progress-percentage {
        color: #A855F7;
    }
    """

    def __init__(self, label: str = "Progress", total: float = 100.0) -> None:
        """Initialize progress bar.
        
        Args:
            label: Label to display above progress bar
            total: Total value for 100% completion
        """
        super().__init__()
        self.label = label
        self.total = total
        self.current = 0.0

    def compose(self) -> ComposeResult:
        """Compose the progress bar layout."""
        percentage = int((self.current / self.total) * 100) if self.total > 0 else 0
        yield Container(
            Static(
                f"[cyan]{self.label}[/cyan] [#A855F7]{percentage}%[/#A855F7]",
                classes="progress-label"
            ),
            TextualProgressBar(total=self.total, show_eta=False),
        )

    def update_progress(self, current: float) -> None:
        """Update progress value.
        
        Args:
            current: Current progress value
        """
        self.current = min(current, self.total)  # Cap at total
        
        # Update the progress bar widget
        progress_bar = self.query_one(TextualProgressBar)
        progress_bar.update(progress=self.current)
        
        # Update the label
        percentage = int((self.current / self.total) * 100) if self.total > 0 else 0
        label_widget = self.query_one(".progress-label", Static)
        label_widget.update(
            f"[cyan]{self.label}[/cyan] [#A855F7]{percentage}%[/#A855F7]"
        )

    def set_total(self, total: float) -> None:
        """Update total value.
        
        Args:
            total: New total value
        """
        self.total = total
        progress_bar = self.query_one(TextualProgressBar)
        progress_bar.update(total=total)

# Made with Bob
