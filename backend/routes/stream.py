"""Stream endpoint for SSE output streaming."""
from fastapi import APIRouter, HTTPException
from sse_starlette.sse import EventSourceResponse
from ..session.manager import manager
import json

router = APIRouter()


@router.get("/stream/{session_id}")
async def stream_output(session_id: str):
    """
    Stream session output via Server-Sent Events.
    
    Frontend connects to this endpoint to receive live output.
    """
    session = manager.get_session(session_id)
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    async def event_generator():
        """Generate SSE events from session output."""
        async for content in manager.stream_output(session_id):
            yield {
                "event": "message",
                "data": json.dumps({
                    "type": "output",
                    "content": content,
                    "model": session.model
                })
            }
        
        # Send completion event
        yield {
            "event": "message",
            "data": json.dumps({
                "type": "done",
                "status": session.status.value,
                "model": session.model
            })
        }
    
    return EventSourceResponse(event_generator())

# Made with Bob
