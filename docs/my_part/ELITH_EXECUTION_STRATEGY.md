# Elith — 48-Hour Execution Strategy
**IBM Bob Hackathon | May 15–17, 2026**  
**Rule:** Ship a working demo. Not a perfect system.

---

## The Golden Rule

> **A working demo beats a perfect spec every time.**  
> If it runs, it wins. If it doesn't run, it loses.

---

## Team War Roles

| Person | War Role | Critical Path |
|--------|----------|--------------|
| **You** | General — Architect, integrator | Backend wiring + final integration |
| **Basil Joy** | Heavy Weapons — skill layer + providers | The hardest and most impressive part |
| **Johann** | Air Support — UI, demo, presentation | Works independently, never blocked |

---

## Three Parallel Tracks

```
TRACK A (You)              TRACK B (Basil Joy)         TRACK C (Johann)
─────────────              ───────────────────         ────────────────
FastAPI backend            Skill layer (12 skills)     TUI (Textual)
Context engine             Bob provider (native)        React dashboard
Repo scanner               Claude provider + skills     Component design
Vault reader               Gemini provider + skills     Demo slides
API endpoints              OpenAI provider + skills     README polish
Model router               Ollama provider + skills     Cover image
Final integration          Novel arch prompts           Video recording
```

---

## Hour-by-Hour War Plan

---

### 🔴 PHASE 1 — Foundation (Hours 1–8)

**Hour 1 — All 3 Together**
- Share all 4 docs with team
- Set up shared GitHub repo (private for now)
- Everyone clones it
- Agree on API contract between backend and frontend
- Split and go heads down immediately

---

**Hours 2–4 — You**
```
✓ FastAPI project setup (main.py, routes, models)
✓ Repo scanner — walks directory, returns file tree
✓ Vault reader — reads markdown files from obsidian folder
✓ Packet builder — combines scan + vault into task packet
✓ /api/scan endpoint working

Target: POST /api/scan returns clean task packet JSON
```

**Hours 2–4 — Basil Joy**
```
✓ Build base_skill.py — abstract interface all skills implement
✓ Build base_provider.py — abstract interface all providers implement
✓ Implement read_file.py skill (most important)
✓ Implement list_files.py skill
✓ Implement search_code.py skill
✓ Implement write_file.py skill

Target: 4 core skills working and tested locally
```

**Hours 2–4 — Johann**
```
✓ React + Tailwind project setup
✓ Design system (CSS vars, fonts from spec)
✓ TopBar + Sidebar shell layout
✓ Landing page (repo input, model toggles)
✓ Placeholder panels for workspace

Target: App loads, looks right, landing page works
```

---

**Hours 5–8 — You**
```
✓ Context engine — smart file relevance scoring
✓ Pick top 4-6 files for any given task type
✓ /api/tasks endpoint
✓ /api/execute endpoint stub (returns mock data)
✓ model_router.py skeleton

Target: Context engine picks RIGHT files for any task
```

**Hours 5–8 — Basil Joy**
```
✓ git_diff.py skill
✓ git_commit.py skill
✓ run_tests.py skill
✓ find_references.py skill
✓ analyze_dependencies.py skill
✓ bob_provider.py — IBM Bob shell runner (no skills needed)

Target: Bob running natively + 8 skills complete
```

**Hours 5–8 — Johann**
```
✓ Workspace page layout (4 panels)
✓ ContextPreview component (mock data)
✓ LiveOutput component (mock streaming)
✓ ProposalCard component (mock proposals)
✓ TUI: WelcomeScreen done

Target: Full web UI visible with mock data
```

---

### 🟡 PHASE 2 — Integration (Hours 9–28)

**Hours 9–14 — You**
```
✓ Wire model_router.py to providers
✓ /api/execute — real implementation
✓ SSE streaming endpoint for live output
✓ Session logger → bob-reports/ folder
✓ Bob provider integrated end to end

Target: Full loop working with Bob:
        UI sends task → context built →
        Bob runs → output streams to UI
```

**Hours 9–14 — Basil Joy**
```
✓ claude_provider.py — Anthropic API + inject all skills as tools
✓ Test: Claude reads a real file via read_file skill
✓ Test: Claude writes a real file via write_file skill
✓ gemini_provider.py — Google AI + skills as functions
✓ Test: Gemini operates at Bob level on same task

Target: Claude + Gemini both working at Bob-level
        via Elith skill layer
```

**Hours 9–14 — Johann**
```
✓ TUI: WorkspaceScreen done
✓ TUI: ExecutionScreen (live multi-model output panels)
✓ Web: Connect to real API endpoints
✓ Web: SSE streaming working in LiveOutput
✓ Web: Model toggle actually enables/disables providers

Target: Both TUI and web connect to real backend
```

**Hours 15–22 — You**
```
✓ ollama_provider.py (local LLM)
✓ openai_provider.py (GPT/Codex)
✓ architect.py operation — novel arch generator
✓ test_gen.py operation
✓ explain.py operation
✓ End-to-end test on 3 real repos

Target: 3 operations + 4 providers all working
```

**Hours 15–22 — Basil Joy**
```
✓ explain_function.py skill
✓ install_package.py skill
✓ read_logs.py skill
✓ Master prompt for novel architecture generation
✓ Iterate prompt until output is genuinely impressive
✓ Test architect operation on 5 different repos
✓ Each proposal must be specific + non-generic

Target: Novel arch proposals that impress a senior dev
        on ANY provider (Bob or Claude or Gemini)
```

**Hours 15–22 — Johann**
```
✓ TUI: ProposalsScreen done
✓ TUI: ResultsScreen done
✓ Web: ProposalsPage with real data
✓ Web: ResultsPage with real data
✓ Web: Animations + loading states
✓ Settings page (API key inputs per provider)

Target: Full UI flow working end to end
```

**Hours 23–28 — All Together**
```
✓ Full integration test
✓ Run same task on Bob → then Claude → same quality output
✓ Fix integration bugs
✓ Error handling (provider down, repo too large, etc.)
✓ Deploy backend to Railway or Render
✓ Deploy frontend to Vercel

Target: System runs reliably on any medium-sized repo
        with any configured provider
```

---

### 🟢 PHASE 3 — Demo + Submit (Hours 29–48)

**Hours 29–36 — Demo Preparation**
```
You + Basil Joy:
✓ Pick demo repo (real, public, recognizable, medium size)
✓ Run full Elith workflow on it
✓ Run on Bob first — capture output
✓ Run same task on Claude with skills — show same quality
✓ Capture most impressive novel arch proposals
✓ Ensure Bob session reports committed to repo

Johann:
✓ Record demo video draft (2-3 mins)
✓ Build 5-slide pitch deck
✓ Final cover image
✓ Write all submission text fields
```

**Hours 37–44 — Polish Sprint**
```
You:
✓ README final version
✓ Repo cleaned up, public, MIT licensed
✓ bob-reports/ folder populated with real exports
✓ Deployment confirmed working

Basil Joy:
✓ Review all Bob reports for quality
✓ Pick 3 most impressive for video highlight

Johann:
✓ Final video edit
✓ Final slide polish
✓ Submission form completely filled and ready
```

**Hours 45–47 — Submit**
```
✓ GitHub repo public
✓ Bob reports exported and committed
✓ Video uploaded
✓ Cover image uploaded
✓ All submission fields filled
✓ SUBMIT
```

**Hour 48 — Buffer**
```
DO NOT BUILD. Safety net only.
For: submission form issues, upload failures,
     last minute bugs, deployment problems.
```

---

## Critical Path

**Three things that kill you if they break:**

**1. Skill layer tool calling (Basil Joy — Hours 2–8)**  
If Claude/Gemini can't call skills properly, the core innovation is gone.  
Mitigation: Test read_file first. If one skill works, all will work.

**2. Novel architecture output quality (Basil Joy — Hours 15–22)**  
If proposals are generic, your killer feature is dead.  
Mitigation: 6–8 hours of prompt iteration. This is worth the time.

**3. End-to-end integration (You — Hours 9–14)**  
If the full loop breaks, nothing to demo.  
Mitigation: Build integration stub at Hour 4. Always have mock data fallback.

---

## Contingency Plans

| Risk | Plan |
|------|------|
| Bob shell won't run non-interactively | Demo with Claude + skills only. Bob = "coming soon with IDE version" |
| Skill tool calling fails on a provider | Drop that provider. Demo with 2 providers instead of 4 |
| Novel arch output is generic | Extra 4 hours prompt engineering. This is the top priority |
| Integration takes too long | Demo with mock data. Explain architecture verbally to judges |
| Deployment fails | Demo locally on screen recording. No live URL still wins |

---

## The Demo Script (What Judges See)

```
"Let me show you Elith."

1. Open Elith → point to real GitHub repo

2. Select IBM Bob → run "architect auth module"
   → Elith loads 6 files, not 312
   → Bob proposes novel JWT+Redis hybrid (not generic JWT)
   → Bob implements it

3. Switch to Claude
   → "Watch what happens when I run the same task on Claude"
   → Elith activates skill layer
   → Claude reads files via read_file()
   → Claude proposes same quality architecture
   → Same result as Bob

4. Switch to Local LLM (no internet, no API keys)
   → "Same task. Completely offline."
   → Local model operates at Bob level via skills
   → Works.

"Any model. Bob-level. Your choice."
```

**Total demo time: 3 minutes. Judges have never seen this.**

---

## Communication Protocol

- WhatsApp group — all 3 members
- Sync call every 8 hours (Hours 1, 9, 17, 25, 33, 41)
- Blocked? Message immediately — max 1 hour on a blocker alone
- GitHub: commit every 2 hours minimum

---

## What Winning Looks Like

| Criterion | How Elith Wins |
|-----------|---------------|
| **Bob Application** | Bob is the native gold standard. Elith replicates it everywhere. Reports prove usage. |
| **Presentation** | The "same task, 3 providers" demo is unforgettable |
| **Business Value** | "Works with any model your company already pays for" |
| **Originality** | Nobody else built a skill layer to replicate Bob across providers |

---

*Elith Execution Strategy — IBM Bob Hackathon 2026*
