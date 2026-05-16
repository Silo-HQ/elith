#!/bin/bash

# Run the advanced Elith TUI (Hermes Agent style)

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   ELITH Advanced TUI - Starting...    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${RED}Error: Virtual environment not found!${NC}"
    echo -e "${YELLOW}Please run ./install.sh first${NC}"
    exit 1
fi

# Activate virtual environment
echo -e "${GREEN}→${NC} Activating virtual environment..."
source venv/bin/activate

# Check if backend is running
echo -e "${GREEN}→${NC} Checking backend connection..."
if ! curl -s http://localhost:8000/api/models > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠ Backend not detected at http://localhost:8000${NC}"
    echo -e "${YELLOW}  The TUI will start but some features may not work.${NC}"
    echo -e "${YELLOW}  Start the backend with: python -m uvicorn backend.main:app --reload${NC}"
    echo ""
fi

# Run the advanced TUI
echo -e "${GREEN}→${NC} Launching advanced TUI..."
echo ""
python3 -m tui.app_advanced

# Deactivate virtual environment on exit
deactivate

# Made with Bob
