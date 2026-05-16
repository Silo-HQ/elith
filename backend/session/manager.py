"""Session manager for tracking execution state."""
from typing import Dict, Optional
import asyncio
from ..models.session import Session, SessionStatus


class SessionManager:
    """Manages active sessions and output streaming."""
    
    def __init__(self):
        """Initialize session manager."""
        self.sessions: Dict[str, Session] = {}
        self.output_queues: Dict[str, asyncio.Queue] = {}
    
    def create_session(
        self, 
        session_id: str, 
        model: str, 
        operation: str, 
        repo_path: str,
        vault_path: Optional[str] = None
    ) -> Session:
        """Create a new session."""
        session = Session(
            session_id=session_id,
            model=model,
            operation=operation,
            repo_path=repo_path,
            vault_path=vault_path
        )
        self.sessions[session_id] = session
        self.output_queues[session_id] = asyncio.Queue()
        return session
    
    def get_session(self, session_id: str) -> Optional[Session]:
        """Get session by ID."""
        return self.sessions.get(session_id)
    
    async def add_output(self, session_id: str, content: str):
        """Add output to session and queue for streaming."""
        if session_id in self.sessions:
            self.sessions[session_id].output += content
            if session_id in self.output_queues:
                await self.output_queues[session_id].put(content)
    
    async def stream_output(self, session_id: str):
        """Stream output from session queue."""
        if session_id not in self.output_queues:
            return
        
        queue = self.output_queues[session_id]
        while True:
            try:
                content = await asyncio.wait_for(queue.get(), timeout=0.1)
                yield content
            except asyncio.TimeoutError:
                session = self.sessions.get(session_id)
                if session and session.status in [SessionStatus.COMPLETED, SessionStatus.ERROR]:
                    break
    
    def update_status(self, session_id: str, status: SessionStatus):
        """Update session status."""
        if session_id in self.sessions:
            self.sessions[session_id].status = status
    
    def cleanup_session(self, session_id: str):
        """Clean up session resources."""
        if session_id in self.output_queues:
            del self.output_queues[session_id]


# Global session manager instance
manager = SessionManager()

# Made with Bob
