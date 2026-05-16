# Elith Hermes-Inspired TUI Guide

## Overview

The Hermes-inspired TUI brings professional agent interface patterns from the NousResearch Hermes Agent to Elith's Python Textual-based terminal interface. This creates a powerful, production-ready interface for AI-assisted development.

## Key Features

### 1. **Streaming Message Display**
- Real-time delta-based updates as the AI responds
- Smooth character-by-character streaming
- Automatic markdown rendering for code blocks
- Visual streaming indicator (▊) during active responses

### 2. **Live Tool Execution Visualization**
- Dedicated activity panel showing tool execution in real-time
- Progress indicators for each tool (⟳ active, ✓ complete, ✗ error)
- Tool preview text showing what's being executed
- Auto-cleanup of completed tools after 2 seconds

### 3. **Message Queue System**
- Messages entered while AI is busy are automatically queued
- Visual queue preview showing pending messages
- Queue auto-drains after each response completes
- Edit queued messages before they're sent
- Navigate queue with Up/Down arrows

### 4. **Thinking/Reasoning Display**
- Shows the AI's internal reasoning process
- Real-time streaming of thinking text
- Collapsible activity panel to reduce clutter
- 💭 icon indicates reasoning mode

### 5. **Enhanced Status Bar**
- Active model indicator with color dot
- Current status (Ready/Processing/Streaming/Busy)
- Message count tracking
- Active tools counter
- Token usage tracking

## Architecture

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
│ ● lmstudio | Status: Streaming... | Messages: 3 | Tools: 1 active│
└───────────────────────────────────────────────────────────────────┘
```

## Component Structure

### Core Components

1. **MessageTranscript** (`tui/components/streaming_message.py`)
   - Container for all messages
   - Manages streaming message lifecycle
   - Auto-scrolls to latest content

2. **StreamingMessage** (`tui/components/streaming_message.py`)
   - Individual message with delta-based updates
   - Supports markdown rendering
   - Visual streaming indicator

3. **ActivityPanel** (`tui/components/activity_panel.py`)
   - Shows live tool execution
   - Displays thinking/reasoning
   - Auto-hides when empty

4. **QueuePreview** (`tui/components/queue_preview.py`)
   - Shows pending messages
   - Supports editing queued items
   - Visual queue count

5. **QueueManager** (`tui/components/queue_preview.py`)
   - Manages queue logic
   - Auto-drain functionality
   - Queue state management

## Usage

### Starting the TUI

```bash
# Make sure backend is running first
python -m uvicorn backend.main:app --reload --port 8000

# In another terminal, launch the Hermes TUI
./run_hermes_tui.sh

# Or directly
source venv/bin/activate
python3 -m tui.app_hermes
```

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+C` | Quit application |
| `Ctrl+N` | Start new session |
| `Ctrl+L` | Clear chat history |
| `Ctrl+Q` | Toggle queue visibility |
| `Ctrl+A` | Toggle activity panel |
| `Enter` | Send message |
| `Shift+Enter` | New line in message (future) |

### Slash Commands

| Command | Description |
|---------|-------------|
| `/help` | Show help message |
| `/models` | List available models |
| `/model <name>` | Switch to different model |
| `/clear` | Clear chat history |
| `/repo <path>` | Set repository path |
| `/queue` | Show queue status |
| `/activity` | Toggle activity panel |

## Event Flow

### Message Processing

```
User Input
    ↓
Is Agent Busy?
    ├─ Yes → Add to Queue
    │         └─ Show in QueuePreview
    └─ No → POST /api/execute
              ↓
         SSE Stream Opens
              ↓
         Event Handler:
              ├─ output → Append delta to StreamingMessage
              ├─ tool_call → Add to ActivityPanel
              ├─ tool_complete → Mark tool complete
              ├─ thinking → Show in ActivityPanel
              └─ done → Complete message, auto-drain queue
```

### Streaming Events

The TUI handles these SSE event types:

- **output**: Incremental text content (delta updates)
- **tool_call**: Tool execution started
- **tool_complete**: Tool execution finished
- **thinking**: Model reasoning text
- **done**: Response complete
- **error**: Error occurred

## Comparison with Original TUI

| Feature | Original TUI | Hermes-Inspired TUI |
|---------|-------------|---------------------|
| Message Display | Static blocks | Streaming deltas |
| Tool Visualization | None | Live activity panel |
| Queue System | None | Full queue with preview |
| Thinking Display | None | Dedicated panel |
| Status Bar | Basic | Enhanced with metrics |
| Markdown | Basic | Rich with code blocks |
| User Experience | Simple | Professional agent interface |

## Backend Integration

### Required Backend Events

The Hermes TUI expects these event types from `/api/stream/{session_id}`:

```python
# Output event (text delta)
{
    "type": "output",
    "content": "text chunk",
    "model": "lmstudio"
}

# Tool call event
{
    "type": "tool_call",
    "tool": "read_file",
    "tool_id": "unique_id",
    "args": {...}
}

# Tool complete event
{
    "type": "tool_complete",
    "tool_id": "unique_id",
    "result": "..."
}

# Thinking event
{
    "type": "thinking",
    "content": "reasoning text"
}

# Done event
{
    "type": "done",
    "usage": {
        "total_tokens": 1234
    }
}

# Error event
{
    "type": "error",
    "error": "error message"
}
```

### Current Backend Support

Our backend already supports:
- ✅ `output` events via streaming
- ✅ `done` events
- ✅ `error` events
- ⚠️ `tool_call` events (needs implementation)
- ⚠️ `tool_complete` events (needs implementation)
- ⚠️ `thinking` events (needs implementation)

## Future Enhancements

### Planned Features

1. **Multiline Input**
   - `Shift+Enter` for newlines
   - Visual multiline indicator
   - Buffer system for composing

2. **Tab Completion**
   - Slash command completion
   - File path completion for `@file` references
   - Skill name completion

3. **Approval Prompts**
   - Modal screens for tool approval
   - Allow once/session/always/deny options
   - Security for dangerous operations

4. **Clarify Prompts**
   - Interactive clarification questions
   - Choice selection or free-text
   - Pause execution until answered

5. **History Navigation**
   - Up/Down for command history
   - Persistent history file
   - Search through history

6. **Enhanced Markdown**
   - Diff syntax highlighting
   - Table rendering
   - Link handling

## Development

### Adding New Components

1. Create component in `tui/components/`
2. Import in `app_hermes.py`
3. Add to layout in `compose()`
4. Wire up event handlers

### Adding New Events

1. Update backend to emit event type
2. Add handler in `stream_response()`
3. Update appropriate component
4. Test end-to-end flow

### Styling

Colors are defined in `tui/theme.py`:
- Primary: `#A855F7` (Purple)
- Background: `#0A0A0A` (Black)
- Success: `#10B981` (Green)
- Error: `#EF4444` (Red)
- Muted: `#888888` (Gray)

## Troubleshooting

### TUI Won't Start

```bash
# Check if textual is installed
pip list | grep textual

# Reinstall if needed
pip install textual

# Check Python version (need 3.10+)
python3 --version
```

### Backend Not Connecting

```bash
# Verify backend is running
curl http://localhost:8000/api/models

# Check backend logs
# Should see "Application startup complete"
```

### Streaming Not Working

1. Check backend SSE implementation
2. Verify session_id is valid
3. Check for CORS issues
4. Look for timeout errors

### Queue Not Draining

1. Check `is_busy` flag state
2. Verify `auto_drain` is enabled
3. Look for exceptions in `process_message()`

## Credits

Inspired by [NousResearch Hermes Agent](https://github.com/NousResearch/hermes-agent) TUI architecture, adapted for Python Textual and Elith's backend.

## License

Part of the Elith project for IBM Bob Hackathon 2026.