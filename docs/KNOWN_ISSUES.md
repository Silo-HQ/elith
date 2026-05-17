# Known Issues

## Backend API Issues

### 1. ~~Missing SSE Stream Endpoint~~ ✅ RESOLVED

**Status:** ✅ **RESOLVED** - SSE endpoint exists at `/api/stream/{session_id}`

The SSE streaming endpoint has been implemented in [`backend/routes/stream.py`](../backend/routes/stream.py:10). The endpoint is available at:
```
GET /api/stream/{session_id}
```

**Note:** If TUI is looking for `/api/sessions/{session_id}/stream`, update the TUI to use the correct endpoint path.

---

### 2. ~~LMStudio Provider Initialization Error~~ ✅ RESOLVED

**Status:** ✅ **RESOLVED** - LMStudio provider fixed

The LMStudio provider has been corrected in [`backend/providers/lmstudio_provider.py`](../backend/providers/lmstudio_provider.py:17). It now accepts the correct parameters:
```python
def __init__(self, repo_path: str, base_url: str = "http://localhost:1234/v1", model: str = None)
```

No `api_key` parameter is required for LMStudio since it runs locally.

---

### 3. ~~Merge Conflict in backend/main.py~~ ✅ RESOLVED

**Status:** ✅ **RESOLVED** - Merge conflict resolved

The duplicate `/api/status` endpoint definition and merge conflict markers in [`backend/main.py`](../backend/main.py:51) have been resolved. The file now has a single, clean endpoint definition.

---

## Integration Notes

### SSE Streaming Endpoint

The backend provides SSE streaming at `/api/stream/{session_id}`. Frontend/TUI should:
1. Connect to this endpoint after creating a session
2. Listen for `message` events with JSON data
3. Handle `type: "output"` for content chunks
4. Handle `type: "done"` for completion

### Available API Endpoints

- `/api/stream/{session_id}` - SSE streaming output
- `/api/results/{session_id}` - Get final result
- `/api/tasks/{task_id}/status` - Check task status
- `/api/status` - Backend health and metrics

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
- [x] SSE streaming endpoint exists
- [x] LMStudio provider initialization fixed
- [x] Merge conflict in main.py resolved
- [ ] Real-time responses display (needs TUI endpoint update to `/api/stream/{session_id}`)

---

## Next Steps

**For Backend Team:**
1. ✅ ~~Implement SSE endpoint~~ - Complete
2. ✅ ~~Fix LMStudio provider~~ - Complete
3. ✅ ~~Resolve merge conflict in main.py~~ - Complete
4. Document all API endpoints in OpenAPI/Swagger (visit `/docs` for auto-generated docs)

**For Frontend/TUI Team:**
1. Update SSE connection to use `/api/stream/{session_id}` (not `/api/sessions/{session_id}/stream`)
2. Test real-time streaming with corrected endpoint
3. Verify LMStudio provider works with local models

---

**Last Updated:** 2026-05-17 16:38 UTC
**Status:** ✅ All critical issues resolved - ready for integration testing