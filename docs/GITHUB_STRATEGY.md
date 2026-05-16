# Elith — GitHub Collaboration Strategy
**IBM Bob Hackathon | May 15–17, 2026**  
**For:** All 3 team members  
**Rule:** Commit often. Push constantly. Never hold work locally.

---

## Two Remotes

```
main      → your personal GitHub repo (private, your backup only)
silo-hq   → team GitHub repo (everyone works here)
```

**Basil Joy and Johann only ever see and use `silo-hq`.**  
`main` is yours alone — personal safety net.

---

## Remote Setup (You Do This — Hour 1)

```bash
# 1. Create elith repo on silo-hq GitHub org
#    Go to github.com/Silo-HQ → New Repository
#    Name: elith
#    Private for now
#    No README

# 2. Clone silo-hq repo
git clone https://github.com/Silo-HQ/elith.git
cd elith

# 3. Add your personal remote
git remote add main https://github.com/Half-Silver/elith.git

# 4. Confirm both remotes are set
git remote -v
# Should show:
# origin   https://github.com/Silo-HQ/elith.git (fetch)
# origin   https://github.com/Silo-HQ/elith.git (push)
# main     https://github.com/Half-Silver/elith.git (fetch)
# main     https://github.com/Half-Silver/elith.git (push)

# 5. Create dev branch
git checkout -b dev

# 6. Create full folder structure
mkdir -p backend/router
mkdir -p backend/context_engine
mkdir -p backend/skills
mkdir -p backend/providers
mkdir -p backend/operations
mkdir -p backend/models
mkdir -p tui/screens
mkdir -p tui/components
mkdir -p frontend/src/components
mkdir -p frontend/src/pages
mkdir -p frontend/src/stores
mkdir -p obsidian-template/architecture
mkdir -p obsidian-template/standards
mkdir -p obsidian-template/tasks
mkdir -p bob-reports
mkdir -p docs

# 7. Create placeholder files
touch backend/__init__.py
touch backend/main.py
touch backend/router/__init__.py
touch backend/router/model_router.py
touch backend/context_engine/__init__.py
touch backend/context_engine/vault_reader.py
touch backend/context_engine/repo_scanner.py
touch backend/context_engine/packet_builder.py
touch backend/skills/__init__.py
touch backend/providers/__init__.py
touch backend/operations/__init__.py
touch bob-reports/.gitkeep
touch docs/.gitkeep

# 8. Create .gitignore
cat > .gitignore << 'EOF'
__pycache__/
*.pyc
*.pyo
.env
venv/
.venv/
node_modules/
.DS_Store
*.log
sessions/
tmp/
dist/
build/
.next/
EOF

# 9. Create .env.example
cat > .env.example << 'EOF'
# IBM Bob
BOB_ENABLED=true

# Anthropic
ANTHROPIC_API_KEY=your_key_here

# Google
GEMINI_API_KEY=your_key_here

# OpenAI
OPENAI_API_KEY=your_key_here

# Ollama (local)
OLLAMA_ENABLED=false
OLLAMA_MODEL=llama3.1

# App
REPO_PATH=~/projects/myapp
VAULT_PATH=~/obsidian/myapp
EOF

# 10. Create README placeholder
cat > README.md << 'EOF'
# Elith
**Every model. Bob-level. Your choice.**

> Elith is a universal repo-aware agent framework that gives every AI model
> the same codebase skills IBM Bob has natively.

*IBM Bob Hackathon 2026 — lablab.ai*
EOF

# 11. Create MIT LICENSE
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2026 Silo HQ

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
EOF

# 12. Push to BOTH remotes
git add .
git commit -m "init: project structure and placeholders"

git push origin dev          # → silo-hq (team sees this)
git push main dev            # → your personal backup

# 13. Invite teammates on silo-hq
#     Go to github.com/Silo-HQ/elith → Settings → Collaborators
#     Add Basil Joy's GitHub username
#     Add Johann's GitHub username
```

---

## First-Time Setup (Basil Joy + Johann)

**They only use silo-hq. They never touch your personal remote.**

```bash
# 1. Accept the GitHub invite from silo-hq (check email)

# 2. Clone from silo-hq
git clone https://github.com/Silo-HQ/elith.git
cd elith

# 3. Switch to dev
git checkout dev
git pull origin dev

# 4. Create your branch
# Basil Joy:
git checkout -b basil/ai-core
git push origin basil/ai-core

# Johann:
git checkout -b johann/ui
git push origin johann/ui

# Done. Start building.
```

---

## Branch Map

```
silo-hq (origin)
└── main                  ← demo-ready only. Hour 36 only.
└── dev                   ← integration. Everyone merges here.
    ├── you/backend        ← Team lead
    ├── basil/ai-core      ← Basil Joy
    └── johann/ui          ← Johann

your personal (main remote)
└── dev                   ← your backup mirror
└── main                  ← your backup mirror
```

---

## Your Push Routine (Team Lead Only)

You push to both remotes every time:

```bash
# Push to team + personal backup simultaneously
git push origin [branch]     # → silo-hq
git push main [branch]       # → your personal

# Or set up a push-to-both alias (run once):
git config alias.pushall '!git push origin "$@" && git push main "$@"'

# Then just use:
git pushall [branch]
```

---

## Basil Joy + Johann Push Routine

They only push to silo-hq (origin):

```bash
git add .
git commit -m "wip: [what you did]"
git push origin [your-branch]    # silo-hq only
```

---

## Folder Ownership

| Branch | Person | Folders They Own |
|--------|--------|-----------------|
| `you/backend` | Team Lead | `backend/main.py`, `backend/router/`, `backend/context_engine/`, `backend/operations/` |
| `basil/ai-core` | Basil Joy | `backend/skills/`, `backend/providers/` |
| `johann/ui` | Johann | `tui/`, `frontend/`, `docs/` |

**Never touch someone else's folder. Ever.**

---

## Commit Every 2 Hours (Everyone)

```bash
git add .
git commit -m "wip: [what you just finished]"
git push origin [your-branch]
# Team lead also: git push main [your-branch]
```

### Commit Message Format

```bash
git commit -m "init: claude provider skeleton"
git commit -m "wip: read_file skill half done"
git commit -m "feat: read_file skill complete and tested"
git commit -m "fix: search_code grep path error"
git commit -m "done: all 12 skills complete"
```

---

## Sync Merge (Hours 9, 17, 25, 33, 41)

### Step 1 — Everyone (Before Sync Call)
```bash
git checkout dev
git pull origin dev
git checkout [your-branch]
git merge dev
# Fix conflicts if any → message team lead
git push origin [your-branch]
```

### Step 2 — Team Lead (During Sync Call)
```bash
git checkout dev
git pull origin dev

git merge basil/ai-core --no-ff -m "merge: basil ai-core → dev"
git merge johann/ui --no-ff -m "merge: johann ui → dev"
git merge you/backend --no-ff -m "merge: backend → dev"

git push origin dev      # → silo-hq
git push main dev        # → your personal backup
```

### Step 3 — Everyone (After Sync Call)
```bash
git checkout dev
git pull origin dev
git checkout [your-branch]
git merge dev
git push origin [your-branch]
```

---

## Integration Points

Only two files connect everyone's work. Team lead owns both.

**`backend/router/model_router.py`**  
**`backend/main.py`**

**Basil Joy protocol:**  
When a provider is done, message team lead:
> "claude_provider.py done. Import: `from backend.providers.claude_provider import ClaudeProvider`"

**Johann protocol:**  
When a new endpoint is needed, message team lead:
> "Need GET /api/results/{session_id} returning { output, files_changed, report_path }"

---

## Hour 36 — Go Public + Final Merge

```bash
# Team lead only

# 1. Final merge into dev
git checkout dev
git pull origin dev
git merge basil/ai-core --no-ff
git merge johann/ui --no-ff
git merge you/backend --no-ff
git push origin dev
git push main dev

# 2. Merge dev into main
git checkout main
git merge dev --no-ff -m "release: hackathon demo v1.0"
git tag v1.0.0

# 3. Push to both remotes
git push origin main --tags     # → silo-hq (submission URL)
git push main main --tags       # → your personal backup

# 4. Make silo-hq/elith PUBLIC
#    github.com/Silo-HQ/elith → Settings → Danger Zone → Make Public

# 5. Submission URL will be:
#    https://github.com/Silo-HQ/elith
```

---

## Emergency Protocols

### Broken code pushed to dev on silo-hq:
```bash
# Team lead only
git checkout dev
git revert HEAD --no-edit
git push origin dev
git push main dev
# Tell everyone to pull
```

### Someone's laptop crashed:
```bash
# They clone fresh from silo-hq
git clone https://github.com/Silo-HQ/elith.git
cd elith
git checkout [their-branch]
# Last pushed commit is safe — continue from there
```

### Merge conflict you can't solve:
```bash
git merge --abort
# Screenshot the conflict
# Message team lead immediately
```

---

## Quick Reference Card (Screenshot This)

```
REMOTES:
  origin = silo-hq (team repo — everyone)
  main   = your personal (you only)

YOUR BRANCH:
  Team Lead → you/backend
  Basil Joy → basil/ai-core
  Johann    → johann/ui

EVERY 2 HOURS:
  git add .
  git commit -m "wip: [what you did]"
  git push origin [your-branch]
  # Team lead also: git push main [your-branch]

BEFORE EVERY SYNC CALL:
  git checkout dev && git pull origin dev
  git checkout [your-branch] && git merge dev
  git push origin [your-branch]

NEVER:
  - Push directly to main branch
  - Touch someone else's folder
  - Sit on uncommitted work for more than 2 hours
  - Merge into dev yourself (team lead only)
```

---

*Elith GitHub Strategy — All Team Members — IBM Bob Hackathon 2026*
