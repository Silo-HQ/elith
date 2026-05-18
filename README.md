# Elith

*The AI coding agent that ships production code, not textbook answers*

Elith reads your prompt, understands intent, spins up the right swarm of specialized agents — devops, dev, qa — and orchestrates them until the codebase is genuinely production-ready. Every model. Any repo. One framework.

![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg) ![TypeScript 5](https://img.shields.io/badge/typescript-5.0-blue.svg) ![FastAPI](https://img.shields.io/badge/fastapi-latest-green.svg) ![Ink TUI](https://img.shields.io/badge/ink-tui-purple.svg) ![MIT License](https://img.shields.io/badge/license-MIT-green.svg) ![npm](https://img.shields.io/npm/v/@elith/cli) ![Homebrew](https://img.shields.io/badge/homebrew-available-orange.svg) ![IBM Bob Hackathon 2026](https://img.shields.io/badge/IBM%20Bob%20Hackathon-2026-blue.svg)

## Install

*$ elith — one command, any package manager*

The fastest path — curl installer handles everything:

```bash
curl -fsSL https://elith.lovable.app/install.sh | sh
```

Or install via your package manager of choice:

```bash
# npm
npm install -g @elith/cli

# pnpm
pnpm add -g @elith/cli

# bun
bun add -g @elith/cli

# Homebrew
brew install elith
```

After any install method, start Elith:

```bash
elith
```

> Requires Python 3.10+ and Node.js 18+. The installer handles both automatically. LMStudio users: start LMStudio on port 1234 before launching. No Anthropic API key required — runs fully local with LMStudio.

Service management:

```bash
elith service start    # start backend daemon
elith service stop     # stop backend daemon
elith service status   # check daemon status
elith service restart  # restart daemon
```

Backend auto-starts on first elith command and persists across CLI sessions.

Elith is not a chatbot wrapper or a single-agent copilot. Any LLM can generate code — but they can't read your files, run your tests, or commit changes. They guess. They copy-paste. Quality drops. Elith doesn't generate code in isolation — it orchestrates a team. Each agent owns a phase of delivery. They hand off, review each other's output, and loop until the work actually ships production bar.

## The Problem

**Textbook answers** — Ask any LLM to architect a system and you get a perfect MIRO diagram. Never a hybrid CQRS because your read:write is 20:1. Never a strangler fig because you can't stop the business.

**Repo-blind models** — Claude, Gemini, GPT are powerful reasoners — but they can't read your files, run your tests, or commit changes. They guess. They copy-paste. Quality drops.

**Single-agent ceilings** — One model trying to do dev, QA, and devops all at once. Real shipping requires specialists handing off work — not one generalist juggling roles.

## The Pipeline

*$ elith — prompt to production, no humans in the loop*

Elith maps every prompt through four phases. Each phase has dedicated agents, defined outputs, and automatic handoff to the next. Top fails → back to dev.

| Phase | What Happens |
|-------|-------------|
| **Intent** | Parse the prompt. Map it to capabilities, features, behavior, harden, migrate. |
| **Scope** | Context engine loads 4-8 relevant files (not all 312). Builds a focused task packet. |
| **Execute** | Agents work in parallel. Design infra, write code, run draft tests. |
| **Verify** | QA runs the full suite. Failures feed back to dev. Loop until green. Then promote. |

## The Swarm

*Specialists, not generalists*

Six agents. Each owns a domain. All share the same repo context.

| Agent | Role |
|-------|------|
| **[Devops]** | scaffold infra, build pipelines, secrets & env, containerize |
| **[Architect]** | read full repo, propose and design architecture, coordinate paths |
| **[Dev]** | implement modules, follow code patterns, write integrations, open PRs |
| **[QA]** | generate tests, run suites, check & load, report regressions |
| **[Reviewer]** | read diff, flag issues, enforce standards, summarize changes |
| **[Docs]** | update readme, write docs, API references, changelogs |

## Every Model

*Bring your own brain*

Pick the model you trust. Elith's skill layer gives each one the same repo awareness — read files, search code, run tests, commit changes — through agent tool calling. No paste-and-pray.

| Model | Provider | Interface |
|-------|----------|-----------|
| Claude | Anthropic | tool calling |
| GPT-4 / Codex | OpenAI | tool calling |
| Gemini | Google | function calling |
| Mistral | Mistral | skill layer |
| Local LLM | Ollama / LMStudio | skill layer |
| Any OpenAI-compat | Custom endpoint | skill layer |

Switch with /model — no code changes, no lock-in.

## Textbook vs Elith

| Prompt | Standard LLM | Elith |
|--------|-------------|-------|
| "Structure this service" | Generic MVC/MVVP | Hybrid CQRS — your read:write is 20:1 |
| "Migrate legacy system" | Full rewrite | Strangler fig — you can't stop the business |
| "Handle state" | Redux default | Event sourcing — you need audit trails |
| "Add caching" | Redis everywhere | Per-route TTL + stale-while-revalidate |

![Elith TUI](assets/tui-screenshot.png)

![Elith Web Dashboard](assets/dashboard-screenshot.png)

## Documentation

| Section | What's Covered |
|---------|----------------|
| [Quickstart](https://elith.lovable.app/docs/quickstart) | Install → configure → first task in 5 min |
| [TUI Usage](https://elith.lovable.app/docs/tui) | Commands, keybindings, / @ ! # triggers |
| [Web Dashboard](https://elith.lovable.app/docs/dashboard) | Pages, components, real-time streaming |
| [Configuration](https://elith.lovable.app/docs/config) | .env vars, providers, model switching |
| [Skills System](https://elith.lovable.app/docs/skills) | 12 built-in skills, adding custom skills |
| [Context Engine](https://elith.lovable.app/docs/context) | repo_scanner, packet_builder, compression |
| [Operations](https://elith.lovable.app/docs/operations) | explain, architect, test-gen, refactor |
| [API Reference](https://elith.lovable.app/docs/api) | All endpoints, SSE stream format |
| [Service Management](https://elith.lovable.app/docs/service) | Auto-start, daemon control, cross-platform |
| [Adding a Provider](https://elith.lovable.app/docs/providers) | Extend BaseProvider, register in router |
| [Session Reports](https://elith.lovable.app/docs/reports) | Auto-export format, bob-reports/ structure |
| [Architecture](https://elith.lovable.app/docs/architecture) | Project structure, data flow, key modules |

All documentation lives in docs/ or at https://elith.lovable.app

## Contributing

We welcome contributions. See CONTRIBUTING.md for development setup, code style, and PR process.

Quick start for contributors:

```bash
git clone https://github.com/Silo-HQ/elith.git
cd elith && ./install.sh
```

## Community

- [GitHub](https://github.com/Silo-HQ/elith)
- [Website](https://elith.lovable.app)
- [Issues](https://github.com/Silo-HQ/elith/issues)
- [Discussions](https://github.com/Silo-HQ/elith/discussions)
- [IBM Bob Hackathon 2026](https://lablab.ai)
- [Inspired by Hermes Agent](https://github.com/NousResearch/hermes-agent)
