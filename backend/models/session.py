"""Session models for tracking execution state."""
from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum
from datetime import datetime


class SessionStatus(str, Enum):
    """Status of a session."""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    ERROR = "error"


class Session(BaseModel):
    """Execution session tracking."""
    session_id: str
    model: str
    operation: str
    repo_path: str
    vault_path: Optional[str] = None
    status: SessionStatus = SessionStatus.PENDING
    output: str = ""
    files_changed: List[str] = []
    report_path: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None

# Made with Bob
