"""Proposal box component for displaying architecture proposals."""

from textual.app import ComposeResult
from textual.containers import Container
from textual.widgets import Static


class ProposalBox(Static):
    """Display a single architecture proposal with details."""

    DEFAULT_CSS = """
    ProposalBox {
        height: auto;
        border: solid white;
        padding: 1;
        margin: 1;
    }

    ProposalBox.recommended {
        border: solid cyan;
    }

    ProposalBox .proposal-header {
        color: cyan;
        text-style: bold;
    }

    ProposalBox .recommended-badge {
        color: cyan;
        text-style: bold;
    }

    ProposalBox .section-title {
        color: #A855F7;
        text-style: bold;
    }

    ProposalBox .proposal-text {
        color: white;
    }

    ProposalBox .pro {
        color: #10B981;
    }

    ProposalBox .con {
        color: #EF4444;
    }

    ProposalBox .migration-step {
        color: #06B6D4;
    }
    """

    def __init__(self, proposal_id: str, name: str, recommended: bool = False,
                 why_not_standard: str = "", proposal: str = "",
                 pros: list[str] | None = None, cons: list[str] | None = None,
                 migration_steps: list[str] | None = None) -> None:
        """Initialize proposal box with data.
        
        Args:
            proposal_id: Proposal identifier (A, B, etc.)
            name: Proposal name
            recommended: Whether this is the recommended option
            why_not_standard: Explanation of why standard approach doesn't work
            proposal: Proposal description
            pros: List of advantages
            cons: List of disadvantages
            migration_steps: List of migration steps
        """
        super().__init__()
        self.proposal_id = proposal_id
        self.name = name
        self.recommended = recommended
        self.why_not_standard = why_not_standard
        self.proposal = proposal
        self.pros = pros or []
        self.cons = cons or []
        self.migration_steps = migration_steps or []

    def compose(self) -> ComposeResult:
        """Compose the proposal box layout."""
        # Add recommended class if applicable
        if self.recommended:
            self.add_class("recommended")

        header = f"[cyan]Option {self.proposal_id}: {self.name}[/cyan]"
        if self.recommended:
            header += " [cyan][RECOMMENDED][/cyan]"

        yield Container(
            Static(header, classes="proposal-header"),
            Static(""),  # Blank line
            Static("[#A855F7]Why not standard:[/#A855F7]", classes="section-title"),
            Static(f"  {self.why_not_standard}", classes="proposal-text"),
            Static(""),  # Blank line
            Static("[#A855F7]Proposal:[/#A855F7]", classes="section-title"),
            Static(f"  {self.proposal}", classes="proposal-text"),
            Static(""),  # Blank line
            Static("[#A855F7]Tradeoffs:[/#A855F7]", classes="section-title"),
            *[Static(f"  [#10B981]✓[/#10B981] {pro}", classes="pro") for pro in self.pros],
            *[Static(f"  [#EF4444]✗[/#EF4444] {con}", classes="con") for con in self.cons],
            Static(""),  # Blank line
            Static("[#A855F7]Migration:[/#A855F7]", classes="section-title"),
            *[Static(f"  {i+1}. {step}", classes="migration-step") 
              for i, step in enumerate(self.migration_steps)],
            Static(""),  # Blank line
            Static(f"[cyan][{self.proposal_id}][/cyan] Implement this option", 
                   classes="proposal-text"),
        )

# Made with Bob
