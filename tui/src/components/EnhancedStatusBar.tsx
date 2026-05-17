import React from 'react';
import { Box, Text } from 'ink';

interface EnhancedStatusBarProps {
  workspace?: string;
  branch?: string;
  sandbox?: boolean;
  model?: string;
  modelMode?: 'Auto' | 'Manual';
  quota?: number; // percentage
  context?: number; // percentage
  memory?: number; // MB
  sessionId?: string;
  status?: 'idle' | 'processing' | 'streaming' | 'error';
}

export const EnhancedStatusBar: React.FC<EnhancedStatusBarProps> = ({
  workspace = '.',
  branch = 'main',
  sandbox = false,
  model = 'lmstudio',
  modelMode = 'Auto',
  quota = 0,
  context = 0,
  memory = 0,
  sessionId = null,
  status = 'idle',
}) => {
  const statusColor = {
    idle: 'green',
    processing: 'yellow',
    streaming: 'cyan',
    error: 'red',
  }[status];

  const statusIcon = {
    idle: '●',
    processing: '◐',
    streaming: '◑',
    error: '✗',
  }[status];

  // Format memory
  const memoryStr = memory > 1024 
    ? `${(memory / 1024).toFixed(1)} GB` 
    : `${memory.toFixed(1)} MB`;

  // Truncate workspace path if too long
  const workspaceDisplay = workspace.length > 30 
    ? '...' + workspace.slice(-27) 
    : workspace;

  // Truncate session ID
  const sessionDisplay = sessionId 
    ? sessionId.slice(0, 8) 
    : 'none';

  // Color code quota and context based on usage
  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'red';
    if (percentage >= 70) return 'yellow';
    return 'green';
  };

  return (
    <Box paddingX={1} width="100%">
      <Box flexDirection="row" width="100%">
        {/* Status Indicator */}
        <Text color={statusColor}>{statusIcon} </Text>

        {/* Workspace */}
        <Text color="gray">workspace </Text>
        <Text color="white">{workspaceDisplay}</Text>
        <Text color="gray"> | </Text>

        {/* Branch */}
        <Text color="gray">branch </Text>
        <Text color="cyan">{branch}</Text>
        <Text color="gray"> | </Text>

        {/* Sandbox */}
        <Text color="gray">sandbox </Text>
        <Text color={sandbox ? 'green' : 'gray'}>
          {sandbox ? 'active' : 'no sandbox'}
        </Text>
        <Text color="gray"> | </Text>

        {/* Model */}
        <Text color="gray">model </Text>
        <Text color="magenta">{modelMode}</Text>
        <Text color="white"> ({model})</Text>
        <Text color="gray"> | </Text>

        {/* Quota */}
        <Text color="gray">quota </Text>
        <Text color={getUsageColor(quota)}>{quota}%</Text>
        <Text color="gray"> | </Text>

        {/* Context */}
        <Text color="gray">context </Text>
        <Text color={getUsageColor(context)}>{context}%</Text>
        <Text color="gray"> | </Text>

        {/* Memory */}
        <Text color="gray">memory </Text>
        <Text color="white">{memoryStr}</Text>
        <Text color="gray"> | </Text>

        {/* Session */}
        <Text color="gray">session </Text>
        <Text color="yellow">{sessionDisplay}</Text>
      </Box>
    </Box>
  );
};

// Made with Bob
