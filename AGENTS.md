# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Status

**PRE-IMPLEMENTATION**: This is a specification-only repository for the IBM Bob Hackathon (May 15-17, 2026). No code exists yet. These guidelines are based on architectural specifications in [`docs/`](docs/).

## Critical Architecture Constraints

- **IBM Bob is the gold standard**: All other model integrations must match Bob's native repo-awareness capabilities
- **Context is expensive**: Only load 4-6 relevant files per task, never the full repo (see [`agent.md`](agent.md:270-285))
- **Obsidian is structured memory, not vector storage**: Treat vault as engineering decisions database, not generic context dump
- **No autonomous large-scale changes**: All operations must be scoped, explainable, and reviewable (see [`agent.md`](agent.md:127-133))

## Tech Stack (Planned)

| Layer | Technology | Notes |
|-------|-----------|-------|
| Backend | Python 3.10+ + FastAPI | Orchestration and API layer |
| TUI | Textual (Python) | First-class terminal interface, not a fallback |
| Frontend | React + TypeScript + Tailwind | Demo-facing web dashboard |
| Memory | Obsidian (markdown) | Long-term engineering memory |
| Models | IBM Bob (native) + Claude/Gemini/GPT/Ollama (via skill layer) | Bob runs natively, others use tool calling |

## Non-Obvious Design Decisions

### Skill Layer Architecture
- **Bob runs natively** without skills - it already has repo access
- **All other models** get repo awareness through 12 agent skills ([`docs/ELITH_AGENT_SKILLS.md`](docs/ELITH_AGENT_SKILLS.md))
- Each provider (Claude/Gemini/GPT/Ollama) implements tool calling differently - see provider-specific implementations
- Skills are NOT optional wrappers - they're the core innovation that makes Elith work

### Context Engine Rules
- Context selection happens BEFORE model execution, not during
- Packet builder combines: repo scan + vault notes + task type → minimal file set
- Token savings is a first-class metric - must be visible in UI ([`docs/ELITH_PROJECT_SPEC.md`](docs/ELITH_PROJECT_SPEC.md:34))
- "Only the current task should decide what gets loaded" ([`agent.md`](agent.md:60))

### Novel Architecture Generation
- Standard AI answers are explicitly rejected - proposals must be codebase-specific
- Proposals must reference actual files/patterns from the target repo
- Each proposal requires: why-not-standard + tradeoffs + migration-path ([`docs/ELITH_PROJECT_SPEC.md`](docs/ELITH_PROJECT_SPEC.md:156-174))
- 6-8 hours of prompt iteration budgeted for this feature ([`docs/ELITH_EXECUTION_STRATEGY.md`](docs/ELITH_EXECUTION_STRATEGY.md:284))

### Bob Session Requirements
- Bob reports MUST be auto-exported to `/bob_sessions` directory
- Required for hackathon judging - never skip this ([`agent.md`](agent.md:449-460))
- Reports prove Bob usage and are submission evidence

## Project Structure (Planned)

```
elith/
├── backend/
│   ├── main.py                    # FastAPI entry
│   ├── context_engine/            # Smart file selection
│   ├── skills/                    # 12 repo-aware skills (THE CORE)
│   ├── providers/                 # One per model (bob/claude/gemini/openai/ollama)
│   └── operations/                # explain/architect/refactor/test-gen/etc
├── tui/                           # Textual terminal UI
├── frontend/                      # React dashboard
└── obsidian-template/             # Vault structure template
```

## Development Priorities

1. **Skill layer tool calling** (Hours 2-8) - If this breaks, core innovation is gone
2. **Novel architecture quality** (Hours 15-22) - Generic proposals kill the killer feature  
3. **End-to-end integration** (Hours 9-14) - No demo without full loop working

See [`docs/ELITH_EXECUTION_STRATEGY.md`](docs/ELITH_EXECUTION_STRATEGY.md:276-289) for critical path details.

## Coding Standards (From Specs)

- **Modular over monolithic**: Service separation, clean APIs, composable systems
- **Production-oriented**: No hackathon shortcuts that break in real use
- **Typed interfaces**: Python type hints, TypeScript strict mode
- **No giant files**: Split responsibilities, avoid tight coupling
- **Explainable**: Every architectural decision must have clear reasoning

See [`agent.md`](agent.md:310-333) for full standards.

## UI/UX Constraints

### TUI (Textual)
- Keyboard-driven, no mouse required
- Color scheme: black bg (#0A0A0A), purple accent (#A855F7), model-specific colors
- Must work in standard 80x24 terminal
- See [`docs/ELITH_TUI_SPEC.md`](docs/ELITH_TUI_SPEC.md) for full spec

### Web Dashboard  
- Pure black (#000000) background, purple (#A855F7) accents only
- JetBrains Mono for code, Inter for UI text
- No shadows, only borders - feels like engineering console
- Mobile not required - optimize for 1280px+ desktop
- See [`docs/ELITH_UX_SPEC.md`](docs/ELITH_UX_SPEC.md) for full spec

## Security Rules

- Never commit secrets, API keys, or credentials
- Validate `.gitignore` before any commit
- Use environment variables for all sensitive config
- If credentials detected: STOP immediately ([`agent.md`](agent.md:400-421))

## Demo Requirements

The 3-minute demo must show:
1. Bob running natively on a task
2. Same task on Claude with Elith skills - same quality output
3. Context reduction visible (6 files loaded vs 312 total)
4. Novel architecture proposals that are repo-specific, not generic

See [`docs/ELITH_EXECUTION_STRATEGY.md`](docs/ELITH_EXECUTION_STRATEGY.md:305-332) for demo script.

## When Implementation Begins

**UPDATE THIS FILE** with:
- Actual build/test/lint commands from `pyproject.toml` and `package.json`
- Non-obvious patterns discovered in code (not specs)
- Custom utilities and their required usage
- Hidden dependencies or coupling between components
- Any deviations from these specifications

This file should get MORE specific and SHORTER as obvious information is removed and replaced with implementation discoveries.