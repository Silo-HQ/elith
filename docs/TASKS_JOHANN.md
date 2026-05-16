# Elith — Johann's Tasks (UI/UX)
**IBM Bob Hackathon | May 15–17, 2026**  
**Your Role:** Air Support — TUI + Web Dashboard + Demo + Presentation  
**Your Superpower:** You work completely independently. You never wait for the backend.

---

## The Most Important Thing

**You build with mock data first. Always.**

The backend will not be ready when you start. That is fine. Build every component with hardcoded mock data. When the backend is ready (Hour 23), you swap mock data for real API calls. That's it.

---

## Your Stack

**TUI:**
- Python 3.10+
- Textual (`pip install textual`)
- pyfiglet (`pip install pyfiglet`) — for ASCII art logo

**Web Dashboard:**
- React + TypeScript
- Tailwind CSS
- Zustand (state management)
- EventSource API (SSE for live streaming)

---

## Style Reference

**Open the Bob Shell screenshot.** Keep it open the entire time you build the TUI.

That is your exact target:
- Dark near-black background
- Cyan for commands and model names
- Yellow border on the active input bar
- `════` borders for major dividers
- Monospace font everywhere
- Status bar always visible at the bottom

**All details are in `ELITH_TUI_SPEC.md` and `ELITH_UX_SPEC.md`.**

---

## Your File Ownership

```
tui/                       ← YOU OWN THIS
├── app.py
├── screens/
│   ├── welcome.py
│   ├── workspace.py
│   ├── execution.py
│   ├── proposals.py
│   └── results.py
└── components/
    ├── status_bar.py
    ├── input_bar.py
    ├── output_panel.py
    ├── context_panel.py
    ├── proposal_box.py
    ├── progress_bar.py
    └── model_dot.py

frontend/                  ← YOU OWN THIS
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── TopBar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ContextPreview.tsx
│   │   ├── LiveOutput.tsx
│   │   ├── ProposalCard.tsx
│   │   ├── ResultsSummary.tsx
│   │   ├── ModelBadge.tsx
│   │   ├── OperationCard.tsx
│   │   ├── ProgressBar.tsx
│   │   └── BottomBar.tsx
│   ├── stores/
│   │   └── elithStore.ts
│   └── pages/
│       ├── Landing.tsx
│       ├── Workspace.tsx
│       ├── Proposals.tsx
│       ├── Execution.tsx
│       └── Results.tsx
└── package.json

docs/                      ← YOU OWN THIS
├── slides/
├── cover-image/
└── demo-video/
```

---

## Hour-by-Hour Tasks

---

### Hour 1 — Team Sync
```
✓ Read ELITH_TUI_SPEC.md fully
✓ Read ELITH_UX_SPEC.md fully
✓ Open Bob Shell screenshot — keep it visible
✓ Clone repo, create your branch: git checkout -b johann/ui
✓ Set up React project: npx create-react-app frontend --template typescript
✓ Set up TUI: pip install textual pyfiglet
✓ Go heads down
```

---

### Hours 2–4 — Design System + Layout Shell

**Web Dashboard:**
```
✓ Tailwind config with custom colors from UX spec:
    └── bg-primary: #000000
    └── bg-secondary: #0D0D0D
    └── accent: #A855F7
    └── bob: #3B82F6
    └── claude: #F97316
    └── gemini: #06B6D4
    (full list in ELITH_UX_SPEC.md)

✓ Google Fonts loaded:
    └── JetBrains Mono (all terminal/code text)
    └── Inter (all UI text)

✓ App.tsx shell with routing:
    └── / → Landing page
    └── /workspace → Workspace page
    └── /proposals → Proposals page
    └── /results → Results page

✓ TopBar component:
    └── "◆ Elith" logo left
    └── repo path center
    └── model status dots right (Bob ●, Claude ●, Gemini ○)

✓ Sidebar component:
    └── Models section (toggle dots)
    └── Operations list (8 operations, numbered)
    └── Context stats (files loaded, vault notes)

✓ BottomBar component:
    └── Task input (full width)
    └── Run button (purple)
    └── Mode selector

Target: App loads, TopBar + Sidebar + BottomBar visible,
        layout correct, all mock data
```

**TUI:**
```
✓ tui/app.py — Textual App root
✓ tui/screens/welcome.py:
    └── ASCII art ELITH logo (use pyfiglet with "banner3" font)
    └── Version line
    └── Command reference list (cyan commands)
    └── Status line (Sandbox mode, repo path)
    └── Input bar (yellow border)
    └── Status bar at bottom

Target: TUI launches, welcome screen looks like Bob Shell
```

---

### Hours 5–8 — Core Components (Mock Data)

**Web Dashboard:**
```
✓ Landing page:
    └── Centered logo with purple glow
    └── Repo path input
    └── Vault path input (optional toggle)
    └── Model toggles (Bob always on, others optional)
    └── "Start Session" button
    └── Recent sessions list (mock: 3 items)

✓ ContextPreview component:
    └── "Files loaded: 6 / 312"
    └── List of 6 file names with → arrows
    └── "Vault notes: 3"
    └── "Token savings: ~4,200 vs full load"
    (mock data — hardcode these)

✓ LiveOutput component:
    └── Labeled sections per model (● Bob, ● Claude)
    └── Scrolling monospace text output
    └── Progress bar per model
    └── Auto-scroll to bottom

✓ ModelBadge component:
    └── colored dot + model name
    └── "running" pulse animation
    └── "done" solid green

Target: Workspace page looks complete with mock data
```

**TUI:**
```
✓ tui/components/status_bar.py:
    └── "Auto-approve: Edit (shift+tab)"
    └── "Tokens: 87%"
    └── "Model name ●"
    └── "Mode: Code"
    └── Always pinned to bottom

✓ tui/components/input_bar.py:
    └── Yellow border when active
    └── "> │ " prefix
    └── Blinking cursor

✓ tui/components/output_panel.py:
    └── Scrolling text with model labels
    └── ● BOB header in cyan
    └── ● CLAUDE header in orange

✓ tui/screens/workspace.py:
    └── Context panel top
    └── Output panel center
    └── Input bar bottom
    └── Status bar always visible

Target: TUI workspace screen complete with mock output
```

---

### Hours 9–14 — Proposals + Execution Screens

**Web Dashboard:**
```
✓ ProposalCard component:
    └── Option name + "RECOMMENDED" badge
    └── "Why not standard" section
    └── Proposal description
    └── Tradeoffs: ✓ ✗ columns
    └── Migration steps
    └── "Implement This" button (purple, full width)

✓ Proposals page:
    └── Two ProposalCards side by side
    └── Option A has purple glow border
    └── Option B has standard border

✓ Execution page:
    └── 3 ModelExecutionPanels in a row
    └── Each: model name, status, live output, progress bar
    └── Overall progress bar spanning all three

Target: Proposals page and Execution page look great with mock data
```

**TUI:**
```
✓ tui/screens/execution.py:
    └── Multi-model output sections
    └── ● BOB, ● CLAUDE, ● GEMINI labeled
    └── Progress bar across bottom

✓ tui/screens/proposals.py:
    └── Two proposal boxes
    └── Keyboard shortcuts shown: [A] implement A  [B] implement B

✓ tui/components/proposal_box.py:
    └── Bordered box with option details
    └── [RECOMMENDED] tag in cyan

Target: Both TUI and web proposals screens done
```

---

### Hours 15–22 — Results + Settings + Polish

**Web Dashboard:**
```
✓ ResultsSummary component:
    └── "Session Complete" + time taken
    └── Files changed list with what happened
    └── "Why" explanation block
    └── "Models used" badges
    └── "Context efficiency" stats
    └── "Download Bob Report" button
    └── "New Task" CTA

✓ Results page complete

✓ Settings page:
    └── API key inputs per provider
    └── Toggle enable/disable per provider
    └── Save button

✓ Animations:
    └── Logo glow on load (300ms)
    └── Proposal cards slide in (200ms)
    └── Progress bar smooth fill
    └── Model dot pulse when running
    └── Results items fade in sequentially

✓ Loading states for all async operations
✓ Error states (provider not configured, repo not found)
```

**TUI:**
```
✓ tui/screens/results.py:
    └── Changes summary
    └── Why explanation
    └── Models used
    └── Bob report saved path
    └── [N] new  [V] diff  [E] export shortcuts

✓ Full keyboard navigation working:
    └── All shortcuts from TUI spec implemented
    └── / triggers command list
    └── @ triggers file picker
    └── ↑↓ navigate history
```

---

### Hours 23–28 — Wire to Real API

**When the team lead tells you the API is ready:**

```
✓ Replace mock repo scan with:
    fetch('POST /api/scan', { repo_path, vault_path })
    → populate ContextPreview with real data

✓ Replace mock execute with:
    fetch('POST /api/execute', { model, operation, repo_path })
    → get session_id

✓ Replace mock live output with EventSource (SSE):
    const es = new EventSource(`/api/stream/${session_id}`)
    es.onmessage = (e) => appendOutput(JSON.parse(e.data))

✓ Replace mock proposals with real architect output
✓ Replace mock results with real session results

✓ Model toggles actually enable/disable providers
✓ Test full flow end to end in browser

Target: Web dashboard fully wired to real backend
```

---

### Hours 29–36 — Demo + Presentation

**This block is YOUR block. Team lead and Basil Joy are running demo tasks.**

```
✓ Record demo video — 2 to 3 minutes maximum

    Script:
    0:00 — Open Elith TUI. Show welcome screen.
    0:15 — Set repo path. Show context loading (6 of 312 files).
    0:30 — Run /architect on auth module. Watch Bob output stream live.
    1:00 — Switch to web dashboard. Show proposals screen.
           Option A highlighted. Read the "why not standard" section.
    1:30 — Click Implement. Watch 3 models work simultaneously.
           Bob refactors. Gemini writes tests. Claude updates docs.
    2:00 — Results screen. Show files changed. Show Bob report saved.
    2:15 — Switch provider to Claude. Run same task. Same quality.
    2:45 — "Any model. Bob-level. Your choice."
    3:00 — End.

✓ Record in 1080p minimum
✓ Show both TUI and web dashboard in the video
✓ No shaky camera — screen recording only

✓ Build 5-slide pitch deck:
    Slide 1: Title — "Elith" + tagline + team
    Slide 2: The Problem (3 bullet points, max)
    Slide 3: The Solution — architecture diagram from project spec
    Slide 4: Live Demo Screenshots (TUI + web dashboard)
    Slide 5: "Any model. Bob-level. Your choice." + GitHub URL

✓ Cover image:
    └── 16:9 ratio (1920x1080)
    └── Black background
    └── "Elith" in large white text
    └── Tagline below: "Every model. Bob-level. Your choice."
    └── Purple accent line/shape
    └── Simple. Clean. No stock photos.
    Use Figma, Canva, or even a React component screenshot.
```

---

### Hours 37–44 — Polish
```
✓ README.md with:
    └── What is Elith (2 sentences)
    └── Screenshot of TUI welcome screen
    └── Screenshot of web proposals page
    └── Screenshot of results page
    └── How to install and run locally
    └── How to configure model API keys
    └── Team members

✓ Final video edit — cut any dead air
✓ Slide deck final version
✓ Cover image final version
✓ Fill all submission form fields and save as draft
```

---

### Hours 45–47 — Submit
```
✓ Submit form on lablab.ai — every field filled
✓ Video uploaded
✓ Cover image uploaded
✓ GitHub URL confirmed public
✓ DONE
```

### Hour 48 — Buffer
```
Do not build. Safety net for upload issues only.
```

---

## Mock Data (Use These Exactly)

Copy these into your components while backend is not ready:

```typescript
// Mock context data
const mockContext = {
  loaded_files: [
    "auth/views.py",
    "auth/models.py",
    "auth/urls.py",
    "config/settings.py",
    "requirements.txt",
    "README.md"
  ],
  total_files: 312,
  vault_notes: ["auth-decisions.md", "tech-debt.md", "coding-standards.md"],
  tokens_saved: 4200
}

// Mock proposals
const mockProposals = [
  {
    id: "A",
    name: "JWT + Redis Session Hybrid",
    recommended: true,
    why_not_standard: "auth/views.py:L142 requires immediate token revocation. Pure JWT cannot revoke without blocklist overhead.",
    proposal: "Short-lived JWT (15min) + Redis-backed refresh tokens. Matches your security-notes.md requirements exactly.",
    tradeoffs: {
      pros: ["Immediate revocation", "Stateless verification (fast reads)"],
      cons: ["Redis dependency added"]
    },
    migration_steps: ["Add Redis to requirements", "Update token model", "Refactor session endpoints"],
    migration_downtime: false
  },
  {
    id: "B",
    name: "OAuth2 + PKCE Flow",
    recommended: false,
    why_not_standard: "Your security-notes.md flags CSRF risk in current flow. PKCE eliminates this without server-side state.",
    proposal: "Full OAuth2 with PKCE. Stateless, secure, industry standard for your threat model.",
    tradeoffs: {
      pros: ["Stateless", "Secure against CSRF"],
      cons: ["Frontend changes required", "More complex client"]
    },
    migration_steps: ["Update auth endpoints", "Add PKCE verifier", "Update frontend", "Update tests", "Documentation"],
    migration_downtime: false
  }
]

// Mock live output
const mockOutput = {
  bob: [
    "Reading auth/views.py...",
    "Reading auth/models.py...",
    "Found pattern: no token revocation mechanism",
    "Found pattern: shared session state across requests",
    "Analyzing dependency graph...",
    "Cross-referencing tech-debt.md...",
  ],
  claude: [
    "Reasoning about constraints...",
    "Your read:write ratio (18:1) rules out standard session storage",
    "Evaluating 3 architecture patterns for your constraints...",
  ]
}
```

---

## You Never Need To Know

- How Bob shell works internally
- How tool calling works in Python
- How the context engine scores files
- Any AI/ML concepts

You just need the API contract from the team lead and the mock data above. Build everything else independently.

---

## Questions To Ask The Team Lead

These are the only things you need from him:

1. "What's the base URL for the API?" (for wiring)
2. "Is SSE streaming ready?" (before Hour 23)
3. "Is deployment up?" (before Hour 36)

Everything else you figure out yourself.

---

*Johann's Task Doc — Elith — IBM Bob Hackathon 2026*
