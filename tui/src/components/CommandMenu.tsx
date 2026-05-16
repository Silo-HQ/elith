import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { COMMANDS } from '../types/commands.js';

interface CommandMenuProps {
  filter?: string;
  onSelect?: (command: string) => void;
  onClose?: () => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({
  filter = '',
  onSelect,
  onClose
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Filter commands based on input
  const filteredCommands = COMMANDS.filter((cmd) => {
    const searchTerm = filter.toLowerCase();
    return (
      cmd.name.toLowerCase().includes(searchTerm) ||
      (cmd.aliases && cmd.aliases.some((alias) => alias.toLowerCase().includes(searchTerm)))
    );
  }).slice(0, 6); // Show max 6 commands (60% reduction from 15)

  useEffect(() => {
    // Reset selection when filter changes
    setSelectedIndex(0);
  }, [filter]);

  // Keyboard navigation
  useInput((_input, key) => {
    if (key.upArrow) {
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    } else if (key.downArrow) {
      setSelectedIndex((prev) => Math.min(filteredCommands.length - 1, prev + 1));
    } else if (key.return && onSelect) {
      onSelect(`/${filteredCommands[selectedIndex].name}`);
    } else if (key.escape && onClose) {
      onClose();
    }
  });

  if (filteredCommands.length === 0) {
    return null;
  }

  const totalMatches = COMMANDS.filter((cmd) => {
    const searchTerm = filter.toLowerCase();
    return (
      cmd.name.toLowerCase().includes(searchTerm) ||
      (cmd.aliases && cmd.aliases.some((alias) => alias.toLowerCase().includes(searchTerm)))
    );
  }).length;

  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      borderColor="gray"
      width="100%"  // Full width
      paddingX={1}
    >
      {/* Header with navigation hint */}
      <Box justifyContent="space-between" width="100%">
        <Text color="gray" dimColor>
          ↑↓ navigate • ⏎ select • esc close
        </Text>
        {totalMatches > 6 && (
          <Text color="gray" dimColor>
            ({totalMatches - 6} more...)
          </Text>
        )}
      </Box>

      {/* Command List - Horizontal layout for space efficiency */}
      <Box flexDirection="row" flexWrap="wrap" marginTop={1}>
        {filteredCommands.map((cmd, index) => (
          <Box key={cmd.name} marginRight={2}>
            {index === selectedIndex ? (
              <Text color="cyan" bold>
                {'> /'}{cmd.name}
              </Text>
            ) : (
              <Text color="white">
                {'  /'}{cmd.name}
              </Text>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// Made with Bob
