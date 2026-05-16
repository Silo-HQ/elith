# backend/skills/read_file.py

import os
from .base_skill import BaseSkill

class ReadFileSkill(BaseSkill):
    """
    Read the full contents of a file in the repository.
    
    This is the most critical skill - used by models to understand
    existing code before making changes.
    """
    
    @property
    def name(self) -> str:
        return "read_file"
    
    @property
    def description(self) -> str:
        return "Read the full contents of a file in the repository. Use this to understand existing code before making changes."
    
    @property
    def parameters(self) -> dict:
        return {
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "Relative path to the file from repo root (e.g. 'src/auth/views.py')"
                }
            },
            "required": ["path"]
        }
    
    def execute(self, repo_path: str, **kwargs) -> str:
        """
        Read a file and return its contents.
        
        Args:
            repo_path: Repository root path
            path: Relative path to file
        
        Returns:
            File contents with metadata, or error message
        """
        path = kwargs.get("path", "")
        if not path:
            return "Error: path parameter is required"
        
        full_path = os.path.join(repo_path, path)
        
        if not os.path.exists(full_path):
            return f"Error: file not found: {path}"
        
        if not os.path.isfile(full_path):
            return f"Error: {path} is not a file"
        
        try:
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
            lines = content.split('\n')
            return f"File: {path} ({len(lines)} lines)\n\n{content}"
        except UnicodeDecodeError:
            return f"Error: {path} is a binary file, cannot read as text"
        except Exception as e:
            return f"Error reading {path}: {str(e)}"

# Made with Bob
