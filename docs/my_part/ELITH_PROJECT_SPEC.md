# Elith — Universal Repo-Aware Agent Framework
**Project Name:** Elith  
**Hackathon:** IBM Bob Hackathon — lablab.ai (May 15–17, 2026)  
**Team:** [Your Team Name]  
**Tagline:** *Every model. Bob-level repo awareness. One framework.*

---

## The Core Idea

IBM Bob is powerful because it **lives inside your repository**. It reads files, writes code, runs tests, and understands your entire codebase natively — no API calls, no context stuffing, no guessing.

Every other model — Claude, Gemini, GPT, Local LLM — is smart but **blind**. They only know what you paste into the prompt.

**Elith fixes this.**

Elith gives every model the same repo-awareness Bob has natively — through a skill layer of agent tools. Bob is the standard. Elith brings everyone up to it.

> "IBM Bob is so powerful we built a whole framework to replicate its capabilities across every model."

---

## The Problem

AI-assisted development fails in three ways:

**1. Most models are repo-blind.**  
Claude, Gemini, GPT — they're powerful reasoners but they can't read your files, run your tests, or commit your changes. You have to paste everything manually. Context gets bloated. Output quality drops.

**2. AI gives textbook solutions, not production-ready ones.**  
Ask any model to architect a system and it gives you the generic answer. It never proposes a hybrid CQRS pattern because your specific read/write ratio demands it. It never suggests a strangler fig migration because your constraints require it. Real senior engineers don't give textbook answers.

**3. Context bloat kills focus.**  
Loading an entire repo into a context window wastes tokens and reduces output quality. You need the right 6 files, not all 312.

---

## The Solution — Elith

```
IBM Bob    → repo-aware natively (the gold standard)
Other LLMs → repo-blind by default

Elith      → gives every model Bob-level repo skills
             via agent tool calling
```

Elith is a **universal repo-aware agent framework** with three layers:

> **Work Smarter:** Obsidian is the database. Context window is working memory. Only load what the current task needs.

> **Work Faster:** Novel, production-ready architectures tailored to your actual codebase — not textbook answers.

> **Work Universally:** Any model, any provider. Bob natively. Everyone else via Elith's agent skill layer.

---

## System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                           ELITH                                  │
│          Universal Repo-Aware Agent Framework                    │
├──────────────────┬───────────────────┬───────────────────────────┤
│  MEMORY LAYER    │  CONTEXT ENGINE   │  AGENT LAYER              │
│                  │                   │                           │
│  Obsidian Vault  │  Elith Selector   │  IBM Bob                  │
│  (long-term)     │                   │  (native repo access)     │
│                  │  • Reads vault    │                           │
│  • Architecture  │  • Scans repo     │  Claude + Skills          │
│    notes         │  • Picks only     │  Gemini + Skills          │
│  • Decisions     │    what task      │  GPT/Codex + Skills       │
│  • Standards     │    needs          │  Local LLM + Skills       │
│  • Tech debt     │  • Routes to      │                           │
│  • Task briefs   │    right model    │  ↓                        │
│                  │                   │  ELITH SKILL LAYER        │
│                  │                   │  (agent tool calling)     │
│                  │                   │  read_file, write_file    │
│                  │                   │  search_code, git_diff    │
│                  │                   │  run_tests, find_refs...  │
└──────────────────┴───────────────────┴───────────────────────────┘
                              ↓
                    YOUR REPOSITORY (any codebase)
```

---

## The Skill Layer — Making Every Model Bob-Level

This is Elith's core innovation. When a non-Bob model is selected, Elith wraps it with agent tools that replicate what Bob does natively.

### Bob vs Elith-Skilled Model

| Capability | IBM Bob | Claude/Gemini/GPT + Elith Skills |
|-----------|---------|----------------------------------|
| Read any file | ✅ Native | ✅ `read_file(path)` |
| Browse directory | ✅ Native | ✅ `list_files(path)` |
| Write/edit files | ✅ Native | ✅ `write_file(path, content)` |
| Search codebase | ✅ Native | ✅ `search_code(query)` |
| View git diff | ✅ Native | ✅ `git_diff(branch?)` |
| Commit changes | ✅ Native | ✅ `git_commit(message)` |
| Run tests | ✅ Native | ✅ `run_tests(path?)` |
| Find references | ✅ Native | ✅ `find_references(symbol)` |
| Analyze dependencies | ✅ Native | ✅ `analyze_dependencies()` |
| Explain function | ✅ Native | ✅ `explain_function(path, fn)` |
| Install packages | ✅ Native | ✅ `install_package(name)` |
| Read error logs | ✅ Native | ✅ `read_logs(path?)` |

**Result:** Every model in Elith operates at Bob-level repo awareness. The user picks any model they prefer — the skill layer handles the rest.

---

## Multi-Model Support

Elith works with any provider the user configures:

| Model | Provider | How It Gets Repo Skills |
|-------|---------|------------------------|
| **IBM Bob** | IBM Bob Shell | Native — no skills needed |
| **Claude** | Anthropic API | Elith skill layer (tool calling) |
| **Gemini** | Google AI SDK | Elith skill layer (function calling) |
| **GPT-4 / Codex** | OpenAI API | Elith skill layer (tool calling) |
| **Mistral** | Mistral API | Elith skill layer |
| **Local LLM** | Ollama | Elith skill layer (tool calling) |
| **Any OpenAI-compatible** | Custom endpoint | Elith skill layer |

User configures which models they have access to. Elith activates only the configured ones. Bob is always the default if available.

---

## The Two Pillars

### Pillar 1 — Work Smarter (Context Engine)

```
Developer selects task
        ↓
Elith reads Obsidian vault (long-term memory)
        ↓
Elith scans repo structure
        ↓
Builds MINIMAL focused task packet:
  → Only 4-6 relevant files (not 312)
  → Only relevant vault notes
  → Only relevant past decisions
        ↓
Routes to chosen model
        ↓
Bob runs natively
OR other model runs with Elith skill layer
```

### Pillar 2 — Work Faster (Novel Architecture Generation)

Every model gives textbook solutions. Elith + any model gives the *right* solution for your specific codebase.

```
Model reads your FULL repository (via skills or natively)
        ↓
Elith analyzes:
  • Actual code patterns
  • Current architecture style  
  • Tech debt and constraints
  • Module dependencies
  • Performance bottlenecks
        ↓
Proposes 2-3 NOVEL architectures:
  • Tailored to YOUR codebase
  • With tradeoff analysis
  • With migration path
  • With production-readiness checklist
        ↓
Developer picks one → Model implements it
```

| What you ask | Standard AI answer | Elith answer |
|---|---|---|
| "Structure this service?" | Generic MVC/REST | Hybrid CQRS — your read:write is 20:1 |
| "Migrate this legacy system?" | Full rewrite | Strangler Fig — you can't stop the business |
| "Handle state?" | Redux | Event sourcing — you need audit trails |

---

## Operations

| Operation | What It Does | Models That Can Run It |
|-----------|-------------|----------------------|
| `explain` | Explains repo architecture in plain language | All |
| `risk-scan` | Identifies risky or fragile files | All |
| `architect` | Proposes novel architectures tailored to codebase | All |
| `refactor` | Safely refactors target module | All |
| `test-gen` | Generates missing tests | All |
| `document` | Writes/updates documentation | All |
| `harden` | Adds production-readiness improvements | All |
| `review-summary` | "What changed and why" for reviewers | All |

---

## How IBM Bob Fits (Hackathon Compliance)

Bob is the **native gold standard** that Elith is built around. The entire skill layer exists because Bob is so capable — Elith replicates that capability for every other model.

Bob is used for:
- Setting the capability benchmark every other model is measured against
- Leading repo-aware execution when available
- Producing exportable session reports for judging evidence

For the demo: Bob runs first and natively. Then the same task runs on Claude with Elith skills. Judges see Bob's level — then see Elith match it on any model.

---

## User Flow (Demo)

```
1. User opens Elith, points to repo

2. Selects model: IBM Bob (default)
   → Bob runs natively
   → Proposes novel auth architecture
   → Implements it

3. User switches to Claude
   → Elith activates skill layer
   → Claude reads same files via read_file()
   → Same quality output, same repo awareness
   → Same result

4. User switches to Local LLM (offline)
   → Elith activates skill layer
   → Local model operates at Bob level
   → No API keys needed

Judges see: "Any model. Bob-level. Your choice."
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Orchestration | Python 3.10+ |
| API Layer | FastAPI |
| Context Engine | Python + pathlib |
| Model Router | Python (custom) |
| Agent Skill Layer | Python tool calling (per provider) |
| Bob Integration | IBM Bob Shell (CLI) |
| Claude Integration | Anthropic API (tool_use) |
| Gemini Integration | Google AI SDK (function_calling) |
| GPT Integration | OpenAI API (tool_calling) |
| Local LLM | Ollama (tool_calling) |
| Terminal UI | Textual (Python) |
| Web Dashboard | React + TypeScript + Tailwind |
| Memory Layer | Obsidian (markdown folder) |

---

## Project Structure

```
elith/
├── README.md
├── pyproject.toml
├── .gitignore
├── LICENSE (MIT)
│
├── backend/
│   ├── main.py                         # FastAPI entry
│   ├── router/
│   │   └── model_router.py             # Routes to right model
│   ├── context_engine/
│   │   ├── vault_reader.py             # Reads Obsidian vault
│   │   ├── repo_scanner.py             # Scans repo structure
│   │   └── packet_builder.py           # Builds task packets
│   ├── skills/                         # THE CORE INNOVATION
│   │   ├── base_skill.py               # Abstract skill interface
│   │   ├── read_file.py
│   │   ├── write_file.py
│   │   ├── list_files.py
│   │   ├── search_code.py
│   │   ├── git_diff.py
│   │   ├── git_commit.py
│   │   ├── run_tests.py
│   │   ├── find_references.py
│   │   ├── analyze_dependencies.py
│   │   ├── explain_function.py
│   │   ├── install_package.py
│   │   └── read_logs.py
│   ├── providers/                      # One file per model provider
│   │   ├── base_provider.py            # Abstract provider interface
│   │   ├── bob_provider.py             # IBM Bob shell (native)
│   │   ├── claude_provider.py          # Anthropic API + skills
│   │   ├── gemini_provider.py          # Google AI + skills
│   │   ├── openai_provider.py          # OpenAI/Codex + skills
│   │   ├── ollama_provider.py          # Local LLM + skills
│   │   └── custom_provider.py          # Any OpenAI-compatible API
│   └── operations/
│       ├── explain.py
│       ├── risk_scan.py
│       ├── architect.py                # Novel arch generator
│       ├── refactor.py
│       ├── test_gen.py
│       ├── document.py
│       ├── harden.py
│       └── review_summary.py
│
├── tui/                                # Terminal UI (Textual)
│   ├── app.py
│   ├── screens/
│   └── components/
│
├── frontend/                           # Web Dashboard (React)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   └── stores/
│   └── package.json
│
├── obsidian-template/
└── bob-reports/
```

---

## Team Roles

| Person | Role | Owns |
|--------|------|------|
| **[You]** | Architect + Lead | FastAPI, model router, context engine, integration |
| **Basil Joy** | AI/ML Core | All providers, skill layer, novel arch generator, prompts |
| **Johann** | UI/UX | TUI + React dashboard, slides, README, demo video |

---

## MVP (48 Hours)

**Must ship:**
- Skill layer working for at least 2 non-Bob models
- Bob running natively
- Context engine loading minimal relevant files
- 3 operations: explain, architect, test-gen
- Novel architecture proposals on a real repo
- TUI showing live output
- React dashboard showing context + proposals + results
- Bob session reports auto-exported
- Demo: same task on Bob → then Claude with skills → same quality

**Phase 2:**
- Shannon security testing
- Full Obsidian API
- VS Code extension
- More providers (Mistral, Cohere, etc.)

---

## One-Line Pitch

> Elith is a universal repo-aware agent framework that gives every AI model — Claude, Gemini, GPT, local LLMs — the same codebase skills IBM Bob has natively, so developers can work with any model at Bob-level quality.

---

## Taglines
- *Every model. Bob-level. Your choice.*
- *Bob sets the standard. Elith brings everyone up to it.*
- *Load less. Think deeper. Ship better.*

---

*Private working document — Elith Hackathon Team — IBM Bob Hackathon May 2026*
