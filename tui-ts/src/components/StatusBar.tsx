import React from 'react';
import { Box, Text } from 'ink';

interface StatusBarProps {
  model?: string;
  backendStatus?: 'connected' | 'disconnected' | 'error';
  contextUsed?: number;
  contextTotal?: number;
  agentCount?: number;
  mode?: string;
  latency?: number;
  status?: 'idle' | 'processing' | 'streaming' | 'error';
}

export const StatusBar: React.FC<StatusBarProps> = ({
  model = 'qwen3-coder',
  backendStatus = 'connected',
  contextUsed = 12,
  contextTotal = 128,
  agentCount = 3,
  mode = 'autonomous',
  latency = 0,
  status = 'idle',
}) => {
  const statusColor = {
    connected: 'green',
    disconnected: 'red',
    error: 'red',
  }[backendStatus];

  const statusIcon = {
    idle: '●',
    processing: '◐',
    streaming: '◑',
    error: '✗',
  }[status];

  const stateColor = {
    idle: 'green',
    processing: 'yellow',
    streaming: 'cyan',
    error: 'red',
  }[status];

  return (
    <Box
      borderStyle="single"
      borderColor="magenta"
      paddingX={1}
      width="100%"
    >
      <Text>
        <Text color="magenta" bold>ELITH</Text>
        <Text color="gray"> :: </Text>
        <Text color="gray">model:</Text>
        <Text color="cyan">{model}</Text>
        <Text color="gray"> :: </Text>
        <Text color="gray">backend:</Text>
        <Text color={statusColor}>{backendStatus}</Text>
        <Text color="gray"> :: </Text>
        <Text color="gray">ctx:</Text>
        <Text color="white">{contextUsed}k</Text>
        <Text color="gray">/</Text>
        <Text color="white">{contextTotal}k</Text>
        <Text color="gray"> :: </Text>
        <Text color="gray">agents:</Text>
        <Text color="yellow">{agentCount}</Text>
        <Text color="gray"> :: </Text>
        <Text color="gray">mode:</Text>
        <Text color="magenta">{mode}</Text>
        {latency > 0 && (
          <>
            <Text color="gray"> :: </Text>
            <Text color="gray">latency:</Text>
            <Text color="white">{latency}ms</Text>
          </>
        )}
        <Text color="gray"> :: </Text>
        <Text color={stateColor}>{statusIcon}</Text>
      </Text>
    </Box>
  );
};

// Made with Bob
