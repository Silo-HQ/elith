// Keyboard input routing hook

import { useInput as useInkInput } from 'ink';
import { useAppState, useAppDispatch } from '../store/appStore.js';
import type { TriggerMode } from '../types.js';

interface UseInputOptions {
  onSubmit: (value: string) => void;
  onCancel?: () => void;
  isActive?: boolean;
}

export function useKeyboardInput(options: UseInputOptions) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const { onSubmit, onCancel, isActive = true } = options;

  useInkInput((input, key) => {
    if (!isActive) return;

    // Priority 1: Approval prompts
    if (state.status === 'awaiting_approval') {
      if (input === 'y') {
        dispatch({ type: 'APPROVAL_RESULT', payload: { approved: true } });
        return;
      }
      if (input === 'n') {
        dispatch({ type: 'APPROVAL_RESULT', payload: { approved: false } });
        return;
      }
      if (input === 'd') {
        // Show diff - handled by component
        return;
      }
      if (input === 's') {
        // Skip - handled by component
        return;
      }
    }

    // Priority 2: Command panel navigation
    if (state.triggerMode) {
      if (key.upArrow) {
        dispatch({ type: 'PANEL_NAVIGATE', payload: { direction: 'up' } });
        return;
      }
      if (key.downArrow) {
        dispatch({ type: 'PANEL_NAVIGATE', payload: { direction: 'down' } });
        return;
      }
      if (key.escape) {
        dispatch({ type: 'CLOSE_TRIGGER' });
        return;
      }
      // Enter and Tab handled by CommandPanel component
      return;
    }

    // Priority 3: Expandable block focus
    if (state.focusedExpandableId) {
      if ((key.ctrl && input === 'i') || (key.meta && input === 'i')) {
        dispatch({ type: 'TOGGLE_EXPANDABLE', payload: { id: state.focusedExpandableId } });
        return;
      }
      if (key.tab) {
        // Advance to next expandable - handled by useExpandable
        return;
      }
      if (key.escape) {
        dispatch({ type: 'SET_FOCUS_EXPANDABLE', payload: { id: null } });
        return;
      }
    }

    // Priority 4: Global shortcuts
    if (key.ctrl && input === 'c') {
      if (state.status !== 'idle') {
        // Cancel current operation
        dispatch({ type: 'STREAM_DONE' });
        dispatch({
          type: 'STREAM_CHUNK',
          payload: { chunk: '\n\n[Cancelled by user]' },
        });
      } else if (onCancel) {
        onCancel();
      }
      return;
    }

    if (key.ctrl && input === 'l') {
      dispatch({ type: 'CLEAR_TRANSCRIPT' });
      return;
    }

    if (key.ctrl && input === 'n') {
      // New session - reset state
      dispatch({ type: 'CLEAR_TRANSCRIPT' });
      return;
    }

    if (key.return && input === 'End') {
      dispatch({ type: 'SET_AUTO_SCROLL', payload: { autoScroll: true } });
      return;
    }

    if (input === '?') {
      // Show help
      onSubmit('/help');
      return;
    }
  });
}

// Detect trigger characters in input
export function detectTrigger(value: string): { mode: TriggerMode; query: string } | null {
  if (value.startsWith('/')) {
    return { mode: 'slash', query: value.substring(1) };
  }
  if (value.startsWith('@')) {
    return { mode: 'file', query: value.substring(1) };
  }
  if (value.startsWith('!')) {
    return { mode: 'shell', query: value.substring(1) };
  }
  if (value.startsWith('#')) {
    return { mode: 'context', query: value.substring(1) };
  }
  return null;
}

// Made with Bob
