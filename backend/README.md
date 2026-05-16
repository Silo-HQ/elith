# Elith Backend

FastAPI backend for the Elith universal repo-aware agent framework.

## Quick Start

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Development Server

```bash
# From project root
uvicorn backend.main:app --reload --port 8000

# Or with hot reload
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Test Context Engine

```bash
# From project root
python3 test_context_engine.py
```

## API Endpoints

### Health Check
```bash
curl http://localhost:8000/health
```

### Scan Repository
```bash
curl -X POST http://localhost:8000/api/scan \
  -H "Content-Type: application/json" \
  -d '{
    "repo_path": ".",
    "vault_path": "obsidian-template"
  }'
```

### List Available Operations
```bash
curl http://localhost:8000/api/tasks
```

### List Available Models
```bash
curl http://localhost:8000/api/models
```

### Execute Operation
```bash
curl -X POST http://localhost:8000/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bob",
    "operation": "explain",
    "repo_path": ".",
    "vault_path": "obsidian-template"
  }'
```

### Stream Output (SSE)
```bash
curl -N http://localhost:8000/api/stream/{session_id}
```

### Get Results
```bash
curl http://localhost:8000/api/results/{session_id}
```

## Architecture

### Context Engine
- **RepoScanner**: Discovers files, identifies key files
- **VaultReader**: Reads Obsidian markdown notes
- **PacketBuilder**: Selects 4-6 most relevant files per task

### Operations
- **explain**: Codebase architecture explanation
- **architect**: Novel architecture proposals (repo-specific)
- **test-gen**: Test generation
- **refactor**: Code improvement suggestions

### Session Management
- **SessionManager**: Tracks active sessions, streams output
- **SessionLogger**: Exports to bob-reports/

### Model Router
- Routes requests to appropriate AI providers
- Supports: Bob (native), Claude, Gemini, OpenAI, Ollama

## Development

### Project Structure
```
backend/
├── main.py                 # FastAPI app
├── models/                 # Pydantic models
├── routes/                 # API endpoints
├── context_engine/         # Smart file selection
├── session/                # Session tracking
├── router/                 # Model routing
├── providers/              # AI provider interfaces
└── operations/             # Operation prompts
```

### Adding a New Operation

1. Create `backend/operations/my_operation.py`:
```python
def build_my_operation_prompt(context: str) -> str:
    return f"Your prompt here\n\n{context}"
```

2. Wire to execute endpoint in `backend/routes/execute.py`:
```python
from ..operations import my_operation

operation_map = {
    "my-operation": my_operation.build_my_operation_prompt,
}
```

3. Update tasks endpoint in `backend/routes/tasks.py`

### Testing

Run context engine tests:
```bash
python3 test_context_engine.py
```

Expected output:
- ✓ Repository scanning
- ✓ Vault reading  
- ✓ Smart file selection
- ✓ File count constraints (4-6 files max)

## Integration Points

### For Basil Joy (AI Core)
Providers should implement `BaseProvider` interface:
```python
from backend.providers.base_provider import BaseProvider

class MyProvider(BaseProvider):
    def run(self, prompt: str, context: str):
        # Yield output chunks
        yield "output..."
    
    def is_configured(self) -> bool:
        return True  # Check API keys, etc.
```

Register in `backend/router/model_router.py`:
```python
from backend.router.model_router import router
router.register_provider("my-model", MyProvider("my-model"))
```

### For Johann (UI)
All endpoints return JSON. SSE endpoint streams events:
```javascript
const eventSource = new EventSource(`/api/stream/${sessionId}`);
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "output") {
    console.log(data.content);
  }
};
```

## Environment Variables

Create `.env` file:
```bash
# API Keys (for providers)
ANTHROPIC_API_KEY=your_key
GOOGLE_API_KEY=your_key
OPENAI_API_KEY=your_key

# Server
HOST=0.0.0.0
PORT=8000
```

## Deployment

### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway up
```

### Docker (Future)
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Troubleshooting

### Import Errors
Make sure you're running from project root:
```bash
cd /path/to/elith
python3 -m uvicorn backend.main:app --reload
```

### CORS Issues
Check `backend/main.py` CORS settings. For development, `allow_origins=["*"]` is set.

### Provider Not Found
Providers must be registered in `model_router.py`. Check `router.providers` dict.

## Next Steps

- [ ] Wire Bob provider (native)
- [ ] Wire Claude provider (via Basil Joy)
- [ ] Wire Gemini provider (via Basil Joy)
- [ ] Add authentication
- [ ] Add rate limiting
- [ ] Add caching layer