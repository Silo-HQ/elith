// Approval prompt - inline numbered options, Claude Code style

import React, { useState } from 'react';
import { Box, Text } from 'ink';
import { theme } from '../theme.js';

interface ApprovalPromptProps {
  fileName?: string;
  action?: string;
  onApprove?: () => void;
  onReject?: () => void;
  onAllowAll?: () => void;
}

export const ApprovalPrompt: React.FC<ApprovalPromptProps> = ({
  fileName = 'file',
  action = 'create',
  onApprove,
  onReject,
  onAllowAll,
}) => {
  const [selectedIndex] = useState(0);

  const options = [
    { key: '1', label: 'Yes', action: onApprove },
    { key: '2', label: 'Yes, allow all edits during this session (shift+tab)', action: onAllowAll },
    { key: '3', label: 'No', action: onReject },
  ];

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1} marginY={1}>
      {/* Question */}
      <Box marginBottom={1}>
        <Text color={theme.text}>Do you want to {action} </Text>
        <Text color={theme.accent} bold>{fileName}</Text>
        <Text color={theme.text}>?</Text>
      </Box>

      {/* Options */}
      {options.map((option, index) => (
        <Box key={option.key} marginBottom={index < options.length - 1 ? 1 : 0}>
          {selectedIndex === index && (
            <Text color={theme.brand}>{'>'} </Text>
          )}
          {selectedIndex !== index && (
            <Text color={theme.textDimmer}>  </Text>
          )}
          <Text color={theme.accent}>{option.key}. </Text>
          <Text color={selectedIndex === index ? theme.text : theme.textDim}>
            {option.label}
          </Text>
        </Box>
      ))}

      {/* Hints */}
      <Box marginTop={1}>
        <Text color={theme.textDimmer}>Esc to cancel · Tab to amend</Text>
      </Box>
    </Box>
  );
};

// Made with Bob
