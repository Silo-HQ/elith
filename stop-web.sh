#!/bin/bash

# Elith Web UI Stop Script
# Stops both backend API and frontend dev server

echo "🛑 Stopping Elith Web UI..."
echo ""

# Check if PID file exists
if [ -f ".elith-web.pid" ]; then
    # Read PIDs from file
    BACKEND_PID=$(sed -n '1p' .elith-web.pid)
    FRONTEND_PID=$(sed -n '2p' .elith-web.pid)
    
    # Kill backend
    if [ -n "$BACKEND_PID" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
        echo "🔧 Stopping backend API (PID: $BACKEND_PID)..."
        kill "$BACKEND_PID"
        echo "✅ Backend stopped"
    else
        echo "⚠️  Backend not running"
    fi
    
    # Kill frontend
    if [ -n "$FRONTEND_PID" ] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
        echo "🎨 Stopping frontend dev server (PID: $FRONTEND_PID)..."
        kill "$FRONTEND_PID"
        echo "✅ Frontend stopped"
    else
        echo "⚠️  Frontend not running"
    fi
    
    # Remove PID file
    rm .elith-web.pid
    echo ""
    echo "✨ Elith Web UI stopped successfully"
else
    echo "⚠️  No PID file found. Attempting to kill by process name..."
    pkill -f "uvicorn backend.main:app"
    pkill -f "vite"
    echo "✅ Processes killed"
fi

# Made with Bob
