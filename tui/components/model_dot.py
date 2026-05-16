"""Model status dot component."""

from textual.widgets import Static


class ModelDot(Static):
    """Display a colored status dot for a model."""

    DEFAULT_CSS = """
    ModelDot {
        width: auto;
        height: 1;
    }

    ModelDot.bob {
        color: #3B82F6;
    }

    ModelDot.claude {
        color: #F97316;
    }

    ModelDot.gemini {
        color: #06B6D4;
    }

    ModelDot.openai {
        color: #10B981;
    }

    ModelDot.ollama {
        color: #8B5CF6;
    }

    ModelDot.running {
        text-style: bold;
    }

    ModelDot.done {
        color: #10B981;
    }

    ModelDot.error {
        color: #EF4444;
    }
    """

    def __init__(self, model: str, status: str = "idle") -> None:
        """Initialize model dot.
        
        Args:
            model: Model name (bob, claude, gemini, openai, ollama)
            status: Status (idle, running, done, error)
        """
        super().__init__()
        self.model = model.lower()
        self.status = status
        self._update_display()

    def _update_display(self) -> None:
        """Update the dot display based on status."""
        # Set model-specific class
        self.add_class(self.model)
        
        # Set status class
        if self.status == "running":
            self.add_class("running")
            self.update(f"● {self.model.upper()}")
        elif self.status == "done":
            self.add_class("done")
            self.update(f"● {self.model.upper()}")
        elif self.status == "error":
            self.add_class("error")
            self.update(f"● {self.model.upper()}")
        else:  # idle
            self.update(f"○ {self.model.upper()}")

    def set_status(self, status: str) -> None:
        """Update model status.
        
        Args:
            status: New status (idle, running, done, error)
        """
        # Remove old status classes
        self.remove_class("running")
        self.remove_class("done")
        self.remove_class("error")
        
        self.status = status
        self._update_display()

# Made with Bob
