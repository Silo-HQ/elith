# Elith — Agent Skills Specification
**The Core Innovation**  
**Owner:** Basil Joy (AI/ML Core)  
**Purpose:** Give every model the repo-awareness IBM Bob has natively

---

## Why This Exists

IBM Bob lives inside your repository. It can read files, write code, run tests, search your codebase, and commit changes — all natively, without being told where things are.

Claude, Gemini, GPT, and local LLMs are powerful reasoners but repo-blind. They only know what you paste into the prompt.

**Elith's skill layer closes this gap.**

Every skill is an agent tool — a Python function exposed to the model via tool calling. When a non-Bob model is running, Elith injects the full skill set as available tools. The model calls them. Elith executes them. The model gets back real data from your actual repository.

**Result: Every model operates at Bob-level.**

---

## How Tool Calling Works Per Provider

Each provider has a different tool calling API. Elith normalizes this.

### Anthropic (Claude)
```python
tools = [
    {
        "name": "read_file",
        "description": "Read the contents of a file in the repository",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Relative path to file"}
            },
            "required": ["path"]
        }
    }
]
# Pass tools= to client.messages.create()
```

### Google (Gemini)
```python
tools = [
    genai.protos.Tool(
        function_declarations=[
            genai.protos.FunctionDeclaration(
                name="read_file",
                description="Read the contents of a file in the repository",
                parameters=genai.protos.Schema(
                    type=genai.protos.Type.OBJECT,
                    properties={
                        "path": genai.protos.Schema(type=genai.protos.Type.STRING)
                    }
                )
            )
        ]
    )
]
```

### OpenAI (GPT/Codex)
```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "read_file",
            "description": "Read the contents of a file in the repository",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {"type": "string"}
                },
                "required": ["path"]
            }
        }
    }
]
```

### Ollama (Local LLM)
```python
# Ollama uses OpenAI-compatible format
# Same as OpenAI above
# Model must support tool calling (llama3.1, mistral-nemo, etc.)
```

---

## Base Skill Interface

Every skill implements this interface:

```python
# backend/skills/base_skill.py

from abc import ABC, abstractmethod
from typing import Any, Dict

class BaseSkill(ABC):
    
    @property
    @abstractmethod
    def name(self) -> str:
        """Skill name — used as tool name by LLM"""
        pass
    
    @property
    @abstractmethod
    def description(self) -> str:
        """What this skill does — shown to LLM"""
        pass
    
    @property
    @abstractmethod
    def parameters(self) -> Dict:
        """JSON Schema of parameters"""
        pass
    
    @abstractmethod
    def execute(self, repo_path: str, **kwargs) -> str:
        """Execute the skill and return string result"""
        pass
    
    def to_anthropic_tool(self) -> Dict:
        return {
            "name": self.name,
            "description": self.description,
            "input_schema": self.parameters
        }
    
    def to_openai_tool(self) -> Dict:
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": self.parameters
            }
        }
    
    def to_gemini_function(self):
        import google.generativeai as genai
        # Build Gemini FunctionDeclaration from parameters
        return genai.protos.FunctionDeclaration(
            name=self.name,
            description=self.description,
        )
```

---

## Base Provider Interface

```python
# backend/providers/base_provider.py

from abc import ABC, abstractmethod
from typing import List, Generator
from ..skills.base_skill import BaseSkill

class BaseProvider(ABC):
    
    def __init__(self, repo_path: str, skills: List[BaseSkill]):
        self.repo_path = repo_path
        self.skills = {s.name: s for s in skills}
    
    @abstractmethod
    def run(self, prompt: str, context: str) -> Generator[str, None, None]:
        """
        Run the model with the given prompt and context.
        Yields output chunks as they stream.
        Handles tool calls internally — calls skills and feeds results back.
        """
        pass
    
    def execute_skill(self, skill_name: str, **kwargs) -> str:
        """Execute a skill by name"""
        if skill_name not in self.skills:
            return f"Error: skill '{skill_name}' not found"
        return self.skills[skill_name].execute(self.repo_path, **kwargs)
```

---

## The 12 Skills

---

### 1. `read_file`

```python
# backend/skills/read_file.py

import os
from .base_skill import BaseSkill

class ReadFileSkill(BaseSkill):
    
    @property
    def name(self): return "read_file"
    
    @property
    def description(self):
        return "Read the full contents of a file in the repository. Use this to understand existing code before making changes."
    
    @property
    def parameters(self):
        return {
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "Relative path to the file from repo root (e.g. 'src/auth/views.py')"
                }
            },
            "required": ["path"]
        }
    
    def execute(self, repo_path: str, path: str) -> str:
        full_path = os.path.join(repo_path, path)
        if not os.path.exists(full_path):
            return f"Error: file not found: {path}"
        try:
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
            lines = content.split('\n')
            return f"File: {path} ({len(lines)} lines)\n\n{content}"
        except Exception as e:
            return f"Error reading {path}: {str(e)}"
```

---

### 2. `write_file`

```python
# backend/skills/write_file.py

import os
from .base_skill import BaseSkill

class WriteFileSkill(BaseSkill):
    
    @property
    def name(self): return "write_file"
    
    @property
    def description(self):
        return "Write or overwrite a file in the repository. Use this to implement changes, refactors, or new files."
    
    @property
    def parameters(self):
        return {
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "Relative path to the file from repo root"
                },
                "content": {
                    "type": "string",
                    "description": "Full file content to write"
                }
            },
            "required": ["path", "content"]
        }
    
    def execute(self, repo_path: str, path: str, content: str) -> str:
        full_path = os.path.join(repo_path, path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        try:
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(content)
            lines = content.split('\n')
            return f"✓ Written: {path} ({len(lines)} lines)"
        except Exception as e:
            return f"Error writing {path}: {str(e)}"
```

---

### 3. `list_files`

```python
# backend/skills/list_files.py

import os
from .base_skill import BaseSkill

class ListFilesSkill(BaseSkill):
    
    @property
    def name(self): return "list_files"
    
    @property
    def description(self):
        return "List all files in a directory of the repository. Use to understand project structure before diving into specific files."
    
    @property
    def parameters(self):
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
    
    def execute(self, repo_path: str, path: str = ".", recursive: bool = False) -> str:
        full_path = os.path.join(repo_path, path)
        if not os.path.exists(full_path):
            return f"Error: directory not found: {path}"
        
        results = []
        if recursive:
            for root, dirs, files in os.walk(full_path):
                # Skip hidden and common ignore dirs
                dirs[:] = [d for d in dirs if not d.startswith('.') 
                          and d not in ['node_modules', '__pycache__', '.git', 'venv']]
                rel_root = os.path.relpath(root, repo_path)
                for file in files:
                    results.append(os.path.join(rel_root, file))
        else:
            for item in sorted(os.listdir(full_path)):
                item_path = os.path.join(full_path, item)
                prefix = "📁 " if os.path.isdir(item_path) else "📄 "
                results.append(f"{prefix}{item}")
        
        return f"Contents of {path}:\n" + "\n".join(results)
```

---

### 4. `search_code`

```python
# backend/skills/search_code.py

import os
import subprocess
from .base_skill import BaseSkill

class SearchCodeSkill(BaseSkill):
    
    @property
    def name(self): return "search_code"
    
    @property
    def description(self):
        return "Search for a pattern, function name, class, or string across all files in the repository."
    
    @property
    def parameters(self):
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
    
    def execute(self, repo_path: str, query: str, file_pattern: str = "*") -> str:
        try:
            result = subprocess.run(
                ["grep", "-rn", "--include", f"{file_pattern}", 
                 "--exclude-dir", ".git",
                 "--exclude-dir", "node_modules",
                 "--exclude-dir", "__pycache__",
                 query, "."],
                cwd=repo_path,
                capture_output=True,
                text=True,
                timeout=30
            )
            if result.stdout:
                lines = result.stdout.strip().split('\n')
                # Limit to 50 results
                if len(lines) > 50:
                    lines = lines[:50]
                    lines.append(f"... and {len(result.stdout.split(chr(10))) - 50} more results")
                return f"Found '{query}' in:\n" + "\n".join(lines)
            return f"No results found for '{query}'"
        except Exception as e:
            return f"Search error: {str(e)}"
```

---

### 5. `git_diff`

```python
# backend/skills/git_diff.py

import subprocess
from .base_skill import BaseSkill

class GitDiffSkill(BaseSkill):
    
    @property
    def name(self): return "git_diff"
    
    @property
    def description(self):
        return "Show git diff of current uncommitted changes, or diff between branches. Use to understand what has changed."
    
    @property
    def parameters(self):
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
    
    def execute(self, repo_path: str, target: str = "HEAD", path: str = None) -> str:
        try:
            cmd = ["git", "diff", target]
            if path:
                cmd.append(path)
            result = subprocess.run(
                cmd, cwd=repo_path, capture_output=True, text=True, timeout=30
            )
            if result.stdout:
                return f"Git diff ({target}):\n{result.stdout[:5000]}"
            return "No changes detected"
        except Exception as e:
            return f"Git diff error: {str(e)}"
```

---

### 6. `git_commit`

```python
# backend/skills/git_commit.py

import subprocess
from .base_skill import BaseSkill

class GitCommitSkill(BaseSkill):
    
    @property
    def name(self): return "git_commit"
    
    @property
    def description(self):
        return "Stage all changes and create a git commit with the given message."
    
    @property
    def parameters(self):
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
    
    def execute(self, repo_path: str, message: str) -> str:
        try:
            subprocess.run(["git", "add", "."], cwd=repo_path, check=True)
            result = subprocess.run(
                ["git", "commit", "-m", message],
                cwd=repo_path, capture_output=True, text=True
            )
            return f"✓ Committed: {message}\n{result.stdout}"
        except Exception as e:
            return f"Commit error: {str(e)}"
```

---

### 7. `run_tests`

```python
# backend/skills/run_tests.py

import subprocess
import os
from .base_skill import BaseSkill

class RunTestsSkill(BaseSkill):
    
    @property
    def name(self): return "run_tests"
    
    @property
    def description(self):
        return "Run the test suite for the repository or a specific test file. Returns pass/fail results."
    
    @property
    def parameters(self):
        return {
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "Optional path to specific test file or directory"
                }
            }
        }
    
    def execute(self, repo_path: str, path: str = None) -> str:
        try:
            # Auto-detect test runner
            if os.path.exists(os.path.join(repo_path, "pytest.ini")) or \
               os.path.exists(os.path.join(repo_path, "pyproject.toml")):
                cmd = ["python", "-m", "pytest", "-v", "--tb=short"]
            elif os.path.exists(os.path.join(repo_path, "package.json")):
                cmd = ["npm", "test", "--", "--watchAll=false"]
            else:
                cmd = ["python", "-m", "pytest", "-v"]
            
            if path:
                cmd.append(path)
            
            result = subprocess.run(
                cmd, cwd=repo_path, capture_output=True, text=True, timeout=120
            )
            output = result.stdout + result.stderr
            return f"Test results:\n{output[:3000]}"
        except Exception as e:
            return f"Test error: {str(e)}"
```

---

### 8. `find_references`

```python
# backend/skills/find_references.py

import subprocess
from .base_skill import BaseSkill

class FindReferencesSkill(BaseSkill):
    
    @property
    def name(self): return "find_references"
    
    @property
    def description(self):
        return "Find all usages of a function, class, or variable across the codebase."
    
    @property
    def parameters(self):
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
    
    def execute(self, repo_path: str, symbol: str) -> str:
        try:
            result = subprocess.run(
                ["grep", "-rn", "--exclude-dir", ".git",
                 "--exclude-dir", "node_modules",
                 "--exclude-dir", "__pycache__",
                 symbol, "."],
                cwd=repo_path, capture_output=True, text=True, timeout=30
            )
            if result.stdout:
                lines = result.stdout.strip().split('\n')[:30]
                return f"References to '{symbol}':\n" + "\n".join(lines)
            return f"No references found for '{symbol}'"
        except Exception as e:
            return f"Find references error: {str(e)}"
```

---

### 9. `analyze_dependencies`

```python
# backend/skills/analyze_dependencies.py

import os
import json
from .base_skill import BaseSkill

class AnalyzeDependenciesSkill(BaseSkill):
    
    @property
    def name(self): return "analyze_dependencies"
    
    @property
    def description(self):
        return "Analyze project dependencies from package files (requirements.txt, package.json, pyproject.toml, etc.)"
    
    @property
    def parameters(self):
        return {"type": "object", "properties": {}}
    
    def execute(self, repo_path: str) -> str:
        results = []
        
        # Python
        for fname in ["requirements.txt", "requirements-dev.txt", "pyproject.toml"]:
            fpath = os.path.join(repo_path, fname)
            if os.path.exists(fpath):
                with open(fpath) as f:
                    results.append(f"--- {fname} ---\n{f.read()[:1000]}")
        
        # Node
        pkg_path = os.path.join(repo_path, "package.json")
        if os.path.exists(pkg_path):
            with open(pkg_path) as f:
                pkg = json.load(f)
                deps = pkg.get("dependencies", {})
                dev_deps = pkg.get("devDependencies", {})
                results.append(f"--- package.json ---\nDeps: {list(deps.keys())}\nDevDeps: {list(dev_deps.keys())}")
        
        if results:
            return "\n\n".join(results)
        return "No dependency files found"
```

---

### 10. `explain_function`

```python
# backend/skills/explain_function.py

import os
import ast
from .base_skill import BaseSkill

class ExplainFunctionSkill(BaseSkill):
    
    @property
    def name(self): return "explain_function"
    
    @property
    def description(self):
        return "Extract a specific function or class from a file and return its full source code for analysis."
    
    @property
    def parameters(self):
        return {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "File path"},
                "name": {"type": "string", "description": "Function or class name to extract"}
            },
            "required": ["path", "name"]
        }
    
    def execute(self, repo_path: str, path: str, name: str) -> str:
        full_path = os.path.join(repo_path, path)
        try:
            with open(full_path) as f:
                source = f.read()
            
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
        except Exception as e:
            return f"Error: {str(e)}"
```

---

### 11. `install_package`

```python
# backend/skills/install_package.py

import subprocess
import os
from .base_skill import BaseSkill

class InstallPackageSkill(BaseSkill):
    
    @property
    def name(self): return "install_package"
    
    @property
    def description(self):
        return "Install a package using pip or npm depending on the project type."
    
    @property
    def parameters(self):
        return {
            "type": "object",
            "properties": {
                "package": {"type": "string", "description": "Package name to install"},
                "dev": {"type": "boolean", "description": "Install as dev dependency", "default": False}
            },
            "required": ["package"]
        }
    
    def execute(self, repo_path: str, package: str, dev: bool = False) -> str:
        try:
            if os.path.exists(os.path.join(repo_path, "package.json")):
                cmd = ["npm", "install", package]
                if dev:
                    cmd.append("--save-dev")
            else:
                cmd = ["pip", "install", package]
            
            result = subprocess.run(
                cmd, cwd=repo_path, capture_output=True, text=True, timeout=120
            )
            return f"✓ Installed {package}\n{result.stdout[:500]}"
        except Exception as e:
            return f"Install error: {str(e)}"
```

---

### 12. `read_logs`

```python
# backend/skills/read_logs.py

import os
from .base_skill import BaseSkill

class ReadLogsSkill(BaseSkill):
    
    @property
    def name(self): return "read_logs"
    
    @property
    def description(self):
        return "Read error logs or output logs from the repository's log files."
    
    @property
    def parameters(self):
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
    
    def execute(self, repo_path: str, path: str = None, lines: int = 100) -> str:
        try:
            if path:
                log_path = os.path.join(repo_path, path)
            else:
                # Auto-detect common log locations
                candidates = ["logs/app.log", "app.log", "error.log", 
                             "logs/error.log", "tmp/app.log"]
                log_path = None
                for c in candidates:
                    full = os.path.join(repo_path, c)
                    if os.path.exists(full):
                        log_path = full
                        break
            
            if not log_path or not os.path.exists(log_path):
                return "No log files found"
            
            with open(log_path) as f:
                all_lines = f.readlines()
            
            last_lines = all_lines[-lines:]
            return f"Last {lines} lines of {os.path.basename(log_path)}:\n{''.join(last_lines)}"
        except Exception as e:
            return f"Log read error: {str(e)}"
```

---

## Skill Registry

```python
# backend/skills/__init__.py

from .read_file import ReadFileSkill
from .write_file import WriteFileSkill
from .list_files import ListFilesSkill
from .search_code import SearchCodeSkill
from .git_diff import GitDiffSkill
from .git_commit import GitCommitSkill
from .run_tests import RunTestsSkill
from .find_references import FindReferencesSkill
from .analyze_dependencies import AnalyzeDependenciesSkill
from .explain_function import ExplainFunctionSkill
from .install_package import InstallPackageSkill
from .read_logs import ReadLogsSkill

ALL_SKILLS = [
    ReadFileSkill(),
    WriteFileSkill(),
    ListFilesSkill(),
    SearchCodeSkill(),
    GitDiffSkill(),
    GitCommitSkill(),
    RunTestsSkill(),
    FindReferencesSkill(),
    AnalyzeDependenciesSkill(),
    ExplainFunctionSkill(),
    InstallPackageSkill(),
    ReadLogsSkill(),
]

SKILL_MAP = {s.name: s for s in ALL_SKILLS}
```

---

## Claude Provider — Full Implementation

```python
# backend/providers/claude_provider.py

import anthropic
import json
from typing import Generator
from .base_provider import BaseProvider
from ..skills import ALL_SKILLS

class ClaudeProvider(BaseProvider):
    
    def __init__(self, repo_path: str, api_key: str, model: str = "claude-sonnet-4-20250514"):
        super().__init__(repo_path, ALL_SKILLS)
        self.client = anthropic.Anthropic(api_key=api_key)
        self.model = model
    
    def run(self, prompt: str, context: str) -> Generator[str, None, None]:
        tools = [s.to_anthropic_tool() for s in self.skills.values()]
        messages = [{"role": "user", "content": f"{context}\n\n{prompt}"}]
        
        while True:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=8096,
                tools=tools,
                messages=messages
            )
            
            # Stream text blocks
            for block in response.content:
                if block.type == "text":
                    yield block.text
            
            # Handle tool calls
            if response.stop_reason == "tool_use":
                tool_results = []
                for block in response.content:
                    if block.type == "tool_use":
                        yield f"\n[Elith Skill: {block.name}({block.input})]\n"
                        result = self.execute_skill(block.name, **block.input)
                        yield f"→ {result[:200]}...\n" if len(result) > 200 else f"→ {result}\n"
                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": result
                        })
                
                # Continue conversation with tool results
                messages.append({"role": "assistant", "content": response.content})
                messages.append({"role": "user", "content": tool_results})
            else:
                break
```

---

## IBM Bob Provider

```python
# backend/providers/bob_provider.py

import subprocess
import os
from typing import Generator
from .base_provider import BaseProvider

class BobProvider(BaseProvider):
    """
    IBM Bob runs natively inside the repo.
    No skills needed — Bob has all capabilities built in.
    We just spawn Bob shell and stream its output.
    """
    
    def __init__(self, repo_path: str):
        super().__init__(repo_path, [])  # No skills needed
        self.repo_path = repo_path
    
    def run(self, prompt: str, context: str) -> Generator[str, None, None]:
        full_prompt = f"{context}\n\n{prompt}"
        
        try:
            process = subprocess.Popen(
                ["bob", "--task", full_prompt],
                cwd=self.repo_path,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1
            )
            
            for line in iter(process.stdout.readline, ''):
                yield line
            
            process.wait()
            
            if process.returncode != 0:
                yield f"\nBob exited with code {process.returncode}"
                
        except FileNotFoundError:
            yield "Error: IBM Bob shell not found. Please install Bob and ensure it is in PATH."
        except Exception as e:
            yield f"Error running Bob: {str(e)}"
```

---

## Model Router

```python
# backend/router/model_router.py

from typing import Generator
from ..providers.bob_provider import BobProvider
from ..providers.claude_provider import ClaudeProvider
from ..providers.gemini_provider import GeminiProvider
from ..providers.openai_provider import OpenAIProvider
from ..providers.ollama_provider import OllamaProvider

class ModelRouter:
    
    def __init__(self, repo_path: str, config: dict):
        self.repo_path = repo_path
        self.config = config  # API keys + enabled models
        self._providers = {}
        self._init_providers()
    
    def _init_providers(self):
        if self.config.get("bob_enabled"):
            self._providers["bob"] = BobProvider(self.repo_path)
        
        if self.config.get("claude_api_key"):
            self._providers["claude"] = ClaudeProvider(
                self.repo_path, 
                self.config["claude_api_key"]
            )
        
        if self.config.get("gemini_api_key"):
            self._providers["gemini"] = GeminiProvider(
                self.repo_path,
                self.config["gemini_api_key"]
            )
        
        if self.config.get("openai_api_key"):
            self._providers["openai"] = OpenAIProvider(
                self.repo_path,
                self.config["openai_api_key"]
            )
        
        if self.config.get("ollama_enabled"):
            self._providers["ollama"] = OllamaProvider(
                self.repo_path,
                self.config.get("ollama_model", "llama3.1")
            )
    
    def run(self, model: str, prompt: str, context: str) -> Generator[str, None, None]:
        if model not in self._providers:
            yield f"Error: provider '{model}' not configured"
            return
        yield from self._providers[model].run(prompt, context)
    
    def available_models(self) -> list:
        return list(self._providers.keys())
```

---

## Notes For Basil Joy

**Priority order:**

1. `base_skill.py` and `base_provider.py` first — everything depends on these
2. `read_file.py` — most used skill, test it immediately
3. `bob_provider.py` — get Bob shell running and streaming
4. `claude_provider.py` — this is your proof of concept. When Claude reads a real file via skill, that's the moment Elith works.
5. All other skills
6. Other providers (Gemini, OpenAI, Ollama)
7. Novel architecture prompts — once providers work

**Testing each skill:**
```python
skill = ReadFileSkill()
result = skill.execute("/path/to/repo", "src/auth/views.py")
print(result)  # Should print real file content
```

**Testing tool calling on Claude:**
```python
provider = ClaudeProvider("/path/to/repo", api_key="...")
for chunk in provider.run("Read the auth module and explain it", ""):
    print(chunk, end="", flush=True)
# Watch Claude call read_file() and list_files() automatically
```

**The moment this works:** Claude will start calling `read_file()`, `search_code()`, etc. on its own — just like Bob does natively. That's the demo moment.

---

*Elith Agent Skills Specification — Basil Joy — IBM Bob Hackathon 2026*
