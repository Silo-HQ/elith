#!/usr/bin/env python3
"""
Elith CLI - Standalone command-line interface for Elith
Universal repo-aware AI agent framework
"""

import os
import sys
import argparse
import json
from pathlib import Path
from typing import Optional, Dict, Generator
from datetime import datetime

# Rich imports for beautiful terminal output
from rich.console import Console
from rich.markdown import Markdown
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.prompt import Prompt, Confirm
from rich.table import Table
from rich.live import Live
from rich.text import Text

# Backend imports
from backend.context_engine.repo_scanner import RepoScanner
from backend.context_engine.packet_builder import PacketBuilder
from backend.models.task_packet import TaskPacket
from backend.providers.claude_provider import ClaudeProvider
from backend.providers.lmstudio_provider import LMStudioProvider
from backend.providers.openrouter_provider import OpenRouterProvider
from backend.skills import ALL_SKILLS
from backend.utils.service_manager import get_service_manager

# Initialize rich console
console = Console()

# Version
VERSION = "0.1.0"

# Config file path
CONFIG_PATH = Path.home() / ".elith" / "config.toml"


def load_config() -> Optional[Dict]:
    """Load configuration from ~/.elith/config.toml"""
    if not CONFIG_PATH.exists():
        return None
    
    try:
        import tomli
        with open(CONFIG_PATH, "rb") as f:
            return tomli.load(f)
    except ImportError:
        # Fallback to manual parsing for simple TOML
        config = {"default": {}, "claude": {}, "lmstudio": {}, "openrouter": {}}
        current_section = None
        
        with open(CONFIG_PATH, "r") as f:
            for line in f:
                line = line.strip()
                if line.startswith("[") and line.endswith("]"):
                    current_section = line[1:-1]
                elif "=" in line and current_section:
                    key, value = line.split("=", 1)
                    key = key.strip()
                    value = value.strip().strip('"')
                    config[current_section][key] = value
        
        return config
    except Exception as e:
        console.print(f"[red]Error loading config: {e}[/red]")
        return None


def save_config(config: Dict):
    """Save configuration to ~/.elith/config.toml"""
    CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
    
    with open(CONFIG_PATH, "w") as f:
        for section, values in config.items():
            f.write(f"[{section}]\n")
            for key, value in values.items():
                f.write(f'{key} = "{value}"\n')
            f.write("\n")
    
    console.print(f"[green]✓ Config saved to {CONFIG_PATH}[/green]")


def init_wizard():
    """Interactive setup wizard with arrow key navigation"""
    import sys
    import tty
    import termios
    
    console.print(Panel.fit(
        "[bold cyan]Elith Configuration Wizard[/bold cyan]\n"
        "Let's set up your AI providers",
        border_style="cyan"
    ))
    
    config = {
        "default": {},
        "claude": {},
        "lmstudio": {},
        "openrouter": {}
    }
    
    # Provider selection with arrow keys
    providers = [
        ("Claude (Anthropic)", "claude", "Cloud-based, most capable"),
        ("LM Studio (Local)", "lmstudio", "Run models locally, privacy-focused"),
        ("OpenRouter (Multiple models)", "openrouter", "Access to multiple providers")
    ]
    
    console.print("\n[bold]Available providers:[/bold]")
    console.print("[dim]Use ↑/↓ arrow keys to navigate, Enter to select[/dim]\n")
    
    selected_idx = 1  # Default to LM Studio
    
    def render_menu(selected):
        """Render the provider selection menu"""
        lines = []
        for idx, (name, _, desc) in enumerate(providers):
            if idx == selected:
                lines.append(f"[bold cyan]→ {name}[/bold cyan]")
                lines.append(f"  [dim]{desc}[/dim]")
            else:
                lines.append(f"  {name}")
                lines.append(f"  [dim]{desc}[/dim]")
        return "\n".join(lines)
    
    # Get terminal settings
    fd = sys.stdin.fileno()
    old_settings = termios.tcgetattr(fd)
    
    try:
        tty.setraw(fd)
        
        # Initial render
        console.print(render_menu(selected_idx))
        
        while True:
            ch = sys.stdin.read(1)
            
            # Handle arrow keys (escape sequences)
            if ch == '\x1b':
                next1, next2 = sys.stdin.read(2)
                if next1 == '[':
                    if next2 == 'A':  # Up arrow
                        selected_idx = (selected_idx - 1) % len(providers)
                    elif next2 == 'B':  # Down arrow
                        selected_idx = (selected_idx + 1) % len(providers)
                    
                    # Clear previous menu and re-render
                    console.print(f"\033[{len(providers) * 2}A", end="")  # Move cursor up
                    console.print(render_menu(selected_idx))
            
            elif ch == '\r' or ch == '\n':  # Enter key
                break
            elif ch == '\x03':  # Ctrl+C
                raise KeyboardInterrupt
    
    finally:
        termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
    
    # Clear the menu
    console.print()
    
    provider_name, provider_key, _ = providers[selected_idx]
    config["default"]["model"] = provider_key
    
    console.print(f"\n[bold cyan]{provider_name} Configuration[/bold cyan]")
    
    if provider_key == "claude":
        api_key = Prompt.ask("Enter your Anthropic API key")
        model = Prompt.ask("Model name", default="claude-sonnet-4-20250514")
        config["claude"]["api_key"] = api_key
        config["claude"]["model"] = model
    
    elif provider_key == "lmstudio":
        base_url = Prompt.ask("LM Studio API URL", default="http://localhost:1234/v1")
        model = Prompt.ask("Model name", default="local-model")
        config["lmstudio"]["base_url"] = base_url
        config["lmstudio"]["model"] = model
    
    elif provider_key == "openrouter":
        api_key = Prompt.ask("Enter your OpenRouter API key")
        model = Prompt.ask("Model name", default="openai/gpt-4o")
        config["openrouter"]["api_key"] = api_key
        config["openrouter"]["model"] = model
    
    # Save config
    save_config(config)
    
    console.print("\n[green]✓ Configuration complete![/green]")
    console.print("Starting Elith...\n")


def find_repo_root(start_path: str) -> str:
    """Walk up from start_path to find repo root"""
    markers = {".git", "package.json", "pyproject.toml", "go.mod", "Cargo.toml", "README.md"}
    current = Path(start_path).resolve()
    
    for parent in [current, *current.parents]:
        if any((parent / marker).exists() for marker in markers):
            return str(parent)
    
    return start_path


def get_provider(repo_path: str, config: Dict, model_override: Optional[str] = None):
    """Factory function to get the appropriate provider"""
    model = model_override or config["default"]["model"]
    
    if model == "claude":
        return ClaudeProvider(
            repo_path=repo_path,
            api_key=config["claude"]["api_key"],
            model=config["claude"].get("model", "claude-sonnet-4-20250514")
        )
    elif model == "lmstudio":
        return LMStudioProvider(
            repo_path=repo_path,
            base_url=config["lmstudio"].get("base_url", "http://localhost:1234/v1"),
            model=config["lmstudio"].get("model", "local-model")
        )
    elif model == "openrouter":
        return OpenRouterProvider(
            repo_path=repo_path,
            api_key=config["openrouter"]["api_key"],
            model=config["openrouter"].get("model", "openai/gpt-4o")
        )
    else:
        raise ValueError(f"Unknown model: {model}")




def run_oneshot(args, repo_path: str, config: Dict):
    """Run one-shot command and exit"""
    try:
        # Scan repo
        console.print(f"[cyan]Scanning repository: {repo_path}[/cyan]")
        scanner = RepoScanner(repo_path)
        files = scanner.scan()
        console.print(f"[green]✓ Found {len(files)} files[/green]")
        
        task_packet = TaskPacket(
            repo_path=repo_path,
            files=files,
            vault_notes=[],
            total_files=len(files)
        )
        
        # Get provider
        provider = get_provider(repo_path, config, args.model)
        
        # Determine operation and prompt
        if args.command == "explain":
            operation = "explain"
            prompt = f"Explain this repository: {args.target or '.'}"
        elif args.command == "refactor":
            operation = "refactor"
            target = args.target or "."
            focus = f" with focus on {args.focus}" if args.focus else ""
            prompt = f"Refactor {target}{focus}"
        elif args.command == "test-gen":
            operation = "test-gen"
            prompt = f"Generate tests for {args.target or '.'}"
        elif args.command == "architect":
            operation = "architect"
            prompt = f"Design architecture for: {args.problem}"
        elif args.command == "scan":
            console.print(f"[cyan]Scanned {len(files)} files in {repo_path}[/cyan]")
            return
        elif args.command == "models":
            table = Table(title="Available Models", show_header=True, header_style="bold cyan")
            table.add_column("Provider", style="cyan")
            table.add_column("Status")
            
            for provider_name in ["claude", "lmstudio", "openrouter"]:
                if provider_name in config and config[provider_name]:
                    table.add_row(provider_name, "[green]✓ Configured[/green]")
                else:
                    table.add_row(provider_name, "[dim]Not configured[/dim]")
            
            console.print(table)
            return
        else:
            # Direct prompt
            operation = "explain"
            prompt = args.prompt
        
        # Build context
        builder = PacketBuilder(task_packet)
        context_data = builder.build_context(operation, args.target if hasattr(args, 'target') else None)
        
        # Show thinking
        with Progress(
            SpinnerColumn(),
            TextColumn("[cyan]Thinking...[/cyan]"),
            console=console,
            transient=True
        ) as progress:
            progress.add_task("thinking", total=None)
            
            first_chunk = True
            for chunk in provider.run(prompt, context_data["context"]):
                if first_chunk:
                    progress.stop()
                    console.print()
                    first_chunk = False
                
                # Check if it's a tool call line
                if chunk.startswith("[Elith Skill:"):
                    console.print(chunk, style="dim")
                else:
                    console.print(chunk, end="")
        
        console.print("\n")
    
    except Exception as e:
        console.print(f"[red]Error: {e}[/red]")
        console.print(f"[yellow]Tip: Make sure you're in a valid project directory[/yellow]")
        console.print(f"[yellow]Current path: {repo_path}[/yellow]")
        sys.exit(1)


def main():
    """Main CLI entrypoint with auto-service management"""
    parser = argparse.ArgumentParser(
        description="Elith - Universal repo-aware AI agent framework",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    
    parser.add_argument("--version", action="version", version=f"Elith v{VERSION}")
    parser.add_argument("--model", help="Override default model (claude|lmstudio|openrouter)")
    parser.add_argument("--no-backend", action="store_true", help="Don't auto-start backend")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    
    subparsers = parser.add_subparsers(dest="command", help="Commands")
    
    # Init command
    subparsers.add_parser("init", help="Initialize configuration")
    
    # Chat command (explicit REPL)
    subparsers.add_parser("chat", help="Start interactive chat")
    
    # Service management commands
    service_parser = subparsers.add_parser("service", help="Manage backend service")
    service_subparsers = service_parser.add_subparsers(dest="service_command")
    service_subparsers.add_parser("start", help="Start backend service")
    service_subparsers.add_parser("stop", help="Stop backend service")
    service_subparsers.add_parser("restart", help="Restart backend service")
    service_subparsers.add_parser("status", help="Check backend service status")
    
    # Explain command
    explain_parser = subparsers.add_parser("explain", help="Explain code or repository")
    explain_parser.add_argument("target", nargs="?", help="File or directory to explain")
    
    # Refactor command
    refactor_parser = subparsers.add_parser("refactor", help="Refactor code")
    refactor_parser.add_argument("target", help="File to refactor")
    refactor_parser.add_argument("--focus", help="Focus area (e.g., 'readability')")
    
    # Test-gen command
    testgen_parser = subparsers.add_parser("test-gen", help="Generate tests")
    testgen_parser.add_argument("target", help="File or directory to generate tests for")
    
    # Architect command
    architect_parser = subparsers.add_parser("architect", help="Design architecture")
    architect_parser.add_argument("--problem", required=True, help="Problem to solve")
    
    # Scan command
    scan_parser = subparsers.add_parser("scan", help="Scan repository")
    scan_parser.add_argument("target", nargs="?", help="Directory to scan")
    
    # Models command
    subparsers.add_parser("models", help="List available models")
    
    # Parse args
    args, unknown = parser.parse_known_args()
    
    # Handle direct prompt (no subcommand)
    if not args.command and unknown:
        args.prompt = " ".join(unknown)
        args.command = "prompt"
    
    # Handle service management commands
    if args.command == "service":
        service_manager = get_service_manager()
        
        if args.service_command == "start":
            if service_manager.start_backend(verbose=True):
                console.print("[green]✓ Backend service started[/green]")
            else:
                console.print("[red]✗ Failed to start backend service[/red]")
                sys.exit(1)
            return
        
        elif args.service_command == "stop":
            service_manager.stop_backend(verbose=True)
            return
        
        elif args.service_command == "restart":
            if service_manager.restart_backend(verbose=True):
                console.print("[green]✓ Backend service restarted[/green]")
            else:
                console.print("[red]✗ Failed to restart backend service[/red]")
                sys.exit(1)
            return
        
        elif args.service_command == "status":
            status = service_manager.get_status()
            if status["running"]:
                console.print(f"[green]✓ Backend is running[/green]")
                console.print(f"  Port: {status['port']}")
                if status["pid"]:
                    console.print(f"  PID: {status['pid']}")
                console.print(f"  Logs: {status['log_file']}")
            else:
                console.print("[yellow]Backend is not running[/yellow]")
            return
        
        else:
            console.print("[yellow]Usage: elith service {start|stop|restart|status}[/yellow]")
            return
    
    # Init command (kept for backwards compatibility)
    if args.command == "init":
        init_wizard()
        return
    
    # Load config - run wizard if not found
    config = load_config()
    if not config:
        console.print("[yellow]Welcome to Elith! Let's get you set up.[/yellow]\n")
        try:
            init_wizard()
            config = load_config()
            if not config:
                console.print("[red]Configuration failed. Please try again.[/red]")
                return
        except KeyboardInterrupt:
            console.print("\n[yellow]Setup cancelled.[/yellow]")
            return
    
    # Auto-start backend unless disabled
    if not args.no_backend:
        service_manager = get_service_manager()
        if not service_manager.ensure_backend(verbose=args.verbose):
            console.print("[yellow]Warning: Backend failed to start. Some features may not work.[/yellow]")
            console.print("[yellow]Try: elith service start[/yellow]")
    
    # Find repo root
    repo_path = find_repo_root(os.getcwd())
    
    # Handle scan with custom path
    if args.command == "scan" and hasattr(args, "target") and args.target:
        repo_path = find_repo_root(args.target)
    
    # Run appropriate mode
    if args.command in [None, "chat"]:
        # Launch TUI - no fallback
        try:
            from tui.app import ElithApp
            app = ElithApp()
            app.run()
        except ImportError:
            console.print("[red]TUI not available. Install with: cd tui && npm install[/red]")
            console.print("[yellow]Falling back to CLI mode...[/yellow]")
            # Could add a simple CLI REPL here as fallback
    else:
        # One-shot command
        run_oneshot(args, repo_path, config)


if __name__ == "__main__":
    main()

# Made with Bob
