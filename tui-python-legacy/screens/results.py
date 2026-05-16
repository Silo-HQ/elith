"""Results screen for displaying session results."""

from textual.app import ComposeResult
from textual.screen import Screen
from textual.containers import Container, Vertical
from textual.widgets import Header, Footer, Static

from ..components.status_bar import StatusBar
from ..components.model_dot import ModelDot


class ResultsScreen(Screen):
    """Screen for displaying session results and summary."""

    BINDINGS = [
        ("n", "new_task", "New Task"),
        ("v", "view_diff", "View Diff"),
        ("e", "export", "Export Report"),
        ("escape", "back", "Back"),
        ("ctrl+c", "quit", "Quit"),
    ]

    DEFAULT_CSS = """
    ResultsScreen {
        background: #0A0A0A;
    }

    ResultsScreen .results-header {
        height: 3;
        border: solid cyan;
        padding: 1;
        margin-bottom: 1;
    }

    ResultsScreen .results-title {
        color: cyan;
        text-style: bold;
    }

    ResultsScreen .section {
        border: solid white;
        padding: 1;
        margin: 1;
    }

    ResultsScreen .section-title {
        color: #A855F7;
        text-style: bold;
        margin-bottom: 1;
    }

    ResultsScreen .file-change {
        color: #10B981;
    }

    ResultsScreen .why-text {
        color: white;
    }

    ResultsScreen .stat {
        color: #06B6D4;
    }

    ResultsScreen .keyboard-hint {
        color: #A855F7;
        text-style: bold;
        text-align: center;
        margin: 1;
    }

    ResultsScreen .success-message {
        color: #10B981;
        text-style: bold;
        text-align: center;
        margin: 1;
    }
    """

    def __init__(self, session_data: dict | None = None) -> None:
        """Initialize results screen.
        
        Args:
            session_data: Session results data
        """
        super().__init__()
        self.session_data = session_data or self._get_mock_results()

    def _get_mock_results(self) -> dict:
        """Get mock results for testing."""
        return {
            "session_id": "sess_12345",
            "operation": "architect",
            "duration": "2m 34s",
            "files_changed": [
                {"path": "auth/views.py", "action": "Modified", "lines": "+45 -12"},
                {"path": "auth/models.py", "action": "Modified", "lines": "+23 -5"},
                {"path": "auth/tokens.py", "action": "Created", "lines": "+67"},
                {"path": "requirements.txt", "action": "Modified", "lines": "+2"},
            ],
            "why": "Implemented JWT + Redis hybrid authentication to enable immediate token revocation while maintaining stateless verification for read operations. This addresses the security requirement in auth/views.py:L142 without the overhead of a JWT blocklist.",
            "models_used": ["bob", "claude"],
            "context_stats": {
                "files_loaded": 6,
                "total_files": 312,
                "vault_notes": 3,
                "tokens_saved": 4200
            },
            "bob_report_path": "bob_sessions/session_12345.md"
        }

    def compose(self) -> ComposeResult:
        """Compose the results screen layout."""
        yield Header()
        
        # Results header
        yield Container(
            Static(
                "[cyan]═══ SESSION COMPLETE ═══[/cyan]",
                classes="results-title"
            ),
            classes="results-header"
        )

        # Success message
        yield Static(
            f"[#10B981]✓ {self.session_data['operation'].upper()} completed in {self.session_data['duration']}[/#10B981]",
            classes="success-message"
        )

        # Files changed section
        yield Container(
            Static("[#A855F7]Files Changed:[/#A855F7]", classes="section-title"),
            *[
                Static(
                    f"  [#10B981]{change['action']}[/#10B981] {change['path']} ({change['lines']})",
                    classes="file-change"
                )
                for change in self.session_data["files_changed"]
            ],
            classes="section"
        )

        # Why section
        yield Container(
            Static("[#A855F7]Why:[/#A855F7]", classes="section-title"),
            Static(f"  {self.session_data['why']}", classes="why-text"),
            classes="section"
        )

        # Models used section
        yield Container(
            Static("[#A855F7]Models Used:[/#A855F7]", classes="section-title"),
            *[ModelDot(model, status="done") for model in self.session_data["models_used"]],
            classes="section"
        )

        # Context efficiency section
        stats = self.session_data["context_stats"]
        yield Container(
            Static("[#A855F7]Context Efficiency:[/#A855F7]", classes="section-title"),
            Static(
                f"  [#06B6D4]Files loaded: {stats['files_loaded']} / {stats['total_files']}[/#06B6D4]",
                classes="stat"
            ),
            Static(
                f"  [#06B6D4]Vault notes: {stats['vault_notes']}[/#06B6D4]",
                classes="stat"
            ),
            Static(
                f"  [#06B6D4]Token savings: ~{stats['tokens_saved']:,}[/#06B6D4]",
                classes="stat"
            ),
            classes="section"
        )

        # Bob report section
        yield Container(
            Static("[#A855F7]Bob Report:[/#A855F7]", classes="section-title"),
            Static(
                f"  [#06B6D4]Saved to: {self.session_data['bob_report_path']}[/#06B6D4]",
                classes="stat"
            ),
            classes="section"
        )

        # Keyboard hints
        yield Static(
            "[#A855F7][N] New Task  |  [V] View Diff  |  [E] Export Report[/#A855F7]",
            classes="keyboard-hint"
        )

        yield StatusBar(
            mode="Results",
            model="bob",
            tokens_used=89,
            auto_approve="Edit"
        )
        yield Footer()

    def action_new_task(self) -> None:
        """Start a new task."""
        # Go back to workspace screen
        self.app.pop_screen()

    def action_view_diff(self) -> None:
        """View the diff of changes."""
        # In a real implementation, this would show a diff view
        pass

    def action_export(self) -> None:
        """Export the session report."""
        # In a real implementation, this would export the report
        pass

    def action_back(self) -> None:
        """Go back to workspace screen."""
        self.app.pop_screen()

    def action_quit(self) -> None:
        """Quit the application."""
        self.app.exit()

# Made with Bob
