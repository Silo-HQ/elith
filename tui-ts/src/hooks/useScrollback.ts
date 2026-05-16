// Hook for managing auto-scroll behavior in transcript

import { useEffect, useRef } from 'react';
import { useAppState, useAppDispatch } from '../store/appStore.js';

export function useScrollback() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const lastMessageCountRef = useRef(state.messages.length);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (state.messages.length > lastMessageCountRef.current) {
      // New message arrived
      if (state.autoScroll) {
        // Scroll to bottom (handled by Transcript component)
      }
    }
    lastMessageCountRef.current = state.messages.length;
  }, [state.messages.length, state.autoScroll]);

  const enableAutoScroll = () => {
    dispatch({ type: 'SET_AUTO_SCROLL', payload: { autoScroll: true } });
  };

  const disableAutoScroll = () => {
    dispatch({ type: 'SET_AUTO_SCROLL', payload: { autoScroll: false } });
  };

  return {
    autoScroll: state.autoScroll,
    enableAutoScroll,
    disableAutoScroll,
    hasNewMessages: state.messages.length > lastMessageCountRef.current,
  };
}

// Made with Bob
