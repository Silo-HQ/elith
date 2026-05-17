import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { CommandMenu } from './CommandMenu.js';
import { theme } from '../theme.js';

interface ChatInputProps {
  onSubmit: (value: string) => void;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSubmit,
  placeholder = 'Type your message or @path/to/file',
}) => {
  const [value, setValue] = useState('');
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [isFocused] = useState(true);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    // Show command menu when "/" is typed
    setShowCommandMenu(newValue.startsWith('/') && newValue.length > 0);
  };

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value);
      setValue('');
      setShowCommandMenu(false);
    }
  };

  const borderColor = isFocused ? theme.brand : theme.borderDim;
  const promptColor = isFocused ? theme.accent : theme.textDim;

  return (
    <Box flexDirection="column" width="100%">
      {/* Command Menu - ABOVE input for better visibility */}
      {showCommandMenu && (
        <Box marginBottom={1}>
          <CommandMenu
            filter={value.slice(1)}
            onSelect={(command) => {
              setValue(command);
              setShowCommandMenu(false);
            }}
          />
        </Box>
      )}

      {/* Input Box with polished styling */}
      <Box flexDirection="column" paddingX={2} paddingY={1}>
        {/* Top border with label */}
        <Box>
          <Text color={borderColor}>╭─ </Text>
          <Text color={promptColor} bold>✎ prompt</Text>
          <Text color={borderColor}> {'─'.repeat(68)}╮</Text>
        </Box>
        
        {/* Input area with enhanced prompt */}
        <Box paddingX={1} paddingY={1}>
          <Text color={promptColor} bold>› </Text>
          <TextInput
            value={value}
            onChange={handleChange}
            onSubmit={handleSubmit}
            placeholder={placeholder}
            showCursor={true}
          />
        </Box>
        
        {/* Bottom border */}
        <Box>
          <Text color={borderColor}>╰{'─'.repeat(78)}╯</Text>
        </Box>

        {/* Hint text */}
        {!value && (
          <Box marginTop={1} paddingX={1}>
            <Text color={theme.textDimmer}>
              💡 Tip: Use <Text color={theme.accent}>/</Text> for commands,
              <Text color={theme.accent}> @</Text> for files,
              <Text color={theme.accent}> #</Text> for context
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

// Made with Bob
