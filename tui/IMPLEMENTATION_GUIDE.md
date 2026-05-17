# Advanced Coding Agent TUI - Implementation Guide

## Overview

This guide provides step-by-step instructions for completing the advanced TUI implementation with all required features.

## Current Status

### ✅ Completed
- Specification document created ([`docs/ADVANCED_CODING_AGENT_TUI_SPEC.md`](../docs/ADVANCED_CODING_AGENT_TUI_SPEC.md))
- Core component structure created:
  - [`DiffViewer.tsx`](src/components/DiffViewer.tsx) - File diff display with syntax highlighting
  - [`ThinkingPanel.tsx`](src/components/ThinkingPanel.tsx) - AI thinking content display
  - [`EditApproval.tsx`](src/components/EditApproval.tsx) - Edit approval system
  - [`EnhancedStatusBar.tsx`](src/components/EnhancedStatusBar.tsx) - Detailed status metrics
- Command system defined ([`types/commands.ts`](src/types/commands.ts))
- Dependencies added to [`package.json`](package.json)

### 🚧 In Progress
- Multi-panel layout integration
- Command handlers implementation
- Tab completion system

### ⏳ Pending
- Backend API integration for new features
- Keyboard shortcuts (Shift+Tab, etc.)
- Session management
- Obsidian integration
- Git operations
- Testing and debugging

## Installation Steps

### 1. Install Dependencies

```bash
cd tui-ts
npm install
```

This will install:
- `ink-box` - For bordered panels
- `cli-highlight` - For syntax highlighting
- `diff` - For generating file diffs
- All existing dependencies

### 2. Build TypeScript

```bash
npm run build
```

### 3. Test Run

```bash
npm run dev
```

## Implementation Roadmap

### Phase 1: Core Infrastructure (Current)

#### Step 1.1: Update CommandMenu Component
File: [`src/components/CommandMenu.tsx`](src/components/CommandMenu.tsx)

```typescript
import { COMMANDS, getTabCompletions } from '../types/commands.js';

// Update to show hierarchical commands with sub-commands
// Add tab completion support
// Show command categories
```

#### Step 1.2: Create Command Handler Hook
File: `src/hooks/useCommands.ts` (NEW)

```typescript
import { Command, findCommand, findSubCommand } from '../types/commands.js';

export function useCommands() {
  const handleCommand = async (input: string) => {
    const parts = input.slice(1).split(' ');
    const cmdName = parts[0];
    const args = parts.slice(1);
    
    const command = findCommand(cmdName);
    if (!command) {
      return { error: `Unknown command: ${cmdName}` };
    }
    
    // Handle sub-commands
    if (command.subCommands && args.length > 0) {
      const subCmd = findSubCommand(cmdName, args[0]);
      if (subCmd && subCmd.handler) {
        return await subCmd.handler(args.slice(1));
      }
    }
    
    // Handle main command
    if (command.handler) {
      return await command.handler(args);
    }
    
    return { error: 'Command not implemented yet' };
  };
  
  return { handleCommand };
}
```

#### Step 1.3: Create Tab Completion Hook
File: `src/hooks/useTabCompletion.ts` (NEW)

```typescript
import { useState, useEffect } from 'react';
import { getTabCompletions } from '../types/commands.js';

export function useTabCompletion(input: string) {
  const [completions, setCompletions] = useState<string[]>([]);
  
  useEffect(() => {
    if (input.startsWith('/')) {
      const partial = input.slice(1);
      const matches = getTabCompletions(partial);
      setCompletions(matches);
    } else {
      setCompletions([]);
    }
  }, [input]);
  
  return completions;
}
```

#### Step 1.4: Create Keyboard Shortcuts Hook
File: `src/hooks/useKeyboard.ts` (NEW)

```typescript
import { useInput } from 'ink';

export function useKeyboard(handlers: {
  onShiftTab?: () => void;
  onShiftEsc?: () => void;
  onShiftA?: () => void;
}) {
  useInput((input, key) => {
    if (key.shift && key.tab && handlers.onShiftTab) {
      handlers.onShiftTab();
    }
    if (key.shift && key.escape && handlers.onShiftEsc) {
      handlers.onShiftEsc();
    }
    if (key.shift && input === 'a' && handlers.onShiftA) {
      handlers.onShiftA();
    }
  });
}
```

### Phase 2: Multi-Panel Layout

#### Step 2.1: Create Layout Component
File: `src/components/Layout.tsx` (NEW)

```typescript
import React from 'react';
import { Box } from 'ink';

interface LayoutProps {
  header: React.ReactNode;
  thinking?: React.ReactNode;
  edits?: React.ReactNode;
  diff?: React.ReactNode;
  messages: React.ReactNode;
  input: React.ReactNode;
  statusBar: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  header,
  thinking,
  edits,
  diff,
  messages,
  input,
  statusBar,
}) => {
  return (
    <Box flexDirection="column" height="100%">
      {/* Header */}
      {header}
      
      {/* Thinking Panel (collapsible) */}
      {thinking}
      
      {/* Edit Approval (when edits pending) */}
      {edits}
      
      {/* Main Content Area - Split View */}
      <Box flexGrow={1} flexDirection="row">
        {/* Left: Messages/Chat */}
        <Box flexGrow={1} flexDirection="column">
          {messages}
        </Box>
        
        {/* Right: Diff Viewer (when active) */}
        {diff && (
          <Box width="50%" flexDirection="column">
            {diff}
          </Box>
        )}
      </Box>
      
      {/* Input */}
      {input}
      
      {/* Status Bar */}
      {statusBar}
    </Box>
  );
};
```

#### Step 2.2: Update Main App
File: [`src/App.tsx`](src/App.tsx)

Major refactor to use:
- New Layout component
- EnhancedStatusBar instead of StatusBar
- ThinkingPanel for AI thoughts
- EditApproval for pending edits
- DiffViewer for file changes
- Command handlers from useCommands hook
- Keyboard shortcuts from useKeyboard hook

### Phase 3: Backend Integration

#### Step 3.1: Add New API Endpoints
File: [`src/services/api.ts`](src/services/api.ts)

Add methods for:
- `getDiff(sessionId: string, filePath?: string)`
- `acceptEdit(sessionId: string, editId: string)`
- `rejectEdit(sessionId: string, editId: string)`
- `getThinking(sessionId: string)`
- `getGitStatus(repoPath: string)`
- `getGitDiff(repoPath: string, filePath?: string)`
- `searchCode(repoPath: string, query: string)`
- `getObsidianStatus(vaultPath: string)`
- `searchObsidian(vaultPath: string, query: string)`

#### Step 3.2: Update Backend Routes
Backend files to modify:
- `backend/routes/diff.py` (NEW) - File diff endpoints
- `backend/routes/edits.py` (NEW) - Edit approval endpoints
- `backend/routes/thinking.py` (NEW) - Thinking content endpoints
- `backend/routes/git.py` (NEW) - Git operations
- `backend/routes/obsidian.py` (NEW) - Obsidian integration

### Phase 4: Command Implementations

#### Step 4.1: File Commands
Implement handlers in `src/commands/file.ts` (NEW):
- `/read <file>` - Read file contents
- `/write <file>` - Write to file
- `/edit <file>` - Edit with approval
- `/diff [file]` - Show diffs
- `/tree [path]` - File tree

#### Step 4.2: Code Commands
Implement handlers in `src/commands/code.ts` (NEW):
- `/search <query>` - Search codebase
- `/references <symbol>` - Find references
- `/explain <file>` - Explain code
- `/refactor <file>` - Refactor
- `/test <file>` - Generate tests

#### Step 4.3: Git Commands
Implement handlers in `src/commands/git.ts` (NEW):
- `/git status` - Git status
- `/git diff [file]` - Git diff
- `/git commit <msg>` - Commit
- `/git branch` - Branches

#### Step 4.4: Obsidian Commands
Implement handlers in `src/commands/obsidian.ts` (NEW):
- `/obsidian status` - Vault status
- `/obsidian setup` - Setup integration
- `/obsidian open` - Open vault
- `/obsidian search <query>` - Search vault

#### Step 4.5: Mode/Rules Commands
Implement handlers in `src/commands/mode.ts` (NEW):
- `/mode <mode>` - Switch mode
- `/rules list` - List rules
- `/rules add <rule>` - Add rule
- `/rules show` - Show current rules

#### Step 4.6: Session Commands
Implement handlers in `src/commands/session.ts` (NEW):
- `/session save [name]` - Save session
- `/session load <id>` - Load session
- `/session list` - List sessions
- `/session export` - Export to bob-reports

### Phase 5: Testing & Polish

#### Step 5.1: Unit Tests
Create test files:
- `src/__tests__/commands.test.ts`
- `src/__tests__/components.test.ts`
- `src/__tests__/hooks.test.ts`

#### Step 5.2: Integration Tests
Test complete workflows:
- File editing with approval
- Git operations
- Obsidian integration
- Session management

#### Step 5.3: Performance Optimization
- Lazy load components
- Optimize re-renders
- Stream large outputs
- Cache API responses

#### Step 5.4: Error Handling
- Graceful degradation
- Clear error messages
- Recovery mechanisms
- Logging

## Migration Plan

### Step 1: Parallel Development
Keep both TUIs running:
- Old Python TUI: `./run_tui.sh`
- New TypeScript TUI: `cd tui-ts && npm run dev`

### Step 2: Feature Parity Testing
Test each feature in both:
- [ ] Basic chat
- [ ] Model switching
- [ ] File operations
- [ ] Code operations
- [ ] Git operations
- [ ] Obsidian integration

### Step 3: Deprecation
When TypeScript TUI is stable:
1. Rename `tui/` to `tui-python/` (archive)
2. Rename `tui-ts/` to `tui/`
3. Update all scripts and documentation
4. Update installation instructions

### Step 4: Cleanup
- Remove Python TUI dependencies from `requirements.txt`
- Update `README.md`
- Update `AGENTS.md`
- Archive old documentation

## Development Commands

```bash
# Development
npm run dev              # Run in development mode
npm run watch            # Watch mode (auto-rebuild)

# Building
npm run build            # Build TypeScript
npm run clean            # Clean build artifacts

# Testing
npm test                 # Run tests (when added)
npm run lint             # Lint code (when added)

# Installation
npm run install-global   # Install globally
./install-global.sh      # Alternative installation script
```

## Troubleshooting

### TypeScript Errors
- Run `npm install` to ensure all dependencies are installed
- Check `tsconfig.json` for correct settings
- Verify import paths use `.js` extension (ESM requirement)

### Runtime Errors
- Ensure backend is running: `python -m uvicorn backend.main:app --reload --port 8000`
- Check API endpoint URLs in `src/services/api.ts`
- Verify environment variables in `.env`

### Display Issues
- Terminal must support 256 colors
- Minimum terminal size: 80x24
- Use modern terminal emulator (iTerm2, Windows Terminal, etc.)

## Next Steps

1. **Install dependencies**: `cd tui-ts && npm install`
2. **Test current implementation**: `npm run dev`
3. **Implement command handlers**: Start with Phase 3
4. **Add backend endpoints**: Coordinate with backend team
5. **Test thoroughly**: Each feature as it's implemented
6. **Document changes**: Update this guide as you progress

## Resources

- [Ink Documentation](https://github.com/vadimdemedes/ink)
- [Claude Code CLI Commands](https://code.claude.com/docs/en/commands)
- [Claude CLI Reference](https://code.claude.com/docs/en/cli-reference)
- [Project Specification](../docs/ADVANCED_CODING_AGENT_TUI_SPEC.md)

---

*Last Updated: 2026-05-16*
*Status: Phase 1 - Core Infrastructure*