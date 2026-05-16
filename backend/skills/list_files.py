# backend/skills/list_files.py

import os
from .base_skill import BaseSkill

class ListFilesSkill(BaseSkill):
    """
    List all files in a directory of the repository.
    
    Supports recursive listing and filters out common ignore directories.
    """
    
    @property
    def name(self) -> str:
        return "list_files"
    
    @property
    def description(self) -> str:
        return "List all files in a directory of the repository. Use to understand project structure before diving into specific files."
    
    @property
    def parameters(self) -> dict:
        return {
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "Relative directory path (use '.' for root)"
                },
                "recursive": {
                    "type": "boolean",
                    "description": "Whether to list subdirectories recursively",
                    "default": False
                }
            },
            "required": ["path"]
        }
    
    def execute(self, repo_path: str, **kwargs) -> str:
        """
        List files in a directory.
        
        Args:
            repo_path: Repository root path
            path: Relative directory path
            recursive: Whether to list recursively
        
        Returns:
            Formatted directory listing, or error message
        """
        path = kwargs.get("path", ".")
        recursive = kwargs.get("recursive", False)
        
        full_path = os.path.join(repo_path, path)
        
        if not os.path.exists(full_path):
            return f"Error: directory not found: {path}"
        
        if not os.path.isdir(full_path):
            return f"Error: {path} is not a directory"
        
        results = []
        
        try:
            if recursive:
                for root, dirs, files in os.walk(full_path):
                    # Skip hidden and common ignore dirs
                    dirs[:] = [d for d in dirs if not d.startswith('.') 
                              and d not in ['node_modules', '__pycache__', '.git', 'venv', 'env', 'dist', 'build']]
                    
                    rel_root = os.path.relpath(root, repo_path)
                    if rel_root == '.':
                        rel_root = ''
                    
                    for file in sorted(files):
                        if not file.startswith('.'):
                            if rel_root:
                                results.append(os.path.join(rel_root, file))
                            else:
                                results.append(file)
            else:
                for item in sorted(os.listdir(full_path)):
                    if item.startswith('.'):
                        continue
                    item_path = os.path.join(full_path, item)
                    prefix = "📁 " if os.path.isdir(item_path) else "📄 "
                    results.append(f"{prefix}{item}")
            
            if not results:
                return f"Contents of {path}: (empty)"
            
            return f"Contents of {path}:\n" + "\n".join(results)
        
        except Exception as e:
            return f"Error listing {path}: {str(e)}"

# Made with Bob
