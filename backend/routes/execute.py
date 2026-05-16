"""Execute endpoint for starting operations."""
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime
from ..session.manager import manager
from ..session.logger import logger
from ..models.session import SessionStatus
from ..context_engine.repo_scanner import RepoScanner
from ..context_engine.vault_reader import VaultReader
from ..context_engine.packet_builder import PacketBuilder
from ..models.task_packet import TaskPacket
from ..router.model_router import router as model_router
from ..operations import explain, architect, test_gen, refactor

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
    
    # Add background task to run the operation
    background_tasks.add_task(run_operation, session_id, request)
    
    return ExecuteResponse(
        session_id=session_id,
        status=session.status.value
    )


async def run_operation(session_id: str, request: ExecuteRequest):
    """
    Background task to run the operation.
    
    Builds context packet, routes to provider, streams output.
    """
    try:
        manager.update_status(session_id, SessionStatus.RUNNING)
        await manager.add_output(session_id, f"Starting {request.operation} operation...\n")
        
        # 1. Scan repository and vault
        await manager.add_output(session_id, "Scanning repository...\n")
        scanner = RepoScanner(request.repo_path)
        files = scanner.scan()
        
        vault_reader = VaultReader(request.vault_path)
        notes = vault_reader.read_notes()
        
        # 2. Build task packet
        task_packet = TaskPacket(
            repo_path=request.repo_path,
            vault_path=request.vault_path,
            files=files,
            vault_notes=notes,
            total_files=len(files)
        )
        
        # 3. Build minimal context for operation
        await manager.add_output(session_id, f"Building context (loading {len(files)} files)...\n")
        packet_builder = PacketBuilder(task_packet)
        context_data = packet_builder.build_context(request.operation)
        
        await manager.add_output(
            session_id,
            f"Context ready: {context_data['files_loaded']} of {context_data['total_files']} files selected\n"
        )
        
        # 4. Get operation prompt
        operation_map = {
            "explain": explain.build_explain_prompt,
            "architect": architect.build_architect_prompt,
            "test-gen": test_gen.build_test_gen_prompt,
            "refactor": refactor.build_refactor_prompt,
        }
        
        if request.operation not in operation_map:
            raise ValueError(f"Unknown operation: {request.operation}")
        
        prompt = operation_map[request.operation](context_data['context'])
        
        # 5. Route to provider and stream output
        await manager.add_output(session_id, f"Executing with {request.model}...\n\n")
        
        for chunk in model_router.route(request.model, prompt, context_data['context']):
            await manager.add_output(session_id, chunk)
        
        # 6. Mark complete and log
        manager.update_status(session_id, SessionStatus.COMPLETED)
        session = manager.get_session(session_id)
        if session:
            session.completed_at = datetime.utcnow()
            report_path = logger.log_session(session)
            session.report_path = report_path
            await manager.add_output(session_id, f"\n\nSession report: {report_path}\n")
            
    except Exception as e:
        manager.update_status(session_id, SessionStatus.ERROR)
        await manager.add_output(session_id, f"\n\nError: {str(e)}\n")

# Made with Bob
