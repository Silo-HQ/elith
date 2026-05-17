// Activity log - live observability stream with animated spinner

import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { theme, glyphs, activityMessages } from '../theme.js';

interface ActivityLogProps {
  logs: string[];
  isActive: boolean;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ logs, isActive }) => {
  const [spinnerIndex, setSpinnerIndex] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  // Animate spinner
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSpinnerIndex((prev) => (prev + 1) % 8);
    }, 120);

    return () => clearInterval(interval);
  }, [isActive]);

  // Cycle through activity messages
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % activityMessages.length);
    }, 800);

    return () => clearInterval(interval);
  }, [isActive]);

  const spinnerGlyphs = ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'];
  const currentSpinner = spinnerGlyphs[spinnerIndex];

  // Show last 5 logs
  const visibleLogs = logs.slice(-5);

  return (
    <Box flexDirection="column">
      {visibleLogs.map((log, index) => (
        <Box key={index}>
          <Text color={theme.accent}>{glyphs.running} </Text>
          <Text color={theme.textDim}>{log}</Text>
        </Box>
      ))}
      {isActive && (
        <Box>
          <Text color={theme.accent}>{currentSpinner} </Text>
          <Text color={theme.textDim}>{activityMessages[messageIndex]}</Text>
        </Box>
      )}
    </Box>
  );
};

// Made with Bob
