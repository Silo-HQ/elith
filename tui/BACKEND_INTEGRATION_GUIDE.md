# Backend Integration Guide for TypeScript TUI

This document outlines what needs to be wired between the TypeScript TUI (`tui-ts/`) and the FastAPI backend (`backend/`).

## Current Status

### ✅ Already Implemented (No Work Needed)

**Backend Routes:**
- `GET /api/models` - Returns available and configured models
- `GET /api/stream/{session_id}` - SSE streaming endpoint
- `POST /api/scan` - Repository scanning

**TUI Client:**
- [`tui-ts/src/api/client.ts`](src/api/client.ts) - API client with all methods
- [`tui-ts/src/api/stream.ts`](src/api/stream.ts) - SSE event handler
- [`tui-ts/src/types.ts`](src/types.ts) - Complete type definitions

### ⚠️ Missing Backend Endpoints (Need Implementation)

The TUI expects these endpoints that don't exist yet:

#### 1. Status Endpoint
**TUI expects:** `GET /api/status`
```typescript
interface StatusResponse {
  model: string;
  quota_percent: number;
  ctx_percent: number;
  memory_mb: number;
  tokens: number;
}
```

**Backend needs:** Create `backend/routes/status.py`
```python
@router.get("/status")
async def get_status() -> StatusResponse:
    # Return current system status
    # - Active model name
    # - Token quota usage %
    # - Context window usage %
    # - Memory usage in MB
    # - Total tokens processed
```

#### 2. Session Management Endpoints
**TUI expects:** 
- `POST /api/sessions/{session_id}/approve` - Approve/deny changes
- `GET /api/sessions/{session_id}/context` - Get pinned context files
- `POST /api/sessions/{session_id}/context` - Add file to context

**Backend needs:** Create `backend/routes/sessions.py`
```python
@router.post("/sessions/{session_id}/approve")
async def approve_change(session_id: str, approved: bool):
    # Handle user approval/denial of proposed changes
    
@router.get("/sessions/{session_id}/context")
async def get_context_files(session_id: str) -> List[str]:
    # Return list of files pinned to session context
    
@router.post("/sessions/{session_id}/context")
async def add_context_file(session_id: str, path: str):
    # Add file to session's context
```

#### 3. Enhanced Stream Events
**Current backend:** Only sends `output` and `done` events

**TUI expects:** Rich event types from [`types.ts:148-155`](src/types.ts:148-155)
```typescript
interface StreamEvent {
  type: 'output' | 'thinking' | 'tool' | 'subagent' | 'done' | 'error' | 'approval';
  content?: string;
  model?: string;
  error?: string;
  tool?: ToolCall;
  subagent?: { id: string; label: string };
}
```

**Backend needs:** Update `backend/routes/stream.py` to emit:
- `thinking` events - When agent is analyzing
- `tool` events - When executing skills (read_file, search_code, etc.)
- `subagent` events - When spawning sub-agents
- `approval` events - When awaiting user confirmation
- `error` events - On failures

#### 4. Execute Endpoint Enhancement
**Current:** Basic execution
**TUI expects:** Support for shell passthrough

```typescript
// TUI sends this for ! shell commands
await api.executeShell(command: string)
```

**Backend needs:** Update `backend/routes/execute.py` to handle:
```python
class ExecuteRequest(BaseModel):
    type: str  # 'operation' or 'shell'
    command: Optional[str]  # For shell type
    # ... existing fields
```

## Integration Workflow

### Phase 1: Core Endpoints (Priority: HIGH)
**Owner:** Backend developer

1. Create `backend/routes/status.py`
   - Implement `/api/status` endpoint
   - Return real-time system metrics
   - Update every 5 seconds (TUI polls this)

2. Create `backend/routes/sessions.py`
   - Implement approval workflow
   - Implement context file management
   - Wire to session manager

3. Update `backend/main.py`
   - Add status router: `app.include_router(status.router, prefix="/api", tags=["status"])`
   - Add sessions router: `app.include_router(sessions.router, prefix="/api", tags=["sessions"])`

### Phase 2: Enhanced Streaming (Priority: HIGH)
**Owner:** Backend developer + TUI developer (coordination needed)

1. **Backend:** Update `backend/routes/stream.py`
   - Emit `thinking` events when agent starts analysis
   - Emit `tool` events for each skill execution
   - Emit `subagent` events when spawning sub-agents
   - Emit `approval` events when changes need confirmation

2. **TUI:** Update `tui-ts/src/hooks/useStream.ts`
   - Already handles all event types
   - Just needs backend to send them

### Phase 3: Shell Passthrough (Priority: MEDIUM)
**Owner:** Backend developer

1. Update `backend/routes/execute.py`
   - Add `type` field to ExecuteRequest
   - Handle `type='shell'` by executing command
   - Stream output back via SSE

### Phase 4: File Picker Integration (Priority: MEDIUM)
**Owner:** Backend developer

1. Update `backend/routes/scan.py`
   - Current: Returns TaskPacket
   - Needed: Also support `GET /api/scan?path={path}` returning `FileItem[]`
   - TUI uses this for @ file picker

## Testing the Integration

### 1. Start Backend
```bash
cd backend
python -m uvicorn backend.main:app --reload --port 8000
```

### 2. Start TUI
```bash
cd tui-ts
npm run dev
```

### 3. Test Flow
1. TUI fetches models from `/api/models` ✅ (works now)
2. TUI polls `/api/status` every 5s ❌ (needs implementation)
3. User submits message → TUI calls `/api/execute` ✅ (works now)
4. TUI connects to `/api/stream/{session_id}` ✅ (works now)
5. Backend emits rich events ❌ (needs enhancement)
6. User types `@` → TUI calls `/api/scan` ❌ (needs file list variant)
7. Agent proposes change → Backend emits `approval` event ❌ (needs implementation)
8. User approves → TUI calls `/api/sessions/{id}/approve` ❌ (needs implementation)

## API Contract Summary

### What Backend MUST Provide

| Endpoint | Method | Status | Priority |
|----------|--------|--------|----------|
| `/api/models` | GET | ✅ Exists | - |
| `/api/status` | GET | ❌ Missing | HIGH |
| `/api/scan` | POST | ✅ Exists | - |
| `/api/scan?path=` | GET | ❌ Missing | MEDIUM |
| `/api/execute` | POST | ✅ Exists | - |
| `/api/stream/{id}` | GET | ✅ Exists | - |
| `/api/sessions/{id}/approve` | POST | ❌ Missing | HIGH |
| `/api/sessions/{id}/context` | GET | ❌ Missing | MEDIUM |
| `/api/sessions/{id}/context` | POST | ❌ Missing | MEDIUM |

### What Backend MUST Emit (SSE Events)

| Event Type | Status | Priority |
|------------|--------|----------|
| `output` | ✅ Exists | - |
| `done` | ✅ Exists | - |
| `thinking` | ❌ Missing | HIGH |
| `tool` | ❌ Missing | HIGH |
| `subagent` | ❌ Missing | MEDIUM |
| `approval` | ❌ Missing | HIGH |
| `error` | ❌ Missing | HIGH |

## Who Does What?

### Backend Developer Responsibilities
1. Implement missing endpoints (status, sessions)
2. Enhance SSE streaming with rich event types
3. Add shell command execution support
4. Update scan endpoint for file picker

### TUI Developer Responsibilities
1. ✅ Already done - all client code exists
2. Test integration once backend endpoints are ready
3. Handle edge cases (network errors, timeouts)
4. Polish UI based on real backend responses

### Integration Testing (Both)
1. End-to-end flow testing
2. Error handling verification
3. Performance optimization
4. Documentation updates

## Quick Start for Backend Developer

```bash
# 1. Create missing route files
touch backend/routes/status.py
touch backend/routes/sessions.py

# 2. Implement endpoints following the interfaces above

# 3. Update backend/main.py to include new routers

# 4. Test with TUI
cd tui-ts && npm run dev
```

## Reference Files

**TUI Side:**
- [`tui-ts/src/types.ts`](src/types.ts) - All type definitions
- [`tui-ts/src/api/client.ts`](src/api/client.ts) - API client methods
- [`tui-ts/src/api/stream.ts`](src/api/stream.ts) - SSE handler

**Backend Side:**
- [`backend/main.py`](../backend/main.py) - FastAPI app
- [`backend/routes/`](../backend/routes/) - Existing routes
- [`backend/session/manager.py`](../backend/session/manager.py) - Session management

## Questions?

Contact the TUI developer for:
- Type definitions clarification
- Expected event formats
- UI behavior questions

Contact the backend developer for:
- Endpoint implementation details
- Session management logic
- Skill execution flow

---

**Made with Bob**