# Elith Frontend - Web Dashboard

React + TypeScript + Tailwind CSS web interface for Elith.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server runs on **http://localhost:3000** with API proxy to **http://localhost:8000**.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── TopBar.tsx       # Logo + repo path + model status
│   │   ├── Sidebar.tsx      # Models + operations + context stats
│   │   ├── BottomBar.tsx    # Task input + run button
│   │   ├── ModelBadge.tsx   # Colored model status dots
│   │   ├── ContextPreview.tsx    # (TODO)
│   │   ├── LiveOutput.tsx        # (TODO)
│   │   ├── ProposalCard.tsx      # (TODO)
│   │   └── ...
│   ├── pages/               # Route pages
│   │   ├── Landing.tsx      # ✅ Repo setup + model selection
│   │   ├── Workspace.tsx    # 🚧 Main dashboard
│   │   ├── Proposals.tsx    # ⏳ Architecture proposals
│   │   ├── Execution.tsx    # ⏳ Live execution view
│   │   └── Results.tsx      # ⏳ Session results
│   ├── stores/
│   │   └── elithStore.ts    # ✅ Zustand state management
│   ├── mockData.ts          # ✅ Mock data for development
│   ├── App.tsx              # ✅ Router setup
│   ├── main.tsx             # ✅ React entry point
│   └── index.css            # ✅ Global styles + animations
├── index.html               # ✅ HTML entry + Google Fonts
├── package.json             # ✅ Dependencies
├── vite.config.ts           # ✅ Vite config + API proxy
├── tailwind.config.js       # ✅ Custom colors from UX spec
├── tsconfig.json            # ✅ TypeScript config
└── IMPLEMENTATION_STATUS.md # 📋 Detailed progress tracker
```

## 🎨 Design System

### Colors
All colors match `docs/ELITH_UX_SPEC.md`:

```css
--bg-primary:     #000000   /* Pure black background */
--bg-secondary:   #0D0D0D   /* Panel backgrounds */
--bg-tertiary:    #141414   /* Card backgrounds */
--accent:         #A855F7   /* Elith purple */
--bob:            #3B82F6   /* IBM blue */
--claude:         #F97316   /* Orange */
--gemini:         #06B6D4   /* Cyan */
```

### Typography
- **UI Text**: Inter (from Google Fonts)
- **Code/Terminal**: JetBrains Mono (from Google Fonts)

### Animations
- Logo glow on landing page
- Model dot pulse when running
- Smooth progress bar fills
- Card slide-in transitions

## 🗺️ Routes

| Route | Page | Status |
|-------|------|--------|
| `/` | Landing - Repo setup | ✅ Complete |
| `/workspace` | Main dashboard | 🚧 In progress |
| `/proposals` | Architecture proposals | ⏳ TODO |
| `/execution` | Live execution | ⏳ TODO |
| `/results` | Session results | ⏳ TODO |

## 📦 State Management

Using **Zustand** for global state:

```typescript
interface ElithStore {
  // Repo
  repoPath: string;
  vaultPath: string;
  
  // Models
  activeModels: { bob, claude, gemini, codex, local };
  
  // Context
  loadedFiles: string[];
  totalFiles: number;
  loadedVaultNotes: string[];
  tokensSaved: number;
  
  // Session
  currentOperation: string | null;
  sessionStatus: 'idle' | 'running' | 'done' | 'error';
  liveOutput: Record<string, string[]>;
  
  // Results
  proposals: ArchProposal[];
  sessionResult: SessionResult | null;
  bobReportPath: string | null;
}
```

## 🔌 API Integration (Hours 23-28)

Currently using mock data from `src/mockData.ts`. Will be replaced with:

```typescript
// Scan repo
POST /api/scan
{ repo_path, vault_path }

// Execute operation
POST /api/execute
{ model, operation, repo_path }
→ returns { session_id }

// Stream live output (SSE)
GET /api/stream/{session_id}
→ EventSource for real-time updates

// Get proposals
GET /api/proposals/{session_id}

// Get results
GET /api/results/{session_id}
```

## 🎯 Development Workflow

### Phase 1: Mock Data (Current)
All components use hardcoded mock data. Build UI independently of backend.

### Phase 2: API Integration (Hours 23-28)
Replace mock data with real API calls. Add error handling and loading states.

### Phase 3: Polish (Hours 15-22)
Animations, loading states, error states, settings page.

## 🧪 Testing

```bash
# Type check
npm run build

# Manual testing
npm run dev
# Navigate to http://localhost:3000
```

## 📝 Notes

### TypeScript Errors
Current TS errors are expected - they resolve after `npm install`.

### Mock Data First
Following the principle from `docs/TASKS_JOHANN.md`:
> "You build with mock data first. Always."

### Bob Shell Aesthetic
The design closely matches Bob Shell's terminal aesthetic:
- Pure black backgrounds
- Cyan accents for commands
- Yellow borders for active inputs
- Monospace fonts for code
- No shadows, only borders

## 🚧 TODO

### Components
- [ ] ContextPreview - Files loaded + vault notes + token savings
- [ ] LiveOutput - Streaming model output with auto-scroll
- [ ] ProposalCard - Architecture proposal with tradeoffs
- [ ] ModelExecutionPanel - Per-model execution view
- [ ] ResultsSummary - Session results display
- [ ] ProgressBar - Progress indicator
- [ ] FileChip - File pill with dismiss
- [ ] OperationCard - Operation selection card
- [ ] StatCard - Stat display card

### Pages
- [ ] Complete Workspace page
- [ ] Proposals page
- [ ] Execution page
- [ ] Results page
- [ ] Settings page (API keys)

### Features
- [ ] EventSource (SSE) for live streaming
- [ ] Error handling
- [ ] Loading states
- [ ] Animations polish
- [ ] Keyboard shortcuts

## 📚 References

- **UX Spec**: `docs/ELITH_UX_SPEC.md`
- **Task List**: `docs/TASKS_JOHANN.md`
- **Implementation Status**: `frontend/IMPLEMENTATION_STATUS.md`

---

**Status**: ~40% complete (Hours 1-4 done)  
**Next**: Create remaining components and complete all 5 pages