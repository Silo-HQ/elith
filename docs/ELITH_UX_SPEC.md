# Elith — Web Dashboard UX Specification
**Built with:** React + TypeScript + Tailwind CSS  
**Owner:** Johann (UI/UX)  
**Purpose:** Visual interface for the web dashboard — demo-ready, judge-facing

---

## Philosophy

The web dashboard is what judges see in the demo video.  
It must look like a **real product**, not a hackathon project.  
Clean. Black and white. Purple accents. No clutter. Every element earns its place.

---

## Design System

### Colors

```css
--bg-primary:     #000000;   /* pure black background */
--bg-secondary:   #0D0D0D;   /* panel backgrounds */
--bg-tertiary:    #141414;   /* card backgrounds */
--bg-hover:       #1A1A1A;   /* hover states */
--border:         #222222;   /* all borders */
--border-light:   #333333;   /* lighter borders */

--text-primary:   #FFFFFF;   /* main text */
--text-secondary: #888888;   /* secondary text */
--text-muted:     #444444;   /* muted text */

--accent:         #A855F7;   /* Elith purple */
--accent-dim:     #7C3AED;   /* darker purple */
--accent-glow:    rgba(168, 85, 247, 0.15); /* purple glow */

/* Model colors */
--bob:            #3B82F6;   /* IBM blue */
--claude:         #F97316;   /* orange */
--gemini:         #06B6D4;   /* cyan */
--codex:          #84CC16;   /* lime */
--local:          #8B5CF6;   /* violet */

/* Status colors */
--success:        #22C55E;
--warning:        #EAB308;
--error:          #EF4444;
--running:        #A855F7;   /* purple pulse */
```

### Typography

```css
--font-mono:   'JetBrains Mono', 'Fira Code', monospace; /* terminal text */
--font-sans:   'Inter', system-ui, sans-serif;           /* UI text */

--text-xs:    0.75rem;
--text-sm:    0.875rem;
--text-base:  1rem;
--text-lg:    1.125rem;
--text-xl:    1.25rem;
--text-2xl:   1.5rem;
```

### Spacing & Radius

```css
--radius-sm:  4px;
--radius-md:  8px;
--radius-lg:  12px;
--panel-gap:  16px;
--sidebar-w:  260px;
```

---

## Layout — Main Dashboard

```
┌──────────────────────────────────────────────────────────────────┐
│  TOPBAR (56px)                                                    │
│  [◆ Elith]  repo: ~/projects/myapp     Bob ● Claude ● Gemini ○   │
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                    │
│  SIDEBAR     │            MAIN CONTENT AREA                      │
│  (260px)     │            (flexible)                             │
│              │                                                    │
│  Models      │   (Switches between panels below)                 │
│  Operations  │                                                    │
│  Context     │                                                    │
│  Stats       │                                                    │
│              │                                                    │
├──────────────┴──────────────────────────────────────────────────┤
│  BOTTOM BAR (64px)                                               │
│  [ Task input...                          ] [Run] [Mode ▾]       │
└──────────────────────────────────────────────────────────────────┘
```

---

## Pages / Views

---

### Page 1 — Landing / Repo Setup

Clean centered layout. First thing user sees.

**Elements:**
- Elith logo (◆ symbol + wordmark) centered
- Tagline: *"Load less. Think deeper. Ship better."*
- Repo path input field
- Obsidian vault path input (optional, with toggle)
- Model selector — toggle each model on/off (Bob always on)
- "Start Session" button (purple, full width)
- Recent sessions list (last 5, clickable)

**Design notes:**
- Logo has a subtle purple glow animation on load
- Input fields: dark background, white text, purple focus ring
- Model toggles: colored dot per model, greyed out when off
- "Start Session" button pulses once on hover

---

### Page 2 — Main Workspace

The core dashboard. Four panels in a grid.

```
┌──────────────┬──────────────────────────┬─────────────────────┐
│              │                          │                      │
│  SIDEBAR     │   CONTEXT PREVIEW        │   LIVE OUTPUT        │
│              │                          │                      │
│  Models      │   Files loaded (6/312)   │   Bob  ──────────   │
│  ● Bob       │   ─────────────────────  │   > Analyzing...    │
│  ● Claude    │   auth/views.py     →    │   > Found pattern   │
│  ○ Gemini    │   auth/models.py    →    │                      │
│  ○ Codex     │   config/settings   →    │   Claude ─────────  │
│  ○ Local     │   requirements.txt  →    │   > Reasoning...    │
│              │   README.md         →    │                      │
│  Operations  │                          │   ▓▓▓▓▓░░░  60%     │
│  ──────────  │   Vault Notes (3)        │                      │
│  Explain     │   ─────────────────────  │                      │
│  Architect ◀ │   auth-decisions.md →    │                      │
│  Refactor    │   tech-debt.md      →    │                      │
│  Test Gen    │   coding-standards  →    │                      │
│  Document    │                          │                      │
│  Risk Scan   │   Token savings:         │                      │
│  Harden      │   ~4,200 tokens saved    │                      │
│  Review      │   vs full repo load      │                      │
│              │                          │                      │
└──────────────┴──────────────────────────┴─────────────────────┘
│  > architect the auth module                    [Run] [Parallel▾]│
└──────────────────────────────────────────────────────────────────┘
```

---

### Page 3 — Architecture Proposals

Full-width cards showing Bob + Claude's novel proposals.

**Layout:**
- Page title: "Architecture Proposals" with Bob + Claude badges
- Two cards side by side (Option A / Option B)
- Each card contains:
  - Option name + badge (e.g. "Recommended")
  - "Why not the standard answer" section
  - The actual proposal (concise)
  - Tradeoffs table (3 columns: ✓ Pro, ✗ Con, ~ Neutral)
  - Migration path (numbered steps)
  - "Implement This" button

**Design notes:**
- Option A card has a subtle purple glow border (recommended)
- Option B card has standard border
- Tradeoffs use green/red/gray colored text
- "Implement This" button: purple, full card width

---

### Page 4 — Live Execution

Split view showing each model working simultaneously.

**Layout:**
- Three execution panels (Bob, Gemini, Claude) in a row
- Each panel has:
  - Model name + colored dot + status badge (running/done/waiting)
  - Live streaming output (monospace font, auto-scroll)
  - File being modified
  - Mini progress bar

**Design notes:**
- Output streams in real time character by character
- Done panels show a green checkmark and stop animating
- Running panels have a subtle pulse on their color dot
- Overall progress bar at the bottom spanning all panels

---

### Page 5 — Results Summary

Clean results page after session completes.

**Layout:**
- "Session Complete" header with checkmark + time taken
- "What Changed" section — list of modified files with diff preview on hover
- "Why" section — Bob's plain-language explanation
- "Models Used" section — badges showing which model did what
- "Context Efficiency" stats — files loaded vs total, tokens saved
- Bob Report download button
- Two CTA buttons: "New Task" and "View Full Diff"

---

## Component Library

### ModelBadge
```
● Bob      (blue dot + "Bob" label)
● Claude   (orange dot + "Claude" label)
○ Gemini   (cyan dot, dimmed when inactive)
```

### OperationCard
```
┌─────────────────────┐
│  ⚡ Architect        │
│  Bob + Claude       │
│  Novel arch gen     │
└─────────────────────┘
```
Hover state: purple border glow

### FileChip
```
[ auth/views.py  × ]
```
Small pill, shows loaded files, dismissible

### LiveOutputPanel
```
┌─────────────────────────────────┐
│  ● Bob                 running  │
│  ─────────────────────────────  │
│  > Analyzing patterns...        │
│  > Found 3 issues...            │
│  > Proposing fix...             │
│                  ▓▓▓▓▓░░  70%  │
└─────────────────────────────────┘
```

### ProposalCard
```
┌──────────────────────────────────────┐
│  Option A — JWT + Redis Hybrid  ★    │
│  ────────────────────────────────    │
│  Why not standard JWT:               │
│  [explanation text]                  │
│                                      │
│  Tradeoffs:                          │
│  ✓ Revocable  ✓ Fast  ✗ Redis dep   │
│                                      │
│  [ Implement This ]                  │
└──────────────────────────────────────┘
```

### StatCard
```
┌──────────────────┐
│  Files Loaded    │
│  6 / 312         │
│  98% savings     │
└──────────────────┘
```

### ProgressBar
```
[▓▓▓▓▓▓▓░░░]  70%  — Bob refactoring auth...
```
Purple fill, animates smoothly

---

## Animations

| Element | Animation |
|---------|-----------|
| Logo on load | Fade in + subtle purple glow pulse |
| Operation selected | Card lifts (shadow) + purple border |
| Live output text | Character-by-character stream |
| Progress bar | Smooth fill, no jumps |
| Model dot (running) | Slow pulse in model color |
| Model dot (done) | Solid green, no pulse |
| Proposal cards | Slide in from bottom on appear |
| Results page | Fade in items sequentially |

**Rule:** No animation longer than 300ms. No bouncing. No excessive motion. This is a dev tool, not a marketing site.

---

## Responsive Behavior

| Screen | Behavior |
|--------|---------|
| > 1280px | Full 3-panel layout |
| 1024–1280px | Sidebar collapses to icons only |
| 768–1024px | Single panel, tabs to switch |
| < 768px | Not supported (dev tool) |

---

## Pages / Routes

```
/                   → Landing / repo setup
/workspace          → Main dashboard
/proposals          → Architecture proposals
/execution          → Live execution view
/results            → Session results
/settings           → Model API keys + config
```

---

## React Component Tree

```
App
├── TopBar
│   ├── ElithLogo
│   ├── RepoBreadcrumb
│   └── ModelStatusRow
├── Sidebar
│   ├── ModelList
│   │   └── ModelToggle (x5)
│   ├── OperationList
│   │   └── OperationItem (x8)
│   └── ContextStats
├── MainContent (route-based)
│   ├── LandingPage
│   ├── WorkspacePage
│   │   ├── ContextPreview
│   │   └── LiveOutputPanel (x3)
│   ├── ProposalsPage
│   │   └── ProposalCard (x2)
│   ├── ExecutionPage
│   │   └── ModelExecutionPanel (x3)
│   └── ResultsPage
│       ├── ChangeSummary
│       ├── WhyExplanation
│       ├── ModelsUsed
│       └── ContextStats
└── BottomBar
    ├── TaskInput
    ├── RunButton
    └── ModeSelector
```

---

## Zustand Store Shape

```typescript
interface ElithStore {
  // Repo
  repoPath: string;
  vaultPath: string;

  // Models
  activeModels: {
    bob: boolean;
    claude: boolean;
    gemini: boolean;
    codex: boolean;
    local: boolean;
  };

  // Context
  loadedFiles: string[];
  loadedVaultNotes: string[];
  tokensSaved: number;

  // Session
  currentOperation: string | null;
  sessionStatus: 'idle' | 'running' | 'done' | 'error';
  liveOutput: Record<string, string[]>; // model → output lines

  // Results
  proposals: ArchProposal[];
  sessionResult: SessionResult | null;
  bobReportPath: string | null;
}
```

---

## Notes For Johann

- Use Tailwind utility classes only — no custom CSS files except for the CSS variables above
- Every component should be in its own file under `frontend/src/components/`
- Use `useState` and Zustand — no Redux, no Context API
- Live output streaming: use `EventSource` (SSE) from the FastAPI backend
- The proposals page is the most important page — spend extra time on it
- Mobile is not required — focus on 1280px+ desktop
- Use `JetBrains Mono` from Google Fonts for all terminal/code output
- Use `Inter` from Google Fonts for all UI text
- Every panel should have a subtle `border: 1px solid var(--border)` — no shadows
- The purple accent should be used sparingly — only for active states and CTAs

---

## Johann's Priority Order

Build in this exact order:

1. Design system setup (CSS vars, fonts, Tailwind config)
2. TopBar + Sidebar shell (layout only, no logic)
3. Landing page (repo input, model toggles)
4. Workspace page with mock data
5. Proposals page with mock cards
6. Execution page with mock streaming
7. Results page
8. Wire to real API (You + Basil Joy will have endpoints ready)
9. Animations + polish
10. Demo video recording

---

*Elith Web Dashboard UX Specification — Johann — IBM Bob Hackathon 2026*
