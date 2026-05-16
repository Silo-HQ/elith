#!/usr/bin/env python3
"""
Elith CLI - Command-line interface for Elith
Usage: elith [command] [options]
"""

import sys
import argparse
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent))


def main():
    """Main CLI entry point"""
    parser = argparse.ArgumentParser(
        prog='elith',
        description='Elith - Universal repo-aware agent framework\n\nRun "elith" without arguments to launch the interactive TUI.',
        epilog='For more information, visit: https://github.com/yourusername/elith',
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # explain command
    explain_parser = subparsers.add_parser('explain', help='Explain repository architecture')
    explain_parser.add_argument('path', nargs='?', default='.', help='Path to analyze')
    explain_parser.add_argument('--model', default='bob', help='Model to use (bob, claude, gemini, gpt)')
    explain_parser.add_argument('--vault', help='Path to Obsidian vault')
    
    # architect command
    architect_parser = subparsers.add_parser('architect', help='Generate novel architecture proposals')
    architect_parser.add_argument('--problem', required=True, help='Problem to solve')
    architect_parser.add_argument('--model', default='bob', help='Model to use')
    architect_parser.add_argument('--vault', help='Path to Obsidian vault')
    
    # refactor command
    refactor_parser = subparsers.add_parser('refactor', help='Refactor a module')
    refactor_parser.add_argument('path', help='Path to file/module to refactor')
    refactor_parser.add_argument('--model', default='bob', help='Model to use')
    refactor_parser.add_argument('--focus', help='Specific refactoring focus')
    
    # test-gen command
    test_parser = subparsers.add_parser('test-gen', help='Generate missing tests')
    test_parser.add_argument('path', help='Path to file/module')
    test_parser.add_argument('--model', default='bob', help='Model to use')
    test_parser.add_argument('--coverage', action='store_true', help='Show coverage report')
    
    # scan command
    scan_parser = subparsers.add_parser('scan', help='Scan repository structure')
    scan_parser.add_argument('path', nargs='?', default='.', help='Path to scan')
    scan_parser.add_argument('--depth', type=int, default=3, help='Scan depth')
    
    # vault command
    vault_parser = subparsers.add_parser('vault', help='Manage Obsidian vault')
    vault_parser.add_argument('action', choices=['init', 'list', 'search'], help='Vault action')
    vault_parser.add_argument('--path', help='Vault path')
    vault_parser.add_argument('--query', help='Search query')
    
    # models command
    models_parser = subparsers.add_parser('models', help='List available models')
    models_parser.add_argument('--configure', action='store_true', help='Configure models')
    
    # version command
    subparsers.add_parser('version', help='Show version information')
    
    # tui command
    subparsers.add_parser('tui', help='Launch terminal UI')
    
    args = parser.parse_args()
    
    # Launch TUI by default when no command is provided (like Bob CLI)
    if not args.command:
        print("🚀 Launching Elith TUI...")
        try:
            from tui.app import main as tui_main
            tui_main()
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
        except Exception as e:
            print(f"\n❌ Error launching TUI: {e}")
            print("\nTry running: elith --help")
        return
    
    # Handle commands
    if args.command == 'version':
        print("Elith v0.1.0")
        print("Universal repo-aware agent framework")
        return
    
    if args.command == 'tui':
        print("🚀 Launching Elith TUI...")
        from tui.app import main as tui_main
        tui_main()
        return
    
    if args.command == 'explain':
        print(f"📖 Explaining repository: {args.path}")
        print(f"   Model: {args.model}")
        if args.vault:
            print(f"   Vault: {args.vault}")
        print("\n⚠️  Backend integration pending - this will connect to FastAPI backend")
        return
    
    if args.command == 'architect':
        print(f"🏗️  Generating architecture proposals for: {args.problem}")
        print(f"   Model: {args.model}")
        print("\n⚠️  Backend integration pending - this will connect to FastAPI backend")
        return
    
    if args.command == 'refactor':
        print(f"🔧 Refactoring: {args.path}")
        print(f"   Model: {args.model}")
        if args.focus:
            print(f"   Focus: {args.focus}")
        print("\n⚠️  Backend integration pending - this will connect to FastAPI backend")
        return
    
    if args.command == 'test-gen':
        print(f"🧪 Generating tests for: {args.path}")
        print(f"   Model: {args.model}")
        print("\n⚠️  Backend integration pending - this will connect to FastAPI backend")
        return
    
    if args.command == 'scan':
        print(f"🔍 Scanning repository: {args.path}")
        try:
            from backend.context_engine.repo_scanner import RepoScanner
            scanner = RepoScanner(args.path)
            structure = scanner.scan()
            print(f"\n📊 Repository scanned successfully")
        except Exception as e:
            print(f"⚠️  Scan functionality pending: {e}")
        return
    
    if args.command == 'vault':
        if args.action == 'init':
            print("📝 Initializing Obsidian vault...")
            print("⚠️  Vault initialization pending")
        elif args.action == 'list':
            print("📚 Listing vault notes...")
            print("⚠️  Vault listing pending")
        elif args.action == 'search':
            print(f"🔎 Searching vault for: {args.query}")
            print("⚠️  Vault search pending")
        return
    
    if args.command == 'models':
        print("🤖 Available Models:")
        print("   • IBM Bob (native repo access)")
        print("   • Claude (via Anthropic API)")
        print("   • Gemini (via Google AI SDK)")
        print("   • GPT-4 (via OpenAI API)")
        print("   • Local LLM (via Ollama)")
        if args.configure:
            print("\n⚙️  Model configuration pending")
        return


if __name__ == "__main__":
    main()

# Made with Bob
