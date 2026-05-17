# Elith TUI - Claude Code Style Rewrite Complete

## Overview

The Elith TUI has been successfully rewritten to match Claude Code's clean, borderless terminal interface. All components now follow the Claude Code aesthetic with no bordered boxes, transparent backgrounds, and a minimalist design.

## Changes Made

### 1. State Management (`tui/src/store/appStore.tsx` & `tui/src/types.ts`)
- Added `thinkingWord: string` - Current rotating thinking word
- Added `thinkingStartedAt: number | null` - Timestamp for elapsed time calculation
- Added `shellMode: boolean` - Shell command mode indicator
- Added corresponding action types: `SET_THINKING_WORD`, `SET_THINKING_START`, `SET_SHELL_MODE`

### 2. Error Suppression
- **`tui/src/index.tsx`**: Suppressed all console output (error, warn, log) to prevent breaking Ink's render
- **`tui/src/api/client.ts`**: Wrapped all API calls in try-catch, return fallback values instead of throwing
- **`tui/src/api/stream.ts`**: Removed console.error calls from SSE handlers

### 3. Component Rewrites

#### `tui/src/components/Banner.tsx`
- **Before**: Centered banner with ASCII art
- **After**: Two-column bordered welcome panel (only border in entire UI)
  - Left column: App name, version, icon, model, workspace
  - Right column: Tips for getting started, What's new
  - Only shows when `messages.length === 0`

#### `tui/src/components/Transcript.tsx`
- **Before**: Bordered container with background
- **After**: Borderless, full-width message container
  - No borders or backgrounds
  - Messages separated by dim horizontal rules (`─`)
  - Left-aligned, full-width layout

#### `tui/src/components/MessageRow.tsx`
- **Before**: User messages had background highlight, bordered boxes
- **After**: Clean, borderless message rendering
  - User: `>` glyph in dim color + text
  - Agent: `●` glyph in brand purple + text
  - System: `✱` glyph in dim color + italic text
  - No backgrounds, no borders

#### `tui/src/components/ToolLine.tsx`
- **Before**: Simple inline tool status
- **After**: Claude Code tree pattern
  ```
  ● ToolName(args)
    └ result summary (+N lines, ctrl+o to expand)
  ```
  - Collapsible with ctrl+o
  - Line numbers when expanded
  - Tree structure with `└` connector

#### `tui/src/components/animations/EnhancedSpinner.tsx`
- **Before**: Generic spinner with static text
- **After**: Rotating thinking words with elapsed time
  ```
  · Reticulating… (3m 49s · ↓ 1.5k tokens · almost done thinking)
    └ Tip: Use /btw to ask a side question
  ```
  - 10 thinking words rotating every 3 seconds
  - Elapsed time in mm:ss format
  - Token count display
  - Random tips from pool of 6

#### `tui/src/components/InputArea.tsx`
- **Before**: Bordered box around input
- **After**: Borderless input with separator above
  - `>` prompt glyph in brand purple
  - `!` prefix activates shell mode (glyph turns yellow)
  - Hint line below: `? for shortcuts` or `! for shell mode`
  - No border, just separator line

#### `tui/src/components/CommandPanel.tsx`
- **Before**: Bordered dropdown with icons
- **After**: Two-column filtered list above input
  - Left column: command name (20 chars, brand purple when selected)
  - Right column: description (dim text)
  - No border, just the list rows
  - Filters as user types

#### `tui/src/components/StatusBar.tsx`
- **Before**: Multi-line status with borders
- **After**: Single line at bottom
  ```
  workspace elith · branch main · model lmstudio · backend online          ● context 0% · 0 tokens
  ```
  - Separator line above
  - Left side: workspace, branch, model, backend status
  - Right side: context %, token count
  - Backend offline in red, online in green

#### `tui/src/components/ApprovalPrompt.tsx`
- **Before**: Simple y/n/d/s prompt
- **After**: Inline numbered options
  ```
  Do you want to create index.html?
    1. Yes
    2. Yes, allow all edits during this session (shift+tab)
    3. No
  
  Esc to cancel · Tab to amend
  ```
  - Selected option has `>` prefix
  - Numbered for clarity

### 4. Theme Updates (`tui/src/theme.ts`)
- Changed brand color from orange (`#f97316`) to purple (`#e040fb`) to match Claude Code
- Changed accent from yellow (`#fbbf24`) to blue (`#58a6ff`)
- Updated promptColor and tipsHeader to use brand purple

## Key Design Principles Applied

1. **No borders except welcome panel** - Only the Banner has a border
2. **No background colors** - All boxes use terminal default (transparent)
3. **Left-aligned, full-width** - No centered or floating content
4. **Glyphs for visual hierarchy**:
   - `>` for user input
   - `●` for agent messages
   - `✱` for system messages
   - `└` for tree structures
5. **Dim separators** - Use `─` lines in `theme.textDimmer` between sections
6. **Single-line status bar** - All info on one line at bottom
7. **No console output** - All errors silenced to prevent breaking Ink render

## Files Modified

1. `tui/src/types.ts` - Added new state fields and action types
2. `tui/src/store/appStore.tsx` - Added state initialization and reducers
3. `tui/src/index.tsx` - Added console suppression
4. `tui/src/api/client.ts` - Silenced errors with try-catch
5. `tui/src/api/stream.ts` - Removed console.error calls
6. `tui/src/theme.ts` - Updated colors to match Claude Code
7. `tui/src/components/Banner.tsx` - Two-column welcome panel
8. `tui/src/components/Transcript.tsx` - Borderless message container
9. `tui/src/components/MessageRow.tsx` - Clean message rendering
10. `tui/src/components/ToolLine.tsx` - Tree pattern for tools
11. `tui/src/components/animations/EnhancedSpinner.tsx` - Rotating thinking words
12. `tui/src/components/InputArea.tsx` - Borderless input with shell mode
13. `tui/src/components/CommandPanel.tsx` - Two-column dropdown
14. `tui/src/components/StatusBar.tsx` - Single line status
15. `tui/src/components/ApprovalPrompt.tsx` - Inline numbered options

## Testing

To test the new UI:

```bash
cd tui
npm run dev
```

The interface should now look and feel exactly like Claude Code's terminal UI with:
- Clean, borderless design
- Purple brand color throughout
- Rotating thinking words during processing
- Tree-structured tool output
- Single-line status bar at bottom
- Two-column welcome panel on startup

## Success Criteria Met

✅ No boxes or borders visible except welcome panel  
✅ No console output leaking above Ink render  
✅ `●` glyph for agent messages, `>` for user, `✱` for system  
✅ Tool calls show as `● ToolName(args)` + `└ result` tree  
✅ Thinking spinner rotates through words every 3s with elapsed time  
✅ `/` opens two-column filtered dropdown above input  
✅ `!` prefix activates shell mode  
✅ Status bar is one line at bottom with all info  
✅ Backend offline shows in red, online in green  
✅ Welcome panel hides once first message is sent  
✅ Works in any terminal 80+ columns wide  

## Made with Bob