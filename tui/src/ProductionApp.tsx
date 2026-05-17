// Production Elith TUI - Claude Code style interface
import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { Banner } from './components/Banner.js';
import { ActivityIndicator, CookedIndicator } from './components/ActivityIndicator.js';
import { CommandMenu } from './components/CommandMenu.js';
import { FileApprovalPrompt } from './components/FileApprovalPrompt.js';
import { ChatInput } from './components/ChatInput.js';
import { MessagesPanel, type Message } from './components/MessagesPanel.js';
import { StatusBar } from './components/StatusBar.js';
import { useTheme } from './hooks/useTheme.js';
import { api } from './api/client.js';
import { createStreamConnection } from './api/stream.js';
export const ProductionApp: React.FC = () => {
  const { currentThemeName, switchTheme, availableThemes } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentModel, setCurrentModel] = useState('lmstudio');
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [workspace] = useState(process.cwd());
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [commandFilter, setCommandFilter] = useState('');
  const [pendingFileApproval, setPendingFileApproval] = useState<{
    fileName: string;
    lineCount: number;
    preview: string[];
  } | null>(null);
  const [activityMessage, setActivityMessage] = useState<string>('');
  const [completionTime, setCompletionTime] = useState<string>('');

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
    // Show command menu when typing /
    if (input.startsWith('/')) {
      if (input.length === 1) {
        setShowCommandMenu(true);
        setCommandFilter('');
        return;
      }
      setCommandFilter(input.substring(1));
      setShowCommandMenu(true);
      
      // Execute command if complete
      if (input.includes(' ') || input === '/help' || input === '/clear' || input === '/exit') {
        setShowCommandMenu(false);
        handleCommand(input);
      }
      return;
    }
    
    setShowCommandMenu(false);

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
    setActivityMessage('Manifesting...');
    const startTime = Date.now();

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
            const duration = Math.floor((Date.now() - startTime) / 1000);
            setCompletionTime(`${duration}s`);
            setActivityMessage('');
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
      {/* Claude Code style Banner */}
      <Box flexShrink={0}>
        <Banner compact={true} />
      </Box>

      {/* Backend Status Warning - full width red bar */}
      {backendStatus === 'offline' && (
        <Box
          width="100%"
          paddingX={2}
          paddingY={1}
          borderStyle="single"
          borderColor="red"
        >
          <Text color="red" bold>⚠ Backend Offline</Text>
          <Text color="gray"> - Start backend: </Text>
          <Text color="cyan">python -m uvicorn backend.main:app --reload --port 8000</Text>
        </Box>
      )}

      {/* Command Menu */}
      {showCommandMenu && (
        <Box flexShrink={0}>
          <CommandMenu filter={commandFilter} />
        </Box>
      )}

      {/* File Approval Prompt */}
      {pendingFileApproval && (
        <Box flexShrink={0}>
          <FileApprovalPrompt
            fileName={pendingFileApproval.fileName}
            lineCount={pendingFileApproval.lineCount}
            preview={pendingFileApproval.preview}
            onApprove={() => setPendingFileApproval(null)}
            onReject={() => setPendingFileApproval(null)}
            onAllowAll={() => setPendingFileApproval(null)}
          />
        </Box>
      )}

      {/* Messages Panel */}
      <Box flexGrow={1} flexShrink={1} minHeight={0}>
        <MessagesPanel messages={messages} />
      </Box>

      {/* Activity Indicator */}
      {isStreaming && activityMessage && (
        <Box paddingX={2} paddingY={1}>
          <ActivityIndicator message={activityMessage} />
        </Box>
      )}

      {/* Completion Indicator */}
      {!isStreaming && completionTime && (
        <Box paddingX={2} paddingY={1}>
          <CookedIndicator duration={completionTime} />
        </Box>
      )}

      {/* Input prompt area */}
      <Box flexShrink={0} paddingX={2} paddingY={1}>
        <Text color="yellow">› prompt</Text>
      </Box>
      
      {/* Chat Input */}
      <Box flexShrink={0} paddingX={2}>
        <ChatInput
          onSubmit={handleSubmit}
          placeholder="Type your message or /help for commands"
        />
      </Box>

      {/* Status Bar - single line at bottom */}
      <Box flexShrink={0} paddingX={2} paddingY={1}>
        <StatusBar
          model={currentModel}
          backendStatus={backendStatus}
          tokens={0}
          quotaPercent={0}
          ctxPercent={0}
          workspace={workspace}
        />
      </Box>
    </Box>
  );
};

// Made with Bob
