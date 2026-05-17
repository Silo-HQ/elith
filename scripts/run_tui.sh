#!/bin/bash
# Elith TUI Runner Script - TypeScript Version
# This script runs the TypeScript-based TUI

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Change to project root
cd "$SCRIPT_DIR"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      ELITH TUI - Starting...          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed!${NC}"
    echo -e "${YELLOW}Please install Node.js from https://nodejs.org/${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed!${NC}"
    echo -e "${YELLOW}Please install npm${NC}"
    exit 1
fi

# Navigate to TUI directory
cd tui

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${GREEN}→${NC} Installing dependencies..."
    npm install
fi

# Check if backend is running
echo -e "${GREEN}→${NC} Checking backend connection..."
if ! curl -s http://localhost:8000/api/models > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠ Backend not detected at http://localhost:8000${NC}"
    echo -e "${YELLOW}  The TUI will start but some features may not work.${NC}"
    echo -e "${YELLOW}  Start the backend with: python -m uvicorn backend.main:app --reload${NC}"
    echo ""
fi

# Run the TUI
echo -e "${GREEN}→${NC} Launching TUI..."
echo ""
npm run dev

# Made with Bob
