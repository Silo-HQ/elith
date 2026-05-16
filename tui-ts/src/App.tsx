import React, { useState, useEffect } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import { Banner } from './components/Banner.js';
import { ChatInput } from './components/ChatInput.js';
import { StatusBar } from './components/StatusBar.js';
import { ActivityIndicator } from './components/ActivityIndicator.js';
import { api } from './services/api.js';
import { StreamEvent } from './types/api.js';

type AppStatus = 'idle' | 'processing' | 'streaming' | 'error';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system' | 'thinking';
  content: string;
  model?: string;
  timestamp: string;
}

export const App: React.FC = () => {
  const { exit } = useApp();
  const [showTrustPrompt, setShowTrustPrompt] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<AppStatus>('idle');
  const [currentModel, setCurrentModel] = useState('lmstudio');
  const [, setSessionId] = useState<string | null>(null);
  const [repoPath] = useState(process.cwd());
  const [, setAvailableModels] = useState<string[]>([]);
  const [backendStatus, setBackendStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  const [activityMessage, setActivityMessage] = useState('');
  const [showActivity, setShowActivity] = useState(false);
  const [contextUsed, setContextUsed] = useState(12);
  const [agentCount] = useState(3);
  const [latency, setLatency] = useState(0);

  // Handle Ctrl+C to exit and trust prompt
  useInput((input, key) => {
    if (key.ctrl && input === 'c') {
      exit();
    }
    // Handle trust prompt
    if (showTrustPrompt) {
      if (input === '1' || key.return) {
        setShowTrustPrompt(false);
        checkBackend();
      } else if (input === '2') {
        exit();
      }
    }
  });

  // Show banner and initial messages after trust
  useEffect(() => {
    if (!showTrustPrompt) {
      addMessage(
        'system',
        'Welcome to Elith! Type your prompt or use /commands to get started.',
        'elith'
      );
      addMessage(
        'system',
        'Backend: http://localhost:8000',
        'elith'
      );
    }
  }, [showTrustPrompt]);

  const addMessage = (
    type: 'user' | 'assistant' | 'system' | 'thinking',
    content: string,
    model?: string
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      model,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const checkBackend = async () => {
    setActivityMessage('connecting to backend...');
    setShowActivity(true);
    const startTime = Date.now();
    
    try {
      const data = await api.getModels();
      const elapsed = Date.now() - startTime;
      setLatency(elapsed);
      
      if (data.available.length > 0) {
        setCurrentModel(data.available[0]);
        setAvailableModels(data.available);
        setBackendStatus('connected');
        addMessage(
          'system',
          `Backend connected. Available models: ${data.available.join(', ')}`,
          'elith'
        );
      }
    } catch (error) {
      setBackendStatus('error');
      addMessage(
        'system',
        `Backend not available: ${error}`,
        'elith'
      );
    } finally {
      setShowActivity(false);
    }
  };

  const handleCommand = async (command: string) => {
    if (command === '/help') {
      addMessage(
        'system',
        `Available commands:
- /help - Show this help message
- /models - List available models
- /model <name> - Switch to a different model
- /clear - Clear chat history
- /repo <path> - Set repository path
- /exit - Exit the application

Regular prompts will be sent to the AI for processing.`,
        'elith'
      );
    } else if (command === '/models') {
      try {
        const data = await api.getModels();
        const modelList = data.available
          .map((model) => {
            const statusIcon = data.configured.includes(model) ? '✓' : '○';
            const current = model === currentModel ? ' (current)' : '';
            return `${statusIcon} ${model}${current}`;
          })
          .join('\n');
        addMessage('system', `Available models:\n${modelList}`, 'elith');
      } catch (error) {
        addMessage('system', `Error fetching models: ${error}`, 'elith');
      }
    } else if (command.startsWith('/model ')) {
      const modelName = command.split(' ')[1];
      setCurrentModel(modelName);
      addMessage('system', `Switched to model: ${modelName}`, 'elith');
    } else if (command === '/clear') {
      setMessages([]);
      addMessage('system', 'Chat history cleared.', 'elith');
    } else if (command === '/exit') {
      exit();
    } else if (command.startsWith('/repo ')) {
      const path = command.substring(6);
      addMessage('system', `Repository path set to: ${path}`, 'elith');
    } else {
      addMessage(
        'system',
        `Unknown command: ${command}. Type /help for available commands.`,
        'elith'
      );
    }
  };

  const processMessage = async (prompt: string) => {
    setStatus('processing');
    setActivityMessage('generating execution plan...');
    setShowActivity(true);
    
    // Add thinking message
    addMessage('thinking', 'Processing your request...', currentModel);

    try {
      const response = await api.execute({
        model: currentModel,
        operation: 'explain',
        repo_path: repoPath,
        prompt,
      });

      setSessionId(response.session_id);
      setStatus('streaming');
      setActivityMessage('streaming response...');

      const responseContent: string[] = [];
      let responseModel = currentModel;

      const eventSource = api.streamSession(
        response.session_id,
        (event: StreamEvent) => {
          if (event.type === 'output') {
            responseContent.push(event.content || '');
            if (event.model) {
              responseModel = event.model;
            }
            // Update context usage
            setContextUsed((prev) => Math.min(prev + 1, 128));
          } else if (event.type === 'done') {
            if (responseContent.length > 0) {
              addMessage('assistant', responseContent.join(''), responseModel);
            }
            setStatus('idle');
            setShowActivity(false);
            eventSource.close();
          } else if (event.type === 'error') {
            addMessage('system', `Error: ${event.error}`, 'elith');
            setStatus('error');
            setShowActivity(false);
            eventSource.close();
          }
        },
        (error) => {
          addMessage('system', `Streaming error: ${error.message}`, 'elith');
          setStatus('error');
          setShowActivity(false);
        }
      );
    } catch (error) {
      addMessage('system', `Error processing message: ${error}`, 'elith');
      setStatus('error');
      setShowActivity(false);
    }
  };

  const handleSubmit = (value: string) => {
    addMessage('user', value);

    if (value.startsWith('/')) {
      handleCommand(value);
    } else {
      processMessage(value);
    }
  };

  // Show trust prompt first
  if (showTrustPrompt) {
    return (
      <Box flexDirection="column" paddingX={2} paddingY={1}>
        <Text color="cyan" bold>
          {'> '}You are in {repoPath}
        </Text>
        <Box marginTop={1}>
          <Text>
            Do you trust the contents of this directory? Working with untrusted contents comes with higher risk of prompt injection. Trusting the directory allows project-local config, hooks, and exec policies to load.
          </Text>
        </Box>
        <Box marginTop={2} flexDirection="column">
          <Text color="cyan">1. Yes, continue</Text>
          <Text color="gray">2. No, quit</Text>
        </Box>
        <Box marginTop={2}>
          <Text color="gray" dimColor>
            Press 1 or 2 to select
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" height="100%">
      {/* 1. BANNER/HEADER - Always visible at top */}
      <Banner terminalWidth={80} />

      {/* 2. RUNTIME/SYSTEM OUTPUT - Scrollable main area */}
      <Box flexGrow={1} flexDirection="column" paddingX={1} paddingY={1}>
        {/* Activity Indicator */}
        {showActivity && (
          <ActivityIndicator
            message={activityMessage}
            type={status === 'processing' ? 'generating' : 'processing'}
            show={showActivity}
          />
        )}

        {/* Messages */}
        {messages.length === 0 ? (
          <Text color="gray">No messages yet. Start typing to begin...</Text>
        ) : (
          messages.map((message) => (
            <Box key={message.id} flexDirection="column" marginBottom={1}>
              {/* System messages with "!" prefix */}
              {message.type === 'system' && (
                <Box>
                  <Text color="yellow">! </Text>
                  <Text color="white">{message.content}</Text>
                </Box>
              )}

              {/* Thinking block */}
              {message.type === 'thinking' && (
                <Box flexDirection="column" borderStyle="single" borderColor="gray" paddingX={1} marginY={1}>
                  <Text color="gray" italic>
                    ◐ Thinking...
                  </Text>
                  <Text color="white">{message.content}</Text>
                </Box>
              )}

              {/* User messages */}
              {message.type === 'user' && (
                <>
                  <Box marginTop={1}>
                    <Text color="cyan">{'─'.repeat(80)}</Text>
                  </Box>
                  <Box marginTop={1}>
                    <Text color="cyan">● </Text>
                    <Text color="white" bold>User</Text>
                    <Text color="gray"> [{message.timestamp}]</Text>
                  </Box>
                  <Box paddingX={2} marginTop={1}>
                    <Text>{message.content}</Text>
                  </Box>
                </>
              )}

              {/* Assistant messages */}
              {message.type === 'assistant' && (
                <>
                  <Box marginTop={1}>
                    <Text color="magenta">{'─'.repeat(80)}</Text>
                  </Box>
                  <Box marginTop={1}>
                    <Text color="magenta">▸ </Text>
                    <Text color="white" bold>{message.model || 'Elith'}</Text>
                    <Text color="gray"> [{message.timestamp}]</Text>
                  </Box>
                  <Box paddingX={2} marginTop={1}>
                    <Text>{message.content}</Text>
                  </Box>
                </>
              )}
            </Box>
          ))
        )}
      </Box>

      {/* 3. INPUT AREA - Stable, anchored */}
      <ChatInput onSubmit={handleSubmit} />

      {/* 4. STATUS BAR - Always visible at bottom */}
      <StatusBar
        model={currentModel}
        backendStatus={backendStatus}
        contextUsed={contextUsed}
        contextTotal={128}
        agentCount={agentCount}
        mode="autonomous"
        latency={latency}
        status={status}
      />
    </Box>
  );
};

// Made with Bob
