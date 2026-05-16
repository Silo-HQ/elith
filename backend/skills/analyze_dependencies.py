# backend/skills/analyze_dependencies.py

import os
import json
from .base_skill import BaseSkill

class AnalyzeDependenciesSkill(BaseSkill):
    """
    Analyze project dependencies from package files.
    
    Supports Python (requirements.txt, pyproject.toml) and Node.js (package.json).
    """
    
    @property
    def name(self) -> str:
        return "analyze_dependencies"
    
    @property
    def description(self) -> str:
        return "Analyze project dependencies from package files (requirements.txt, package.json, pyproject.toml, etc.)"
    
    @property
    def parameters(self) -> dict:
        return {
            "type": "object",
            "properties": {}
        }
    
    def execute(self, repo_path: str, **kwargs) -> str:
        """
        Analyze dependencies.
        
        Args:
            repo_path: Repository root path
        
        Returns:
            Dependency information, or error message
        """
        results = []
        
        try:
            # Python dependency files
            for fname in ["requirements.txt", "requirements-dev.txt", "pyproject.toml"]:
                fpath = os.path.join(repo_path, fname)
                if os.path.exists(fpath):
                    try:
                        with open(fpath, 'r', encoding='utf-8') as f:
                            content = f.read()
                            # Limit to 1000 chars per file
                            if len(content) > 1000:
                                content = content[:1000] + "\n... (truncated)"
                            results.append(f"--- {fname} ---\n{content}")
                    except Exception as e:
                        results.append(f"--- {fname} ---\nError reading: {str(e)}")
            
            # Node.js package.json
            pkg_path = os.path.join(repo_path, "package.json")
            if os.path.exists(pkg_path):
                try:
                    with open(pkg_path, 'r', encoding='utf-8') as f:
                        pkg = json.load(f)
                        deps = pkg.get("dependencies", {})
                        dev_deps = pkg.get("devDependencies", {})
                        
                        dep_list = [f"{k}@{v}" for k, v in deps.items()]
                        dev_dep_list = [f"{k}@{v}" for k, v in dev_deps.items()]
                        
                        result = f"--- package.json ---\n"
                        result += f"Dependencies ({len(deps)}):\n"
                        result += "\n".join(dep_list[:20])
                        if len(dep_list) > 20:
                            result += f"\n... and {len(dep_list) - 20} more"
                        
                        result += f"\n\nDev Dependencies ({len(dev_deps)}):\n"
                        result += "\n".join(dev_dep_list[:20])
                        if len(dev_dep_list) > 20:
                            result += f"\n... and {len(dev_dep_list) - 20} more"
                        
                        results.append(result)
                except Exception as e:
                    results.append(f"--- package.json ---\nError reading: {str(e)}")
            
            if results:
                return "\n\n".join(results)
            
            return "No dependency files found (requirements.txt, package.json, pyproject.toml)"
        
        except Exception as e:
            return f"Dependency analysis error: {str(e)}"

# Made with Bob
