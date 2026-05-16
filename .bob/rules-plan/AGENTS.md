# Plan Mode Rules (Non-Obvious Only)

## Pre-Implementation Status
This repository contains only specifications. When code exists, update this file with:

## Architecture Planning Constraints
- Must distinguish between "Bob native capabilities" vs "skill layer replication"
- Context engine is NOT a vector database - it's deterministic file selection
- Novel architecture proposals must be codebase-specific, never generic
- All operations must be scoped, explainable, reviewable - no autonomous large-scale changes

## Critical Path Dependencies
1. Skill layer tool calling (Hours 2-8) - core innovation, if broken everything fails
2. Novel architecture quality (Hours 15-22) - killer feature, requires 6-8 hours prompt iteration
3. End-to-end integration (Hours 9-14) - no demo without full loop working

See [`docs/ELITH_EXECUTION_STRATEGY.md`](../../docs/ELITH_EXECUTION_STRATEGY.md:276-289) for details.

## Non-Standard Architecture Patterns
- **Skill layer is the innovation**: Not a wrapper, but the core that makes Elith work
- **Bob runs natively**: No skills needed - it already has repo access
- **Context selection is pre-execution**: Not dynamic during model run
- **Obsidian is structured memory**: Engineering decisions database, not vector storage
- **Token savings is first-class**: Must be visible in UI, not hidden metric

## Hidden Coupling Points
- Context engine depends on vault structure (must handle missing vault gracefully)
- Providers depend on skill registry initialization order
- Operations must be provider-agnostic (can't assume Bob-specific features)
- TUI and web dashboard share same backend API (must design for both)
- Bob session reports required for judging (auto-export to `/bob_sessions`)

## Performance Bottlenecks (Planned)
- File scanning on large repos (>1000 files) - needs optimization
- Vault note parsing if notes are large - consider caching
- Parallel provider execution may hit rate limits - needs coordination
- SSE streaming to frontend may buffer - needs proper chunking

## Demo-Driven Design Decisions
- 3-minute demo constraint shapes everything
- Must show: Bob native → Claude with skills → same quality
- Context reduction must be VISIBLE (6 files vs 312 total)
- Novel architecture proposals must be impressive, not generic
- All design decisions optimize for demo clarity over scalability

## Hackathon Submission Requirements
- Bob session reports in `/bob_sessions` directory (mandatory for judging)
- Demo video must be 2-3 minutes (not longer)
- Must prove Bob usage through exported reports
- GitHub repo must be public before submission
- Cover image and slides required for submission

## When Code Exists
Replace this template with actual non-obvious architectural patterns discovered during implementation.