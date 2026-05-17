import React from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

interface ActivityIndicatorProps {
  message: string;
  type?: 'indexing' | 'generating' | 'analyzing' | 'thinking' | 'processing';
  show?: boolean;
}

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({
  message,
  type = 'processing',
  show = true,
}) => {
  if (!show) return null;

  const icons = {
    indexing: '◉',
    generating: '◉',
    analyzing: '( •_•)>⌐■-■',
    thinking: '◐',
    processing: '◑',
  };

  const colors = {
    indexing: 'cyan',
    generating: 'magenta',
    analyzing: 'yellow',
    thinking: 'blue',
    processing: 'green',
  } as const;

  return (
    <Box paddingX={1} marginY={0}>
      <Text color={colors[type]}>
        {type === 'analyzing' ? icons[type] : <Spinner type="dots" />}
      </Text>
      <Text color="gray"> {message}</Text>
    </Box>
  );
};

// Made with Bob