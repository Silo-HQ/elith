# backend/skills/git_diff.py

import subprocess
from .base_skill import BaseSkill

class GitDiffSkill(BaseSkill):
    """
    Show git diff of current uncommitted changes or diff between branches.
    """
    
    @property
    def name(self) -> str:
        return "git_diff"
    
    @property
    def description(self) -> str:
        return "Show git diff of current uncommitted changes, or diff between branches. Use to understand what has changed."
    
    @property
    def parameters(self) -> dict:
        return {
            "type": "object",
            "properties": {
                "target": {
                    "type": "string",
                    "description": "Branch name or commit hash to diff against (default: HEAD)",
                    "default": "HEAD"
                },
                "path": {
                    "type": "string",
                    "description": "Optional file path to limit diff to specific file"
                }
            }
        }
    
    def execute(self, repo_path: str, **kwargs) -> str:
        """
        Show git diff.
        
        Args:
            repo_path: Repository root path
            target: Branch/commit to diff against
            path: Optional file path filter
        
        Returns:
            Git diff output, or error message
        """
        target = kwargs.get("target", "HEAD")
        path = kwargs.get("path")
        
        try:
            cmd = ["git", "diff", target]
            if path:
                cmd.append(path)
            
            result = subprocess.run(
                cmd, 
                cwd=repo_path, 
                capture_output=True, 
                text=True, 
                timeout=30
            )
            
            if result.returncode != 0:
                return f"Git diff error: {result.stderr}"
            
            if result.stdout:
                # Limit output to 5000 chars to avoid overwhelming
                output = result.stdout[:5000]
                if len(result.stdout) > 5000:
                    output += "\n... (truncated)"
                return f"Git diff ({target}):\n{output}"
            
            return "No changes detected"
        
        except subprocess.TimeoutExpired:
            return "Git diff timed out after 30 seconds"
        except FileNotFoundError:
            return "Error: git command not found"
        except Exception as e:
            return f"Git diff error: {str(e)}"

# Made with Bob
