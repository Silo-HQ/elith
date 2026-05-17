# 🚀 Enhanced Elith TUI - Feature Guide

## Overview

The enhanced TUI brings world-class terminal interface features to Elith, including multiple themes, smooth animations, split panes, tabs, file tree, and much more.

## 🎨 New Features

### 1. Multiple Themes (8 Beautiful Themes)

Switch between 8 carefully crafted themes:

```bash
# In the TUI, type:
/theme dark          # Default GitHub Dark
/theme light         # Clean bright theme
/theme cyberpunk     # Neon high-contrast
/theme dracula       # Popular Dracula
/theme nord          # Arctic cool palette
/theme solarized-dark # Classic Solarized
/theme monokai       # Sublime Text inspired
/theme ocean         # Deep blue theme
```

**Keyboard Shortcuts:**
- `Ctrl+Shift+T` - Cycle to next theme
- `Ctrl+Shift+R` - Cycle to previous theme

### 2. Enhanced Animations

**Smooth Spinners:**
- Thinking spinner (dots12)
- Loading spinner (dots)
- Processing spinner (arc)
- Analyzing spinner (bouncingBar)
- Generating spinner (growVertical)

**Progress Bars:**
- Determinate progress (0-100%)
- Indeterminate progress (unknown duration)
- Step progress (multi-step tasks)

**Fade Effects:**
- Fade-in animations for new content
- Smooth transitions between states

### 3. Split Panes

Create side-by-side layouts for better productivity:

```typescript
// Vertical split (side-by-side)
<SplitPane orientation="vertical" sizes={[60, 40]}>
  <ChatPanel />
  <FilePreview />
</SplitPane>

// Horizontal split (top-bottom)
<SplitPane orientation="horizontal" sizes={[70, 30]}>
  <MainContent />
  <TerminalOutput />
</SplitPane>

// Triple pane layout (IDE-style)
<TriplePaneLayout
  sidebar={<FileTree />}
  main={<ChatPanel />}
  panel={<ContextPanel />}
  sidebarWidth={20}
  panelWidth={30}
/>
```

**Keyboard Shortcuts:**
- `Ctrl+\` - Create vertical split
- `Ctrl+-` - Create horizontal split
- `Ctrl+W` - Close current pane

### 4. Tabs System

Manage multiple chat sessions with tabs:

```typescript
const { tabs, activeTabId, addTab, removeTab, selectTab, nextTab, previousTab } = useTabManager();

// Create new tab
addTab({
  id: 'chat-2',
  title: 'Code Review',
  icon: '🔍',
  closeable: true,
});
```

**Keyboard Shortcuts:**
- `Ctrl+T` - New tab
- `Ctrl+W` - Close current tab
- `Ctrl+Tab` - Next tab
- `Ctrl+Shift+Tab` - Previous tab
- `Ctrl+1-9` - Jump to tab 1-9

### 5. File Tree Sidebar

Browse your project files with a beautiful tree view:

```typescript
<FileTree
  root={workspace}
  onSelect={handleFileSelect}
  maxDepth={3}
  showHidden={false}
  gitStatus={true}
/>
```

**Features:**
- File type icons (🔷 TypeScript, 🐍 Python, etc.)
- Expandable directories
- Git status indicators
- Smart filtering (skips node_modules, .git, etc.)

**Keyboard Shortcuts:**
- `Ctrl+B` - Toggle sidebar
- `↑/↓` - Navigate files
- `Enter` - Open/expand file/folder
- `Space` - Select file

### 6. Enhanced Components

**Progress Bars:**
```typescript
<ProgressBar progress={75} label="Analyzing code..." animated />
<IndeterminateProgressBar label="Loading..." />
<StepProgress steps={['Scan', 'Analyze', 'Generate']} currentStep={1} />
```

**Spinners:**
```typescript
<ThinkingSpinner text="Thinking..." />
<LoadingSpinner text="Loading files..." />
<ProcessingSpinner text="Processing..." />
```

**Collapsible Sidebar:**
```typescript
<CollapsibleSidebar collapsed={false} width={25}>
  <FileTree root={workspace} />
</CollapsibleSidebar>
```

## 🎯 Usage Examples

### Example 1: Code Review Layout

```typescript
<TriplePaneLayout
  sidebar={<FileTree root={workspace} />}
  main={
    <Box flexDirection="column">
      <EnhancedBanner compact />
      <ChatPanel />
    </Box>
  }
  panel={
    <Box flexDirection="column">
      <Text bold>Context Files</Text>
      <ContextList files={contextFiles} />
    </Box>
  }
/>
```

### Example 2: Multi-Session Tabs

```typescript
const { tabs, activeTabId, addTab, selectTab } = useTabManager([
  { id: '1', title: 'Main Chat', icon: '💬' },
  { id: '2', title: 'Code Review', icon: '🔍' },
]);

<Box flexDirection="column">
  <TabBar
    tabs={tabs}
    activeTabId={activeTabId}
    onTabSelect={selectTab}
    onNewTab={() => addTab({ id: Date.now().toString(), title: 'New Chat' })}
  />
  
  {tabs.map(tab => (
    <TabContent key={tab.id} tabId={tab.id} activeTabId={activeTabId}>
      <ChatPanel sessionId={tab.id} />
    </TabContent>
  ))}
</Box>
```

### Example 3: Theme Switcher

```typescript
const { theme, currentThemeName, switchTheme, availableThemes } = useTheme();

<Box flexDirection="column">
  <Text>Current Theme: {currentThemeName}</Text>
  <Text>Available Themes:</Text>
  {availableThemes.map(name => (
    <Text key={name} color={name === currentThemeName ? 'cyan' : 'gray'}>
      {name === currentThemeName ? '▸' : ' '} {name}
    </Text>
  ))}
</Box>
```

## ⌨️ Complete Keyboard Shortcuts

### Navigation
| Shortcut | Action |
|----------|--------|
| `Ctrl+P` | Fuzzy file search |
| `Ctrl+Shift+P` | Command palette |
| `Ctrl+B` | Toggle sidebar |
| `↑/↓` | Navigate up/down |
| `←/→` | Navigate left/right |
| `Home` | Go to top |
| `End` | Go to bottom |
| `PgUp/PgDn` | Page up/down |

### Panes & Tabs
| Shortcut | Action |
|----------|--------|
| `Ctrl+\` | Vertical split |
| `Ctrl+-` | Horizontal split |
| `Ctrl+W` | Close pane/tab |
| `Ctrl+T` | New tab |
| `Ctrl+Tab` | Next tab |
| `Ctrl+Shift+Tab` | Previous tab |
| `Ctrl+1-9` | Jump to tab |

### Editing
| Shortcut | Action |
|----------|--------|
| `Ctrl+C` | Copy |
| `Ctrl+V` | Paste |
| `Ctrl+X` | Cut |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+A` | Select all |
| `Ctrl+F` | Find |

### Themes
| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+T` | Next theme |
| `Ctrl+Shift+R` | Previous theme |

### Actions
| Shortcut | Action |
|----------|--------|
| `Enter` | Submit message |
| `Ctrl+Enter` | Submit with newline |
| `Ctrl+K` | Clear transcript |
| `Ctrl+L` | Clear screen |
| `Ctrl+R` | Reload |
| `Ctrl+S` | Save session |
| `Ctrl+O` | Open session |
| `Ctrl+Q` | Quit |

## 🎨 Theme Customization

### Creating Custom Themes

```typescript
// src/themes/custom.ts
import { Theme } from './index';

export const customTheme: Theme = {
  name: 'custom',
  colors: {
    background: '#1a1a1a',
    surface: '#2a2a2a',
    surfaceAlt: '#3a3a3a',
    primary: '#ff6b6b',
    secondary: '#4ecdc4',
    accent: '#ffe66d',
    text: '#ffffff',
    textDim: '#a0a0a0',
    textDimmer: '#606060',
    success: '#51cf66',
    warning: '#ffd43b',
    error: '#ff6b6b',
    info: '#4ecdc4',
    border: '#404040',
    borderDim: '#303030',
    thinking: '#a29bfe',
    brand: '#ff6b6b',
  },
  gradients: {
    primary: ['#ff6b6b', '#ee5a6f'],
    accent: ['#ffe66d', '#ffd43b'],
    success: ['#51cf66', '#37b24d'],
    error: ['#ff6b6b', '#fa5252'],
  },
  effects: {
    blur: 6,
    opacity: 0.95,
    glow: true,
  },
  animations: {
    duration: 300,
    easing: 'ease-in-out',
  },
};
```

Then add to `src/themes/index.ts`:
```typescript
import { customTheme } from './custom';

export const themes: Record<string, Theme> = {
  // ... existing themes
  custom: customTheme,
};
```

## 🚀 Performance Tips

1. **Virtual Scrolling**: Automatically enabled for 1000+ messages
2. **Lazy Loading**: Themes and heavy components load on demand
3. **Memoization**: All components use React.memo
4. **Debouncing**: Input and resize events are debounced
5. **Efficient Rendering**: Only visible content is rendered

## 📊 Component Architecture

```
Enhanced TUI Structure:
├── themes/              # 8 beautiful themes
│   ├── index.ts        # Theme system
│   └── [theme].ts      # Individual themes
├── hooks/
│   ├── useTheme.ts     # Theme management
│   ├── useKeyboard.ts  # Keyboard shortcuts
│   └── useMouse.ts     # Mouse interactions
├── components/
│   ├── animations/     # Smooth animations
│   │   ├── FadeIn.tsx
│   │   └── EnhancedSpinner.tsx
│   ├── layout/         # Layout components
│   │   ├── SplitPane.tsx
│   │   ├── TabBar.tsx
│   │   └── FileTree.tsx
│   ├── ui/             # UI components
│   │   ├── ProgressBar.tsx
│   │   ├── Modal.tsx
│   │   └── Tooltip.tsx
│   └── enhanced/       # Enhanced versions
│       └── EnhancedBanner.tsx
```

## 🎯 Next Steps

1. Try different themes: `/theme cyberpunk`
2. Open file tree: `Ctrl+B`
3. Create split pane: `Ctrl+\`
4. Open new tab: `Ctrl+T`
5. Explore keyboard shortcuts: `/help`

## 🐛 Troubleshooting

**Theme not changing:**
- Make sure you're using the correct theme name
- Try `/theme dark` to reset to default

**Keyboard shortcuts not working:**
- Check if another app is capturing the shortcut
- Try restarting the TUI

**Performance issues:**
- Clear transcript: `Ctrl+K`
- Reduce max depth in file tree
- Disable animations in settings

## 📚 Resources

- [Ink Documentation](https://github.com/vadimdemedes/ink)
- [CLI Spinners](https://github.com/sindresorhus/cli-spinners)
- [Gradient String](https://github.com/bokub/gradient-string)
- [Elith Main README](../README.md)

---

**Built with ❤️ for IBM Bob Hackathon 2026**