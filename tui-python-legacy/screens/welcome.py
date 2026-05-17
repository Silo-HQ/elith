"""
Welcome Screen - ASCII art logo + command reference
Matches Bob Shell welcome screen exactly
"""

from textual.app import ComposeResult
from textual.containers import Container, Vertical
from textual.screen import Screen
from textual.widgets import Static
from pyfiglet import Figlet


class WelcomeScreen(Screen):
    """Welcome screen with ASCII art and command list"""

    CSS = """
    WelcomeScreen {
        background: #0D1117;
        align: center middle;
    }

    #logo-container {
        width: 100%;
        height: auto;
        content-align: center middle;
    }

    #logo {
        color: #FFFFFF;
        text-align: center;
        width: 100%;
    }

    #version {
        color: #888888;
        text-align: center;
        margin-top: 1;
        margin-bottom: 2;
    }

    #commands {
        color: #00BFFF;
        text-align: center;
        margin-top: 2;
        margin-bottom: 2;
    }

    #status {
        color: #888888;
        text-align: center;
        margin-top: 2;
    }

    #repo-path {
        color: #FFFFFF;
        text-align: center;
        margin-top: 1;
        margin-bottom: 2;
    }

    #disclaimer {
        color: #888888;
        text-align: center;
        margin-top: 1;
    }

    .border-top {
        color: #888888;
        text-align: center;
    }

    .border-bottom {
        color: #888888;
        text-align: center;
    }
    """

    def compose(self) -> ComposeResult:
        """Create the welcome screen layout"""
        
        # Generate ASCII art logo
        fig = Figlet(font='banner3')
        logo_text = fig.renderText('ELITH')

        yield Container(
            Static("═" * 68, classes="border-top"),
            Static("Welcome to\n", id="welcome-text"),
            Static(logo_text, id="logo"),
            Static("── Version 1.0.0 ──", id="version"),
            Static(
                "\nHere are some helpful commands to get started:\n\n"
                "/repo         Set repository path\n"
                "/vault        Set Obsidian vault path\n"
                "/models       Configure AI providers\n"
                "/explain      Explain repository architecture\n"
                "/architect    Generate novel architecture proposals\n"
                "/test-gen     Generate missing tests\n"
                "/refactor     Refactor a module\n"
                "/document     Generate documentation\n"
                "/risk         Scan for risky files\n"
                "/settings     View and edit Elith settings\n",
                id="commands"
            ),
            Static("Sandbox mode  Disabled", id="sandbox-status"),
            Static("/path/to/your/repository", id="repo-path"),
            Static("Users should independently verify AI-generated content.", id="disclaimer"),
            Static("═" * 68, classes="border-bottom"),
            Static("Active models: Bob ●  Claude ●  Gemini ○  GPT ○  Local ○", id="model-status"),
            id="logo-container"
        )

    def on_key(self, event) -> None:
        """Handle key presses - any key moves to workspace"""
        if event.key == "enter":
            from screens.workspace import WorkspaceScreen
            self.app.push_screen(WorkspaceScreen())

# Made with Bob
