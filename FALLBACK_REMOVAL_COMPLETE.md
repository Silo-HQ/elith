# Fallback Mechanism Removal - Complete

## Summary
Successfully removed the fallback mechanism from Elith CLI. The application now uses **only the TUI** interface with no text-based REPL fallback.

## Changes Made

### 1. Removed Fallback Logic in `cli.py`
**Before (lines 588-602):**
```python
# Launch TUI by default
try:
    from tui.app import ElithApp
    app = ElithApp()
    app.run()
except ImportError as e:
    console.print(f"[yellow]TUI not available: {e}[/yellow]")
    console.print("[cyan]Falling back to text-based REPL...[/cyan]\n")
    run_repl(repo_path, config, args.model)
except Exception as e:
    console.print(f"[red]Error launching TUI: {e}[/red]")
    console.print("[cyan]Falling back to text-based REPL...[/cyan]\n")
    run_repl(repo_path, config, args.model)
```

**After (lines 344-348):**
```python
# Launch TUI - no fallback
from tui.app import ElithApp
app = ElithApp()
app.run()
```

### 2. Removed Dead Code
Deleted the following unused functions that were only used by the removed REPL:
- `run_repl()` (109 lines) - The entire text-based REPL implementation
- `print_header()` - REPL header display
- `print_help()` - REPL slash commands help
- `handle_slash_command()` - REPL command handler
- `export_session()` - REPL session export

**Total lines removed:** ~245 lines of dead code

## Behavior Changes

### Before
- If TUI dependencies missing → fell back to text REPL
- If TUI crashed → fell back to text REPL
- User got "fallback" messages

### After
- If TUI dependencies missing → ImportError raised (clear failure)
- If TUI crashes → Exception propagates (clear failure)
- No fallback, no confusion - **TUI only**

## Benefits

1. **Simpler codebase** - Removed 245 lines of unused code
2. **Clear failure modes** - Errors are explicit, not hidden by fallbacks
3. **Single interface** - Users know exactly what to expect
4. **Easier maintenance** - No need to maintain two separate interfaces

## Testing

To verify the TUI launches correctly:
```bash
source .venv/bin/activate
elith
```

If TUI dependencies are missing, you'll get a clear ImportError instead of a silent fallback.

## Notes

- The `run_oneshot()` function still exists for one-shot commands like `elith explain`, `elith scan`, etc.
- Only the interactive chat mode uses the TUI
- Configuration wizard (`elith init`) still works as before