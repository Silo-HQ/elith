# Quick Start Guide - Elith TypeScript TUI

Get the new TypeScript TUI up and running in minutes.

## Prerequisites

- Node.js 18+ installed
- Backend running on port 8000

## Installation

### Option 1: Global Installation (Recommended)

Install globally to run `elith-tui` from anywhere:

```bash
cd tui-ts
./install-global.sh
```

After installation, run from any directory:
```bash
elith-tui
```

### Option 2: Local Installation

```bash
cd tui-ts
npm install
```

## Running

### Global Command (After Global Install)
```bash
elith-tui
```

### Development Mode
```bash
cd tui-ts
npm run dev
```

Or use the convenience script:
```bash
./run.sh
```

### Production Build
```bash
npm run build
npm start
```

## First Steps

1. **Start the backend** (in another terminal):
   ```bash
   python -m uvicorn backend.main:app --reload --port 8000
   ```

2. **Run the TUI**:
   ```bash
   cd tui-ts
   npm run dev
   ```

3. **Try these commands**:
   - `/help` - Show available commands
   - `/models` - List available AI models
   - `/model claude` - Switch to Claude
   - `Hello!` - Send a message to the AI

## Available Commands

| Command | Description |
|---------|-------------|
| `/help` | Show help message |
| `/models` | List available models |
| `/model <name>` | Switch to a different model |
| `/clear` | Clear chat history |
| `/repo <path>` | Set repository path |

## Keyboard Shortcuts

- `Ctrl+C` - Exit the application
- `Enter` - Submit message/command

## Troubleshooting

### "Backend not available"
Make sure the backend is running:
```bash
python -m uvicorn backend.main:app --reload --port 8000
```

### TypeScript errors
The TypeScript errors you see in the editor are expected before running `npm install`. They will be resolved once dependencies are installed.

### Module not found
Try reinstalling:
```bash
rm -rf node_modules package-lock.json
npm install
```

## What's Different from Python TUI?

1. **Same API** - Uses identical backend API
2. **Shared Code** - Types and API client shared with web frontend
3. **TypeScript** - Full type safety
4. **React** - Component-based architecture with Ink
5. **Modern** - npm ecosystem and tooling

## Next Steps

- Explore the code in `src/`
- Check out `README.md` for detailed documentation
- Read `TUI_TYPESCRIPT_MIGRATION.md` for migration details
- Add new features or screens

## Support

For issues or questions:
1. Check the main README.md
2. Review TUI_TYPESCRIPT_MIGRATION.md
3. Inspect backend logs
4. Check browser console (for API errors)

---

**Enjoy the new TypeScript TUI!** 🚀