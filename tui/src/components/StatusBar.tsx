// Status bar - fixed at bottom, single line, always visible

import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { useAppState } from '../store/appStore.js';
import { theme, glyphs } from '../theme.js';

export const StatusBar = React.memo(() => {
  const state = useAppState();
  const [cols, setCols] = useState(process.stdout.columns || 80);

  // Handle terminal resize
  useEffect(() => {
    const handleResize = () => {
      setCols(process.stdout.columns || 80);
    };

    process.stdout.on('resize', handleResize);
    return () => {
      process.stdout.off('resize', handleResize);
    };
  }, []);

  // Format numbers
  const formatTokens = (tokens: number | undefined): string => {
    if (!tokens && tokens !== 0) {
      return '0';
    }
    if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(1)}k`;
    }
    return tokens.toString();
  };

  // Responsive layout based on terminal width
  const getStatusContent = () => {
    const isOffline = state.backendStatus === 'offline';
    const displayTokens = isOffline ? '--' : formatTokens(state.tokens);
    const displayQuota = isOffline ? '--' : `${state.quotaPercent}%`;
    const displayContext = isOffline ? '--' : `${state.ctxPercent}%`;

    if (cols < 80) {
      // Minimal: only model and tokens
      return (
        <>
          {isOffline && (
            <>
              <Text color={theme.error}>⚠ backend offline</Text>
              <Text color={theme.textDimmer}> · </Text>
            </>
          )}
          <Text color={theme.brand}>/model {state.model}</Text>
          <Text color={theme.textDimmer}> · </Text>
          <Text color={theme.text}>{displayTokens} tokens</Text>
        </>
      );
    }

    if (cols < 120) {
      // Medium: omit memory and session
      return (
        <>
          {isOffline && (
            <>
              <Text color={theme.error}>⚠ backend offline</Text>
              <Text color={theme.textDimmer}> · </Text>
            </>
          )}
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
          <Text color={theme.accent}>quota {displayQuota} used</Text>
          <Text color={theme.textDimmer}> · </Text>
          <Text color={theme.accent}>context {displayContext} used</Text>
          <Text color={theme.textDimmer}> · </Text>
          <Text color={theme.text}>{displayTokens} tokens</Text>
        </>
      );
    }

    // Full layout
    return (
      <>
        {isOffline && (
          <>
            <Text color={theme.error}>⚠ backend offline</Text>
            <Text color={theme.textDimmer}> · </Text>
          </>
        )}
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
        <Text color={theme.accent}>quota {displayQuota} used</Text>
        <Text color={theme.textDimmer}> · </Text>
        <Text color={theme.accent}>context {displayContext} used</Text>
        <Text color={theme.textDimmer}> · </Text>
        <Text color={theme.textDim}>memory {state.memoryMB} MB</Text>
        <Text color={theme.textDimmer}> · </Text>
        <Text color={theme.textDim}>session {state.sessionId}</Text>
        <Text color={theme.textDimmer}> · </Text>
        <Text color={theme.text}>{displayTokens} tokens</Text>
      </>
    );
  };

  return (
    <Box width="100%" flexShrink={0}>
      {getStatusContent()}
    </Box>
  );
});

StatusBar.displayName = 'StatusBar';

// Made with Bob
