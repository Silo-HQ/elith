"""Repository scanner for file discovery."""
from pathlib import Path
from typing import List, Set
from ..models.task_packet import FileInfo


class RepoScanner:
    """Scans repository and identifies files."""
    
    SKIP_DIRS: Set[str] = {
        '.git', 'node_modules', '__pycache__', 'venv', '.venv',
        'env', 'dist', 'build', '.next', 'target', '.pytest_cache',
        '.mypy_cache', 'coverage', '.coverage', 'htmlcov'
    }
    
    KEY_FILES: Set[str] = {
        'README.md', 'package.json', 'pyproject.toml', 'setup.py',
        'main.py', 'app.py', 'index.js', 'index.ts', 'main.go',
        'Cargo.toml', 'go.mod', 'requirements.txt'
    }
    
    def __init__(self, repo_path: str):
        """Initialize scanner with repository path."""
        self.repo_path = Path(repo_path).resolve()
        if not self.repo_path.exists():
            raise ValueError(f"Path does not exist: {repo_path}")
        if not self.repo_path.is_dir():
            raise ValueError(f"Path is not a directory: {repo_path}")
    
    def scan(self) -> List[FileInfo]:
        """Scan repository and return file information."""
        files = []
        for file_path in self._walk_directory(self.repo_path):
            relative_path = str(file_path.relative_to(self.repo_path))
            try:
                files.append(FileInfo(
                    path=relative_path,
                    size=file_path.stat().st_size,
                    extension=file_path.suffix,
                    is_key_file=file_path.name in self.KEY_FILES
                ))
            except (OSError, PermissionError):
                continue
        return files
    
    def _walk_directory(self, directory: Path):
        """Recursively walk directory, skipping ignored paths."""
        try:
            for item in directory.iterdir():
                if item.is_dir() and item.name not in self.SKIP_DIRS:
                    yield from self._walk_directory(item)
                elif item.is_file():
                    yield item
        except PermissionError:
            pass

# Made with Bob
