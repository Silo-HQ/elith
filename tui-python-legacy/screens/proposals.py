"""Proposals screen for displaying architecture proposals."""

from textual.app import ComposeResult
from textual.screen import Screen
from textual.containers import Container, Vertical
from textual.widgets import Header, Footer, Static

from ..components.status_bar import StatusBar
from ..components.proposal_box import ProposalBox


class ProposalsScreen(Screen):
    """Screen for displaying and selecting architecture proposals."""

    BINDINGS = [
        ("a", "select_a", "Implement A"),
        ("b", "select_b", "Implement B"),
        ("escape", "back", "Back"),
        ("ctrl+c", "quit", "Quit"),
    ]

    DEFAULT_CSS = """
    ProposalsScreen {
        background: #0A0A0A;
    }

    ProposalsScreen .proposals-header {
        height: 3;
        border: solid cyan;
        padding: 1;
        margin-bottom: 1;
    }

    ProposalsScreen .proposals-title {
        color: cyan;
        text-style: bold;
    }

    ProposalsScreen .proposals-container {
        height: auto;
    }

    ProposalsScreen .keyboard-hint {
        color: #A855F7;
        text-style: bold;
        text-align: center;
        margin: 1;
    }
    """

    def __init__(self, proposals: list[dict] | None = None) -> None:
        """Initialize proposals screen.
        
        Args:
            proposals: List of proposal dictionaries
        """
        super().__init__()
        self.proposals = proposals or self._get_mock_proposals()

    def _get_mock_proposals(self) -> list[dict]:
        """Get mock proposals for testing."""
        return [
            {
                "id": "A",
                "name": "JWT + Redis Session Hybrid",
                "recommended": True,
                "why_not_standard": "auth/views.py:L142 requires immediate token revocation. Pure JWT cannot revoke without blocklist overhead.",
                "proposal": "Short-lived JWT (15min) + Redis-backed refresh tokens. Matches your security-notes.md requirements exactly.",
                "pros": ["Immediate revocation", "Stateless verification (fast reads)"],
                "cons": ["Redis dependency added"],
                "migration_steps": [
                    "Add Redis to requirements",
                    "Update token model",
                    "Refactor session endpoints"
                ]
            },
            {
                "id": "B",
                "name": "OAuth2 + PKCE Flow",
                "recommended": False,
                "why_not_standard": "Your security-notes.md flags CSRF risk in current flow. PKCE eliminates this without server-side state.",
                "proposal": "Full OAuth2 with PKCE. Stateless, secure, industry standard for your threat model.",
                "pros": ["Stateless", "Secure against CSRF"],
                "cons": ["Frontend changes required", "More complex client"],
                "migration_steps": [
                    "Update auth endpoints",
                    "Add PKCE verifier",
                    "Update frontend",
                    "Update tests",
                    "Documentation"
                ]
            }
        ]

    def compose(self) -> ComposeResult:
        """Compose the proposals screen layout."""
        yield Header()
        
        # Proposals header
        yield Container(
            Static(
                "[cyan]═══ ARCHITECTURE PROPOSALS ═══[/cyan]",
                classes="proposals-title"
            ),
            classes="proposals-header"
        )

        # Keyboard hints
        yield Static(
            "[#A855F7]Press [A] to implement Option A  |  Press [B] to implement Option B[/#A855F7]",
            classes="keyboard-hint"
        )

        # Proposal boxes
        yield Vertical(
            *[
                ProposalBox(
                    proposal_id=p["id"],
                    name=p["name"],
                    recommended=p["recommended"],
                    why_not_standard=p["why_not_standard"],
                    proposal=p["proposal"],
                    pros=p["pros"],
                    cons=p["cons"],
                    migration_steps=p["migration_steps"]
                )
                for p in self.proposals
            ],
            classes="proposals-container"
        )

        yield StatusBar(
            mode="Proposals",
            model="bob",
            tokens_used=67,
            auto_approve="Edit"
        )
        yield Footer()

    def action_select_a(self) -> None:
        """Implement proposal A."""
        # In a real implementation, this would trigger execution
        self.app.push_screen("execution")

    def action_select_b(self) -> None:
        """Implement proposal B."""
        # In a real implementation, this would trigger execution
        self.app.push_screen("execution")

    def action_back(self) -> None:
        """Go back to workspace screen."""
        self.app.pop_screen()

    def action_quit(self) -> None:
        """Quit the application."""
        self.app.exit()

# Made with Bob
