// Production Elith TUI - Full backend integration with enhanced UI
import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { EnhancedBanner } from './components/enhanced/EnhancedBanner.js';
import { ThinkingSpinner, LoadingSpinner } from './components/animations/EnhancedSpinner.js';
import { ProgressBar } from './components/ui/ProgressBar.js';
import { ChatInput } from './components/ChatInput.js';
import { MessagesPanel, type Message } from './components/MessagesPanel.js';
import { StatusBar } from './components/StatusBar.js';
import { useTheme } from './hooks/useTheme.js';
import { api } from './api/client.js';
import { createStreamConnection } from './api/stream.js';

export const ProductionApp: React.FC = () => {
  const { theme, currentThemeName, switchTheme, availableThemes } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentModel, setCurrentModel] = useState('lmstudio');
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [workspace] = useState(process.cwd());
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 10));

  // Check backend status on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await api.getStatus();
        setBackendStatus('online');
      } catch {
        setBackendStatus('offline');
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  // Handle user input
  const handleSubmit = async (input: string) => {
    // Handle commands
    if (input.startsWith('/')) {
      handleCommand(input);
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Check backend status
    if (backendStatus === 'offline') {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: 'Backend is offline. Please start the backend server.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    setIsStreaming(true);

    try {
      // Execute task
      const response = await api.execute({
        model: currentModel,
        operation: 'explain',
        repo_path: workspace,
        prompt: input,
      });

      // Create assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: '',
        model: currentModel,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Connect to stream
      const cleanup = createStreamConnection(
        response.session_id,
        (event) => {
          if (event.type === 'output' && event.content) {
            setMessages((prev) => {
              const updated = [...prev];
              const lastMsg = updated[updated.length - 1];
              if (lastMsg && lastMsg.type === 'assistant') {
                lastMsg.content += event.content;
              }
              return updated;
            });
          } else if (event.type === 'done') {
            setIsStreaming(false);
            cleanup();
          } else if (event.type === 'error') {
            setIsStreaming(false);
            const errorMsg: Message = {
              id: Date.now().toString(),
              type: 'system',
              content: `Error: ${event.error || 'Unknown error'}`,
              timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, errorMsg]);
            cleanup();
          }
        },
        (error) => {
          setIsStreaming(false);
          const errorMsg: Message = {
            id: Date.now().toString(),
            type: 'system',
            content: `Stream error: ${error.message}`,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, errorMsg]);
        }
      );
    } catch (error) {
      setIsStreaming(false);
      const errorMsg: Message = {
        id: Date.now().toString(),
        type: 'system',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  // Handle commands
  const handleCommand = (command: string) => {
    const cmd = command.toLowerCase();
    const parts = command.split(' ');

    if (cmd === '/help') {
      const helpMsg: Message = {
        id: Date.now().toString(),
        type: 'system',
        content: `Available commands:
/help - Show this help
/clear - Clear chat history
/model [name] - Show/switch model
/theme [name] - Show/switch theme
/themes - List all themes
/status - Show backend status
/exit - Quit`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, helpMsg]);
    } else if (cmd === '/clear') {
      setMessages([]);
    } else if (cmd.startsWith('/model')) {
      if (parts[1]) {
        setCurrentModel(parts[1]);
        const msg: Message = {
          id: Date.now().toString(),
          type: 'system',
          content: `Switched to model: ${parts[1]}`,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, msg]);
      } else {
        const msg: Message = {
          id: Date.now().toString(),
          type: 'system',
          content: `Current model: ${currentModel}\n\nAvailable: claude, lmstudio, openrouter`,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, msg]);
      }
    } else if (cmd.startsWith('/theme')) {
      if (parts[1]) {
        switchTheme(parts[1]);
        const msg: Message = {
          id: Date.now().toString(),
          type: 'system',
          content: `Switched to theme: ${parts[1]}`,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, msg]);
      } else {
        const msg: Message = {
          id: Date.now().toString(),
          type: 'system',
          content: `Current theme: ${currentThemeName}\n\nUse /themes to see all available themes`,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, msg]);
      }
    } else if (cmd === '/themes') {
      const msg: Message = {
        id: Date.now().toString(),
        type: 'system',
        content: `Available themes:\n${availableThemes.map(t => `  - ${t}`).join('\n')}\n\nUse: /theme [name] or press Ctrl+Shift+T to cycle`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, msg]);
    } else if (cmd === '/status') {
      const msg: Message = {
        id: Date.now().toString(),
        type: 'system',
        content: `Backend: ${backendStatus}\nModel: ${currentModel}\nTheme: ${currentThemeName}\nWorkspace: ${workspace}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, msg]);
    } else if (cmd === '/exit') {
      process.exit(0);
    } else {
      const msg: Message = {
        id: Date.now().toString(),
        type: 'system',
        content: `Unknown command: ${command}. Type /help for available commands.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, msg]);
    }
  };

  return (
    <Box flexDirection="column" height="100%">
      {/* Enhanced Banner */}
      <Box flexShrink={0}>
        <EnhancedBanner compact={true} />
      </Box>

      {/* Backend Status Warning */}
      {backendStatus === 'offline' && (
        <Box
          borderStyle="round"
          borderColor={theme.colors.error}
          paddingX={2}
          marginY={1}
        >
          <Text color={theme.colors.error} bold>⚠ Backend Offline</Text>
          <Text color={theme.colors.textDim}> - Start backend: </Text>
          <Text color={theme.colors.accent}>python -m uvicorn backend.main:app --reload --port 8000</Text>
        </Box>
      )}

      {/* Messages Panel */}
      <Box flexGrow={1} flexShrink={1} minHeight={0}>
        {messages.length === 0 ? (
          <Box flexDirection="column" padding={2}>
            <Text color={theme.colors.brand} bold>Welcome to Elith! 🚀</Text>
            <Box marginTop={1}>
              <Text color={theme.colors.textDim}>
                Type your message or use commands:
              </Text>
            </Box>
            <Box marginTop={1} flexDirection="column">
              <Text color={theme.colors.accent}>  /help</Text>
              <Text color={theme.colors.textDim}>     - Show available commands</Text>
              <Text color={theme.colors.accent}>  /theme cyberpunk</Text>
              <Text color={theme.colors.textDim}>     - Switch to cyberpunk theme</Text>
              <Text color={theme.colors.accent}>  /model claude</Text>
              <Text color={theme.colors.textDim}>     - Switch to Claude model</Text>
            </Box>
            <Box marginTop={2}>
              <Text color={theme.colors.textDimmer}>
                Press Ctrl+Shift+T to cycle themes · Press Ctrl+C to exit
              </Text>
            </Box>
          </Box>
        ) : (
          <MessagesPanel messages={messages} />
        )}
      </Box>

      {/* Streaming Indicator */}
      {isStreaming && (
        <Box paddingX={2} paddingY={1}>
          <LoadingSpinner text="Streaming response..." />
        </Box>
      )}

      {/* Chat Input */}
      <Box flexShrink={0}>
        <ChatInput
          onSubmit={handleSubmit}
          placeholder="Type your message or /help for commands"
        />
      </Box>

      {/* Status Bar */}
      <Box flexShrink={0}>
        <Box paddingX={2} paddingY={1} borderStyle="single" borderColor={theme.colors.border}>
          <Text color={theme.colors.textDim}>Model: </Text>
          <Text color={theme.colors.brand}>{currentModel}</Text>
          <Text color={theme.colors.textDimmer}> · </Text>
          <Text color={theme.colors.textDim}>Theme: </Text>
          <Text color={theme.colors.accent}>{currentThemeName}</Text>
          <Text color={theme.colors.textDimmer}> · </Text>
          <Text color={theme.colors.textDim}>Backend: </Text>
          <Text color={backendStatus === 'online' ? theme.colors.success : theme.colors.error}>
            {backendStatus}
          </Text>
          <Text color={theme.colors.textDimmer}> · </Text>
          <Text color={theme.colors.textDimmer}>Ctrl+C to exit</Text>
        </Box>
      </Box>
    </Box>
  );
};

// Made with Bob
