# Elith - Quick Start Guide

## Prerequisites

1. **Python 3.10+** installed
2. **API Keys** (at least one):
   - Anthropic API key for Claude
   - Google API key for Gemini
   - OpenAI API key for GPT
   - Or use Ollama for local LLMs (no API key needed)

---

## Step 1: Install Dependencies

```bash
# Install all required packages
pip install anthropic google-generativeai openai ollama textual pyfiglet httpx fastapi uvicorn
```

---

## Step 2: Configure Environment

Create a `.env` file in the project root:

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your API keys
nano .env  # or use your preferred editor
```

Example `.env` configuration:
```env
# Enable at least one provider
ANTHROPIC_API_KEY=your_anthropic_key_here
GOOGLE_API_KEY=your_google_key_here
OPENAI_API_KEY=your_openai_key_here

# Or enable local LLM (no API key needed)
OLLAMA_ENABLED=true
OLLAMA_MODEL=llama3.1

# Optional: Enable Bob (requires Bob CLI installed)
BOB_ENABLED=false
```

---

## Step 3: Start the Backend

Open a terminal and run:

```bash
cd backend
python main.py
```

You should see:
```
INFO:     Started server process
INFO:     Uvicorn running on http://127.0.0.1:8000
```

**Keep this terminal running!**

---

## Step 4: Start the TUI

### Option A: Single-Panel Chat Interface

Open a **new terminal** and run:

```bash
cd tui
python app_new.py
```

### Option B: Multi-Agent Interface (Recommended)

Open a **new terminal** and run:

```bash
# Make the script executable (first time only)
chmod +x run_multi_agent_tui.sh

# Run the multi-agent TUI
./run_multi_agent_tui.sh
```

Or manually:
```bash
cd tui
python app_multi_agent.py
```

---

## Step 5: Test It Out

### Single-Panel TUI

1. Type your message in the input box at the bottom
2. Press **Enter** to send
3. Watch the AI respond in real-time

Example prompts:
```
explain the backend architecture
list all the skills available
read the README file
```

### Multi-Agent TUI

1. Type your prompt in the input field at the bottom
2. Press **Enter** to submit
3. Watch 4 agent panels update simultaneously:
   - **Orchestrator**: Manages workflow
   - **Research**: Fetches data
   - **Code Gen**: Creates files
   - **Review**: Quality checks

Example prompts:
```
create me a task management application
build a real-time chat app
develop a blog platform with authentication
```

---

## What You'll See

### Project Creation Flow

When you request a project (e.g., "create me a blog app"):

1. **Detection**: System detects it's a project creation request
2. **Routing**: Routes to multi-agent orchestrator
3. **Phase 1 - Analysis**: CTO analyzes requirements
4. **Phase 2 - Architecture**: Agents propose system design
5. **Phase 3 - Planning**: Break down into phases
6. **Phase 4 - Implementation**: Generate code with tests, docs, CI/CD

### Real File Creation

The system actually creates files using repository skills:
```
✓ Created: task-app/package.json
✓ Created: task-app/src/App.tsx
✓ Created: task-app/src/components/TaskList.tsx
✓ Created: task-app/backend/server.py
✓ Created: task-app/tests/test_tasks.py
✓ Created: task-app/.github/workflows/ci.yml
```

---

## Troubleshooting

### Backend Won't Start

**Error**: `ModuleNotFoundError: No module named 'anthropic'`

**Solution**: Install dependencies
```bash
pip install anthropic google-generativeai openai ollama textual pyfiglet httpx fastapi uvicorn
```

### TUI Shows "Connection Error"

**Problem**: Backend not running

**Solution**: 
1. Check if backend is running on http://localhost:8000
2. Start backend in a separate terminal: `cd backend && python main.py`

### "No API Key Configured"

**Problem**: Missing API keys in `.env`

**Solution**:
1. Copy `.env.example` to `.env`
2. Add at least one API key
3. Or enable Ollama for local LLM (no API key needed)

### Multi-Agent TUI Not Showing Updates

**Problem**: Backend streaming not working

**Solution**:
1. Check backend logs for errors
2. Verify API key is valid
3. Try single-panel TUI first to isolate issue

---

## Testing Individual Components

### Test a Skill Directly

```bash
python -c "
from backend.skills.read_file import ReadFileSkill
skill = ReadFileSkill()
result = skill.execute('.', 'README.md')
print(result)
"
```

### Test a Provider

```bash
python -c "
from backend.providers.claude_provider import ClaudeProvider
import os
provider = ClaudeProvider('.', os.environ['ANTHROPIC_API_KEY'])
for chunk in provider.run('List the main files in this project', ''):
    print(chunk, end='', flush=True)
"
```

### Test Project Creation Detection

```bash
python test_detection.py
```

---

## Advanced Usage

### Use Different Providers

Edit `.env` to enable/disable providers:

```env
# Use Claude (Anthropic)
ANTHROPIC_API_KEY=your_key
DEFAULT_PROVIDER=claude

# Use Gemini (Google)
GOOGLE_API_KEY=your_key
DEFAULT_PROVIDER=gemini

# Use GPT-4 (OpenAI)
OPENAI_API_KEY=your_key
DEFAULT_PROVIDER=openai

# Use Local LLM (Ollama)
OLLAMA_ENABLED=true
OLLAMA_MODEL=llama3.1
DEFAULT_PROVIDER=ollama
```

### Run Architecture Analysis

```bash
python -c "
from backend.operations.architect import run_architect
from backend.providers.claude_provider import ClaudeProvider
import os

provider = ClaudeProvider('.', os.environ['ANTHROPIC_API_KEY'])
result = run_architect(provider, '.', 'backend architecture')
print(result)
"
```

---

## Next Steps

1. **Try Project Creation**: Ask to create different types of apps
2. **Explore Skills**: Use read_file, search_code, list_files
3. **Test Providers**: Switch between Claude, Gemini, GPT, Ollama
4. **Review Generated Code**: Check the quality of created projects
5. **Customize Agents**: Modify agent prompts in `backend/agents/`

---

## Key Commands Summary

```bash
# Install dependencies
pip install anthropic google-generativeai openai ollama textual pyfiglet httpx fastapi uvicorn

# Configure environment
cp .env.example .env
nano .env  # Add your API keys

# Start backend (Terminal 1)
cd backend && python main.py

# Start single-panel TUI (Terminal 2)
cd tui && python app_new.py

# Start multi-agent TUI (Terminal 2 - alternative)
./run_multi_agent_tui.sh

# Test detection
python test_detection.py
```

---

## Demo Scenario

**Perfect for showing off Elith:**

1. Start backend and multi-agent TUI
2. Press Ctrl+N (or type): "create me a real-time chat application"
3. Watch as:
   - Orchestrator coordinates the workflow
   - Research agent analyzes requirements
   - Code Gen creates actual files
   - Review agent validates quality
4. Check the created project directory
5. Show the generated code, tests, and CI/CD configuration

**This demonstrates:**
- Multi-agent collaboration
- Real file creation (not just text)
- Production-quality code generation
- Visible agent communication
- Repository-aware capabilities

---

**You're ready to use Elith!** 🚀

For more details, see:
- [`docs/MULTI_AGENT_TESTING.md`](MULTI_AGENT_TESTING.md) - Comprehensive testing guide
- [`docs/WHAT_CHANGED.md`](WHAT_CHANGED.md) - Recent changes and fixes
- [`docs/MY_TASK/COMPLETION_SUMMARY.md`](MY_TASK/COMPLETION_SUMMARY.md) - Full project overview