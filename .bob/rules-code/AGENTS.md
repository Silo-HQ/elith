# Code Mode Rules (Non-Obvious Only)

## Pre-Implementation Status
This repository contains only specifications. When code exists, update this file with:

## Skill Layer Implementation (Critical)
- Each provider (Claude/Gemini/GPT/Ollama) has different tool calling syntax
- Claude uses `tool_use`, Gemini uses `function_calling`, OpenAI uses `tool_calling`
- All 12 skills must be registered in skill registry before provider initialization
- Skills MUST return consistent JSON structure across all providers
- Bob provider bypasses skill layer entirely - direct shell execution

## Context Engine Constraints
- File selection algorithm in `context_engine/packet_builder.py` must be deterministic
- Maximum 6 files per task packet - hard limit, not suggestion
- Vault reader must handle missing Obsidian directory gracefully
- Token counting happens BEFORE model execution, not after

## Provider Integration Gotchas
- Bob shell commands must be non-interactive (no prompts)
- Ollama requires local model download before first use
- API key validation must happen at provider initialization, not execution
- Each provider needs separate error handling for rate limits

## Testing Requirements
- Test files must be co-located with source (not separate test directory)
- Mock all external API calls in provider tests
- Skill tests must verify actual file system operations
- Integration tests require real repo (use test fixtures)

## File Organization Rules
- One skill per file in `backend/skills/`
- One provider per file in `backend/providers/`
- Operations in `backend/operations/` must be provider-agnostic
- No circular imports between context_engine and providers

## When Code Exists
Replace this template with actual non-obvious patterns discovered during implementation.