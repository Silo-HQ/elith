"""Tasks endpoint for available operations."""
from fastapi import APIRouter
from typing import List, Dict

router = APIRouter()


@router.get("/tasks")
async def get_tasks() -> Dict[str, List[str]]:
    """
    Get list of available operations.
    
    Returns available task types that can be executed.
    """
    return {
        "operations": [
            "explain",
            "architect",
            "test-gen",
            "refactor"
        ]
    }

# Made with Bob
