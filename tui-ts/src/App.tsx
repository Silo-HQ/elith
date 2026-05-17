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
import { writeFileSync } from 'fs';
import type { AppState } from './types.js';

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
    const parts = command.split(' ');
    
    if (cmd === '/help') {
      dispatch({
        type: 'STREAM_CHUNK',
        payload: {
          chunk: `Available commands:
- /help - Show this help
- /clear - Clear transcript
- /model [name] - Show/switch model (claude, lmstudio, openrouter)
- /skills - List skills
- /context - Show context files
- /auth - Show backend connection status
- /mode - Toggle autonomous ↔ confirm mode
- /scan - Re-scan workspace files
- /export - Save session to markdown
- /exit - Quit`,
        },
      });
      dispatch({ type: 'STREAM_DONE' });
    } else if (cmd === '/clear') {
      dispatch({ type: 'CLEAR_TRANSCRIPT' });
    } else if (cmd.startsWith('/model')) {
      const targetModel = parts[1];
      const validModels = ['claude', 'lmstudio', 'openrouter'];
      
      if (!targetModel) {
        dispatch({
          type: 'STREAM_CHUNK',
          payload: {
            chunk: `Current model: ${state.model}\n\nAvailable models:\n- claude\n- lmstudio\n- openrouter\n\nUsage: /model <name>`,
          },
        });
        dispatch({ type: 'STREAM_DONE' });
      } else if (validModels.includes(targetModel)) {
        dispatch({ type: 'SET_MODEL', payload: targetModel });
        dispatch({
          type: 'STREAM_CHUNK',
          payload: { chunk: `Switched to model: ${targetModel}` },
        });
        dispatch({ type: 'STREAM_DONE' });
      } else {
        dispatch({
          type: 'STREAM_CHUNK',
          payload: {
            chunk: `Unknown model: ${targetModel}. Valid: claude, lmstudio, openrouter`,
          },
        });
        dispatch({ type: 'STREAM_DONE' });
      }
    } else if (cmd === '/skills') {
      const skillsList = [
        'read_file',
        'write_file',
        'list_files',
        'search_code',
        'git_diff',
        'git_commit',
        'run_tests',
        'find_references',
        'analyze_dependencies',
        'explain_function',
        'install_package',
        'read_logs',
      ];
      const output = `12 skills active:\n\n${skillsList.map(s => `  ⚡ ${s}`).join('\n')}`;
      dispatch({ type: 'STREAM_CHUNK', payload: { chunk: output } });
      dispatch({ type: 'STREAM_DONE' });
    } else if (cmd === '/auth') {
      const isOnline = state.backendStatus === 'online';
      const output = isOnline
        ? `Backend: ✓ online (http://localhost:8000)\nModel: ${state.model}\nSkills: 12 active`
        : `Backend: ✗ offline\n\nStart the backend:\n  source venv/bin/activate\n  python -m uvicorn backend.main:app --reload --port 8000`;
      dispatch({ type: 'STREAM_CHUNK', payload: { chunk: output } });
      dispatch({ type: 'STREAM_DONE' });
    } else if (cmd === '/mode') {
      const newMode = state.mode === 'autonomous' ? 'confirm' : 'autonomous';
      dispatch({ type: 'SET_MODE', payload: newMode });
      dispatch({
        type: 'STREAM_CHUNK',
        payload: { chunk: `Mode: ${newMode}` },
      });
      dispatch({ type: 'STREAM_DONE' });
    } else if (cmd === '/scan') {
      dispatch({
        type: 'STREAM_CHUNK',
        payload: { chunk: `Scanning ${state.workspace}...` },
      });
      dispatch({ type: 'SCAN_WORKSPACE' });
      dispatch({ type: 'STREAM_CHUNK', payload: { chunk: `Done.` } });
      dispatch({ type: 'STREAM_DONE' });
    } else if (cmd === '/export') {
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, '-')
        .slice(0, 19);
      const filename = `elith-session-${timestamp}.md`;
      const content = buildSessionMarkdown(state);
      try {
        writeFileSync(filename, content);
        dispatch({
          type: 'STREAM_CHUNK',
          payload: { chunk: `Session saved to: ${filename}` },
        });
      } catch (error) {
        dispatch({
          type: 'STREAM_CHUNK',
          payload: {
            chunk: `Error saving session: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        });
      }
      dispatch({ type: 'STREAM_DONE' });
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

  const buildSessionMarkdown = (appState: AppState): string => {
    const date = new Date().toLocaleString();
    const lines = [
      `# Elith Session — ${date}`,
      ``,
      `**Workspace:** ${appState.workspace}`,
      `**Model:** ${appState.model}`,
      `**Branch:** ${appState.branch}`,
      ``,
      `---`,
      ``,
    ];

    for (const msg of appState.messages) {
      if (msg.role === 'user') {
        lines.push(`**You:** ${msg.text}`, ``);
      } else {
        lines.push(`**Elith:** ${msg.text}`, ``);
      }
      lines.push(`---`, ``);
    }

    return lines.join('\n');
  };

  // Setup keyboard input
  useKeyboardInput({
    onSubmit: handleSubmit,
    onCancel: () => process.exit(0),
  });

  // Poll for status updates
  useEffect(() => {
    const poll = async () => {
      try {
        const status = await api.getStatus();
        dispatch({
          type: 'UPDATE_STATS',
          payload: {
            ctxPercent: status.ctx_percent ?? 0,
            quotaPercent: status.quota_percent ?? 0,
            memoryMB: status.memory_mb ?? 0,
            tokens: status.tokens ?? 0,
          },
        });
        dispatch({ type: 'SET_BACKEND_STATUS', payload: 'online' });
      } catch {
        // Silently fail - don't log to console, just mark offline
        dispatch({ type: 'SET_BACKEND_STATUS', payload: 'offline' });
      }
    };

    poll(); // immediate first check
    const interval = setInterval(poll, 5000);
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
