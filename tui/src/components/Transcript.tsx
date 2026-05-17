// Transcript - borderless message container, Claude Code style

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
      paddingX={2}
      paddingY={1}
    >
      {state.messages.length === 0 ? (
        <Text color={theme.textDim}>No messages yet. Start typing to begin...</Text>
      ) : (
        state.messages.map((message, index) => (
          <React.Fragment key={message.id}>
            <MessageRow
              message={message}
              focusedExpandableId={state.focusedExpandableId}
            />
            {/* Separator between messages */}
            {index < state.messages.length - 1 && (
              <Box marginY={1}>
                <Text color={theme.textDimmer}>{'─'.repeat(80)}</Text>
              </Box>
            )}
          </React.Fragment>
        ))
      )}
      
      {/* Auto-scroll indicator */}
      {!state.autoScroll && state.messages.length > 0 && (
        <Box marginTop={1}>
          <Text color={theme.textDim}>
            ↓ new messages — press End to follow
          </Text>
        </Box>
      )}
    </Box>
  );
};

// Made with Bob
