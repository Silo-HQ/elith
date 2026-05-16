import React from 'react';
import { Box, Text } from 'ink';
import { highlight } from 'cli-highlight';

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
    
    // Apply syntax highlighting if language is specified
    let highlightedContent = line.content;
    if (diff.language) {
      try {
        highlightedContent = highlight(line.content, {
          language: diff.language,
          ignoreIllegals: true,
        });
      } catch {
        // Fallback to plain text if highlighting fails
        highlightedContent = line.content;
      }
    }

    const color = line.type === 'add' ? 'green' : line.type === 'remove' ? 'red' : 'white';
    const bgColor = line.type === 'add' ? 'bgGreen' : line.type === 'remove' ? 'bgRed' : undefined;

    return (
      <Box key={`${line.lineNumber}-${line.type}`}>
        <Text color="gray">{lineNumStr} </Text>
        <Text color={color} backgroundColor={bgColor ? bgColor : undefined}>
          {prefix} {highlightedContent}
        </Text>
      </Box>
    );
  };

  const visibleLines = diff.lines.slice(0, maxHeight);
  const hasMore = diff.lines.length > maxHeight;

  return (
    <Box flexDirection="column" borderStyle="single" borderColor="cyan" paddingX={1}>
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