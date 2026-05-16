// App - root layout composition following FIXED order:
// 1. Banner → 2. Transcript → 3. Input → 4. CommandPanel → 5. StatusBar

import React, { useEffect } from 'react';
import { Box } from 'ink';
import { AppStoreProvider, useAppDispatch, useAppState } from './store/appStore.js';
import { useKeyboardInput } from './hooks/useInput.js';
import { Banner } from './components/Banner.js';
import { Transcript } from './components/Transcript.js';
import { InputArea } from './components/InputArea.js';
import { CommandPanel } from './components/CommandPanel.js';
import { StatusBar } from './components/StatusBar.js';
import { createStreamConnection } from './api/stream.js';
import { api } from './api/client.js';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const state = useAppState();

  // Handle input submission
  const handleSubmit = async (value: string) => {
    // Dispatch user message
    dispatch({ type: 'USER_SUBMIT', payload: { text: value } });

    // Handle commands
    if (value.startsWith('/')) {
      handleCommand(value);
      return;
    }

    // Execute task
    try {
      const response = await api.execute({
        model: state.model,
        operation: 'explain',
        repo_path: state.workspace,
        prompt: value,
      });

      // Connect to stream
      const cleanup = createStreamConnection(
        response.session_id,
        (event) => {
          switch (event.type) {
            case 'thinking':
              dispatch({ type: 'THINKING_CHUNK', payload: { chunk: event.content || '' } });
              break;
            case 'output':
              dispatch({ type: 'STREAM_CHUNK', payload: { chunk: event.content || '' } });
              break;
            case 'tool':
              if (event.tool) {
                dispatch({ type: 'TOOL_START', payload: event.tool });
              }
              break;
            case 'subagent':
              if (event.subagent) {
                dispatch({
                  type: 'SUBAGENT_START',
                  payload: { id: event.subagent.id, label: event.subagent.label },
                });
              }
              break;
            case 'done':
              dispatch({ type: 'STREAM_DONE' });
              break;
            case 'error':
              dispatch({ type: 'STREAM_ERROR', payload: { error: event.error || 'Unknown error' } });
              break;
            case 'approval':
              dispatch({ type: 'AWAITING_APPROVAL' });
              break;
          }
        },
        (error) => {
          dispatch({ type: 'STREAM_ERROR', payload: { error: error.message } });
        }
      );

      return cleanup;
    } catch (error) {
      dispatch({
        type: 'STREAM_ERROR',
        payload: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
    }
  };

  const handleCommand = (command: string) => {
    const cmd = command.toLowerCase();
    
    if (cmd === '/help') {
      dispatch({
        type: 'STREAM_CHUNK',
        payload: {
          chunk: `Available commands:
- /help - Show this help
- /clear - Clear transcript
- /model - Show/switch model
- /skills - List skills
- /context - Show context files
- /exit - Quit`,
        },
      });
      dispatch({ type: 'STREAM_DONE' });
    } else if (cmd === '/clear') {
      dispatch({ type: 'CLEAR_TRANSCRIPT' });
    } else if (cmd === '/exit') {
      process.exit(0);
    } else {
      dispatch({
        type: 'STREAM_CHUNK',
        payload: { chunk: `Unknown command: ${command}. Type /help for available commands.` },
      });
      dispatch({ type: 'STREAM_DONE' });
    }
  };

  // Setup keyboard input
  useKeyboardInput({
    onSubmit: handleSubmit,
    onCancel: () => process.exit(0),
  });

  // Poll for status updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const status = await api.getStatus();
        dispatch({
          type: 'UPDATE_STATS',
          payload: {
            ctxPercent: status.ctx_percent,
            quotaPercent: status.quota_percent,
            memoryMB: status.memory_mb,
            tokens: status.tokens,
          },
        });
      } catch (error) {
        console.error('Failed to fetch status:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <Box flexDirection="column" height="100%">
      {/* 1. BANNER - Always visible at top */}
      <Banner />

      {/* 2. TRANSCRIPT - Scrollable, fixed height */}
      <Transcript />

      {/* 3. INPUT AREA - Anchored, never shifts */}
      <InputArea onSubmit={handleSubmit} />

      {/* 4. COMMAND PANEL - Shown only when trigger active */}
      {state.triggerMode && <CommandPanel />}

      {/* 5. STATUS BAR - Always visible at bottom */}
      <StatusBar />
    </Box>
  );
};

export const App: React.FC = () => {
  return (
    <AppStoreProvider>
      <AppContent />
    </AppStoreProvider>
  );
};

// Made with Bob
