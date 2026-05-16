#!/bin/bash

# Quick test script for multi-agent system

echo "🚀 Testing Elith Multi-Agent System"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "Please create .env with:"
    echo "  OPENROUTER_API_KEY=your_key_here"
    echo "  OPENROUTER_MODEL=anthropic/claude-3.5-sonnet"
    exit 1
fi

# Check if OPENROUTER_API_KEY is set
source .env
if [ -z "$OPENROUTER_API_KEY" ]; then
    echo "❌ Error: OPENROUTER_API_KEY not set in .env"
    exit 1
fi

echo "✅ Environment configured"
echo ""

# Test 1: Check backend can start
echo "📋 Test 1: Starting backend..."
python3 -c "from backend.main import app; print('✅ Backend imports successfully')" || {
    echo "❌ Backend import failed"
    exit 1
}

# Test 2: Check orchestrator
echo "📋 Test 2: Testing orchestrator..."
python3 -c "
from backend.agents.orchestrator import AgentOrchestrator
from backend.providers.openrouter_provider import OpenRouterProvider
import os

provider = OpenRouterProvider(
    repo_path=os.getcwd(),
    api_key=os.getenv('OPENROUTER_API_KEY'),
    model=os.getenv('OPENROUTER_MODEL', 'anthropic/claude-3.5-sonnet')
)
orchestrator = AgentOrchestrator(provider, os.getcwd())
print('✅ Orchestrator initialized successfully')
" || {
    echo "❌ Orchestrator test failed"
    exit 1
}

# Test 3: Check TUI
echo "📋 Test 3: Testing TUI..."
python3 -c "from tui.app_new import ElithApp; print('✅ TUI imports successfully')" || {
    echo "❌ TUI import failed"
    exit 1
}

echo ""
echo "✅ All tests passed!"
echo ""
echo "🎯 Ready to test! Run these commands:"
echo ""
echo "Terminal 1:"
echo "  uvicorn backend.main:app --reload --port 8000"
echo ""
echo "Terminal 2:"
echo "  python3 -m tui.app_new"
echo ""
echo "Then in TUI, type:"
echo "  create me an itinerary application"
echo ""
echo "Watch for:"
echo "  💬 Agent communication"
echo "  ✅ Files being created"
echo "  📦 Real-time progress"
echo ""

# Made with Bob
