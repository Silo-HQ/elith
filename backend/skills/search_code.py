# backend/skills/search_code.py

import os
import subprocess
import platform
from .base_skill import BaseSkill

class SearchCodeSkill(BaseSkill):
    """
    Search for a pattern, function name, class, or string across all files.
    
    Uses grep on Unix systems and findstr on Windows.
    """
    
    @property
    def name(self) -> str:
        return "search_code"
    
    @property
    def description(self) -> str:
        return "Search for a pattern, function name, class, or string across all files in the repository."
    
    @property
    def parameters(self) -> dict:
        return {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Search term, regex pattern, function name, or class name"
                },
                "file_pattern": {
                    "type": "string",
                    "description": "Optional file glob to limit search (e.g. '*.py', '*.ts')",
                    "default": "*"
                }
            },
            "required": ["query"]
        }
    
    def execute(self, repo_path: str, **kwargs) -> str:
        """
        Search for a pattern in repository files.
        
        Args:
            repo_path: Repository root path
            query: Search term or pattern
            file_pattern: Optional file glob filter
        
        Returns:
            Search results with file:line:content format, or error message
        """
        query = kwargs.get("query", "")
        file_pattern = kwargs.get("file_pattern", "*")
        
        if not query:
            return "Error: query parameter is required"
        
        try:
            # Use grep on Unix, findstr on Windows
            if platform.system() == "Windows":
                # Windows findstr command
                result = subprocess.run(
                    ["findstr", "/s", "/n", "/i", query, file_pattern],
                    cwd=repo_path,
                    capture_output=True,
                    text=True,
                    timeout=30
                )
            else:
                # Unix grep command
                result = subprocess.run(
                    ["grep", "-rn", "--include", f"{file_pattern}", 
                     "--exclude-dir", ".git",
                     "--exclude-dir", "node_modules",
                     "--exclude-dir", "__pycache__",
                     "--exclude-dir", "venv",
                     "--exclude-dir", "env",
                     query, "."],
                    cwd=repo_path,
                    capture_output=True,
                    text=True,
                    timeout=30
                )
            
            if result.stdout:
                lines = result.stdout.strip().split('\n')
                # Limit to 50 results to avoid overwhelming output
                if len(lines) > 50:
                    remaining = len(lines) - 50
                    lines = lines[:50]
                    lines.append(f"... and {remaining} more results")
                return f"Found '{query}' in:\n" + "\n".join(lines)
            
            return f"No results found for '{query}'"
        
        except subprocess.TimeoutExpired:
            return f"Search timed out after 30 seconds"
        except FileNotFoundError:
            return "Error: grep/findstr command not found"
        except Exception as e:
            return f"Search error: {str(e)}"

# Made with Bob
