"""Obsidian vault reader for project memory."""
from pathlib import Path
from typing import List, Optional
import re
from ..models.task_packet import Note


class VaultReader:
    """Reads markdown notes from Obsidian vault."""
    
    def __init__(self, vault_path: Optional[str] = None):
        """Initialize vault reader with optional vault path."""
        self.vault_path = Path(vault_path).resolve() if vault_path else None
    
    def read_notes(self) -> List[Note]:
        """Read all markdown notes from vault."""
        if not self.vault_path or not self.vault_path.exists():
            return []
        
        if not self.vault_path.is_dir():
            return []
        
        notes = []
        for md_file in self.vault_path.rglob("*.md"):
            try:
                content = md_file.read_text(encoding='utf-8')
                notes.append(Note(
                    filename=md_file.name,
                    content=content,
                    tags=self._extract_tags(content)
                ))
            except (OSError, UnicodeDecodeError):
                continue
        return notes
    
    def _extract_tags(self, content: str) -> List[str]:
        """Extract hashtags from markdown content."""
        # Match #tag but not ##heading
        tags = re.findall(r'(?<!\#)\#([a-zA-Z0-9_-]+)', content)
        return list(set(tags))

# Made with Bob
