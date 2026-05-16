"""
Elith Style Definitions
Clean, professional styles inspired by OpenCode
"""

from rich.style import Style
from .theme import get_theme


def get_base_style() -> Style:
    """Base style with background and foreground"""
    theme = get_theme()
    return Style(bgcolor=theme.background, color=theme.text)


def get_primary_style() -> Style:
    """Primary purple style"""
    theme = get_theme()
    return Style(color=theme.primary, bold=True)


def get_secondary_style() -> Style:
    """Secondary style"""
    theme = get_theme()
    return Style(color=theme.secondary)


def get_muted_style() -> Style:
    """Muted text style"""
    theme = get_theme()
    return Style(color=theme.text_muted)


def get_error_style() -> Style:
    """Error style"""
    theme = get_theme()
    return Style(color=theme.error, bold=True)


def get_warning_style() -> Style:
    """Warning style"""
    theme = get_theme()
    return Style(color=theme.warning, bold=True)


def get_success_style() -> Style:
    """Success style"""
    theme = get_theme()
    return Style(color=theme.success, bold=True)


def get_info_style() -> Style:
    """Info style"""
    theme = get_theme()
    return Style(color=theme.info)


def get_border_style() -> str:
    """Get border color"""
    theme = get_theme()
    return theme.border_normal


def get_focused_border_style() -> str:
    """Get focused border color"""
    theme = get_theme()
    return theme.border_focused


def get_model_style(model_name: str) -> Style:
    """Get style for a specific model"""
    theme = get_theme()
    colors = {
        "bob": theme.model_bob,
        "claude": theme.model_claude,
        "gemini": theme.model_gemini,
        "gpt": theme.model_gpt,
        "local": theme.model_local,
    }
    color = colors.get(model_name.lower(), theme.text_muted)
    return Style(color=color, bold=True)

# Made with Bob
