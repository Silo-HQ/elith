# Elith — Your Tasks (Architect + Team Lead)
**IBM Bob Hackathon | May 15–17, 2026**  
**Your Role:** General — You design, wire, and integrate everything  
**Rule:** If anyone is blocked, they message you immediately. You unblock them within 30 minutes.

---

## Your Stack
- Python 3.10+
- FastAPI
- pathlib (context engine)
- subprocess (model runner coordination)
- SSE (Server-Sent Events for live streaming to frontend)
- Railway or Render (deployment)

---

## Hour-by-Hour Tasks

---

### Hour 1 — Team Sync (All 3 Together)
```
✓ Share all 5 docs with Basil Joy and Johann
✓ Set up GitHub repo (private for now)
✓ Everyone clones it
✓ Agree on API contract:
    POST /api/scan      → returns task packet JSON
    POST /api/execute   → starts operation, returns session_id
    GET  /api/stream/{session_id} → SSE stream of live output
    GET  /api/models    → returns available configured models
    GET  /api/results/{session_id} → returns session results
✓ Johann gets design reference (Bob Shell screenshot)
✓ Basil Joy confirms Bob shell is installed
✓ Split and go heads down
```

---

### Hours 2–4 — Backend Foundation
```
✓ FastAPI project setup
    └── main.py (app entry)
    └── routes/scan.py
    └── routes/execute.py
    └── routes/stream.py
    └── routes/models.py
    └── models/task_packet.py
    └── models/session.py

✓ Repo scanner
    └── context_engine/repo_scanner.py
    └── walks directory tree
    └── returns: file list, sizes, extensions, key files detected
    └── skip: .git, node_modules, __pycache__, venv

✓ Vault reader
    └── context_engine/vault_reader.py
    └── reads all .md files from obsidian folder
    └── returns: list of notes with content + filename

✓ POST /api/scan endpoint working
    └── takes: repo_path, vault_path (optional)
    └── returns: file tree + vault notes as JSON

Target: curl -X POST /api/scan -d '{"repo_path": "~/projects/test"}'
        returns clean JSON with file tree
```

---

### Hours 5–8 — Context Engine
```
✓ context_engine/packet_builder.py
    └── takes: repo scan + vault notes + task type
    └── scores file relevance for the task:
        - architect task → look for models, config, main files
        - test-gen task  → look for source files without test pairs
        - refactor task  → look for the target module + its imports
        - explain task   → look for entry points, README, main files
    └── returns top 4-6 files only
    └── attaches relevant vault notes (keyword match)

✓ /api/tasks endpoint
    └── returns list of available operations

✓ /api/execute endpoint STUB
    └── accepts: model, operation, repo_path, vault_path
    └── returns: session_id (UUID)
    └── returns mock streaming data for now
    └── (Basil Joy's providers plug in here later)

✓ model_router.py skeleton
    └── empty provider slots ready for Basil Joy to fill

Target: Context engine picks the RIGHT 4-6 files for any task type
        /api/execute returns session_id and mock stream works
```

---

### Hours 9–14 — Full Integration
```
✓ Wire model_router.py to Basil Joy's providers
    └── import bob_provider, claude_provider, etc.
    └── route based on model parameter

✓ /api/execute — real implementation
    └── builds context packet
    └── calls model router
    └── writes output to session store

✓ SSE streaming endpoint
    └── GET /api/stream/{session_id}
    └── yields output chunks as they come from provider
    └── frontend connects to this for live output

✓ Session logger
    └── every session saved to bob-reports/session_{timestamp}.md
    └── includes: model used, task, files loaded, full output

✓ Bob provider integrated end to end

Target: Full loop working with Bob:
        POST /api/execute → Bob shell runs →
        GET /api/stream streams output to frontend
```

---

### Hours 15–22 — Operations + More Providers
```
✓ operations/explain.py
    └── prompt: "Explain this codebase architecture in plain language"
    └── uses context packet (entry points, README, main files)

✓ operations/architect.py
    └── THE KEY OPERATION
    └── prompt engineered to produce non-textbook proposals
    └── output: 2-3 proposals with tradeoffs + migration path
    └── (coordinate with Basil Joy on prompt quality)

✓ operations/test_gen.py
    └── finds source files without test pairs
    └── generates tests matching existing test style

✓ Wire Gemini + OpenAI providers (once Basil Joy has them)
✓ Wire Ollama provider

✓ /api/models endpoint
    └── returns which providers are configured + available

✓ End-to-end test on 3 different real repos
    └── small Python repo
    └── medium JS/TS repo
    └── something with existing tests

Target: 3 operations + 4 providers working reliably
```

---

### Hours 23–28 — Integration + Deployment
```
✓ Full integration test with Johann's frontend
    └── frontend sends task → backend processes → streams back
    └── model switching works
    └── all 3 operations demo correctly

✓ Error handling:
    └── provider not configured → clear error message
    └── repo too large → warn + continue with top files
    └── Bob shell not found → fallback message
    └── API key missing → clear config instructions

✓ Deploy backend to Railway
    └── set environment variables (API keys)
    └── confirm SSE streaming works over HTTPS
    └── test from Johann's deployed frontend

✓ Deploy frontend to Vercel (coordinate with Johann)

Target: Live URL working end to end
```

---

### Hours 29–36 — Demo Preparation
```
✓ Pick demo repo with Basil Joy:
    Criteria:
    - Real public GitHub repo (not a toy project)
    - Medium size (50–200 files)
    - Has some architectural debt worth improving
    - Python or TypeScript preferred
    Suggestions: fastapi, express, a popular open-source tool

✓ Run full Elith workflow on demo repo:
    - explain → capture output
    - architect → capture the proposals (this is the demo moment)
    - test-gen → show tests generated

✓ Run same architect task on Bob → then Claude → show same quality

✓ Ensure all Bob session reports are committed to repo

✓ README final version:
    - What is Elith (2 sentences)
    - How it works (3 bullet points)
    - How to run locally
    - How to configure models
    - Screenshots of TUI + web dashboard
```

---

### Hours 37–44 — Polish
```
✓ Repo cleanup:
    └── remove debug prints
    └── add .env.example with all required keys
    └── requirements.txt final
    └── pyproject.toml final

✓ Make repo public (MIT license in place)
✓ bob-reports/ folder populated with real session exports
✓ Confirm deployment is stable
✓ Final README review
```

---

### Hours 45–47 — Submit
```
✓ GitHub repo public ← confirm
✓ Bob reports in repo ← confirm
✓ Video from Johann ← confirm
✓ Cover image from Johann ← confirm
✓ Fill submission form on lablab.ai:
    └── Title: Elith
    └── Short desc (255 chars): ready
    └── Long desc (100+ words): ready
    └── GitHub URL: ready
    └── Demo URL: ready
✓ SUBMIT
```

### Hour 48 — Buffer Only
```
Do not build. Safety net for submission issues only.
```

---

## API Contract (Share With Johann)

```
Base URL: http://localhost:8000 (dev) / https://elith.up.railway.app (prod)

POST /api/scan
  Body: { "repo_path": string, "vault_path": string? }
  Returns: { files: FileInfo[], vault_notes: Note[], total_files: number }

POST /api/execute
  Body: { "model": string, "operation": string, "repo_path": string, "vault_path": string? }
  Returns: { "session_id": string }

GET /api/stream/{session_id}
  Returns: SSE stream of { "type": "output"|"done"|"error", "content": string, "model": string }

GET /api/models
  Returns: { "available": string[], "configured": string[] }

GET /api/results/{session_id}
  Returns: { "output": string, "files_changed": string[], "report_path": string }
```

---

## Critical Path

These are YOUR blockers to watch:

| Risk | Your Action |
|------|------------|
| Basil Joy stuck on Bob shell flags | Pair with him immediately in first 4 hours |
| SSE streaming breaks on deployment | Test Railway SSE before Hour 28 |
| Providers not ready by Hour 14 | Use mock provider to keep integration moving |
| Johann's frontend can't connect | Check CORS settings first |

---

## Submission Text (Fill This In)

**Title:** Elith

**Short Description (255 chars):**
> Elith gives every AI model — Claude, Gemini, GPT, local LLMs — the same repo-awareness IBM Bob has natively, through an agent skill layer. Any model. Bob-level. Your choice.

**Long Description:**
> Elith is a universal repo-aware agent framework built around IBM Bob's capabilities. IBM Bob is powerful because it lives inside your repository — reading files, writing code, running tests natively. But most developers also use Claude, Gemini, GPT, or local LLMs, which are repo-blind by default. Elith fixes this with a skill layer of 12 agent tools — read_file, write_file, search_code, git_diff, run_tests, and more — injected into any model via tool calling. Every model gets Bob-level repo awareness. Beyond model parity, Elith's context engine loads only task-relevant files (typically 6 of 300+) from the repo and Obsidian-style project memory — eliminating token waste. The novel architecture generator analyzes your actual codebase patterns and proposes non-textbook solutions tailored to your constraints. Bob sets the standard. Elith brings everyone up to it.

---

*Your Task Doc — Elith — IBM Bob Hackathon 2026*
