# Elith Backend - Code Templates
**Quick reference for implementation**

---

## 1. Project Setup Files

### pyproject.toml
```toml
[project]
name = "elith"
version = "0.1.0"
description = "Universal repo-aware agent framework"
requires-python = ">=3.10"
dependencies = [
    "fastapi>=0.104.0",
    "uvicorn[standard]>=0.24.0",
    "pydantic>=2.5.0",
    "python-multipart>=0.0.6",
    "sse-starlette>=1.8.0",
]

[build-system]
requires = ["setuptools>=68.0"]
build-backend = "setuptools.build_meta"
```

### .env.example
```bash
# API Keys
ANTHROPIC_API_KEY=your_claude_key_here
GOOGLE_API_KEY=your_gemini_key_here
OPENAI_API_KEY=your_openai_key_here

# Server
HOST=0.0.0.0
PORT=8000
```

### .gitignore
```
__pycache__/
*.py[cod]
.Python
venv/
.env
.vscode/
.DS_Store
bob-reports/*.md
!bob-reports/.gitkeep
```

---

## 2. Pydantic Models

### backend/models/task_packet.py
```python
from pydantic import BaseModel
from typing import List, Optional

class FileInfo(BaseModel):
    path: str
    size: int
    extension: str
    is_key_file: bool = False

class Note(BaseModel):
    filename: str
    content: str
    tags: List[str] = []

class TaskPacket(BaseModel):
    repo_path: str
    vault_path: Optional[str] = None
    files: List[FileInfo]
    vault_notes: List[Note]
    total_files: int
    selected_files: List[str] = []
```

### backend/models/session.py
```python
from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum
from datetime import datetime

class SessionStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    ERROR = "error"

class Session(BaseModel):
    session_id: str
    model: str
    operation: str
    repo_path: str
    vault_path: Optional[str] = None
    status: SessionStatus = SessionStatus.PENDING
    output: str = ""
    files_changed: List[str] = []
    report_path: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
```

---

## 3. Context Engine

### backend/context_engine/repo_scanner.py
```python
from pathlib import Path
from typing import List, Set
from ..models.task_packet import FileInfo

class RepoScanner:
    SKIP_DIRS: Set[str] = {
        '.git', 'node_modules', '__pycache__', 'venv', '.venv',
        'env', 'dist', 'build', '.next', 'target'
    }
    
    KEY_FILES: Set[str] = {
        'README.md', 'package.json', 'pyproject.toml',
        'main.py', 'app.py', 'index.js'
    }
    
    def __init__(self, repo_path: str):
        self.repo_path = Path(repo_path).resolve()
        if not self.repo_path.exists():
            raise ValueError(f"Path does not exist: {repo_path}")
    
    def scan(self) -> List[FileInfo]:
        files = []
        for file_path in self._walk_directory(self.repo_path):
            relative_path = str(file_path.relative_to(self.repo_path))
            try:
                files.append(FileInfo(
                    path=relative_path,
                    size=file_path.stat().st_size,
                    extension=file_path.suffix,
                    is_key_file=file_path.name in self.KEY_FILES
                ))
            except (OSError, PermissionError):
                continue
        return files
    
    def _walk_directory(self, directory: Path):
        try:
            for item in directory.iterdir():
                if item.is_dir() and item.name not in self.SKIP_DIRS:
                    yield from self._walk_directory(item)
                elif item.is_file():
                    yield item
        except PermissionError:
            pass
```

### backend/context_engine/vault_reader.py
```python
from pathlib import Path
from typing import List, Optional
import re
from ..models.task_packet import Note

class VaultReader:
    def __init__(self, vault_path: Optional[str] = None):
        self.vault_path = Path(vault_path).resolve() if vault_path else None
    
    def read_notes(self) -> List[Note]:
        if not self.vault_path or not self.vault_path.exists():
            return []
        
        notes = []
        for md_file in self.vault_path.rglob("*.md"):
            try:
                content = md_file.read_text(encoding='utf-8')
                notes.append(Note(
                    filename=md_file.name,
                    content=content,
                    tags=self._extract_tags(content)
                ))
            except (OSError, UnicodeDecodeError):
                continue
        return notes
    
    def _extract_tags(self, content: str) -> List[str]:
        return list(set(re.findall(r'(?<!\#)\#([a-zA-Z0-9_-]+)', content)))
```

### backend/context_engine/packet_builder.py
```python
from typing import List, Dict
from pathlib import Path
from ..models.task_packet import TaskPacket, Note

class PacketBuilder:
    TASK_PATTERNS = {
        "explain": {"max_files": 6},
        "architect": {"max_files": 6},
        "test-gen": {"max_files": 4},
        "refactor": {"max_files": 4}
    }
    
    def __init__(self, task_packet: TaskPacket):
        self.packet = task_packet
    
    def build_context(self, operation: str, target_file: str = None) -> Dict:
        pattern = self.TASK_PATTERNS.get(operation, {"max_files": 4})
        
        # Start with key files
        selected = [f.path for f in self.packet.files if f.is_key_file]
        
        # Add operation-specific files
        if operation == "test-gen":
            selected.extend(self._find_files_without_tests())
        elif operation in ["explain", "architect"]:
            selected.extend(self._find_entry_points())
        
        # Limit to max
        selected = selected[:pattern["max_files"]]
        
        return {
            "selected_files": selected,
            "context": self._build_context_string(selected),
            "vault_notes": self._find_relevant_notes(operation),
            "total_files": self.packet.total_files,
            "files_loaded": len(selected)
        }
    
    def _build_context_string(self, file_paths: List[str]) -> str:
        repo_path = Path(self.packet.repo_path)
        parts = [
            f"Repository: {self.packet.repo_path}",
            f"Total files: {self.packet.total_files}",
            f"Files loaded: {len(file_paths)}\n"
        ]
        
        for path in file_paths:
            try:
                content = (repo_path / path).read_text(encoding='utf-8')
                parts.append(f"\n=== {path} ===\n{content}\n")
            except:
                parts.append(f"\n=== {path} ===\n[Unreadable]\n")
        
        return "\n".join(parts)
    
    def _find_files_without_tests(self) -> List[str]:
        # Simplified: return first few non-test files
        return [f.path for f in self.packet.files 
                if 'test' not in f.path.lower() 
                and f.extension in ['.py', '.js', '.ts']][:3]
    
    def _find_entry_points(self) -> List[str]:
        entry_names = ['main.py', 'app.py', 'index.js', 'main.go']
        return [f.path for f in self.packet.files 
                if Path(f.path).name in entry_names][:2]
    
    def _find_relevant_notes(self, operation: str) -> List[Note]:
        keywords = {
            "architect": ["architecture", "design"],
            "test-gen": ["testing", "test"],
            "explain": ["overview", "architecture"]
        }
        terms = keywords.get(operation, [])
        return [n for n in self.packet.vault_notes 
                if any(t in n.content.lower() for t in terms)][:2]
```

---

## 4. FastAPI Routes

### backend/main.py
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import scan, execute, stream, models, results, tasks

app = FastAPI(title="Elith API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scan.router, prefix="/api", tags=["scan"])
app.include_router(execute.router, prefix="/api", tags=["execute"])
app.include_router(stream.router, prefix="/api", tags=["stream"])
app.include_router(models.router, prefix="/api", tags=["models"])
app.include_router(results.router, prefix="/api", tags=["results"])
app.include_router(tasks.router, prefix="/api", tags=["tasks"])

@app.get("/")
async def root():
    return {"name": "Elith API", "version": "0.1.0", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
```

### backend/routes/scan.py
```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from ..context_engine.repo_scanner import RepoScanner
from ..context_engine.vault_reader import VaultReader
from ..models.task_packet import TaskPacket

router = APIRouter()

class ScanRequest(BaseModel):
    repo_path: str
    vault_path: Optional[str] = None

@router.post("/scan")
async def scan_repository(request: ScanRequest) -> TaskPacket:
    try:
        scanner = RepoScanner(request.repo_path)
        files = scanner.scan()
        
        vault_reader = VaultReader(request.vault_path)
        notes = vault_reader.read_notes()
        
        return TaskPacket(
            repo_path=request.repo_path,
            vault_path=request.vault_path,
            files=files,
            vault_notes=notes,
            total_files=len(files)
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scan failed: {str(e)}")
```

---

## 5. Session Management

### backend/session/manager.py
```python
from typing import Dict, Optional
import asyncio
from ..models.session import Session, SessionStatus

class SessionManager:
    def __init__(self):
        self.sessions: Dict[str, Session] = {}
        self.output_queues: Dict[str, asyncio.Queue] = {}
    
    def create_session(self, session_id: str, model: str, 
                      operation: str, repo_path: str) -> Session:
        session = Session(
            session_id=session_id,
            model=model,
            operation=operation,
            repo_path=repo_path
        )
        self.sessions[session_id] = session
        self.output_queues[session_id] = asyncio.Queue()
        return session
    
    def get_session(self, session_id: str) -> Optional[Session]:
        return self.sessions.get(session_id)
    
    async def add_output(self, session_id: str, content: str):
        if session_id in self.sessions:
            self.sessions[session_id].output += content
            if session_id in self.output_queues:
                await self.output_queues[session_id].put(content)
    
    async def stream_output(self, session_id: str):
        if session_id not in self.output_queues:
            return
        
        queue = self.output_queues[session_id]
        while True:
            try:
                content = await asyncio.wait_for(queue.get(), timeout=0.1)
                yield content
            except asyncio.TimeoutError:
                session = self.sessions.get(session_id)
                if session and session.status in [SessionStatus.COMPLETED, SessionStatus.ERROR]:
                    break

manager = SessionManager()
```

### backend/session/logger.py
```python
from pathlib import Path
from ..models.session import Session

class SessionLogger:
    def __init__(self, reports_dir: str = "bob-reports"):
        self.reports_dir = Path(reports_dir)
        self.reports_dir.mkdir(exist_ok=True)
        (self.reports_dir / ".gitkeep").touch()
    
    def log_session(self, session: Session) -> str:
        timestamp = session.created_at.strftime("%Y%m%d_%H%M%S")
        filename = f"session_{timestamp}_{session.session_id[:8]}.md"
        filepath = self.reports_dir / filename
        
        content = f"""# Elith Session Report

**Session ID:** {session.session_id}
**Model:** {session.model}
**Operation:** {session.operation}
**Status:** {session.status.value}

## Repository
{session.repo_path}

## Output
```
{session.output}
```

---
*Generated by Elith*
"""
        filepath.write_text(content, encoding='utf-8')
        return str(filepath)

logger = SessionLogger()
```

---

## 6. Model Router

### backend/router/model_router.py
```python
from typing import Generator
from ..providers.base_provider import BaseProvider

class ModelRouter:
    def __init__(self):
        self.providers = {}
    
    def register_provider(self, name: str, provider: BaseProvider):
        self.providers[name] = provider
    
    def route(self, model: str, prompt: str, context: str) -> Generator[str, None, None]:
        if model not in self.providers:
            yield f"Error: Model '{model}' not configured"
            return
        
        provider = self.providers[model]
        yield from provider.run(prompt, context)
    
    def get_available_models(self) -> list:
        return list(self.providers.keys())

router = ModelRouter()
```

---

## 7. Operations

### backend/operations/explain.py
```python
def build_explain_prompt(context: str) -> str:
    return f"""Analyze this codebase and explain its architecture.

{context}

Provide:
1. Overall structure
2. Key components
3. How they interact
4. Technology stack
5. Entry points

Focus on helping a new developer understand quickly."""
```

### backend/operations/architect.py
```python
def build_architect_prompt(context: str) -> str:
    return f"""Analyze this codebase and propose architectural improvements.

{context}

CRITICAL: Analyze THIS specific codebase. No generic answers.

Propose 2-3 improvements that are:
- Tailored to THIS code's patterns
- Based on actual files you see
- Production-ready with migration paths

For each:
- Why it fits THIS codebase (reference actual files)
- Tradeoffs
- Migration path
- Risks and mitigation"""
```

---

## 8. Run Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Run server
cd backend
uvicorn main:app --reload --port 8000

# Test scan endpoint
curl -X POST http://localhost:8000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"repo_path": "/path/to/repo"}'

# Test health
curl http://localhost:8000/health
```

---

*Use these templates as starting points. Adapt as needed.*