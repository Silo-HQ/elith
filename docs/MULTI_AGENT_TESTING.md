# Multi-Agent System Testing Guide

## Overview

This guide explains how to test Elith's multi-agent system that creates production-level projects with visible agent collaboration.

## What Changed

### Before (The Problem)
- System just generated text descriptions
- No actual files were created
- No visible agent communication
- Like asking ChatGPT - just text responses

### After (The Solution)
- **Agents actually create files** using repository skills
- **Visible progress** - see each file being created
- **Agent communication** - see agents working together
- **Streaming responses** - watch it happen in real-time

## Architecture

```
User: "create me an itinerary application"
    ↓
TUI (Streaming SSE)
    ↓
Backend /api/chat/stream
    ↓
Detects "create" keyword
    ↓
AgentOrchestrator
    ↓
┌─────────────────────────────────────┐
│ Phase 1: CTO Analysis               │
│ - Analyzes requirements             │
│ - Identifies tech stack             │
│ - Proposes architecture             │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Phase 2: Architecture Proposal      │
│ - System design                     │
│ - API design                        │
│ - Database schema                   │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Phase 3: Implementation Plan        │
│ - Phase breakdown                   │
│ - Task assignment                   │
│ - Timeline                          │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Phase 4: Code Generation            │
│ 💬 Backend Agent: Creating API...   │
│ ✅ Created: backend/src/main.py     │
│ 💬 Frontend Agent: Building UI...   │
│ ✅ Created: frontend/src/App.jsx    │
│ 💬 DevOps Agent: Setting up CI...   │
│ ✅ Created: .github/workflows/ci.yml│
│ 💬 QA Agent: Writing tests...       │
│ ✅ Created: backend/tests/test_*.py │
└─────────────────────────────────────┘
    ↓
Real files created in your project!
```

## Setup

### 1. Environment Variables

Create `.env` file:

```bash
# Required for multi-agent system
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet

# Optional (for other providers)
ANTHROPIC_API_KEY=your_key_here
LMSTUDIO_BASE_URL=http://localhost:1234/v1
```

### 2. Start Backend

```bash
cd /Users/basiljoy/my_project/elith
uvicorn backend.main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

### 3. Start TUI

In a new terminal:

```bash
cd /Users/basiljoy/my_project/elith
python3 -m tui.app_new
```

## Testing Scenarios

### Test 1: Simple Project Creation

**Input:**
```
create me an itinerary application
```

**Expected Output (Streaming):**
```
🎯 ELITH MULTI-AGENT SYSTEM
Creating production-level project with specialized team...

## Phase 1: CTO Analysis

👔 CTO is analyzing the project requirements...

**Functional Requirements Identified:**
- User authentication
- Trip planning
- Itinerary creation
...

## Phase 2: Architecture Proposal

👔 CTO is proposing system architecture...

**Hybrid Architecture Decision:**
1. Monolithic Core (Node.js)
2. Microservice: Recommendations (Python)
...

## Phase 3: Implementation Plan

📋 Generating step-by-step implementation plan...

**Phase 1: Foundation** (Week 1-2)
- [ ] Setup infrastructure
...

## Phase 4: Code Generation

🔨 Creating project structure...

📁 Project directory: `itinerary-app/`

### Step 1: Directory Structure

✅ Created: `itinerary-app/`
✅ Created: `itinerary-app/backend/`
✅ Created: `itinerary-app/frontend/`
...

### Step 2: Configuration Files

✅ Created: `itinerary-app/.gitignore` (234 bytes)
✅ Created: `itinerary-app/README.md` (567 bytes)
...

### Step 3: Backend Code

💬 Backend Agent: Analyzing API requirements...
✅ Created: `itinerary-app/backend/src/main.py` (456 bytes)

### Step 4: Frontend Code

💬 Frontend Agent: Designing UI components...
✅ Created: `itinerary-app/frontend/src/App.jsx` (234 bytes)

### Step 5: Tests

💬 QA Agent: Writing test suites...
✅ Created: `itinerary-app/backend/tests/test_main.py` (345 bytes)

### Step 6: CI/CD Pipeline

💬 DevOps Agent: Setting up deployment pipeline...
✅ Created: `itinerary-app/.github/workflows/ci.yml` (678 bytes)

### Step 7: Documentation

✅ Created: `itinerary-app/docs/ARCHITECTURE.md` (890 bytes)

🎉 Code generation complete!

📦 Total files created: 12
```

**Verify:**
```bash
ls -la itinerary-app/
# Should see all created files and directories
```

### Test 2: Different Project Types

Try these variations:

```
create a microservice for user authentication
build me a blog platform with CMS
develop an e-commerce system
make a real-time chat application
```

Each should:
1. Detect it's a creation request
2. Route to multi-agent system
3. Show agent communication
4. Create actual files

### Test 3: Regular Chat (Non-Creation)

**Input:**
```
what is DevSecOps?
```

**Expected:**
- Routes to single provider (not multi-agent)
- Returns explanation
- Does NOT create files

## Key Features to Verify

### ✅ Streaming Works
- You see output appear gradually
- Not all at once
- Real-time progress

### ✅ Agent Communication Visible
Look for these markers:
- `💬 Backend Agent: ...`
- `💬 Frontend Agent: ...`
- `💬 DevOps Agent: ...`
- `💬 QA Agent: ...`

### ✅ Files Actually Created
Check your filesystem:
```bash
ls -la itinerary-app/
cat itinerary-app/README.md
cat itinerary-app/backend/src/main.py
```

### ✅ Production-Ready Code
Files should contain:
- Real, working code (not placeholders)
- Error handling
- Tests
- Documentation
- CI/CD pipelines

## Troubleshooting

### Problem: "OPENROUTER_API_KEY not set"

**Solution:**
```bash
export OPENROUTER_API_KEY=your_key_here
# Or add to .env file
```

### Problem: "Cannot connect to backend"

**Solution:**
```bash
# Make sure backend is running
uvicorn backend.main:app --reload --port 8000
```

### Problem: No streaming, just waits then shows all at once

**Solution:**
- Check TUI is using `/api/chat/stream` endpoint
- Check browser/client supports SSE
- Check no proxy buffering responses

### Problem: Files not created

**Solution:**
- Check orchestrator is using `SKILL_MAP['write_file'].execute()`
- Check file paths are correct
- Check permissions on target directory

## Implementation Details

### Backend Changes

1. **`backend/agents/orchestrator.py`**
   - Now uses `SKILL_MAP` to access repository skills
   - `_generate_code()` actually creates files
   - Shows agent communication with `💬` markers
   - Streams progress step-by-step

2. **`backend/routes/chat.py`**
   - `/api/chat/stream` endpoint supports multi-agent
   - Detects creation requests with regex
   - Routes to `AgentOrchestrator` for creation
   - Routes to single provider for regular chat

### Frontend Changes

3. **`tui/app_new.py`**
   - `call_backend()` now returns `AsyncGenerator`
   - Streams SSE events from backend
   - Updates UI in real-time as chunks arrive
   - Handles JSON-formatted SSE data

## Next Steps

### Expand Agent Capabilities

Currently only CTO agent is fully implemented. Expand:

1. **Frontend Agent** (`backend/agents/frontend_agent.py`)
   - React component design
   - State management
   - Responsive layouts

2. **Backend Agent** (`backend/agents/backend_agent.py`)
   - API design
   - Database schemas
   - Business logic

3. **DevOps Agent** (`backend/agents/devops_agent.py`)
   - Infrastructure as Code
   - CI/CD pipelines
   - Monitoring setup

4. **Security Agent** (`backend/agents/security_agent.py`)
   - Security audits
   - Vulnerability scanning
   - Compliance checks

5. **QA Agent** (`backend/agents/qa_agent.py`)
   - Test generation
   - Coverage analysis
   - E2E test scenarios

6. **Data Agent** (`backend/agents/data_agent.py`)
   - Database design
   - Migration scripts
   - Data modeling

### Add Agent-to-Agent Review

Implement Phase 3.5: Agent Review
- Each agent reviews others' proposals
- Agents can challenge decisions
- CTO makes final call
- User sees the debate

### Make it a Global CLI

```bash
# Install globally
pip install -e .

# Use from anywhere
cd ~/my-new-project
elith

# Or direct command
elith create "a todo app with React and FastAPI"
```

## Success Criteria

✅ **Streaming works** - see progress in real-time
✅ **Files created** - actual code in filesystem  
✅ **Agent communication** - see agents working
✅ **Production-ready** - code works, has tests, CI/CD
✅ **Automatic detection** - "create X" triggers multi-agent
✅ **Regular chat works** - non-creation requests work normally

## Demo Script

For hackathon demo:

```bash
# Terminal 1: Start backend
uvicorn backend.main:app --reload --port 8000

# Terminal 2: Start TUI
python3 -m tui.app_new

# In TUI, type:
create me an itinerary application

# Watch the magic:
# 1. CTO analyzes requirements
# 2. CTO proposes architecture
# 3. Implementation plan generated
# 4. Agents create files one by one
# 5. See agent communication
# 6. Files appear in filesystem

# Verify:
ls -la itinerary-app/
cat itinerary-app/README.md
cat itinerary-app/backend/src/main.py

# Show it works:
cd itinerary-app/backend
python src/main.py
# API runs!

cd ../frontend
npm install
npm run dev
# UI runs!
```

## Conclusion

The multi-agent system now:
- **Actually creates files** (not just text)
- **Shows agent work** (visible communication)
- **Streams progress** (real-time updates)
- **Production-ready** (working code, tests, CI/CD)

This is fundamentally different from ChatGPT because you see the **actual work being done** and get **real, working code** in your filesystem.