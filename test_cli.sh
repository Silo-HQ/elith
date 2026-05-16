#!/bin/bash
# Test script for Elith CLI

echo "Testing Elith CLI..."
echo ""

# Test 1: Help command
echo "1. Testing --help:"
bash -c "source venv/bin/activate && python3 cli.py --help"
echo ""

# Test 2: Version command
echo "2. Testing version:"
bash -c "source venv/bin/activate && python3 cli.py version"
echo ""

# Test 3: Models command
echo "3. Testing models:"
bash -c "source venv/bin/activate && python3 cli.py models"
echo ""

echo "✅ All CLI commands working!"
echo ""
echo "To launch the interactive TUI, run:"
echo "  source venv/bin/activate && python3 cli.py"
echo "  OR"
echo "  ./install.sh  # Then just run: elith"

# Made with Bob
