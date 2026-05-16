# backend/skills/find_references.py

import subprocess
import platform
from .base_skill import BaseSkill

class FindReferencesSkill(BaseSkill):
    """
    Find all usages of a function, class, or variable across the codebase.
    """
    
    @property
    def name(self) -> str:
        return "find_references"
    
    @property
    def description(self) -> str:
        return "Find all usages of a function, class, or variable across the codebase."
    
    @property
    def parameters(self) -> dict:
        return {
            "type": "object",
            "properties": {
                "symbol": {
                    "type": "string",
                    "description": "Function name, class name, or variable to find references for"
                }
            },
            "required": ["symbol"]
        }
    
    def execute(self, repo_path: str, **kwargs) -> str:
        """
        Find references to a symbol.
        
        Args:
            repo_path: Repository root path
            symbol: Symbol name to search for
        
        Returns:
            List of references with file:line:content, or error message
        """
        symbol = kwargs.get("symbol", "")
        
        if not symbol:
            return "Error: symbol parameter is required"
        
        try:
            if platform.system() == "Windows":
                # Windows findstr
                result = subprocess.run(
                    ["findstr", "/s", "/n", "/i", symbol, "*.*"],
                    cwd=repo_path,
                    capture_output=True,
                    text=True,
                    timeout=30
                )
            else:
                # Unix grep
                result = subprocess.run(
                    ["grep", "-rn", 
                     "--exclude-dir", ".git",
                     "--exclude-dir", "node_modules",
                     "--exclude-dir", "__pycache__",
                     "--exclude-dir", "venv",
                     "--exclude-dir", "env",
                     symbol, "."],
                    cwd=repo_path,
                    capture_output=True,
                    text=True,
                    timeout=30
                )
            
            if result.stdout:
                lines = result.stdout.strip().split('\n')
                # Limit to 30 results
                if len(lines) > 30:
                    remaining = len(lines) - 30
                    lines = lines[:30]
                    lines.append(f"... and {remaining} more references")
                return f"References to '{symbol}':\n" + "\n".join(lines)
            
            return f"No references found for '{symbol}'"
        
        except subprocess.TimeoutExpired:
            return "Search timed out after 30 seconds"
        except FileNotFoundError:
            return "Error: grep/findstr command not found"
        except Exception as e:
            return f"Find references error: {str(e)}"

# Made with Bob
