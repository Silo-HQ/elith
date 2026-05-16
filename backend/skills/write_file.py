# backend/skills/write_file.py

import os
from .base_skill import BaseSkill

class WriteFileSkill(BaseSkill):
    """
    Write or overwrite a file in the repository.
    
    Automatically creates parent directories if they don't exist.
    """
    
    @property
    def name(self) -> str:
        return "write_file"
    
    @property
    def description(self) -> str:
        return "Write or overwrite a file in the repository. Use this to implement changes, refactors, or new files."
    
    @property
    def parameters(self) -> dict:
        return {
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "Relative path to the file from repo root"
                },
                "content": {
                    "type": "string",
                    "description": "Full file content to write"
                }
            },
            "required": ["path", "content"]
        }
    
    def execute(self, repo_path: str, **kwargs) -> str:
        """
        Write content to a file.
        
        Args:
            repo_path: Repository root path
            path: Relative path to file
            content: Content to write
        
        Returns:
            Success message with line count, or error message
        """
        path = kwargs.get("path", "")
        content = kwargs.get("content", "")
        
        if not path:
            return "Error: path parameter is required"
        
        full_path = os.path.join(repo_path, path)
        
        # Auto-create parent directories
        dir_path = os.path.dirname(full_path)
        if dir_path:
            os.makedirs(dir_path, exist_ok=True)
        
        try:
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(content)
            lines = content.split('\n')
            return f"✓ Written: {path} ({len(lines)} lines)"
        except Exception as e:
            return f"Error writing {path}: {str(e)}"

# Made with Bob
