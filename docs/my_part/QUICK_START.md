# Elith Backend - Quick Start Guide
**Get started in 5 minutes**

---

## Your Mission

You're the **Architect + Team Lead** for Elith's backend. Your job:
1. Build FastAPI backend that orchestrates everything
2. Create context engine that loads only 4-6 relevant files per task
3. Wire Basil Joy's providers (Bob, Claude, Gemini, OpenAI, Ollama)
4. Integrate with Johann's frontend via REST + SSE
5. Deploy to Railway and demo

---

## Current Status

✅ Team sync done  
✅ API contract agreed with Johann  
✅ Specifications reviewed  
🔄 **Starting Hours 2-4: Backend Foundation**

---

## Next 2 Hours (Hours 2-4)

### Goal
FastAPI backend with `/api/scan` endpoint working.

### Steps

**1. Create project structure (10 min)**
```bash
mkdir -p backend/{models,routes,context_engine,router,session,operations,skills,providers}
touch backend/__init__.py
touch backend/{models,routes,context_engine,router,session,operations}/__init__.py
```

**2. Create config files (10 min)**
- Copy `pyproject.toml` from CODE_TEMPLATES.md
- Copy `requirements.txt` from CODE_TEMPLATES.md
- Copy `.env.example` from CODE_TEMPLATES.md
- Copy `.gitignore` from CODE_TEMPLATES.md

**3. Install dependencies (5 min)**
```bash
pip install -r requirements.txt
```

**4. Build Pydantic models (20 min)**
- Create `backend/models/task_packet.py` (FileInfo, Note, TaskPacket)
- Create `backend/models/session.py` (Session, SessionStatus)
- Copy from CODE_TEMPLATES.md

**5. Build repo scanner (30 min)**
- Create `backend/context_engine/repo_scanner.py`
- Walks directory, skips .git/node_modules
- Marks key files (README.md, main.py, etc.)
- Copy from CODE_TEMPLATES.md

**6. Build vault reader (25 min)**
- Create `backend/context_engine/vault_reader.py`
- Reads .md files from Obsidian vault
- Extracts #tags
- Copy from CODE_TEMPLATES.md

**7. Create FastAPI app (20 min)**
- Create `backend/main.py`
- Add CORS middleware
- Create `backend/routes/scan.py`
- Wire up `/api/scan` endpoint
- Copy from CODE_TEMPLATES.md

**8. Test (10 min)**
```bash
cd backend
uvicorn main:app --reload --port 8000

# In another terminal
curl -X POST http://localhost:8000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"repo_path": "/path/to/test/repo"}'
```

**Expected output:**
```json
{
  "repo_path": "/path/to/repo",
  "files": [...],
  "vault_notes": [],
  "total_files": 42
}
```

---

## Reference Documents

📋 **IMPLEMENTATION_PLAN.md** - Full 48-hour timeline  
💻 **CODE_TEMPLATES.md** - Copy-paste code templates  
🔗 **INTEGRATION_GUIDE.md** - Working with Basil Joy & Johann  
📖 **TASKS_YOU.md** - Original task breakdown  

---

## Key Files to Create (Hours 2-4)

```
✅ pyproject.toml
✅ requirements.txt
✅ .env.example
✅ .gitignore
✅ backend/models/task_packet.py
✅ backend/models/session.py
✅ backend/context_engine/repo_scanner.py
✅ backend/context_engine/vault_reader.py
✅ backend/main.py
✅ backend/routes/scan.py
```

---

## Success Criteria (End of Hour 4)

- [ ] FastAPI server running on port 8000
- [ ] `/api/scan` returns file list for any repo
- [ ] Repo scanner skips .git, node_modules
- [ ] Key files are marked correctly
- [ ] Vault reader handles missing vault gracefully
- [ ] Ready to start Hours 5-8 (Context Engine)

---

## If You Get Stuck

**Repo scanner not finding files?**
- Check path exists: `Path(repo_path).exists()`
- Check permissions
- Print debug info: `print(f"Scanning: {directory}")`

**FastAPI not starting?**
- Check Python version: `python --version` (need 3.10+)
- Reinstall: `pip install -r requirements.txt`
- Check port: `lsof -i :8000`

**CORS errors?**
- Already configured in main.py
- Check frontend URL in allow_origins

**Need help?**
- Message Basil Joy or Johann
- Check INTEGRATION_GUIDE.md
- Review CODE_TEMPLATES.md

---

## After Hours 2-4

**Next phase: Hours 5-8 - Context Engine**
- Build packet_builder.py (smart file selection)
- Create /api/tasks endpoint
- Update /api/execute with context building
- Create model_router.py skeleton

See IMPLEMENTATION_PLAN.md for details.

---

## Quick Commands

```bash
# Start server
cd backend && uvicorn main:app --reload --port 8000

# Test health
curl http://localhost:8000/health

# Test scan
curl -X POST http://localhost:8000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"repo_path": "/path/to/repo"}'

# Install deps
pip install -r requirements.txt

# Run tests (later)
pytest tests/
```

---

## Remember

- **Commit every 2 hours**
- **Sync with team every 8 hours**
- **If blocked, message immediately**
- **Focus on working demo, not perfect code**
- **The goal: Ship in 48 hours**

---

**Ready? Switch to Code mode and start building!**

Use: `/mode code` or click "💻 Code" mode to begin implementation.