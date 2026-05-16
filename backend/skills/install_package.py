# backend/skills/install_package.py

import subprocess
import os
from .base_skill import BaseSkill

class InstallPackageSkill(BaseSkill):
    """
    Install a package using pip or npm depending on the project type.
    """
    
    @property
    def name(self) -> str:
        return "install_package"
    
    @property
    def description(self) -> str:
        return "Install a package using pip or npm depending on the project type."
    
    @property
    def parameters(self) -> dict:
        return {
            "type": "object",
            "properties": {
                "package": {
                    "type": "string",
                    "description": "Package name to install"
                },
                "dev": {
                    "type": "boolean",
                    "description": "Install as dev dependency",
                    "default": False
                }
            },
            "required": ["package"]
        }
    
    def execute(self, repo_path: str, **kwargs) -> str:
        """
        Install a package.
        
        Args:
            repo_path: Repository root path
            package: Package name
            dev: Whether to install as dev dependency
        
        Returns:
            Installation confirmation, or error message
        """
        package = kwargs.get("package", "")
        dev = kwargs.get("dev", False)
        
        if not package:
            return "Error: package parameter is required"
        
        try:
            # Detect project type
            if os.path.exists(os.path.join(repo_path, "package.json")):
                # Node.js project
                cmd = ["npm", "install", package]
                if dev:
                    cmd.append("--save-dev")
            else:
                # Python project
                cmd = ["pip", "install", package]
            
            result = subprocess.run(
                cmd, 
                cwd=repo_path, 
                capture_output=True, 
                text=True, 
                timeout=120
            )
            
            if result.returncode == 0:
                output = result.stdout[:500]
                if len(result.stdout) > 500:
                    output += "\n... (truncated)"
                return f"✓ Installed {package}\n{output}"
            else:
                return f"Install error: {result.stderr[:500]}"
        
        except subprocess.TimeoutExpired:
            return f"Installation timed out after 120 seconds"
        except FileNotFoundError as e:
            return f"Package manager not found: {str(e)}"
        except Exception as e:
            return f"Install error: {str(e)}"

# Made with Bob
