# Hermes Agent TUI Adaptation for Elith

## Overview

This document outlines how we're adapting the Hermes Agent TUI architecture (React + Ink + TypeScript) to our Python Textual-based TUI while maintaining the same professional UX patterns.

## Key Architectural Patterns from Hermes Agent

### 1. **Event-Driven Architecture**
Hermes uses a JSON-RPC event stream between TypeScript UI and Python backend:
- `message.start` → Begin streaming assistant response
- `message.delta` → Incremental text updates
- `message.complete` → Finalize with usage stats
- `thinking.delta` → Show reasoning process
- `tool.start/progress/complete` → Tool execution visualization
- `status.update` → System status changes

**Elith Adaptation**: Use SSE (Server-Sent Events) from our FastAPI backend with similar event types.

### 2. **Live Activity Lane**
Separate visual lane for tool execution and system status, keeping transcript focused on user/assistant turns.

**Elith Adaptation**: Create dedicated `ActivityPanel` widget showing:
- Active tool calls with progress
- Reasoning/thinking text
- System status updates
- File operations in progress

### 3. **Message Queue System**
- Messages entered while agent is busy are queued
- Queue auto-drains after each response
- Visual queue preview shows pending messages
- Up/Down arrows edit queued messages before history

**Elith Adaptation**: Implement `QueueManager` class with:
- `add_to_queue(message)` - Queue messages during busy state
- `edit_queued(index)` - Edit pending messages
- `auto_drain()` - Send next queued message after response
- Visual `QueuePreview` widget

### 4. **Streaming Message Display**
- Messages stream character-by-character
- Markdown rendering with code blocks
- ANSI color support
- Diff syntax highlighting

**Elith Adaptation**: 
- `StreamingMessage` widget that updates on delta events
- Rich markdown rendering via Textual's built-in support
- Syntax highlighting for code blocks

### 5. **Prompt Flows**
Structured prompts that pause main loop:
- **Approval**: Allow once/session/always/deny for tool execution
- **Clarify**: Pick from choices or free-text answer
- **Sudo**: Masked password entry
- **Secret**: Masked env var entry

**Elith Adaptation**: Modal overlays using Textual screens:
- `ApprovalScreen` - Tool execution approval
- `ClarifyScreen` - Clarification questions
- `SecretInputScreen` - Masked input

### 6. **Multiline Input**
- `Shift+Enter` or `Alt+Enter` for newlines
- `\` + `Enter` as fallback
- `Ctrl+G` opens $EDITOR for long inputs

**Elith Adaptation**:
- Enhanced `ChatInput` with multiline support
- Buffer system for composing long messages
- Visual indicator for multiline mode

### 7. **Tab Completion**
- Slash commands: `/help`, `/clear`, `/models`
- Path completion: `./`, `../`, `~/`, `@file`
- Debounced by 60ms

**Elith Adaptation**:
- `CompletionEngine` for slash commands
- File path completion for `@file` references
- Skill name completion

### 8. **Tool Activity Visualization**
```
[tool:read_file] Reading src/main.py...
[tool:search_code] Searching for pattern...
[tool:write_file] Writing to output.txt ✓
```

**Elith Adaptation**: `ToolActivityWidget` showing:
- Tool name and icon
- Progress indicator (spinner/percentage)
- Preview of operation
- Completion status

### 9. **Thinking/Reasoning Display**
Show model's internal reasoning process:
```
💭 Analyzing the codebase structure...
💭 Identifying key components...
💭 Planning refactoring approach...
```

**Elith Adaptation**: `ThinkingPanel` with:
- Collapsible/expandable sections
- Real-time streaming of reasoning
- `/details` command to toggle visibility

### 10. **Status Bar**
Bottom status rule showing:
- Current model
- Session state
- Token usage
- Active tools count

**Elith Adaptation**: Enhanced `StatusBar` with:
- Model indicator with color dot
- Real-time status updates
- Token counter
- Activity indicators

## New TUI Component Structure

```
tui/
├── app_hermes.py              # Main app with Hermes patterns
├── components/
│   ├── activity_panel.py      # Tool execution + status lane
│   ├── streaming_message.py   # Delta-based message display
│   ├── queue_preview.py       # Pending messages preview
│   ├── thinking_panel.py      # Reasoning display
│   ├── tool_activity.py       # Individual tool visualization
│   ├── completion_list.py     # Tab completion dropdown
│   └── multiline_input.py     # Enhanced input with multiline
├── screens/
│   ├── approval.py            # Tool approval modal
│   ├── clarify.py             # Clarification modal
│   └── secret_input.py        # Masked input modal
├── managers/
│   ├── queue_manager.py       # Message queue logic
│   ├── completion_engine.py   # Tab completion
│   └── event_handler.py       # SSE event processing
└── theme_hermes.py            # Hermes-inspired theme

```

## Event Flow

```
User Input → ChatInput
    ↓
Is Agent Busy?
    ├─ Yes → QueueManager.add()
    │         └─ QueuePreview.update()
    └─ No → POST /api/execute
              ↓
         SSE Stream Opens
              ↓
         EventHandler processes:
              ├─ message.start → StreamingMessage.begin()
              ├─ message.delta → StreamingMessage.append()
              ├─ thinking.delta → ThinkingPanel.update()
              ├─ tool.start → ActivityPanel.add_tool()
              ├─ tool.progress → ToolActivity.update()
              ├─ tool.complete → ToolActivity.finish()
              └─ message.complete → StreamingMessage.finalize()
                                    └─ QueueManager.auto_drain()
```

## Key Differences from Current TUI

| Current | Hermes-Inspired |
|---------|----------------|
| Simple message list | Streaming delta updates |
| No tool visualization | Live tool activity lane |
| No queue system | Message queue with preview |
| Basic input | Multiline + tab completion |
| No reasoning display | Thinking panel |
| Static messages | Real-time streaming |
| No approval flows | Modal approval prompts |

## Implementation Priority

1. **Core Streaming** (Hours 1-3)
   - SSE event handler
   - Streaming message widget
   - Delta-based updates

2. **Tool Visualization** (Hours 4-6)
   - Activity panel
   - Tool progress indicators
   - Status updates

3. **Queue System** (Hours 7-8)
   - Queue manager
   - Queue preview widget
   - Auto-drain logic

4. **Enhanced Input** (Hours 9-10)
   - Multiline support
   - Tab completion
   - Command history

5. **Prompt Flows** (Hours 11-12)
   - Approval screen
   - Clarify screen
   - Modal overlays

6. **Polish** (Hours 13-14)
   - Thinking panel
   - Styling refinements
   - Keyboard shortcuts

## Backend Requirements

Our backend already supports most of this via:
- `/api/execute` - Start operations
- `/api/stream/{session_id}` - SSE streaming
- Event types: `output`, `tool_call`, `done`, `error`

**Additions Needed**:
- `thinking` event type for reasoning
- `tool_progress` event for incremental updates
- `clarify` event for questions
- `approval` event for tool execution

## Visual Design

```
┌─ ELITH ─────────────────────────────────────────────────────────┐
│                                                                   │
│ ● LMStudio  12:34                                                │
│ Analyzing the repository structure...                            │
│                                                                   │
│ You  12:33                                                       │
│ Explain the architecture of this project                         │
│                                                                   │
│ ┌─ Activity ─────────────────────────────────────────────────┐  │
│ │ [tool:read_file] Reading backend/main.py... ✓               │  │
│ │ [tool:list_files] Scanning directory... ⟳                   │  │
│ │ 💭 Identifying key components...                            │  │
│ └──────────────────────────────────────────────────────────────┘  │
│                                                                   │
│ ┌─ Queue (2) ────────────────────────────────────────────────┐  │
│ │ 1. What are the main dependencies?                          │  │
│ │ 2. How does the context engine work?                        │  │
│ └──────────────────────────────────────────────────────────────┘  │
│                                                                   │
├───────────────────────────────────────────────────────────────────┤
│ > Enter your prompt... (Shift+Enter for newline)                 │
├───────────────────────────────────────────────────────────────────┤
│ ● lmstudio | Streaming... | 2 tools active | 1.2k tokens         │
└───────────────────────────────────────────────────────────────────┘
```

## Next Steps

1. Create `app_hermes.py` with event-driven architecture
2. Implement `StreamingMessage` widget
3. Build `ActivityPanel` for tool visualization
4. Add `QueueManager` and preview
5. Enhance input with multiline + completion
6. Create modal screens for prompts
7. Update backend to emit additional event types
8. Test end-to-end streaming flow

This adaptation brings Hermes Agent's professional UX patterns to our Python Textual TUI while maintaining our existing backend architecture.