# Elith — Terminal UI (TUI) Specification
**Built with:** Textual (Python)  
**Style Reference:** Bob Shell v1.0.3  
**Owner:** Johann  
**Vibe:** Dark. Monospace. Cyan accents. Single input bar. Always fast.

---

## Design Language (From Bob Shell Reference)

- **Background:** Near-black (`#0D1117`) with very subtle green tint
- **Primary text:** White (`#FFFFFF`)
- **Secondary text:** Dim white (`#888888`)
- **Accent / interactive:** Cyan (`#00BFFF`) — commands, highlights, model names
- **Active input border:** Yellow (`#FFD700`)
- **Success:** Green (`#00FF7F`)
- **Error:** Red (`#FF4444`)
- **Warning:** Yellow (`#FFD700`)
- **Font:** Monospace only — `JetBrains Mono` or terminal default. No exceptions.
- **No rounded corners. No shadows. No gradients. Pure terminal.**

---

## Screen 1 — Welcome Screen

Shown on launch. Matches Bob Shell's welcome style exactly.

```
════════════════════════════════════════════════════════════════════
                         Welcome to


    ███████╗██╗     ██╗████████╗██╗  ██╗
    ██╔════╝██║     ██║╚══██╔══╝██║  ██║
    █████╗  ██║     ██║   ██║   ███████║
    ██╔══╝  ██║     ██║   ██║   ██╔══██║
    ███████╗███████╗██║   ██║   ██║  ██║
    ╚══════╝╚══════╝╚═╝   ╚═╝   ╚═╝  ╚═╝

                    ── Version 1.0.0 ──


    Here are some helpful commands to get started:

    /repo         Set repository path
    /vault        Set Obsidian vault path
    /models       Configure AI providers
    /explain      Explain repository architecture
    /architect    Generate novel architecture proposals
    /test-gen     Generate missing tests
    /refactor     Refactor a module
    /document     Generate documentation
    /risk         Scan for risky files
    /settings     View and edit Elith settings


                    Sandbox mode  Disabled

              /path/to/your/repository

    Users should independently verify AI-generated content.

════════════════════════════════════════════════════════════════════
  Active models: Bob ●  Claude ●  Gemini ○  GPT ○  Local ○

> │ Enter your prompt, /commands, @file references, !shell mode    
────────────────────────────────────────────────────────────────────
  Auto-approve: Edit (shift+tab)   Tokens: 100% | 0/40 | Mode: Code
```

---

## Screen 2 — Main Workspace

After repo is loaded. This is the primary working screen.

```
════════════════════════════════════════════════════════════════════
  ELITH  ──  ~/projects/myapp  ──  Bob ●  Claude ●  Gemini ○
════════════════════════════════════════════════════════════════════
  Context loaded:
  ├── auth/views.py          (142 lines)
  ├── auth/models.py         (67 lines)
  ├── auth/urls.py           (23 lines)
  ├── config/settings.py     (89 lines)
  └── requirements.txt       (34 lines)
  
  Vault notes: auth-decisions.md, tech-debt.md
  Token savings: ~4,200 vs full repo load (98% reduction)

────────────────────────────────────────────────────────────────────

  [Output appears here]




════════════════════════════════════════════════════════════════════
> │ architect the auth module                                       
────────────────────────────────────────────────────────────────────
  Auto-approve: Edit (shift+tab)   Tokens: 87% | Bob | Mode: Code
```

---

## Screen 3 — Live Execution

While model(s) are working. Multi-model output shown sequentially or split.

```
════════════════════════════════════════════════════════════════════
  ELITH  ──  ~/projects/myapp  ──  architect  ──  running...
════════════════════════════════════════════════════════════════════

  ● BOB  ─────────────────────────────────────────────────────────
  > Reading auth/views.py...
  > Reading auth/models.py...
  > Found pattern: no token revocation mechanism
  > Found pattern: shared session state across requests
  > Found pattern: synchronous DB calls on every request
  > Analyzing dependency graph...
  > Cross-referencing tech-debt.md...

  ● CLAUDE  ──────────────────────────────────────────────────────
  > Reasoning about constraints...
  > Your read:write ratio (18:1) rules out standard session storage
  > Evaluating 3 architecture patterns for your constraints...

  Progress: ████████████░░░░  75%   2 models active

════════════════════════════════════════════════════════════════════
> │                                             [ctrl+c to cancel]
────────────────────────────────────────────────────────────────────
  Auto-approve: Edit (shift+tab)   Tokens: 61% | Bob+Claude | Code
```

---

## Screen 4 — Architecture Proposals

```
════════════════════════════════════════════════════════════════════
  ELITH  ──  Architecture Proposals  ──  Bob + Claude
════════════════════════════════════════════════════════════════════

  ┌─ OPTION A ──────────────────────────────── [RECOMMENDED] ─────┐
  │  JWT + Redis Session Hybrid                                    │
  │                                                                │
  │  Why not standard JWT:                                         │
  │  auth/views.py:L142 requires immediate token revocation.       │
  │  Pure JWT cannot revoke without blocklist overhead.            │
  │                                                                │
  │  Proposal: Short-lived JWT (15min) + Redis refresh tokens      │
  │  Matches your security-notes.md requirements exactly.          │
  │                                                                │
  │  Tradeoffs:                                                    │
  │    ✓  Immediate revocation capability                          │
  │    ✓  Stateless verification (fast reads)                      │
  │    ✗  Redis dependency added                                   │
  │                                                                │
  │  Migration: 3 steps, zero downtime                            │
  └────────────────────────────────────────────────────────────────┘

  ┌─ OPTION B ─────────────────────────────────────────────────────┐
  │  OAuth2 + PKCE Flow                                            │
  │  Tradeoffs: ✓ Stateless  ✓ Secure  ✗ Client complexity        │
  │  Migration: 5 steps, frontend changes required                 │
  └────────────────────────────────────────────────────────────────┘

════════════════════════════════════════════════════════════════════
> │ A                           [A] implement A  [B] implement B  
────────────────────────────────────────────────────────────────────
  Auto-approve: Edit (shift+tab)   Tokens: 61% | Bob+Claude | Code
```

---

## Screen 5 — Results Summary

```
════════════════════════════════════════════════════════════════════
  ELITH  ──  Session Complete  ──  2m 14s
════════════════════════════════════════════════════════════════════

  ✓ Changes made:
  ├── auth/views.py          refactored  (JWT + Redis hybrid)
  ├── auth/models.py         updated     (new token model)
  ├── tests/test_auth.py     created     (14 tests)
  └── auth/README.md         updated     (new flow documented)

  Why:
  Previous implementation lacked token revocation. New hybrid
  provides immediate revocation via Redis while keeping stateless
  JWT verification for read performance.

  Models used:
  ├── Bob     refactoring + implementation
  ├── Claude  reasoning + documentation  
  └── Gemini  test generation (14 tests)

  Context efficiency:
  ├── Files loaded:   6 of 312  (98% token savings)
  └── Vault notes:    3 used

  Bob report → bob-reports/session_20260516_142301.md  ✓ saved

════════════════════════════════════════════════════════════════════
> │ new task                        [N] new  [V] diff  [E] export
────────────────────────────────────────────────────────────────────
  Auto-approve: Edit (shift+tab)   Tokens: 43% | Bob | Code
```

---

## Status Bar (Always Visible — Bottom)

Mirrors Bob Shell's status bar exactly:

```
  Auto-approve: Edit (shift+tab)   Tokens: 87% | 12/40 | Bob ● | Mode: Code
```

| Element | Description |
|---------|-------------|
| `Auto-approve` | Current approval mode — click to toggle |
| `Tokens: 87%` | Remaining context budget |
| `12/40` | Messages in current session |
| `Bob ●` | Active model name + green dot |
| `Mode: Code` | Current operation mode |

---

## Input Bar

Matches Bob Shell's yellow-bordered input exactly:

```
> │ your prompt here...
```

- Yellow border (`#FFD700`) when active
- Dim border when idle
- `>` prefix always visible
- Cursor blinking

**Input prefixes (same pattern as Bob Shell):**
```
/architect    → run architect operation
/explain      → run explain operation  
/test-gen     → run test generation
/refactor     → refactor a module
@auth/views.py → reference a specific file
!ls -la       → shell passthrough mode
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Execute prompt |
| `Shift+Tab` | Toggle auto-approve mode |
| `Ctrl+C` | Cancel running operation |
| `/` | Command mode (shows command list) |
| `@` | File reference mode (fuzzy file picker) |
| `!` | Shell passthrough mode |
| `↑ ↓` | Navigate history |
| `Tab` | Autocomplete command/file |
| `Ctrl+L` | Clear output |
| `Ctrl+E` | Export Bob report |

---

## Component List

| Component | File | Description |
|-----------|------|-------------|
| `ElithApp` | `tui/app.py` | Root Textual app |
| `WelcomeScreen` | `tui/screens/welcome.py` | ASCII art + command list |
| `WorkspaceScreen` | `tui/screens/workspace.py` | Main working screen |
| `ExecutionScreen` | `tui/screens/execution.py` | Live multi-model output |
| `ProposalsScreen` | `tui/screens/proposals.py` | Architecture proposals |
| `ResultsScreen` | `tui/screens/results.py` | Session summary |
| `StatusBar` | `tui/components/status.py` | Always-visible bottom bar |
| `InputBar` | `tui/components/input.py` | Yellow-bordered prompt input |
| `OutputPanel` | `tui/components/output.py` | Scrolling model output |
| `ContextPanel` | `tui/components/context.py` | Loaded files + vault notes |
| `ProposalBox` | `tui/components/proposal.py` | Single proposal card |
| `ProgressBar` | `tui/components/progress.py` | Operation progress |
| `ModelDot` | `tui/components/model_dot.py` | Colored model status dot |

---

## Install & Run

```bash
pip install textual
cd elith/
python -m tui.app

# or
elith tui
```

---

## Notes For Johann

- **Study the Bob Shell screenshot first.** That's the exact aesthetic target.
- Use `textual` — gives you proper layout, reactive updates, keyboard events
- The ASCII art ELITH logo goes on the welcome screen — generate it with `pyfiglet`
- Status bar must always be visible — never hidden by content
- Input bar yellow border is non-negotiable — it's the focal point of the whole UI
- Output scrolls automatically — always show latest line
- When multiple models are running, show each as a separate labeled section
- The `═` border character (U+2550) for major dividers, `─` (U+2500) for minor
- No color except: cyan for commands/model names, yellow for active input, green for success, red for error
- Every screen must feel like you're inside a terminal, not a web app

---

*Elith TUI Specification — Johann — IBM Bob Hackathon 2026*
