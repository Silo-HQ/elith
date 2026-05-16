// Hook for managing trigger mode (/, @, !, #) and command panel state

import { useEffect } from 'react';
import { useAppState, useAppDispatch } from '../store/appStore.js';
import { detectTrigger } from './useInput.js';

export function useTrigger(inputValue: string) {
  const state = useAppState();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const trigger = detectTrigger(inputValue);
    
    if (trigger) {
      // Activate trigger mode
      if (state.triggerMode !== trigger.mode || state.triggerQuery !== trigger.query) {
        dispatch({
          type: 'SET_TRIGGER',
          payload: { mode: trigger.mode, query: trigger.query },
        });
      }
    } else if (state.triggerMode) {
      // Deactivate trigger mode if input no longer starts with trigger char
      dispatch({ type: 'CLOSE_TRIGGER' });
    }
  }, [inputValue, state.triggerMode, state.triggerQuery, dispatch]);

  return {
    isActive: state.triggerMode !== null,
    mode: state.triggerMode,
    query: state.triggerQuery,
    selectedIndex: state.panelSelectedIndex,
  };
}

// Made with Bob
