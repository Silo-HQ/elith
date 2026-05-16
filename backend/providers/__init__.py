"""Provider initialization and registry."""
import os
from typing import Dict, Optional
from .base_provider import BaseProvider
from .claude_provider import ClaudeProvider
from .lmstudio_provider import LMStudioProvider


def initialize_providers(repo_path: str) -> Dict[str, BaseProvider]:
    """
    Initialize all configured providers.
    
    Args:
        repo_path: Path to the repository
        
    Returns:
        Dictionary of provider name -> provider instance
    """
    providers = {}
    
    # Claude provider
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")
    if anthropic_key:
        try:
            providers["claude"] = ClaudeProvider(repo_path, anthropic_key)
        except Exception as e:
            print(f"Warning: Failed to initialize Claude provider: {e}")
    
    # LM Studio provider (always available if running)
    try:
        lmstudio = LMStudioProvider(repo_path)
        if lmstudio.is_configured():
            providers["lmstudio"] = lmstudio
    except Exception as e:
        print(f"Warning: Failed to initialize LM Studio provider: {e}")
    
    return providers


__all__ = [
    "BaseProvider",
    "ClaudeProvider",
    "LMStudioProvider",
    "initialize_providers",
]

# Made with Bob
