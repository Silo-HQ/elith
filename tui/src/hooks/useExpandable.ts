// Hook for managing expandable blocks (thinking, subagent) with Tab/Ctrl+I navigation

import { useMemo } from 'react';
import { useAppState, useAppDispatch } from '../store/appStore.js';
import type { ExpandableBlock } from '../types.js';

export function useExpandable() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  // Collect all expandable blocks from all messages in order
  const allExpandables = useMemo(() => {
    const blocks: ExpandableBlock[] = [];
    
    for (const message of state.messages) {
      if (message.thinking) {
        blocks.push(message.thinking);
      }
      if (message.subAgents) {
        blocks.push(...message.subAgents);
      }
    }
    
    return blocks;
  }, [state.messages]);

  // Handle Tab key to advance focus
  const advanceFocus = () => {
    if (allExpandables.length === 0) return;

    const currentIndex = state.focusedExpandableId
      ? allExpandables.findIndex(b => b.id === state.focusedExpandableId)
      : -1;

    const nextIndex = (currentIndex + 1) % allExpandables.length;
    const nextBlock = allExpandables[nextIndex];

    if (nextBlock) {
      dispatch({ type: 'SET_FOCUS_EXPANDABLE', payload: { id: nextBlock.id } });
    }
  };

  // Handle Ctrl+I to toggle focused block
  const toggleFocused = () => {
    if (state.focusedExpandableId) {
      dispatch({ type: 'TOGGLE_EXPANDABLE', payload: { id: state.focusedExpandableId } });
    }
  };

  return {
    allExpandables,
    focusedId: state.focusedExpandableId,
    advanceFocus,
    toggleFocused,
    setFocus: (id: string | null) => {
      dispatch({ type: 'SET_FOCUS_EXPANDABLE', payload: { id } });
    },
  };
}

// Made with Bob
