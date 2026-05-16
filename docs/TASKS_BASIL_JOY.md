# Elith — Basil Joy's Tasks (AI/ML Core)
**IBM Bob Hackathon | May 15–17, 2026**  
**Your Role:** Heavy Weapons — You own everything AI. Skills, providers, prompts.  
**Your Deliverable:** Every model operating at Bob-level. Novel arch proposals that impress a senior dev.

---

## Your Stack
- Python 3.10+
- anthropic SDK (Claude)
- google-generativeai SDK (Gemini)
- openai SDK (GPT/Codex)
- requests / ollama SDK (Local LLM)
- subprocess (Bob shell)
- pytest (for testing your skills)

---

## Install Your Dependencies First
```bash
pip install anthropic google-generativeai openai ollama textual pyfiglet
```

---

## Your File Ownership

```
backend/
├── skills/              ← YOU OWN THIS ENTIRE FOLDER
│   ├── base_skill.py
│   ├── read_file.py
│   ├── write_file.py
│   ├── list_files.py
│   ├── search_code.py
│   ├── git_diff.py
│   ├── git_commit.py
│   ├── run_tests.py
│   ├── find_references.py
│   ├── analyze_dependencies.py
│   ├── explain_function.py
│   ├── install_package.py
│   ├── read_logs.py
│   └── __init__.py
│
├── providers/           ← YOU OWN THIS ENTIRE FOLDER
│   ├── base_provider.py
│   ├── bob_provider.py
│   ├── claude_provider.py
│   ├── gemini_provider.py
│   ├── openai_provider.py
│   └── ollama_provider.py
│
└── operations/          ← YOU OWN architect.py AND test_gen.py
    ├── architect.py
    └── test_gen.py
```

All code for these files is in `ELITH_AGENT_SKILLS.md`. Copy it, adapt it, improve it.

---

## Hour-by-Hour Tasks

---

### Hour 1 — Team Sync
```
✓ Read ELITH_AGENT_SKILLS.md fully
✓ Confirm Bob shell is installed and runs:
    bob --help   ← should show Bob Shell interface
✓ Clone repo from team lead
✓ Create your branch: git checkout -b basil/ai-core
✓ Go heads down
```

---

### Hours 2–4 — Skill Layer Foundation

**This is your most important block. Everything depends on it.**

```
✓ Create backend/skills/base_skill.py
    └── Full code in ELITH_AGENT_SKILLS.md
    └── Abstract interface: name, description, parameters, execute()
    └── to_anthropic_tool(), to_openai_tool() methods

✓ Create backend/skills/read_file.py
    └── Most critical skill — test this first
    └── execute(repo_path, path) → returns file content as string

✓ Create backend/skills/write_file.py
    └── execute(repo_path, path, content) → writes file, returns confirmation

✓ Create backend/skills/list_files.py
    └── execute(repo_path, path, recursive) → returns directory listing

✓ Create backend/skills/search_code.py
    └── uses grep under the hood
    └── execute(repo_path, query, file_pattern) → returns matches

✓ Test each skill manually:
    from backend.skills.read_file import ReadFileSkill
    skill = ReadFileSkill()
    result = skill.execute("/path/to/any/repo", "README.md")
    print(result)  # Should print real file content

Target: 4 skills working and tested locally
```

---

### Hours 5–8 — Bob Provider + Remaining Skills

```
✓ Create backend/providers/base_provider.py
    └── Abstract interface: run(prompt, context) → Generator[str]
    └── execute_skill(skill_name, **kwargs) method

✓ Create backend/providers/bob_provider.py
    └── Bob runs natively — no skills injected
    └── spawn Bob shell subprocess
    └── stream stdout line by line
    └── CRITICAL: figure out Bob shell non-interactive flags
        Try: bob --task "explain this file" 
        Try: echo "explain this" | bob
        Try: bob --prompt "explain this"
        Check bob --help for non-interactive mode

✓ Complete remaining 8 skills:
    └── git_diff.py
    └── git_commit.py
    └── run_tests.py
    └── find_references.py
    └── analyze_dependencies.py
    └── explain_function.py
    └── install_package.py
    └── read_logs.py

✓ Create backend/skills/__init__.py
    └── exports ALL_SKILLS list + SKILL_MAP dict

Target: Bob shell running + all 12 skills complete and tested
```

---

### Hours 9–14 — Claude Provider (The Proof of Concept)

**This is the moment Elith works. Watch Claude call your skills automatically.**

```
✓ Create backend/providers/claude_provider.py
    └── Full code in ELITH_AGENT_SKILLS.md
    └── inject all 12 skills as Anthropic tools
    └── handle tool_use stop reason
    └── call execute_skill() when Claude requests a tool
    └── feed result back to Claude
    └── yield output chunks as they stream

✓ Test Claude provider on a real repo:
    from backend.providers.claude_provider import ClaudeProvider
    provider = ClaudeProvider("/path/to/repo", api_key="...")
    for chunk in provider.run("Read the README and explain this project", ""):
        print(chunk, end="", flush=True)

    Expected behavior:
    Claude will automatically call list_files(".")
    Then read_file("README.md")
    Then explain what it found
    That's Bob-level behavior from Claude.

✓ Create backend/providers/gemini_provider.py
    └── Google AI function_calling format
    └── same pattern as Claude but different API

✓ Test Gemini on same task
    → should produce same quality output as Claude

Target: Claude + Gemini both reading real files via skills
        and producing Bob-quality output
```

---

### Hours 15–22 — Remaining Providers + Novel Architecture

```
✓ Create backend/providers/openai_provider.py
    └── OpenAI tools format (same as Ollama)
    └── supports GPT-4 and Codex

✓ Create backend/providers/ollama_provider.py
    └── Ollama runs locally — no API key needed
    └── use model: llama3.1 or mistral-nemo (both support tool calling)
    └── same OpenAI-compatible format

✓ Test all 5 providers run the same "explain" task:
    Bob     → native
    Claude  → via skills
    Gemini  → via skills
    OpenAI  → via skills
    Ollama  → via skills (offline)
    All should produce comparable output quality.

✓ Create backend/operations/architect.py
    └── THIS IS YOUR STAR FEATURE

    The master prompt must make the model:
    1. Read key files (via skills or natively)
    2. Analyze: code patterns, dependencies, constraints, tech debt
    3. NOT give the textbook answer
    4. Propose 2 options tailored to what it actually found
    5. Each option: specific name, why-not-standard explanation,
       tradeoffs table, migration path

    Master prompt template:
    """
    You are a senior software architect with 15 years experience.
    You have just read this codebase carefully.

    Your task: propose novel, production-ready architecture improvements
    for {target_module}.

    Rules:
    - Do NOT suggest generic patterns (no "use microservices", no "add a cache")
    - Every proposal must reference SPECIFIC files, line numbers, or patterns
      you found in this codebase
    - Every proposal must explain why the standard textbook answer is WRONG
      for this specific codebase
    - Include concrete migration steps, not abstract advice
    - Format as Option A and Option B with tradeoffs table

    The codebase has these specific characteristics:
    {context_packet}
    """

✓ Iterate this prompt on 5 different repos
    └── if output is generic → add more constraints
    └── if output references specific files → 

✓ Create backend/operations/test_gen.py
    └── finds source files without test pairs
    └── generates tests matching existing test patterns/style

Target: architect.py producing genuinely impressive,
        specific, non-generic proposals on any repo
```

---

### Hours 23–28 — Integration Support
```
✓ Help team lead wire your providers into model_router.py
✓ Fix any tool calling issues found during integration testing
✓ Ensure all providers stream output correctly (Generator pattern)
✓ Test the full demo scenario:
    - same task on Bob
    - same task on Claude with skills
    - compare output quality — should be equal
```

---

### Hours 29–36 — Demo Preparation
```
✓ Run architect operation on the chosen demo repo
✓ Pick the single most impressive proposal output
✓ Make sure it references specific files + line numbers
✓ This output goes in the demo video — it must be jaw-dropping
✓ Export Bob session report
✓ Collect 3 best Bob reports for submission
```

---

### Hours 37–44 — Polish
```
✓ Code review your providers — remove debug prints
✓ Add docstrings to all provider run() methods
✓ Ensure all skills handle errors gracefully (no crashes)
✓ requirements.txt includes all your dependencies
```

---

## Testing Checklist

Run these before declaring anything done:

```bash
# Test individual skill
python -c "
from backend.skills.read_file import ReadFileSkill
s = ReadFileSkill()
print(s.execute('.', 'README.md'))
"

# Test Claude provider
python -c "
from backend.providers.claude_provider import ClaudeProvider
import os
p = ClaudeProvider('.', os.environ['ANTHROPIC_API_KEY'])
for chunk in p.run('List the main files and explain this project', ''):
    print(chunk, end='', flush=True)
"

# Test architect operation
python -c "
from backend.operations.architect import run_architect
from backend.providers.claude_provider import ClaudeProvider
import os
provider = ClaudeProvider('.', os.environ['ANTHROPIC_API_KEY'])
result = run_architect(provider, '.', 'auth module')
print(result)
"
```

---

## Critical Path Warning

**Bob shell non-interactive mode (Hours 2–4)**

This is your biggest unknown. Spend time on it immediately.

Try these in order:
```bash
bob --help                              # read all flags
bob --task "explain this file"          # try --task flag
bob --prompt "explain this file"        # try --prompt flag
echo "explain this" | bob              # try pipe input
bob --non-interactive "explain this"   # try --non-interactive
```

If Bob cannot run non-interactively at all — message the team lead immediately. The fallback plan is to demo Claude with skills as the primary, and show Bob via manual session recording.

---

## The Demo Moment

When you run this:
```python
provider = ClaudeProvider("/path/to/repo", api_key="...")
for chunk in provider.run("Understand this repo and propose a better architecture for the auth module", ""):
    print(chunk, end="", flush=True)
```

And you see Claude automatically calling:
```
[Elith Skill: list_files(.)]
[Elith Skill: read_file(auth/views.py)]
[Elith Skill: read_file(auth/models.py)]
[Elith Skill: search_code(session)]
```

**That is the moment Elith works. That is what wins the hackathon.**

---

*Basil Joy's Task Doc — Elith — IBM Bob Hackathon 2026*
