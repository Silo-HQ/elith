# Advanced Coding Agent TUI Specification

## Overview

This specification defines a complete upgrade of the Elith TUI to match the functionality of advanced coding agents like Claude Code CLI, with features for file editing, diff viewing, edit approval, and comprehensive command support.

## Target Interface (Based on User Requirements)

The TUI must display:
- **Thinking content** from AI models
- **File diffs** with syntax highlighting and line numbers
- **Multi-panel layout** (code view + chat/status)
- **Edit approval system** with keyboard shortcuts (Shift+Tab)
- **Detailed status bar** showing:
  - Workspace path
  - Git branch
  - Sandbox status
  - Model (Auto/Manual selection)
  - Quota usage (%)
  - Context usage (%)
  - Memory usage (MB)
  - Session ID

## Technology Stack

**Language**: TypeScript (replacing Python)
**Framework**: Ink (React for CLI)
**Why**: 
- Code sharing with web frontend
- Better TypeScript integration
- React component model
- Easier state management

## Core Features

### 1. File Diff Viewer

Display file changes with:
- Line numbers (1-based)
- +/- indicators for added/removed lines
- Syntax highlighting for code
- Side-by-side or unified diff view
- Scrollable with keyboard navigation

Example display:
```
1287 + expect(
1288 +   warnSpy.mock.calls.some((call) =>
1289 +     call[0].includes(
1290 +       '[model-fallback] Model "openai/gpt-6" not found...',
```

### 2. Edit Approval System

Show pending and accepted edits:
- `✓ Edit model-selection.test.ts → Accepted (+7, -3)`
- Keyboard shortcut: **Shift+Tab** to accept edits
- Visual indicators for pending/accepted/rejected states
- Batch approval support

### 3. Enhanced Status Bar

Display comprehensive metrics:
```
workspace /path/to/project | branch main | sandbox no sandbox | 
model Auto (Gemini 3) | quota 9% used | context 12% used | 
memory 294.4 MB | session 23d4d3e0
```

### 4. Thinking Content Display

Show AI reasoning process:
- Separate panel for "thinking" output
- Collapsible/expandable sections
- Real-time streaming of thoughts
- Visual distinction from regular output

### 5. Slash Commands (Claude Code CLI Compatible)

#### Core Commands
- `/help` - Show all available commands
- `/clear` - Clear chat history
- `/model <name>` - Switch AI model
- `/models` - List available models
- `/repo <path>` - Set repository path
- `/reset` - Reset session

#### File Operations
- `/read <file>` - Read file contents
- `/write <file>` - Write to file
- `/edit <file>` - Edit file with approval
- `/diff [file]` - Show file diffs
- `/tree [path]` - Show file tree

#### Code Operations
- `/search <query>` - Search codebase
- `/references <symbol>` - Find symbol references
- `/explain <file>` - Explain code
- `/refactor <file>` - Refactor code
- `/test <file>` - Generate tests

#### Git Operations
- `/git status` - Show git status
- `/git diff [file]` - Show git diff
- `/git commit <message>` - Commit changes
- `/git branch` - Show branches

#### Memory/Obsidian
- `/obsidian status` - Check Obsidian vault status
- `/obsidian setup` - Setup Obsidian integration
- `/obsidian open` - Open vault in Obsidian
- `/obsidian search <query>` - Search vault

#### Mode/Rules
- `/mode <mode>` - Switch mode (code/plan/ask/advanced)
- `/rules` - Show current rules
- `/rules add <rule>` - Add custom rule
- `/rules list` - List all rules

#### Session Management
- `/session save` - Save current session
- `/session load <id>` - Load session
- `/session list` - List sessions
- `/session export` - Export to bob-reports

### 6. CLI Commands Reference

Global commands (not slash-prefixed):
- `elith init` - Initialize project
- `elith scan` - Scan repository
- `elith execute <operation>` - Execute operation
- `elith config` - Configure settings
- `elith version` - Show version
- `elith update` - Update Elith

### 7. Tab Completion

Implement intelligent tab completion:
- Command names (after `/`)
- File paths (for file operations)
- Model names (for `/model`)
- Git branches (for git commands)
- Obsidian notes (for `/obsidian`)
- Sub-commands (for commands with sub-commands)

### 8. Command Menu with Sub-Commands

Show hierarchical menu for commands with sub-commands:
```
/git
  ├─ status
  ├─ diff [file]
  ├─ commit <message>
  └─ branch

/obsidian
  ├─ status
  ├─ setup
  ├─ open
  └─ search <query>
```

## Architecture

### Component Structure

```
tui/
├── src/
│   ├── components/
│   │   ├── StatusBar.tsx          # Enhanced status bar
│   │   ├── ChatInput.tsx          # Input with tab completion
│   │   ├── MessagesPanel.tsx      # Chat history
│   │   ├── DiffViewer.tsx         # File diff display
│   │   ├── EditApproval.tsx       # Edit approval UI
│   │   ├── ThinkingPanel.tsx      # AI thinking display
│   │   ├── FileTree.tsx           # File browser
│   │   ├── CommandMenu.tsx        # Command palette
│   │   └── TabCompletion.tsx      # Tab completion UI
│   ├── services/
│   │   ├── api.ts                 # Backend API client
│   │   ├── git.ts                 # Git operations
│   │   ├── obsidian.ts            # Obsidian integration
│   │   └── diff.ts                # Diff generation
│   ├── hooks/
│   │   ├── useCommands.ts         # Command handling
│   │   ├── useTabCompletion.ts   # Tab completion logic
│   │   ├── useKeyboard.ts         # Keyboard shortcuts
│   │   └── useSession.ts          # Session management
│   ├── types/
│   │   ├── commands.ts            # Command types
│   │   ├── diff.ts                # Diff types
│   │   └── session.ts             # Session types
│   ├── utils/
│   │   ├── syntax.ts              # Syntax highlighting
│   │   ├── diff.ts                # Diff utilities
│   │   └── format.ts              # Formatting helpers
│   ├── App.tsx                    # Main app component
│   └── index.tsx                  # Entry point
├── package.json
├── tsconfig.json
└── README.md
```

### State Management

Use React hooks and context:
```typescript
interface AppState {
  // Session
  sessionId: string | null;
  currentModel: string;
  repoPath: string;
  
  // Chat
  messages: Message[];
  thinking: ThinkingContent[];
  
  // Files
  pendingEdits: Edit[];
  acceptedEdits: Edit[];
  currentDiff: Diff | null;
  
  // Status
  workspace: string;
  branch: string;
  sandbox: boolean;
  quota: number;
  context: number;
  memory: number;
  
  // UI
  activePanel: 'chat' | 'diff' | 'tree';
  commandMenuOpen: boolean;
  tabCompletions: string[];
}
```

### Command System

```typescript
interface Command {
  name: string;
  aliases?: string[];
  description: string;
  usage: string;
  subCommands?: Command[];
  handler: (args: string[]) => Promise<void>;
  tabComplete?: (partial: string) => string[];
}

const commands: Command[] = [
  {
    name: 'git',
    description: 'Git operations',
    usage: '/git <subcommand>',
    subCommands: [
      {
        name: 'status',
        description: 'Show git status',
        usage: '/git status',
        handler: async () => { /* ... */ }
      },
      // ... more sub-commands
    ]
  },
  // ... more commands
];
```

## Implementation Plan

### Phase 1: Core Infrastructure (Week 1)
- [x] Set up TypeScript/Ink project
- [x] Create basic component structure
- [x] Implement API client
- [ ] Add command system
- [ ] Implement tab completion

### Phase 2: UI Components (Week 2)
- [ ] Enhanced status bar
- [ ] Diff viewer with syntax highlighting
- [ ] Edit approval system
- [ ] Thinking panel
- [ ] File tree viewer

### Phase 3: Commands (Week 3)
- [ ] All slash commands
- [ ] CLI commands
- [ ] Obsidian integration
- [ ] Mode switching
- [ ] Session management

### Phase 4: Polish & Testing (Week 4)
- [ ] Keyboard shortcuts
- [ ] Error handling
- [ ] Performance optimization
- [ ] End-to-end testing
- [ ] Documentation

## Migration Strategy

1. **Keep both TUIs running** during development
2. **Gradual feature parity** - implement features one by one
3. **Test thoroughly** before deprecating Python TUI
4. **Rename tui-ts to tui** when complete
5. **Archive old Python TUI** as tui-python

## Success Criteria

- [ ] All slash commands working
- [ ] Tab completion functional
- [ ] Diff viewer with syntax highlighting
- [ ] Edit approval with Shift+Tab
- [ ] Status bar showing all metrics
- [ ] Thinking content display
- [ ] Obsidian integration
- [ ] Mode switching
- [ ] Session persistence
- [ ] Performance: <100ms response time
- [ ] Zero crashes during normal operation

## References

- Claude Code CLI: https://code.claude.com/docs/en/commands
- Claude CLI Reference: https://code.claude.com/docs/en/cli-reference
- Ink Documentation: https://github.com/vadimdemedes/ink
- React Hooks: https://react.dev/reference/react

---

*Created: 2026-05-16*
*Status: Planning Phase*
*Target Completion: 4 weeks*