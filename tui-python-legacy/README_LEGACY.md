# Python TUI (Legacy - Archived)

This directory contains the original Python-based TUI implementation using Textual.

## Status: ARCHIVED

This TUI has been replaced by the TypeScript implementation in [`../tui/`](../tui/).

## Why Archived?

The TypeScript TUI (`../tui/`) provides:
- ✅ Better performance (Ink 4 vs Textual)
- ✅ Gemini CLI / Claude Code CLI aesthetic
- ✅ More responsive keyboard interactions
- ✅ Collapsible blocks with Tab/Ctrl+I navigation
- ✅ Command palette (/, @, !, # triggers)
- ✅ Real-time activity logs with animated spinners
- ✅ Fixed layout with no shifting
- ✅ Better maintainability (TypeScript + React patterns)

## Running the Legacy TUI

If you need to run this for reference:

```bash
source venv/bin/activate
python -m tui-python-legacy.app
```

## Migration

All new development should use the TypeScript TUI in [`../tui/`](../tui/).

See [`../tui/BACKEND_INTEGRATION_GUIDE.md`](../tui/BACKEND_INTEGRATION_GUIDE.md) for integration details.

---

**Archived:** May 16, 2026  
**Replaced by:** TypeScript TUI (`../tui/`)