# Elith Backend Implementation Plan
**Your Role:** Architect + Team Lead  
**Current Status:** Starting Hours 2-4 - Backend Foundation

---

## Quick Reference

### API Contract (Agreed with Johann)
```
POST /api/scan       → Scan repo and vault
POST /api/execute    → Start operation, return session_id
GET  /api/stream/{session_id} → SSE stream of output
GET  /api/models     → Available/configured models
GET  /api/results/{session_id} → Session results
GET  /api/tasks      → Available operations
```

### Critical Dependencies
- **Basil Joy**: Provides all providers + skill layer
- **Johann**: Consumes your API for TUI + React frontend
- **You**: Backend orchestration, context engine, integration

---

## Project Structure

```
elith/
├── backend/
│   ├── main.py                    # FastAPI entry
│   ├── models/                    # Pydantic models
│   │   ├── task_packet.py
│   │   └── session.py
│   ├── routes/                    # API endpoints
│   │   ├── scan.py
│   │   ├── execute.py
│   │   ├── stream.py
│   │   ├── models.py
│   │   ├── results.py
│   │   └── tasks.py
│   ├── context_engine/            # Smart file selection
│   │   ├── repo_scanner.py
│   │   ├── vault_reader.py
│   │   └── packet_builder.py
│   ├── router/
│   │   └── model_router.py
│   ├── session/
│   │   ├── manager.py
│   │   └── logger.py
│   ├── operations/
│   │   ├── explain.py
│   │   ├── architect.py
│   │   └── test_gen.py
│   ├── skills/                    # Basil Joy owns
│   └── providers/                 # Basil Joy owns
├── bob-reports/                   # Auto-generated
└── obsidian-template/
```

---

## Implementation Phases

### HOURS 2-4: Backend Foundation ✅ CURRENT
**Goal:** FastAPI + repo scanner + vault reader + /api/scan working

**Tasks:**
1. Create `pyproject.toml`, `requirements.txt`, `.env.example`, `.gitignore`
2. Build Pydantic models (`task_packet.py`, `session.py`)
3. Implement `repo_scanner.py` - walks directory, skips .git/node_modules
4. Implement `vault_reader.py` - reads .md files from Obsidian vault
5. Create `main.py` with FastAPI app + CORS
6. Create `/api/scan` endpoint
7. Test with curl

**Success Criteria:**
```bash
curl -X POST http://localhost:8000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"repo_path": "/path/to/repo"}'
# Returns: {files: [...], vault_notes: [...], total_files: N}
```

---

### HOURS 5-8: Context Engine
**Goal:** Smart file selection - only 4-6 relevant files per task

**Tasks:**
1. Build `packet_builder.py` with task-specific file selection
2. Create `/api/tasks` endpoint (list operations)
3. Update `/api/execute` to build minimal context
4. Create `model_router.py` skeleton
5. Test context selection on different task types

**Success Criteria:**
- Architect task → loads main.py, config files, key modules (6 files max)
- Test-gen task → loads source files without tests (4 files max)
- Context string includes file contents, not just paths

---

### HOURS 9-14: Full Integration
**Goal:** End-to-end flow working with Bob

**Tasks:**
1. Build `session/manager.py` - track active sessions
2. Build `session/logger.py` - export to bob-reports/
3. Implement real `/api/execute` with background tasks
4. Implement SSE `/api/stream/{session_id}`
5. Update `/api/results/{session_id}`
6. Wire Bob provider when Basil Joy provides it
7. Test full loop: execute → stream → results

**Success Criteria:**
- POST /api/execute returns session_id
- GET /api/stream streams output in real-time
- Session auto-exports to bob-reports/session_*.md
- Bob runs natively without skills

---

### HOURS 15-22: Operations + Providers
**Goal:** 3 operations + 4 providers working

**Tasks:**
1. Create `operations/explain.py` - explain codebase prompt
2. Create `operations/architect.py` - novel architecture prompt (CRITICAL)
3. Create `operations/test_gen.py` - test generation prompt
4. Wire Claude provider (when Basil Joy provides)
5. Wire Gemini provider (when Basil Joy provides)
6. Wire OpenAI provider (when Basil Joy provides)
7. Wire Ollama provider (when Basil Joy provides)
8. Implement `/api/models` - check configured providers
9. Test on 3 real repos (Python, JS/TS, mixed)

**Success Criteria:**
- Same task runs on Bob → Claude → Gemini → same quality
- Novel architecture proposals are repo-specific, not generic
- All 3 operations work on all 4 providers

---

### HOURS 23-28: Integration + Deployment
**Goal:** Live system working end-to-end

**Tasks:**
1. Full integration test with Johann's frontend
2. Add error handling (provider down, repo too large, etc.)
3. Deploy backend to Railway
4. Configure environment variables
5. Test SSE streaming over HTTPS
6. Test from Johann's deployed frontend

**Success Criteria:**
- Live URL working: https://elith.up.railway.app
- Frontend connects and streams output
- Model switching works
- Error messages are clear

---

### HOURS 29-36: Demo Preparation
**Goal:** Perfect demo workflow

**Tasks:**
1. Pick demo repo with Basil Joy (50-200 files, real project)
2. Run full workflow: explain → architect → test-gen
3. Capture impressive architecture proposals
4. Ensure Bob reports in bob-reports/
5. Test demo script multiple times

**Demo Script:**
```
1. Open Elith → point to demo repo
2. Select Bob → run "architect auth module"
   → Shows 6 files loaded (not 312)
   → Bob proposes novel JWT+Redis hybrid
3. Switch to Claude → same task
   → Elith activates skills
   → Claude proposes same quality architecture
4. "Any model. Bob-level. Your choice."
```

---

### HOURS 37-44: Polish + Submit
**Goal:** Submission ready

**Tasks:**
1. README final version
2. Repo cleanup (remove debug prints)
3. Confirm bob-reports/ populated
4. Make repo public
5. Final deployment check
6. Submit on lablab.ai

---

## Critical Path Risks

| Risk | Mitigation |
|------|-----------|
| Basil Joy's providers not ready by Hour 14 | Use mock provider, keep integration moving |
| SSE streaming breaks on Railway | Test Railway SSE early, have fallback |
| Novel arch output is generic | 6-8 hours prompt iteration (worth it) |
| Johann's frontend can't connect | Check CORS settings first |

---

## Communication Protocol

- Sync call every 8 hours (Hours 1, 9, 17, 25, 33, 41)
- Blocked? Message immediately - max 1 hour alone
- Commit every 2 hours minimum
- Update this plan as you discover issues

---

## Next Steps

You're starting **HOURS 2-4**. Begin with:

1. Create project structure files (pyproject.toml, etc.)
2. Build Pydantic models
3. Implement repo_scanner.py
4. Implement vault_reader.py
5. Create FastAPI app with /api/scan
6. Test with curl

**Switch to Code mode when ready to implement.**

---

*Last Updated: 2026-05-16 09:10 IST*