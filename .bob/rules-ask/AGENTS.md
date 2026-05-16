# Project Documentation Rules (Non-Obvious Only)

## Architecture Documentation Location

- Primary spec: [`ELITH_AGENT_SKILLS.md`](../../ELITH_AGENT_SKILLS.md) - complete skill/provider architecture
- Execution strategy: [`ELITH_EXECUTION_STRATEGY.md`](../../ELITH_EXECUTION_STRATEGY.md) - 48-hour hackathon plan
- Main guidance: [`AGENTS.md`](../../AGENTS.md) - project architecture overview

## Non-Obvious Project Structure

- `backend/` contains Python FastAPI backend (planned, mostly empty)
- `frontend/` and `tui/` are separate UI implementations (React + Textual)
- `obsidian-template/` is NOT documentation - it's example vault structure for users
- `bob-reports/` stores session logs to prove Bob usage for hackathon submission

## Skill Layer Concept (Critical)

Elith is NOT a typical AI wrapper - it's a **skill injection layer**:
- Bob has native repo awareness (reads files, runs tests, commits code)
- Other LLMs (Claude, Gemini, GPT) are repo-blind
- Elith gives them 12 skills as tool-callable functions
- Result: Any model operates at Bob-level capability

## Provider Architecture (Non-Standard)

- Each provider has DIFFERENT tool calling API (Anthropic ≠ OpenAI ≠ Gemini)
- BaseSkill has conversion methods: `to_anthropic_tool()`, `to_openai_tool()`, `to_gemini_function()`
- Providers must loop until `stop_reason != "tool_use"` (not single request/response)
- Bob provider is special case: subprocess wrapper, no skills needed

## Context Engine Design

- NOT implemented yet (empty files in `backend/context_engine/`)
- Planned behavior: scan repo + read Obsidian vault → pick 4-6 most relevant files
- Builds "task packet" = context string passed to all providers
- Goal: avoid overwhelming models with entire codebase

## Implementation Status

Most files are empty - this is early-stage hackathon project. Refer to specification documents for intended architecture rather than existing code.