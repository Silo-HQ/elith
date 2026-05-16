"""Results endpoint for session output."""
from fastapi import APIRouter, HTTPException
from typing import Dict, List, Optional
from ..session.manager import manager

router = APIRouter()


@router.get("/results/{session_id}")
async def get_results(session_id: str) -> Dict:
    """
    Get results for a completed session.
    
    Returns output, files changed, and report path.
    """
    session = manager.get_session(session_id)
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {
        "session_id": session.session_id,
        "model": session.model,
        "operation": session.operation,
        "status": session.status.value,
        "output": session.output,
        "files_changed": session.files_changed,
        "report_path": session.report_path,
        "created_at": session.created_at.isoformat(),
        "completed_at": session.completed_at.isoformat() if session.completed_at else None
    }

# Made with Bob
