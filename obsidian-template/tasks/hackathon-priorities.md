# Hackathon Priorities

#tasks #hackathon #priorities

## Critical Path Items

### 1. Skill Layer Quality ⚡
The 12 repository skills are the core innovation. They must:
- Execute reliably without errors
- Return clean, parseable output
- Handle edge cases gracefully
- Work identically across all providers

**Status**: ✅ Complete - All 12 skills implemented and tested

### 2. Tool Calling Loop 🔄
Claude/Gemini/GPT must automatically call skills when needed:
- Detect when tool use is required
- Execute skill with correct parameters
- Feed result back to model
- Continue conversation naturally

**Status**: ✅ Complete - Tested with LMStudio provider

### 3. Context Optimization 📊
Smart file selection is a key differentiator:
- Load only 4-6 files instead of entire repo
- Select based on operation type
- Include relevant Obsidian notes
- Show token savings in UI

**Status**: ✅ Complete - 6 of 142 files selected (96% reduction)

### 4. Novel Architecture Proposals 🏗️
The architect operation must produce repo-specific proposals:
- Reference actual files and line numbers
- Explain why standard solutions don't fit
- Provide concrete migration steps
- Show tradeoffs clearly

**Status**: ⏳ Ready - Needs testing with loaded model

## Demo Requirements

### Must Show
1. Bob running natively on a task
2. Same task on Claude/LMStudio with skills
3. Context reduction visible (6 vs 312 files)
4. Skills being called automatically
5. Novel architecture proposal output

### Nice to Have
- Multiple models running in parallel
- Obsidian notes influencing decisions
- Real-time streaming in both TUI and web
- Session reports auto-generated

## Judging Criteria Focus

1. **Innovation**: Skill layer that works with any model
2. **Technical Merit**: Clean architecture, working code
3. **Bob Integration**: Proves Bob's value, extends it to others
4. **Practical Value**: Solves real developer pain points
5. **Presentation**: Clear demo, good documentation