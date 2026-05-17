// Diff block - shows code changes with +/- lines

import React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../theme.js';
import type { DiffLine } from '../types.js';

interface DiffBlockProps {
  diff: DiffLine[];
}

export const DiffBlock: React.FC<DiffBlockProps> = ({ diff }) => {
  return (
    <Box flexDirection="column" paddingLeft={2}>
      <Text color={theme.textDim}>Diff:</Text>
      {diff.map((line, index) => {
        const prefix = line.type === 'add' ? '+ ' : line.type === 'remove' ? '- ' : '  ';
        const color = line.type === 'add' ? theme.diffAdd : line.type === 'remove' ? theme.diffRemove : theme.textDim;
        
        return (
          <Box key={index} paddingLeft={1}>
            <Text color={color}>{prefix}{line.content}</Text>
          </Box>
        );
      })}
    </Box>
  );
};

// Made with Bob
