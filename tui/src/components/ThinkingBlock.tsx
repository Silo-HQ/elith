// Thinking block - collapsible, focus-expandable

import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { theme, glyphs, spinnerFrames } from '../theme.js';
import type { ExpandableBlock } from '../types.js';

interface ThinkingBlockProps {
  block: ExpandableBlock;
  focused: boolean;
}

export const ThinkingBlock: React.FC<ThinkingBlockProps> = ({ block, focused }) => {
  const [spinnerIndex, setSpinnerIndex] = useState(0);

  // Animate spinner while active
  useEffect(() => {
    if (!block.active) return;

    const interval = setInterval(() => {
      setSpinnerIndex((prev) => (prev + 1) % spinnerFrames.length);
    }, 80);

    return () => clearInterval(interval);
  }, [block.active]);

  const toggleGlyph = block.collapsed ? glyphs.collapsed : glyphs.expanded;
  const glyphColor = focused ? theme.brand : theme.thinking;
  const spinner = block.active ? spinnerFrames[spinnerIndex] : '';
  
  const formatDuration = (ms?: number): string => {
    if (!ms) return '';
    return `[${(ms / 1000).toFixed(1)}s]`;
  };

  if (block.collapsed) {
    return (
      <Box>
        <Text color={glyphColor}>{toggleGlyph} </Text>
        <Text color={theme.thinking}>Thinking </Text>
        {block.active && <Text color={theme.thinking}>{spinner} </Text>}
        {!block.active && block.durationMs && (
          <Text color={theme.textDim}>{formatDuration(block.durationMs)}</Text>
        )}
        <Text color={theme.textDim} dimColor> · press Tab or Ctrl+I to expand</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Box>
        <Text color={glyphColor}>{toggleGlyph} </Text>
        <Text color={theme.thinking}>Thinking </Text>
        {block.active && <Text color={theme.thinking}>{spinner} </Text>}
        {!block.active && block.durationMs && (
          <Text color={theme.textDim}>{formatDuration(block.durationMs)}</Text>
        )}
      </Box>
      <Box paddingLeft={2} flexDirection="column">
        <Text color={theme.textDim}>{glyphs.borderLeft}</Text>
        <Box paddingLeft={1}>
          <Text color={theme.thinking} italic>
            {block.body}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

// Made with Bob
