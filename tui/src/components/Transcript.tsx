// Transcript - scrollable, fixed-height message container

import React from 'react';
import { Box, Text } from 'ink';
import { useAppState } from '../store/appStore.js';
import { MessageRow } from './MessageRow.js';
import { theme } from '../theme.js';

export const Transcript: React.FC = () => {
  const state = useAppState();
  const rows = process.stdout.rows || 24;
  
  // Calculate fixed height: total rows - banner(6) - input(3) - commandPanel(0-4) - statusBar(1)
  const bannerHeight = 6;
  const inputHeight = 3;
  const statusBarHeight = 1;
  const commandPanelHeight = state.triggerMode ? 4 : 0;
  const transcriptHeight = rows - bannerHeight - inputHeight - commandPanelHeight - statusBarHeight;

  return (
    <Box
      flexDirection="column"
      height={transcriptHeight}
      paddingX={1}
      paddingY={1}
    >
      {state.messages.length === 0 ? (
        <Text color={theme.textDim}>No messages yet. Start typing to begin...</Text>
      ) : (
        state.messages.map((message) => (
          <MessageRow
            key={message.id}
            message={message}
            focusedExpandableId={state.focusedExpandableId}
          />
        ))
      )}
      
      {/* Auto-scroll indicator */}
      {!state.autoScroll && (
        <Box marginTop={1}>
          <Text color={theme.textDim} dimColor>
            ↓ new messages — press End to follow
          </Text>
        </Box>
      )}
    </Box>
  );
};

// Made with Bob
