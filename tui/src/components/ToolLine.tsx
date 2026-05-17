// Tool line - Claude Code style tree pattern for tool execution

import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { theme, spinnerFrames } from '../theme.js';
import type { ToolCall } from '../types.js';

interface ToolLineProps {
  tool: ToolCall;
  expanded?: boolean;
  onToggle?: () => void;
}

export const ToolLine: React.FC<ToolLineProps> = ({ tool, expanded = false }) => {
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
        return '●';
      case 'error':
        return '●';
      case 'running':
        return spinnerFrames[spinnerIndex];
      default:
        return '●';
    }
  };

  const getStatusColor = () => {
    switch (tool.status) {
      case 'success':
        return theme.brand;
      case 'error':
        return theme.error;
      case 'running':
        return theme.accent;
      default:
        return theme.brand;
    }
  };

  // Format result for display
  const formatResult = (result: string | undefined): string => {
    if (!result) return 'completed';
    
    // Truncate long results
    const lines = result.split('\n');
    if (lines.length > 3 && !expanded) {
      return `${lines.slice(0, 2).join('\n')}\n  ... +${lines.length - 2} lines (ctrl+o to expand)`;
    }
    return result;
  };

  return (
    <Box flexDirection="column" marginBottom={1}>
      {/* Tool call line */}
      <Box>
        <Text color={getStatusColor()}>{getStatusGlyph()} </Text>
        <Text color={theme.accent} bold>{tool.name}</Text>
        <Text color={theme.textDim}>({tool.argument})</Text>
      </Box>

      {/* Result tree */}
      {tool.status !== 'running' && (
        <Box paddingLeft={2}>
          <Text color={theme.textDimmer}>└ </Text>
          {tool.status === 'error' ? (
            <Text color={theme.error}>{tool.result || 'error'}</Text>
          ) : (
            <Box flexDirection="column">
              <Text color={theme.textDim}>{formatResult(tool.result)}</Text>
              {expanded && tool.result && tool.result.split('\n').length > 3 && (
                <Box marginTop={1} flexDirection="column">
                  {tool.result.split('\n').map((line, i) => (
                    <Box key={i}>
                      <Text color={theme.textDimmer}>  {i + 1} </Text>
                      <Text color={theme.text}>{line}</Text>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Box>
      )}

      {/* Running indicator */}
      {tool.status === 'running' && (
        <Box paddingLeft={2}>
          <Text color={theme.textDimmer}>└ </Text>
          <Text color={theme.accent}>running...</Text>
        </Box>
      )}
    </Box>
  );
};

// Made with Bob
