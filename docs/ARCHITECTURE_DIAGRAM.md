# Elith System Architecture

## High-Level Overview

```mermaid
graph TB
    subgraph "User Interface Layer"
        TUI[TUI Interface]
        CLI[CLI Interface]
    end
    
    subgraph "Router Layer"
        Router[Model Router]
    end
    
    subgraph "Provider Layer"
        Bob[Bob Provider<br/>Native]
        Claude[Claude Provider<br/>Tool Calling]
        Gemini[Gemini Provider<br/>Tool Calling]
        OpenAI[OpenAI Provider<br/>Tool Calling]
        Ollama[Ollama Provider<br/>Tool Calling]
    end
    
    subgraph "Skill Layer"
        Registry[Skill Registry<br/>ALL_SKILLS]
        
        subgraph "File Operations"
            ReadFile[read_file]
            WriteFile[write_file]
            ListFiles[list_files]
        end
        
        subgraph "Code Analysis"
            SearchCode[search_code]
            FindRefs[find_references]
            ExplainFunc[explain_function]
            AnalyzeDeps[analyze_dependencies]
        end
        
        subgraph "Git Operations"
            GitDiff[git_diff]
            GitCommit[git_commit]
        end
        
        subgraph "Testing & Deployment"
            RunTests[run_tests]
            InstallPkg[install_package]
            ReadLogs[read_logs]
        end
    end
    
    subgraph "Operations Layer"
        Architect[Architect Operation<br/>Novel Proposals]
        TestGen[Test Generator<br/>Auto Tests]
    end
    
    subgraph "Context Layer"
        RepoScanner[Repo Scanner]
        VaultReader[Vault Reader]
        PacketBuilder[Packet Builder]
    end
    
    subgraph "Repository"
        Files[Source Files]
        Git[Git History]
        Tests[Test Files]
        Logs[Log Files]
    end
    
    TUI --> Router
    CLI --> Router
    Router --> Bob
    Router --> Claude
    Router --> Gemini
    Router --> OpenAI
    Router --> Ollama
    
    Bob -.Native Capabilities.-> Files
    
    Claude --> Registry
    Gemini --> Registry
    OpenAI --> Registry
    Ollama --> Registry
    
    Registry --> ReadFile
    Registry --> WriteFile
    Registry --> ListFiles
    Registry --> SearchCode
    Registry --> FindRefs
    Registry --> ExplainFunc
    Registry --> AnalyzeDeps
    Registry --> GitDiff
    Registry --> GitCommit
    Registry --> RunTests
    Registry --> InstallPkg
    Registry --> ReadLogs
    
    ReadFile --> Files
    WriteFile --> Files
    ListFiles --> Files
    SearchCode --> Files
    FindRefs --> Files
    ExplainFunc --> Files
    AnalyzeDeps --> Files
    GitDiff --> Git
    GitCommit --> Git
    RunTests --> Tests
    InstallPkg --> Files
    ReadLogs --> Logs
    
    Architect --> Claude
    Architect --> Gemini
    TestGen --> Claude
    
    RepoScanner --> Files
    VaultReader --> Files
    PacketBuilder --> RepoScanner
    PacketBuilder --> VaultReader
    
    PacketBuilder -.Context.-> Router
```

## Tool Calling Flow

```mermaid
sequenceDiagram
    participant User
    participant Provider as Claude Provider
    participant API as Anthropic API
    participant Registry as Skill Registry
    participant Skill as read_file Skill
    participant Repo as Repository
    
    User->>Provider: "Explain the auth module"
    Provider->>API: messages.create(tools=[12 skills])
    
    loop Tool Calling Loop
        API->>Provider: Response with tool_use
        Provider->>Provider: Extract tool call
        Provider->>User: [Elith Skill: read_file(...)]
        Provider->>Registry: execute_skill("read_file", path="auth/views.py")
        Registry->>Skill: execute(repo_path, path)
        Skill->>Repo: Read file
        Repo->>Skill: File content
        Skill->>Registry: Return content string
        Registry->>Provider: Return content string
        Provider->>User: → File content preview
        Provider->>API: Continue with tool result
    end
    
    API->>Provider: Response with end_turn
    Provider->>User: Final analysis text
```

## Provider Comparison

```mermaid
graph LR
    subgraph "Bob Provider"
        BobInput[User Prompt]
        BobProcess[Subprocess<br/>bob --task]
        BobOutput[Stream stdout]
        BobInput --> BobProcess --> BobOutput
    end
    
    subgraph "Claude Provider"
        ClaudeInput[User Prompt]
        ClaudeTools[Inject 12 Skills<br/>as Tools]
        ClaudeAPI[Anthropic API]
        ClaudeLoop{Tool Use?}
        ClaudeExec[Execute Skill]
        ClaudeOutput[Stream Output]
        
        ClaudeInput --> ClaudeTools
        ClaudeTools --> ClaudeAPI
        ClaudeAPI --> ClaudeLoop
        ClaudeLoop -->|Yes| ClaudeExec
        ClaudeExec --> ClaudeAPI
        ClaudeLoop -->|No| ClaudeOutput
    end
```

## Skill Execution Pattern

```mermaid
flowchart TD
    Start[Provider receives tool call]
    Extract[Extract skill name & params]
    Lookup[Lookup skill in registry]
    Found{Skill exists?}
    Execute[skill.execute repo_path, **kwargs]
    Success{Success?}
    Return[Return result string]
    Error[Return error string]
    Feed[Feed result back to model]
    
    Start --> Extract
    Extract --> Lookup
    Lookup --> Found
    Found -->|Yes| Execute
    Found -->|No| Error
    Execute --> Success
    Success -->|Yes| Return
    Success -->|No| Error
    Return --> Feed
    Error --> Feed
```

## Data Flow: Architect Operation

```mermaid
flowchart TB
    Input[User: Analyze auth module]
    Context[Build Context Packet]
    Scan[Scan Repository]
    Read[Read Key Files]
    Analyze[Module Analysis]
    Prompt[Generate Architect Prompt]
    Provider[Run Provider]
    Skills[Provider Calls Skills]
    Proposal[Generate Proposals]
    Output[Architecture Recommendations]
    
    Input --> Context
    Context --> Scan
    Context --> Read
    Scan --> Analyze
    Read --> Analyze
    Analyze --> Prompt
    Prompt --> Provider
    Provider --> Skills
    Skills --> Provider
    Provider --> Proposal
    Proposal --> Output
    
    style Skills fill:#f9f,stroke:#333,stroke-width:2px
    style Output fill:#9f9,stroke:#333,stroke-width:2px
```

## Skill Categories

```mermaid
mindmap
  root((Elith Skills))
    File Operations
      read_file
      write_file
      list_files
    Code Analysis
      search_code
      find_references
      explain_function
      analyze_dependencies
    Git Operations
      git_diff
      git_commit
    Testing & Deployment
      run_tests
      install_package
      read_logs
```

## Provider Tool Format Differences

```mermaid
graph TB
    BaseSkill[BaseSkill Interface]
    
    subgraph "Anthropic Format"
        AnthropicTool["name: string<br/>description: string<br/>input_schema: JSONSchema"]
    end
    
    subgraph "OpenAI Format"
        OpenAITool["type: 'function'<br/>function:<br/>  name: string<br/>  description: string<br/>  parameters: JSONSchema"]
    end
    
    subgraph "Gemini Format"
        GeminiTool["FunctionDeclaration<br/>  name: string<br/>  description: string<br/>  parameters: Schema"]
    end
    
    BaseSkill -->|to_anthropic_tool| AnthropicTool
    BaseSkill -->|to_openai_tool| OpenAITool
    BaseSkill -->|to_gemini_function| GeminiTool
```

## Critical Path Dependencies

```mermaid
gantt
    title Elith Implementation Timeline
    dateFormat HH
    axisFormat %H
    
    section Foundation
    BaseSkill & BaseProvider :crit, base, 02, 2h
    
    section Core Skills
    read_file (CRITICAL) :crit, read, after base, 1h
    write_file :write, after read, 1h
    list_files :list, after read, 1h
    search_code :search, after read, 1h
    
    section Bob Provider
    Investigate Bob shell :crit, bob_inv, after base, 1h
    Implement Bob Provider :bob, after bob_inv, 2h
    
    section Remaining Skills
    8 Additional Skills :skills, after search, 3h
    Skill Registry :registry, after skills, 1h
    
    section Claude Provider
    Claude Implementation :crit, claude, after registry, 3h
    Claude Testing :crit, claude_test, after claude, 2h
    Gemini Implementation :gemini, after claude, 2h
    
    section Other Providers
    OpenAI Provider :openai, after gemini, 2h
    Ollama Provider :ollama, after gemini, 2h
    
    section Operations
    Architect Design :arch_design, after claude, 2h
    Architect Implementation :arch, after arch_design, 3h
    Test Generator :testgen, after arch, 2h
    
    section Integration
    Router Integration :router, after ollama, 2h
    Integration Testing :int_test, after router, 3h
    
    section Demo
    Demo Preparation :demo, after int_test, 4h
    
    section Polish
    Code Review & Docs :polish, after demo, 4h
```

## The Critical Moment

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Claude as Claude Provider
    participant Skills as Skill System
    participant Repo as Repository
    
    Note over Dev,Repo: THE MOMENT ELITH WORKS
    
    Dev->>Claude: "Understand this repo and<br/>propose better architecture"
    
    Note over Claude: Claude decides to explore
    
    Claude->>Skills: list_files(".")
    Skills->>Repo: List directory
    Repo->>Skills: [backend/, frontend/, docs/]
    Skills->>Claude: Directory listing
    
    Note over Claude: Claude wants to understand skills
    
    Claude->>Skills: read_file("backend/skills/base_skill.py")
    Skills->>Repo: Read file
    Repo->>Skills: class BaseSkill(ABC): ...
    Skills->>Claude: File content
    
    Note over Claude: Claude searches for patterns
    
    Claude->>Skills: search_code("BaseSkill")
    Skills->>Repo: Grep search
    Repo->>Skills: Found in 12 files
    Skills->>Claude: Search results
    
    Note over Claude: Claude analyzes and proposes
    
    Claude->>Dev: "Based on my analysis of<br/>backend/skills/base_skill.py (line 103),<br/>I propose two architecture improvements..."
    
    Note over Dev,Repo: 🎉 Bob-level behavior from Claude!
```

---

## Key Architectural Principles

### 1. Abstraction Through Base Classes
- **BaseSkill**: Defines contract for all skills
- **BaseProvider**: Defines contract for all providers
- Enables adding new skills/providers without changing existing code

### 2. Tool Calling Normalization
- Each provider has different tool calling API
- BaseSkill provides conversion methods for each format
- Providers use appropriate conversion method

### 3. Streaming Output Pattern
- All providers return `Generator[str, None, None]`
- Enables real-time output display
- Supports long-running operations

### 4. Error Handling Contract
- Skills MUST return `str` (even for errors)
- Format: `"Error: description"`
- Providers don't catch skill exceptions
- Skills handle their own error cases

### 5. Repository-Centric Design
- All operations relative to `repo_path`
- Skills receive `repo_path` as first parameter
- Enables working with any repository

### 6. Provider Loop Pattern
- Non-standard: must loop on `tool_use`
- Execute skill, append result, continue
- Break only on `end_turn` or equivalent

---

*Elith Architecture Diagram - IBM Bob Hackathon 2026*