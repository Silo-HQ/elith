# Project Architecture Rules (Non-Obvious Only)

## Critical Architectural Constraints

### BaseSkill/BaseProvider Dependency Chain

- `base_skill.py` and `base_provider.py` MUST be implemented first
- ALL 12 skills depend on BaseSkill interface
- ALL 5 providers depend on BaseProvider interface
- No skill or provider can be tested until base classes exist

### Provider Tool Calling Loop (Non-Standard Pattern)

Providers CANNOT use simple request/response - must implement loop:

```python
while True:
    response = client.messages.create(tools=tools, messages=messages)
    yield text_blocks
    if stop_reason == "tool_use":
        execute_skills()
        append_results_to_messages()
        continue  # Loop back
    else:
        break  # Done
```

This is NOT obvious from typical LLM API usage patterns.

### Bob Provider Special Architecture

- Bob does NOT receive skills (breaks the pattern)
- Bob runs as subprocess: `["bob", "--task", prompt]`
- Just streams stdout - no tool calling loop
- This asymmetry is intentional: Bob has native capabilities

### Context Engine Design (Planned)

- Must pick 4-6 files per task (not all files)
- Combines repo scan + Obsidian vault markdown
- Builds "task packet" string passed to ALL providers
- Critical: prevents context overflow on large repos

### Skill Execution Contract

- Skills MUST return `str` (even for errors)
- Skills handle their own errors - providers don't catch exceptions
- Error format: `"Error: description"` string
- Skills auto-create directories: `os.makedirs(exist_ok=True)`

### Implementation Priority (From Spec)

1. Base classes (`base_skill.py`, `base_provider.py`)
2. `read_file.py` skill - most critical, test immediately
3. `bob_provider.py` - native baseline
4. `claude_provider.py` - proof of concept (when Claude calls read_file, Elith works)
5. Remaining 11 skills
6. Other providers (Gemini, OpenAI, Ollama)

### Testing Strategy

Test skills in isolation BEFORE provider integration:
```python
skill = ReadFileSkill()
result = skill.execute("/path/to/repo", "src/auth/views.py")
# Should return real file content, not mock data
```

### Hackathon Constraints

- 48-hour timeline (May 15-17, 2026)
- Demo-first approach: working > perfect
- Must prove Bob usage via session logs in `bob-reports/`
- Three parallel tracks: backend (You), skills/providers (Basil Joy), UI (Johann)