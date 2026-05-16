// Status bar - fixed at bottom, single line, always visible

import React from 'react';
import { Box, Text } from 'ink';
import { useAppState } from '../store/appStore.js';
import { theme, glyphs } from '../theme.js';

export const StatusBar = React.memo(() => {
  const state = useAppState();
  const cols = process.stdout.columns || 80;

  // Format numbers
  const formatTokens = (tokens: number): string => {
    if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(1)}k`;
    }
    return tokens.toString();
  };

  // Responsive layout based on terminal width
  const getStatusContent = () => {
    if (cols < 80) {
      // Minimal: only model and tokens
      return (
        <>
          <Text color={theme.brand}>/model {state.model}</Text>
          <Text color={theme.textDimmer}> · </Text>
          <Text color={theme.text}>{formatTokens(state.tokens)} tokens</Text>
        </>
      );
    }

    if (cols < 120) {
      // Medium: omit memory and session
      return (
        <>
          <Text color={theme.textDim}>workspace {state.workspace}</Text>
          <Text color={theme.textDimmer}> · </Text>
          <Text color={theme.accent}>branch {state.branch}</Text>
          <Text color={theme.textDimmer}> · </Text>
          <Text color={state.sandbox === 'no sandbox' ? theme.error : theme.accent}>
            sandbox {state.sandbox}
          </Text>
          <Text color={theme.textDimmer}> · </Text>
          <Text color={theme.brand}>/model {state.model}</Text>
          <Text color={theme.textDimmer}> · </Text>
          <Text color={theme.accent}>quota {state.quotaPercent}% used</Text>
          <Text color={theme.textDimmer}> · </Text>
          <Text color={theme.accent}>context {state.ctxPercent}% used</Text>
          <Text color={theme.textDimmer}> · </Text>
          <Text color={theme.text}>{formatTokens(state.tokens)} tokens</Text>
        </>
      );
    }

    // Full layout
    return (
      <>
        <Text color={theme.textDim}>workspace {state.workspace}</Text>
        <Text color={theme.textDimmer}> · </Text>
        <Text color={theme.accent}>branch {state.branch}</Text>
        <Text color={theme.textDimmer}> · </Text>
        <Text color={state.sandbox === 'no sandbox' ? theme.error : theme.accent}>
          sandbox {state.sandbox}
        </Text>
        <Text color={theme.textDimmer}> · </Text>
        <Text color={theme.brand}>/model {state.model}</Text>
        <Text color={theme.textDimmer}> · </Text>
        <Text color={theme.accent}>quota {state.quotaPercent}% used</Text>
        <Text color={theme.textDimmer}> · </Text>
        <Text color={theme.accent}>context {state.ctxPercent}% used</Text>
        <Text color={theme.textDimmer}> · </Text>
        <Text color={theme.textDim}>memory {state.memoryMB} MB</Text>
        <Text color={theme.textDimmer}> · </Text>
        <Text color={theme.textDim}>session {state.sessionId}</Text>
        <Text color={theme.textDimmer}> · </Text>
        <Text color={theme.text}>{formatTokens(state.tokens)} tokens</Text>
      </>
    );
  };

  return (
    <Box paddingTop={1} width="100%">
      {getStatusContent()}
    </Box>
  );
});

StatusBar.displayName = 'StatusBar';

// Made with Bob
