// Input area - anchored, never shifts, multiline support

import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { useAppState } from '../store/appStore.js';
import { theme, glyphs } from '../theme.js';
import { useTrigger } from '../hooks/useTrigger.js';

interface InputAreaProps {
  onSubmit: (value: string) => void;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSubmit }) => {
  const state = useAppState();
  const [value, setValue] = useState('');
  const trigger = useTrigger(value);

  const handleSubmit = (val: string) => {
    if (val.trim()) {
      onSubmit(val);
      setValue('');
    }
  };

  const getPlaceholder = (): string => {
    if (trigger.isActive) {
      switch (trigger.mode) {
        case 'slash':
          return 'Type command...';
        case 'file':
          return 'path/to/file';
        case 'shell':
          return 'shell command';
        case 'context':
          return 'path/to/file';
        default:
          return 'Type your message';
      }
    }
    return 'Type your message or @path/to/file';
  };

  const showQueuedBadge = state.status !== 'idle' && value.length > 0;

  return (
    <Box flexDirection="column" borderStyle="single" borderColor={theme.borderDim} paddingX={1}>
      {/* Input row */}
      <Box>
        <Text color={theme.accent}>{glyphs.prompt} </Text>
        <Box flexGrow={1}>
          <TextInput
            value={value}
            onChange={setValue}
            onSubmit={handleSubmit}
            placeholder={getPlaceholder()}
          />
        </Box>
        {showQueuedBadge && (
          <Text color={theme.warning}> (queued)</Text>
        )}
      </Box>

      {/* Hints row */}
      <Box>
        <Text color={theme.textDim} dimColor>
          Shift+Enter multiline · Tab expand · ? help · ↑↓ history
        </Text>
      </Box>
    </Box>
  );
};

// Made with Bob
