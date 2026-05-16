# Project Advanced Coding Rules (Non-Obvious Only)

## BaseSkill Implementation Contract

- ALL skills MUST inherit from `BaseSkill` (`backend/skills/base_skill.py`)
- `execute()` MUST return `str` - never raise exceptions to provider
- Error handling: return `"Error: description"` string, don't throw
- `parameters` property MUST be valid JSON Schema (type: "object", properties, required)
- Auto-create directories in write operations: `os.makedirs(os.path.dirname(path), exist_ok=True)`

## BaseProvider Implementation Contract

- ALL providers MUST inherit from `BaseProvider` (`backend/providers/base_provider.py`)
- `run()` MUST be a Generator that yields `str` chunks
- `run()` handles tool calling loop internally - providers don't return until complete
- Tool calling loop pattern (see [`claude_provider.py`](../../ELITH_AGENT_SKILLS.md:880-911)):
  1. Send message with tools
  2. Yield text blocks as they arrive
  3. If `stop_reason == "tool_use"`: execute skills, append results, continue loop
  4. If `stop_reason == "end_turn"`: break and return

## Provider-Specific Tool Formats

Each provider requires DIFFERENT tool format - use BaseSkill conversion methods:

- **Anthropic**: `skill.to_anthropic_tool()` → `{name, description, input_schema}`
- **OpenAI/Ollama**: `skill.to_openai_tool()` → `{type:"function", function:{...}}`
- **Gemini**: `skill.to_gemini_function()` → `FunctionDeclaration(...)`

## Bob Provider Exception

- Bob provider does NOT receive skills (empty list in `__init__`)
- Bob runs as subprocess: `["bob", "--task", full_prompt]`
- Just stream stdout line-by-line - no tool calling loop needed
- Must handle `FileNotFoundError` if Bob not in PATH

## Skill Registry Pattern

- All skills registered in `backend/skills/__init__.py` as `ALL_SKILLS` list
- Providers receive skills via `super().__init__(repo_path, ALL_SKILLS)`
- Skills stored as dict: `{skill.name: skill}` for lookup during tool calls

## Testing Requirements

- Test skills directly before integrating with providers
- Test pattern: `skill.execute(repo_path, **kwargs)` should return real data
- Provider test: watch for automatic tool calls in streaming output
- Critical test: Claude calling `read_file()` proves the system works

## Access to MCP and Browser Tools

Advanced mode has access to MCP servers and browser automation tools for enhanced capabilities.