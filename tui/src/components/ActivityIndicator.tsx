// ActivityIndicator - Claude Code style status messages with timing

import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { theme, activityMessages } from '../theme.js';

interface ActivityIndicatorProps {
  message?: string;
  showTimer?: boolean;
}

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({ 
  message, 
  showTimer = true 
}) => {
  const [elapsed, setElapsed] = useState(0);
  const [spinnerFrame, setSpinnerFrame] = useState(0);
  
  const spinnerFrames = ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);
    
    const spinner = setInterval(() => {
      setSpinnerFrame(prev => (prev + 1) % spinnerFrames.length);
    }, 80);
    
    return () => {
      clearInterval(timer);
      clearInterval(spinner);
    };
  }, []);
  
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  
  const displayMessage = message || activityMessages[Math.floor(Math.random() * activityMessages.length)];
  
  return (
    <Box>
      <Text color={theme.thinking}>{spinnerFrames[spinnerFrame]} </Text>
      <Text color={theme.thinking}>{displayMessage}</Text>
      {showTimer && elapsed > 0 && (
        <Text color={theme.textDim}> ({formatTime(elapsed)})</Text>
      )}
    </Box>
  );
};

// Cooked indicator - shows completion time
interface CookedIndicatorProps {
  duration: string;
}

export const CookedIndicator: React.FC<CookedIndicatorProps> = ({ duration }) => {
  return (
    <Box>
      <Text color={theme.success}>✓ </Text>
      <Text color={theme.textDim}>Cooked for {duration}</Text>
    </Box>
  );
};

// Made with Bob