"""Models endpoint for available AI providers."""
from fastapi import APIRouter
from typing import Dict, List

router = APIRouter()


@router.get("/models")
async def get_models() -> Dict[str, List[str]]:
    """
    Get list of available and configured models.
    
    Returns which AI providers are available for use.
    """
    # TODO: Check actual provider configuration
    # For now, return placeholder list
    return {
        "available": ["bob", "claude", "gemini", "openai", "ollama"],
        "configured": []  # Will be populated based on API keys
    }

# Made with Bob
