# Ask Mode Rules (Non-Obvious Only)

## Pre-Implementation Status
This repository contains only specifications. When code exists, update this file with:

## Documentation Context Constraints
- Obsidian vault structure is non-standard - not typical wiki organization
- Vault contains: architecture notes, decisions, tech debt, coding standards, task briefs
- Vault is NOT a vector database - it's structured engineering memory
- Notes are linked via markdown links, not tags or folders

## Architecture Explanation Rules
- Must reference actual spec files when explaining planned architecture
- Distinguish between "planned" (from specs) and "implemented" (from code)
- Context engine explanation requires understanding token economics
- Skill layer explanation must cover provider-specific tool calling differences

## Non-Obvious Terminology
- "Packet" = minimal context bundle (files + vault notes + task type)
- "Skill" = repo-aware tool (not AI capability)
- "Provider" = model wrapper (Bob/Claude/Gemini/etc)
- "Operation" = high-level task type (explain/architect/refactor/etc)
- "Novel architecture" = codebase-specific proposal (not textbook answer)

## Spec Document Organization
- [`agent.md`](../../agent.md) = system identity and philosophy
- [`docs/ELITH_PROJECT_SPEC.md`](../../docs/ELITH_PROJECT_SPEC.md) = technical architecture
- [`docs/ELITH_EXECUTION_STRATEGY.md`](../../docs/ELITH_EXECUTION_STRATEGY.md) = 48-hour build plan
- [`docs/ELITH_AGENT_SKILLS.md`](../../docs/ELITH_AGENT_SKILLS.md) = skill layer implementation
- [`docs/ELITH_TUI_SPEC.md`](../../docs/ELITH_TUI_SPEC.md) = terminal UI specification
- [`docs/ELITH_UX_SPEC.md`](../../docs/ELITH_UX_SPEC.md) = web dashboard specification

## Counterintuitive Design Decisions
- TUI is first-class interface, not fallback (see [`docs/ELITH_TUI_SPEC.md`](../../docs/ELITH_TUI_SPEC.md:8-12))
- Bob runs WITHOUT skills - it already has repo access natively
- Context selection happens BEFORE model execution, not during
- Token savings is a first-class metric, not optimization afterthought
- Obsidian is engineering memory, not generic context storage

## Hackathon-Specific Context
- Project deadline: May 15-17, 2026 (48 hours)
- Bob session reports required for judging - must auto-export
- Demo must show: Bob native → Claude with skills → same quality
- 3-minute demo constraint shapes all design decisions

## When Code Exists
Replace this template with actual non-obvious documentation patterns discovered during implementation.