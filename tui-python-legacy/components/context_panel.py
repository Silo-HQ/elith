"""Context panel component for displaying loaded files and vault notes."""

from textual.app import ComposeResult
from textual.containers import Container
from textual.widgets import Static


class ContextPanel(Static):
    """Display context information: loaded files, vault notes, token savings."""

    DEFAULT_CSS = """
    ContextPanel {
        height: auto;
        border: solid cyan;
        padding: 1;
        margin-bottom: 1;
    }

    ContextPanel .context-header {
        color: cyan;
        text-style: bold;
    }

    ContextPanel .context-stat {
        color: white;
    }

    ContextPanel .context-file {
        color: #A855F7;
    }

    ContextPanel .context-note {
        color: #06B6D4;
    }

    ContextPanel .token-savings {
        color: #10B981;
        text-style: bold;
    }
    """

    def __init__(self, loaded_files: list[str] = None, total_files: int = 0,
                 vault_notes: list[str] = None, tokens_saved: int = 0) -> None:
        """Initialize context panel with data.
        
        Args:
            loaded_files: List of loaded file paths
            total_files: Total number of files in repo
            vault_notes: List of vault note names
            tokens_saved: Number of tokens saved vs full load
        """
        super().__init__()
        self.loaded_files = loaded_files or []
        self.total_files = total_files
        self.vault_notes = vault_notes or []
        self.tokens_saved = tokens_saved

    def compose(self) -> ComposeResult:
        """Compose the context panel layout."""
        yield Container(
            Static("[cyan]═══ CONTEXT ═══[/cyan]", classes="context-header"),
            Static(
                f"[white]Files loaded: [/white][#A855F7]{len(self.loaded_files)}[/#A855F7]"
                f"[white] / {self.total_files}[/white]",
                classes="context-stat"
            ),
            *[Static(f"  [#A855F7]→[/#A855F7] {file}", classes="context-file") 
              for file in self.loaded_files[:6]],  # Show max 6 files
            Static(
                f"[white]Vault notes: [/white][#06B6D4]{len(self.vault_notes)}[/#06B6D4]",
                classes="context-stat"
            ),
            *[Static(f"  [#06B6D4]•[/#06B6D4] {note}", classes="context-note") 
              for note in self.vault_notes],
            Static(
                f"[#10B981]Token savings: ~{self.tokens_saved:,} vs full load[/#10B981]",
                classes="token-savings"
            ),
        )

    def update_context(self, loaded_files: list[str] = None, total_files: int = None,
                      vault_notes: list[str] = None, tokens_saved: int = None) -> None:
        """Update context panel data.
        
        Args:
            loaded_files: New list of loaded files
            total_files: New total file count
            vault_notes: New list of vault notes
            tokens_saved: New token savings count
        """
        if loaded_files is not None:
            self.loaded_files = loaded_files
        if total_files is not None:
            self.total_files = total_files
        if vault_notes is not None:
            self.vault_notes = vault_notes
        if tokens_saved is not None:
            self.tokens_saved = tokens_saved
        
        # Refresh the display
        self.refresh()

# Made with Bob
