# Quick Start: Test Multi-Agent System

## The Issue

The `itinerary-app/` directory doesn't exist yet because you haven't run the system. The code is ready, but you need to execute it to see files being created.

## What You Need

1. **OpenRouter API Key** (required for multi-agent system)
   - Get one at: https://openrouter.ai/
   - Free tier available

2. **Environment Setup**
   ```bash
   # Create .env file
   cat > .env << EOF
   OPENROUTER_API_KEY=your_actual_key_here
   OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
   EOF
   ```

## Quick Test (3 Steps)

### Step 1: Verify Setup
```bash
cd /Users/basiljoy/my_project/elith
./test_multi_agent.sh
```

Expected output:
```
🚀 Testing Elith Multi-Agent System
✅ Environment configured
📋 Test 1: Starting backend...
✅ Backend imports successfully
📋 Test 2: Testing orchestrator...
✅ Orchestrator initialized successfully
📋 Test 3: Testing TUI...
✅ TUI imports successfully
✅ All tests passed!
```

### Step 2: Start Backend (Terminal 1)
```bash
cd /Users/basiljoy/my_project/elith
uvicorn backend.main:app --reload --port 8000
```

Wait for:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

### Step 3: Start TUI (Terminal 2)
```bash
cd /Users/basiljoy/my_project/elith
python3 -m tui.app_new
```

## Test It!

In the TUI, type:
```
create me an itinerary application
```

## What You'll See

### In TUI (Real-Time Streaming):
```
You  16:42
create me an itinerary application

● BOB  16:42

🎯 ELITH MULTI-AGENT SYSTEM
Creating production-level project with specialized team...

## Phase 1: CTO Analysis

👔 CTO is analyzing the project requirements...

**Functional Requirements Identified:**
- User authentication and profiles
- Trip planning and itinerary creation
...

## Phase 4: Code Generation

🔨 Creating project structure...

📁 Project directory: `itinerary-app/`

### Step 1: Directory Structure

✅ Created: `itinerary-app/`
✅ Created: `itinerary-app/backend/`
✅ Created: `itinerary-app/frontend/`

### Step 2: Configuration Files

✅ Created: `itinerary-app/.gitignore` (234 bytes)
✅ Created: `itinerary-app/README.md` (567 bytes)

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

🎉 Code generation complete!
📦 Total files created: 12
```

### In Your Filesystem:
```bash
# After the TUI shows "Code generation complete!"
cd /Users/basiljoy/my_project/elith
ls -la itinerary-app/

# You should see:
drwxr-xr-x  8 user  staff   256 May 16 16:42 .
drwxr-xr-x  5 user  staff   160 May 16 16:42 ..
drwxr-xr-x  3 user  staff    96 May 16 16:42 .github
-rw-r--r--  1 user  staff   234 May 16 16:42 .gitignore
-rw-r--r--  1 user  staff   567 May 16 16:42 README.md
drwxr-xr-x  4 user  staff   128 May 16 16:42 backend
drwxr-xr-x  3 user  staff    96 May 16 16:42 docs
drwxr-xr-x  5 user  staff   160 May 16 16:42 frontend

# Check the files:
cat itinerary-app/README.md
cat itinerary-app/backend/src/main.py
```

## Key Points

1. **Files are created DURING execution** - not before
2. **You must run the TUI** to trigger file creation
3. **Streaming shows progress** - watch files being created in real-time
4. **Agent communication is visible** - see 💬 markers

## Troubleshooting

### "OPENROUTER_API_KEY not set"
```bash
# Make sure .env exists and has your key
cat .env
# Should show: OPENROUTER_API_KEY=sk-or-v1-...
```

### "Cannot connect to backend"
```bash
# Make sure backend is running in Terminal 1
# You should see: INFO: Uvicorn running on http://127.0.0.1:8000
```

### "No files created"
- Make sure you typed a creation request: "create me a..."
- Check TUI shows "🎯 ELITH MULTI-AGENT SYSTEM"
- Wait for "🎉 Code generation complete!"
- Then check filesystem

## What Makes This Different from ChatGPT

| ChatGPT | Elith Multi-Agent |
|---------|-------------------|
| Just text | **Real files created** |
| Copy/paste needed | **Works immediately** |
| All at once | **Streaming progress** |
| Single response | **Multiple agents visible** |

## Next Steps

After testing:
1. Read [`docs/WHAT_CHANGED.md`](docs/WHAT_CHANGED.md) - detailed explanation
2. Read [`docs/MULTI_AGENT_TESTING.md`](docs/MULTI_AGENT_TESTING.md) - comprehensive guide
3. Try different projects: "create a blog platform", "build a microservice"

## Summary

The code is ready. You just need to:
1. Set OPENROUTER_API_KEY in .env
2. Run backend: `uvicorn backend.main:app --reload --port 8000`
3. Run TUI: `python3 -m tui.app_new`
4. Type: `create me an itinerary application`
5. Watch files being created in real-time!

The `itinerary-app/` directory will appear AFTER you run this test.