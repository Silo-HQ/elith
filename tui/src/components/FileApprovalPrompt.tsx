// FileApprovalPrompt - Claude Code style file creation approval

import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { theme } from '../theme.js';

interface FileApprovalPromptProps {
  fileName: string;
  lineCount: number;
  preview?: string[];
  onApprove: () => void;
  onReject: () => void;
  onAllowAll?: () => void;
}

export const FileApprovalPrompt: React.FC<FileApprovalPromptProps> = ({
  fileName,
  lineCount,
  preview = [],
  onApprove,
  onReject,
  onAllowAll,
}) => {
  const [selectedOption, setSelectedOption] = useState(0);
  const options = [
    { key: '1', label: 'Yes', action: onApprove },
    { key: '2', label: 'Yes, allow all edits during this session (shift+tab)', action: onAllowAll || onApprove },
    { key: '3', label: 'No', action: onReject },
  ];

  useInput((input, key) => {
    if (key.return) {
      options[selectedOption].action();
    } else if (key.upArrow) {
      setSelectedOption(prev => Math.max(0, prev - 1));
    } else if (key.downArrow) {
      setSelectedOption(prev => Math.min(options.length - 1, prev + 1));
    } else if (input === '1') {
      onApprove();
    } else if (input === '2' && onAllowAll) {
      onAllowAll();
    } else if (input === '3') {
      onReject();
    } else if (key.escape || key.tab) {
      onReject();
    }
  });

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={theme.brand}
      paddingX={2}
      paddingY={1}
      marginY={1}
    >
      {/* Header */}
      <Box marginBottom={1}>
        <Text color={theme.brand} bold>● Write</Text>
        <Text color={theme.text}>({fileName})</Text>
      </Box>

      {/* File info */}
      <Box marginBottom={1} flexDirection="column">
        <Box>
          <Text color={theme.textDim}>Create file</Text>
        </Box>
        <Box>
          <Text color={theme.accent}>{fileName}</Text>
        </Box>
        <Box marginTop={1}>
          <Text color={theme.textDim}>Write </Text>
          <Text color={theme.accent}>{lineCount}</Text>
          <Text color={theme.textDim}> lines to </Text>
          <Text color={theme.accent}>{fileName}</Text>
        </Box>
      </Box>

      {/* Preview */}
      {preview.length > 0 && (
        <Box
          flexDirection="column"
          borderStyle="single"
          borderColor={theme.borderDim}
          paddingX={1}
          marginBottom={1}
        >
          {preview.slice(0, 10).map((line, i) => (
            <Box key={i}>
              <Text color={theme.textDimmer}>{String(i + 1).padStart(4)} </Text>
              <Text color={theme.text}>{line}</Text>
            </Box>
          ))}
          {preview.length > 10 && (
            <Box>
              <Text color={theme.textDimmer}>
                ... +{preview.length - 10} lines (ctrl+o to expand)
              </Text>
            </Box>
          )}
        </Box>
      )}

      {/* Question */}
      <Box marginBottom={1}>
        <Text color={theme.text}>Do you want to create </Text>
        <Text color={theme.accent} bold>{fileName}</Text>
        <Text color={theme.text}>?</Text>
      </Box>

      {/* Options */}
      <Box flexDirection="column">
        {options.map((option, index) => (
          <Box key={option.key}>
            <Text color={selectedOption === index ? theme.brand : theme.textDim}>
              {selectedOption === index ? '▸ ' : '  '}
            </Text>
            <Text color={theme.accent}>{option.key}. </Text>
            <Text color={selectedOption === index ? theme.text : theme.textDim}>
              {option.label}
            </Text>
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Box marginTop={1}>
        <Text color={theme.textDimmer}>
          Esc to cancel · Tab to amend
        </Text>
      </Box>
    </Box>
  );
};

// Made with Bob