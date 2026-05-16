# Elith — Smarter Context. Novel Architecture. Faster Shipping.

**Project Name:** Elith  
**Hackathon:** IBM Bob Hackathon — lablab.ai (May 15–17, 2026)  
**Team:** [Your Team Name]  
**Tagline:** *Load less. Think deeper. Ship better.*

---

## The Problem

AI-assisted development fails developers in three predictable ways:

**1. Context bloat kills focus.**  
When you dump an entire repo into an AI tool, the output gets noisy, unfocused, and unreliable. Most developers waste 30–40% of their AI interaction time feeding irrelevant context.

**2. AI gives you textbook solutions, not production-ready ones.**  
Ask any AI model to architect a system and it will give you the canonical answer — the one from the first page of Google. It never suggests a hybrid event-sourced CQRS pattern because your specific read/write ratio demands it. It never proposes a strangler fig migration because your legacy constraints require it. It gives you the safe, average answer. Real senior engineers don't do that.

**3. Generated output still needs heavy cleanup.**  
Even fast code generation leaves behind weak tests, missing docs, and production-readiness gaps that slow teams down before they can ship.

---

## The Solution — Elith

Elith is a **Bob-centered developer workflow** built on two principles:

> **Work Smarter:** Obsidian is the database. The context window is working memory. Only the current task decides what gets loaded.

> **Work Faster:** Instead of textbook solutions, Elith uses IBM Bob's full repository understanding to generate novel, production-ready architectures tailored to your actual codebase — then implements them.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                          ELITH                              │
│              Smarter Context. Novel Architecture.           │
├──────────────────┬──────────────────┬───────────────────────┤
│  MEMORY LAYER    │  CONTEXT ENGINE  │  EXECUTION LAYER      │
│                  │                  │                        │
│  Obsidian Vault  │  Elith Selector  │  Elith       │
│                  │                  │                        │
│  • Architecture  │  • Reads vault   │  • IBM Bob (core)      │
│    notes         │  • Reads repo    │  • Novel arch gen      │
│  • Design        │    structure     │  • Refactor            │
│    decisions     │  • Picks ONLY    │  • Test generation     │
│  • Coding        │    what current  │  • Documentation       │
│    standards     │    task needs    │  • Production          │
│  • Task briefs   │  • Builds task   │    hardening           │
│  • Bug history   │    packet        │  • Architecture        │
│  • Module        │                  │    proposals           │
│    summaries     │                  │                        │
└──────────────────┴──────────────────┴───────────────────────┘
                            ↓
                    IBM Bob IDE (Core Partner)
              Repository-aware coding, explanation,
              transformation, review, and export
```

---

## The Two Pillars in Detail

---

### Pillar 1 — Work Smarter (Context Engine)

**The Core Insight:**  
Every AI tool wastes tokens. Elith treats context quality as a first-class engineering problem.

**How It Works:**

```
Developer selects task
        ↓
Elith reads Obsidian vault (project long-term memory)
        ↓
Elith scans repo structure (files, modules, dependencies)
        ↓
Elith builds a MINIMAL focused task packet containing:
  - Only the relevant files for this task
  - Only the relevant architecture notes
  - Only the relevant past decisions
  - The task brief (what needs to be done)
        ↓
Task packet → Elith → IBM Bob
```

**Obsidian as Long-Term Memory:**

```
obsidian-vault/
├── architecture/
│   ├── system-overview.md
│   ├── module-decisions.md
│   └── tech-debt.md
├── standards/
│   ├── coding-standards.md
│   └── testing-standards.md
├── tasks/
│   ├── current-sprint.md
│   └── task-briefs/
└── history/
    ├── decisions-log.md
    └── bug-history.md
```

Instead of loading 200 files, Elith loads 4–6 relevant ones. Bob gets a cleaner starting point. Output quality jumps.

---

### Pillar 2 — Work Faster (Novel Architecture Generation)

**The Core Insight:**  
Every AI model gives you the textbook solution. Elith + Bob gives you the *right* solution for your specific codebase.

**The Problem With Standard AI Architecture Advice:**

| What you ask | What AI normally gives | What you actually need |
|---|---|---|
| "How should I structure this service?" | Generic MVC/REST boilerplate | Hybrid CQRS because your read:write ratio is 20:1 |
| "How do I migrate this legacy system?" | Full rewrite recommendation | Strangler Fig pattern because you can't stop the business |
| "How should I handle state?" | Redux or Context API | Event sourcing because you need audit trails |
| "How do I scale this?" | Add a cache layer | CQRS + read replicas because your query patterns demand it |

**How Elith Solves This:**

```
Bob reads your FULL repository (not just the question)
        ↓
Elith analyzes:
  - Your actual code patterns
  - Your current architecture style
  - Your tech debt and constraints
  - Your module dependencies
  - Your test coverage gaps
  - Your performance bottlenecks
        ↓
Bob proposes 2–3 NOVEL architecture options:
  - Tailored to YOUR codebase specifically
  - With tradeoff analysis (not generic pros/cons)
  - With migration path (not big bang rewrites)
  - With production-readiness checklist
        ↓
Developer picks one
        ↓
Elith implements it:
  - Refactors existing code
  - Generates missing tests
  - Updates documentation
  - Produces "what changed and why" summary
```

**Example — Real Output Difference:**

*Standard AI output:*
> "You should use a microservices architecture with REST APIs and a message queue."

*Elith + Bob output:*
> "Your codebase shows 3 tightly coupled modules (auth, billing, notifications) with shared database access. Given your current Django monolith and the fact that billing and notifications have completely different scaling profiles, I recommend a **Modular Monolith with Event-Driven Boundaries** as a Phase 1 step — not full microservices. Here's why, and here's the exact implementation path from your current code..."

---

## Elith Core — The Execution Layer

Elith is the tool that wraps IBM Bob and converts focused context packets into concrete repository outcomes.

**Available Operations:**

| Command | What Bob Does |
|---------|--------------|
| `elith explain` | Bob reads repo, explains architecture in plain language |
| `elith risk-scan` | Bob identifies risky, confusing, or fragile files |
| `elith architect` | Bob proposes novel architectures tailored to your codebase |
| `elith refactor` | Bob safely refactors the target module |
| `elith test-gen` | Bob generates missing tests for changed code |
| `elith document` | Bob writes/updates docs for key modules |
| `elith harden` | Bob adds production-readiness improvements |
| `elith review-summary` | Bob produces reviewer-ready "what changed and why" |

---

## How IBM Bob Fits (Hackathon Compliance)

IBM Bob is not an afterthought in Elith. It is the **core execution engine.**

Bob is used for:
- Reading and understanding the full repository before any action
- Proposing novel architectures based on real codebase analysis
- Implementing refactors safely with full repo context
- Generating tests that match existing patterns
- Writing documentation that matches existing style
- Producing exportable task session reports for judging evidence

Every Elith operation creates an exportable Bob session report — which becomes the submission evidence automatically as you build.

---

## User Flow (Demo Script)

```
1. Developer opens messy, underdocumented repository
   
2. Elith reads linked Obsidian vault
   → loads architecture notes, coding standards, tech debt log
   
3. Developer selects task:
   "Propose a better architecture for the auth module"
   
4. Elith builds focused context packet:
   → auth/ files + auth-related architecture notes + dependency map
   → NOT the entire repo
   
5. Elith sends packet to IBM Bob
   
6. Bob analyzes actual code patterns, proposes 2 novel options:
   Option A: JWT + Redis session hybrid (your current scale demands it)
   Option B: OAuth2 with refresh token rotation (your security notes flag this)
   
7. Developer picks Option A
   
8. Elith executes:
   → Bob refactors auth module
   → Bob generates 14 new tests
   → Bob updates auth documentation
   → Bob produces "what changed and why" summary
   
9. Bob session report exported → committed to repo → submitted as evidence
```

---

## Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Orchestration | Python 3.10+ | Fast build, team expertise |
| API Layer | FastAPI | Clean REST endpoints, async support |
| Context Engine | Python + pathlib | File scanning, vault reading |
| Bob Integration | IBM Bob Shell (CLI) | Direct Bob session spawning |
| Frontend Dashboard | React + TypeScript | Live status, results display |
| UI Styling | Tailwind CSS | Fast, clean, no-config |
| Memory Layer | Obsidian (markdown folder) | Long-term project context |
| State Management | Zustand | Clean React state |

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
│   ├── main.py                    # FastAPI entry point
│   ├── context_engine/
│   │   ├── vault_reader.py        # Reads Obsidian markdown files
│   │   ├── repo_scanner.py        # Scans repository structure
│   │   └── packet_builder.py      # Builds minimal task packets
│   ├── elith_core/
│   │   ├── elith.py             # Elith core
│   │   ├── bob_runner.py          # Spawns Bob shell sessions
│   │   ├── architect.py           # Novel architecture generator
│   │   └── operations/
│   │       ├── explain.py
│   │       ├── risk_scan.py
│   │       ├── refactor.py
│   │       ├── test_gen.py
│   │       ├── document.py
│   │       └── review_summary.py
│   └── models/
│       ├── task_packet.py
│       └── session.py
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── TaskPanel.tsx       # Task selection + input
│   │   │   ├── ContextPreview.tsx  # Shows loaded context
│   │   │   ├── ArchProposals.tsx   # Novel arch proposals display
│   │   │   ├── LiveOutput.tsx      # Bob session live output
│   │   │   └── ResultSummary.tsx   # Final results + export
│   │   └── stores/
│   │       └── elithStore.ts
│   └── package.json
│
├── obsidian-template/
│   ├── architecture/
│   │   └── system-overview.md
│   ├── standards/
│   │   └── coding-standards.md
│   └── tasks/
│       └── task-briefs/
│
└── bob-reports/                   # Auto-generated Bob session exports
    └── .gitkeep
```

---

## Team Roles

| Person | Role | Owns |
|--------|------|------|
| **[You]** | Architect + Team Lead | FastAPI backend, context engine, orchestration wiring, final integration |
| **Basil Joy** | AI/ML Core | Novel architecture generator, Bob session logic, prompt engineering, architect.py |
| **Johann** | UI/UX | React dashboard, component design, demo slides, README polish |

---

## MVP Scope (48 Hours)

**Must ship:**
- Context engine reads repo + markdown vault, builds task packet
- Elith runs at least 3 operations via Bob shell (explain, architect, test-gen)
- Novel architecture proposals working on a real demo repo
- React dashboard shows context loaded, proposals, live Bob output
- Bob session reports auto-exported to `bob-reports/`
- Demo video recorded on a real public GitHub repo

**Phase 2 (post-hackathon):**
- Shannon security testing after every Bob session
- Full Obsidian API integration
- Parallel Bob sessions (Zquare engine)
- VS Code extension

---

## Submission Checklist

- [ ] Public GitHub repo (elith-hackathon)
- [ ] Bob session reports exported and committed
- [ ] Demo video (2–3 mins, terminal + dashboard)
- [ ] Cover image (16:9)
- [ ] Short description (max 255 chars)
- [ ] Long description (min 100 words)
- [ ] Slide deck (5 slides)
- [ ] Live demo URL (deploy on Railway or Render)

---

## One-Line Pitch

> Elith is a Bob-centered developer workflow that loads only task-relevant context from your project memory, then uses IBM Bob to propose novel, production-ready architectures tailored to your actual codebase — and implements them.

---

## Tagline Options

- *Load less context. Deliver more software.*
- *Smarter context. Novel architecture. Faster shipping.*
- *Bob thinks deeper when you load smarter.*

---

*Private working document — Elith Hackathon Team — IBM Bob Hackathon May 2026*
