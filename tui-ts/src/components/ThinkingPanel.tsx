import React from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

export interface ThinkingContent {
  id: string;
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

interface ThinkingPanelProps {
  thinking: ThinkingContent[];
  maxHeight?: number;
}

export const ThinkingPanel: React.FC<ThinkingPanelProps> = ({ 
  thinking, 
  maxHeight = 10 
}) => {
  if (thinking.length === 0) {
    return null;
  }

  const visibleThinking = thinking.slice(-maxHeight);
  const hasMore = thinking.length > maxHeight;

  return (
    <Box 
      flexDirection="column" 
      borderStyle="single" 
      borderColor="yellow" 
      paddingX={1}
      marginBottom={1}
    >
      {/* Header */}
      <Box marginBottom={1}>
        <Text color="yellow" bold>
          💭 Thinking
        </Text>
        {thinking.some(t => t.isStreaming) && (
          <Text color="yellow">
            {' '}
            <Spinner type="dots" />
          </Text>
        )}
      </Box>

      {/* Thinking Content */}
      <Box flexDirection="column">
        {hasMore && (
          <Box marginBottom={1}>
            <Text color="gray" italic>
              ... {thinking.length - maxHeight} earlier thoughts
            </Text>
          </Box>
        )}
        
        {visibleThinking.map((item) => (
          <Box key={item.id} flexDirection="column" marginBottom={1}>
            <Box>
              <Text color="gray">[{item.timestamp}]</Text>
              <Text> </Text>
              <Text color="white">{item.content}</Text>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// Made with Bob