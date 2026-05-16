import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { CommandMenu } from './CommandMenu.js';

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

  const handleMenuClose = () => {
    setShowCommandMenu(false);
  };

  return (
    <Box flexDirection="column" width="100%">
      {/* Separator Line */}
      <Box width="100%" paddingX={1}>
        <Text color="magenta">{'═'.repeat(80)}</Text>
      </Box>

      {/* Input Box with improved styling */}
      <Box flexDirection="column" paddingX={1} paddingY={1}>
        {/* Label */}
        <Box marginBottom={1}>
          <Text color="gray">╭─ </Text>
          <Text color="magenta" bold>prompt</Text>
          <Text color="gray"> {'─'.repeat(70)}╮</Text>
        </Box>
        
        {/* Input area */}
        <Box paddingX={2}>
          <Text color="magenta" bold>❯ </Text>
          <TextInput
            value={value}
            onChange={handleChange}
            onSubmit={handleSubmit}
            placeholder={placeholder}
          />
        </Box>
        
        {/* Bottom border */}
        <Box marginTop={1}>
          <Text color="gray">╰{'─'.repeat(78)}╯</Text>
        </Box>
      </Box>

      {/* Command Menu - BELOW input, ABOVE status bar */}
      {showCommandMenu && (
        <Box marginTop={1} marginBottom={1}>
          <CommandMenu
            filter={value.slice(1)}
            onSelect={(command) => {
              setValue(command);
              setShowCommandMenu(false);
            }}
            onClose={handleMenuClose}
          />
        </Box>
      )}
    </Box>
  );
};

// Made with Bob
