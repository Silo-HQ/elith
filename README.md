# Elith — Universal Repo-Aware AI Agent Framework

**IBM Bob Hackathon 2026**

Elith gives every AI model — Claude, Gemini, GPT, local LLMs — the same repo-awareness IBM Bob has natively, through an agent skill layer. Any model. Bob-level. Your choice.

## What is Elith?

IBM Bob is powerful because it lives inside your repository — reading files, writing code, running tests natively. But most developers also use Claude, Gemini, GPT, or local LLMs, which are repo-blind by default.

**Elith fixes this** with a skill layer of 12 agent tools injected into any model via tool calling:
- **File Operations**: read_file, write_file, list_files
- **Code Analysis**: search_code, find_references, explain_function, analyze_dependencies
- **Git Operations**: git_diff, git_commit
- **Testing**: run_tests
- **Package Management**: install_package
- **Logging**: read_logs

## Key Features

✅ **Universal Model Support**: Works with Claude, Gemini, GPT, LMStudio, and any OpenAI-compatible API  
✅ **Smart Context Engine**: Loads only 4-6 relevant files from 100+ (90%+ token reduction)  
✅ **Obsidian Integration**: Project memory without vector DB overhead  
✅ **Novel Architecture Generator**: Repo-specific proposals, not generic textbook answers  
✅ **Dual Interface**: Terminal UI (Textual) + Web Dashboard (React)  
✅ **Real-time Streaming**: SSE for live output in both interfaces

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+ (for frontend)
- Git

### 1. Clone and Setup

```bash
git clone https://github.com/yourusername/elith.git
cd elith

# Option 1: Global installation (recommended)
chmod +x global-install.sh
./global-install.sh

# Option 2: Local development setup
chmod +x install.sh
./install.sh
```

**Global Installation** installs both the TypeScript TUI and Python CLI wrapper globally, allowing you to run `elith` or `elith-tui` from anywhere.

### 2. Configure API Keys

Copy `.env.example` to `.env` and add your API keys:

```bash
cp .env.example .env
```

Edit `.env`:
```env
# At least one provider required
ANTHROPIC_API_KEY=sk-ant-...           # For Claude
GOOGLE_API_KEY=AIza...                 # For Gemini
OPENAI_API_KEY=sk-...                  # For GPT-4
LMSTUDIO_BASE_URL=http://localhost:1234/v1  # For local LLMs
LMSTUDIO_API_KEY=lm-studio             # LMStudio API key
```

### 3. Run Backend

```bash
source venv/bin/activate
python -m uvicorn backend.main:app --reload --port 8000
```

Backend runs at: `http://localhost:8000`

### 4. Run Terminal UI (Recommended)

**If installed globally:**
```bash
elith              # Launch TUI via Python CLI wrapper
# or
elith-tui          # Launch TUI directly
```

**If running locally:**
```bash
# TypeScript TUI (production-ready)
cd tui
npm install
npm run dev

# Or Python TUI (legacy, archived)
source venv/bin/activate
python -m tui-python-legacy.app
```

The TypeScript TUI (`tui/`) features:
- GitHub Dark theme with purple accents
- Gemini CLI / Claude Code CLI aesthetic
- Collapsible thinking blocks (Tab/Ctrl+I navigation)
- Command palette (/, @, !, # triggers)
- Real-time activity logs with animated spinners
- Fixed layout with no shifting

### 5. Run Web Dashboard (Optional)

```bash
# In a new terminal
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

## Usage

### Terminal UI (TUI)

1. Launch TUI: `python -m tui.app`
2. Select workspace directory
3. Choose operation: Explain, Architect, Test Gen, or Refactor
4. Select AI model (only configured models shown)
5. Watch real-time output with context preview

### Web Dashboard

1. Open `http://localhost:5173`
2. Click "Select Workspace" and choose your repo
3. Pick operation and model
4. View live streaming output with file context

### CLI (Advanced)

```bash
# Scan repository
python cli.py scan /path/to/repo

# Execute operation
python cli.py execute /path/to/repo --model claude --operation architect

# Stream output
python cli.py stream <session_id>
```

## Architecture

```
elith/
├── backend/              # FastAPI server
│   ├── context_engine/   # Smart file selection
│   ├── skills/           # 12 repo-aware tools
│   ├── providers/        # AI model integrations
│   ├── operations/       # explain, architect, test-gen, refactor
│   └── routes/           # API endpoints
├── tui/                  # TypeScript TUI (Ink 4, production-ready)
├── tui-python-legacy/    # Python TUI (Textual, archived)
├── frontend/             # React web dashboard
└── obsidian-template/    # Project memory vault
```

## API Endpoints

```
POST   /api/scan                    # Scan repository
POST   /api/execute                 # Start operation
GET    /api/stream/{session_id}    # SSE stream
GET    /api/models                  # Available models
GET    /api/results/{session_id}   # Session results
```

## Operations

### 1. Explain
Analyzes codebase architecture and explains it in plain language.

### 2. Architect (★ Key Feature)
Generates **repo-specific** architecture proposals:
- References actual files and line numbers
- Explains why standard solutions don't fit
- Provides concrete migration steps
- Shows tradeoffs clearly

### 3. Test Gen
Finds source files without test pairs and generates tests matching existing style.

### 4. Refactor
Suggests and applies code improvements while maintaining functionality.

## Configuration

### Adding a New Model

1. Get API key from provider
2. Add to `.env`:
   ```env
   ANTHROPIC_API_KEY=your-key-here
   ```
3. Restart backend
4. Model appears in `/api/models` automatically

### Obsidian Vault (Optional)

Create project memory notes in `obsidian-template/`:
```
obsidian-template/
├── architecture/     # System design notes
├── standards/        # Coding standards
└── tasks/           # Project tasks
```

Notes are automatically included in context when relevant.

## Development

### Running Tests

```bash
source venv/bin/activate
pytest
```

### Code Style

```bash
# Format code
black backend/ tui/

# Type checking
mypy backend/
```

## Deployment

### Backend (Railway)

1. Create Railway project
2. Add environment variables from `.env`
3. Deploy:
   ```bash
   railway up
   ```

### Frontend (Vercel)

```bash
cd frontend
vercel --prod
```

Update `frontend/src/config.ts` with Railway backend URL.

## Demo

**Demo Repository**: [FastAPI](https://github.com/tiangolo/fastapi) (50-200 files, real architectural patterns)

**Workflow**:
1. Scan FastAPI repo → 142 files found
2. Run "Architect" operation → Context engine selects 6 key files (96% reduction)
3. Claude with Elith skills → Generates repo-specific proposals
4. Compare with Bob native → Same quality output
5. Session report auto-exported to `bob-reports/`

## Bob Integration

All sessions are automatically logged to `bob-reports/` for hackathon judging:
```
bob-reports/
├── session_20260516_091431_28eb436f.md
├── session_20260516_102347_a9f2b8c1.md
└── ...
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.10+ + FastAPI |
| TUI | Textual (Python) |
| Frontend | React + TypeScript + Tailwind |
| Memory | Obsidian (markdown) |
| Models | Claude, Gemini, GPT-4, LMStudio |

## Team

- **Team Lead**: Architecture, backend, integration
- **Basil Joy**: AI/ML core (skills + providers)
- **Johann**: Frontend (React) + TUI (Textual)

## License

MIT License - See LICENSE file for details

## Submission

**IBM Bob Hackathon 2026**  
**Category**: Best Use of IBM Bob  
**GitHub**: https://github.com/yourusername/elith  
**Demo**: https://elith.vercel.app

---

*Elith: Bob sets the standard. We bring everyone up to it.*
