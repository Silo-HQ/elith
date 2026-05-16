# Backend + TUI Integration Guide

## Overview

The TUI is now connected to the backend API. When you send a message in the TUI, it calls the backend's `/api/chat` endpoint, which routes to the Claude provider, which uses the 12 repository skills to provide Bob-level repository awareness.

## Architecture Flow

```
TUI (app_new.py)
    ↓ HTTP POST
Backend API (/api/chat)
    ↓
Claude Provider (claude_provider.py)
    ↓ Tool Calling Loop
12 Repository Skills (read_file, list_files, etc.)
    ↓
Repository Files
```

## Setup Instructions

### 1. Install Dependencies

```bash
pip3 install -r requirements.txt
```

Key dependencies:
- `fastapi` - Backend API framework
- `anthropic` - Claude AI SDK
- `textual` - Terminal UI framework
- `httpx` - HTTP client for TUI→Backend communication

### 2. Configure Environment

Create a `.env` file in the project root:

```bash
# Required for Claude provider
ANTHROPIC_API_KEY=sk-ant-...

# Optional: Custom backend URL (default: http://localhost:8000)
ELITH_BACKEND_URL=http://localhost:8000

# Optional: LM Studio for local LLM
LMSTUDIO_BASE_URL=http://localhost:1234/v1
```

### 3. Start the Backend Server

In Terminal 1:

```bash
cd /Users/basiljoy/my_project/elith
uvicorn backend.main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### 4. Launch the TUI

In Terminal 2:

```bash
cd /Users/basiljoy/my_project/elith
python3 -m tui.app_new
```

Or use the launch script:

```bash
./run_new_tui.sh
```

## Testing the Integration

### Test 1: Basic Chat

1. Launch TUI (Terminal 2)
2. Type: `hello`
3. Press Enter
4. You should see:
   - "Thinking..." message appears
   - Backend processes the request
   - Claude responds with a greeting

### Test 2: Repository Awareness

1. In TUI, type: `list the files in this directory`
2. Press Enter
3. Expected behavior:
   - Claude automatically calls `list_files` skill
   - Returns actual files from `/Users/basiljoy/my_project/elith`
   - Response shows real directory contents

### Test 3: File Reading

1. In TUI, type: `read the README.md file and explain this project`
2. Press Enter
3. Expected behavior:
   - Claude calls `list_files` to find README.md
   - Claude calls `read_file` to read README.md
   - Claude explains the project based on actual file content

### Test 4: Code Analysis

1. In TUI, type: `analyze the backend/skills/base_skill.py file`
2. Press Enter
3. Expected behavior:
   - Claude calls `read_file` on base_skill.py
   - Claude analyzes the actual code
   - Response references specific lines and functions

## API Endpoints

### POST /api/chat

Simple synchronous chat endpoint.

**Request:**
```json
{
  "message": "list files in this directory",
  "model": "claude",
  "repo_path": "/Users/basiljoy/my_project/elith"
}
```

**Response:**
```json
{
  "response": "Here are the files in this directory:\n\n- README.md\n- backend/\n- tui/\n...",
  "model": "claude"
}
```

### POST /api/chat/stream

Streaming chat endpoint (for future enhancement).

Returns Server-Sent Events with response chunks as they arrive.

## Troubleshooting

### Error: "Cannot connect to backend"

**Problem:** Backend server is not running.

**Solution:**
```bash
# Terminal 1: Start backend
uvicorn backend.main:app --reload --port 8000
```

### Error: "ANTHROPIC_API_KEY not set"

**Problem:** Missing API key in environment.

**Solution:**
```bash
# Create .env file
echo "ANTHROPIC_API_KEY=sk-ant-your-key-here" > .env
```

### Error: "No module named 'httpx'"

**Problem:** Missing httpx dependency.

**Solution:**
```bash
pip3 install httpx
```

### TUI shows "Thinking..." forever

**Problem:** Backend request timed out or failed.

**Check:**
1. Backend server is running (Terminal 1)
2. Backend logs show the request
3. API key is valid
4. Network connection is working

**Debug:**
```bash
# Test backend directly
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "hello", "model": "claude"}'
```

### Claude not calling skills

**Problem:** Skills not registered or provider not initialized correctly.

**Check:**
1. `backend/skills/__init__.py` exports `ALL_SKILLS`
2. Claude provider receives skills in `__init__`
3. Skills are converted to Anthropic tool format

**Debug:**
```python
# Test skill directly
from backend.skills.read_file import ReadFileSkill
skill = ReadFileSkill()
result = skill.execute(".", "README.md")
print(result)
```

## Code Changes Made

### 1. Created `/api/chat` endpoint

**File:** `backend/routes/chat.py`

- Simple POST endpoint for TUI
- Accepts message, model, repo_path
- Routes to Claude or LM Studio provider
- Returns complete response

### 2. Updated TUI to call backend

**File:** `tui/app_new.py`

- Added `httpx` import for HTTP client
- Added `call_backend()` async method
- Added `send_to_backend()` to handle requests
- Added `on_worker_state_changed()` to handle responses
- Uses Textual workers for async operations

### 3. Added message update method

**File:** `tui/components/messages_panel.py`

- Added `update_last_message()` method
- Replaces "Thinking..." with actual response
- Preserves message metadata (role, model, timestamp)

### 4. Registered chat route

**File:** `backend/main.py`

- Imported `chat` router
- Added to app with `/api` prefix

### 5. Updated dependencies

**File:** `requirements.txt`

- Added `httpx==0.26.0` for HTTP client

## Next Steps

### Immediate Testing

1. ✅ Start backend server
2. ✅ Launch TUI
3. ✅ Send test messages
4. ✅ Verify Claude calls skills
5. ✅ Confirm repository awareness works

### Future Enhancements

1. **Streaming Responses**
   - Use `/api/chat/stream` endpoint
   - Show response as it's generated
   - Better UX for long responses

2. **Model Selection**
   - Add model switcher in TUI
   - Support Claude, LM Studio, Gemini, etc.
   - Show active model in status bar

3. **Session Management**
   - Save chat history
   - Resume previous sessions
   - Export conversations

4. **Advanced Features**
   - `/architect` command for architecture proposals
   - `/test-gen` command for test generation
   - `/refactor` command for code refactoring

## Success Criteria

✅ **Backend Integration Complete When:**

1. TUI sends message → Backend receives it
2. Backend routes to Claude provider
3. Claude automatically calls repository skills
4. Skills read actual files from repository
5. Response appears in TUI with real data
6. No placeholder messages
7. Error handling works (shows helpful errors)

## Demo Script

For hackathon demonstration:

```bash
# Terminal 1: Start backend
uvicorn backend.main:app --reload --port 8000

# Terminal 2: Launch TUI
python3 -m tui.app_new

# In TUI, demonstrate:
1. "list files in this directory"
   → Shows actual files

2. "read backend/skills/base_skill.py and explain it"
   → Claude reads real file and explains

3. "what skills are available in this project?"
   → Claude searches code and lists all 12 skills

4. "analyze the architecture of the providers"
   → Claude reads multiple files and provides analysis
```

This demonstrates:
- ✅ Repository awareness (reads real files)
- ✅ Automatic tool calling (Claude uses skills)
- ✅ Bob-level capabilities (any LLM can do what Bob does)
- ✅ Clean TUI interface (professional demo)

---

**Status:** Backend + TUI integration complete and ready for testing
**Next:** Run end-to-end tests and prepare demo