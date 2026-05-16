# OpenRouter Integration - Quick Start

## Overview

OpenRouter is now integrated! You can test the full Elith system (TUI → Backend → OpenRouter → Skills) using your OpenRouter API key.

## Configuration

Your `.env` file is already configured with:

```bash
OPENROUTER_API_KEY="your-openrouter-api-key-here"
OPENROUTER_MODEL=openai/gpt-3.5-turbo
ELITH_BACKEND_URL=http://localhost:8000
```

## Available Models via OpenRouter

You can change `OPENROUTER_MODEL` to any of these:

- `openai/gpt-3.5-turbo` - Fast, good for testing
- `openai/gpt-4` - More capable
- `meta-llama/llama-3.1-8b-instruct` - Open source
- `anthropic/claude-3-sonnet` - Claude via OpenRouter
- And many more at https://openrouter.ai/models

## Testing Instructions

### Step 1: Start Backend (Terminal 1)

```bash
cd /Users/basiljoy/my_project/elith
uvicorn backend.main:app --reload --port 8000
```

Expected output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

### Step 2: Launch TUI (Terminal 2)

```bash
cd /Users/basiljoy/my_project/elith
python3 -m tui.app_new
```

The TUI will open with purple accents on black background.

### Step 3: Test Repository Awareness

Try these commands in the TUI:

#### Test 1: List Files
```
list files in this directory
```

Expected: OpenRouter model calls `list_files` skill and shows actual files.

#### Test 2: Read File
```
read the README.md file
```

Expected: Model calls `read_file` skill and shows actual content.

#### Test 3: Code Analysis
```
analyze the backend/skills/base_skill.py file
```

Expected: Model reads the file and provides analysis.

#### Test 4: Search Code
```
search for "BaseProvider" in the codebase
```

Expected: Model calls `search_code` skill and finds matches.

## Architecture Flow

```
User types in TUI
    ↓
TUI → HTTP POST → Backend (/api/chat)
    ↓
Backend → OpenRouterProvider
    ↓
OpenRouter API (with tools)
    ↓
Model calls repository skills
    ↓
Skills read actual files
    ↓
Response → Backend → TUI
    ↓
User sees Bob-level repository awareness
```

## What You'll See

### In Terminal 1 (Backend):
```
INFO:     Request: POST /api/chat
INFO:     Response: 200 (2.345s)
```

### In Terminal 2 (TUI):
1. Your message appears
2. "Thinking..." shows while processing
3. Response appears with actual repository data
4. No placeholder messages!

## Troubleshooting

### Error: "OPENROUTER_API_KEY not set"

**Solution:** Check `.env` file exists and contains the key.

### Error: "Cannot connect to backend"

**Solution:** Make sure Terminal 1 is running the backend server.

### Model doesn't call skills

**Possible causes:**
1. Model doesn't support function calling (try `openai/gpt-3.5-turbo`)
2. Skills not registered (check backend logs)
3. API key invalid (check OpenRouter dashboard)

### Response is generic (not repository-aware)

**Check:**
1. Backend logs show skill calls: `[Elith Skill: list_files(.)]`
2. Model supports function calling
3. Skills are returning data (not errors)

## Testing Checklist

- [ ] Backend starts without errors
- [ ] TUI launches and displays correctly
- [ ] Can send messages in TUI
- [ ] "Thinking..." appears while processing
- [ ] Response appears (not placeholder)
- [ ] Response contains actual repository data
- [ ] Backend logs show skill calls
- [ ] Can send multiple messages
- [ ] Error messages are helpful

## Demo Script

For demonstrating Elith's capabilities:

```bash
# Terminal 1
uvicorn backend.main:app --reload --port 8000

# Terminal 2
python3 -m tui.app_new
```

**In TUI, demonstrate:**

1. **Repository Awareness**
   ```
   list all Python files in the backend directory
   ```
   → Shows actual files

2. **Code Reading**
   ```
   read backend/skills/base_skill.py and explain the BaseSkill class
   ```
   → Reads real file and explains

3. **Code Search**
   ```
   find all files that import BaseProvider
   ```
   → Searches codebase and finds matches

4. **Architecture Analysis**
   ```
   analyze the provider architecture and explain how it works
   ```
   → Reads multiple files and provides analysis

## Success Criteria

✅ **Integration is working when:**

1. TUI sends message → Backend receives it
2. Backend routes to OpenRouter provider
3. OpenRouter model calls repository skills
4. Skills read actual files
5. Response contains real repository data
6. No "placeholder" or "pending" messages
7. Can have multi-turn conversation
8. Error handling works gracefully

## Cost Considerations

OpenRouter charges per token. Approximate costs:

- `openai/gpt-3.5-turbo`: ~$0.002 per 1K tokens
- `openai/gpt-4`: ~$0.03 per 1K tokens
- `meta-llama/llama-3.1-8b-instruct`: ~$0.0001 per 1K tokens

Each message with skills typically uses 500-2000 tokens.

## Next Steps

Once testing is complete:

1. ✅ Verify repository awareness works
2. ✅ Test with different models
3. ✅ Prepare demo for hackathon
4. ✅ Export session logs
5. ✅ Document impressive examples

---

**Status:** OpenRouter integration complete and ready for testing!
**Model:** Using `openai/gpt-3.5-turbo` via OpenRouter
**API Key:** Configured in `.env`