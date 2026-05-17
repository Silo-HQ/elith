#!/bin/bash
# Elith Web Installer
# Usage: curl -fsSL https://elith.silohq.tech/install.sh | sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
INSTALL_DIR="$HOME/.elith"
BIN_DIR="$HOME/.local/bin"
REPO_URL="https://github.com/Silo-HQ/elith.git"
VERSION="latest"

echo -e "${BLUE}"
cat << "EOF"
  _____ _ _ _   _     
 | ____| (_) |_| |__  
 |  _| | | | __| '_ \ 
 | |___| | | |_| | | |
 |_____|_|_|\__|_| |_|
                      
Universal Repo-Aware AI Agent
EOF
echo -e "${NC}"

echo -e "${GREEN}Installing Elith...${NC}\n"

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}✗ Python 3 not found${NC}"
    echo -e "${YELLOW}Please install Python 3.10 or higher${NC}"
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
if [ "$(echo "$PYTHON_VERSION < 3.10" | bc)" -eq 1 ]; then
    echo -e "${RED}✗ Python 3.10+ required (found $PYTHON_VERSION)${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Python $PYTHON_VERSION${NC}"

# Check Node.js (optional but recommended)
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js $NODE_VERSION${NC}"
else
    echo -e "${YELLOW}⚠ Node.js not found (TUI features will be limited)${NC}"
fi

# Check git
if ! command -v git &> /dev/null; then
    echo -e "${RED}✗ Git not found${NC}"
    echo -e "${YELLOW}Please install git${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Git${NC}"

echo ""

# Create directories
echo -e "${BLUE}Creating directories...${NC}"
mkdir -p "$INSTALL_DIR"
mkdir -p "$BIN_DIR"
echo -e "${GREEN}✓ Directories created${NC}"

# Clone or update repository
if [ -d "$INSTALL_DIR/repo" ]; then
    echo -e "${BLUE}Updating existing installation...${NC}"
    cd "$INSTALL_DIR/repo"
    git pull origin main
else
    echo -e "${BLUE}Cloning repository...${NC}"
    git clone "$REPO_URL" "$INSTALL_DIR/repo"
fi
echo -e "${GREEN}✓ Repository ready${NC}"

# Create virtual environment
echo -e "${BLUE}Setting up Python environment...${NC}"
cd "$INSTALL_DIR/repo"
python3 -m venv "$INSTALL_DIR/venv"
source "$INSTALL_DIR/venv/bin/activate"
echo -e "${GREEN}✓ Virtual environment created${NC}"

# Install Python dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
pip install --upgrade pip > /dev/null 2>&1
pip install -e . > /dev/null 2>&1
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Install TUI dependencies if Node.js is available
if command -v node &> /dev/null && command -v npm &> /dev/null; then
    echo -e "${BLUE}Installing TUI dependencies...${NC}"
    cd "$INSTALL_DIR/repo/tui"
    npm install --silent > /dev/null 2>&1
    echo -e "${GREEN}✓ TUI dependencies installed${NC}"
fi

# Create wrapper script
echo -e "${BLUE}Creating elith command...${NC}"
cat > "$BIN_DIR/elith" << 'WRAPPER'
#!/bin/bash
# Elith wrapper script
ELITH_DIR="$HOME/.elith"
source "$ELITH_DIR/venv/bin/activate"
cd "$ELITH_DIR/repo"
python3 -m cli "$@"
WRAPPER

chmod +x "$BIN_DIR/elith"
echo -e "${GREEN}✓ Command created${NC}"

# Check if BIN_DIR is in PATH
if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
    echo ""
    echo -e "${YELLOW}⚠ $BIN_DIR is not in your PATH${NC}"
    echo -e "${YELLOW}Add this to your ~/.bashrc or ~/.zshrc:${NC}"
    echo -e "${BLUE}export PATH=\"\$HOME/.local/bin:\$PATH\"${NC}"
    echo ""
    echo -e "${YELLOW}Then run: source ~/.bashrc (or ~/.zshrc)${NC}"
fi

# Success message
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Elith installed successfully!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}Quick Start:${NC}"
echo -e "  1. Run: ${GREEN}elith${NC}"
echo -e "  2. Follow the setup wizard"
echo -e "  3. Start coding!"
echo ""
echo -e "${BLUE}Commands:${NC}"
echo -e "  ${GREEN}elith${NC}                  - Start interactive mode"
echo -e "  ${GREEN}elith init${NC}             - Configure providers"
echo -e "  ${GREEN}elith service status${NC}   - Check backend status"
echo -e "  ${GREEN}elith --help${NC}           - Show all commands"
echo ""
echo -e "${BLUE}Installation location:${NC} $INSTALL_DIR"
echo -e "${BLUE}Configuration:${NC} ~/.elith/config.toml"
echo ""
echo -e "${YELLOW}Need help? Visit: https://github.com/Silo-HQ/elith${NC}"
echo ""

# Made with Bob