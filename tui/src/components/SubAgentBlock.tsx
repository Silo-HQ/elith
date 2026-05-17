// Sub-agent block - collapsible, focus-expandable

import React from 'react';
import { Box, Text } from 'ink';
import { theme, glyphs } from '../theme.js';
import type { ExpandableBlock } from '../types.js';

interface SubAgentBlockProps {
  block: ExpandableBlock;
  focused: boolean;
}

export const SubAgentBlock: React.FC<SubAgentBlockProps> = ({ block, focused }) => {
  const toggleGlyph = block.collapsed ? glyphs.collapsed : glyphs.expanded;
  const glyphColor = focused ? theme.brand : theme.accent;
  
  const formatDuration = (ms?: number): string => {
    if (!ms) return '';
    return `[${(ms / 1000).toFixed(1)}s]`;
  };

  const getOutputSummary = (): string => {
    const lines = block.body.split('\n').length;
    return `[output: ${lines} lines]`;
  };

  if (block.collapsed) {
    return (
      <Box>
        <Text color={glyphColor}>{toggleGlyph} </Text>
        <Text color={theme.accent}>{block.label} </Text>
        <Text color={theme.textDim}>{getOutputSummary()}</Text>
        {!block.active && block.durationMs && (
          <Text color={theme.textDim}> {formatDuration(block.durationMs)}</Text>
        )}
        <Text color={theme.textDim} dimColor> · Tab / Ctrl+I to expand</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Box>
        <Text color={glyphColor}>{toggleGlyph} </Text>
        <Text color={theme.accent}>{block.label}</Text>
        {!block.active && block.durationMs && (
          <Text color={theme.textDim}> {formatDuration(block.durationMs)}</Text>
        )}
      </Box>
      <Box paddingLeft={2} flexDirection="column">
        {block.body.split('\n').map((line, index) => (
          <Box key={index}>
            <Text color={theme.textDimmer}>{glyphs.borderLeft} </Text>
            <Text color={theme.text}>{line}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// Made with Bob
