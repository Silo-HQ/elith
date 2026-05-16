// Approval prompt - inline y/n/d/s prompt for changes

import React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../theme.js';

export const ApprovalPrompt: React.FC = () => {
  return (
    <Box paddingLeft={2}>
      <Text>Apply this change? </Text>
      <Text color={theme.accent}>[y]</Text>
      <Text>es  </Text>
      <Text color={theme.accent}>[n]</Text>
      <Text>o  </Text>
      <Text color={theme.accent}>[d]</Text>
      <Text>iff  </Text>
      <Text color={theme.accent}>[s]</Text>
      <Text>kip</Text>
    </Box>
  );
};

// Made with Bob
