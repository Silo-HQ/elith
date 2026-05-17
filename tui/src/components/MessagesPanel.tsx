// MessagesPanel - Enhanced Claude Code style message formatting

import React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../theme.js';

export interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system' | 'thinking' | 'tool';
  content: string;
  model?: string;
  timestamp: string;
  toolName?: string;
  status?: 'running' | 'done' | 'error';
  duration?: string;
}

interface MessagesPanelProps {
  messages: Message[];
}

export const MessagesPanel: React.FC<MessagesPanelProps> = ({ messages }) => {
  return (
    <Box
      flexDirection="column"
      paddingX={2}
      paddingY={1}
      flexGrow={1}
    >
      {messages.length === 0 ? (
        <Box flexDirection="column" paddingY={2}>
          <Box justifyContent="center">
            <Text color={theme.brand} bold>✦ Welcome to Elith</Text>
          </Box>
          <Box marginTop={2} flexDirection="column" paddingX={4}>
            <Text color={theme.text}>Ready to assist with your development tasks.</Text>
            <Box marginTop={1}>
              <Text color={theme.textDim}>• Type your message to get started</Text>
            </Box>
            <Box>
              <Text color={theme.textDim}>• Use </Text>
              <Text color={theme.accent}>/help</Text>
              <Text color={theme.textDim}> to see available commands</Text>
            </Box>
            <Box>
              <Text color={theme.textDim}>• Press </Text>
              <Text color={theme.accent}>@</Text>
              <Text color={theme.textDim}> to reference files</Text>
            </Box>
          </Box>
        </Box>
      ) : (
        messages.map((message, index) => (
          <Box key={message.id} flexDirection="column" marginBottom={1}>
            {/* System messages - enhanced with icon and box */}
            {message.type === 'system' && (
              <Box
                borderStyle="round"
                borderColor={theme.warning}
                paddingX={2}
                paddingY={1}
                marginY={1}
              >
                <Text color={theme.warning} bold>⚠ </Text>
                <Text color={theme.text}>{message.content}</Text>
              </Box>
            )}

            {/* Thinking/Activity indicators - enhanced */}
            {message.type === 'thinking' && (
              <Box paddingY={1}>
                <Text color={theme.thinking} bold>◉ </Text>
                <Text color={theme.thinking} italic>{message.content}</Text>
                {message.duration && (
                  <Text color={theme.textDim}> • {message.duration}</Text>
                )}
              </Box>
            )}

            {/* Tool execution indicators - enhanced with better formatting */}
            {message.type === 'tool' && (
              <Box paddingY={1} paddingLeft={2}>
                <Text color={theme.accent}>▸ </Text>
                <Text color={theme.brand} bold>{message.toolName || 'Tool'}</Text>
                <Text color={theme.textDim}> → </Text>
                <Text color={theme.text}>{message.content}</Text>
                {message.status === 'done' && (
                  <Text color={theme.success}> ✓</Text>
                )}
                {message.status === 'error' && (
                  <Text color={theme.error}> ✗</Text>
                )}
              </Box>
            )}

            {/* User messages - enhanced with better visual separation */}
            {message.type === 'user' && (
              <>
                {index > 0 && (
                  <Box marginY={1}>
                    <Text color={theme.separator}>{'━'.repeat(80)}</Text>
                  </Box>
                )}
                <Box paddingY={1}>
                  <Text color={theme.accentBlue} bold>You</Text>
                  <Text color={theme.textDim}> • {new Date(message.timestamp).toLocaleTimeString()}</Text>
                </Box>
                <Box paddingLeft={2} paddingY={1}>
                  <Text color={theme.text}>{message.content}</Text>
                </Box>
              </>
            )}

            {/* Assistant messages - enhanced with rich formatting */}
            {message.type === 'assistant' && (
              <>
                <Box marginTop={1} paddingY={1}>
                  <Text color={theme.brand} bold>◆ </Text>
                  <Text color={theme.brand} bold>
                    {message.model ? `${message.model.charAt(0).toUpperCase()}${message.model.slice(1)}` : 'Elith'}
                  </Text>
                  <Text color={theme.textDim}> • {new Date(message.timestamp).toLocaleTimeString()}</Text>
                </Box>
                <Box paddingLeft={2} paddingY={1}>
                  <Text color={theme.text}>{message.content}</Text>
                </Box>
              </>
            )}
          </Box>
        ))
      )}
    </Box>
  );
};

// Made with Bob
