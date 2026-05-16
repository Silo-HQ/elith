// Tool line - inline status for tool execution

import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { theme, glyphs, spinnerFrames } from '../theme.js';
import type { ToolCall } from '../types.js';

interface ToolLineProps {
  tool: ToolCall;
}

export const ToolLine: React.FC<ToolLineProps> = ({ tool }) => {
  const [spinnerIndex, setSpinnerIndex] = useState(0);

  // Animate spinner for running tools
  useEffect(() => {
    if (tool.status !== 'running') return;

    const interval = setInterval(() => {
      setSpinnerIndex((prev) => (prev + 1) % spinnerFrames.length);
    }, 120);

    return () => clearInterval(interval);
  }, [tool.status]);

  const getStatusGlyph = () => {
    switch (tool.status) {
      case 'success':
        return <Text color={theme.success}>{glyphs.success} </Text>;
      case 'error':
        return <Text color={theme.error}>{glyphs.error} </Text>;
      case 'running':
        return <Text color={theme.accent}>{spinnerFrames[spinnerIndex]} </Text>;
      default:
        return <Text color={theme.textDim}>{glyphs.running} </Text>;
    }
  };

  const getResultText = () => {
    if (tool.status === 'running') {
      return <Text color={theme.accent}> [running...]</Text>;
    }
    if (tool.status === 'error') {
      return <Text color={theme.error}> · error</Text>;
    }
    if (tool.result) {
      return <Text color={theme.textDim}> · {tool.result}</Text>;
    }
    return null;
  };

  return (
    <Box>
      {getStatusGlyph()}
      <Text bold>{tool.name}</Text>
      <Text color={theme.accent}> "{tool.argument}"</Text>
      {getResultText()}
    </Box>
  );
};

// Made with Bob
