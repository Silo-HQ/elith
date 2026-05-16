# Elith Planning Summary - Basil Joy

**Date:** May 16, 2026  
**Role:** AI/ML Core Developer  
**Hackathon:** IBM Bob Hackathon (May 15-17, 2026)

---

## 📋 Planning Complete

I've analyzed the task requirements in [`docs/MY_TASK/`](MY_TASK/) and created a comprehensive implementation plan for building Elith's AI/ML core system.

---

## 📚 Documentation Created

### 1. [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) (1,087 lines)
**Comprehensive phase-by-phase implementation guide**

**Contents:**
- Executive Summary & Architecture Overview
- 9 detailed implementation phases (44 hours total)
- Critical dependencies & constraints
- Provider tool calling differences
- Non-standard loop pattern explanation
- Testing strategies for each phase
- Risk mitigation & critical path analysis
- Success metrics & demo preparation

**Key Sections:**
- Phase 1: Foundation - Base Classes (Hours 2-4)
- Phase 2: Core Skills Implementation (Hours 2-8)
- Phase 3: Bob Provider + Remaining Skills (Hours 5-8)
- Phase 4: Claude Provider - Proof of Concept (Hours 9-14)
- Phase 5: Additional Providers (Hours 15-22)
- Phase 6: Novel Architecture Operations (Hours 15-22)
- Phase 7: Integration & Testing (Hours 23-28)
- Phase 8: Demo Preparation (Hours 29-36)
- Phase 9: Polish & Documentation (Hours 37-44)

### 2. [ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md) (398 lines)
**Visual system architecture with Mermaid diagrams**

**Diagrams Included:**
- High-level system overview
- Tool calling flow sequence
- Provider comparison
- Skill execution pattern
- Data flow for architect operation
- Skill categories mindmap
- Provider tool format differences
- Critical path dependencies (Gantt chart)
- The critical moment sequence

**Key Principles:**
- Abstraction through base classes
- Tool calling normalization
- Streaming output pattern
- Error handling contract
- Repository-centric design
- Provider loop pattern

### 3. [QUICK_START_GUIDE.md](QUICK_START_GUIDE.md) (438 lines)
**Practical quick reference for implementation**

**Contents:**
- 30-minute getting started guide
- Implementation checklist (all 44 tasks)
- Testing commands for skills, providers, operations
- Critical success criteria
- Critical unknowns & risks with mitigation
- The demo moment walkthrough
- File structure reference
- Code templates (skill & provider)
- Pro tips & troubleshooting
- Time management breakdown

---

## 🎯 Core Innovation

**Elith = Universal skill layer that gives any LLM the same repo-aware capabilities IBM Bob has natively**

### The Problem
- IBM Bob: Native repository awareness (read files, search code, run tests)
- Claude/Gemini/GPT/Ollama: Powerful reasoners but repo-blind

### The Solution
- 12 repository skills exposed as tools via provider-specific APIs
- Each provider calls skills automatically
- Skills execute and return real data
- Result: Every model operates at Bob-level

---

## 🏗️ System Architecture

```
User → Router → Provider (Bob/Claude/Gemini/OpenAI/Ollama)
                    ↓
              Skill Registry (12 skills)
                    ↓
              Repository Operations
```

### Base Abstractions
1. **BaseSkill** - Interface for all 12 skills
2. **BaseProvider** - Interface for all 5 providers

### 12 Repository Skills
1. `read_file` - Read file contents
2. `write_file` - Write to files
3. `list_files` - List directory contents
4. `search_code` - Grep-based code search
5. `git_diff` - Show git differences
6. `git_commit` - Commit changes
7. `run_tests` - Execute test suites
8. `find_references` - Find code references
9. `analyze_dependencies` - Parse dependencies
10. `explain_function` - Extract & explain functions
11. `install_package` - Install packages
12. `read_logs` - Read log files

### 5 Providers
1. **Bob** - Native (subprocess, no skills)
2. **Claude** - Anthropic API with tool calling
3. **Gemini** - Google AI with function calling
4. **OpenAI** - GPT-4/Codex with tools
5. **Ollama** - Local LLM with tools

---

## 🔑 Critical Technical Details

### Provider Tool Calling Loop (Non-Standard)
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

### Tool Format Normalization
Each provider has different tool calling API:
- **Anthropic**: `{name, description, input_schema}`
- **OpenAI**: `{type:"function", function:{...}}`
- **Gemini**: `FunctionDeclaration(...)`

BaseSkill provides conversion methods:
- `to_anthropic_tool()`
- `to_openai_tool()`
- `to_gemini_function()`

### Error Handling Contract
- Skills MUST return `str` (even for errors)
- Format: `"Error: description"`
- Skills handle their own errors
- Providers don't catch skill exceptions

---

## ⚠️ Critical Risks & Mitigation

### 1. Bob Shell Non-Interactive Mode (Unknown)
**Risk:** Don't know if Bob supports non-interactive mode  
**Timeline:** Hours 5-8  
**Mitigation:** Test immediately with multiple flag combinations  
**Fallback:** Demo Claude as primary, show Bob via recording

### 2. Provider Tool Calling Loop (Complex)
**Risk:** Non-standard pattern, easy to get wrong  
**Timeline:** Hours 9-14  
**Mitigation:** Follow reference implementation exactly  
**Test:** Verify Claude calls skills automatically

### 3. Architect Prompt Quality (Demo Impact)
**Risk:** Generic output won't impress judges  
**Timeline:** Hours 15-22  
**Mitigation:** Iterate on 5 repos, add constraints  
**Success:** Output references specific files with line numbers

---

## 🎬 The Demo Moment

**When this works:**
```python
provider = ClaudeProvider(".", api_key)
for chunk in provider.run("Understand this repo and propose better architecture", ""):
    print(chunk, end="", flush=True)
```

**You'll see:**
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

## 📊 Implementation Phases

### Phase 1: Foundation (Hours 2-4) - CRITICAL
- `base_skill.py` - Everything depends on this
- `base_provider.py` - Everything depends on this

### Phase 2: Core Skills (Hours 2-8)
- `read_file.py` - HIGHEST PRIORITY
- `write_file.py`
- `list_files.py`
- `search_code.py`

### Phase 3: Bob + Skills (Hours 5-8)
- Investigate Bob shell flags
- `bob_provider.py`
- 8 remaining skills
- Skill registry

### Phase 4: Claude Provider (Hours 9-14) - PROOF OF CONCEPT
- `claude_provider.py` with tool calling loop
- Test Claude calling skills automatically
- `gemini_provider.py`

### Phase 5: Additional Providers (Hours 15-22)
- `openai_provider.py`
- `ollama_provider.py`
- Cross-provider testing

### Phase 6: Operations (Hours 15-22) - STAR FEATURE
- `architect.py` - Novel architecture proposals
- `test_gen.py` - Auto test generation
- Iterate architect prompt

### Phase 7: Integration (Hours 23-28)
- Wire providers into router
- Integration testing
- Fix tool calling issues
- Full demo scenario

### Phase 8: Demo Prep (Hours 29-36)
- Run architect on demo repo
- Select best proposal
- Export Bob session reports
- Collect 3 best reports

### Phase 9: Polish (Hours 37-44)
- Code review & cleanup
- Add docstrings
- Update requirements.txt
- Testing documentation
- Final integration test

---

## ✅ Success Criteria

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

### Hackathon Success
- [ ] Novel architecture impresses judges
- [ ] Technical execution is flawless
- [ ] Demo is jaw-dropping
- [ ] Bob usage is documented
- [ ] Code is production-ready

---

## 📁 File Ownership

**You own these directories:**
```
backend/
├── skills/              ← 12 skills + base class + registry
├── providers/           ← 5 providers + base class
└── operations/          ← architect.py + test_gen.py
```

**Total files to create:** 22 files
- 1 base skill class
- 12 skill implementations
- 1 skill registry
- 1 base provider class
- 5 provider implementations
- 2 operation files

---

## ⏱️ Time Allocation

**Total:** 44 hours (May 15-17, 2026)

**Critical Path:**
- Hours 2-4: Base classes (BLOCKING)
- Hours 5-14: Skills + Bob + Claude (CORE)
- Hours 15-22: Remaining providers + architect (FEATURES)
- Hours 23-28: Integration (STABILITY)
- Hours 29-36: Demo prep (PRESENTATION)
- Hours 37-44: Polish (QUALITY)

**Buffers:**
- 2 hours in Phase 1-2
- Flexible time in Phase 3 (Bob investigation)
- Use buffers for Phase 4 if needed (critical)

---

## 🚀 Next Steps

### Immediate Actions (When Implementation Starts)
1. Set up environment & install dependencies
2. Create branch: `git checkout -b basil/ai-core`
3. Implement `base_skill.py` (CRITICAL)
4. Implement `base_provider.py` (CRITICAL)
5. Implement `read_file.py` (HIGHEST PRIORITY)
6. Test read_file in isolation
7. Continue with remaining core skills

### First Milestone (Hour 8)
- Base classes complete
- 4 core skills working
- Bob provider operational
- All skills tested in isolation

### Second Milestone (Hour 14)
- Claude provider working
- Claude calling skills automatically
- Gemini provider working
- **PROOF OF CONCEPT ACHIEVED**

### Third Milestone (Hour 22)
- All 5 providers operational
- Architect operation producing specific proposals
- Cross-provider testing complete

### Final Milestone (Hour 44)
- Full system integrated
- Demo materials prepared
- Code polished and documented
- Ready for submission

---

## 📖 Documentation Reference

All planning documents are in [`docs/`](../):

1. **[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)** - Detailed phase-by-phase guide
2. **[ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)** - Visual system architecture
3. **[QUICK_START_GUIDE.md](QUICK_START_GUIDE.md)** - Quick reference & templates
4. **[PLANNING_SUMMARY.md](PLANNING_SUMMARY.md)** - This document

Original task documents in [`docs/MY_TASK/`](MY_TASK/):
- **[TASKS_BASIL_JOY.md](MY_TASK/TASKS_BASIL_JOY.md)** - Hour-by-hour task breakdown
- **[ELITH_AGENT_SKILLS.md](MY_TASK/ELITH_AGENT_SKILLS.md)** - Full skill specifications

---

## 💡 Key Insights from Planning

### 1. Dependency Chain is Critical
Everything depends on base classes. Must implement them first and get them right.

### 2. Test Skills in Isolation
Don't wait for providers. Test each skill immediately with real repositories.

### 3. The Loop Pattern is Non-Standard
Provider tool calling requires a loop. This is not obvious from typical LLM API usage.

### 4. Bob is Special
Bob doesn't receive skills - it has native capabilities. Runs as subprocess.

### 5. Architect is the Star Feature
Must produce specific, file-referencing proposals. Generic output won't impress.

### 6. Demo Moment is Everything
When Claude starts calling skills automatically, that's the proof Elith works.

---

## 🎯 Planning Status: COMPLETE ✅

**Planning Phase Complete. Ready for Implementation.**

All documentation created:
- ✅ Comprehensive implementation plan (9 phases, 44 hours)
- ✅ Visual architecture diagrams (Mermaid)
- ✅ Quick start guide with templates
- ✅ Planning summary (this document)
- ✅ Todo list with 44 actionable tasks

**Next Action:** Switch to Code mode to begin implementation when ready.

---

*Elith Planning Summary - Basil Joy - IBM Bob Hackathon 2026*