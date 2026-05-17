import React from 'react';
import { Box, Text } from 'ink';

export interface DiffLine {
  lineNumber: number;
  type: 'add' | 'remove' | 'context';
  content: string;
}

export interface FileDiff {
  path: string;
  language?: string;
  lines: DiffLine[];
}

interface DiffViewerProps {
  diff: FileDiff;
  maxHeight?: number;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ diff, maxHeight = 20 }) => {
  const renderLine = (line: DiffLine) => {
    const lineNumStr = line.lineNumber.toString().padStart(4, ' ');
    const prefix = line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' ';
    
    const color = line.type === 'add' ? 'green' : line.type === 'remove' ? 'red' : 'white';

    return (
      <Box key={`${line.lineNumber}-${line.type}`}>
        <Text color="gray">{lineNumStr} </Text>
        <Text color={color}>
          {prefix} {line.content}
        </Text>
      </Box>
    );
  };

  const visibleLines = diff.lines.slice(0, maxHeight);
  const hasMore = diff.lines.length > maxHeight;

  return (
    <Box flexDirection="column" paddingX={1}>
      {/* Header */}
      <Box marginBottom={1}>
        <Text color="cyan" bold>
          📄 {diff.path}
        </Text>
        {diff.language && (
          <Text color="gray"> ({diff.language})</Text>
        )}
      </Box>

      {/* Diff Lines */}
      <Box flexDirection="column">
        {visibleLines.map(renderLine)}
      </Box>

      {/* More indicator */}
      {hasMore && (
        <Box marginTop={1}>
          <Text color="gray" italic>
            ... {diff.lines.length - maxHeight} more lines
          </Text>
        </Box>
      )}
    </Box>
  );
};

// Made with Bob
