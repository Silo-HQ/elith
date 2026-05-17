#!/usr/bin/env python3
"""
Test script for the new Elith configuration wizard
This demonstrates the arrow key navigation without modifying the actual config
"""

import sys
import tty
import termios
from rich.console import Console
from rich.panel import Panel

console = Console()

def test_arrow_navigation():
    """Test the arrow key navigation menu"""
    
    console.print(Panel.fit(
        "[bold cyan]Elith Configuration Wizard Demo[/bold cyan]\n"
        "Arrow key navigation test",
        border_style="cyan"
    ))
    
    providers = [
        ("Claude (Anthropic)", "claude", "Cloud-based, most capable"),
        ("LM Studio (Local)", "lmstudio", "Run models locally, privacy-focused"),
        ("OpenRouter (Multiple models)", "openrouter", "Access to multiple providers")
    ]
    
    console.print("\n[bold]Available providers:[/bold]")
    console.print("[dim]Use ↑/↓ arrow keys to navigate, Enter to select, Ctrl+C to exit[/dim]\n")
    
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
    
    # Show selection
    console.print()
    provider_name, provider_key, _ = providers[selected_idx]
    console.print(f"\n[green]✓ You selected: {provider_name} ({provider_key})[/green]")
    console.print("\n[dim]This is just a demo - no config was modified[/dim]")

if __name__ == "__main__":
    try:
        test_arrow_navigation()
    except KeyboardInterrupt:
        console.print("\n[yellow]Demo cancelled[/yellow]")

# Made with Bob
