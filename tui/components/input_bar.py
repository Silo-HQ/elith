"""Input bar component with yellow border."""

from textual.widgets import Input


class InputBar(Input):
    """Yellow-bordered input bar with cursor."""

    DEFAULT_CSS = """
    InputBar {
        border: solid yellow;
        height: 3;
        padding: 0 1;
    }

    InputBar:focus {
        border: solid yellow;
    }
    """

    def __init__(self, placeholder: str = "> │ ") -> None:
        """Initialize input bar.
        
        Args:
            placeholder: Placeholder text
        """
        super().__init__(placeholder=placeholder)

# Made with Bob
