"""Chat endpoint for TUI integration."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, AsyncGenerator
from fastapi.responses import StreamingResponse
import os
import json
import re
from ..providers.claude_provider import ClaudeProvider
from ..providers.lmstudio_provider import LMStudioProvider
from ..providers.openrouter_provider import OpenRouterProvider
from ..agents.orchestrator import AgentOrchestrator

router = APIRouter()


class ChatRequest(BaseModel):
    """Request model for chat endpoint."""
    message: str
    model: str = "claude"
    repo_path: Optional[str] = None


class ChatResponse(BaseModel):
    """Response model for chat endpoint."""
    response: str
    model: str


def _is_project_creation_request(message: str) -> bool:
    """Detect if message is requesting project creation"""
    creation_keywords = [
        # Broad patterns - match create/build/etc + anything + app/application/etc
        r'(create|build|develop|make|generate)\s+.*(app|application|project|system|platform|service|microservice)',
    ]
    
    # Exclude patterns that are NOT project creation
    exclude_patterns = [
        r'how\s+(do|to|can)',  # "how do I create..."
        r'what\s+is',          # "what is..."
        r'explain',            # "explain..."
        r'create\s+a\s+(function|class|method|variable)',  # code-level creation
    ]
    
    message_lower = message.lower()
    
    # Check if it matches creation pattern
    matches_creation = any(re.search(pattern, message_lower) for pattern in creation_keywords)
    
    # Check if it matches exclusion pattern
    matches_exclusion = any(re.search(pattern, message_lower) for pattern in exclude_patterns)
    
    return matches_creation and not matches_exclusion


@router.post("/chat")
async def chat(request: ChatRequest):
    """
    Smart chat endpoint that routes to appropriate handler.
    
    - Detects project creation requests → Multi-agent system
    - Regular questions → Single provider
    """
    # Use current directory if no repo_path provided
    repo_path = request.repo_path or os.getcwd()
    
    # Check if this is a project creation request
    if _is_project_creation_request(request.message):
        # Route to multi-agent system
        try:
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
                    detail="Multi-agent creation only supports OpenRouter currently"
                )
            
            # Initialize orchestrator
            orchestrator = AgentOrchestrator(provider, repo_path)
            
            # Extract project details from message
            project_type = "application"  # Default
            requirements = request.message
            
            # Generate project
            response_text = ""
            for chunk in orchestrator.create_project(
                project_type=project_type,
                requirements=requirements,
                tech_stack=[],
                constraints={}
            ):
                response_text += chunk
            
            return ChatResponse(
                response=response_text,
                model=f"{request.model} (multi-agent)"
            )
        
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error in multi-agent creation: {str(e)}"
            )
    
    # Regular chat - single provider
    try:
        # Initialize provider based on model
        if request.model == "claude":
            api_key = os.getenv("ANTHROPIC_API_KEY")
            if not api_key:
                raise HTTPException(
                    status_code=400,
                    detail="ANTHROPIC_API_KEY not set in environment"
                )
            provider = ClaudeProvider(repo_path, api_key)
        elif request.model == "lmstudio":
            base_url = os.getenv("LMSTUDIO_BASE_URL", "http://localhost:1234/v1")
            provider = LMStudioProvider(repo_path, base_url=base_url)
        elif request.model == "openrouter":
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
                detail=f"Unknown model: {request.model}"
            )
        
        # Get response from provider
        response_text = ""
        for chunk in provider.run(request.message, ""):
            response_text += chunk
        
        return ChatResponse(
            response=response_text,
            model=request.model
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing chat: {str(e)}"
        )


@router.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """
    Streaming chat endpoint for TUI.
    
    Streams response chunks as they arrive from provider.
    Supports both regular chat and multi-agent project creation.
    """
    # Use current directory if no repo_path provided
    repo_path = request.repo_path or os.getcwd()
    
    async def generate() -> AsyncGenerator[str, None]:
        """Generate streaming response."""
        try:
            # Check if this is a project creation request
            if _is_project_creation_request(request.message):
                # Multi-agent system
                if request.model == "openrouter":
                    api_key = os.getenv("OPENROUTER_API_KEY")
                    if not api_key:
                        yield f"data: {json.dumps({'error': 'OPENROUTER_API_KEY not set'})}\n\n"
                        return
                    openrouter_model = os.getenv("OPENROUTER_MODEL", "openai/gpt-3.5-turbo")
                    provider = OpenRouterProvider(repo_path, api_key, model=openrouter_model)
                else:
                    yield f"data: {json.dumps({'error': 'Multi-agent creation only supports OpenRouter'})}\n\n"
                    return
                
                # Initialize orchestrator
                orchestrator = AgentOrchestrator(provider, repo_path)
                
                # Stream project creation
                for chunk in orchestrator.create_project(
                    project_type="application",
                    requirements=request.message,
                    tech_stack=[],
                    constraints={}
                ):
                    yield f"data: {json.dumps({'chunk': chunk, 'model': 'multi-agent'})}\n\n"
                
                yield f"data: {json.dumps({'done': True, 'model': 'multi-agent'})}\n\n"
            
            else:
                # Regular chat - single provider
                if request.model == "claude":
                    api_key = os.getenv("ANTHROPIC_API_KEY")
                    if not api_key:
                        yield f"data: {json.dumps({'error': 'ANTHROPIC_API_KEY not set'})}\n\n"
                        return
                    provider = ClaudeProvider(repo_path, api_key)
                elif request.model == "lmstudio":
                    base_url = os.getenv("LMSTUDIO_BASE_URL", "http://localhost:1234/v1")
                    provider = LMStudioProvider(repo_path, base_url=base_url)
                elif request.model == "openrouter":
                    api_key = os.getenv("OPENROUTER_API_KEY")
                    if not api_key:
                        yield f"data: {json.dumps({'error': 'OPENROUTER_API_KEY not set'})}\n\n"
                        return
                    openrouter_model = os.getenv("OPENROUTER_MODEL", "openai/gpt-3.5-turbo")
                    provider = OpenRouterProvider(repo_path, api_key, model=openrouter_model)
                else:
                    yield f"data: {json.dumps({'error': f'Unknown model: {request.model}'})}\n\n"
                    return
                
                # Stream response from provider
                for chunk in provider.run(request.message, ""):
                    yield f"data: {json.dumps({'chunk': chunk, 'model': request.model})}\n\n"
                
                yield f"data: {json.dumps({'done': True, 'model': request.model})}\n\n"
        
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


# Made with Bob