"""Context packet builder for smart file selection."""
from typing import List, Dict, Optional
from pathlib import Path
from ..models.task_packet import TaskPacket, Note


class PacketBuilder:
    """Builds minimal context packets for tasks."""
    
    TASK_PATTERNS = {
        "explain": {"max_files": 6},
        "architect": {"max_files": 6},
        "test-gen": {"max_files": 4},
        "refactor": {"max_files": 4}
    }
    
    def __init__(self, task_packet: TaskPacket):
        """Initialize with scanned task packet."""
        self.packet = task_packet
    
    def build_context(self, operation: str, target_file: Optional[str] = None) -> Dict:
        """Build minimal context for operation."""
        pattern = self.TASK_PATTERNS.get(operation, {"max_files": 4})
        
        # Start with key files
        selected = [f.path for f in self.packet.files if f.is_key_file]
        
        # Add operation-specific files
        if operation == "test-gen":
            selected.extend(self._find_files_without_tests())
        elif operation in ["explain", "architect"]:
            selected.extend(self._find_entry_points())
        elif operation == "refactor" and target_file:
            selected.extend(self._find_related_files(target_file))
        
        # Limit to max
        selected = list(dict.fromkeys(selected))  # Remove duplicates
        selected = selected[:pattern["max_files"]]
        
        return {
            "selected_files": selected,
            "context": self._build_context_string(selected),
            "vault_notes": self._find_relevant_notes(operation),
            "total_files": self.packet.total_files,
            "files_loaded": len(selected)
        }
    
    def _build_context_string(self, file_paths: List[str]) -> str:
        """Build context string with file contents."""
        repo_path = Path(self.packet.repo_path)
        parts = [
            f"Repository: {self.packet.repo_path}",
            f"Total files: {self.packet.total_files}",
            f"Files loaded: {len(file_paths)}\n"
        ]
        
        for path in file_paths:
            try:
                full_path = repo_path / path
                content = full_path.read_text(encoding='utf-8')
                parts.append(f"\n=== {path} ===\n{content}\n")
            except (OSError, UnicodeDecodeError):
                parts.append(f"\n=== {path} ===\n[Unreadable]\n")
        
        return "\n".join(parts)
    
    def _find_files_without_tests(self) -> List[str]:
        """Find source files without corresponding tests."""
        source_files = []
        test_files = set()
        
        for f in self.packet.files:
            if 'test' in f.path.lower() or 'spec' in f.path.lower():
                test_files.add(f.path)
            elif f.extension in ['.py', '.js', '.ts', '.go', '.rs']:
                source_files.append(f.path)
        
        # Return source files that don't have tests
        return [f for f in source_files if not self._has_test_file(f, test_files)][:3]
    
    def _has_test_file(self, source_path: str, test_files: set) -> bool:
        """Check if source file has a corresponding test."""
        base_name = Path(source_path).stem
        return any(base_name in test_file for test_file in test_files)
    
    def _find_entry_points(self) -> List[str]:
        """Find main entry point files."""
        entry_names = ['main.py', 'app.py', 'index.js', 'index.ts', 'main.go', 'main.rs']
        return [f.path for f in self.packet.files 
                if Path(f.path).name in entry_names][:2]
    
    def _find_related_files(self, target_file: str) -> List[str]:
        """Find files related to target file."""
        # Simple heuristic: files in same directory
        target_dir = str(Path(target_file).parent)
        related = [f.path for f in self.packet.files 
                   if str(Path(f.path).parent) == target_dir]
        return related[:3]
    
    def _find_relevant_notes(self, operation: str) -> List[Note]:
        """Find vault notes relevant to operation."""
        keywords = {
            "architect": ["architecture", "design", "pattern"],
            "test-gen": ["testing", "test", "quality"],
            "explain": ["overview", "architecture", "readme"],
            "refactor": ["refactor", "improve", "technical-debt"]
        }
        terms = keywords.get(operation, [])
        
        relevant = []
        for note in self.packet.vault_notes:
            content_lower = note.content.lower()
            if any(term in content_lower for term in terms):
                relevant.append(note)
        
        return relevant[:2]

# Made with Bob
