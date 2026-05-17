// CommandMenu - Claude Code style command autocomplete panel

import React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../theme.js';

interface Command {
  name: string;
  description: string;
}

const COMMANDS: Command[] = [
  { name: '/add-dir', description: 'Add a new working directory' },
  { name: '/agents', description: 'Manage agent configurations' },
  { name: '/background', description: 'Send this session to the background and free the terminal' },
  { name: '/branch', description: 'Create a branch of the current conversation at this point' },
  { name: '/btw', description: 'Ask a quick side question without interrupting the main conversation' },
  { name: '/clear', description: 'Start a new session with empty context; previous session stays on disk (resumable with /resume)' },
  { name: '/color', description: 'Set the prompt bar color for this session' },
  { name: '/compact', description: 'Free up context by summarizing the conversation so far' },
  { name: '/config', description: 'Open config panel' },
  { name: '/context', description: 'Visualize current context usage as a colored grid' },
  { name: '/copy', description: "Copy Claude's last response to clipboard (or /copy N for the Nth-latest)" },
  { name: '/diff', description: 'View uncommitted changes and per-turn diffs' },
  { name: '/doctor', description: 'Diagnose and verify your Claude Code installation and settings' },
  { name: '/effort', description: 'Set effort level for model usage' },
  { name: '/exit', description: 'Exit the CLI' },
  { name: '/export', description: 'Export the current conversation to a file or clipboard' },
  { name: '/fast', description: 'Toggle fast mode (Opus 4.7)' },
  { name: '/feedback', description: 'Submit feedback about Claude Code' },
  { name: '/focus', description: 'Toggle focus view (show only your prompt, a tool summary, and the final response)' },
  { name: '/goal', description: 'Set a goal — keep working until the condition is met' },
  { name: '/help', description: 'Show help and available commands' },
  { name: '/hooks', description: 'View hook configurations for tool events' },
  { name: '/ide', description: 'Manage IDE integrations and show status' },
  { name: '/keybindings', description: 'Open or create your keybindings configuration file' },
  { name: '/login', description: 'Sign in with your Anthropic account' },
  { name: '/logout', description: 'Sign out from your Anthropic account' },
  { name: '/mcp', description: 'Manage MCP servers' },
  { name: '/memory', description: 'Edit Claude memory files' },
  { name: '/mobile', description: 'Show QR code to download the Claude mobile app' },
  { name: '/model', description: 'Show or switch the current model' },
  { name: '/status', description: 'Show system status and configuration' },
  { name: '/theme', description: 'Switch color theme' },
];

interface CommandMenuProps {
  filter?: string;
  onSelect?: (command: string) => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({ filter = '' }) => {
  const filteredCommands = filter
    ? COMMANDS.filter(cmd => 
        cmd.name.toLowerCase().includes(filter.toLowerCase()) ||
        cmd.description.toLowerCase().includes(filter.toLowerCase())
      )
    : COMMANDS;

  if (filteredCommands.length === 0) {
    return null;
  }

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={theme.border}
      paddingX={1}
      paddingY={1}
      marginBottom={1}
    >
      <Box marginBottom={1}>
        <Text color={theme.brand} bold>Available Commands</Text>
        {filter && (
          <>
            <Text color={theme.textDim}> - filtered by: </Text>
            <Text color={theme.accent}>{filter}</Text>
          </>
        )}
      </Box>
      
      <Box flexDirection="column">
        {filteredCommands.slice(0, 10).map((cmd, index) => (
          <Box key={cmd.name} marginBottom={index < 9 ? 0 : 0}>
            <Text color={theme.accent}>{cmd.name.padEnd(20)}</Text>
            <Text color={theme.textDim}>{cmd.description}</Text>
          </Box>
        ))}
        
        {filteredCommands.length > 10 && (
          <Box marginTop={1}>
            <Text color={theme.textDimmer}>
              ... and {filteredCommands.length - 10} more commands
            </Text>
          </Box>
        )}
      </Box>
      
      <Box marginTop={1}>
        <Text color={theme.textDimmer}>
          Type to filter · Press Tab to autocomplete · Esc to close
        </Text>
      </Box>
    </Box>
  );
};

// Made with Bob
