# Elith Architecture

#architecture #system-design

## Core Components

### 1. Skill Layer
The skill layer provides 12 repository-aware tools that any AI model can use:
- File operations (read, write, list)
- Code search and analysis
- Git operations (diff, commit)
- Testing and dependencies

### 2. Provider System
Each AI model (Claude, Gemini, GPT, LMStudio) gets a provider that:
- Injects skills as tools via model-specific API
- Handles tool calling loop
- Streams output back to client

### 3. Context Engine
Smart file selection that:
- Scans repository structure
- Reads Obsidian vault notes
- Selects only relevant files (typically 4-6 of 100+)
- Reduces token usage by 90%+

## Key Innovation

**Elith makes any AI model repo-aware** by giving them the same skills IBM Bob has natively.

## Design Decisions

- **Skills over RAG**: Direct file access is more accurate than vector search
- **Streaming first**: SSE for real-time output
- **Provider abstraction**: Easy to add new models
- **Obsidian integration**: Project memory without vector DB overhead