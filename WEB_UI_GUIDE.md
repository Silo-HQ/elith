# Elith Web UI Guide

## Overview

The Elith Web UI provides a modern, browser-based interface for interacting with the Elith agent framework. It features a clean, dark-themed interface with real-time streaming output and comprehensive repository analysis capabilities.

## Architecture

### Frontend (React + TypeScript + Vite)
- **Location**: `frontend/`
- **Port**: `http://localhost:3000`
- **Tech Stack**: React 18, TypeScript, Tailwind CSS, Zustand (state management)
- **Key Features**:
  - Real-time streaming output via Server-Sent Events (SSE)
  - Repository and Obsidian vault scanning
  - Multi-model support (Claude, Gemini, LM Studio, etc.)
  - Operation selection (explain, architect, test-gen, refactor)

### Backend (FastAPI + Python)
- **Location**: `backend/`
- **Port**: `http://localhost:8001`
- **API Docs**: `http://localhost:8001/docs`
- **Tech Stack**: FastAPI, Uvicorn, Pydantic
- **Key Features**:
  - RESTful API endpoints
  - SSE streaming for live output
  - Context engine for smart file selection
  - Provider routing to multiple AI models

## Quick Start

### 1. Start Both Servers

```bash
./start-web.sh
```

This script will:
- Create a Python virtual environment (if needed)
- Install all dependencies
- Start the backend API on port 8001
- Start the frontend dev server on port 3000
- Display URLs and process IDs

### 2. Access the Web UI

Open your browser to: **http://localhost:3000**

### 3. Stop the Servers

```bash
./stop-web.sh
```

Or manually kill the processes using the PIDs displayed at startup.

## Manual Setup

If you prefer to start services manually:

### Backend

```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend API
uvicorn backend.main:app --reload --port 8001
```

### Frontend

```bash
# Install dependencies
cd frontend
npm install

# Start dev server
npm run dev
```

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# AI Provider API Keys
ANTHROPIC_API_KEY=your_claude_key_here
GOOGLE_API_KEY=your_gemini_key_here
OPENAI_API_KEY=your_openai_key_here

# LM Studio Configuration
LMSTUDIO_BASE_URL=http://localhost:1234/v1
LMSTUDIO_API_KEY=optional_key

# Default Model
DEFAULT_MODEL=lmstudio
```

### Frontend Proxy

The frontend is configured to proxy API requests to the backend:

```typescript
// frontend/vite.config.ts
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8001',
      changeOrigin: true,
    },
  },
}
```

## API Endpoints

### Core Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/scan` | POST | Scan repository and vault |
| `/api/execute` | POST | Start an operation |
| `/api/stream/{session_id}` | GET | Stream live output (SSE) |
| `/api/results/{session_id}` | GET | Get session results |
| `/api/models` | GET | List available models |
| `/api/tasks` | GET | List available operations |

### Example: Scan Repository

```bash
curl -X POST http://localhost:8001/api/scan \
  -H "Content-Type: application/json" \
  -d '{
    "repo_path": "/path/to/repo",
    "vault_path": "/path/to/vault"
  }'
```

Response:
```json
{
  "loaded_files": ["src/main.py", "README.md", ...],
  "total_files": 150,
  "vault_notes": ["architecture.md", "decisions.md"],
  "tokens_saved": 45000
}
```

### Example: Execute Operation

```bash
curl -X POST http://localhost:8001/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude",
    "operation": "explain",
    "repo_path": "/path/to/repo"
  }'
```

Response:
```json
{
  "session_id": "abc123...",
  "status": "running"
}
```

### Example: Stream Output

```bash
curl -N http://localhost:8001/api/stream/abc123...
```

Streams Server-Sent Events:
```
data: {"type":"output","content":"Analyzing codebase...","model":"claude"}

data: {"type":"output","content":"Found 3 main components...","model":"claude"}

data: {"type":"done","status":"completed","model":"claude"}
```

## User Workflow

### 1. Landing Page
- Enter repository path (e.g., `~/projects/myapp`)
- Optionally add Obsidian vault path
- Select active AI models
- Click "Start Session"

### 2. Workspace Page
- View loaded context (files and vault notes)
- See live output from AI models
- Monitor operation progress

### 3. Operation Selection
- Choose from: explain, architect, test-gen, refactor
- Each operation has specific prompts and context selection

### 4. Results Page
- View completed output
- See files changed
- Access Bob report (if Bob was used)

## Features

### Smart Context Loading
The context engine intelligently selects 4-6 most relevant files instead of loading entire repositories:
- Prioritizes key files (README, package.json, main.py, etc.)
- Operation-specific selection (e.g., finds files without tests for test-gen)
- Saves thousands of tokens per request

### Multi-Model Support
Run operations with different AI providers:
- **Claude** (Anthropic): Best for architecture and explanations
- **Gemini** (Google): Fast and cost-effective
- **LM Studio**: Local models, no API costs
- **Bob**: Native IBM Bob integration

### Real-Time Streaming
Watch AI output as it's generated via Server-Sent Events (SSE):
- No polling required
- Instant feedback
- Multiple models can stream simultaneously

### Session History
All sessions are logged to `bob-reports/`:
- Markdown format
- Includes full output
- Timestamped for easy reference

## Troubleshooting

### Backend Won't Start

**Error**: `ImportError: attempted relative import with no known parent package`

**Solution**: Run uvicorn from project root, not from backend directory:
```bash
# ✅ Correct
uvicorn backend.main:app --reload --port 8001

# ❌ Wrong
cd backend && uvicorn main:app --reload --port 8001
```

### Frontend Can't Connect to Backend

**Error**: `Failed to fetch` or CORS errors

**Solution**: 
1. Verify backend is running on port 8001
2. Check `frontend/vite.config.ts` proxy configuration
3. Restart frontend dev server after config changes

### Port Already in Use

**Error**: `Address already in use`

**Solution**:
```bash
# Find and kill process using port 8001
lsof -ti:8001 | xargs kill

# Or use the stop script
./stop-web.sh
```

### Missing Dependencies

**Error**: `ModuleNotFoundError` or `Cannot find module`

**Solution**:
```bash
# Backend
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

## Development

### Project Structure

```
elith/
├── backend/
│   ├── main.py              # FastAPI app
│   ├── routes/              # API endpoints
│   ├── providers/           # AI model providers
│   ├── context_engine/      # Smart file selection
│   ├── session/             # Session management
│   └── operations/          # Operation prompts
├── frontend/
│   ├── src/
│   │   ├── pages/           # React pages
│   │   ├── components/      # React components
│   │   ├── services/        # API client
│   │   └── stores/          # Zustand state
│   ├── index.html
│   └── vite.config.ts
├── start-web.sh             # Startup script
├── stop-web.sh              # Shutdown script
└── WEB_UI_GUIDE.md          # This file
```

### Adding New Operations

1. Create operation prompt in `backend/operations/`:
```python
def build_my_operation_prompt(context: str) -> str:
    return f"Your prompt here\n\n{context}"
```

2. Add to operation map in `backend/routes/execute.py`:
```python
operation_map = {
    "my-operation": my_operation.build_my_operation_prompt,
    # ...
}
```

3. Add to tasks list in `backend/routes/tasks.py`:
```python
return {
    "operations": ["explain", "architect", "my-operation"]
}
```

### Adding New AI Providers

1. Create provider class in `backend/providers/`:
```python
class MyProvider(BaseProvider):
    def run(self, prompt: str, context: str):
        # Yield output chunks
        yield "Processing..."
```

2. Register in `backend/providers/__init__.py`:
```python
def initialize_providers(repo_path: str):
    providers["my-provider"] = MyProvider(repo_path, api_key)
    return providers
```

## Production Deployment

For production use, replace the dev servers:

### Backend
```bash
# Use gunicorn with uvicorn workers
gunicorn backend.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8001
```

### Frontend
```bash
# Build static files
cd frontend
npm run build

# Serve with nginx, Apache, or any static file server
# Built files are in frontend/dist/
```

## Support

- **Documentation**: See `README.md` and `docs/`
- **API Docs**: http://localhost:8001/docs (when running)
- **Issues**: Check existing issues or create new ones

## License

See LICENSE file in project root.