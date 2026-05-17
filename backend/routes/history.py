"""History endpoints for retrieving past sessions."""
from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from ..session.history import history

router = APIRouter()


class HistoryEntry(BaseModel):
    """History entry response model."""
    session_id: str
    model: str
    operation: str
    repo_path: str
    vault_path: Optional[str]
    status: str
    created_at: str
    completed_at: Optional[str]
    report_path: Optional[str]
    files_changed: List[str]
    output_preview: str


class HistoryResponse(BaseModel):
    """History list response."""
    sessions: List[HistoryEntry]
    total: int


@router.get("/history")
async def get_history(
    limit: int = Query(50, ge=1, le=100),
    model: Optional[str] = None,
    operation: Optional[str] = None,
    status: Optional[str] = None
) -> HistoryResponse:
    """
    Get session history with optional filters.
    
    Query parameters:
    - limit: Maximum number of sessions to return (1-100, default 50)
    - model: Filter by model name
    - operation: Filter by operation type
    - status: Filter by status (pending, running, completed, error)
    """
    if model or operation or status:
        sessions = history.search_history(
            model=model,
            operation=operation,
            status=status,
            limit=limit
        )
    else:
        sessions = history.get_history(limit=limit)
    
    return HistoryResponse(
        sessions=[HistoryEntry(**s) for s in sessions],
        total=len(sessions)
    )


@router.get("/history/{session_id}")
async def get_session_history(session_id: str) -> Optional[HistoryEntry]:
    """Get a specific session from history."""
    session = history.get_session(session_id)
    if session:
        return HistoryEntry(**session)
    return None


@router.delete("/history")
async def clear_history() -> Dict[str, str]:
    """Clear all session history."""
    history.clear_history()
    return {"status": "cleared", "message": "Session history cleared"}


# Made with Bob