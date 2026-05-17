"""Session history manager for persisting and retrieving past sessions."""
import json
from pathlib import Path
from typing import List, Optional, Dict
from datetime import datetime
from ..models.session import Session, SessionStatus


class SessionHistory:
    """Manages persistent session history."""
    
    def __init__(self, history_dir: str = "bob-reports"):
        """Initialize history manager with storage directory."""
        self.history_dir = Path(history_dir)
        self.history_file = self.history_dir / "session_history.json"
        self.history_dir.mkdir(exist_ok=True)
        self._ensure_history_file()
    
    def _ensure_history_file(self):
        """Ensure history file exists."""
        if not self.history_file.exists():
            self.history_file.write_text("[]", encoding='utf-8')
    
    def _load_history(self) -> List[Dict]:
        """Load history from file."""
        try:
            content = self.history_file.read_text(encoding='utf-8')
            return json.loads(content)
        except (json.JSONDecodeError, FileNotFoundError):
            return []
    
    def _save_history(self, history: List[Dict]):
        """Save history to file."""
        self.history_file.write_text(
            json.dumps(history, indent=2, default=str),
            encoding='utf-8'
        )
    
    def add_session(self, session: Session):
        """Add a completed session to history."""
        history = self._load_history()
        
        # Create history entry
        entry = {
            "session_id": session.session_id,
            "model": session.model,
            "operation": session.operation,
            "repo_path": session.repo_path,
            "vault_path": session.vault_path,
            "status": session.status.value,
            "created_at": session.created_at.isoformat(),
            "completed_at": session.completed_at.isoformat() if session.completed_at else None,
            "report_path": session.report_path,
            "files_changed": session.files_changed,
            "output_preview": session.output[:200] if session.output else ""  # First 200 chars
        }
        
        # Add to beginning of history (most recent first)
        history.insert(0, entry)
        
        # Keep only last 100 sessions
        if len(history) > 100:
            history = history[:100]
        
        self._save_history(history)
    
    def get_history(self, limit: int = 50) -> List[Dict]:
        """Get recent session history."""
        history = self._load_history()
        return history[:limit]
    
    def get_session(self, session_id: str) -> Optional[Dict]:
        """Get a specific session from history."""
        history = self._load_history()
        for entry in history:
            if entry["session_id"] == session_id:
                return entry
        return None
    
    def search_history(
        self,
        model: Optional[str] = None,
        operation: Optional[str] = None,
        status: Optional[str] = None,
        limit: int = 50
    ) -> List[Dict]:
        """Search history with filters."""
        history = self._load_history()
        filtered = []
        
        for entry in history:
            if model and entry.get("model") != model:
                continue
            if operation and entry.get("operation") != operation:
                continue
            if status and entry.get("status") != status:
                continue
            filtered.append(entry)
            
            if len(filtered) >= limit:
                break
        
        return filtered
    
    def clear_history(self):
        """Clear all history."""
        self._save_history([])


# Global history instance
history = SessionHistory()

# Made with Bob