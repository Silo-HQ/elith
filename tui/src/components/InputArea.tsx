// Input area - borderless, Claude Code style with shell mode support

import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { useAppState, useAppDispatch } from '../store/appStore.js';
import { theme } from '../theme.js';

interface InputAreaProps {
  onSubmit: (value: string) => void;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSubmit }) => {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [value, setValue] = useState('');

  const handleChange = (val: string) => {
    setValue(val);
    
    // Detect shell mode
    if (val.startsWith('!')) {
      if (!state.shellMode) {
        dispatch({ type: 'SET_SHELL_MODE', payload: true });
      }
    } else if (state.shellMode) {
      dispatch({ type: 'SET_SHELL_MODE', payload: false });
    }
  };

  const handleSubmit = (val: string) => {
    if (val.trim()) {
      onSubmit(val);
      setValue('');
      if (state.shellMode) {
        dispatch({ type: 'SET_SHELL_MODE', payload: false });
      }
    }
  };

  const getPromptGlyph = (): string => {
    if (state.shellMode) return '!';
    return '>';
  };

  const getPromptColor = (): string => {
    if (state.shellMode) return theme.warning;
    return theme.brand;
  };

  const getHintText = (): string => {
    if (state.shellMode) return '! for shell mode';
    if (state.triggerMode === 'slash') return '/ for commands';
    return '? for shortcuts';
  };

  const showQueuedBadge = state.status !== 'idle' && value.length > 0;

  return (
    <Box flexDirection="column" paddingX={2} flexShrink={0}>
      {/* Separator above input */}
      <Box marginBottom={1}>
        <Text color={theme.textDimmer}>{'─'.repeat(80)}</Text>
      </Box>

      {/* Input row */}
      <Box>
        <Text color={getPromptColor()}>{getPromptGlyph()} </Text>
        <Box flexGrow={1}>
          <TextInput
            value={value}
            onChange={handleChange}
            onSubmit={handleSubmit}
            placeholder=""
          />
        </Box>
        {showQueuedBadge && (
          <Text color={theme.warning}> (queued)</Text>
        )}
      </Box>

      {/* Hint line */}
      <Box marginTop={1}>
        <Text color={theme.textDimmer}>{getHintText()}</Text>
      </Box>
    </Box>
  );
};

// Made with Bob
