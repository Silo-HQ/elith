# Elith TypeScript TUI

A modern Terminal User Interface for Elith built with TypeScript, React, and Ink. This replaces the Python/Textual implementation with a TypeScript-based solution that shares code with the web frontend.

## Features

- **TypeScript + React**: Built with TypeScript and React using Ink for terminal rendering
- **Shared Code**: Uses the same API client and types as the web frontend
- **Modern Architecture**: Clean component-based architecture with hooks
- **Real-time Streaming**: Server-Sent Events for live AI responses
- **Command System**: Slash commands for quick actions
- **Model Switching**: Easy switching between AI models
- **Clean Design**: Purple accent theme matching Elith brand

## Architecture

```
tui-ts/
├── src/
│   ├── components/          # React components
│   │   ├── StatusBar.tsx    # Bottom status bar
│   │   ├── ChatInput.tsx    # Input component
│   │   └── MessagesPanel.tsx # Message display
│   ├── services/            # API services
│   │   └── api.ts           # Backend API client (shared with frontend)
│   ├── types/               # TypeScript types
│   │   └── api.ts           # API types (shared with frontend)
│   ├── theme.ts             # Theme configuration
│   ├── App.tsx              # Main app component
│   └── index.tsx            # Entry point
├── package.json
├── tsconfig.json
└── run.sh                   # Run script
```

## Installation

### Local Installation

```bash
cd tui-ts
npm install
```

### Global Installation (Recommended)

Install globally to access `elith-tui` from anywhere:

```bash
cd tui-ts
./install-global.sh
```

After installation, you can run `elith-tui` from any directory:

```bash
elith-tui
```

To uninstall:

```bash
npm unlink -g elith-tui
```

## Usage

### Global Command (After Global Install)

```bash
elith-tui
```

### Development Mode

```bash
npm run dev
# or
./run.sh
```

### Build

```bash
npm run build
```

### Run Built Version

```bash
npm start
```

## Commands

The TUI supports the following slash commands:

- `/help` - Show help message
- `/models` - List available models
- `/model <name>` - Switch to a different model
- `/clear` - Clear chat history
- `/repo <path>` - Set repository path

## Keyboard Shortcuts

- `Ctrl+C` - Exit the application
- `Enter` - Submit message/command

## Code Sharing with Frontend

The TUI shares the following with the web frontend:

### Shared Types (`src/types/api.ts`)
- `ScanRequest`, `ScanResponse`
- `ExecuteRequest`, `ExecuteResponse`
- `StreamEvent`, `ResultsResponse`
- `ModelsResponse`, `TasksResponse`
- `ApiError`

### Shared API Client (`src/services/api.ts`)
- `api.scan()` - Scan repository
- `api.execute()` - Execute operations
- `api.streamSession()` - Stream responses
- `api.getResults()` - Get session results
- `api.getModels()` - Get available models
- `api.getTasks()` - Get available tasks

## Benefits Over Python TUI

1. **Code Reuse**: Shares types and API client with frontend
2. **Type Safety**: Full TypeScript type checking
3. **Modern Stack**: React + Ink ecosystem
4. **Better Performance**: Node.js runtime
5. **Easier Maintenance**: Single language across frontend and TUI
6. **Rich Ecosystem**: Access to npm packages

## Development

### Adding New Components

Create new components in `src/components/`:

```tsx
import React from 'react';
import { Box, Text } from 'ink';

export const MyComponent: React.FC = () => {
  return (
    <Box>
      <Text>Hello from MyComponent</Text>
    </Box>
  );
};
```

### Adding New Commands

Add command handlers in `App.tsx`:

```tsx
const handleCommand = async (command: string) => {
  if (command === '/mycommand') {
    // Handle your command
    addMessage('system', 'Command executed', 'elith');
  }
};
```

## Dependencies

### Core
- `ink` - React for CLIs
- `react` - React library
- `chalk` - Terminal colors
- `node-fetch` - HTTP client
- `eventsource` - SSE client

### UI Components
- `ink-text-input` - Text input component
- `ink-select-input` - Select input component
- `ink-spinner` - Loading spinner
- `ink-box` - Box component

### Development
- `typescript` - TypeScript compiler
- `tsx` - TypeScript execution
- `@types/*` - Type definitions

## Backend Integration

The TUI connects to the Elith backend at `http://localhost:8000/api`. Make sure the backend is running:

```bash
# In the project root
python -m uvicorn backend.main:app --reload --port 8000
```

## Troubleshooting

### Backend Connection Issues

If you see "Backend not available" messages:
1. Ensure the backend is running on port 8000
2. Check that the API_BASE URL in `src/services/api.ts` is correct
3. Verify network connectivity

### TypeScript Errors

Run type checking:
```bash
npm run build
```

### Module Not Found

Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Future Enhancements

- [ ] Add Welcome screen with ASCII art
- [ ] Add Workspace screen with context panel
- [ ] Add Execution screen with progress tracking
- [ ] Add Proposals screen for architecture proposals
- [ ] Add file tree navigation
- [ ] Add syntax highlighting for code blocks
- [ ] Add keyboard shortcuts panel
- [ ] Add session history
- [ ] Add configuration file support

## Contributing

When adding features:
1. Keep components small and focused
2. Share types with frontend when possible
3. Follow the existing code style
4. Add TypeScript types for all props
5. Test with the backend running

## License

Part of the Elith project.