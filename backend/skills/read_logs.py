# backend/skills/read_logs.py

import os
from .base_skill import BaseSkill

class ReadLogsSkill(BaseSkill):
    """
    Read error logs or output logs from the repository's log files.
    
    Auto-detects common log locations if path not provided.
    """
    
    @property
    def name(self) -> str:
        return "read_logs"
    
    @property
    def description(self) -> str:
        return "Read error logs or output logs from the repository's log files."
    
    @property
    def parameters(self) -> dict:
        return {
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "Path to log file (auto-detected if not provided)"
                },
                "lines": {
                    "type": "integer",
                    "description": "Number of lines from end of file to return",
                    "default": 100
                }
            }
        }
    
    def execute(self, repo_path: str, **kwargs) -> str:
        """
        Read log files.
        
        Args:
            repo_path: Repository root path
            path: Optional log file path
            lines: Number of lines to read from end
        
        Returns:
            Log content, or error message
        """
        path = kwargs.get("path")
        lines = kwargs.get("lines", 100)
        
        try:
            if path:
                log_path = os.path.join(repo_path, path)
            else:
                # Auto-detect common log locations
                candidates = [
                    "logs/app.log",
                    "app.log",
                    "error.log",
                    "logs/error.log",
                    "tmp/app.log",
                    "log/application.log",
                    "var/log/app.log"
                ]
                log_path = None
                for c in candidates:
                    full = os.path.join(repo_path, c)
                    if os.path.exists(full):
                        log_path = full
                        path = c  # For display
                        break
            
            if not log_path or not os.path.exists(log_path):
                return "No log files found. Tried: logs/app.log, app.log, error.log, logs/error.log"
            
            with open(log_path, 'r', encoding='utf-8', errors='ignore') as f:
                all_lines = f.readlines()
            
            # Get last N lines
            last_lines = all_lines[-lines:] if len(all_lines) > lines else all_lines
            content = ''.join(last_lines)
            
            return f"Last {len(last_lines)} lines of {os.path.basename(log_path)}:\n{content}"
        
        except Exception as e:
            return f"Log read error: {str(e)}"

# Made with Bob
