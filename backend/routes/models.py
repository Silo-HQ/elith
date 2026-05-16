"""Models endpoint for available AI providers."""
from fastapi import APIRouter
from typing import Dict, List
from ..router.model_router import router as model_router

router = APIRouter()


@router.get("/models")
async def get_models() -> Dict[str, List[str]]:
    """
    Get list of available and configured models.
    
    Returns which AI providers are available for use.
    """
    # Get actual configured models from router
    available = model_router.get_available_models()
    configured = model_router.get_configured_models()
    
    return {
        "available": available,
        "configured": configured
    }

# Made with Bob
