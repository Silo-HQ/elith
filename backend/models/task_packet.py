"""Task packet models for context engine."""
from pydantic import BaseModel
from typing import List, Optional


class FileInfo(BaseModel):
    """Information about a file in the repository."""
    path: str
    size: int
    extension: str
    is_key_file: bool = False


class Note(BaseModel):
    """Obsidian vault note."""
    filename: str
    content: str
    tags: List[str] = []


class TaskPacket(BaseModel):
    """Complete context packet for a task."""
    repo_path: str
    vault_path: Optional[str] = None
    files: List[FileInfo]
    vault_notes: List[Note]
    total_files: int
    selected_files: List[str] = []

# Made with Bob
