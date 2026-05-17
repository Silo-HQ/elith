// Code block - syntax-highlighted code display

import React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../theme.js';
import type { CodeBlock as CodeBlockType } from '../types.js';

interface CodeBlockProps {
  block: CodeBlockType;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ block }) => {
  return (
    <Box flexDirection="column" paddingLeft={4}>
      <Box justifyContent="flex-end">
        <Text color={theme.textDim} dimColor>{block.lang}</Text>
      </Box>
      {block.code.split('\n').map((line, index) => (
        <Box key={index}>
          <Text color={theme.text}>{line}</Text>
        </Box>
      ))}
    </Box>
  );
};

// Made with Bob
