"""Execute endpoint for starting operations."""
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
import uuid
from ..session.manager import manager
from ..session.logger import logger
from ..models.session import SessionStatus

router = APIRouter()


class ExecuteRequest(BaseModel):
    """Request model for execute endpoint."""
    model: str
    operation: str
    repo_path: str
    vault_path: Optional[str] = None


class ExecuteResponse(BaseModel):
    """Response model for execute endpoint."""
    session_id: str
    status: str


@router.post("/execute")
async def execute_operation(
    request: ExecuteRequest,
    background_tasks: BackgroundTasks
) -> ExecuteResponse:
    """
    Start an operation execution.
    
    Returns session_id for tracking progress via /stream endpoint.
    """
    # Generate session ID
    session_id = str(uuid.uuid4())
    
    # Create session
    session = manager.create_session(
        session_id=session_id,
        model=request.model,
        operation=request.operation,
        repo_path=request.repo_path,
        vault_path=request.vault_path
    )
    
    # TODO: Add background task to actually run the operation
    # For now, just mark as pending
    # background_tasks.add_task(run_operation, session_id, request)
    
    return ExecuteResponse(
        session_id=session_id,
        status=session.status.value
    )


async def run_operation(session_id: str, request: ExecuteRequest):
    """
    Background task to run the operation.
    
    This will be implemented when providers are ready.
    """
    try:
        manager.update_status(session_id, SessionStatus.RUNNING)
        
        # TODO: 
        # 1. Build context packet
        # 2. Route to appropriate provider
        # 3. Stream output to session
        # 4. Log session report
        
        await manager.add_output(session_id, "Operation started...\n")
        
        manager.update_status(session_id, SessionStatus.COMPLETED)
        
        # Log session
        session = manager.get_session(session_id)
        if session:
            report_path = logger.log_session(session)
            session.report_path = report_path
            
    except Exception as e:
        manager.update_status(session_id, SessionStatus.ERROR)
        await manager.add_output(session_id, f"Error: {str(e)}\n")

# Made with Bob
