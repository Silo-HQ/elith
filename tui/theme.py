"""
Elith Theme System
Inspired by OpenCode's clean theme architecture with Elith purple accents
"""

from dataclasses import dataclass
from typing import Tuple


@dataclass
class ElithTheme:
    """Elith color theme - clean, professional, purple accents"""
    
    # Background colors
    background: str = "#0A0A0A"  # Pure black
    background_secondary: str = "#121212"  # Slightly lighter
    background_darker: str = "#000000"  # Absolute black
    
    # Text colors
    text: str = "#FFFFFF"  # Pure white
    text_muted: str = "#888888"  # Dim gray
    text_emphasized: str = "#E0E0E0"  # Bright white
    
    # Brand colors
    primary: str = "#A855F7"  # Purple (Elith brand)
    secondary: str = "#8B5CF6"  # Darker purple
    accent: str = "#C084FC"  # Light purple
    
    # Status colors
    error: str = "#EF4444"  # Red
    warning: str = "#F59E0B"  # Orange
    success: str = "#10B981"  # Green
    info: str = "#3B82F6"  # Blue
    
    # Border colors
    border_normal: str = "#27272A"  # Dark gray
    border_focused: str = "#A855F7"  # Purple (matches primary)
    border_dim: str = "#18181B"  # Very dark gray
    
    # Model-specific colors (for status dots)
    model_bob: str = "#A855F7"  # Purple
    model_claude: str = "#D97706"  # Amber
    model_gemini: str = "#3B82F6"  # Blue
    model_gpt: str = "#10B981"  # Green
    model_local: str = "#6B7280"  # Gray


# Global theme instance
_current_theme = ElithTheme()


def get_theme() -> ElithTheme:
    """Get the current theme"""
    return _current_theme


def set_theme(theme: ElithTheme) -> None:
    """Set a new theme"""
    global _current_theme
    _current_theme = theme

# Made with Bob
