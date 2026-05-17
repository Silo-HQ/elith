#!/bin/bash
# Run the enhanced TUI demo

echo "🚀 Starting Enhanced Elith TUI Demo..."
echo ""
echo "This demo showcases:"
echo "  ✨ 8 Beautiful Themes"
echo "  🎬 Smooth Animations"
echo "  📊 Progress Bars"
echo "  📱 Split Panes"
echo "  📑 Tabs System"
echo "  🗂️ File Tree"
echo ""
echo "Press Ctrl+C to exit"
echo "Press Ctrl+Shift+T to cycle themes"
echo ""
sleep 2

cd "$(dirname "$0")"
npm run demo

# Made with Bob
