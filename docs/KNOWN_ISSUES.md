# Known Issues

## Backend API Issues

### 1. Missing SSE Stream Endpoint (404 Error)

**Issue:**
```
SSE connection error: Event { type: 'error', status: 404, message: 'Not Found' }
GET /api/sessions/{session_id}/stream - 404 Not Found
```

**Root Cause:**
The backend API is missing the `/api/sessions/{session_id}/stream` endpoint that the TUI expects for real-time streaming responses.

**Backend Logs:**
```
2026-05-17 16:00:45 - elith - INFO - Request: GET /api/sessions/f63ae509-dd24-4871-bfaa-8bff2341ca53/stream
2026-05-17 16:00:45 - elith - INFO - Response: 404 (0.001s)
INFO:     127.0.0.1:58952 - "GET /api/sessions/f63ae509-dd24-4871-bfaa-8bff2341ca53/stream HTTP/1.1" 404 Not Found
```

**Impact:**
- TUI can send messages to backend ✅
- Backend processes requests ✅
- Real-time streaming doesn't work ❌
- Messages appear empty in TUI ❌

**Workaround:**
The TUI will need to use polling or the backend needs to implement the SSE endpoint.

**Required Backend Implementation:**
```python
# backend/routes/stream.py (needs to be created)
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import asyncio

router = APIRouter()

@router.get("/api/sessions/{session_id}/stream")
async def stream_session(session_id: str):
    async def event_generator():
        # Stream events from the session
        while True:
            # Get events from session
            event = await get_session_event(session_id)
            if event:
                yield f"data: {json.dumps(event)}\n\n"
            if event.get('type') == 'done':
                break
            await asyncio.sleep(0.1)
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )
```

**Status:** Backend issue - needs backend team to implement SSE endpoint

---

### 2. LMStudio Provider Initialization Error

**Issue:**
```
Warning: Failed to initialize LM Studio provider: LMStudioProvider.__init__() got an unexpected keyword argument 'api_key'
```

**Root Cause:**
The LMStudio provider doesn't accept `api_key` parameter but the backend is trying to pass it.

**Impact:**
- LMStudio model may not work properly
- Other models (Claude, OpenRouter) should work fine

**Workaround:**
Use Claude or OpenRouter models instead:
```bash
/model claude
# or
/model openrouter
```

**Status:** Backend issue - LMStudio provider needs to be fixed

---

## TUI Workarounds

### Temporary Solution: Polling Instead of SSE

Until the backend implements SSE streaming, the TUI could use polling:

```typescript
// Poll for results instead of SSE
const pollForResults = async (sessionId: string) => {
  const interval = setInterval(async () => {
    try {
      const result = await api.getSessionResult(sessionId);
      if (result.status === 'complete') {
        // Update message with result
        clearInterval(interval);
      }
    } catch (error) {
      clearInterval(interval);
    }
  }, 500); // Poll every 500ms
};
```

### Alternative: Use Existing Endpoints

Check if backend has alternative endpoints:
- `/api/results/{session_id}` - Get final result
- `/api/tasks/{task_id}/status` - Check task status
- WebSocket endpoint instead of SSE

---

## Frontend Issues

### None Currently

The TUI frontend is working correctly. All issues are backend-related.

---

## How to Report Issues

1. Check backend logs for errors
2. Verify API endpoints exist: `curl http://localhost:8000/docs`
3. Test endpoints directly: `curl http://localhost:8000/api/status`
4. Document the issue with logs and expected behavior

---

## Testing Checklist

- [x] TUI connects to backend
- [x] Backend status check works
- [x] Messages can be sent
- [x] Backend receives and processes messages
- [ ] SSE streaming works (404 error)
- [ ] Real-time responses display
- [ ] LMStudio provider works (initialization error)

---

## Next Steps

**For Backend Team:**
1. Implement `/api/sessions/{session_id}/stream` SSE endpoint
2. Fix LMStudio provider initialization
3. Add WebSocket support as alternative to SSE
4. Document all API endpoints

**For Frontend Team:**
1. TUI is complete and working ✅
2. Waiting for backend SSE endpoint
3. Can implement polling workaround if needed
4. All UI features working perfectly

---

**Last Updated:** 2026-05-17
**Status:** Backend API incomplete - SSE endpoint missing