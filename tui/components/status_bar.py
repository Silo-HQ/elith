"""Status bar component - always visible at bottom."""

from textual.widgets import Static


class StatusBar(Static):
    """Bottom status bar showing mode, tokens, model status."""

    DEFAULT_CSS = """
    StatusBar {
        dock: bottom;
        height: 1;
        background: #1A1A1A;
        color: white;
        padding: 0 1;
    }

    StatusBar .status-left {
        color: #06B6D4;
    }

    StatusBar .status-center {
        color: #A855F7;
    }

    StatusBar .status-right {
        color: cyan;
    }
    """

    def __init__(self, mode: str = "Code", model: str = "bob", 
                 tokens_used: int = 0, auto_approve: str = "Edit") -> None:
        """Initialize status bar.
        
        Args:
            mode: Current mode (Code, Plan, etc.)
            model: Current model name
            tokens_used: Token usage percentage
            auto_approve: Auto-approve setting
        """
        super().__init__()
        self.mode = mode
        self.model = model
        self.tokens_used = tokens_used
        self.auto_approve = auto_approve
        self._update_display()

    def _update_display(self) -> None:
        """Update the status bar display."""
        self.update(
            f"[#06B6D4]Auto-approve: {self.auto_approve} (shift+tab)[/#06B6D4]  "
            f"[#A855F7]Tokens: {self.tokens_used}%[/#A855F7]  "
            f"[cyan]● {self.model.upper()}[/cyan]  "
            f"[white]Mode: {self.mode}[/white]"
        )

    def set_mode(self, mode: str) -> None:
        """Update mode."""
        self.mode = mode
        self._update_display()

    def set_model(self, model: str) -> None:
        """Update model."""
        self.model = model
        self._update_display()

    def set_tokens(self, tokens_used: int) -> None:
        """Update token usage."""
        self.tokens_used = tokens_used
        self._update_display()

    def set_auto_approve(self, auto_approve: str) -> None:
        """Update auto-approve setting."""
        self.auto_approve = auto_approve
        self._update_display()

# Made with Bob
