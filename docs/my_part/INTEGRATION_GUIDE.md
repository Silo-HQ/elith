# Elith Backend - Integration Guide
**Coordination with Basil Joy (AI/ML) and Johann (UI/UX)**

---

## Integration with Basil Joy (Providers + Skills)

### What Basil Joy Provides

**1. Base Interfaces** (Hours 2-4)
```python
# backend/skills/base_skill.py
class BaseSkill(ABC):
    @property
    def name(self) -> str: pass
    
    @property
    def description(self) -> str: pass
    
    @property
    def parameters(self) -> Dict: pass
    
    def execute(self, repo_path: str, **kwargs) -> str: pass
    
    def to_anthropic_tool(self) -> Dict: pass
    def to_openai_tool(self) -> Dict: pass
    def to_gemini_function(self): pass

# backend/providers/base_provider.py
class BaseProvider(ABC):
    def __init__(self, repo_path: str, skills: List[BaseSkill]): pass
    
    def run(self, prompt: str, context: str) -> Generator[str, None, None]: pass
    
    def execute_skill(self, skill_name: str, **kwargs) -> str: pass
```

**2. All 12 Skills** (Hours 2-8)
- read_file, write_file, list_files, search_code
- git_diff, git_commit, run_tests, find_references
- analyze_dependencies, explain_function, install_package, read_logs

**3. Bob Provider** (Hours 5-8)
```python
# backend/providers/bob_provider.py
class BobProvider(BaseProvider):
    def __init__(self, repo_path: str):
        super().__init__(repo_path, [])  # No skills needed
    
    def run(self, prompt: str, context: str) -> Generator[str, None, None]:
        # Spawns Bob shell, streams output
        pass
```

**4. Claude Provider** (Hours 9-14)
```python
# backend/providers/claude_provider.py
class ClaudeProvider(BaseProvider):
    def __init__(self, repo_path: str, api_key: str):
        super().__init__(repo_path, ALL_SKILLS)
        self.client = anthropic.Anthropic(api_key=api_key)
    
    def run(self, prompt: str, context: str) -> Generator[str, None, None]:
        # Injects skills as tools, handles tool calling loop
        pass
```

**5. Other Providers** (Hours 15-22)
- gemini_provider.py
- openai_provider.py
- ollama_provider.py

### How You Wire Them

**In `backend/main.py`:**
```python
from .router.model_router import router as model_router
from .providers.bob_provider import BobProvider
from .providers.claude_provider import ClaudeProvider
# ... other providers

@app.on_event("startup")
async def startup_event():
    # Register Bob (no API key needed)
    bob = BobProvider(repo_path="")
    model_router.register_provider("bob", bob)
    
    # Register Claude if API key configured
    claude_key = os.getenv("ANTHROPIC_API_KEY")
    if claude_key:
        claude = ClaudeProvider(repo_path="", api_key=claude_key)
        model_router.register_provider("claude", claude)
    
    # ... register other providers
```

**In `backend/routes/execute.py`:**
```python
async def run_operation(session_id, model, operation, prompt, context):
    try:
        session = manager.get_session(session_id)
        session.status = SessionStatus.RUNNING
        
        # Route to model - this calls Basil Joy's provider
        async for chunk in model_router.route(model, prompt, context):
            await manager.add_output(session_id, chunk)
        
        manager.complete_session(session_id)
        
        # Log session
        session = manager.get_session(session_id)
        report_path = logger.log_session(session)
        session.report_path = report_path
    except Exception as e:
        manager.error_session(session_id, str(e))
```

### Coordination Points

**Hour 8 Checkpoint:**
- ✅ You: Model router skeleton ready
- ✅ Basil Joy: Bob provider ready
- 🔄 Wire Bob provider, test end-to-end

**Hour 14 Checkpoint:**
- ✅ You: Full integration loop working
- ✅ Basil Joy: Claude provider ready
- 🔄 Wire Claude provider, test skill calling

**Hour 22 Checkpoint:**
- ✅ You: All operations implemented
- ✅ Basil Joy: All 4 providers ready
- 🔄 Test same task on all providers

### If Basil Joy is Blocked

**Temporary Mock Provider:**
```python
# backend/providers/mock_provider.py
class MockProvider(BaseProvider):
    def __init__(self, repo_path: str):
        super().__init__(repo_path, [])
    
    def run(self, prompt: str, context: str):
        yield "Mock output: Analyzing codebase...\n"
        yield "Mock output: Found 3 key patterns...\n"
        yield "Mock output: Proposal 1: Use event sourcing...\n"
```

Use this to keep integration moving while waiting for real providers.

---

## Integration with Johann (Frontend)

### What Johann Consumes

**1. API Endpoints** (You provide)
```
POST /api/scan
POST /api/execute
GET  /api/stream/{session_id}
GET  /api/models
GET  /api/results/{session_id}
GET  /api/tasks
```

**2. Response Formats**

**Scan Response:**
```json
{
  "repo_path": "/path/to/repo",
  "vault_path": null,
  "files": [
    {"path": "main.py", "size": 1234, "extension": ".py", "is_key_file": true}
  ],
  "vault_notes": [],
  "total_files": 42,
  "selected_files": []
}
```

**Execute Response:**
```json
{
  "session_id": "uuid-here",
  "files_loaded": 6,
  "total_files": 312
}
```

**SSE Stream Format:**
```javascript
// Event: output
{
  "type": "output",
  "content": "Analyzing codebase...\n",
  "model": "bob"
}

// Event: done
{
  "type": "done",
  "session_id": "uuid-here"
}
```

**Models Response:**
```json
{
  "available": ["bob", "claude", "gemini", "openai", "ollama"],
  "configured": ["bob", "claude"]
}
```

**Results Response:**
```json
{
  "output": "Full output text...",
  "files_changed": ["src/auth.py", "tests/test_auth.py"],
  "report_path": "bob-reports/session_20260516_091234_abc123.md",
  "status": "completed"
}
```

### CORS Configuration

**Already in `backend/main.py`:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Johann's frontend can connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**For production, update to:**
```python
allow_origins=[
    "http://localhost:3000",  # Johann's dev
    "https://elith-frontend.vercel.app"  # Johann's prod
]
```

### SSE Connection Example (For Johann)

```javascript
// Johann's frontend code
const eventSource = new EventSource(
  `http://localhost:8000/api/stream/${sessionId}`
);

eventSource.addEventListener('output', (e) => {
  const data = JSON.parse(e.data);
  console.log(data.content);  // Stream to UI
});

eventSource.addEventListener('done', (e) => {
  eventSource.close();
  // Fetch final results
});
```

### Coordination Points

**Hour 14 Checkpoint:**
- ✅ You: All endpoints working
- ✅ Johann: Frontend can call /api/scan
- 🔄 Test scan → execute → stream flow

**Hour 28 Checkpoint:**
- ✅ You: Backend deployed to Railway
- ✅ Johann: Frontend deployed to Vercel
- 🔄 Test production URLs

### If Johann is Blocked

**Test with curl:**
```bash
# Test full flow
SESSION_ID=$(curl -X POST http://localhost:8000/api/execute \
  -H "Content-Type: application/json" \
  -d '{"model":"bob","operation":"explain","repo_path":"/path/to/repo"}' \
  | jq -r '.session_id')

# Stream output
curl -N http://localhost:8000/api/stream/$SESSION_ID

# Get results
curl http://localhost:8000/api/results/$SESSION_ID
```

---

## Communication Protocol

### Sync Calls (Every 8 Hours)

**Hour 1:** Team sync - API contract agreed ✅  
**Hour 9:** Integration checkpoint - Bob provider wired  
**Hour 17:** Mid-point check - All providers status  
**Hour 25:** Integration test - Frontend + backend  
**Hour 33:** Demo prep - Final testing  
**Hour 41:** Pre-submit - Final checks

### Slack/WhatsApp Protocol

**When you're blocked:**
```
@basil-joy BLOCKED: Need bob_provider.py to test integration
ETA needed: Next 2 hours
Workaround: Using mock provider for now
```

**When you're ready for integration:**
```
@johann READY: /api/scan and /api/execute working
Test URL: http://localhost:8000
Docs: See INTEGRATION_GUIDE.md
```

**When you discover an issue:**
```
@team ISSUE: SSE streaming breaks on Railway
Impact: Demo won't work in production
Investigating: CORS or connection timeout
ETA: 1 hour
```

### Commit Messages

**Your commits:**
```
feat: implement repo scanner and vault reader
feat: add context engine with smart file selection
feat: wire Bob provider for native execution
fix: SSE streaming timeout on long operations
```

**Branch strategy:**
```
main              # Protected, only merge after testing
├── backend-core  # Your work
├── providers     # Basil Joy's work
└── frontend      # Johann's work
```

---

## Testing Strategy

### Unit Tests (Optional but Recommended)

```python
# tests/test_repo_scanner.py
def test_repo_scanner_skips_node_modules():
    scanner = RepoScanner("/path/to/test/repo")
    files = scanner.scan()
    assert not any("node_modules" in f.path for f in files)

def test_repo_scanner_finds_key_files():
    scanner = RepoScanner("/path/to/test/repo")
    files = scanner.scan()
    key_files = [f for f in files if f.is_key_file]
    assert any(f.path == "README.md" for f in key_files)
```

### Integration Tests

```python
# tests/test_integration.py
async def test_full_flow():
    # 1. Scan repo
    response = await client.post("/api/scan", json={
        "repo_path": "/path/to/test/repo"
    })
    assert response.status_code == 200
    
    # 2. Execute operation
    response = await client.post("/api/execute", json={
        "model": "bob",
        "operation": "explain",
        "repo_path": "/path/to/test/repo"
    })
    session_id = response.json()["session_id"]
    
    # 3. Stream output
    # (Test SSE connection)
    
    # 4. Get results
    response = await client.get(f"/api/results/{session_id}")
    assert response.status_code == 200
```

### Manual Testing Checklist

**Hours 2-4:**
- [ ] `/api/scan` returns file list
- [ ] Vault reader handles missing vault gracefully
- [ ] Key files are marked correctly

**Hours 5-8:**
- [ ] Context builder selects 4-6 files max
- [ ] Different operations select different files
- [ ] Context string includes file contents

**Hours 9-14:**
- [ ] Session created and tracked
- [ ] SSE streaming works
- [ ] Session logged to bob-reports/
- [ ] Bob provider runs natively

**Hours 15-22:**
- [ ] All 3 operations work
- [ ] All 4 providers work
- [ ] Same task → same quality across providers

**Hours 23-28:**
- [ ] Frontend connects successfully
- [ ] Model switching works
- [ ] Error messages are clear
- [ ] Deployment works

---

## Deployment Checklist

### Railway Deployment

**1. Create Railway project:**
```bash
railway login
railway init
railway link
```

**2. Set environment variables:**
```bash
railway variables set ANTHROPIC_API_KEY=sk-...
railway variables set GOOGLE_API_KEY=...
railway variables set OPENAI_API_KEY=sk-...
```

**3. Deploy:**
```bash
railway up
```

**4. Test deployed URL:**
```bash
curl https://elith.up.railway.app/health
```

### Environment Variables Needed

```bash
# Required for providers
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
OPENAI_API_KEY=sk-...

# Optional
HOST=0.0.0.0
PORT=8000
```

### Deployment Issues

**SSE not working over HTTPS:**
- Check Railway timeout settings
- Ensure proper SSE headers
- Test with curl first

**CORS errors:**
- Update allowed origins
- Check credentials setting
- Verify preflight requests

---

## Demo Day Checklist

**Pre-demo (Hour 33-36):**
- [ ] Pick demo repo (50-200 files, real project)
- [ ] Test full workflow 3 times
- [ ] Ensure Bob reports in bob-reports/
- [ ] Verify all providers work
- [ ] Check deployment is stable

**Demo script (3 minutes):**
1. Show Elith → point to demo repo
2. Bob runs "architect" → shows 6 files loaded
3. Bob proposes novel architecture
4. Switch to Claude → same task
5. Claude proposes same quality
6. "Any model. Bob-level. Your choice."

**Backup plan:**
- Screen recording if live demo fails
- Local demo if deployment down
- Mock data if providers fail

---

*Keep this guide updated as you discover integration issues.*