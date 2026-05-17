// Transcript - scrollable, fixed-height message container

import React from 'react';
import { Box, Text } from 'ink';
import { useAppState } from '../store/appStore.js';
import { MessageRow } from './MessageRow.js';
import { theme } from '../theme.js';

export const Transcript: React.FC = () => {
  const state = useAppState();

  return (
    <Box
      flexDirection="column"
      flexGrow={1}
      paddingX={1}
      paddingY={1}
      overflow="hidden"
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
