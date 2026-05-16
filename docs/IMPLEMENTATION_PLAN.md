# Elith Implementation Plan - Basil Joy (AI/ML Core)
**IBM Bob Hackathon | May 15-17, 2026**

## Executive Summary

**Goal:** Build a universal skill layer that gives any LLM (Claude, Gemini, GPT, Ollama) the same repository-aware capabilities that IBM Bob has natively.

**Core Innovation:** Tool calling abstraction layer that normalizes different provider APIs and exposes 12 repository skills to all models.

**Success Metric:** Claude (or any provider) automatically calling `read_file()`, `search_code()`, etc. on its own - just like Bob does natively.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Elith System Architecture                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Claude     │  │    Gemini    │  │   OpenAI     │      │
│  │   Provider   │  │   Provider   │  │   Provider   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                   ┌────────▼────────┐                        │
│                   │  BaseProvider   │                        │
│                   │   Interface     │                        │
│                   └────────┬────────┘                        │
│                            │                                 │
│         ┌──────────────────┴──────────────────┐             │
│         │                                      │             │
│    ┌────▼─────┐                         ┌─────▼────┐        │
│    │  Skill   │                         │   Bob    │        │
│    │ Registry │                         │ Provider │        │
│    └────┬─────┘                         └──────────┘        │
│         │                                                    │
│    ┌────▼──────────────────────────────────────┐            │
│    │         12 Repository Skills               │            │
│    │  read_file, write_file, list_files,       │            │
│    │  search_code, git_diff, git_commit,       │            │
│    │  run_tests, find_references,              │            │
│    │  analyze_dependencies, explain_function,  │            │
│    │  install_package, read_logs               │            │
│    └───────────────────────────────────────────┘            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Critical Dependencies & Constraints

### Dependency Chain
1. **BaseSkill** and **BaseProvider** MUST be implemented first
2. All 12 skills depend on BaseSkill interface
3. All 5 providers depend on BaseProvider interface
4. No skill or provider can be tested until base classes exist

### Provider Tool Calling Differences
Each provider has DIFFERENT tool calling APIs:
- **Anthropic**: `tools=[{name, description, input_schema}]`
- **OpenAI/Ollama**: `tools=[{type:"function", function:{...}}]`
- **Gemini**: `genai.protos.Tool(function_declarations=[...])`
- **Bob**: NO tools needed - runs as subprocess

### Non-Standard Pattern: Provider Loop
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

---

## Phase 1: Foundation - Base Classes (Hours 2-4)

### Objective
Create the abstract interfaces that all skills and providers will implement.

### Tasks

#### 1.1 Implement BaseSkill (`backend/skills/base_skill.py`)
**Priority:** CRITICAL - Everything depends on this

**Requirements:**
- Abstract base class with ABC
- Properties: `name`, `description`, `parameters` (JSON Schema)
- Method: `execute(repo_path: str, **kwargs) -> str`
- Conversion methods:
  - `to_anthropic_tool() -> Dict`
  - `to_openai_tool() -> Dict`
  - `to_gemini_function() -> FunctionDeclaration`

**Implementation Notes:**
- Use `@property` and `@abstractmethod` decorators
- Parameters must be valid JSON Schema (type: object, properties, required)
- All skills MUST return `str` (even for errors: `"Error: description"`)

**Testing:**
```python
# Cannot test directly (abstract class)
# Will test via concrete skill implementations
```

#### 1.2 Implement BaseProvider (`backend/providers/base_provider.py`)
**Priority:** CRITICAL - All providers depend on this

**Requirements:**
- Abstract base class with ABC
- Constructor: `__init__(repo_path: str, skills: List[BaseSkill])`
- Abstract method: `run(prompt: str, context: str) -> Generator[str, None, None]`
- Concrete method: `execute_skill(skill_name: str, **kwargs) -> str`

**Implementation Notes:**
- Store skills in dict: `{skill.name: skill}`
- `execute_skill()` handles skill lookup and execution
- `run()` must be implemented by each provider
- Must yield output chunks (streaming pattern)

**Testing:**
```python
# Cannot test directly (abstract class)
# Will test via concrete provider implementations
```

**Deliverable:** Two base classes that define the contract for all skills and providers.

---

## Phase 2: Core Skills Implementation (Hours 2-8)

### Objective
Implement the 4 most critical skills that prove the concept works.

### Tasks

#### 2.1 Implement ReadFileSkill (`backend/skills/read_file.py`)
**Priority:** HIGHEST - Most used skill, test immediately

**Skill Specification:**
- **Name:** `read_file`
- **Description:** "Read the contents of a file in the repository"
- **Parameters:**
  ```json
  {
    "type": "object",
    "properties": {
      "path": {"type": "string", "description": "Relative path to file"}
    },
    "required": ["path"]
  }
  ```

**Implementation:**
```python
def execute(self, repo_path: str, **kwargs) -> str:
    path = kwargs.get("path")
    full_path = os.path.join(repo_path, path)
    
    if not os.path.exists(full_path):
        return f"Error: File not found: {path}"
    
    try:
        with open(full_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        return f"Error reading file: {str(e)}"
```

**Testing:**
```python
skill = ReadFileSkill()
result = skill.execute(".", "README.md")
print(result)  # Should show actual README content
```

#### 2.2 Implement WriteFileSkill (`backend/skills/write_file.py`)
**Priority:** HIGH

**Skill Specification:**
- **Name:** `write_file`
- **Description:** "Write content to a file in the repository"
- **Parameters:**
  ```json
  {
    "type": "object",
    "properties": {
      "path": {"type": "string"},
      "content": {"type": "string"}
    },
    "required": ["path", "content"]
  }
  ```

**Implementation Notes:**
- Auto-create directories: `os.makedirs(os.path.dirname(full_path), exist_ok=True)`
- Return confirmation message with file path
- Handle encoding errors gracefully

#### 2.3 Implement ListFilesSkill (`backend/skills/list_files.py`)
**Priority:** HIGH

**Skill Specification:**
- **Name:** `list_files`
- **Description:** "List files and directories in a path"
- **Parameters:**
  ```json
  {
    "type": "object",
    "properties": {
      "path": {"type": "string", "description": "Directory path"},
      "recursive": {"type": "boolean", "description": "List recursively"}
    },
    "required": ["path"]
  }
  ```

**Implementation Notes:**
- Use `os.walk()` for recursive listing
- Use `os.listdir()` for non-recursive
- Format output as tree structure or simple list

#### 2.4 Implement SearchCodeSkill (`backend/skills/search_code.py`)
**Priority:** HIGH

**Skill Specification:**
- **Name:** `search_code`
- **Description:** "Search for code patterns using grep"
- **Parameters:**
  ```json
  {
    "type": "object",
    "properties": {
      "query": {"type": "string"},
      "file_pattern": {"type": "string", "description": "e.g., '*.py'"}
    },
    "required": ["query"]
  }
  ```

**Implementation:**
- Use `subprocess.run(['grep', '-r', '-n', query, ...])` on Unix
- Use `subprocess.run(['findstr', '/s', '/n', query, ...])` on Windows
- Parse output and format as: `filename:line_number: matched_line`

**Testing Strategy:**
Test each skill in isolation before moving to providers:
```python
# Test read_file
skill = ReadFileSkill()
result = skill.execute(".", "backend/skills/base_skill.py")
assert "class BaseSkill" in result

# Test write_file
skill = WriteFileSkill()
result = skill.execute(".", "test_output.txt", content="Hello World")
assert "successfully" in result.lower()

# Test list_files
skill = ListFilesSkill()
result = skill.execute(".", "backend/skills", recursive=False)
assert "base_skill.py" in result

# Test search_code
skill = SearchCodeSkill()
result = skill.execute(".", "BaseSkill", file_pattern="*.py")
assert "base_skill.py" in result
```

**Deliverable:** 4 working skills that can read, write, list, and search files.

---

## Phase 3: Bob Provider + Remaining Skills (Hours 5-8)

### Objective
Get Bob shell running and complete all 12 skills.

### Tasks

#### 3.1 Implement BobProvider (`backend/providers/bob_provider.py`)
**Priority:** HIGH - Native baseline for comparison

**Special Case:** Bob does NOT receive skills (breaks the pattern)

**Implementation:**
```python
class BobProvider(BaseProvider):
    def __init__(self, repo_path: str):
        # Bob has native capabilities - no skills needed
        super().__init__(repo_path, [])
    
    def run(self, prompt: str, context: str) -> Generator[str, None, None]:
        full_prompt = f"{context}\n\n{prompt}" if context else prompt
        
        try:
            # Critical: Find correct Bob shell invocation
            process = subprocess.Popen(
                ["bob", "--task", full_prompt],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                cwd=self.repo_path
            )
            
            for line in process.stdout:
                yield line
                
        except FileNotFoundError:
            yield "Error: Bob shell not found in PATH"
```

**Critical Unknown:** Bob shell non-interactive mode flags

**Investigation Required:**
```bash
bob --help                              # Read all flags
bob --task "explain this file"          # Try --task flag
bob --prompt "explain this file"        # Try --prompt flag
echo "explain this" | bob              # Try pipe input
bob --non-interactive "explain this"   # Try --non-interactive
```

**Fallback Plan:** If Bob cannot run non-interactively, demo Claude with skills as primary and show Bob via manual session recording.

#### 3.2 Complete Remaining 8 Skills

**3.2.1 GitDiffSkill** (`backend/skills/git_diff.py`)
- Run: `git diff` or `git diff <file>`
- Return diff output as string

**3.2.2 GitCommitSkill** (`backend/skills/git_commit.py`)
- Run: `git add .` then `git commit -m "<message>"`
- Return commit hash and message

**3.2.3 RunTestsSkill** (`backend/skills/run_tests.py`)
- Detect test framework (pytest, unittest, jest, etc.)
- Run appropriate test command
- Return test results summary

**3.2.4 FindReferencesSkill** (`backend/skills/find_references.py`)
- Search for function/class usage across codebase
- Use grep or language-specific tools
- Return list of files and line numbers

**3.2.5 AnalyzeDependenciesSkill** (`backend/skills/analyze_dependencies.py`)
- Read package files (requirements.txt, package.json, etc.)
- Parse and return dependency list
- Optionally check for outdated packages

**3.2.6 ExplainFunctionSkill** (`backend/skills/explain_function.py`)
- Read file and extract function definition
- Return function signature, docstring, and body
- Use AST parsing for Python, regex for others

**3.2.7 InstallPackageSkill** (`backend/skills/install_package.py`)
- Detect package manager (pip, npm, etc.)
- Run install command
- Return installation result

**3.2.8 ReadLogsSkill** (`backend/skills/read_logs.py`)
- Read common log locations
- Support filtering by date/level
- Return formatted log entries

#### 3.3 Create Skill Registry (`backend/skills/__init__.py`)

**Implementation:**
```python
from .read_file import ReadFileSkill
from .write_file import WriteFileSkill
from .list_files import ListFilesSkill
from .search_code import SearchCodeSkill
from .git_diff import GitDiffSkill
from .git_commit import GitCommitSkill
from .run_tests import RunTestsSkill
from .find_references import FindReferencesSkill
from .analyze_dependencies import AnalyzeDependenciesSkill
from .explain_function import ExplainFunctionSkill
from .install_package import InstallPackageSkill
from .read_logs import ReadLogsSkill

ALL_SKILLS = [
    ReadFileSkill(),
    WriteFileSkill(),
    ListFilesSkill(),
    SearchCodeSkill(),
    GitDiffSkill(),
    GitCommitSkill(),
    RunTestsSkill(),
    FindReferencesSkill(),
    AnalyzeDependenciesSkill(),
    ExplainFunctionSkill(),
    InstallPackageSkill(),
    ReadLogsSkill(),
]

SKILL_MAP = {s.name: s for s in ALL_SKILLS}
```

**Deliverable:** Bob provider running + all 12 skills complete and tested.

---

## Phase 4: Claude Provider - Proof of Concept (Hours 9-14)

### Objective
**THE CRITICAL MOMENT:** Watch Claude call your skills automatically.

### Tasks

#### 4.1 Implement ClaudeProvider (`backend/providers/claude_provider.py`)

**Requirements:**
- Inject all 12 skills as Anthropic tools
- Handle `tool_use` stop reason
- Call `execute_skill()` when Claude requests a tool
- Feed result back to Claude
- Yield output chunks as they stream

**Implementation Pattern:**
```python
class ClaudeProvider(BaseProvider):
    def __init__(self, repo_path: str, api_key: str, model: str = "claude-sonnet-4-20250514"):
        super().__init__(repo_path, ALL_SKILLS)
        self.client = anthropic.Anthropic(api_key=api_key)
        self.model = model
    
    def run(self, prompt: str, context: str) -> Generator[str, None, None]:
        tools = [s.to_anthropic_tool() for s in self.skills.values()]
        messages = [{"role": "user", "content": f"{context}\n\n{prompt}"}]
        
        while True:  # CRITICAL: Loop until no more tool calls
            response = self.client.messages.create(
                model=self.model,
                max_tokens=8096,
                tools=tools,
                messages=messages
            )
            
            # Stream text blocks
            for block in response.content:
                if block.type == "text":
                    yield block.text
            
            # Handle tool calls
            if response.stop_reason == "tool_use":
                tool_results = []
                for block in response.content:
                    if block.type == "tool_use":
                        yield f"\n[Elith Skill: {block.name}({block.input})]\n"
                        result = self.execute_skill(block.name, **block.input)
                        yield f"→ {result[:200]}...\n"
                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": result
                        })
                
                # Continue conversation with tool results
                messages.append({"role": "assistant", "content": response.content})
                messages.append({"role": "user", "content": tool_results})
            else:
                break  # Done
```

#### 4.2 Test Claude Provider

**Test Script:**
```python
from backend.providers.claude_provider import ClaudeProvider
import os

provider = ClaudeProvider(".", os.environ['ANTHROPIC_API_KEY'])

print("Testing Claude with Elith skills...")
print("=" * 60)

for chunk in provider.run("Read the README and explain this project", ""):
    print(chunk, end="", flush=True)

print("\n" + "=" * 60)
```

**Expected Behavior:**
1. Claude will automatically call `list_files(".")`
2. Then call `read_file("README.md")`
3. Then explain what it found
4. **This is Bob-level behavior from Claude**

**Success Criteria:**
- Claude calls skills without being explicitly told to
- Skills execute and return real data
- Claude incorporates skill results into its response
- Output quality matches Bob's native capabilities

#### 4.3 Implement GeminiProvider (`backend/providers/gemini_provider.py`)

**Key Differences from Claude:**
- Use `google.generativeai` SDK
- Different tool format: `genai.protos.Tool(function_declarations=[...])`
- Different response structure
- Same loop pattern as Claude

**Implementation Notes:**
- Convert skills using `to_gemini_function()`
- Handle Gemini's function calling response format
- Extract function call arguments correctly
- Feed results back in Gemini's expected format

#### 4.4 Test Gemini Provider

**Test on same task as Claude:**
```python
from backend.providers.gemini_provider import GeminiProvider
import os

provider = GeminiProvider(".", os.environ['GOOGLE_API_KEY'])

for chunk in provider.run("Read the README and explain this project", ""):
    print(chunk, end="", flush=True)
```

**Expected:** Same quality output as Claude, proving the abstraction works.

**Deliverable:** Claude + Gemini both reading real files via skills and producing Bob-quality output.

---

## Phase 5: Additional Providers (Hours 15-22)

### Objective
Complete the provider ecosystem with OpenAI and Ollama support.

### Tasks

#### 5.1 Implement OpenAIProvider (`backend/providers/openai_provider.py`)

**Requirements:**
- Support GPT-4 and Codex models
- Use OpenAI tools format (same as Ollama)
- Handle function calling responses
- Stream output chunks

**Implementation Notes:**
- Convert skills using `to_openai_tool()`
- Use `client.chat.completions.create(tools=...)`
- Handle `finish_reason == "tool_calls"`
- Extract function call from `message.tool_calls`

#### 5.2 Implement OllamaProvider (`backend/providers/ollama_provider.py`)

**Requirements:**
- Run locally - no API key needed
- Use models that support tool calling (llama3.1, mistral-nemo)
- Same OpenAI-compatible format
- Handle local model limitations

**Implementation Notes:**
- Use `ollama` Python SDK or HTTP API
- Same tool format as OpenAI
- May need to handle slower response times
- Graceful degradation if model doesn't support tools

#### 5.3 Cross-Provider Testing

**Test Matrix:**
Run the same task on all 5 providers:

| Provider | Native/Skills | Expected Quality |
|----------|---------------|------------------|
| Bob | Native | Baseline |
| Claude | Via Skills | Equal to Bob |
| Gemini | Via Skills | Equal to Bob |
| OpenAI | Via Skills | Equal to Bob |
| Ollama | Via Skills | Close to Bob |

**Test Script:**
```python
providers = [
    ("Bob", BobProvider(".")),
    ("Claude", ClaudeProvider(".", claude_key)),
    ("Gemini", GeminiProvider(".", gemini_key)),
    ("OpenAI", OpenAIProvider(".", openai_key)),
    ("Ollama", OllamaProvider(".", model="llama3.1")),
]

task = "Analyze the backend/skills directory and explain the skill system"

for name, provider in providers:
    print(f"\n{'='*60}\n{name} Provider\n{'='*60}")
    for chunk in provider.run(task, ""):
        print(chunk, end="", flush=True)
```

**Deliverable:** All 5 providers operational and producing comparable output quality.

---

## Phase 6: Novel Architecture Operations (Hours 15-22)

### Objective
Create the "star feature" - architect operation that produces genuinely impressive, specific, non-generic proposals.

### Tasks

#### 6.1 Design Architect Prompt Template

**Core Requirements:**
1. Read key files (via skills or natively)
2. Analyze: code patterns, dependencies, constraints, tech debt
3. NOT give textbook answers
4. Propose 2 options tailored to actual findings
5. Each option: specific name, why-not-standard explanation, tradeoffs table, migration path

**Master Prompt Template:**
```python
ARCHITECT_PROMPT = """
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

Current module analysis:
{module_analysis}

Propose two architecture improvements that are:
1. Specific to THIS codebase (reference actual files/patterns)
2. Non-obvious (explain why standard approach won't work here)
3. Production-ready (include migration path)
4. Measurable (define success metrics)

Format:
## Option A: [Specific Name]
**Why not standard approach:** [Explain with file references]
**Implementation:** [Concrete steps with file paths]
**Tradeoffs:** [Table format]
**Migration Path:** [Step-by-step]
**Success Metrics:** [Measurable outcomes]

## Option B: [Specific Name]
[Same structure]
"""
```

#### 6.2 Implement Architect Operation (`backend/operations/architect.py`)

**Implementation:**
```python
def run_architect(provider: BaseProvider, repo_path: str, target_module: str) -> str:
    """
    Run architecture analysis on a specific module.
    
    Args:
        provider: Any provider (Bob, Claude, etc.)
        repo_path: Path to repository
        target_module: Module to analyze (e.g., "auth module", "api layer")
    
    Returns:
        Architecture proposal with specific recommendations
    """
    
    # Step 1: Gather context
    context_packet = build_context_packet(repo_path, target_module)
    
    # Step 2: Analyze module
    module_analysis = analyze_module(provider, repo_path, target_module)
    
    # Step 3: Generate proposals
    prompt = ARCHITECT_PROMPT.format(
        target_module=target_module,
        context_packet=context_packet,
        module_analysis=module_analysis
    )
    
    result = ""
    for chunk in provider.run(prompt, ""):
        result += chunk
    
    return result
```

#### 6.3 Iterate and Refine

**Testing Strategy:**
1. Run on 5 different repos with different characteristics
2. Evaluate output quality:
   - Does it reference specific files?
   - Does it explain why standard approach is wrong?
   - Are migration steps concrete?
3. If output is generic → add more constraints to prompt
4. If output is specific → success!

**Quality Checklist:**
- [ ] References actual file paths and line numbers
- [ ] Explains why textbook solution won't work
- [ ] Provides concrete migration steps
- [ ] Includes tradeoffs table
- [ ] Defines measurable success metrics
- [ ] Proposes 2 distinct options

#### 6.4 Implement Test Generation (`backend/operations/test_gen.py`)

**Requirements:**
- Find source files without test pairs
- Generate tests matching existing test patterns/style
- Support multiple test frameworks (pytest, unittest, jest)

**Implementation:**
```python
def generate_tests(provider: BaseProvider, repo_path: str, source_file: str) -> str:
    """
    Generate tests for a source file that lacks test coverage.
    
    Analyzes existing test patterns and generates matching tests.
    """
    
    # Detect test framework
    framework = detect_test_framework(repo_path)
    
    # Find existing test examples
    test_examples = find_test_examples(repo_path, framework)
    
    # Read source file
    source_content = read_file(repo_path, source_file)
    
    # Generate tests
    prompt = f"""
    Generate {framework} tests for this file: {source_file}
    
    Match the style and patterns from these existing tests:
    {test_examples}
    
    Source code to test:
    {source_content}
    
    Generate comprehensive tests covering:
    - Happy path scenarios
    - Edge cases
    - Error handling
    - Integration points
    """
    
    result = ""
    for chunk in provider.run(prompt, ""):
        result += chunk
    
    return result
```

**Deliverable:** `architect.py` producing genuinely impressive, specific, non-generic proposals on any repo.

---

## Phase 7: Integration & Testing (Hours 23-28)

### Objective
Wire everything together and ensure the full system works end-to-end.

### Tasks

#### 7.1 Update Model Router (`backend/router/model_router.py`)

**Requirements:**
- Route requests to configured providers
- Support provider selection by name
- Handle provider initialization with API keys
- Stream output from selected provider

**Implementation:**
```python
class ModelRouter:
    def __init__(self, repo_path: str, config: Dict):
        self.repo_path = repo_path
        self.providers = {}
        
        # Initialize enabled providers
        if config.get('BOB_ENABLED'):
            self.providers['bob'] = BobProvider(repo_path)
        
        if config.get('ANTHROPIC_API_KEY'):
            self.providers['claude'] = ClaudeProvider(
                repo_path, 
                config['ANTHROPIC_API_KEY']
            )
        
        # ... initialize other providers
    
    def run(self, provider_name: str, prompt: str, context: str = ""):
        if provider_name not in self.providers:
            raise ValueError(f"Provider {provider_name} not available")
        
        provider = self.providers[provider_name]
        yield from provider.run(prompt, context)
```

#### 7.2 Integration Testing

**Test Scenarios:**

**Scenario 1: Basic File Operations**
```python
# Test: Read, analyze, and modify a file
task = "Read backend/skills/base_skill.py, explain it, and add a docstring"

for provider_name in ['claude', 'gemini', 'openai']:
    print(f"\nTesting {provider_name}...")
    router = ModelRouter(".", config)
    for chunk in router.run(provider_name, task):
        print(chunk, end="", flush=True)
```

**Scenario 2: Code Search and Analysis**
```python
# Test: Search for patterns and analyze usage
task = "Find all classes that inherit from BaseSkill and analyze their patterns"

for chunk in router.run('claude', task):
    print(chunk, end="", flush=True)
```

**Scenario 3: Git Operations**
```python
# Test: Git diff and commit
task = "Show me what changed in the last commit and explain the changes"

for chunk in router.run('claude', task):
    print(chunk, end="", flush=True)
```

#### 7.3 Fix Tool Calling Issues

**Common Issues to Watch For:**
- Tool parameters not matching schema
- Provider not looping on tool_use
- Skill execution errors not handled
- Output not streaming correctly
- Context overflow on large files

**Debugging Strategy:**
1. Add logging to skill execution
2. Print tool calls before execution
3. Validate tool parameters against schema
4. Test each provider independently
5. Compare output with Bob baseline

#### 7.4 Demo Scenario Testing

**Full Demo Flow:**
```python
# The moment that wins the hackathon
provider = ClaudeProvider(".", api_key)

task = """
Understand this repository and propose a better architecture 
for the skills system. Be specific and reference actual files.
"""

print("Elith Demo - Claude with Repository Skills")
print("=" * 60)

for chunk in provider.run(task, ""):
    print(chunk, end="", flush=True)

# Expected: Claude will automatically:
# 1. list_files("backend/skills")
# 2. read_file("backend/skills/base_skill.py")
# 3. read_file("backend/skills/read_file.py")
# 4. search_code("BaseSkill")
# 5. Propose specific improvements with file references
```

**Success Criteria:**
- Claude calls skills without being told
- Skills execute and return real data
- Claude incorporates results into analysis
- Output quality equals Bob's native capabilities
- Proposals reference specific files and line numbers

**Deliverable:** Fully integrated system with all providers working and streaming correctly.

---

## Phase 8: Demo Preparation (Hours 29-36)

### Objective
Prepare the jaw-dropping demo that proves Elith works.

### Tasks

#### 8.1 Run Architect on Demo Repo

**Select Demo Repository:**
- Choose a real-world repo with interesting architecture
- Should have clear improvement opportunities
- Must have enough complexity to showcase skills

**Run Architect Operation:**
```python
from backend.operations.architect import run_architect
from backend.providers.claude_provider import ClaudeProvider

provider = ClaudeProvider(".", api_key)
result = run_architect(provider, ".", "authentication system")

# Save output
with open("demo_architect_output.md", "w") as f:
    f.write(result)
```

#### 8.2 Select Best Proposal

**Evaluation Criteria:**
- References specific files with line numbers
- Explains why standard approach won't work
- Provides concrete migration steps
- Includes measurable success metrics
- Proposes genuinely novel solution

**Polish for Demo:**
- Format output nicely
- Highlight file references
- Emphasize non-obvious insights
- Show tradeoffs table clearly

#### 8.3 Export Bob Session Reports

**Requirements:**
- All provider outputs logged to `bob-reports/` folder
- Used to prove Bob usage for hackathon submission
- Must show Bob was actually used during development

**Implementation:**
```python
# Add to each provider's run() method
session_id = datetime.now().strftime("%Y%m%d_%H%M%S")
log_file = f"bob-reports/{provider_name}_{session_id}.log"

with open(log_file, "w") as f:
    for chunk in provider.run(prompt, context):
        f.write(chunk)
        yield chunk
```

#### 8.4 Collect Best Bob Reports

**Select 3 Best Reports:**
1. Most impressive architect proposal
2. Complex multi-skill task execution
3. Bob vs Claude comparison showing equal quality

**Format for Submission:**
- Clear task description
- Full output with skill calls visible
- Highlight key insights
- Show file references

**Deliverable:** Polished demo materials with jaw-dropping architect output and Bob session reports.

---

## Phase 9: Polish & Documentation (Hours 37-44)

### Objective
Clean up code, add documentation, ensure production readiness.

### Tasks

#### 9.1 Code Review and Cleanup

**Checklist:**
- [ ] Remove all debug print statements
- [ ] Remove commented-out code
- [ ] Consistent error handling across all skills
- [ ] Consistent return format (always string)
- [ ] No hardcoded paths or credentials
- [ ] Proper exception handling (no bare excepts)

#### 9.2 Add Docstrings

**Requirements:**
- All provider `run()` methods need docstrings
- All skill `execute()` methods need docstrings
- Module-level docstrings for each file

**Template:**
```python
def run(self, prompt: str, context: str) -> Generator[str, None, None]:
    """
    Run the model with the given prompt and context.
    
    Automatically calls repository skills as needed and streams output.
    
    Args:
        prompt: User's task or question
        context: Additional context (e.g., from context engine)
    
    Yields:
        Output chunks as they are generated
        
    Example:
        >>> provider = ClaudeProvider(".", api_key)
        >>> for chunk in provider.run("Explain this repo", ""):
        ...     print(chunk, end="")
    """
```

#### 9.3 Update Requirements

**Ensure `requirements.txt` includes:**
```
anthropic>=0.25.0
google-generativeai>=0.5.0
openai>=1.30.0
ollama>=0.1.0
textual>=0.50.0
pyfiglet>=0.8.0
pytest>=7.4.0
```

#### 9.4 Create Testing Documentation

**Document Testing Procedures:**
```markdown
# Testing Elith

## Test Individual Skill
python -c "
from backend.skills.read_file import ReadFileSkill
s = ReadFileSkill()
print(s.execute('.', 'README.md'))
"

## Test Claude Provider
python -c "
from backend.providers.claude_provider import ClaudeProvider
import os
p = ClaudeProvider('.', os.environ['ANTHROPIC_API_KEY'])
for chunk in p.run('List files and explain this project', ''):
    print(chunk, end='', flush=True)
"

## Test Architect Operation
python -c "
from backend.operations.architect import run_architect
from backend.providers.claude_provider import ClaudeProvider
import os
provider = ClaudeProvider('.', os.environ['ANTHROPIC_API_KEY'])
result = run_architect(provider, '.', 'skills system')
print(result)
"
```

#### 9.5 Final Integration Test

**Run Complete Test Suite:**
```bash
# Test all skills
pytest backend/skills/

# Test all providers
pytest backend/providers/

# Test operations
pytest backend/operations/

# Integration test
python -m backend.main --provider claude --task "Analyze this repo"
```

**Deliverable:** Production-ready code with documentation and passing tests.

---

## Critical Path & Risk Mitigation

### Critical Path Items

1. **BaseSkill + BaseProvider** (Hours 2-4)
   - **Risk:** Everything depends on these
   - **Mitigation:** Implement and test thoroughly before moving on

2. **Bob Shell Non-Interactive Mode** (Hours 5-8)
   - **Risk:** Unknown if Bob supports non-interactive mode
   - **Mitigation:** Test immediately, have fallback plan
   - **Fallback:** Demo Claude as primary, show Bob via recording

3. **Claude Tool Calling Loop** (Hours 9-14)
   - **Risk:** Complex loop pattern, easy to get wrong
   - **Mitigation:** Follow reference implementation exactly
   - **Test:** Verify Claude calls skills automatically

4. **Architect Prompt Quality** (Hours 15-22)
   - **Risk:** Generic output won't impress judges
   - **Mitigation:** Iterate on multiple repos, add constraints
   - **Success:** Output references specific files

### Time Buffers

- **Phase 1-2:** 6 hours allocated, should take 4 → 2 hour buffer
- **Phase 3:** 4 hours allocated, Bob unknown → may need buffer
- **Phase 4:** 6 hours allocated, critical phase → use buffer if needed
- **Phase 5-6:** 8 hours allocated, parallel work possible
- **Phase 7-9:** 22 hours allocated, includes polish time

### Parallel Work Opportunities

- **Skills 5-12** can be implemented in parallel with **Bob Provider**
- **Gemini Provider** can be implemented in parallel with **Claude Provider**
- **OpenAI + Ollama** can be implemented in parallel
- **Test Generation** can be implemented in parallel with **Architect**

---

## Success Metrics

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

## The Demo Moment

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

Based on my analysis of the codebase, I propose two architecture improvements:

## Option A: Skill Composition Pattern
**Why not standard inheritance:** The current flat skill hierarchy in 
backend/skills/base_skill.py (line 103) doesn't support skill composition...
```

**That is the moment Elith works. That is what wins the hackathon.**

---

## Quick Reference

### File Locations
```
backend/
├── skills/
│   ├── base_skill.py          ← Phase 1
│   ├── read_file.py           ← Phase 2
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
│   └── __init__.py            ← Phase 3
│
├── providers/
│   ├── base_provider.py       ← Phase 1
│   ├── bob_provider.py        ← Phase 3
│   ├── claude_provider.py     ← Phase 4
│   ├── gemini_provider.py     ← Phase 4
│   ├── openai_provider.py     ← Phase 5
│   └── ollama_provider.py     ← Phase 5
│
└── operations/
    ├── architect.py           ← Phase 6
    └── test_gen.py            ← Phase 6
```

### Testing Commands
```bash
# Test skill
python -c "from backend.skills.read_file import ReadFileSkill; print(ReadFileSkill().execute('.', 'README.md'))"

# Test provider
python -c "from backend.providers.claude_provider import ClaudeProvider; import os; [print(c, end='') for c in ClaudeProvider('.', os.environ['ANTHROPIC_API_KEY']).run('Explain this repo', '')]"

# Test architect
python -c "from backend.operations.architect import run_architect; from backend.providers.claude_provider import ClaudeProvider; import os; print(run_architect(ClaudeProvider('.', os.environ['ANTHROPIC_API_KEY']), '.', 'skills'))"
```

---

*Elith Implementation Plan - Basil Joy - IBM Bob Hackathon 2026*