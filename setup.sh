#!/bin/bash

# Elith Setup Script
# This script sets up both the frontend and backend/TUI environments

set -e  # Exit on error

echo "🚀 Setting up Elith..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.10 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo ""
echo "📦 Setting up Python virtual environment..."

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✅ Virtual environment created"
else
    echo "✅ Virtual environment already exists"
fi

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
echo ""
echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt
echo "✅ Python dependencies installed"

# Setup frontend
echo ""
echo "📦 Setting up frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ Frontend dependencies installed"
else
    echo "✅ Frontend dependencies already installed"
fi
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To run the project:"
echo ""
echo "  Backend/TUI:"
echo "    source venv/bin/activate"
echo "    python tui/app.py              # Run TUI"
echo "    python -m uvicorn backend.main:app --reload  # Run backend API"
echo ""
echo "  Frontend:"
echo "    cd frontend && npm run dev     # Run frontend dev server"
echo ""

# Made with Bob
