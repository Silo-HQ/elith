# backend/skills/run_tests.py

import subprocess
import os
from .base_skill import BaseSkill

class RunTestsSkill(BaseSkill):
    """
    Run the test suite for the repository or a specific test file.
    
    Auto-detects test framework (pytest, npm test, etc.)
    """
    
    @property
    def name(self) -> str:
        return "run_tests"
    
    @property
    def description(self) -> str:
        return "Run the test suite for the repository or a specific test file. Returns pass/fail results."
    
    @property
    def parameters(self) -> dict:
        return {
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "Optional path to specific test file or directory"
                }
            }
        }
    
    def execute(self, repo_path: str, **kwargs) -> str:
        """
        Run tests.
        
        Args:
            repo_path: Repository root path
            path: Optional test file/directory path
        
        Returns:
            Test results, or error message
        """
        path = kwargs.get("path")
        
        try:
            # Auto-detect test runner
            if os.path.exists(os.path.join(repo_path, "pytest.ini")) or \
               os.path.exists(os.path.join(repo_path, "pyproject.toml")) or \
               os.path.exists(os.path.join(repo_path, "setup.py")):
                # Python project with pytest
                cmd = ["python", "-m", "pytest", "-v", "--tb=short"]
            elif os.path.exists(os.path.join(repo_path, "package.json")):
                # Node.js project
                cmd = ["npm", "test", "--", "--watchAll=false"]
            else:
                # Default to pytest
                cmd = ["python", "-m", "pytest", "-v"]
            
            if path:
                cmd.append(path)
            
            result = subprocess.run(
                cmd, 
                cwd=repo_path, 
                capture_output=True, 
                text=True, 
                timeout=120
            )
            
            output = result.stdout + result.stderr
            
            # Limit output to 3000 chars
            if len(output) > 3000:
                output = output[:3000] + "\n... (truncated)"
            
            return f"Test results:\n{output}"
        
        except subprocess.TimeoutExpired:
            return "Tests timed out after 120 seconds"
        except FileNotFoundError as e:
            return f"Test runner not found: {str(e)}"
        except Exception as e:
            return f"Test error: {str(e)}"

# Made with Bob
