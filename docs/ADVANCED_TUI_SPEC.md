# Advanced TUI Specification - Hermes Agent Style

## Overview

This document specifies a sophisticated Terminal UI inspired by Hermes Agent, featuring:
- Multi-panel layout with documentation viewer
- File tree navigation
- Rich markdown rendering
- Structured information display
- Real-time status updates

---

## Design Goals

1. **Information-Rich**: Display comprehensive project documentation, architecture, and status
2. **Professional**: Clean, structured layout with clear visual hierarchy
3. **Interactive**: Navigate between different views and components
4. **Real-time**: Live updates from backend operations
5. **Keyboard-Driven**: Efficient navigation without mouse

---

## Layout Structure

### Main Layout (Inspired by Screenshots)

```
┌─────────────────────────────────────────────────────────────────┐
│ ELITH - AI-Powered Code Assistant                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 1. Overall Structure                                     │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                          │  │
│  │  ├── components/        # Re-usable UI widgets          │  │
│  │  ├── pages/             # Route components              │  │
│  │  ├── stores/            # Zustand global store          │  │
│  │  ├── services/          # API integration               │  │
│  │  └── App.tsx            # Router + global layout        │  │
│  │                                                          │  │
│  │  • Frontend - Single-page React app                     │  │
│  │  • TUI - Full-screen terminal UI (Textual)             │  │
│  │  • Backend - FastAPI server                             │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 2. Key Components                                        │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                          │  │
│  │  Layer          File(s)              Responsibility     │  │
│  │  ─────────────────────────────────────────────────────  │  │
│  │  Frontend       stores/elithStore.ts  Global state      │  │
│  │  TUI - Widgets  components/*          Textual widgets   │  │
│  │  Backend - API  main.py               FastAPI server    │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 3. How They Interact                                     │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                          │  │
│  │  Frontend ← Backend                                      │  │
│  │  1. Scan Repo - POST /api/scan                          │  │
│  │  2. Execute - POST /api/execute                         │  │
│  │  3. Stream - GET /api/stream/{session_id} (SSE)        │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ CTRL+C Quit  CTRL+N New Session  CTRL+H Help                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Core Features

### 1. Documentation Viewer
- **Markdown Rendering**: Full markdown support with syntax highlighting
- **Sections**: Collapsible sections (Overall Structure, Key Components, etc.)
- **Tables**: Formatted tables with borders
- **Code Blocks**: Syntax-highlighted code snippets
- **Links**: Clickable file references

### 2. File Tree Navigator
```
├── components/
│   ├── TopBar.tsx
│   ├── Sidebar.tsx
│   └── ...
├── pages/
│   ├── Landing.tsx
│   ├── Workspace.tsx
│   └── ...
├── stores/
│   └── elithStore.ts
└── services/
    └── api.ts
```

### 3. Status Panel
- **Current Operation**: What's running
- **Progress**: Real-time progress bars
- **Model Status**: Active models and their states
- **Token Usage**: Context window usage
- **Session Info**: Current session details

### 4. Live Output Stream
- **Real-time Updates**: SSE streaming from backend
- **Model Attribution**: Show which model produced output
- **Syntax Highlighting**: Code in responses
- **Timestamps**: When each message was sent

### 5. Command Palette
- **Quick Actions**: `/scan`, `/execute`, `/models`, `/help`
- **File Navigation**: Jump to files
- **Model Switching**: Quick model selection
- **Settings**: Configuration access

---

## Technology Options

### Option 1: Enhanced Python/Textual (Recommended)
**Pros**:
- Already using Textual
- Rich widget library
- Good markdown support
- Python integration with backend

**Cons**:
- Limited compared to web technologies
- Complex layouts can be challenging

**Libraries**:
- `textual` - TUI framework
- `rich` - Rich text rendering
- `textual-markdown` - Markdown widget
- `tree-sitter` - Syntax highlighting

### Option 2: Rust/Ratatui
**Pros**:
- Extremely fast
- Beautiful rendering
- Great for complex layouts
- Strong type system

**Cons**:
- New language for team
- Longer development time
- Backend integration more complex

**Libraries**:
- `ratatui` - TUI framework
- `tui-markdown` - Markdown rendering
- `syntect` - Syntax highlighting

### Option 3: Go/Bubble Tea
**Pros**:
- Fast and efficient
- Good TUI framework
- Easy deployment
- Strong concurrency

**Cons**:
- New language for team
- Less rich widget library
- Backend integration needed

**Libraries**:
- `bubbletea` - TUI framework
- `glamour` - Markdown rendering
- `lipgloss` - Styling

### Option 4: Node.js/Ink (React for Terminal)
**Pros**:
- React components in terminal
- Familiar for frontend devs
- Good ecosystem
- Easy backend integration

**Cons**:
- Performance overhead
- Less mature than others
- Node.js dependency

**Libraries**:
- `ink` - React for terminal
- `ink-markdown` - Markdown component
- `ink-table` - Table component

---

## Recommended Approach: Enhanced Textual

Stay with Python/Textual but enhance it significantly:

### Phase 1: Layout System
```python
class AdvancedTUI(App):
    """
    ┌─────────────────────────────────────┐
    │ Header                              │
    ├──────────────┬──────────────────────┤
    │              │                      │
    │  Sidebar     │  Main Content        │
    │  (20%)       │  (80%)               │
    │              │                      │
    │  - Files     │  ┌────────────────┐  │
    │  - Models    │  │ Doc Viewer     │  │
    │  - Status    │  │                │  │
    │              │  └────────────────┘  │
    │              │  ┌────────────────┐  │
    │              │  │ Output Stream  │  │
    │              │  └────────────────┘  │
    ├──────────────┴──────────────────────┤
    │ Status Bar                          │
    └─────────────────────────────────────┘
    """
```

### Phase 2: Rich Components

#### DocumentViewer Widget
```python
class DocumentViewer(VerticalScroll):
    """
    Renders markdown with:
    - Headings (styled)
    - Code blocks (syntax highlighted)
    - Tables (formatted)
    - Lists (indented)
    - Links (clickable)
    """
```

#### FileTree Widget
```python
class FileTree(Tree):
    """
    Interactive file tree:
    - Expandable directories
    - File icons
    - Syntax highlighting
    - Quick navigation
    """
```

#### StatusPanel Widget
```python
class StatusPanel(Container):
    """
    Shows:
    - Active models (with indicators)
    - Current operation
    - Progress bars
    - Token usage
    - Session info
    """
```

#### OutputStream Widget
```python
class OutputStream(VerticalScroll):
    """
    Live streaming output:
    - Model attribution
    - Timestamps
    - Syntax highlighting
    - Auto-scroll
    """
```

### Phase 3: State Management
```python
class AppState:
    """
    Centralized state:
    - Current file/directory
    - Active models
    - Session data
    - Output buffer
    - UI state (focused panel, etc.)
    """
```

### Phase 4: Backend Integration
```python
class BackendClient:
    """
    Async communication:
    - HTTP requests (httpx)
    - SSE streaming
    - WebSocket (future)
    - Error handling
    """
```

---

## Implementation Plan

### Week 1: Core Layout
- [ ] Multi-panel layout system
- [ ] Sidebar with tabs
- [ ] Main content area
- [ ] Status bar enhancements
- [ ] Keyboard navigation

### Week 2: Rich Components
- [ ] DocumentViewer with markdown
- [ ] FileTree with navigation
- [ ] StatusPanel with live updates
- [ ] OutputStream with streaming
- [ ] Syntax highlighting

### Week 3: Backend Integration
- [ ] Async API client
- [ ] SSE streaming handler
- [ ] State synchronization
- [ ] Error handling
- [ ] Progress tracking

### Week 4: Polish & Features
- [ ] Command palette
- [ ] Search functionality
- [ ] Settings panel
- [ ] Themes/customization
- [ ] Performance optimization

---

## File Structure

```
tui/
├── app_advanced.py          # Main advanced TUI app
├── layouts/
│   ├── main_layout.py       # Multi-panel layout
│   ├── sidebar_layout.py    # Sidebar with tabs
│   └── content_layout.py    # Main content area
├── widgets/
│   ├── document_viewer.py   # Markdown viewer
│   ├── file_tree.py         # File navigator
│   ├── status_panel.py      # Status display
│   ├── output_stream.py     # Live output
│   ├── command_palette.py   # Quick actions
│   └── progress_bar.py      # Progress indicators
├── state/
│   ├── app_state.py         # Global state
│   └── session_state.py     # Session data
├── backend/
│   ├── client.py            # API client
│   ├── streaming.py         # SSE handler
│   └── websocket.py         # WebSocket (future)
├── utils/
│   ├── markdown.py          # Markdown utilities
│   ├── syntax.py            # Syntax highlighting
│   └── formatting.py        # Text formatting
└── themes/
    ├── default.py           # Default theme
    └── custom.py            # Custom themes
```

---

## Example: DocumentViewer Implementation

```python
from textual.widgets import Static
from textual.containers import VerticalScroll
from rich.markdown import Markdown
from rich.syntax import Syntax

class DocumentViewer(VerticalScroll):
    """
    Advanced markdown viewer with:
    - Syntax highlighting
    - Collapsible sections
    - Clickable links
    - Tables
    """
    
    DEFAULT_CSS = """
    DocumentViewer {
        background: #0A0A0A;
        border: solid #27272A;
        padding: 1 2;
    }
    
    DocumentViewer .section {
        margin: 1 0;
    }
    
    DocumentViewer .code-block {
        background: #1A1A1A;
        border: solid #27272A;
        padding: 1;
    }
    """
    
    def __init__(self, content: str):
        super().__init__()
        self.content = content
    
    def compose(self):
        # Parse markdown and create widgets
        sections = self.parse_markdown(self.content)
        for section in sections:
            yield self.create_section(section)
    
    def parse_markdown(self, content: str):
        # Parse markdown into structured sections
        pass
    
    def create_section(self, section):
        # Create widget for section
        pass
```

---

## Next Steps

1. **Review & Approve**: Team reviews this spec
2. **Choose Technology**: Decide on Python/Textual enhancement vs new language
3. **Prototype**: Build basic multi-panel layout
4. **Iterate**: Add components incrementally
5. **Test**: Ensure performance and usability
6. **Deploy**: Replace current TUI

---

## Resources

### Textual
- Docs: https://textual.textualize.io/
- Examples: https://github.com/Textualize/textual/tree/main/examples
- Widgets: https://textual.textualize.io/widget_gallery/

### Ratatui (Rust)
- Docs: https://ratatui.rs/
- Examples: https://github.com/ratatui-org/ratatui/tree/main/examples

### Bubble Tea (Go)
- Docs: https://github.com/charmbracelet/bubbletea
- Examples: https://github.com/charmbracelet/bubbletea/tree/master/examples

### Ink (Node.js)
- Docs: https://github.com/vadimdemedes/ink
- Examples: https://github.com/vadimdemedes/ink/tree/master/examples

---

*Specification created: May 16, 2026*
*Branch: feature/main/tui*
*Status: Planning Phase*