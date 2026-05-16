# backend/skills/git_commit.py

import subprocess
from .base_skill import BaseSkill

class GitCommitSkill(BaseSkill):
    """
    Stage all changes and create a git commit with the given message.
    """
    
    @property
    def name(self) -> str:
        return "git_commit"
    
    @property
    def description(self) -> str:
        return "Stage all changes and create a git commit with the given message."
    
    @property
    def parameters(self) -> dict:
        return {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string",
                    "description": "Commit message describing what changed and why"
                }
            },
            "required": ["message"]
        }
    
    def execute(self, repo_path: str, **kwargs) -> str:
        """
        Create a git commit.
        
        Args:
            repo_path: Repository root path
            message: Commit message
        
        Returns:
            Commit confirmation, or error message
        """
        message = kwargs.get("message", "")
        
        if not message:
            return "Error: message parameter is required"
        
        try:
            # Stage all changes
            subprocess.run(
                ["git", "add", "."], 
                cwd=repo_path, 
                check=True,
                capture_output=True
            )
            
            # Create commit
            result = subprocess.run(
                ["git", "commit", "-m", message],
                cwd=repo_path, 
                capture_output=True, 
                text=True
            )
            
            if result.returncode == 0:
                return f"✓ Committed: {message}\n{result.stdout}"
            else:
                # Check if there's nothing to commit
                if "nothing to commit" in result.stdout.lower():
                    return "No changes to commit"
                return f"Commit error: {result.stderr or result.stdout}"
        
        except FileNotFoundError:
            return "Error: git command not found"
        except Exception as e:
            return f"Commit error: {str(e)}"

# Made with Bob
