# backend/skills/explain_function.py

import os
import ast
from .base_skill import BaseSkill

class ExplainFunctionSkill(BaseSkill):
    """
    Extract a specific function or class from a file and return its full source code.
    
    Uses Python AST parsing for Python files.
    """
    
    @property
    def name(self) -> str:
        return "explain_function"
    
    @property
    def description(self) -> str:
        return "Extract a specific function or class from a file and return its full source code for analysis."
    
    @property
    def parameters(self) -> dict:
        return {
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "File path"
                },
                "name": {
                    "type": "string",
                    "description": "Function or class name to extract"
                }
            },
            "required": ["path", "name"]
        }
    
    def execute(self, repo_path: str, **kwargs) -> str:
        """
        Extract and explain a function or class.
        
        Args:
            repo_path: Repository root path
            path: File path
            name: Function/class name
        
        Returns:
            Source code of the function/class, or error message
        """
        path = kwargs.get("path", "")
        name = kwargs.get("name", "")
        
        if not path or not name:
            return "Error: both path and name parameters are required"
        
        full_path = os.path.join(repo_path, path)
        
        if not os.path.exists(full_path):
            return f"Error: file not found: {path}"
        
        try:
            with open(full_path, 'r', encoding='utf-8') as f:
                source = f.read()
            
            # Try Python AST parsing
            if path.endswith('.py'):
                try:
                    tree = ast.parse(source)
                    lines = source.split('\n')
                    
                    for node in ast.walk(tree):
                        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                            if node.name == name:
                                start = node.lineno - 1
                                end = node.end_lineno
                                code = '\n'.join(lines[start:end])
                                return f"Source of {name} in {path}:\n\n{code}"
                    
                    return f"'{name}' not found in {path}"
                except SyntaxError:
                    return f"Error: {path} has syntax errors, cannot parse"
            else:
                # For non-Python files, do simple text search
                lines = source.split('\n')
                for i, line in enumerate(lines):
                    if f"function {name}" in line or f"class {name}" in line or \
                       f"def {name}" in line or f"const {name}" in line or \
                       f"let {name}" in line or f"var {name}" in line:
                        # Extract surrounding context (20 lines)
                        start = max(0, i - 2)
                        end = min(len(lines), i + 20)
                        code = '\n'.join(lines[start:end])
                        return f"Found {name} in {path} (line {i+1}):\n\n{code}"
                
                return f"'{name}' not found in {path}"
        
        except Exception as e:
            return f"Error: {str(e)}"

# Made with Bob
