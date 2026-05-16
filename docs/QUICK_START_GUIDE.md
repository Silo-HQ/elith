# Elith Quick Start Guide - Basil Joy

## 🚀 Getting Started (First 30 Minutes)

### 1. Environment Setup
```bash
# Install dependencies
pip install anthropic google-generativeai openai ollama textual pyfiglet pytest

# Set up API keys in .env
cp .env.example .env
# Edit .env and add your API keys:
# ANTHROPIC_API_KEY=sk-ant-...
# GOOGLE_API_KEY=...
# OPENAI_API_KEY=sk-...
# BOB_ENABLED=true

# Verify Bob is installed
bob --help
```

### 2. Create Your Branch
```bash
git checkout -b basil/ai-core
```

### 3. Start with Base Classes (CRITICAL)
Everything depends on these two files. Implement them first:

**File 1:** `backend/skills/base_skill.py`
**File 2:** `backend/providers/base_provider.py`

See [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md) Phase 1 for full code.

---

## 📋 Implementation Checklist

### Phase 1: Foundation (Hours 2-4) ✓
- [ ] `backend/skills/base_skill.py` - Abstract interface
- [ ] `backend/providers/base_provider.py` - Abstract interface

### Phase 2: Core Skills (Hours 2-8) ✓
- [ ] `backend/skills/read_file.py` - **HIGHEST PRIORITY**
- [ ] `backend/skills/write_file.py`
- [ ] `backend/skills/list_files.py`
- [ ] `backend/skills/search_code.py`
- [ ] Test each skill in isolation

### Phase 3: Bob + Remaining Skills (Hours 5-8) ✓
- [ ] Investigate Bob shell non-interactive mode
- [ ] `backend/providers/bob_provider.py`
- [ ] 8 remaining skills (git_diff, git_commit, run_tests, etc.)
- [ ] `backend/skills/__init__.py` - Skill registry

### Phase 4: Claude Provider (Hours 9-14) ✓ **THE CRITICAL MOMENT**
- [ ] `backend/providers/claude_provider.py`
- [ ] Test Claude calling skills automatically
- [ ] `backend/providers/gemini_provider.py`
- [ ] Test Gemini with same tasks

### Phase 5: Additional Providers (Hours 15-22) ✓
- [ ] `backend/providers/openai_provider.py`
- [ ] `backend/providers/ollama_provider.py`
- [ ] Cross-provider testing

### Phase 6: Operations (Hours 15-22) ✓
- [ ] `backend/operations/architect.py` - **STAR FEATURE**
- [ ] `backend/operations/test_gen.py`
- [ ] Iterate architect prompt on 5 repos

### Phase 7: Integration (Hours 23-28) ✓
- [ ] Update `backend/router/model_router.py`
- [ ] Integration testing
- [ ] Fix tool calling issues
- [ ] Full demo scenario test

### Phase 8: Demo Prep (Hours 29-36) ✓
- [ ] Run architect on demo repo
- [ ] Select best proposal
- [ ] Export Bob session reports
- [ ] Collect 3 best reports

### Phase 9: Polish (Hours 37-44) ✓
- [ ] Code review and cleanup
- [ ] Add docstrings
- [ ] Update requirements.txt
- [ ] Testing documentation
- [ ] Final integration test

---

## 🧪 Testing Commands

### Test Individual Skill
```python
# Test read_file
python -c "
from backend.skills.read_file import ReadFileSkill
skill = ReadFileSkill()
result = skill.execute('.', 'README.md')
print(result)
"
```

### Test Provider
```python
# Test Claude provider
python -c "
from backend.providers.claude_provider import ClaudeProvider
import os

provider = ClaudeProvider('.', os.environ['ANTHROPIC_API_KEY'])
for chunk in provider.run('List files and explain this project', ''):
    print(chunk, end='', flush=True)
"
```

### Test Architect Operation
```python
# Test architect
python -c "
from backend.operations.architect import run_architect
from backend.providers.claude_provider import ClaudeProvider
import os

provider = ClaudeProvider('.', os.environ['ANTHROPIC_API_KEY'])
result = run_architect(provider, '.', 'skills system')
print(result)
"
```

---

## 🎯 Critical Success Criteria

### Technical Success
- [ ] All 12 skills implemented and tested
- [ ] All 5 providers operational
- [ ] Claude calls skills automatically (proof of concept)
- [ ] Output quality matches Bob baseline
- [ ] Architect produces specific, non-generic proposals

### Demo Success
- [ ] Live demo shows Claude calling skills
- [ ] Architect output references specific files
- [ ] Bob session reports prove Bob usage
- [ ] Side-by-side comparison shows equal quality

---

## ⚠️ Critical Unknowns & Risks

### 1. Bob Shell Non-Interactive Mode (Hours 5-8)
**Risk:** Unknown if Bob supports non-interactive mode  
**Action:** Test immediately with these commands:
```bash
bob --help                              # Read all flags
bob --task "explain this file"          # Try --task flag
bob --prompt "explain this file"        # Try --prompt flag
echo "explain this" | bob              # Try pipe input
bob --non-interactive "explain this"   # Try --non-interactive
```

**Fallback:** Demo Claude as primary, show Bob via manual recording

### 2. Provider Tool Calling Loop (Hours 9-14)
**Risk:** Complex loop pattern, easy to get wrong  
**Action:** Follow reference implementation exactly  
**Test:** Verify Claude calls skills automatically

### 3. Architect Prompt Quality (Hours 15-22)
**Risk:** Generic output won't impress judges  
**Action:** Iterate on multiple repos, add constraints  
**Success:** Output references specific files

---

## 🔥 The Demo Moment

When you run this:
```python
provider = ClaudeProvider(".", api_key)
for chunk in provider.run("Understand this repo and propose better architecture", ""):
    print(chunk, end="", flush=True)
```

And you see:
```
[Elith Skill: list_files(.)]
→ backend/, frontend/, docs/, ...

[Elith Skill: read_file(backend/skills/base_skill.py)]
→ class BaseSkill(ABC): ...

[Elith Skill: search_code(BaseSkill)]
→ Found in 12 files...

Based on my analysis of backend/skills/base_skill.py (line 103),
I propose two architecture improvements:

## Option A: Skill Composition Pattern
**Why not standard inheritance:** The current flat skill hierarchy...
```

**That is the moment Elith works. That is what wins the hackathon.**

---

## 📁 File Structure Reference

```
backend/
├── skills/
│   ├── base_skill.py          ← Phase 1 (CRITICAL)
│   ├── read_file.py           ← Phase 2 (HIGHEST PRIORITY)
│   ├── write_file.py          ← Phase 2
│   ├── list_files.py          ← Phase 2
│   ├── search_code.py         ← Phase 2
│   ├── git_diff.py            ← Phase 3
│   ├── git_commit.py          ← Phase 3
│   ├── run_tests.py           ← Phase 3
│   ├── find_references.py     ← Phase 3
│   ├── analyze_dependencies.py ← Phase 3
│   ├── explain_function.py    ← Phase 3
│   ├── install_package.py     ← Phase 3
│   ├── read_logs.py           ← Phase 3
│   └── __init__.py            ← Phase 3 (Registry)
│
├── providers/
│   ├── base_provider.py       ← Phase 1 (CRITICAL)
│   ├── bob_provider.py        ← Phase 3
│   ├── claude_provider.py     ← Phase 4 (PROOF OF CONCEPT)
│   ├── gemini_provider.py     ← Phase 4
│   ├── openai_provider.py     ← Phase 5
│   └── ollama_provider.py     ← Phase 5
│
└── operations/
    ├── architect.py           ← Phase 6 (STAR FEATURE)
    └── test_gen.py            ← Phase 6
```

---

## 🎨 Code Templates

### Skill Template
```python
from .base_skill import BaseSkill
from typing import Dict
import os

class MySkill(BaseSkill):
    @property
    def name(self) -> str:
        return "my_skill"
    
    @property
    def description(self) -> str:
        return "Description of what this skill does"
    
    @property
    def parameters(self) -> Dict:
        return {
            "type": "object",
            "properties": {
                "param1": {"type": "string", "description": "Param description"}
            },
            "required": ["param1"]
        }
    
    def execute(self, repo_path: str, **kwargs) -> str:
        param1 = kwargs.get("param1")
        
        try:
            # Implementation here
            result = "..."
            return result
        except Exception as e:
            return f"Error: {str(e)}"
```

### Provider Template
```python
from .base_provider import BaseProvider
from ..skills import ALL_SKILLS
from typing import Generator

class MyProvider(BaseProvider):
    def __init__(self, repo_path: str, api_key: str):
        super().__init__(repo_path, ALL_SKILLS)
        self.client = initialize_client(api_key)
    
    def run(self, prompt: str, context: str) -> Generator[str, None, None]:
        tools = [s.to_provider_format() for s in self.skills.values()]
        messages = [{"role": "user", "content": f"{context}\n\n{prompt}"}]
        
        while True:
            response = self.client.create(tools=tools, messages=messages)
            
            # Stream text
            for block in response.content:
                if block.type == "text":
                    yield block.text
            
            # Handle tool calls
            if response.stop_reason == "tool_use":
                tool_results = []
                for block in response.content:
                    if block.type == "tool_use":
                        yield f"\n[Elith Skill: {block.name}]\n"
                        result = self.execute_skill(block.name, **block.input)
                        yield f"→ {result[:200]}...\n"
                        tool_results.append(format_result(block.id, result))
                
                messages.append({"role": "assistant", "content": response.content})
                messages.append({"role": "user", "content": tool_results})
            else:
                break
```

---

## 💡 Pro Tips

### 1. Test Skills in Isolation First
Don't wait for providers. Test each skill immediately:
```python
skill = ReadFileSkill()
print(skill.execute(".", "README.md"))
```

### 2. Use Real Repositories for Testing
Test on actual repos, not mock data. This catches real-world issues.

### 3. Watch for Tool Calling Loops
The loop pattern is non-standard. Debug by printing:
- Tool calls before execution
- Tool results before feeding back
- Stop reasons

### 4. Start Simple, Then Iterate
Get basic functionality working first, then optimize.

### 5. Keep Bob Reports
Save all Bob session outputs to `bob-reports/` for submission proof.

---

## 🆘 Troubleshooting

### Issue: Skill not found
**Cause:** Skill not registered in `__init__.py`  
**Fix:** Add to `ALL_SKILLS` list

### Issue: Tool calling loop infinite
**Cause:** Not breaking on `end_turn`  
**Fix:** Check stop_reason condition

### Issue: Skill returns None
**Cause:** Not returning string  
**Fix:** All skills MUST return `str`

### Issue: Provider not streaming
**Cause:** Not using Generator pattern  
**Fix:** Use `yield` not `return`

### Issue: Context overflow
**Cause:** Reading too many/large files  
**Fix:** Use line ranges, summarize content

---

## 📚 Additional Resources

- [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md) - Detailed phase-by-phase plan
- [`ARCHITECTURE_DIAGRAM.md`](ARCHITECTURE_DIAGRAM.md) - Visual architecture diagrams
- [`ELITH_AGENT_SKILLS.md`](MY_TASK/ELITH_AGENT_SKILLS.md) - Full skill specifications
- [`TASKS_BASIL_JOY.md`](MY_TASK/TASKS_BASIL_JOY.md) - Hour-by-hour task breakdown

---

## ⏱️ Time Management

**Total Time:** 44 hours (May 15-17, 2026)

**Critical Path:**
1. Hours 2-4: Base classes (BLOCKING)
2. Hours 5-8: Core skills + Bob provider
3. Hours 9-14: Claude provider (PROOF OF CONCEPT)
4. Hours 15-22: Remaining providers + architect
5. Hours 23-28: Integration
6. Hours 29-36: Demo prep
7. Hours 37-44: Polish

**Buffers:**
- Phase 1-2: 2 hour buffer
- Phase 3: May need buffer for Bob investigation
- Phase 4: Use buffer if needed (critical phase)

---

*Elith Quick Start Guide - Basil Joy - IBM Bob Hackathon 2026*