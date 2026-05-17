// Enhanced spinner with rotating thinking words - Claude Code style

import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { theme } from '../../theme.js';

const THINKING_WORDS = [
  'Thinking',
  'Ruminating',
  'Manifesting',
  'Composing',
  'Perusing',
  'Reticulating',
  'Cogitating',
  'Synthesizing',
  'Deliberating',
  'Contemplating',
];

const SPINNER_TIPS = [
  'Use /btw to ask a side question without interrupting',
  'Press ctrl+o to expand tool output',
  'Use @filename to add a file to context',
  'Type /skills to see all 12 active agent skills',
  'Use /export to save this session to markdown',
  'Type /model to switch providers mid-session',
];

interface EnhancedSpinnerProps {
  startTime?: number;
  tokens?: number;
  showTip?: boolean;
}

export const EnhancedSpinner: React.FC<EnhancedSpinnerProps> = ({
  startTime = Date.now(),
  tokens = 0,
  showTip = true,
}) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [tipIndex] = useState(Math.floor(Math.random() * SPINNER_TIPS.length));
  const [elapsed, setElapsed] = useState(0);

  // Rotate thinking word every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % THINKING_WORDS.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Update elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const getProgressPhrase = (): string => {
    if (elapsed < 5) return 'just getting started';
    if (elapsed < 15) return 'making progress';
    if (elapsed < 30) return 'working on it';
    if (elapsed < 60) return 'almost done thinking';
    return 'taking a bit longer';
  };

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      {/* Main spinner line */}
      <Box>
        <Text color={theme.textDimmer}>· </Text>
        <Text color={theme.thinking}>{THINKING_WORDS[wordIndex]}</Text>
        <Text color={theme.textDim}>… </Text>
        <Text color={theme.textDimmer}>({formatTime(elapsed)}</Text>
        {tokens > 0 && (
          <>
            <Text color={theme.textDimmer}> · ↓ </Text>
            <Text color={theme.textDimmer}>{tokens.toLocaleString()} tokens</Text>
          </>
        )}
        <Text color={theme.textDimmer}> · {getProgressPhrase()})</Text>
      </Box>

      {/* Tip line */}
      {showTip && (
        <Box paddingLeft={2} marginTop={1}>
          <Text color={theme.textDimmer}>└ Tip: </Text>
          <Text color={theme.textDim}>{SPINNER_TIPS[tipIndex]}</Text>
        </Box>
      )}
    </Box>
  );
};

// Preset spinner types for different contexts
export const ThinkingSpinner: React.FC<{ startTime?: number; tokens?: number }> = ({ 
  startTime, 
  tokens 
}) => (
  <EnhancedSpinner startTime={startTime} tokens={tokens} showTip={true} />
);

export const LoadingSpinner: React.FC = () => (
  <Box>
    <Text color={theme.accent}>⣾ </Text>
    <Text color={theme.textDim}>Loading...</Text>
  </Box>
);

export const ProcessingSpinner: React.FC = () => (
  <Box>
    <Text color={theme.warning}>⣾ </Text>
    <Text color={theme.textDim}>Processing...</Text>
  </Box>
);

// Made with Bob
