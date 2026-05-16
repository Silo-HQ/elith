**User:**

<task>
lets start my part ?
</task>
<environment_details>
# VSCode Visible Files
docs/ELITH_TUI_SPEC.md

# VSCode Open Tabs
docs/ELITH_TUI_SPEC.md,AGENTS.md,.bob/rules-code/AGENTS.md,.bob/rules-advanced/AGENTS.md,.bob/rules-ask/AGENTS.md,.bob/rules-plan/AGENTS.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-16T03:39:54.182Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.00

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>plan</slug>
<name>📝 Plan</name>


# Current Workspace Directory (/Volumes/DataVault/Projects/elith) Files
agent.md
AGENTS.md
.bob/
docs/
docs/ELITH_AGENT_SKILLS.md
docs/ELITH_TUI_SPEC.md
docs/ELITH_UX_SPEC.md
docs/TASKS_BASIL_JOY.md
docs/TASKS_JOHANN.md
docs/my_part/
docs/my_part/ELITH_EXECUTION_STRATEGY.md
docs/my_part/ELITH_PROJECT_SPEC_backup.md
docs/my_part/ELITH_PROJECT_SPEC.md
docs/my_part/TASKS_YOU.md
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

I'll help you get started with your part of the project! Let me first understand what tasks are assigned to you and gather context about the current state.

<read_file>
<args>
  <file>
    <path>docs/my_part/TASKS_YOU.md</path>
  </file>
</args>
</read_file>

---

**User:**

[read_file for 'docs/my_part/TASKS_YOU.md'. Reading multiple files at once is more efficient for the LLM. If other files are relevant to your current task, please read them simultaneously.] Result:
<files>
<file><path>docs/my_part/TASKS_YOU.md</path>
<content lines="1-305">
  1 | # Elith — Your Tasks (Architect + Team Lead)
  2 | **IBM Bob Hackathon | May 15–17, 2026**  
  3 | **Your Role:** General — You design, wire, and integrate everything  
  4 | **Rule:** If anyone is blocked, they message you immediately. You unblock them within 30 minutes.
  5 | 
  6 | ---
  7 | 
  8 | ## Your Stack
  9 | - Python 3.10+
 10 | - FastAPI
 11 | - pathlib (context engine)
 12 | - subprocess (model runner coordination)
 13 | - SSE (Server-Sent Events for live streaming to frontend)
 14 | - Railway or Render (deployment)
 15 | 
 16 | ---
 17 | 
 18 | ## Hour-by-Hour Tasks
 19 | 
 20 | ---
 21 | 
 22 | ### Hour 1 — Team Sync (All 3 Together)
 23 | ```
 24 | ✓ Share all 5 docs with Basil Joy and Johann
 25 | ✓ Set up GitHub repo (private for now)
 26 | ✓ Everyone clones it
 27 | ✓ Agree on API contract:
 28 |     POST /api/scan      → returns task packet JSON
 29 |     POST /api/execute   → starts operation, returns session_id
 30 |     GET  /api/stream/{session_id} → SSE stream of live output
 31 |     GET  /api/models    → returns available configured models
 32 |     GET  /api/results/{session_id} → returns session results
 33 | ✓ Johann gets design reference (Bob Shell screenshot)
 34 | ✓ Basil Joy confirms Bob shell is installed
 35 | ✓ Split and go heads down
 36 | ```
 37 | 
 38 | ---
 39 | 
 40 | ### Hours 2–4 — Backend Foundation
 41 | ```
 42 | ✓ FastAPI project setup
 43 |     └── main.py (app entry)
 44 |     └── routes/scan.py
 45 |     └── routes/execute.py
 46 |     └── routes/stream.py
 47 |     └── routes/models.py
 48 |     └── models/task_packet.py
 49 |     └── models/session.py
 50 | 
 51 | ✓ Repo scanner
 52 |     └── context_engine/repo_scanner.py
 53 |     └── walks directory tree
 54 |     └── returns: file list, sizes, extensions, key files detected
 55 |     └── skip: .git, node_modules, __pycache__, venv
 56 | 
 57 | ✓ Vault reader
 58 |     └── context_engine/vault_reader.py
 59 |     └── reads all .md files from obsidian folder
 60 |     └── returns: list of notes with content + filename
 61 | 
 62 | ✓ POST /api/scan endpoint working
 63 |     └── takes: repo_path, vault_path (optional)
 64 |     └── returns: file tree + vault notes as JSON
 65 | 
 66 | Target: curl -X POST /api/scan -d '{"repo_path": "~/projects/test"}'
 67 |         returns clean JSON with file tree
 68 | ```
 69 | 
 70 | ---
 71 | 
 72 | ### Hours 5–8 — Context Engine
 73 | ```
 74 | ✓ context_engine/packet_builder.py
 75 |     └── takes: repo scan + vault notes + task type
 76 |     └── scores file relevance for the task:
 77 |         - architect task → look for models, config, main files
 78 |         - test-gen task  → look for source files without test pairs
 79 |         - refactor task  → look for the target module + its imports
 80 |         - explain task   → look for entry points, README, main files
 81 |     └── returns top 4-6 files only
 82 |     └── attaches relevant vault notes (keyword match)
 83 | 
 84 | ✓ /api/tasks endpoint
 85 |     └── returns list of available operations
 86 | 
 87 | ✓ /api/execute endpoint STUB
 88 |     └── accepts: model, operation, repo_path, vault_path
 89 |     └── returns: session_id (UUID)
 90 |     └── returns mock streaming data for now
 91 |     └── (Basil Joy's providers plug in here later)
 92 | 
 93 | ✓ model_router.py skeleton
 94 |     └── empty provider slots ready for Basil Joy to fill
 95 | 
 96 | Target: Context engine picks the RIGHT 4-6 files for any task type
 97 |         /api/execute returns session_id and mock stream works
 98 | ```
 99 | 
100 | ---
101 | 
102 | ### Hours 9–14 — Full Integration
103 | ```
104 | ✓ Wire model_router.py to Basil Joy's providers
105 |     └── import bob_provider, claude_provider, etc.
106 |     └── route based on model parameter
107 | 
108 | ✓ /api/execute — real implementation
109 |     └── builds context packet
110 |     └── calls model router
111 |     └── writes output to session store
112 | 
113 | ✓ SSE streaming endpoint
114 |     └── GET /api/stream/{session_id}
115 |     └── yields output chunks as they come from provider
116 |     └── frontend connects to this for live output
117 | 
118 | ✓ Session logger
119 |     └── every session saved to bob-reports/session_{timestamp}.md
120 |     └── includes: model used, task, files loaded, full output
121 | 
122 | ✓ Bob provider integrated end to end
123 | 
124 | Target: Full loop working with Bob:
125 |         POST /api/execute → Bob shell runs →
126 |         GET /api/stream streams output to frontend
127 | ```
128 | 
129 | ---
130 | 
131 | ### Hours 15–22 — Operations + More Providers
132 | ```
133 | ✓ operations/explain.py
134 |     └── prompt: "Explain this codebase architecture in plain language"
135 |     └── uses context packet (entry points, README, main files)
136 | 
137 | ✓ operations/architect.py
138 |     └── THE KEY OPERATION
139 |     └── prompt engineered to produce non-textbook proposals
140 |     └── output: 2-3 proposals with tradeoffs + migration path
141 |     └── (coordinate with Basil Joy on prompt quality)
142 | 
143 | ✓ operations/test_gen.py
144 |     └── finds source files without test pairs
145 |     └── generates tests matching existing test style
146 | 
147 | ✓ Wire Gemini + OpenAI providers (once Basil Joy has them)
148 | ✓ Wire Ollama provider
149 | 
150 | ✓ /api/models endpoint
151 |     └── returns which providers are configured + available
152 | 
153 | ✓ End-to-end test on 3 different real repos
154 |     └── small Python repo
155 |     └── medium JS/TS repo
156 |     └── something with existing tests
157 | 
158 | Target: 3 operations + 4 providers working reliably
159 | ```
160 | 
161 | ---
162 | 
163 | ### Hours 23–28 — Integration + Deployment
164 | ```
165 | ✓ Full integration test with Johann's frontend
166 |     └── frontend sends task → backend processes → streams back
167 |     └── model switching works
168 |     └── all 3 operations demo correctly
169 | 
170 | ✓ Error handling:
171 |     └── provider not configured → clear error message
172 |     └── repo too large → warn + continue with top files
173 |     └── Bob shell not found → fallback message
174 |     └── API key missing → clear config instructions
175 | 
176 | ✓ Deploy backend to Railway
177 |     └── set environment variables (API keys)
178 |     └── confirm SSE streaming works over HTTPS
179 |     └── test from Johann's deployed frontend
180 | 
181 | ✓ Deploy frontend to Vercel (coordinate with Johann)
182 | 
183 | Target: Live URL working end to end
184 | ```
185 | 
186 | ---
187 | 
188 | ### Hours 29–36 — Demo Preparation
189 | ```
190 | ✓ Pick demo repo with Basil Joy:
191 |     Criteria:
192 |     - Real public GitHub repo (not a toy project)
193 |     - Medium size (50–200 files)
194 |     - Has some architectural debt worth improving
195 |     - Python or TypeScript preferred
196 |     Suggestions: fastapi, express, a popular open-source tool
197 | 
198 | ✓ Run full Elith workflow on demo repo:
199 |     - explain → capture output
200 |     - architect → capture the proposals (this is the demo moment)
201 |     - test-gen → show tests generated
202 | 
203 | ✓ Run same architect task on Bob → then Claude → show same quality
204 | 
205 | ✓ Ensure all Bob session reports are committed to repo
206 | 
207 | ✓ README final version:
208 |     - What is Elith (2 sentences)
209 |     - How it works (3 bullet points)
210 |     - How to run locally
211 |     - How to configure models
212 |     - Screenshots of TUI + web dashboard
213 | ```
214 | 
215 | ---
216 | 
217 | ### Hours 37–44 — Polish
218 | ```
219 | ✓ Repo cleanup:
220 |     └── remove debug prints
221 |     └── add .env.example with all required keys
222 |     └── requirements.txt final
223 |     └── pyproject.toml final
224 | 
225 | ✓ Make repo public (MIT license in place)
226 | ✓ bob-reports/ folder populated with real session exports
227 | ✓ Confirm deployment is stable
228 | ✓ Final README review
229 | ```
230 | 
231 | ---
232 | 
233 | ### Hours 45–47 — Submit
234 | ```
235 | ✓ GitHub repo public ← confirm
236 | ✓ Bob reports in repo ← confirm
237 | ✓ Video from Johann ← confirm
238 | ✓ Cover image from Johann ← confirm
239 | ✓ Fill submission form on lablab.ai:
240 |     └── Title: Elith
241 |     └── Short desc (255 chars): ready
242 |     └── Long desc (100+ words): ready
243 |     └── GitHub URL: ready
244 |     └── Demo URL: ready
245 | ✓ SUBMIT
246 | ```
247 | 
248 | ### Hour 48 — Buffer Only
249 | ```
250 | Do not build. Safety net for submission issues only.
251 | ```
252 | 
253 | ---
254 | 
255 | ## API Contract (Share With Johann)
256 | 
257 | ```
258 | Base URL: http://localhost:8000 (dev) / https://elith.up.railway.app (prod)
259 | 
260 | POST /api/scan
261 |   Body: { "repo_path": string, "vault_path": string? }
262 |   Returns: { files: FileInfo[], vault_notes: Note[], total_files: number }
263 | 
264 | POST /api/execute
265 |   Body: { "model": string, "operation": string, "repo_path": string, "vault_path": string? }
266 |   Returns: { "session_id": string }
267 | 
268 | GET /api/stream/{session_id}
269 |   Returns: SSE stream of { "type": "output"|"done"|"error", "content": string, "model": string }
270 | 
271 | GET /api/models
272 |   Returns: { "available": string[], "configured": string[] }
273 | 
274 | GET /api/results/{session_id}
275 |   Returns: { "output": string, "files_changed": string[], "report_path": string }
276 | ```
277 | 
278 | ---
279 | 
280 | ## Critical Path
281 | 
282 | These are YOUR blockers to watch:
283 | 
284 | | Risk | Your Action |
285 | |------|------------|
286 | | Basil Joy stuck on Bob shell flags | Pair with him immediately in first 4 hours |
287 | | SSE streaming breaks on deployment | Test Railway SSE before Hour 28 |
288 | | Providers not ready by Hour 14 | Use mock provider to keep integration moving |
289 | | Johann's frontend can't connect | Check CORS settings first |
290 | 
291 | ---
292 | 
293 | ## Submission Text (Fill This In)
294 | 
295 | **Title:** Elith
296 | 
297 | **Short Description (255 chars):**
298 | > Elith gives every AI model — Claude, Gemini, GPT, local LLMs — the same repo-awareness IBM Bob has natively, through an agent skill layer. Any model. Bob-level. Your choice.
299 | 
300 | **Long Description:**
301 | > Elith is a universal repo-aware agent framework built around IBM Bob's capabilities. IBM Bob is powerful because it lives inside your repository — reading files, writing code, running tests natively. But most developers also use Claude, Gemini, GPT, or local LLMs, which are repo-blind by default. Elith fixes this with a skill layer of 12 agent tools — read_file, write_file, search_code, git_diff, run_tests, and more — injected into any model via tool calling. Every model gets Bob-level repo awareness. Beyond model parity, Elith's context engine loads only task-relevant files (typically 6 of 300+) from the repo and Obsidian-style project memory — eliminating token waste. The novel architecture generator analyzes your actual codebase patterns and proposes non-textbook solutions tailored to your constraints. Bob sets the standard. Elith brings everyone up to it.
302 | 
303 | ---
304 | 
305 | *Your Task Doc — Elith — IBM Bob Hackathon 2026*
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
docs/ELITH_TUI_SPEC.md

# VSCode Open Tabs
docs/ELITH_TUI_SPEC.md,AGENTS.md,.bob/rules-code/AGENTS.md,.bob/rules-advanced/AGENTS.md,.bob/rules-ask/AGENTS.md,.bob/rules-plan/AGENTS.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-16T03:39:57.787Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.04

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>plan</slug>
<name>📝 Plan</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

Let me gather more context about the project specifications and execution strategy to understand the full scope.

<read_file>
<args>
  <file>
    <path>docs/my_part/ELITH_PROJECT_SPEC.md</path>
  </file>
  <file>
    <path>docs/my_part/ELITH_EXECUTION_STRATEGY.md</path>
  </file>
  <file>
    <path>docs/ELITH_AGENT_SKILLS.md</path>
  </file>
</args>
</read_file>

---

**User:**

[read_file for 'docs/my_part/ELITH_PROJECT_SPEC.md', 'docs/my_part/ELITH_EXECUTION_STRATEGY.md', 'docs/ELITH_AGENT_SKILLS.md'] Result:
<files>
<file><path>docs/my_part/ELITH_PROJECT_SPEC.md</path>
<content lines="1-369">
  1 | # Elith — Universal Repo-Aware Agent Framework
  2 | **Project Name:** Elith  
  3 | **Hackathon:** IBM Bob Hackathon — lablab.ai (May 15–17, 2026)  
  4 | **Team:** [Your Team Name]  
  5 | **Tagline:** *Every model. Bob-level repo awareness. One framework.*
  6 | 
  7 | ---
  8 | 
  9 | ## The Core Idea
 10 | 
 11 | IBM Bob is powerful because it **lives inside your repository**. It reads files, writes code, runs tests, and understands your entire codebase natively — no API calls, no context stuffing, no guessing.
 12 | 
 13 | Every other model — Claude, Gemini, GPT, Local LLM — is smart but **blind**. They only know what you paste into the prompt.
 14 | 
 15 | **Elith fixes this.**
 16 | 
 17 | Elith gives every model the same repo-awareness Bob has natively — through a skill layer of agent tools. Bob is the standard. Elith brings everyone up to it.
 18 | 
 19 | > "IBM Bob is so powerful we built a whole framework to replicate its capabilities across every model."
 20 | 
 21 | ---
 22 | 
 23 | ## The Problem
 24 | 
 25 | AI-assisted development fails in three ways:
 26 | 
 27 | **1. Most models are repo-blind.**  
 28 | Claude, Gemini, GPT — they're powerful reasoners but they can't read your files, run your tests, or commit your changes. You have to paste everything manually. Context gets bloated. Output quality drops.
 29 | 
 30 | **2. AI gives textbook solutions, not production-ready ones.**  
 31 | Ask any model to architect a system and it gives you the generic answer. It never proposes a hybrid CQRS pattern because your specific read/write ratio demands it. It never suggests a strangler fig migration because your constraints require it. Real senior engineers don't give textbook answers.
 32 | 
 33 | **3. Context bloat kills focus.**  
 34 | Loading an entire repo into a context window wastes tokens and reduces output quality. You need the right 6 files, not all 312.
 35 | 
 36 | ---
 37 | 
 38 | ## The Solution — Elith
 39 | 
 40 | ```
 41 | IBM Bob    → repo-aware natively (the gold standard)
 42 | Other LLMs → repo-blind by default
 43 | 
 44 | Elith      → gives every model Bob-level repo skills
 45 |              via agent tool calling
 46 | ```
 47 | 
 48 | Elith is a **universal repo-aware agent framework** with three layers:
 49 | 
 50 | > **Work Smarter:** Obsidian is the database. Context window is working memory. Only load what the current task needs.
 51 | 
 52 | > **Work Faster:** Novel, production-ready architectures tailored to your actual codebase — not textbook answers.
 53 | 
 54 | > **Work Universally:** Any model, any provider. Bob natively. Everyone else via Elith's agent skill layer.
 55 | 
 56 | ---
 57 | 
 58 | ## System Architecture
 59 | 
 60 | ```
 61 | ┌──────────────────────────────────────────────────────────────────┐
 62 | │                           ELITH                                  │
 63 | │          Universal Repo-Aware Agent Framework                    │
 64 | ├──────────────────┬───────────────────┬───────────────────────────┤
 65 | │  MEMORY LAYER    │  CONTEXT ENGINE   │  AGENT LAYER              │
 66 | │                  │                   │                           │
 67 | │  Obsidian Vault  │  Elith Selector   │  IBM Bob                  │
 68 | │  (long-term)     │                   │  (native repo access)     │
 69 | │                  │  • Reads vault    │                           │
 70 | │  • Architecture  │  • Scans repo     │  Claude + Skills          │
 71 | │    notes         │  • Picks only     │  Gemini + Skills          │
 72 | │  • Decisions     │    what task      │  GPT/Codex + Skills       │
 73 | │  • Standards     │    needs          │  Local LLM + Skills       │
 74 | │  • Tech debt     │  • Routes to      │                           │
 75 | │  • Task briefs   │    right model    │  ↓                        │
 76 | │                  │                   │  ELITH SKILL LAYER        │
 77 | │                  │                   │  (agent tool calling)     │
 78 | │                  │                   │  read_file, write_file    │
 79 | │                  │                   │  search_code, git_diff    │
 80 | │                  │                   │  run_tests, find_refs...  │
 81 | └──────────────────┴───────────────────┴───────────────────────────┘
 82 |                               ↓
 83 |                     YOUR REPOSITORY (any codebase)
 84 | ```
 85 | 
 86 | ---
 87 | 
 88 | ## The Skill Layer — Making Every Model Bob-Level
 89 | 
 90 | This is Elith's core innovation. When a non-Bob model is selected, Elith wraps it with agent tools that replicate what Bob does natively.
 91 | 
 92 | ### Bob vs Elith-Skilled Model
 93 | 
 94 | | Capability | IBM Bob | Claude/Gemini/GPT + Elith Skills |
 95 | |-----------|---------|----------------------------------|
 96 | | Read any file | ✅ Native | ✅ `read_file(path)` |
 97 | | Browse directory | ✅ Native | ✅ `list_files(path)` |
 98 | | Write/edit files | ✅ Native | ✅ `write_file(path, content)` |
 99 | | Search codebase | ✅ Native | ✅ `search_code(query)` |
100 | | View git diff | ✅ Native | ✅ `git_diff(branch?)` |
101 | | Commit changes | ✅ Native | ✅ `git_commit(message)` |
102 | | Run tests | ✅ Native | ✅ `run_tests(path?)` |
103 | | Find references | ✅ Native | ✅ `find_references(symbol)` |
104 | | Analyze dependencies | ✅ Native | ✅ `analyze_dependencies()` |
105 | | Explain function | ✅ Native | ✅ `explain_function(path, fn)` |
106 | | Install packages | ✅ Native | ✅ `install_package(name)` |
107 | | Read error logs | ✅ Native | ✅ `read_logs(path?)` |
108 | 
109 | **Result:** Every model in Elith operates at Bob-level repo awareness. The user picks any model they prefer — the skill layer handles the rest.
110 | 
111 | ---
112 | 
113 | ## Multi-Model Support
114 | 
115 | Elith works with any provider the user configures:
116 | 
117 | | Model | Provider | How It Gets Repo Skills |
118 | |-------|---------|------------------------|
119 | | **IBM Bob** | IBM Bob Shell | Native — no skills needed |
120 | | **Claude** | Anthropic API | Elith skill layer (tool calling) |
121 | | **Gemini** | Google AI SDK | Elith skill layer (function calling) |
122 | | **GPT-4 / Codex** | OpenAI API | Elith skill layer (tool calling) |
123 | | **Mistral** | Mistral API | Elith skill layer |
124 | | **Local LLM** | Ollama | Elith skill layer (tool calling) |
125 | | **Any OpenAI-compatible** | Custom endpoint | Elith skill layer |
126 | 
127 | User configures which models they have access to. Elith activates only the configured ones. Bob is always the default if available.
128 | 
129 | ---
130 | 
131 | ## The Two Pillars
132 | 
133 | ### Pillar 1 — Work Smarter (Context Engine)
134 | 
135 | ```
136 | Developer selects task
137 |         ↓
138 | Elith reads Obsidian vault (long-term memory)
139 |         ↓
140 | Elith scans repo structure
141 |         ↓
142 | Builds MINIMAL focused task packet:
143 |   → Only 4-6 relevant files (not 312)
144 |   → Only relevant vault notes
145 |   → Only relevant past decisions
146 |         ↓
147 | Routes to chosen model
148 |         ↓
149 | Bob runs natively
150 | OR other model runs with Elith skill layer
151 | ```
152 | 
153 | ### Pillar 2 — Work Faster (Novel Architecture Generation)
154 | 
155 | Every model gives textbook solutions. Elith + any model gives the *right* solution for your specific codebase.
156 | 
157 | ```
158 | Model reads your FULL repository (via skills or natively)
159 |         ↓
160 | Elith analyzes:
161 |   • Actual code patterns
162 |   • Current architecture style  
163 |   • Tech debt and constraints
164 |   • Module dependencies
165 |   • Performance bottlenecks
166 |         ↓
167 | Proposes 2-3 NOVEL architectures:
168 |   • Tailored to YOUR codebase
169 |   • With tradeoff analysis
170 |   • With migration path
171 |   • With production-readiness checklist
172 |         ↓
173 | Developer picks one → Model implements it
174 | ```
175 | 
176 | | What you ask | Standard AI answer | Elith answer |
177 | |---|---|---|
178 | | "Structure this service?" | Generic MVC/REST | Hybrid CQRS — your read:write is 20:1 |
179 | | "Migrate this legacy system?" | Full rewrite | Strangler Fig — you can't stop the business |
180 | | "Handle state?" | Redux | Event sourcing — you need audit trails |
181 | 
182 | ---
183 | 
184 | ## Operations
185 | 
186 | | Operation | What It Does | Models That Can Run It |
187 | |-----------|-------------|----------------------|
188 | | `explain` | Explains repo architecture in plain language | All |
189 | | `risk-scan` | Identifies risky or fragile files | All |
190 | | `architect` | Proposes novel architectures tailored to codebase | All |
191 | | `refactor` | Safely refactors target module | All |
192 | | `test-gen` | Generates missing tests | All |
193 | | `document` | Writes/updates documentation | All |
194 | | `harden` | Adds production-readiness improvements | All |
195 | | `review-summary` | "What changed and why" for reviewers | All |
196 | 
197 | ---
198 | 
199 | ## How IBM Bob Fits (Hackathon Compliance)
200 | 
201 | Bob is the **native gold standard** that Elith is built around. The entire skill layer exists because Bob is so capable — Elith replicates that capability for every other model.
202 | 
203 | Bob is used for:
204 | - Setting the capability benchmark every other model is measured against
205 | - Leading repo-aware execution when available
206 | - Producing exportable session reports for judging evidence
207 | 
208 | For the demo: Bob runs first and natively. Then the same task runs on Claude with Elith skills. Judges see Bob's level — then see Elith match it on any model.
209 | 
210 | ---
211 | 
212 | ## User Flow (Demo)
213 | 
214 | ```
215 | 1. User opens Elith, points to repo
216 | 
217 | 2. Selects model: IBM Bob (default)
218 |    → Bob runs natively
219 |    → Proposes novel auth architecture
220 |    → Implements it
221 | 
222 | 3. User switches to Claude
223 |    → Elith activates skill layer
224 |    → Claude reads same files via read_file()
225 |    → Same quality output, same repo awareness
226 |    → Same result
227 | 
228 | 4. User switches to Local LLM (offline)
229 |    → Elith activates skill layer
230 |    → Local model operates at Bob level
231 |    → No API keys needed
232 | 
233 | Judges see: "Any model. Bob-level. Your choice."
234 | ```
235 | 
236 | ---
237 | 
238 | ## Tech Stack
239 | 
240 | | Layer | Technology |
241 | |-------|-----------|
242 | | Orchestration | Python 3.10+ |
243 | | API Layer | FastAPI |
244 | | Context Engine | Python + pathlib |
245 | | Model Router | Python (custom) |
246 | | Agent Skill Layer | Python tool calling (per provider) |
247 | | Bob Integration | IBM Bob Shell (CLI) |
248 | | Claude Integration | Anthropic API (tool_use) |
249 | | Gemini Integration | Google AI SDK (function_calling) |
250 | | GPT Integration | OpenAI API (tool_calling) |
251 | | Local LLM | Ollama (tool_calling) |
252 | | Terminal UI | Textual (Python) |
253 | | Web Dashboard | React + TypeScript + Tailwind |
254 | | Memory Layer | Obsidian (markdown folder) |
255 | 
256 | ---
257 | 
258 | ## Project Structure
259 | 
260 | ```
261 | elith/
262 | ├── README.md
263 | ├── pyproject.toml
264 | ├── .gitignore
265 | ├── LICENSE (MIT)
266 | │
267 | ├── backend/
268 | │   ├── main.py                         # FastAPI entry
269 | │   ├── router/
270 | │   │   └── model_router.py             # Routes to right model
271 | │   ├── context_engine/
272 | │   │   ├── vault_reader.py             # Reads Obsidian vault
273 | │   │   ├── repo_scanner.py             # Scans repo structure
274 | │   │   └── packet_builder.py           # Builds task packets
275 | │   ├── skills/                         # THE CORE INNOVATION
276 | │   │   ├── base_skill.py               # Abstract skill interface
277 | │   │   ├── read_file.py
278 | │   │   ├── write_file.py
279 | │   │   ├── list_files.py
280 | │   │   ├── search_code.py
281 | │   │   ├── git_diff.py
282 | │   │   ├── git_commit.py
283 | │   │   ├── run_tests.py
284 | │   │   ├── find_references.py
285 | │   │   ├── analyze_dependencies.py
286 | │   │   ├── explain_function.py
287 | │   │   ├── install_package.py
288 | │   │   └── read_logs.py
289 | │   ├── providers/                      # One file per model provider
290 | │   │   ├── base_provider.py            # Abstract provider interface
291 | │   │   ├── bob_provider.py             # IBM Bob shell (native)
292 | │   │   ├── claude_provider.py          # Anthropic API + skills
293 | │   │   ├── gemini_provider.py          # Google AI + skills
294 | │   │   ├── openai_provider.py          # OpenAI/Codex + skills
295 | │   │   ├── ollama_provider.py          # Local LLM + skills
296 | │   │   └── custom_provider.py          # Any OpenAI-compatible API
297 | │   └── operations/
298 | │       ├── explain.py
299 | │       ├── risk_scan.py
300 | │       ├── architect.py                # Novel arch generator
301 | │       ├── refactor.py
302 | │       ├── test_gen.py
303 | │       ├── document.py
304 | │       ├── harden.py
305 | │       └── review_summary.py
306 | │
307 | ├── tui/                                # Terminal UI (Textual)
308 | │   ├── app.py
309 | │   ├── screens/
310 | │   └── components/
311 | │
312 | ├── frontend/                           # Web Dashboard (React)
313 | │   ├── src/
314 | │   │   ├── App.tsx
315 | │   │   ├── components/
316 | │   │   └── stores/
317 | │   └── package.json
318 | │
319 | ├── obsidian-template/
320 | └── bob-reports/
321 | ```
322 | 
323 | ---
324 | 
325 | ## Team Roles
326 | 
327 | | Person | Role | Owns |
328 | |--------|------|------|
329 | | **[You]** | Architect + Lead | FastAPI, model router, context engine, integration |
330 | | **Basil Joy** | AI/ML Core | All providers, skill layer, novel arch generator, prompts |
331 | | **Johann** | UI/UX | TUI + React dashboard, slides, README, demo video |
332 | 
333 | ---
334 | 
335 | ## MVP (48 Hours)
336 | 
337 | **Must ship:**
338 | - Skill layer working for at least 2 non-Bob models
339 | - Bob running natively
340 | - Context engine loading minimal relevant files
341 | - 3 operations: explain, architect, test-gen
342 | - Novel architecture proposals on a real repo
343 | - TUI showing live output
344 | - React dashboard showing context + proposals + results
345 | - Bob session reports auto-exported
346 | - Demo: same task on Bob → then Claude with skills → same quality
347 | 
348 | **Phase 2:**
349 | - Shannon security testing
350 | - Full Obsidian API
351 | - VS Code extension
352 | - More providers (Mistral, Cohere, etc.)
353 | 
354 | ---
355 | 
356 | ## One-Line Pitch
357 | 
358 | > Elith is a universal repo-aware agent framework that gives every AI model — Claude, Gemini, GPT, local LLMs — the same codebase skills IBM Bob has natively, so developers can work with any model at Bob-level quality.
359 | 
360 | ---
361 | 
362 | ## Taglines
363 | - *Every model. Bob-level. Your choice.*
364 | - *Bob sets the standard. Elith brings everyone up to it.*
365 | - *Load less. Think deeper. Ship better.*
366 | 
367 | ---
368 | 
369 | *Private working document — Elith Hackathon Team — IBM Bob Hackathon May 2026*
</content>
</file>
<file><path>docs/my_part/ELITH_EXECUTION_STRATEGY.md</path>
<content lines="1-355">
  1 | # Elith — 48-Hour Execution Strategy
  2 | **IBM Bob Hackathon | May 15–17, 2026**  
  3 | **Rule:** Ship a working demo. Not a perfect system.
  4 | 
  5 | ---
  6 | 
  7 | ## The Golden Rule
  8 | 
  9 | > **A working demo beats a perfect spec every time.**  
 10 | > If it runs, it wins. If it doesn't run, it loses.
 11 | 
 12 | ---
 13 | 
 14 | ## Team War Roles
 15 | 
 16 | | Person | War Role | Critical Path |
 17 | |--------|----------|--------------|
 18 | | **You** | General — Architect, integrator | Backend wiring + final integration |
 19 | | **Basil Joy** | Heavy Weapons — skill layer + providers | The hardest and most impressive part |
 20 | | **Johann** | Air Support — UI, demo, presentation | Works independently, never blocked |
 21 | 
 22 | ---
 23 | 
 24 | ## Three Parallel Tracks
 25 | 
 26 | ```
 27 | TRACK A (You)              TRACK B (Basil Joy)         TRACK C (Johann)
 28 | ─────────────              ───────────────────         ────────────────
 29 | FastAPI backend            Skill layer (12 skills)     TUI (Textual)
 30 | Context engine             Bob provider (native)        React dashboard
 31 | Repo scanner               Claude provider + skills     Component design
 32 | Vault reader               Gemini provider + skills     Demo slides
 33 | API endpoints              OpenAI provider + skills     README polish
 34 | Model router               Ollama provider + skills     Cover image
 35 | Final integration          Novel arch prompts           Video recording
 36 | ```
 37 | 
 38 | ---
 39 | 
 40 | ## Hour-by-Hour War Plan
 41 | 
 42 | ---
 43 | 
 44 | ### 🔴 PHASE 1 — Foundation (Hours 1–8)
 45 | 
 46 | **Hour 1 — All 3 Together**
 47 | - Share all 4 docs with team
 48 | - Set up shared GitHub repo (private for now)
 49 | - Everyone clones it
 50 | - Agree on API contract between backend and frontend
 51 | - Split and go heads down immediately
 52 | 
 53 | ---
 54 | 
 55 | **Hours 2–4 — You**
 56 | ```
 57 | ✓ FastAPI project setup (main.py, routes, models)
 58 | ✓ Repo scanner — walks directory, returns file tree
 59 | ✓ Vault reader — reads markdown files from obsidian folder
 60 | ✓ Packet builder — combines scan + vault into task packet
 61 | ✓ /api/scan endpoint working
 62 | 
 63 | Target: POST /api/scan returns clean task packet JSON
 64 | ```
 65 | 
 66 | **Hours 2–4 — Basil Joy**
 67 | ```
 68 | ✓ Build base_skill.py — abstract interface all skills implement
 69 | ✓ Build base_provider.py — abstract interface all providers implement
 70 | ✓ Implement read_file.py skill (most important)
 71 | ✓ Implement list_files.py skill
 72 | ✓ Implement search_code.py skill
 73 | ✓ Implement write_file.py skill
 74 | 
 75 | Target: 4 core skills working and tested locally
 76 | ```
 77 | 
 78 | **Hours 2–4 — Johann**
 79 | ```
 80 | ✓ React + Tailwind project setup
 81 | ✓ Design system (CSS vars, fonts from spec)
 82 | ✓ TopBar + Sidebar shell layout
 83 | ✓ Landing page (repo input, model toggles)
 84 | ✓ Placeholder panels for workspace
 85 | 
 86 | Target: App loads, looks right, landing page works
 87 | ```
 88 | 
 89 | ---
 90 | 
 91 | **Hours 5–8 — You**
 92 | ```
 93 | ✓ Context engine — smart file relevance scoring
 94 | ✓ Pick top 4-6 files for any given task type
 95 | ✓ /api/tasks endpoint
 96 | ✓ /api/execute endpoint stub (returns mock data)
 97 | ✓ model_router.py skeleton
 98 | 
 99 | Target: Context engine picks RIGHT files for any task
100 | ```
101 | 
102 | **Hours 5–8 — Basil Joy**
103 | ```
104 | ✓ git_diff.py skill
105 | ✓ git_commit.py skill
106 | ✓ run_tests.py skill
107 | ✓ find_references.py skill
108 | ✓ analyze_dependencies.py skill
109 | ✓ bob_provider.py — IBM Bob shell runner (no skills needed)
110 | 
111 | Target: Bob running natively + 8 skills complete
112 | ```
113 | 
114 | **Hours 5–8 — Johann**
115 | ```
116 | ✓ Workspace page layout (4 panels)
117 | ✓ ContextPreview component (mock data)
118 | ✓ LiveOutput component (mock streaming)
119 | ✓ ProposalCard component (mock proposals)
120 | ✓ TUI: WelcomeScreen done
121 | 
122 | Target: Full web UI visible with mock data
123 | ```
124 | 
125 | ---
126 | 
127 | ### 🟡 PHASE 2 — Integration (Hours 9–28)
128 | 
129 | **Hours 9–14 — You**
130 | ```
131 | ✓ Wire model_router.py to providers
132 | ✓ /api/execute — real implementation
133 | ✓ SSE streaming endpoint for live output
134 | ✓ Session logger → bob-reports/ folder
135 | ✓ Bob provider integrated end to end
136 | 
137 | Target: Full loop working with Bob:
138 |         UI sends task → context built →
139 |         Bob runs → output streams to UI
140 | ```
141 | 
142 | **Hours 9–14 — Basil Joy**
143 | ```
144 | ✓ claude_provider.py — Anthropic API + inject all skills as tools
145 | ✓ Test: Claude reads a real file via read_file skill
146 | ✓ Test: Claude writes a real file via write_file skill
147 | ✓ gemini_provider.py — Google AI + skills as functions
148 | ✓ Test: Gemini operates at Bob level on same task
149 | 
150 | Target: Claude + Gemini both working at Bob-level
151 |         via Elith skill layer
152 | ```
153 | 
154 | **Hours 9–14 — Johann**
155 | ```
156 | ✓ TUI: WorkspaceScreen done
157 | ✓ TUI: ExecutionScreen (live multi-model output panels)
158 | ✓ Web: Connect to real API endpoints
159 | ✓ Web: SSE streaming working in LiveOutput
160 | ✓ Web: Model toggle actually enables/disables providers
161 | 
162 | Target: Both TUI and web connect to real backend
163 | ```
164 | 
165 | **Hours 15–22 — You**
166 | ```
167 | ✓ ollama_provider.py (local LLM)
168 | ✓ openai_provider.py (GPT/Codex)
169 | ✓ architect.py operation — novel arch generator
170 | ✓ test_gen.py operation
171 | ✓ explain.py operation
172 | ✓ End-to-end test on 3 real repos
173 | 
174 | Target: 3 operations + 4 providers all working
175 | ```
176 | 
177 | **Hours 15–22 — Basil Joy**
178 | ```
179 | ✓ explain_function.py skill
180 | ✓ install_package.py skill
181 | ✓ read_logs.py skill
182 | ✓ Master prompt for novel architecture generation
183 | ✓ Iterate prompt until output is genuinely impressive
184 | ✓ Test architect operation on 5 different repos
185 | ✓ Each proposal must be specific + non-generic
186 | 
187 | Target: Novel arch proposals that impress a senior dev
188 |         on ANY provider (Bob or Claude or Gemini)
189 | ```
190 | 
191 | **Hours 15–22 — Johann**
192 | ```
193 | ✓ TUI: ProposalsScreen done
194 | ✓ TUI: ResultsScreen done
195 | ✓ Web: ProposalsPage with real data
196 | ✓ Web: ResultsPage with real data
197 | ✓ Web: Animations + loading states
198 | ✓ Settings page (API key inputs per provider)
199 | 
200 | Target: Full UI flow working end to end
201 | ```
202 | 
203 | **Hours 23–28 — All Together**
204 | ```
205 | ✓ Full integration test
206 | ✓ Run same task on Bob → then Claude → same quality output
207 | ✓ Fix integration bugs
208 | ✓ Error handling (provider down, repo too large, etc.)
209 | ✓ Deploy backend to Railway or Render
210 | ✓ Deploy frontend to Vercel
211 | 
212 | Target: System runs reliably on any medium-sized repo
213 |         with any configured provider
214 | ```
215 | 
216 | ---
217 | 
218 | ### 🟢 PHASE 3 — Demo + Submit (Hours 29–48)
219 | 
220 | **Hours 29–36 — Demo Preparation**
221 | ```
222 | You + Basil Joy:
223 | ✓ Pick demo repo (real, public, recognizable, medium size)
224 | ✓ Run full Elith workflow on it
225 | ✓ Run on Bob first — capture output
226 | ✓ Run same task on Claude with skills — show same quality
227 | ✓ Capture most impressive novel arch proposals
228 | ✓ Ensure Bob session reports committed to repo
229 | 
230 | Johann:
231 | ✓ Record demo video draft (2-3 mins)
232 | ✓ Build 5-slide pitch deck
233 | ✓ Final cover image
234 | ✓ Write all submission text fields
235 | ```
236 | 
237 | **Hours 37–44 — Polish Sprint**
238 | ```
239 | You:
240 | ✓ README final version
241 | ✓ Repo cleaned up, public, MIT licensed
242 | ✓ bob-reports/ folder populated with real exports
243 | ✓ Deployment confirmed working
244 | 
245 | Basil Joy:
246 | ✓ Review all Bob reports for quality
247 | ✓ Pick 3 most impressive for video highlight
248 | 
249 | Johann:
250 | ✓ Final video edit
251 | ✓ Final slide polish
252 | ✓ Submission form completely filled and ready
253 | ```
254 | 
255 | **Hours 45–47 — Submit**
256 | ```
257 | ✓ GitHub repo public
258 | ✓ Bob reports exported and committed
259 | ✓ Video uploaded
260 | ✓ Cover image uploaded
261 | ✓ All submission fields filled
262 | ✓ SUBMIT
263 | ```
264 | 
265 | **Hour 48 — Buffer**
266 | ```
267 | DO NOT BUILD. Safety net only.
268 | For: submission form issues, upload failures,
269 |      last minute bugs, deployment problems.
270 | ```
271 | 
272 | ---
273 | 
274 | ## Critical Path
275 | 
276 | **Three things that kill you if they break:**
277 | 
278 | **1. Skill layer tool calling (Basil Joy — Hours 2–8)**  
279 | If Claude/Gemini can't call skills properly, the core innovation is gone.  
280 | Mitigation: Test read_file first. If one skill works, all will work.
281 | 
282 | **2. Novel architecture output quality (Basil Joy — Hours 15–22)**  
283 | If proposals are generic, your killer feature is dead.  
284 | Mitigation: 6–8 hours of prompt iteration. This is worth the time.
285 | 
286 | **3. End-to-end integration (You — Hours 9–14)**  
287 | If the full loop breaks, nothing to demo.  
288 | Mitigation: Build integration stub at Hour 4. Always have mock data fallback.
289 | 
290 | ---
291 | 
292 | ## Contingency Plans
293 | 
294 | | Risk | Plan |
295 | |------|------|
296 | | Bob shell won't run non-interactively | Demo with Claude + skills only. Bob = "coming soon with IDE version" |
297 | | Skill tool calling fails on a provider | Drop that provider. Demo with 2 providers instead of 4 |
298 | | Novel arch output is generic | Extra 4 hours prompt engineering. This is the top priority |
299 | | Integration takes too long | Demo with mock data. Explain architecture verbally to judges |
300 | | Deployment fails | Demo locally on screen recording. No live URL still wins |
301 | 
302 | ---
303 | 
304 | ## The Demo Script (What Judges See)
305 | 
306 | ```
307 | "Let me show you Elith."
308 | 
309 | 1. Open Elith → point to real GitHub repo
310 | 
311 | 2. Select IBM Bob → run "architect auth module"
312 |    → Elith loads 6 files, not 312
313 |    → Bob proposes novel JWT+Redis hybrid (not generic JWT)
314 |    → Bob implements it
315 | 
316 | 3. Switch to Claude
317 |    → "Watch what happens when I run the same task on Claude"
318 |    → Elith activates skill layer
319 |    → Claude reads files via read_file()
320 |    → Claude proposes same quality architecture
321 |    → Same result as Bob
322 | 
323 | 4. Switch to Local LLM (no internet, no API keys)
324 |    → "Same task. Completely offline."
325 |    → Local model operates at Bob level via skills
326 |    → Works.
327 | 
328 | "Any model. Bob-level. Your choice."
329 | ```
330 | 
331 | **Total demo time: 3 minutes. Judges have never seen this.**
332 | 
333 | ---
334 | 
335 | ## Communication Protocol
336 | 
337 | - WhatsApp group — all 3 members
338 | - Sync call every 8 hours (Hours 1, 9, 17, 25, 33, 41)
339 | - Blocked? Message immediately — max 1 hour on a blocker alone
340 | - GitHub: commit every 2 hours minimum
341 | 
342 | ---
343 | 
344 | ## What Winning Looks Like
345 | 
346 | | Criterion | How Elith Wins |
347 | |-----------|---------------|
348 | | **Bob Application** | Bob is the native gold standard. Elith replicates it everywhere. Reports prove usage. |
349 | | **Presentation** | The "same task, 3 providers" demo is unforgettable |
350 | | **Business Value** | "Works with any model your company already pays for" |
351 | | **Originality** | Nobody else built a skill layer to replicate Bob across providers |
352 | 
353 | ---
354 | 
355 | *Elith Execution Strategy — IBM Bob Hackathon 2026*
</content>
</file>
<file><path>docs/ELITH_AGENT_SKILLS.md</path><file_outline>File: ELITH_AGENT_SKILLS.md (1058 lines)

String: # Elith — Agent Skills Specification (lines 1-1058)
  String: ## Why This Exists (lines 8-21)
  String: ## How Tool Calling Works Per Provider (lines 22-92)
    String: ### Anthropic (Claude) (lines 26-43)
    String: ### Google (Gemini) (lines 44-63)
    String: ### OpenAI (GPT/Codex) (lines 64-83)
    String: ### Ollama (Local LLM) (lines 84-92)
  String: ## Base Skill Interface (lines 93-155)
  String: ## Base Provider Interface (lines 156-188)
  String: ## The 12 Skills (lines 189-819)
    String: ### 1. read_file (lines 193-237)
    String: ### 2. write_file (lines 238-285)
    String: ### 3. list_files (lines 286-345)
    String: ### 4. search_code (lines 346-408)
    String: ### 5. git_diff (lines 409-459)
    String: ### 6. git_commit (lines 460-503)
    String: ### 7. run_tests (lines 504-558)
    String: ### 8. find_references (lines 559-607)
    String: ### 9. analyze_dependencies (lines 608-655)
    String: ### 10. explain_function (lines 656-708)
    String: ### 11. install_package (lines 709-756)
    String: ### 12. read_logs (lines 757-819)
  String: ## Skill Registry (lines 820-857)
  String: ## Claude Provider — Full Implementation (lines 858-915)
  String: ## IBM Bob Provider (lines 916-965)
  String: ## Model Router (lines 966-1025)
  String: ## Notes For Basil Joy (lines 1026-1058)
</file_outline>
<notice>This file is large (1057 lines). You will use the following strategy to understand this file:
- Inform the user you are going to use large file strategy, to efficiently understand the file
- Use the file_outline provided to get an overview of the file structure to help decide next action. This is not the full file. It is not the full depth of the contents.
- If you read the file, use precise file reads with line ranges for specific sections of interest
- Consider if other commands/tools are better suited for extracting information from that file type
- Use ask_followup_question tool if needed to identify the best next action
</notice></file>
</files>
<environment_details>
# VSCode Visible Files
docs/ELITH_TUI_SPEC.md

# VSCode Open Tabs
docs/ELITH_TUI_SPEC.md,AGENTS.md,.bob/rules-code/AGENTS.md,.bob/rules-advanced/AGENTS.md,.bob/rules-ask/AGENTS.md,.bob/rules-plan/AGENTS.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-16T03:40:04.211Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.08

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>plan</slug>
<name>📝 Plan</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

I'll use a large file strategy to efficiently understand the agent skills specification. Let me read the key sections that are most relevant to your backend implementation tasks.

<read_file>
<args>
  <file>
    <path>docs/ELITH_AGENT_SKILLS.md</path>
    <line_range>1-92</line_range>
    <line_range>93-188</line_range>
    <line_range>820-965</line_range>
  </file>
</args>
</read_file>

---

**User:**

[read_file for 'docs/ELITH_AGENT_SKILLS.md'. Reading multiple files at once is more efficient for the LLM. If other files are relevant to your current task, please read them simultaneously.] Result:
<files>
<file><path>docs/ELITH_AGENT_SKILLS.md</path>
<content lines="1-92">
 1 | # Elith — Agent Skills Specification
 2 | **The Core Innovation**  
 3 | **Owner:** Basil Joy (AI/ML Core)  
 4 | **Purpose:** Give every model the repo-awareness IBM Bob has natively
 5 | 
 6 | ---
 7 | 
 8 | ## Why This Exists
 9 | 
10 | IBM Bob lives inside your repository. It can read files, write code, run tests, search your codebase, and commit changes — all natively, without being told where things are.
11 | 
12 | Claude, Gemini, GPT, and local LLMs are powerful reasoners but repo-blind. They only know what you paste into the prompt.
13 | 
14 | **Elith's skill layer closes this gap.**
15 | 
16 | Every skill is an agent tool — a Python function exposed to the model via tool calling. When a non-Bob model is running, Elith injects the full skill set as available tools. The model calls them. Elith executes them. The model gets back real data from your actual repository.
17 | 
18 | **Result: Every model operates at Bob-level.**
19 | 
20 | ---
21 | 
22 | ## How Tool Calling Works Per Provider
23 | 
24 | Each provider has a different tool calling API. Elith normalizes this.
25 | 
26 | ### Anthropic (Claude)
27 | ```python
28 | tools = [
29 |     {
30 |         "name": "read_file",
31 |         "description": "Read the contents of a file in the repository",
32 |         "input_schema": {
33 |             "type": "object",
34 |             "properties": {
35 |                 "path": {"type": "string", "description": "Relative path to file"}
36 |             },
37 |             "required": ["path"]
38 |         }
39 |     }
40 | ]
41 | # Pass tools= to client.messages.create()
42 | ```
43 | 
44 | ### Google (Gemini)
45 | ```python
46 | tools = [
47 |     genai.protos.Tool(
48 |         function_declarations=[
49 |             genai.protos.FunctionDeclaration(
50 |                 name="read_file",
51 |                 description="Read the contents of a file in the repository",
52 |                 parameters=genai.protos.Schema(
53 |                     type=genai.protos.Type.OBJECT,
54 |                     properties={
55 |                         "path": genai.protos.Schema(type=genai.protos.Type.STRING)
56 |                     }
57 |                 )
58 |             )
59 |         ]
60 |     )
61 | ]
62 | ```
63 | 
64 | ### OpenAI (GPT/Codex)
65 | ```python
66 | tools = [
67 |     {
68 |         "type": "function",
69 |         "function": {
70 |             "name": "read_file",
71 |             "description": "Read the contents of a file in the repository",
72 |             "parameters": {
73 |                 "type": "object",
74 |                 "properties": {
75 |                     "path": {"type": "string"}
76 |                 },
77 |                 "required": ["path"]
78 |             }
79 |         }
80 |     }
81 | ]
82 | ```
83 | 
84 | ### Ollama (Local LLM)
85 | ```python
86 | # Ollama uses OpenAI-compatible format
87 | # Same as OpenAI above
88 | # Model must support tool calling (llama3.1, mistral-nemo, etc.)
89 | ```
90 | 
91 | ---
92 | 
</content>
<content lines="93-188">
 93 | ## Base Skill Interface
 94 | 
 95 | Every skill implements this interface:
 96 | 
 97 | ```python
 98 | # backend/skills/base_skill.py
 99 | 
100 | from abc import ABC, abstractmethod
101 | from typing import Any, Dict
102 | 
103 | class BaseSkill(ABC):
104 |     
105 |     @property
106 |     @abstractmethod
107 |     def name(self) -> str:
108 |         """Skill name — used as tool name by LLM"""
109 |         pass
110 |     
111 |     @property
112 |     @abstractmethod
113 |     def description(self) -> str:
114 |         """What this skill does — shown to LLM"""
115 |         pass
116 |     
117 |     @property
118 |     @abstractmethod
119 |     def parameters(self) -> Dict:
120 |         """JSON Schema of parameters"""
121 |         pass
122 |     
123 |     @abstractmethod
124 |     def execute(self, repo_path: str, **kwargs) -> str:
125 |         """Execute the skill and return string result"""
126 |         pass
127 |     
128 |     def to_anthropic_tool(self) -> Dict:
129 |         return {
130 |             "name": self.name,
131 |             "description": self.description,
132 |             "input_schema": self.parameters
133 |         }
134 |     
135 |     def to_openai_tool(self) -> Dict:
136 |         return {
137 |             "type": "function",
138 |             "function": {
139 |                 "name": self.name,
140 |                 "description": self.description,
141 |                 "parameters": self.parameters
142 |             }
143 |         }
144 |     
145 |     def to_gemini_function(self):
146 |         import google.generativeai as genai
147 |         # Build Gemini FunctionDeclaration from parameters
148 |         return genai.protos.FunctionDeclaration(
149 |             name=self.name,
150 |             description=self.description,
151 |         )
152 | ```
153 | 
154 | ---
155 | 
156 | ## Base Provider Interface
157 | 
158 | ```python
159 | # backend/providers/base_provider.py
160 | 
161 | from abc import ABC, abstractmethod
162 | from typing import List, Generator
163 | from ..skills.base_skill import BaseSkill
164 | 
165 | class BaseProvider(ABC):
166 |     
167 |     def __init__(self, repo_path: str, skills: List[BaseSkill]):
168 |         self.repo_path = repo_path
169 |         self.skills = {s.name: s for s in skills}
170 |     
171 |     @abstractmethod
172 |     def run(self, prompt: str, context: str) -> Generator[str, None, None]:
173 |         """
174 |         Run the model with the given prompt and context.
175 |         Yields output chunks as they stream.
176 |         Handles tool calls internally — calls skills and feeds results back.
177 |         """
178 |         pass
179 |     
180 |     def execute_skill(self, skill_name: str, **kwargs) -> str:
181 |         """Execute a skill by name"""
182 |         if skill_name not in self.skills:
183 |             return f"Error: skill '{skill_name}' not found"
184 |         return self.skills[skill_name].execute(self.repo_path, **kwargs)
185 | ```
186 | 
187 | ---
188 | 
</content>
<content lines="820-965">
820 | ## Skill Registry
821 | 
822 | ```python
823 | # backend/skills/__init__.py
824 | 
825 | from .read_file import ReadFileSkill
826 | from .write_file import WriteFileSkill
827 | from .list_files import ListFilesSkill
828 | from .search_code import SearchCodeSkill
829 | from .git_diff import GitDiffSkill
830 | from .git_commit import GitCommitSkill
831 | from .run_tests import RunTestsSkill
832 | from .find_references import FindReferencesSkill
833 | from .analyze_dependencies import AnalyzeDependenciesSkill
834 | from .explain_function import ExplainFunctionSkill
835 | from .install_package import InstallPackageSkill
836 | from .read_logs import ReadLogsSkill
837 | 
838 | ALL_SKILLS = [
839 |     ReadFileSkill(),
840 |     WriteFileSkill(),
841 |     ListFilesSkill(),
842 |     SearchCodeSkill(),
843 |     GitDiffSkill(),
844 |     GitCommitSkill(),
845 |     RunTestsSkill(),
846 |     FindReferencesSkill(),
847 |     AnalyzeDependenciesSkill(),
848 |     ExplainFunctionSkill(),
849 |     InstallPackageSkill(),
850 |     ReadLogsSkill(),
851 | ]
852 | 
853 | SKILL_MAP = {s.name: s for s in ALL_SKILLS}
854 | ```
855 | 
856 | ---
857 | 
858 | ## Claude Provider — Full Implementation
859 | 
860 | ```python
861 | # backend/providers/claude_provider.py
862 | 
863 | import anthropic
864 | import json
865 | from typing import Generator
866 | from .base_provider import BaseProvider
867 | from ..skills import ALL_SKILLS
868 | 
869 | class ClaudeProvider(BaseProvider):
870 |     
871 |     def __init__(self, repo_path: str, api_key: str, model: str = "claude-sonnet-4-20250514"):
872 |         super().__init__(repo_path, ALL_SKILLS)
873 |         self.client = anthropic.Anthropic(api_key=api_key)
874 |         self.model = model
875 |     
876 |     def run(self, prompt: str, context: str) -> Generator[str, None, None]:
877 |         tools = [s.to_anthropic_tool() for s in self.skills.values()]
878 |         messages = [{"role": "user", "content": f"{context}\n\n{prompt}"}]
879 |         
880 |         while True:
881 |             response = self.client.messages.create(
882 |                 model=self.model,
883 |                 max_tokens=8096,
884 |                 tools=tools,
885 |                 messages=messages
886 |             )
887 |             
888 |             # Stream text blocks
889 |             for block in response.content:
890 |                 if block.type == "text":
891 |                     yield block.text
892 |             
893 |             # Handle tool calls
894 |             if response.stop_reason == "tool_use":
895 |                 tool_results = []
896 |                 for block in response.content:
897 |                     if block.type == "tool_use":
898 |                         yield f"\n[Elith Skill: {block.name}({block.input})]\n"
899 |                         result = self.execute_skill(block.name, **block.input)
900 |                         yield f"→ {result[:200]}...\n" if len(result) > 200 else f"→ {result}\n"
901 |                         tool_results.append({
902 |                             "type": "tool_result",
903 |                             "tool_use_id": block.id,
904 |                             "content": result
905 |                         })
906 |                 
907 |                 # Continue conversation with tool results
908 |                 messages.append({"role": "assistant", "content": response.content})
909 |                 messages.append({"role": "user", "content": tool_results})
910 |             else:
911 |                 break
912 | ```
913 | 
914 | ---
915 | 
916 | ## IBM Bob Provider
917 | 
918 | ```python
919 | # backend/providers/bob_provider.py
920 | 
921 | import subprocess
922 | import os
923 | from typing import Generator
924 | from .base_provider import BaseProvider
925 | 
926 | class BobProvider(BaseProvider):
927 |     """
928 |     IBM Bob runs natively inside the repo.
929 |     No skills needed — Bob has all capabilities built in.
930 |     We just spawn Bob shell and stream its output.
931 |     """
932 |     
933 |     def __init__(self, repo_path: str):
934 |         super().__init__(repo_path, [])  # No skills needed
935 |         self.repo_path = repo_path
936 |     
937 |     def run(self, prompt: str, context: str) -> Generator[str, None, None]:
938 |         full_prompt = f"{context}\n\n{prompt}"
939 |         
940 |         try:
941 |             process = subprocess.Popen(
942 |                 ["bob", "--task", full_prompt],
943 |                 cwd=self.repo_path,
944 |                 stdout=subprocess.PIPE,
945 |                 stderr=subprocess.STDOUT,
946 |                 text=True,
947 |                 bufsize=1
948 |             )
949 |             
950 |             for line in iter(process.stdout.readline, ''):
951 |                 yield line
952 |             
953 |             process.wait()
954 |             
955 |             if process.returncode != 0:
956 |                 yield f"\nBob exited with code {process.returncode}"
957 |                 
958 |         except FileNotFoundError:
959 |             yield "Error: IBM Bob shell not found. Please install Bob and ensure it is in PATH."
960 |         except Exception as e:
961 |             yield f"Error running Bob: {str(e)}"
962 | ```
963 | 
964 | ---
965 | 
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
docs/ELITH_TUI_SPEC.md

# VSCode Open Tabs
docs/ELITH_TUI_SPEC.md,AGENTS.md,.bob/rules-code/AGENTS.md,.bob/rules-advanced/AGENTS.md,.bob/rules-ask/AGENTS.md,.bob/rules-plan/AGENTS.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-16T03:40:08.739Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.15

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>plan</slug>
<name>📝 Plan</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

Perfect! Now I have a comprehensive understanding of your role and the project. Let me check the current project structure to see what exists already.

<list_files>
<path>.</path>
<recursive>true</recursive>
</list_files>

---

**User:**

[list_files for '.'] Result:
🛡️ agent.md
🛡️ AGENTS.md
.bob/
docs/
docs/ELITH_AGENT_SKILLS.md
docs/ELITH_TUI_SPEC.md
docs/ELITH_UX_SPEC.md
docs/TASKS_BASIL_JOY.md
docs/TASKS_JOHANN.md
docs/my_part/
docs/my_part/ELITH_EXECUTION_STRATEGY.md
docs/my_part/ELITH_PROJECT_SPEC_backup.md
docs/my_part/ELITH_PROJECT_SPEC.md
docs/my_part/TASKS_YOU.md
<environment_details>
# VSCode Visible Files
docs/ELITH_TUI_SPEC.md

# VSCode Open Tabs
docs/ELITH_TUI_SPEC.md,AGENTS.md,.bob/rules-code/AGENTS.md,.bob/rules-advanced/AGENTS.md,.bob/rules-ask/AGENTS.md,.bob/rules-plan/AGENTS.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-16T03:40:12.593Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.24

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>plan</slug>
<name>📝 Plan</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

Excellent! I can see this is a **pre-implementation** project with only specifications. You're the **Architect + Team Lead** responsible for the backend foundation, context engine, and full integration. Let me create a comprehensive execution plan for your part.

<update_todo_list>
<todos>
[x] Review project specifications and understand architecture
[x] Understand team roles and dependencies
[ ] Set up project foundation and repository structure
[ ] Create FastAPI backend skeleton with core routes
[ ] Implement context engine (repo scanner + vault reader)
[ ] Build packet builder for smart file selection
[ ] Create model router and provider integration points
[ ] Implement SSE streaming for live output
[ ] Build session logging system
[ ] Integrate with Basil Joy's providers
[ ] Implement core operations (explain, architect, test-gen)
[ ] Add comprehensive error handling
[ ] Deploy backend to Railway/Render
[ ] Conduct end-to-end integration testing
[ ] Prepare demo workflow and documentation
</todos>
</update_todo_list>

Now let me ask you some clarifying questions to refine the plan:

<ask

[Response interrupted by a tool use result. Only one tool may be used at a time and should be placed at the end of the message.]

---

**User:**

[update_todo_list] Result:
Todo list updated successfully.
<environment_details>
# VSCode Visible Files
docs/ELITH_TUI_SPEC.md

# VSCode Open Tabs
docs/ELITH_TUI_SPEC.md,AGENTS.md,.bob/rules-code/AGENTS.md,.bob/rules-advanced/AGENTS.md,.bob/rules-ask/AGENTS.md,.bob/rules-plan/AGENTS.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-16T03:40:22.923Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.24

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>plan</slug>
<name>📝 Plan</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Review project specifications and understand architecture | Completed |
| 2 | Understand team roles and dependencies | Completed |
| 3 | Set up project foundation and repository structure | Pending |
| 4 | Create FastAPI backend skeleton with core routes | Pending |
| 5 | Implement context engine (repo scanner + vault reader) | Pending |
| 6 | Build packet builder for smart file selection | Pending |
| 7 | Create model router and provider integration points | Pending |
| 8 | Implement SSE streaming for live output | Pending |
| 9 | Build session logging system | Pending |
| 10 | Integrate with Basil Joy's providers | Pending |
| 11 | Implement core operations (explain, architect, test-gen) | Pending |
| 12 | Add comprehensive error handling | Pending |
| 13 | Deploy backend to Railway/Render | Pending |
| 14 | Conduct end-to-end integration testing | Pending |
| 15 | Prepare demo workflow and documentation | Pending |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

<ask_followup_question>
<question>Before I create the detailed implementation plan, I need to clarify a few things about your current status:

1. **Team Status**: Have you already synced with Basil Joy and Johann? Are they ready to start their parallel tracks?

2. **Timeline**: Are you starting from Hour 1 (team sync) or are you already past that and ready to begin Hours 2-4 (backend foundation)?

3. **Environment**: Do you have Python 3.10+, FastAPI, and other dependencies ready on your machine, or should the plan include environment setup?

4. **Repository**: Has the GitHub repo been created and shared with the team, or should I include that in the plan?</question>
<follow_up>
<suggest>We're at Hour 1 - need to do team sync first, then I'll start backend foundation (Hours 2-4)</suggest>
<suggest>Team sync is done, repo is ready - I'm starting Hours 2-4 backend foundation now</suggest>
<suggest>I'm further along (Hours 5-8+) - need help with context engine and integration</suggest>
<suggest>Just exploring the project - want to see the full detailed plan before deciding when to start</suggest>
</follow_up>
</ask_followup_question>

---

**User:**

[ask_followup_question for 'Before I create the detailed implementation plan, I need to clarify a few things about your current status:

1. **Team Status**: Have you already synced with Basil Joy and Johann? Are they ready to start their parallel tracks?

2. **Timeline**: Are you starting from Hour 1 (team sync) or are you already past that and ready to begin Hours 2-4 (backend foundation)?

3. **Environment**: Do you have Python 3.10+, FastAPI, and other dependencies ready on your machine, or should the plan include environment setup?

4. **Repository**: Has the GitHub repo been created and shared with the team, or should I include that in the plan?'] Result:
<answer>
Team sync is done, repo is ready - I'm starting Hours 2-4 backend foundation now
</answer>
<environment_details>
# VSCode Visible Files
docs/ELITH_TUI_SPEC.md

# VSCode Open Tabs
docs/ELITH_TUI_SPEC.md,AGENTS.md,.bob/rules-code/AGENTS.md,.bob/rules-advanced/AGENTS.md,.bob/rules-ask/AGENTS.md,.bob/rules-plan/AGENTS.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-16T03:40:47.062Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.41

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>plan</slug>
<name>📝 Plan</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Review project specifications and understand architecture | Completed |
| 2 | Understand team roles and dependencies | Completed |
| 3 | Set up project foundation and repository structure | Pending |
| 4 | Create FastAPI backend skeleton with core routes | Pending |
| 5 | Implement context engine (repo scanner + vault reader) | Pending |
| 6 | Build packet builder for smart file selection | Pending |
| 7 | Create model router and provider integration points | Pending |
| 8 | Implement SSE streaming for live output | Pending |
| 9 | Build session logging system | Pending |
| 10 | Integrate with Basil Joy's providers | Pending |
| 11 | Implement core operations (explain, architect, test-gen) | Pending |
| 12 | Add comprehensive error handling | Pending |
| 13 | Deploy backend to Railway/Render | Pending |
| 14 | Conduct end-to-end integration testing | Pending |
| 15 | Prepare demo workflow and documentation | Pending |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

Perfect! You're ready to start Hours 2-4 backend foundation. Let me create a detailed, actionable implementation plan with the complete project structure and step-by-step guidance.

<update_todo_list>
<todos>
[x] Review project specifications and understand architecture
[x] Understand team roles and dependencies
[x] Team sync completed - API contract agreed with Johann
[-] HOURS 2-4: Set up FastAPI project structure
[ ] HOURS 2-4: Implement repo scanner (context_engine/repo_scanner.py)
[ ] HOURS 2-4: Implement vault reader (context_engine/vault_reader.py)
[ ] HOURS 2-4: Create POST /api/scan endpoint
[ ] HOURS 2-4: Test scan endpoint with curl
[ ] HOURS 5-8: Build packet builder for smart file selection
[ ] HOURS 5-8: Create /api/tasks endpoint
[ ] HOURS 5-8: Create /api/execute stub endpoint
[ ] HOURS 5-8: Build model_router.py skeleton
[ ] HOURS 9-14: Wire model router to Basil Joy's providers
[ ] HOURS 9-14: Implement real /api/execute with context building
[ ] HOURS 9-14: Build SSE streaming endpoint
[ ] HOURS 9-14: Create session logger for bob-reports/
[ ] HOURS 9-14: Test full loop with Bob provider
[ ] HOURS 15-22: Implement operations (explain, architect, test-gen)
[ ] HOURS 15-22: Wire additional providers (Gemini, OpenAI, Ollama)
[ ] HOURS 15-22: Create /api/models endpoint
[ ] HOURS 15-22: End-to-end test on 3 real repos
[ ] HOURS 23-28: Full integration with Johann's frontend
[ ] HOURS 23-28: Add comprehensive error handling
[ ] HOURS 23-28: Deploy backend to Railway
[ ] HOURS 23-28: Test deployed backend with frontend
[ ] HOURS 29-36: Demo preparation and testing
[ ] HOURS 37-44: Final polish and documentation
</todos>
</update_todo_list>

---

**User:**

[update_todo_list] Result:
Todo list updated successfully.
<environment_details>
# VSCode Visible Files
docs/ELITH_TUI_SPEC.md

# VSCode Open Tabs
docs/ELITH_TUI_SPEC.md,AGENTS.md,.bob/rules-code/AGENTS.md,.bob/rules-advanced/AGENTS.md,.bob/rules-ask/AGENTS.md,.bob/rules-plan/AGENTS.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-16T03:40:57.331Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.50

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>plan</slug>
<name>📝 Plan</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Review project specifications and understand architecture | Completed |
| 2 | Understand team roles and dependencies | Completed |
| 3 | Team sync completed - API contract agreed with Johann | Completed |
| 4 | HOURS 2-4: Set up FastAPI project structure | In Progress |
| 5 | HOURS 2-4: Implement repo scanner (context_engine/repo_scanner.py) | Pending |
| 6 | HOURS 2-4: Implement vault reader (context_engine/vault_reader.py) | Pending |
| 7 | HOURS 2-4: Create POST /api/scan endpoint | Pending |
| 8 | HOURS 2-4: Test scan endpoint with curl | Pending |
| 9 | HOURS 5-8: Build packet builder for smart file selection | Pending |
| 10 | HOURS 5-8: Create /api/tasks endpoint | Pending |
| 11 | HOURS 5-8: Create /api/execute stub endpoint | Pending |
| 12 | HOURS 5-8: Build model_router.py skeleton | Pending |
| 13 | HOURS 9-14: Wire model router to Basil Joy's providers | Pending |
| 14 | HOURS 9-14: Implement real /api/execute with context building | Pending |
| 15 | HOURS 9-14: Build SSE streaming endpoint | Pending |
| 16 | HOURS 9-14: Create session logger for bob-reports/ | Pending |
| 17 | HOURS 9-14: Test full loop with Bob provider | Pending |
| 18 | HOURS 15-22: Implement operations (explain, architect, test-gen) | Pending |
| 19 | HOURS 15-22: Wire additional providers (Gemini, OpenAI, Ollama) | Pending |
| 20 | HOURS 15-22: Create /api/models endpoint | Pending |
| 21 | HOURS 15-22: End-to-end test on 3 real repos | Pending |
| 22 | HOURS 23-28: Full integration with Johann's frontend | Pending |
| 23 | HOURS 23-28: Add comprehensive error handling | Pending |
| 24 | HOURS 23-28: Deploy backend to Railway | Pending |
| 25 | HOURS 23-28: Test deployed backend with frontend | Pending |
| 26 | HOURS 29-36: Demo preparation and testing | Pending |
| 27 | HOURS 37-44: Final polish and documentation | Pending |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

Perfect! Now let me create a comprehensive implementation plan document that you can reference throughout the hackathon. This will include the complete project structure, detailed implementation steps, and code templates.

<write_to_file>
<path>docs/my_part/IMPLEMENTATION_PLAN.md</path>
<content># Elith Backend Implementation Plan
**Your Role:** Architect + Team Lead  
**Timeline:** Hours 2-44 (46 hours total)  
**Status:** Starting Hours 2-4 - Backend Foundation

---

## Quick Reference

### Critical Dependencies
- **Basil Joy** provides: All providers (bob, claude, gemini, openai, ollama) + skill layer
- **Johann** provides: TUI + React frontend consuming your API
- **You** provide: FastAPI backend, context engine, model router, operations, integration

### API Contract (Agreed with Johann)
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

## Complete Project Structure

```
elith/
├── README.md
├── pyproject.toml
├── requirements.txt
├── .env.example
├── .gitignore
├── LICENSE
│
├── backend/
│   ├── __init__.py
│   ├── main.py                         # FastAPI app entry point
│   │
│   ├── models/                         # Pydantic models
│   │   ├── __init__.py
│   │   ├── task_packet.py              # TaskPacket, FileInfo, Note
│   │   └── session.py                  # Session, SessionStatus
│   │
│   ├── routes/                         # API endpoints
│   │   ├── __init__.py
│   │   ├── scan.py                     # POST /api/scan
│   │   ├── execute.py                  # POST /api/execute
│   │   ├── stream.py                   # GET /api/stream/{session_id}
│   │   ├── models.py                   # GET /api/models
│   │   └── results.py                  # GET /api/results/{session_id}
│   │
│   ├── context_engine/                 # Smart file selection
│   │   ├── __init__.py
│   │   ├── repo_scanner.py             # Scans repo structure
│   │   ├── vault_reader.py             # Reads Obsidian vault
│   │   └── packet_builder.py           # Builds minimal task packets
│   │
│   ├── router/                         # Model routing
│   │   ├── __init__.py
│   │   └── model_router.py             # Routes to correct provider
│   │
│   ├── operations/                     # Task operations
│   │   ├── __init__.py
│   │   ├── explain.py                  # Explain codebase
│   │   ├── architect.py                # Novel architecture proposals
│   │   └── test_gen.py                 # Generate tests
│   │
│   ├── session/                        # Session management
│   │   ├── __init__.py
│   │   ├── manager.py                  # Session state management
│   │   └── logger.py                   # Export to bob-reports/
│   │
│   ├── skills/                         # Agent skills (Basil Joy owns)
│   │   ├── __init__.py
│   │   ├── base_skill.py
│   │   ├── read_file.py
│   │   ├── write_file.py
│   │   └── ... (10 more skills)
│   │
│   └── providers/                      # Model providers (Basil Joy owns)
│       ├── __init__.py
│       ├── base_provider.py
│       ├── bob_provider.py
│       ├── claude_provider.py
│       ├── gemini_provider.py
│       ├── openai_provider.py
│       └── ollama_provider.py
│
├── tui/                                # Terminal UI (Johann owns)
├── frontend/                           # React dashboard (Johann owns)
├── obsidian-template/                  # Vault template
└── bob-reports/                        # Session exports (auto-created)
```

---

## HOURS 2-4: Backend Foundation

### Goal
FastAPI backend with repo scanner, vault reader, and `/api/scan` endpoint working.

### Step 1: Project Setup (15 minutes)

**Create `pyproject.toml`:**
```toml
[project]
name = "elith"
version = "0.1.0"
description = "Universal repo-aware agent framework"
requires-python = ">=3.10"
dependencies = [
    "fastapi>=0.104.0",
    "uvicorn[standard]>=0.24.0",
    "pydantic>=2.5.0",
    "python-multipart>=0.0.6",
    "sse-starlette>=1.8.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.4.0",
    "httpx>=0.25.0",
]

[build-system]
requires = ["setuptools>=68.0"]
build-backend = "setuptools.build_meta"
```

**Create `requirements.txt`:**
```
fastapi>=0.104.0
uvicorn[standard]>=0.24.0
pydantic>=2.5.0
python-multipart>=0.0.6
sse-starlette>=1.8.0
```

**Create `.env.example`:**
```bash
# API Keys (configure as needed)
ANTHROPIC_API_KEY=your_claude_key_here
GOOGLE_API_KEY=your_gemini_key_here
OPENAI_API_KEY=your_openai_key_here

# Server
HOST=0.0.0.0
PORT=8000
```

**Create `.gitignore`:**
```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
.venv

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Project specific
bob-reports/*.md
!bob-reports/.gitkeep
```

### Step 2: Pydantic Models (20 minutes)

**Create `backend/models/task_packet.py`:**
```python
from pydantic import BaseModel, Field
from typing import List, Optional

class FileInfo(BaseModel):
    """Information about a file in the repository"""
    path: str
    size: int
    extension: str
    is_key_file: bool = False  # README, main.py, package.json, etc.

class Note(BaseModel):
    """Obsidian vault note"""
    filename: str
    content: str
    tags: List[str] = []

class TaskPacket(BaseModel):
    """Complete context packet for a task"""
    repo_path: str
    vault_path: Optional[str] = None
    files: List[FileInfo]
    vault_notes: List[Note]
    total_files: int
    selected_files: List[str] = []  # Paths of files selected for context
```

**Create `backend/models/session.py`:**
```python
from pydantic import BaseModel
from typing import List, Optional
from enum import Enum
from datetime import datetime

class SessionStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    ERROR = "error"

class Session(BaseModel):
    """Execution session"""
    session_id: str
    model: str
    operation: str
    repo_path: str
    vault_path: Optional[str] = None
    status: SessionStatus = SessionStatus.PENDING
    output: str = ""
    files_changed: List[str] = []
    report_path: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
```

### Step 3: Repo Scanner (30 minutes)

**Create `backend/context_engine/repo_scanner.py`:**
```python
from pathlib import Path
from typing import List, Set
from ..models.task_packet import FileInfo

class RepoScanner:
    """Scans repository structure and returns file information"""
    
    # Directories to skip
    SKIP_DIRS: Set[str] = {
        '.git', 'node_modules', '__pycache__', 'venv', '.venv',
        'env', 'dist', 'build', '.next', '.nuxt', 'target',
        'vendor', 'coverage', '.pytest_cache', '.mypy_cache'
    }
    
    # Key files that are always important
    KEY_FILES: Set[str] = {
        'README.md', 'package.json', 'pyproject.toml', 'setup.py',
        'Cargo.toml', 'go.mod', 'pom.xml', 'build.gradle',
        'main.py', 'app.py', 'index.js', 'main.go', 'main.rs'
    }
    
    def __init__(self, repo_path: str):
        self.repo_path = Path(repo_path).resolve()
        if not self.repo_path.exists():
            raise ValueError(f"Repository path does not exist: {repo_path}")
    
    def scan(self) -> List[FileInfo]:
        """Scan repository and return file information"""
        files = []
        
        for file_path in self._walk_directory(self.repo_path):
            relative_path = str(file_path.relative_to(self.repo_path))
            
            try:
                size = file_path.stat().st_size
                extension = file_path.suffix
                is_key = file_path.name in self.KEY_FILES
                
                files.append(FileInfo(
                    path=relative_path,
                    size=size,
                    extension=extension,
                    is_key_file=is_key
                ))
            except (OSError, PermissionError):
                # Skip files we can't read
                continue
        
        return files
    
    def _walk_directory(self, directory: Path):
        """Recursively walk directory, skipping excluded dirs"""
        try:
            for item in directory.iterdir():
                if item.is_dir():
                    if item.name not in self.SKIP_DIRS:
                        yield from self._walk_directory(item)
                elif item.is_file():
                    yield item
        except PermissionError:
            # Skip directories we can't access
            pass
```

### Step 4: Vault Reader (25 minutes)

**Create `backend/context_engine/vault_reader.py`:**
```python
from pathlib import Path
from typing import List, Optional
import re
from ..models.task_packet import Note

class VaultReader:
    """Reads Obsidian vault notes"""
    
    def __init__(self, vault_path: Optional[str] = None):
        self.vault_path = Path(vault_path).resolve() if vault_path else None
    
    def read_notes(self) -> List[Note]:
        """Read all markdown notes from vault"""
        if not self.vault_path or not self.vault_path.exists():
            return []
        
        notes = []
        for md_file in self.vault_path.rglob("*.md"):
            try:
                content = md_file.read_text(encoding='utf-8')
                tags = self._extract_tags(content)
                
                notes.append(Note(
                    filename=md_file.name,
                    content=content,
                    tags=tags
                ))
            except (OSError, UnicodeDecodeError):
                # Skip files we can't read
                continue
        
        return notes
    
    def _extract_tags(self, content: str) -> List[str]:
        """Extract #tags from markdown content"""
        # Match #tag but not ##heading
        tag_pattern = r'(?<!\#)\#([a-zA-Z0-9_-]+)'
        return list(set(re.findall(tag_pattern, content)))
```

### Step 5: FastAPI Main App (20 minutes)

**Create `backend/main.py`:**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import scan, execute, stream, models, results

app = FastAPI(
    title="Elith API",
    description="Universal repo-aware agent framework",
    version="0.1.0"
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(scan.router, prefix="/api", tags=["scan"])
app.include_router(execute.router, prefix="/api", tags=["execute"])
app.include_router(stream.router, prefix="/api", tags=["stream"])
app.include_router(models.router, prefix="/api", tags=["models"])
app.include_router(results.router, prefix="/api", tags=["results"])

@app.get("/")
async def root():
    return {
        "name": "Elith API",
        "version": "0.1.0",
        "status": "running"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}
```

### Step 6: Scan Endpoint (30 minutes)

**Create `backend/routes/scan.py`:**
```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from ..context_engine.repo_scanner import RepoScanner
from ..context_engine.vault_reader import VaultReader
from ..models.task_packet import TaskPacket

router = APIRouter()

class ScanRequest(BaseModel):
    repo_path: str
    vault_path: Optional[str] = None

@router.post("/scan")
async def scan_repository(request: ScanRequest) -> TaskPacket:
    """
    Scan repository and vault, return file information.
    This is the first step before executing any operation.
    """
    try:
        # Scan repository
        scanner = RepoScanner(request.repo_path)
        files = scanner.scan()
        
        # Read vault notes if provided
        vault_reader = VaultReader(request.vault_path)
        notes = vault_reader.read_notes()
        
        return TaskPacket(
            repo_path=request.repo_path,
            vault_path=request.vault_path,
            files=files,
            vault_notes=notes,
            total_files=len(files)
        )
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scan failed: {str(e)}")
```

### Step 7: Stub Routes (15 minutes)

**Create `backend/routes/execute.py`:**
```python
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import uuid

router = APIRouter()

class ExecuteRequest(BaseModel):
    model: str
    operation: str
    repo_path: str
    vault_path: Optional[str] = None

class ExecuteResponse(BaseModel):
    session_id: str

@router.post("/execute")
async def execute_operation(request: ExecuteRequest) -> ExecuteResponse:
    """Execute an operation with the selected model (STUB)"""
    # TODO: Wire to model router in Hours 5-8
    session_id = str(uuid.uuid4())
    return ExecuteResponse(session_id=session_id)
```

**Create `backend/routes/stream.py`:**
```python
from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse

router = APIRouter()

@router.get("/stream/{session_id}")
async def stream_output(session_id: str):
    """Stream operation output via SSE (STUB)"""
    # TODO: Implement real streaming in Hours 9-14
    async def event_generator():
        yield {"data": f"Mock output for session {session_id}"}
    
    return EventSourceResponse(event_generator())
```

**Create `backend/routes/models.py`:**
```python
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class ModelsResponse(BaseModel):
    available: List[str]
    configured: List[str]

@router.get("/models")
async def get_models() -> ModelsResponse:
    """Get available and configured models (STUB)"""
    # TODO: Check actual provider configuration in Hours 15-22
    return ModelsResponse(
        available=["bob", "claude", "gemini", "openai", "ollama"],
        configured=[]  # Will check env vars later
    )
```

**Create `backend/routes/results.py`:**
```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class ResultsResponse(BaseModel):
    output: str
    files_changed: List[str]
    report_path: Optional[str]

@router.get("/results/{session_id}")
async def get_results(session_id: str) -> ResultsResponse:
    """Get results for a completed session (STUB)"""
    # TODO: Implement session storage in Hours 9-14
    raise HTTPException(status_code=404, detail="Session not found")
```

### Step 8: Test the Scan Endpoint (10 minutes)

**Run the server:**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Test with curl:**
```bash
# Test health endpoint
curl http://localhost:8000/health

# Test scan endpoint (use a real repo path)
curl -X POST http://localhost:8000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"repo_path": "/path/to/your/test/repo"}'
```

**Expected output:**
```json
{
  "repo_path": "/path/to/repo",
  "vault_path": null,
  "files": [
    {"path": "README.md", "size": 1234, "extension": ".md", "is_key_file": true},
    {"path": "src/main.py", "size": 5678, "extension": ".py", "is_key_file": false}
  ],
  "vault_notes": [],
  "total_files": 42,
  "selected_files": []
}
```

### Hours 2-4 Checkpoint
✅ FastAPI backend running  
✅ Repo scanner working  
✅ Vault reader working  
✅ POST /api/scan returns clean JSON  
✅ Ready for Hours 5-8 (Context Engine)

---

## HOURS 5-8: Context Engine

### Goal
Smart file selection that picks only 4-6 relevant files per task type.

### Step 1: Packet Builder (60 minutes)

**Create `backend/context_engine/packet_builder.py`:**
```python
from typing import List, Dict, Set
from pathlib import Path
from ..models.task_packet import TaskPacket, FileInfo, Note

class PacketBuilder:
    """Builds minimal context packets for specific task types"""
    
    # Task-specific file patterns
    TASK_PATTERNS = {
        "explain": {
            "extensions": [".md", ".py", ".js", ".ts", ".go", ".rs"],
            "key_files": ["README.md", "main.py", "app.py", "index.js", "main.go"],
            "max_files": 6
        },
        "architect": {
            "extensions": [".py", ".js", ".ts", ".go", ".rs", ".java"],
            "key_files": ["main.py", "app.py", "server.py", "index.js", "main.go"],
            "max_files": 6
        },
        "test-gen": {
            "extensions": [".py", ".js", ".ts", ".go", ".rs"],
            "key_files": [],
            "max_files": 4
        },
        "refactor": {
            "extensions": [".py", ".js", ".ts", ".go", ".rs"],
            "key_files": [],
            "max_files": 4
        }
    }
    
    def __init__(self, task_packet: TaskPacket):
        self.packet = task_packet
    
    def build_context(self, operation: str, target_file: str = None) -> Dict:
        """Build minimal context for the operation"""
        
        if operation not in self.TASK_PATTERNS:
            # Default: return key files only
            return self._build_default_context()
        
        pattern = self.TASK_PATTERNS[operation]
        selected_files = []
        
        # 1. Always include key files if they exist
        for file_info in self.packet.files:
            if file_info.is_key_file:
                selected_files.append(file_info.path)
        
        # 2. For specific operations, add relevant files
        if operation == "test-gen":
            selected_files.extend(self._find_files_without_tests())
        elif operation == "refactor" and target_file:
            selected_files.extend(self._find_related_files(target_file))
        elif operation in ["explain", "architect"]:
            selected_files.extend(self._find_entry_points())
        
        # 3. Limit to max_files
        selected_files = selected_files[:pattern["max_files"]]
        
        # 4. Build context string
        context = self._build_context_string(selected_files)
        
        # 5. Add relevant vault notes
        relevant_notes = self._find_relevant_notes(operation)
        
        return {
            "selected_files": selected_files,
            "context": context,
            "vault_notes": relevant_notes,
            "total_files": self.packet.total_files,
            "files_loaded": len(selected_files)
        }
    
    def _build_default_context(self) -> Dict:
        """Build default context with just key files"""
        key_files = [f.path for f in self.packet.files if f.is_key_file][:4]
        return {
            "selected_files": key_files,
            "context": self._build_context_string(key_files),
            "vault_notes": [],
            "total_files": self.packet.total_files,
            "files_loaded": len(key_files)
        }
    
    def _build_context_string(self, file_paths: List[str]) -> str:
        """Build context string from selected files"""
        repo_path = Path(self.packet.repo_path)
        context_parts = [
            f"Repository: {self.packet.repo_path}",
            f"Total files: {self.packet.total_files}",
            f"Files loaded: {len(file_paths)}",
            "\n--- Selected Files ---\n"
        ]
        
        for file_path in file_paths:
            full_path = repo_path / file_path
            try:
                content = full_path.read_text(encoding='utf-8')
                context_parts.append(f"\n=== {file_path} ===\n{content}\n")
            except (OSError, UnicodeDecodeError):
                context_parts.append(f"\n=== {file_path} ===\n[Binary or unreadable file]\n")
        
        return "\n".join(context_parts)
    
    def _find_files_without_tests(self) -> List[str]:
        """Find source files that don't have corresponding test files"""
        source_files = []
        test_files = set()
        
        for file_info in self.packet.files:
            path = file_info.path
            if 'test' in path.lower() or 'spec' in path.lower():
                test_files.add(path)
            elif file_info.extension in ['.py', '.js', '.ts']:
                source_files.append(path)
        
        # Find sources without tests (simplified logic)
        without_tests = []
        for source in source_files:
            has_test = any(source.replace('.py', '') in test for test in test_files)
            if not has_test:
                without_tests.append(source)
        
        return without_tests[:3]
    
    def _find_related_files(self, target_file: str) -> List[str]:
        """Find files related to the target file"""
        # Simplified: return files in same directory
        target_dir = str(Path(target_file).parent)
        related = [target_file]
        
        for file_info in self.packet.files:
            if str(Path(file_info.path).parent) == target_dir:
                if file_info.path != target_file:
                    related.append(file_info.path)
        
        return related[:4]
    
    def _find_entry_points(self) -> List[str]:
        """Find likely entry point files"""
        entry_points = []
        
        for file_info in self.packet.files:
            name = Path(file_info.path).name.lower()
            if name in ['main.py', 'app.py', 'server.py', 'index.js', 'main.go', 'main.rs']:
                entry_points.append(file_info.path)
        
        return entry_points[:2]
    
    def _find_relevant_notes(self, operation: str) -> List[Note]:
        """Find vault notes relevant to the operation"""
        relevant = []
        keywords = {
            "architect": ["architecture", "design", "pattern"],
            "test-gen": ["testing", "test", "quality"],
            "explain": ["overview", "architecture", "readme"],
            "refactor": ["debt", "refactor", "improve"]
        }
        
        search_terms = keywords.get(operation, [])
        
        for note in self.packet.vault_notes:
            content_lower = note.content.lower()
            if any(term in content_lower for term in search_terms):
                relevant.append(note)
        
        return relevant[:2]
```

### Step 2: Update Execute Endpoint (20 minutes)

**Update `backend/routes/execute.py`:**
```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import uuid
from ..context_engine.repo_scanner import RepoScanner
from ..context_engine.vault_reader import VaultReader
from ..context_engine.packet_builder import PacketBuilder
from ..models.task_packet import TaskPacket

router = APIRouter()

class ExecuteRequest(BaseModel):
    model: str
    operation: str
    repo_path: str
    vault_path: Optional[str] = None
    target_file: Optional[str] = None

class ExecuteResponse(BaseModel):
    session_id: str
    files_loaded: int
    total_files: int

@router.post("/execute")
async def execute_operation(request: ExecuteRequest) -> ExecuteResponse:
    """Execute an operation with the selected model"""
    try:
        # 1. Scan repo and vault
        scanner = RepoScanner(request.repo_path)
        files = scanner.scan()
        
        vault_reader = VaultReader(request.vault_path)
        notes = vault_reader.read_notes()
        
        task_packet = TaskPacket(
            repo_path=request.repo_path,
            vault_path=request.vault_path,
            files=files,
            vault_notes=notes,
            total_files=len(files)
        )
        
        # 2. Build minimal context
        builder = PacketBuilder(task_packet)
        context_data = builder.build_context(request.operation, request.target_file)
        
        # 3. Create session
        session_id = str(uuid.uuid4())
        
        # TODO: Store session and route to model (Hours 9-14)
        
        return ExecuteResponse(
            session_id=session_id,
            files_loaded=context_data["files_loaded"],
            total_files=context_data["total_files"]
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### Step 3: Tasks Endpoint (15 minutes)

**Create `backend/routes/tasks.py`:**
```python
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class Operation(BaseModel):
    name: str
    description: str
    requires_target: bool = False

class TasksResponse(BaseModel):
    operations: List[Operation]

@router.get("/tasks")
async def get_tasks() -> TasksResponse:
    """Get available operations"""
    return TasksResponse(
        operations=[
            Operation(
                name="explain",
                description="Explain codebase architecture in plain language",
                requires_target=False
            ),
            Operation(
                name="architect",
                description="Propose novel architectures tailored to codebase",
                requires_target=False
            ),
            Operation(
                name="test-gen",
                description="Generate missing tests",
                requires_target=False
            ),
            Operation(
                name="refactor",
                description="Safely refactor target module",
                requires_target=True
            )
        ]
    )
```

**Update `backend/main.py` to include tasks router:**
```python
from .routes import scan, execute, stream, models, results, tasks

app.include_router(tasks.router, prefix="/api", tags=["tasks"])
```

### Step 4: Model Router Skeleton (30 minutes)

**Create `backend/router/model_router.py`:**
```python
from typing import Generator, Optional
from ..providers.base_provider import BaseProvider

class ModelRouter:
    """Routes execution to the appropriate model provider"""
    
    def __init__(self):
        self.providers = {}
    
    def register_provider(self, name: str, provider: BaseProvider):
        """Register a model provider"""
        self.providers[name] = provider
    
    def route(self, model: str, prompt: str, context: str) -> Generator[str, None, None]:
        """Route to the appropriate provider and stream output"""
        if model not in self.providers:
            yield f"Error: Model '{model}' not configured"
            return
        
        provider = self.providers[model]
        yield from provider.run(prompt, context)
    
    def get_available_models(self) -> list:
        """Get list of registered models"""
        return list(self.providers.keys())

# Global router instance
router = ModelRouter()
```

### Hours 5-8 Checkpoint
✅ Packet builder selects 4-6 relevant files  
✅ Context engine working for all task types  
✅ /api/execute builds minimal context  
✅ /api/tasks returns available operations  
✅ Model router skeleton ready for providers  
✅ Ready for Hours 9-14 (Integration)

---

## HOURS 9-14: Full Integration

### Goal
Wire everything together: model router → providers → SSE streaming → session logging.

### Step 1: Session Manager (45 minutes)

**Create `backend/session/manager.py`:**
```python
from typing import Dict, Optional
import asyncio
from datetime import datetime
from ..models.session import Session, SessionStatus

class SessionManager:
    """Manages active and completed sessions"""
    
    def __init__(self):
        self.sessions: Dict[str, Session] = {}
        self.output_queues: Dict[str, asyncio.Queue] = {}
    
    def create_session(
        self,
        session_id: str,
        model: str,
        operation: str,
        repo_path: str,
        vault_path: Optional[str] = None
    ) -> Session:
        """Create a new session"""
        session = Session(
            session_id=session_id,
            model=model,
            operation=operation,
            repo_path=repo_path,
            vault_path=vault_path,
            status=SessionStatus.PENDING
        )
        self.sessions[session_id] = session
        self.output_queues[session_id] = asyncio.Queue()
        return session
    
    def get_session(self, session_id: str) -> Optional[Session]:
        """Get session by ID"""
        return self.sessions.get(session_id)
    
    async def add_output(self, session_id: str, content: str):
        """Add output to session"""
        if session_id in self.sessions:
            self.sessions[session_id].output += content
            if session_id in self.output_queues:
                await self.output_queues[session_id].put(content)
    
    async def stream_output(self, session_id: str):
        """Stream output for a session"""
        if session_id not in self.output_queues:
            return
        
        queue = self.output_queues[session_id]
        while True:
            try:
                content = await asyncio.wait_for(queue.get(), timeout=0.1)
                yield content
            except asyncio.TimeoutError:
                # Check if session is done
                session = self.sessions.get(session_id)
                if session and session.status in [SessionStatus.COMPLETED, SessionStatus.ERROR]:
                    break
    
    def complete_session(self, session_id: str, files_changed: list = None):
        """Mark session as completed"""
        if session_id in self.sessions:
            self.sessions[session_id].status = SessionStatus.COMPLETED
            self.sessions[session_id].completed_at = datetime.utcnow()
            if files_changed:
                self.sessions[session_id].files_changed = files_changed
    
    def error_session(self, session_id: str, error: str):
        """Mark session as errored"""
        if session_id in self.sessions:
            self.sessions[session_id].status = SessionStatus.ERROR
            self.sessions[session_id].output += f"\n\nError: {error}"
            self.sessions[session_id].completed_at = datetime.utcnow()

# Global session manager
manager = SessionManager()
```

### Step 2: Session Logger (30 minutes)

**Create `backend/session/logger.py`:**
```python
from pathlib import Path
from datetime import datetime
from ..models.session import Session

class SessionLogger:
    """Logs sessions to bob-reports/ directory"""
    
    def __init__(self, reports_dir: str = "bob-reports"):
        self.reports_dir = Path(reports_dir)
        self.reports_dir.mkdir(exist_ok=True)
        
        # Create .gitkeep
        gitkeep = self.reports_dir / ".gitkeep"
        if not gitkeep.exists():
            gitkeep.touch()
    
    def log_session(self, session: Session) -> str:
        """Log session to markdown file"""
        timestamp = session.created_at.strftime("%Y%m%d_%H%M%S")
        filename = f"session_{timestamp}_{session.session_id[:8]}.md"
        filepath = self.reports_dir / filename
        
        content = self._format_session(session)
        filepath.write_text(content, encoding='utf-8')
        
        return str(filepath)
    
    def _format_session(self, session: Session) -> str:
        """Format session as markdown"""
        duration = ""
        if session.completed_at:
            delta = session.completed_at - session.created_at
            duration = f"{delta.total_seconds():.1f}s"
        
        return f"""# Elith Session Report

**Session ID:** {session.session_id}  
**Model:** {session.model}  
**Operation:** {session.operation}  
**Status:** {session.status.value}  
**Created:** {session.created_at.isoformat()}  
**Completed:** {session.completed_at.isoformat() if session.completed_at else 'N/A'}  
**Duration:** {duration}

## Repository
{session.repo_path}

## Vault
{session.vault_path or 'None'}

## Files Changed
{chr(10).join(f'- {f}' for f in session.files_changed) if session.files_changed else 'None'}

## Output

```
{session.output}
```

---
*Generated by Elith - IBM Bob Hackathon 2026*
"""

# Global logger
logger = SessionLogger()
```

### Step 3: Real Execute Endpoint (45 minutes)

**Update `backend/routes/execute.py`:**
```python
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
import uuid
import asyncio
from ..context_engine.repo_scanner import RepoScanner
from ..context_engine.vault_reader import VaultReader
from ..context_engine.packet_builder import PacketBuilder
from ..models.task_packet import TaskPacket
from ..session.manager import manager
from ..session.logger import logger
from ..router.model_router import router as model_router

router = APIRouter()

class ExecuteRequest(BaseModel):
    model: str
    operation: str
    repo_path: str
    vault_path: Optional[str] = None
    target_file: Optional[str] = None

class ExecuteResponse(BaseModel):
    session_id: str
    files_loaded: int
    total_files: int

async def run_operation(
    session_id: str,
    model: str,
    operation: str,
    prompt: str,
    context: str
):
    """Background task to run the operation"""
    try:
        # Update status to running
        session = manager.get_session(session_id)
        if session:
            session.status = "running"
        
        # Stream output from model
        async for chunk in model_router.route(model, prompt, context):
            await manager.add_output(session_id, chunk)
        
        # Complete session
        manager.complete_session(session_id)
        
        # Log to bob-reports/
        session = manager.get_session(session_id)
        if session:
            report_path = logger.log_session(session)
            session.report_path = report_path
    
    except Exception as e:
        manager.error_session(session_id, str(e))

@router.post("/execute")
async def execute_operation(
    request: ExecuteRequest,
    background_tasks: BackgroundTasks
) -> ExecuteResponse:
    """Execute an operation with the selected model"""
    try:
        # 1. Scan repo and vault
        scanner = RepoScanner(request.repo_path)
        files = scanner.scan()
        
        vault_reader = VaultReader(request.vault_path)
        notes = vault_reader.read_notes()
        
        task_packet = TaskPacket(
            repo_path=request.repo_path,
            vault_path=request.vault_path,
            files=files,
            vault_notes=notes,
            total_files=len(files)
        )
        
        # 2. Build minimal context
        builder = PacketBuilder(task_packet)
        context_data = builder.build_context(request.operation, request.target_file)
        
        # 3. Create session
        session_id = str(uuid.uuid4())
        manager.create_session(
            session_id=session_id,
            model=request.model,
            operation=request.operation,
            repo_path=request.repo_path,
            vault_path=request.vault_path
        )
        
        # 4. Build prompt
        prompt = self._build_prompt(request.operation)
        
        # 5. Run in background
        background_tasks.add_task(
            run_operation,
            session_id,
            request.model,
            request.operation,
            prompt,
            context_data["context"]
        )
        
        return ExecuteResponse(
            session_id=session_id,
            files_loaded=context_data["files_loaded"],
            total_files=context_data["total_files"]
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def _build_prompt(operation: str) -> str:
    """Build operation-specific prompt"""
    prompts = {
        "explain": "Explain this codebase architecture in plain language. Focus on the overall structure, key components, and how they interact.",
        "architect": "Analyze this codebase and propose 2-3 novel architectural improvements tailored to its specific patterns and constraints. For each proposal, explain why it fits this codebase, the tradeoffs, and a migration path.",
        "test-gen": "Generate comprehensive tests for the files that don't have test coverage. Match the existing test style and framework.",
        "refactor": "Safely refactor the target module to improve code quality while maintaining functionality."
    }
    return prompts.get(operation, "Analyze this codebase.")
```

### Step 4: SSE Streaming (30 minutes)

**Update `backend/routes/stream.py`:**
```python
from fastapi import APIRouter, HTTPException
from sse_starlette.sse import EventSourceResponse
import json
from ..session.manager import manager

router = APIRouter()

@router.get("/stream/{session_id}")
async def stream_output(session_id: str):
    """Stream operation output via SSE"""
    session = manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    async def event_generator():
        async for chunk in manager.stream_output(session_id):
            yield {
                "event": "output",
                "data": json.dumps({
                    "type": "output",
                    "content": chunk,
                    "model": session.model
                })
            }
        
        # Send done event
        yield {
            "event": "done",
            "data": json.dumps({
                "type": "done",
                "session_id": session_id
            })
        }
    
    return EventSourceResponse(event_generator())
```

### Step 5: Results Endpoint (15 minutes)

**Update `backend/routes/results.py`:**
```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from ..session.manager import manager

router = APIRouter()

class ResultsResponse(BaseModel):
    output: str
    files_changed: List[str]
    report_path: Optional[str]
    status: str

@router.get("/results/{session_id}")
async def get_results(session_id: str) -> ResultsResponse:
    """Get results for a completed session"""
    session = manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return ResultsResponse(
        output=session.output,
        files_changed=session.files_changed,
        report_path=session.report_path,
        status=session.status.value
    )
```

### Step 6: Wire Bob Provider (30 minutes)

**Wait for Basil Joy to provide `backend/providers/bob_provider.py`**

Once available, update `backend/main.py`:
```python
from .router.model_router import router as model_router
from .providers.bob_provider import BobProvider

# Register Bob provider on startup
@app.on_event("startup")
async def startup_event():
    # Bob doesn't need API key - runs natively
    bob = BobProvider(repo_path="")  # repo_path set per request
    model_router.register_provider("bob", bob)
```

### Hours 9-14 Checkpoint
✅ Session manager handling state  
✅ SSE streaming working  
✅ Session logger exporting to bob-reports/  
✅ Full loop: execute → stream → results  
✅ Bob provider integrated (when available)  
✅ Ready for Hours 15-22 (Operations + More Providers)

---

## HOURS 15-22: Operations + More Providers

### Goal
Implement 3 operations, wire 4 providers, test on real repos.

### Step 1: Operations (90 minutes)

**Create `backend/operations/explain.py`:**
```python
def build_explain_prompt(context: str) -> str:
    """Build prompt for explain operation"""
    return f"""You are analyzing a codebase to explain its architecture.

{context}

Please provide a clear, plain-language explanation of:
1. Overall architecture and structure
2. Key components and their responsibilities
3. How components interact
4. Technology stack and frameworks used
5. Entry points and main workflows

Focus on helping a new developer understand the codebase quickly."""
```

**Create `backend/operations/architect.py`:**
```python
def build_architect_prompt(context: str) -> str:
    """Build prompt for novel architecture proposals"""
    return f"""You are a senior architect analyzing a codebase to propose improvements.

{context}

IMPORTANT: Do NOT give generic textbook answers. Analyze THIS specific codebase.

Propose 2-3 novel architectural improvements that are:
1. Tailored to THIS codebase's actual patterns and constraints
2. Based on what you see in the code, not generic best practices
3. Production-ready with clear migration paths

For each proposal, provide:
- Why this specific pattern fits THIS codebase (reference actual files/patterns)
- Tradeoffs specific to this context
- Step-by-step migration path
- What could go wrong and how to mitigate

Examples of good proposals:
- "Your read:write ratio is 20:1 (see api/routes.py) → CQRS with read replicas"
- "You have 3 different auth patterns (see auth/*.py) → Unified auth middleware"
- "Your event handlers are tightly coupled (see events/*.py) → Event sourcing"

Avoid generic answers like "use microservices" or "add caching"."""
```

**Create `backend/operations/test_gen.py`:**
```python
def build_test_gen_prompt(context: str) -> str:
    """Build prompt for test generation"""
    return f"""You are generating tests for a codebase.

{context}

Generate comprehensive tests for files that lack test coverage.

Requirements:
1. Match the existing test framework and style (pytest, jest, etc.)
2. Cover happy paths, edge cases, and error conditions
3. Use appropriate mocking for external dependencies
4. Follow the project's testing conventions

---

**User:**

[write_to_file for 'docs/my_part/IMPLEMENTATION_PLAN.md'] Result:
The tool execution failed with the following error:
<error>
This appears to be a new file.
Note: Your response may have been truncated because it exceeded your output limit. You wrote 1385 lines of content, but the line_count parameter was either missing or not included in your response.

RECOMMENDED APPROACH:
1. Try again with the line_count parameter in your response if you forgot to include it
2. Or break your content into smaller chunks - first use write_to_file with the initial chunk
3. Then use insert_content to append additional chunks

# Reminder: Instructions for Tool Use

Tool uses are formatted using XML-style tags. The tool name itself becomes the XML tag name. Each parameter is enclosed within its own set of tags. Here's the structure:

<actual_tool_name>
<parameter1_name>value1</parameter1_name>
<parameter2_name>value2</parameter2_name>
...
</actual_tool_name>

For example, to use the attempt_completion tool:

<attempt_completion>
<result>
I have completed the task...
</result>
</attempt_completion>

Always use the actual tool name as the XML tag name for proper parsing and execution.
</error>
<environment_details>
# VSCode Visible Files
docs/my_part/IMPLEMENTATION_PLAN.md

# VSCode Open Tabs
docs/my_part/IMPLEMENTATION_PLAN.md,AGENTS.md,.bob/rules-code/AGENTS.md,.bob/rules-advanced/AGENTS.md,.bob/rules-ask/AGENTS.md,.bob/rules-plan/AGENTS.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-16T03:43:13.162Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.62

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>plan</slug>
<name>📝 Plan</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Review project specifications and understand architecture | Completed |
| 2 | Understand team roles and dependencies | Completed |
| 3 | Team sync completed - API contract agreed with Johann | Completed |
| 4 | HOURS 2-4: Set up FastAPI project structure | In Progress |
| 5 | HOURS 2-4: Implement repo scanner (context_engine/repo_scanner.py) | Pending |
| 6 | HOURS 2-4: Implement vault reader (context_engine/vault_reader.py) | Pending |
| 7 | HOURS 2-4: Create POST /api/scan endpoint | Pending |
| 8 | HOURS 2-4: Test scan endpoint with curl | Pending |
| 9 | HOURS 5-8: Build packet builder for smart file selection | Pending |
| 10 | HOURS 5-8: Create /api/tasks endpoint | Pending |
| 11 | HOURS 5-8: Create /api/execute stub endpoint | Pending |
| 12 | HOURS 5-8: Build model_router.py skeleton | Pending |
| 13 | HOURS 9-14: Wire model router to Basil Joy's providers | Pending |
| 14 | HOURS 9-14: Implement real /api/execute with context building | Pending |
| 15 | HOURS 9-14: Build SSE streaming endpoint | Pending |
| 16 | HOURS 9-14: Create session logger for bob-reports/ | Pending |
| 17 | HOURS 9-14: Test full loop with Bob provider | Pending |
| 18 | HOURS 15-22: Implement operations (explain, architect, test-gen) | Pending |
| 19 | HOURS 15-22: Wire additional providers (Gemini, OpenAI, Ollama) | Pending |
| 20 | HOURS 15-22: Create /api/models endpoint | Pending |
| 21 | HOURS 15-22: End-to-end test on 3 real repos | Pending |
| 22 | HOURS 23-28: Full integration with Johann's frontend | Pending |
| 23 | HOURS 23-28: Add comprehensive error handling | Pending |
| 24 | HOURS 23-28: Deploy backend to Railway | Pending |
| 25 | HOURS 23-28: Test deployed backend with frontend | Pending |
| 26 | HOURS 29-36: Demo preparation and testing | Pending |
| 27 | HOURS 37-44: Final polish and documentation | Pending |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

I see the file was too large. Let me create a more concise implementation plan and then provide additional details in separate documents.

<write_to_file>
<path>docs/my_part/IMPLEMENTATION_PLAN.md</path>
<content># Elith Backend Implementation Plan
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
</content>
<line_count>267</line_count>
</write_to_file>

---

**User:**

[write_to_file for 'docs/my_part/IMPLEMENTATION_PLAN.md'] Result:
<file_write_result>
<path>docs/my_part/IMPLEMENTATION_PLAN.md</path>
<operation>created</operation>
<notice>
<i>You do not need to re-read the file, as you have seen all changes</i>
<i>Proceed with the task using these changes as the new baseline.</i>
</notice>
</file_write_result>

<environment_details>
# VSCode Visible Files
docs/my_part/IMPLEMENTATION_PLAN.md

# VSCode Open Tabs
docs/my_part/IMPLEMENTATION_PLAN.md,AGENTS.md,.bob/rules-code/AGENTS.md,.bob/rules-advanced/AGENTS.md,.bob/rules-ask/AGENTS.md,.bob/rules-plan/AGENTS.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-16T03:43:54.504Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.75

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>plan</slug>
<name>📝 Plan</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Review project specifications and understand architecture | Completed |
| 2 | Understand team roles and dependencies | Completed |
| 3 | Team sync completed - API contract agreed with Johann | Completed |
| 4 | HOURS 2-4: Set up FastAPI project structure | In Progress |
| 5 | HOURS 2-4: Implement repo scanner (context_engine/repo_scanner.py) | Pending |
| 6 | HOURS 2-4: Implement vault reader (context_engine/vault_reader.py) | Pending |
| 7 | HOURS 2-4: Create POST /api/scan endpoint | Pending |
| 8 | HOURS 2-4: Test scan endpoint with curl | Pending |
| 9 | HOURS 5-8: Build packet builder for smart file selection | Pending |
| 10 | HOURS 5-8: Create /api/tasks endpoint | Pending |
| 11 | HOURS 5-8: Create /api/execute stub endpoint | Pending |
| 12 | HOURS 5-8: Build model_router.py skeleton | Pending |
| 13 | HOURS 9-14: Wire model router to Basil Joy's providers | Pending |
| 14 | HOURS 9-14: Implement real /api/execute with context building | Pending |
| 15 | HOURS 9-14: Build SSE streaming endpoint | Pending |
| 16 | HOURS 9-14: Create session logger for bob-reports/ | Pending |
| 17 | HOURS 9-14: Test full loop with Bob provider | Pending |
| 18 | HOURS 15-22: Implement operations (explain, architect, test-gen) | Pending |
| 19 | HOURS 15-22: Wire additional providers (Gemini, OpenAI, Ollama) | Pending |
| 20 | HOURS 15-22: Create /api/models endpoint | Pending |
| 21 | HOURS 15-22: End-to-end test on 3 real repos | Pending |
| 22 | HOURS 23-28: Full integration with Johann's frontend | Pending |
| 23 | HOURS 23-28: Add comprehensive error handling | Pending |
| 24 | HOURS 23-28: Deploy backend to Railway | Pending |
| 25 | HOURS 23-28: Test deployed backend with frontend | Pending |
| 26 | HOURS 29-36: Demo preparation and testing | Pending |
| 27 | HOURS 37-44: Final polish and documentation | Pending |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

Perfect! Now let me create detailed code templates for the critical components you'll need to implement.

<write_to_file>
<path>docs/my_part/CODE_TEMPLATES.md</path>
<content># Elith Backend - Code Templates
**Quick reference for implementation**

---

## 1. Project Setup Files

### pyproject.toml
```toml
[project]
name = "elith"
version = "0.1.0"
description = "Universal repo-aware agent framework"
requires-python = ">=3.10"
dependencies = [
    "fastapi>=0.104.0",
    "uvicorn[standard]>=0.24.0",
    "pydantic>=2.5.0",
    "python-multipart>=0.0.6",
    "sse-starlette>=1.8.0",
]

[build-system]
requires = ["setuptools>=68.0"]
build-backend = "setuptools.build_meta"
```

### .env.example
```bash
# API Keys
ANTHROPIC_API_KEY=your_claude_key_here
GOOGLE_API_KEY=your_gemini_key_here
OPENAI_API_KEY=your_openai_key_here

# Server
HOST=0.0.0.0
PORT=8000
```

### .gitignore
```
__pycache__/
*.py[cod]
.Python
venv/
.env
.vscode/
.DS_Store
bob-reports/*.md
!bob-reports/.gitkeep
```

---

## 2. Pydantic Models

### backend/models/task_packet.py
```python
from pydantic import BaseModel
from typing import List, Optional

class FileInfo(BaseModel):
    path: str
    size: int
    extension: str
    is_key_file: bool = False

class Note(BaseModel):
    filename: str
    content: str
    tags: List[str] = []

class TaskPacket(BaseModel):
    repo_path: str
    vault_path: Optional[str] = None
    files: List[FileInfo]
    vault_notes: List[Note]
    total_files: int
    selected_files: List[str] = []
```

### backend/models/session.py
```python
from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum
from datetime import datetime

class SessionStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    ERROR = "error"

class Session(BaseModel):
    session_id: str
    model: str
    operation: str
    repo_path: str
    vault_path: Optional[str] = None
    status: SessionStatus = SessionStatus.PENDING
    output: str = ""
    files_changed: List[str] = []
    report_path: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
```

---

## 3. Context Engine

### backend/context_engine/repo_scanner.py
```python
from pathlib import Path
from typing import List, Set
from ..models.task_packet import FileInfo

class RepoScanner:
    SKIP_DIRS: Set[str] = {
        '.git', 'node_modules', '__pycache__', 'venv', '.venv',
        'env', 'dist', 'build', '.next', 'target'
    }
    
    KEY_FILES: Set[str] = {
        'README.md', 'package.json', 'pyproject.toml',
        'main.py', 'app.py', 'index.js'
    }
    
    def __init__(self, repo_path: str):
        self.repo_path = Path(repo_path).resolve()
        if not self.repo_path.exists():
            raise ValueError(f"Path does not exist: {repo_path}")
    
    def scan(self) -> List[FileInfo]:
        files = []
        for file_path in self._walk_directory(self.repo_path):
            relative_path = str(file_path.relative_to(self.repo_path))
            try:
                files.append(FileInfo(
                    path=relative_path,
                    size=file_path.stat().st_size,
                    extension=file_path.suffix,
                    is_key_file=file_path.name in self.KEY_FILES
                ))
            except (OSError, PermissionError):
                continue
        return files
    
    def _walk_directory(self, directory: Path):
        try:
            for item in directory.iterdir():
                if item.is_dir() and item.name not in self.SKIP_DIRS:
                    yield from self._walk_directory(item)
                elif item.is_file():
                    yield item
        except PermissionError:
            pass
```

### backend/context_engine/vault_reader.py
```python
from pathlib import Path
from typing import List, Optional
import re
from ..models.task_packet import Note

class VaultReader:
    def __init__(self, vault_path: Optional[str] = None):
        self.vault_path = Path(vault_path).resolve() if vault_path else None
    
    def read_notes(self) -> List[Note]:
        if not self.vault_path or not self.vault_path.exists():
            return []
        
        notes = []
        for md_file in self.vault_path.rglob("*.md"):
            try:
                content = md_file.read_text(encoding='utf-8')
                notes.append(Note(
                    filename=md_file.name,
                    content=content,
                    tags=self._extract_tags(content)
                ))
            except (OSError, UnicodeDecodeError):
                continue
        return notes
    
    def _extract_tags(self, content: str) -> List[str]:
        return list(set(re.findall(r'(?<!\#)\#([a-zA-Z0-9_-]+)', content)))
```

### backend/context_engine/packet_builder.py
```python
from typing import List, Dict
from pathlib import Path
from ..models.task_packet import TaskPacket, Note

class PacketBuilder:
    TASK_PATTERNS = {
        "explain": {"max_files": 6},
        "architect": {"max_files": 6},
        "test-gen": {"max_files": 4},
        "refactor": {"max_files": 4}
    }
    
    def __init__(self, task_packet: TaskPacket):
        self.packet = task_packet
    
    def build_context(self, operation: str, target_file: str = None) -> Dict:
        pattern = self.TASK_PATTERNS.get(operation, {"max_files": 4})
        
        # Start with key files
        selected = [f.path for f in self.packet.files if f.is_key_file]
        
        # Add operation-specific files
        if operation == "test-gen":
            selected.extend(self._find_files_without_tests())
        elif operation in ["explain", "architect"]:
            selected.extend(self._find_entry_points())
        
        # Limit to max
        selected = selected[:pattern["max_files"]]
        
        return {
            "selected_files": selected,
            "context": self._build_context_string(selected),
            "vault_notes": self._find_relevant_notes(operation),
            "total_files": self.packet.total_files,
            "files_loaded": len(selected)
        }
    
    def _build_context_string(self, file_paths: List[str]) -> str:
        repo_path = Path(self.packet.repo_path)
        parts = [
            f"Repository: {self.packet.repo_path}",
            f"Total files: {self.packet.total_files}",
            f"Files loaded: {len(file_paths)}\n"
        ]
        
        for path in file_paths:
            try:
                content = (repo_path / path).read_text(encoding='utf-8')
                parts.append(f"\n=== {path} ===\n{content}\n")
            except:
                parts.append(f"\n=== {path} ===\n[Unreadable]\n")
        
        return "\n".join(parts)
    
    def _find_files_without_tests(self) -> List[str]:
        # Simplified: return first few non-test files
        return [f.path for f in self.packet.files 
                if 'test' not in f.path.lower() 
                and f.extension in ['.py', '.js', '.ts']][:3]
    
    def _find_entry_points(self) -> List[str]:
        entry_names = ['main.py', 'app.py', 'index.js', 'main.go']
        return [f.path for f in self.packet.files 
                if Path(f.path).name in entry_names][:2]
    
    def _find_relevant_notes(self, operation: str) -> List[Note]:
        keywords = {
            "architect": ["architecture", "design"],
            "test-gen": ["testing", "test"],
            "explain": ["overview", "architecture"]
        }
        terms = keywords.get(operation, [])
        return [n for n in self.packet.vault_notes 
                if any(t in n.content.lower() for t in terms)][:2]
```

---

## 4. FastAPI Routes

### backend/main.py
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import scan, execute, stream, models, results, tasks

app = FastAPI(title="Elith API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scan.router, prefix="/api", tags=["scan"])
app.include_router(execute.router, prefix="/api", tags=["execute"])
app.include_router(stream.router, prefix="/api", tags=["stream"])
app.include_router(models.router, prefix="/api", tags=["models"])
app.include_router(results.router, prefix="/api", tags=["results"])
app.include_router(tasks.router, prefix="/api", tags=["tasks"])

@app.get("/")
async def root():
    return {"name": "Elith API", "version": "0.1.0", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
```

### backend/routes/scan.py
```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from ..context_engine.repo_scanner import RepoScanner
from ..context_engine.vault_reader import VaultReader
from ..models.task_packet import TaskPacket

router = APIRouter()

class ScanRequest(BaseModel):
    repo_path: str
    vault_path: Optional[str] = None

@router.post("/scan")
async def scan_repository(request: ScanRequest) -> TaskPacket:
    try:
        scanner = RepoScanner(request.repo_path)
        files = scanner.scan()
        
        vault_reader = VaultReader(request.vault_path)
        notes = vault_reader.read_notes()
        
        return TaskPacket(
            repo_path=request.repo_path,
            vault_path=request.vault_path,
            files=files,
            vault_notes=notes,
            total_files=len(files)
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scan failed: {str(e)}")
```

---

## 5. Session Management

### backend/session/manager.py
```python
from typing import Dict, Optional
import asyncio
from ..models.session import Session, SessionStatus

class SessionManager:
    def __init__(self):
        self.sessions: Dict[str, Session] = {}
        self.output_queues: Dict[str, asyncio.Queue] = {}
    
    def create_session(self, session_id: str, model: str, 
                      operation: str, repo_path: str) -> Session:
        session = Session(
            session_id=session_id,
            model=model,
            operation=operation,
            repo_path=repo_path
        )
        self.sessions[session_id] = session
        self.output_queues[session_id] = asyncio.Queue()
        return session
    
    def get_session(self, session_id: str) -> Optional[Session]:
        return self.sessions.get(session_id)
    
    async def add_output(self, session_id: str, content: str):
        if session_id in self.sessions:
            self.sessions[session_id].output += content
            if session_id in self.output_queues:
                await self.output_queues[session_id].put(content)
    
    async def stream_output(self, session_id: str):
        if session_id not in self.output_queues:
            return
        
        queue = self.output_queues[session_id]
        while True:
            try:
                content = await asyncio.wait_for(queue.get(), timeout=0.1)
                yield content
            except asyncio.TimeoutError:
                session = self.sessions.get(session_id)
                if session and session.status in [SessionStatus.COMPLETED, SessionStatus.ERROR]:
                    break

manager = SessionManager()
```

### backend/session/logger.py
```python
from pathlib import Path
from ..models.session import Session

class SessionLogger:
    def __init__(self, reports_dir: str = "bob-reports"):
        self.reports_dir = Path(reports_dir)
        self.reports_dir.mkdir(exist_ok=True)
        (self.reports_dir / ".gitkeep").touch()
    
    def log_session(self, session: Session) -> str:
        timestamp = session.created_at.strftime("%Y%m%d_%H%M%S")
        filename = f"session_{timestamp}_{session.session_id[:8]}.md"
        filepath = self.reports_dir / filename
        
        content = f"""# Elith Session Report

**Session ID:** {session.session_id}
**Model:** {session.model}
**Operation:** {session.operation}
**Status:** {session.status.value}

## Repository
{session.repo_path}

## Output
```
{session.output}
```

---
*Generated by Elith*
"""
        filepath.write_text(content, encoding='utf-8')
        return str(filepath)

logger = SessionLogger()
```

---

## 6. Model Router

### backend/router/model_router.py
```python
from typing import Generator
from ..providers.base_provider import BaseProvider

class ModelRouter:
    def __init__(self):
        self.providers = {}
    
    def register_provider(self, name: str, provider: BaseProvider):
        self.providers[name] = provider
    
    def route(self, model: str, prompt: str, context: str) -> Generator[str, None, None]:
        if model not in self.providers:
            yield f"Error: Model '{model}' not configured"
            return
        
        provider = self.providers[model]
        yield from provider.run(prompt, context)
    
    def get_available_models(self) -> list:
        return list(self.providers.keys())

router = ModelRouter()
```

---

## 7. Operations

### backend/operations/explain.py
```python
def build_explain_prompt(context: str) -> str:
    return f"""Analyze this codebase and explain its architecture.

{context}

Provide:
1. Overall structure
2. Key components
3. How they interact
4. Technology stack
5. Entry points

Focus on helping a new developer understand quickly."""
```

### backend/operations/architect.py
```python
def build_architect_prompt(context: str) -> str:
    return f"""Analyze this codebase and propose architectural improvements.

{context}

CRITICAL: Analyze THIS specific codebase. No generic answers.

Propose 2-3 improvements that are:
- Tailored to THIS code's patterns
- Based on actual files you see
- Production-ready with migration paths

For each:
- Why it fits THIS codebase (reference actual files)
- Tradeoffs
- Migration path
- Risks and mitigation"""
```

---

## 8. Run Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Run server
cd backend
uvicorn main:app --reload --port 8000

# Test scan endpoint
curl -X POST http://localhost:8000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"repo_path": "/path/to/repo"}'

# Test health
curl http://localhost:8000/health
```

---

*Use these templates as starting points. Adapt as needed.*
</content>
<line_count>485</line_count>
</write_to_file>

---

**User:**

[write_to_file for 'docs/my_part/CODE_TEMPLATES.md'] Result:
<file_write_result>
<path>docs/my_part/CODE_TEMPLATES.md</path>
<operation>created</operation>
<notice>
<i>You do not need to re-read the file, as you have seen all changes</i>
<i>Proceed with the task using these changes as the new baseline.</i>
</notice>
</file_write_result>

<environment_details>
# VSCode Visible Files
docs/my_part/CODE_TEMPLATES.md

# VSCode Open Tabs
docs/my_part/IMPLEMENTATION_PLAN.md,docs/my_part/CODE_TEMPLATES.md,AGENTS.md,.bob/rules-code/AGENTS.md,.bob/rules-advanced/AGENTS.md,.bob/rules-ask/AGENTS.md,.bob/rules-plan/AGENTS.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-16T03:44:46.591Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.90

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>plan</slug>
<name>📝 Plan</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Review project specifications and understand architecture | Completed |
| 2 | Understand team roles and dependencies | Completed |
| 3 | Team sync completed - API contract agreed with Johann | Completed |
| 4 | HOURS 2-4: Set up FastAPI project structure | In Progress |
| 5 | HOURS 2-4: Implement repo scanner (context_engine/repo_scanner.py) | Pending |
| 6 | HOURS 2-4: Implement vault reader (context_engine/vault_reader.py) | Pending |
| 7 | HOURS 2-4: Create POST /api/scan endpoint | Pending |
| 8 | HOURS 2-4: Test scan endpoint with curl | Pending |
| 9 | HOURS 5-8: Build packet builder for smart file selection | Pending |
| 10 | HOURS 5-8: Create /api/tasks endpoint | Pending |
| 11 | HOURS 5-8: Create /api/execute stub endpoint | Pending |
| 12 | HOURS 5-8: Build model_router.py skeleton | Pending |
| 13 | HOURS 9-14: Wire model router to Basil Joy's providers | Pending |
| 14 | HOURS 9-14: Implement real /api/execute with context building | Pending |
| 15 | HOURS 9-14: Build SSE streaming endpoint | Pending |
| 16 | HOURS 9-14: Create session logger for bob-reports/ | Pending |
| 17 | HOURS 9-14: Test full loop with Bob provider | Pending |
| 18 | HOURS 15-22: Implement operations (explain, architect, test-gen) | Pending |
| 19 | HOURS 15-22: Wire additional providers (Gemini, OpenAI, Ollama) | Pending |
| 20 | HOURS 15-22: Create /api/models endpoint | Pending |
| 21 | HOURS 15-22: End-to-end test on 3 real repos | Pending |
| 22 | HOURS 23-28: Full integration with Johann's frontend | Pending |
| 23 | HOURS 23-28: Add comprehensive error handling | Pending |
| 24 | HOURS 23-28: Deploy backend to Railway | Pending |
| 25 | HOURS 23-28: Test deployed backend with frontend | Pending |
| 26 | HOURS 29-36: Demo preparation and testing | Pending |
| 27 | HOURS 37-44: Final polish and documentation | Pending |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

Excellent! Now let me create one final document with integration points and coordination notes for working with Basil Joy and Johann.

<write_to_file>
<path>docs/my_part/INTEGRATION_GUIDE.md</path>
<content># Elith Backend - Integration Guide
**Coordination with Basil Joy (AI/ML) and Johann (UI/UX)**

---

## Integration with Basil Joy (Providers + Skills)

### What Basil Joy Provides

**1. Base Interfaces** (Hours 2-4)
```python
# backend/skills/base_skill.py
class BaseSkill(ABC):
    @property
    def name(self) -> str: pass
    
    @property
    def description(self) -> str: pass
    
    @property
    def parameters(self) -> Dict: pass
    
    def execute(self, repo_path: str, **kwargs) -> str: pass
    
    def to_anthropic_tool(self) -> Dict: pass
    def to_openai_tool(self) -> Dict: pass
    def to_gemini_function(self): pass

# backend/providers/base_provider.py
class BaseProvider(ABC):
    def __init__(self, repo_path: str, skills: List[BaseSkill]): pass
    
    def run(self, prompt: str, context: str) -> Generator[str, None, None]: pass
    
    def execute_skill(self, skill_name: str, **kwargs) -> str: pass
```

**2. All 12 Skills** (Hours 2-8)
- read_file, write_file, list_files, search_code
- git_diff, git_commit, run_tests, find_references
- analyze_dependencies, explain_function, install_package, read_logs

**3. Bob Provider** (Hours 5-8)
```python
# backend/providers/bob_provider.py
class BobProvider(BaseProvider):
    def __init__(self, repo_path: str):
        super().__init__(repo_path, [])  # No skills needed
    
    def run(self, prompt: str, context: str) -> Generator[str, None, None]:
        # Spawns Bob shell, streams output
        pass
```

**4. Claude Provider** (Hours 9-14)
```python
# backend/providers/claude_provider.py
class ClaudeProvider(BaseProvider):
    def __init__(self, repo_path: str, api_key: str):
        super().__init__(repo_path, ALL_SKILLS)
        self.client = anthropic.Anthropic(api_key=api_key)
    
    def run(self, prompt: str, context: str) -> Generator[str, None, None]:
        # Injects skills as tools, handles tool calling loop
        pass
```

**5. Other Providers** (Hours 15-22)
- gemini_provider.py
- openai_provider.py
- ollama_provider.py

### How You Wire Them

**In `backend/main.py`:**
```python
from .router.model_router import router as model_router
from .providers.bob_provider import BobProvider
from .providers.claude_provider import ClaudeProvider
# ... other providers

@app.on_event("startup")
async def startup_event():
    # Register Bob (no API key needed)
    bob = BobProvider(repo_path="")
    model_router.register_provider("bob", bob)
    
    # Register Claude if API key configured
    claude_key = os.getenv("ANTHROPIC_API_KEY")
    if claude_key:
        claude = ClaudeProvider(repo_path="", api_key=claude_key)
        model_router.register_provider("claude", claude)
    
    # ... register other providers
```

**In `backend/routes/execute.py`:**
```python
async def run_operation(session_id, model, operation, prompt, context):
    try:
        session = manager.get_session(session_id)
        session.status = SessionStatus.RUNNING
        
        # Route to model - this calls Basil Joy's provider
        async for chunk in model_router.route(model, prompt, context):
            await manager.add_output(session_id, chunk)
        
        manager.complete_session(session_id)
        
        # Log session
        session = manager.get_session(session_id)
        report_path = logger.log_session(session)
        session.report_path = report_path
    except Exception as e:
        manager.error_session(session_id, str(e))
```

### Coordination Points

**Hour 8 Checkpoint:**
- ✅ You: Model router skeleton ready
- ✅ Basil Joy: Bob provider ready
- 🔄 Wire Bob provider, test end-to-end

**Hour 14 Checkpoint:**
- ✅ You: Full integration loop working
- ✅ Basil Joy: Claude provider ready
- 🔄 Wire Claude provider, test skill calling

**Hour 22 Checkpoint:**
- ✅ You: All operations implemented
- ✅ Basil Joy: All 4 providers ready
- 🔄 Test same task on all providers

### If Basil Joy is Blocked

**Temporary Mock Provider:**
```python
# backend/providers/mock_provider.py
class MockProvider(BaseProvider):
    def __init__(self, repo_path: str):
        super().__init__(repo_path, [])
    
    def run(self, prompt: str, context: str):
        yield "Mock output: Analyzing codebase...\n"
        yield "Mock output: Found 3 key patterns...\n"
        yield "Mock output: Proposal 1: Use event sourcing...\n"
```

Use this to keep integration moving while waiting for real providers.

---

## Integration with Johann (Frontend)

### What Johann Consumes

**1. API Endpoints** (You provide)
```
POST /api/scan
POST /api/execute
GET  /api/stream/{session_id}
GET  /api/models
GET  /api/results/{session_id}
GET  /api/tasks
```

**2. Response Formats**

**Scan Response:**
```json
{
  "repo_path": "/path/to/repo",
  "vault_path": null,
  "files": [
    {"path": "main.py", "size": 1234, "extension": ".py", "is_key_file": true}
  ],
  "vault_notes": [],
  "total_files": 42,
  "selected_files": []
}
```

**Execute Response:**
```json
{
  "session_id": "uuid-here",
  "files_loaded": 6,
  "total_files": 312
}
```

**SSE Stream Format:**
```javascript
// Event: output
{
  "type": "output",
  "content": "Analyzing codebase...\n",
  "model": "bob"
}

// Event: done
{
  "type": "done",
  "session_id": "uuid-here"
}
```

**Models Response:**
```json
{
  "available": ["bob", "claude", "gemini", "openai", "ollama"],
  "configured": ["bob", "claude"]
}
```

**Results Response:**
```json
{
  "output": "Full output text...",
  "files_changed": ["src/auth.py", "tests/test_auth.py"],
  "report_path": "bob-reports/session_20260516_091234_abc123.md",
  "status": "completed"
}
```

### CORS Configuration

**Already in `backend/main.py`:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Johann's frontend can connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**For production, update to:**
```python
allow_origins=[
    "http://localhost:3000",  # Johann's dev
    "https://elith-frontend.vercel.app"  # Johann's prod
]
```

### SSE Connection Example (For Johann)

```javascript
// Johann's frontend code
const eventSource = new EventSource(
  `http://localhost:8000/api/stream/${sessionId}`
);

eventSource.addEventListener('output', (e) => {
  const data = JSON.parse(e.data);
  console.log(data.content);  // Stream to UI
});

eventSource.addEventListener('done', (e) => {
  eventSource.close();
  // Fetch final results
});
```

### Coordination Points

**Hour 14 Checkpoint:**
- ✅ You: All endpoints working
- ✅ Johann: Frontend can call /api/scan
- 🔄 Test scan → execute → stream flow

**Hour 28 Checkpoint:**
- ✅ You: Backend deployed to Railway
- ✅ Johann: Frontend deployed to Vercel
- 🔄 Test production URLs

### If Johann is Blocked

**Test with curl:**
```bash
# Test full flow
SESSION_ID=$(curl -X POST http://localhost:8000/api/execute \
  -H "Content-Type: application/json" \
  -d '{"model":"bob","operation":"explain","repo_path":"/path/to/repo"}' \
  | jq -r '.session_id')

# Stream output
curl -N http://localhost:8000/api/stream/$SESSION_ID

# Get results
curl http://localhost:8000/api/results/$SESSION_ID
```

---

## Communication Protocol

### Sync Calls (Every 8 Hours)

**Hour 1:** Team sync - API contract agreed ✅  
**Hour 9:** Integration checkpoint - Bob provider wired  
**Hour 17:** Mid-point check - All providers status  
**Hour 25:** Integration test - Frontend + backend  
**Hour 33:** Demo prep - Final testing  
**Hour 41:** Pre-submit - Final checks

### Slack/WhatsApp Protocol

**When you're blocked:**
```
@basil-joy BLOCKED: Need bob_provider.py to test integration
ETA needed: Next 2 hours
Workaround: Using mock provider for now
```

**When you're ready for integration:**
```
@johann READY: /api/scan and /api/execute working
Test URL: http://localhost:8000
Docs: See INTEGRATION_GUIDE.md
```

**When you discover an issue:**
```
@team ISSUE: SSE streaming breaks on Railway
Impact: Demo won't work in production
Investigating: CORS or connection timeout
ETA: 1 hour
```

### Commit Messages

**Your commits:**
```
feat: implement repo scanner and vault reader
feat: add context engine with smart file selection
feat: wire Bob provider for native execution
fix: SSE streaming timeout on long operations
```

**Branch strategy:**
```
main              # Protected, only merge after testing
├── backend-core  # Your work
├── providers     # Basil Joy's work
└── frontend      # Johann's work
```

---

## Testing Strategy

### Unit Tests (Optional but Recommended)

```python
# tests/test_repo_scanner.py
def test_repo_scanner_skips_node_modules():
    scanner = RepoScanner("/path/to/test/repo")
    files = scanner.scan()
    assert not any("node_modules" in f.path for f in files)

def test_repo_scanner_finds_key_files():
    scanner = RepoScanner("/path/to/test/repo")
    files = scanner.scan()
    key_files = [f for f in files if f.is_key_file]
    assert any(f.path == "README.md" for f in key_files)
```

### Integration Tests

```python
# tests/test_integration.py
async def test_full_flow():
    # 1. Scan repo
    response = await client.post("/api/scan", json={
        "repo_path": "/path/to/test/repo"
    })
    assert response.status_code == 200
    
    # 2. Execute operation
    response = await client.post("/api/execute", json={
        "model": "bob",
        "operation": "explain",
        "repo_path": "/path/to/test/repo"
    })
    session_id = response.json()["session_id"]
    
    # 3. Stream output
    # (Test SSE connection)
    
    # 4. Get results
    response = await client.get(f"/api/results/{session_id}")
    assert response.status_code == 200
```

### Manual Testing Checklist

**Hours 2-4:**
- [ ] `/api/scan` returns file list
- [ ] Vault reader handles missing vault gracefully
- [ ] Key files are marked correctly

**Hours 5-8:**
- [ ] Context builder selects 4-6 files max
- [ ] Different operations select different files
- [ ] Context string includes file contents

**Hours 9-14:**
- [ ] Session created and tracked
- [ ] SSE streaming works
- [ ] Session logged to bob-reports/
- [ ] Bob provider runs natively

**Hours 15-22:**
- [ ] All 3 operations work
- [ ] All 4 providers work
- [ ] Same task → same quality across providers

**Hours 23-28:**
- [ ] Frontend connects successfully
- [ ] Model switching works
- [ ] Error messages are clear
- [ ] Deployment works

---

## Deployment Checklist

### Railway Deployment

**1. Create Railway project:**
```bash
railway login
railway init
railway link
```

**2. Set environment variables:**
```bash
railway variables set ANTHROPIC_API_KEY=sk-...
railway variables set GOOGLE_API_KEY=...
railway variables set OPENAI_API_KEY=sk-...
```

**3. Deploy:**
```bash
railway up
```

**4. Test deployed URL:**
```bash
curl https://elith.up.railway.app/health
```

### Environment Variables Needed

```bash
# Required for providers
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
OPENAI_API_KEY=sk-...

# Optional
HOST=0.0.0.0
PORT=8000
```

### Deployment Issues

**SSE not working over HTTPS:**
- Check Railway timeout settings
- Ensure proper SSE headers
- Test with curl first

**CORS errors:**
- Update allowed origins
- Check credentials setting
- Verify preflight requests

---

## Demo Day Checklist

**Pre-demo (Hour 33-36):**
- [ ] Pick demo repo (50-200 files, real project)
- [ ] Test full workflow 3 times
- [ ] Ensure Bob reports in bob-reports/
- [ ] Verify all providers work
- [ ] Check deployment is stable

**Demo script (3 minutes):**
1. Show Elith → point to demo repo
2. Bob runs "architect" → shows 6 files loaded
3. Bob proposes novel architecture
4. Switch to Claude → same task
5. Claude proposes same quality
6. "Any model. Bob-level. Your choice."

**Backup plan:**
- Screen recording if live demo fails
- Local demo if deployment down
- Mock data if providers fail

---

*Keep this guide updated as you discover integration issues.*
</content>
<line_count>485</line_count>
</write_to_file>

---

**User:**

[write_to_file for 'docs/my_part/INTEGRATION_GUIDE.md'] Result:
<file_write_result>
<path>docs/my_part/INTEGRATION_GUIDE.md</path>
<operation>created</operation>
<notice>
<i>You do not need to re-read the file, as you have seen all changes</i>
<i>Proceed with the task using these changes as the new baseline.</i>
</notice>
</file_write_result>

<environment_details>
# VSCode Visible Files
docs/my_part/INTEGRATION_GUIDE.md

# VSCode Open Tabs
docs/my_part/IMPLEMENTATION_PLAN.md,docs/my_part/CODE_TEMPLATES.md,docs/my_part/INTEGRATION_GUIDE.md,AGENTS.md,.bob/rules-code/AGENTS.md,.bob/rules-advanced/AGENTS.md,.bob/rules-ask/AGENTS.md,.bob/rules-plan/AGENTS.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-16T03:45:47.289Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$1.05

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>plan</slug>
<name>📝 Plan</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Review project specifications and understand architecture | Completed |
| 2 | Understand team roles and dependencies | Completed |
| 3 | Team sync completed - API contract agreed with Johann | Completed |
| 4 | HOURS 2-4: Set up FastAPI project structure | In Progress |
| 5 | HOURS 2-4: Implement repo scanner (context_engine/repo_scanner.py) | Pending |
| 6 | HOURS 2-4: Implement vault reader (context_engine/vault_reader.py) | Pending |
| 7 | HOURS 2-4: Create POST /api/scan endpoint | Pending |
| 8 | HOURS 2-4: Test scan endpoint with curl | Pending |
| 9 | HOURS 5-8: Build packet builder for smart file selection | Pending |
| 10 | HOURS 5-8: Create /api/tasks endpoint | Pending |
| 11 | HOURS 5-8: Create /api/execute stub endpoint | Pending |
| 12 | HOURS 5-8: Build model_router.py skeleton | Pending |
| 13 | HOURS 9-14: Wire model router to Basil Joy's providers | Pending |
| 14 | HOURS 9-14: Implement real /api/execute with context building | Pending |
| 15 | HOURS 9-14: Build SSE streaming endpoint | Pending |
| 16 | HOURS 9-14: Create session logger for bob-reports/ | Pending |
| 17 | HOURS 9-14: Test full loop with Bob provider | Pending |
| 18 | HOURS 15-22: Implement operations (explain, architect, test-gen) | Pending |
| 19 | HOURS 15-22: Wire additional providers (Gemini, OpenAI, Ollama) | Pending |
| 20 | HOURS 15-22: Create /api/models endpoint | Pending |
| 21 | HOURS 15-22: End-to-end test on 3 real repos | Pending |
| 22 | HOURS 23-28: Full integration with Johann's frontend | Pending |
| 23 | HOURS 23-28: Add comprehensive error handling | Pending |
| 24 | HOURS 23-28: Deploy backend to Railway | Pending |
| 25 | HOURS 23-28: Test deployed backend with frontend | Pending |
| 26 | HOURS 29-36: Demo preparation and testing | Pending |
| 27 | HOURS 37-44: Final polish and documentation | Pending |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

Perfect! Now let me create a final summary document and then present the complete plan to you.

<write_to_file>
<path>docs/my_part/QUICK_START.md</path>
<content># Elith Backend - Quick Start Guide
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
</content>
<line_count>213</line_count>
</write_to_file>

---

**User:**

[write_to_file for 'docs/my_part/QUICK_START.md'] Result:
<file_write_result>
<path>docs/my_part/QUICK_START.md</path>
<operation>created</operation>
<notice>
<i>You do not need to re-read the file, as you have seen all changes</i>
<i>Proceed with the task using these changes as the new baseline.</i>
</notice>
</file_write_result>

<environment_details>
# VSCode Visible Files
docs/my_part/QUICK_START.md

# VSCode Open Tabs
docs/my_part/IMPLEMENTATION_PLAN.md,docs/my_part/CODE_TEMPLATES.md,docs/my_part/INTEGRATION_GUIDE.md,docs/my_part/QUICK_START.md,AGENTS.md,.bob/rules-code/AGENTS.md,.bob/rules-advanced/AGENTS.md,.bob/rules-ask/AGENTS.md,.bob/rules-plan/AGENTS.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-16T03:46:16.800Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$1.22

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>plan</slug>
<name>📝 Plan</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Review project specifications and understand architecture | Completed |
| 2 | Understand team roles and dependencies | Completed |
| 3 | Team sync completed - API contract agreed with Johann | Completed |
| 4 | HOURS 2-4: Set up FastAPI project structure | In Progress |
| 5 | HOURS 2-4: Implement repo scanner (context_engine/repo_scanner.py) | Pending |
| 6 | HOURS 2-4: Implement vault reader (context_engine/vault_reader.py) | Pending |
| 7 | HOURS 2-4: Create POST /api/scan endpoint | Pending |
| 8 | HOURS 2-4: Test scan endpoint with curl | Pending |
| 9 | HOURS 5-8: Build packet builder for smart file selection | Pending |
| 10 | HOURS 5-8: Create /api/tasks endpoint | Pending |
| 11 | HOURS 5-8: Create /api/execute stub endpoint | Pending |
| 12 | HOURS 5-8: Build model_router.py skeleton | Pending |
| 13 | HOURS 9-14: Wire model router to Basil Joy's providers | Pending |
| 14 | HOURS 9-14: Implement real /api/execute with context building | Pending |
| 15 | HOURS 9-14: Build SSE streaming endpoint | Pending |
| 16 | HOURS 9-14: Create session logger for bob-reports/ | Pending |
| 17 | HOURS 9-14: Test full loop with Bob provider | Pending |
| 18 | HOURS 15-22: Implement operations (explain, architect, test-gen) | Pending |
| 19 | HOURS 15-22: Wire additional providers (Gemini, OpenAI, Ollama) | Pending |
| 20 | HOURS 15-22: Create /api/models endpoint | Pending |
| 21 | HOURS 15-22: End-to-end test on 3 real repos | Pending |
| 22 | HOURS 23-28: Full integration with Johann's frontend | Pending |
| 23 | HOURS 23-28: Add comprehensive error handling | Pending |
| 24 | HOURS 23-28: Deploy backend to Railway | Pending |
| 25 | HOURS 23-28: Test deployed backend with frontend | Pending |
| 26 | HOURS 29-36: Demo preparation and testing | Pending |
| 27 | HOURS 37-44: Final polish and documentation | Pending |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

<attempt_completion>
<result>
# Elith Backend Planning Complete ✅

I've created a comprehensive implementation plan for your role as Architect + Team Lead. Here's what you have:

## 📚 Planning Documents Created

1. **IMPLEMENTATION_PLAN.md** - Complete 48-hour timeline with all phases (Hours 2-44)
2. **CODE_TEMPLATES.md** - Ready-to-use code templates for all core components
3. **INTEGRATION_GUIDE.md** - Coordination guide for working with Basil Joy and Johann
4. **QUICK_START.md** - Get started guide for your next 2 hours (Hours 2-4)

## 🎯 Your Current Status

- ✅ Team sync completed
- ✅ API contract agreed with Johann
- ✅ Architecture understood
- 🔄 **Ready to start Hours 2-4: Backend Foundation**

## 📋 Next Steps (Hours 2-4)

Your immediate tasks:
1. Create FastAPI project structure
2. Build Pydantic models (task_packet.py, session.py)
3. Implement repo scanner (walks directory, skips .git/node_modules)
4. Implement vault reader (reads Obsidian .md files)
5. Create `/api/scan` endpoint
6. Test with curl

**Goal:** Working `/api/scan` endpoint that returns file list + vault notes

## 🚀 How to Proceed

**Option 1:** Switch to Code mode to start implementation
```
Use switch_mode tool or click "💻 Code" mode
```

**Option 2:** Review the planning documents first
- Start with QUICK_START.md for immediate next steps
- Reference CODE_TEMPLATES.md for copy-paste code
- Check INTEGRATION_GUIDE.md for team coordination

## 📊 Project Structure Ready

```
elith/
├── backend/
│   ├── main.py (FastAPI entry)
│   ├── models/ (Pydantic models)
│   ├── routes/ (API endpoints)
│   ├── context_engine/ (Smart file selection)
│   ├── router/ (Model routing)
│   ├── session/ (Session management)
│   ├── operations/ (Task operations)
│   ├── skills/ (Basil Joy provides)
│   └── providers/ (Basil Joy provides)
└── docs/my_part/ (Your planning docs)
```

## ⚡ Critical Path

- **Hours 2-8:** Backend foundation + context engine (YOUR FOCUS)
- **Hours 9-14:** Integration with Basil Joy's providers
- **Hours 15-22:** Operations + all providers working
- **Hours 23-28:** Deploy + integrate with Johann's frontend
- **Hours 29-44:** Demo prep + polish + submit

All planning documents are in `docs/my_part/` - reference them as you build!
</result>
</attempt_completion>

