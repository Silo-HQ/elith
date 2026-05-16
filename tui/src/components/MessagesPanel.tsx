import React from 'react';
import { Box, Text } from 'ink';

export interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  model?: string;
  timestamp: string;
}

interface MessagesPanelProps {
  messages: Message[];
}

export const MessagesPanel: React.FC<MessagesPanelProps> = ({ messages }) => {
  return (
    <Box
      flexDirection="column"
      paddingX={1}
      paddingY={1}
      flexGrow={1}
    >
      {messages.length === 0 ? (
        <Text color="gray">No messages yet. Start typing to begin...</Text>
      ) : (
        messages.map((message) => (
          <Box key={message.id} flexDirection="column" marginBottom={1}>
            {/* System messages with "!" prefix - inline style like Gemini */}
            {message.type === 'system' && (
              <Box>
                <Text color="yellow">! </Text>
                <Text color="white">{message.content}</Text>
              </Box>
            )}

            {/* User messages */}
            {message.type === 'user' && (
              <>
                <Box>
                  <Text color="yellow">{'─'.repeat(80)}</Text>
                </Box>
                <Box marginTop={1}>
                  <Text color="yellow">● </Text>
                  <Text color="white" bold>User</Text>
                </Box>
                <Box
                  borderStyle="single"
                  borderColor="gray"
                  paddingX={1}
                  paddingY={0}
                  marginTop={1}
                >
                  <Text>{message.content}</Text>
                </Box>
              </>
            )}

            {/* Assistant messages */}
            {message.type === 'assistant' && (
              <>
                <Box>
                  <Text color="yellow">{'─'.repeat(80)}</Text>
                </Box>
                <Box marginTop={1}>
                  <Text color="yellow">▸ ⚡ </Text>
                  <Text color="white" bold>{message.model || 'Elith'}</Text>
                </Box>
                <Box
                  borderStyle="single"
                  borderColor="gray"
                  paddingX={1}
                  paddingY={0}
                  marginTop={1}
                >
                  <Text>{message.content}</Text>
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
