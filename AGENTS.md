# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Architecture (Non-Obvious)

**Elith** = Universal skill layer that gives any LLM (Claude, Gemini, GPT, Ollama) the same repo-aware capabilities IBM Bob has natively.

### Critical Abstractions

1. **BaseSkill** (`backend/skills/base_skill.py`) - ALL skills must implement:
   - `name`, `description`, `parameters` (JSON Schema)
   - `execute(repo_path, **kwargs) -> str`
   - `to_anthropic_tool()`, `to_openai_tool()`, `to_gemini_function()` - provider-specific tool formats

2. **BaseProvider** (`backend/providers/base_provider.py`) - ALL providers must implement:
   - `__init__(repo_path, skills: List[BaseSkill])`
   - `run(prompt, context) -> Generator[str, None, None]` - streams output, handles tool calls internally
   - `execute_skill(skill_name, **kwargs)` - inherited, calls skills by name

### Tool Calling Differences (Critical)

Each provider has DIFFERENT tool calling APIs - Elith normalizes via BaseSkill methods:

- **Anthropic**: `tools=[{name, description, input_schema}]` passed to `messages.create()`
- **OpenAI/Ollama**: `tools=[{type:"function", function:{name, description, parameters}}]`
- **Gemini**: `genai.protos.Tool(function_declarations=[FunctionDeclaration(...)])`
- **Bob**: NO tools needed - runs as subprocess, has native repo awareness

### Provider Loop Pattern (Non-Standard)

Providers must loop until `stop_reason != "tool_use"`:
1. Send message with tools
2. Stream text blocks
3. If tool_use: execute skill, append result to messages, continue loop
4. If end_turn: break

See [`claude_provider.py`](ELITH_AGENT_SKILLS.md:858-912) lines 880-911 for reference implementation.

### Skill Execution Contract

- Skills receive `repo_path` + their specific kwargs
- Skills MUST return `str` (even for errors: `"Error: file not found"`)
- Skills handle their own error cases - providers don't catch exceptions
- Skills auto-create directories for write operations (`os.makedirs(exist_ok=True)`)

### Context Engine (Planned)

- Scans repo + reads Obsidian vault markdown
- Picks 4-6 most relevant files per task (not all files)
- Builds "task packet" = context string passed to all providers
- Located in `backend/context_engine/` (currently empty)

### Bob Provider Special Case

- Bob runs via subprocess: `["bob", "--task", full_prompt]`
- NO skills injected (Bob has native capabilities)
- Just streams stdout line-by-line
- Must handle `FileNotFoundError` if Bob not in PATH

### Session Logging

- All provider outputs logged to `bob-reports/` folder
- Used to prove Bob usage for hackathon submission
- Format/implementation not yet defined

## Implementation Priority (From Spec)

1. `base_skill.py` + `base_provider.py` - everything depends on these
2. `read_file.py` skill - most critical, test immediately
3. `bob_provider.py` - native baseline
4. `claude_provider.py` - proof of concept (when Claude calls read_file via tool, Elith works)
5. Remaining 11 skills
6. Other providers (Gemini, OpenAI, Ollama)

## Testing Pattern

```python
# Test skill directly
skill = ReadFileSkill()
result = skill.execute("/path/to/repo", "src/auth/views.py")
print(result)  # Should show real file content

# Test provider with tool calling
provider = ClaudeProvider("/path/to/repo", api_key="...")
for chunk in provider.run("Read auth module and explain it", ""):
    print(chunk, end="", flush=True)
# Watch Claude call read_file() automatically
```

## File Organization

- `backend/skills/` - 12 skill implementations (read_file, write_file, list_files, search_code, git_diff, git_commit, run_tests, find_references, analyze_dependencies, explain_function, install_package, read_logs)
- `backend/providers/` - 5 provider implementations (bob, claude, gemini, openai, ollama)
- `backend/router/model_router.py` - routes requests to configured providers
- `backend/context_engine/` - repo scanner, vault reader, packet builder
- `obsidian-template/` - example vault structure for project documentation
- `bob-reports/` - session logs proving Bob usage

## Environment Variables

See [`.env.example`](.env.example) - each provider needs API key or enable flag. Bob requires `BOB_ENABLED=true` and Bob CLI in PATH.