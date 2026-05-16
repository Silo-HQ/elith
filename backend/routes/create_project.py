"""
Create Project endpoint - Multi-agent project creation
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from fastapi.responses import StreamingResponse
import os
import json

from ..agents.orchestrator import AgentOrchestrator
from ..providers.openrouter_provider import OpenRouterProvider

router = APIRouter()


class CreateProjectRequest(BaseModel):
    """Request model for project creation"""
    project_type: str
    requirements: str
    tech_stack: Optional[List[str]] = None
    constraints: Optional[Dict[str, Any]] = None
    model: str = "openrouter"


@router.post("/create-project")
async def create_project(request: CreateProjectRequest):
    """
    Create a production-level project using multi-agent collaboration.
    
    This endpoint orchestrates multiple specialized agents (CTO, Frontend, Backend,
    DevOps, Security, QA, Data) to analyze requirements and generate production-ready code.
    
    Returns:
        Streaming response with agent outputs and generated code
    """
    repo_path = os.getcwd()
    
    # Initialize provider
    if request.model == "openrouter":
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=400,
                detail="OPENROUTER_API_KEY not set in environment"
            )
        openrouter_model = os.getenv("OPENROUTER_MODEL", "openai/gpt-3.5-turbo")
        provider = OpenRouterProvider(repo_path, api_key, model=openrouter_model)
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Model {request.model} not supported for multi-agent creation"
        )
    
    # Initialize orchestrator
    orchestrator = AgentOrchestrator(provider, repo_path)
    
    # Stream project creation
    async def generate():
        try:
            for chunk in orchestrator.create_project(
                project_type=request.project_type,
                requirements=request.requirements,
                tech_stack=request.tech_stack,
                constraints=request.constraints
            ):
                yield f"data: {json.dumps({'chunk': chunk})}\n\n"
            
            yield f"data: {json.dumps({'done': True})}\n\n"
        
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream"
    )


# Made with Bob