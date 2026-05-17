#!/bin/bash

# Elith Web UI Startup Script
# Starts both backend API and frontend dev server

set -e

echo "🚀 Starting Elith Web UI..."
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
    echo ""
fi

# Activate virtual environment and install dependencies
echo "📦 Installing Python dependencies..."
source venv/bin/activate
pip install -q -r requirements.txt
echo "✅ Python dependencies installed"
echo ""

# Check if node_modules exists in frontend
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    echo "✅ Frontend dependencies installed"
    echo ""
fi

# Start backend API
echo "🔧 Starting backend API on http://localhost:8001..."
source venv/bin/activate
uvicorn backend.main:app --reload --port 8001 > /dev/null 2>&1 &
BACKEND_PID=$!
echo "✅ Backend API started (PID: $BACKEND_PID)"
echo ""

# Wait a moment for backend to start
sleep 2

# Start frontend dev server
echo "🎨 Starting frontend dev server on http://localhost:3000..."
cd frontend
npm run dev > /dev/null 2>&1 &
FRONTEND_PID=$!
cd ..
echo "✅ Frontend dev server started (PID: $FRONTEND_PID)"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Elith Web UI is running!"
echo ""
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8001"
echo "   API Docs: http://localhost:8001/docs"
echo ""
echo "   Backend PID:  $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "To stop both servers, run:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Save PIDs to file for easy cleanup
echo "$BACKEND_PID" > .elith-web.pid
echo "$FRONTEND_PID" >> .elith-web.pid

# Keep script running
wait

# Made with Bob
