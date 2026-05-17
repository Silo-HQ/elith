// StatusBar - Single line status bar, Claude Code style

import React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../theme.js';
import { execSync } from 'child_process';

interface StatusBarProps {
  model?: string;
  backendStatus?: 'online' | 'offline' | 'checking';
  tokens?: number;
  quotaPercent?: number;
  ctxPercent?: number;
  workspace?: string;
}

function getBranch(): string {
  try {
    return execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
  } catch {
    return 'main';
  }
}

export const StatusBar = React.memo<StatusBarProps>(({
  model = 'lmstudio',
  backendStatus = 'checking',
  tokens = 0,
  ctxPercent = 0,
  workspace = process.cwd()
}) => {
  const branch = getBranch();
  const workspaceName = workspace.split('/').pop() || 'elith';
  
  const getStatusColor = () => {
    if (backendStatus === 'offline') return theme.error;
    if (backendStatus === 'online') return theme.success;
    return theme.warning;
  };

  const getStatusText = () => {
    if (backendStatus === 'offline') return 'backend offline';
    if (backendStatus === 'online') return 'backend online';
    return 'checking...';
  };

  return (
    <Box flexDirection="column" flexShrink={0}>
      {/* Separator */}
      <Box>
        <Text color={theme.textDimmer}>{'─'.repeat(80)}</Text>
      </Box>

      {/* Single line status */}
      <Box paddingX={2} paddingY={1}>
        {/* Left side */}
        <Text color={theme.textDim}>workspace </Text>
        <Text color={theme.text}>{workspaceName}</Text>
        
        <Text color={theme.textDim}> · branch </Text>
        <Text color={theme.accent}>{branch}</Text>
        
        <Text color={theme.textDim}> · model </Text>
        <Text color={theme.accent}>{model}</Text>
        
        <Text color={theme.textDim}> · </Text>
        <Text color={getStatusColor()}>{getStatusText()}</Text>
        
        {/* Spacer */}
        <Box flexGrow={1} />
        
        {/* Right side */}
        <Text color={theme.textDim}>● context </Text>
        <Text color={theme.text}>{ctxPercent}%</Text>
        
        <Text color={theme.textDim}> · </Text>
        <Text color={theme.text}>{tokens.toLocaleString()} tokens</Text>
      </Box>
    </Box>
  );
});

StatusBar.displayName = 'StatusBar';

// Made with Bob
