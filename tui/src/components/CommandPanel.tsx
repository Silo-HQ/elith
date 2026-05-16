// Command panel - overlay for /, @, !, # triggers

import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { useAppState, useAppDispatch } from '../store/appStore.js';
import { theme, glyphs } from '../theme.js';
import { api } from '../api/client.js';
import type { CommandItem, FileItem } from '../types.js';

const SLASH_COMMANDS: CommandItem[] = [
  { id: 'help', icon: '?', name: '/help', description: 'List all commands and keybindings' },
  { id: 'clear', icon: '✗', name: '/clear', description: 'Clear transcript history' },
  { id: 'model', icon: '◆', name: '/model', description: 'Show and switch active model' },
  { id: 'skills', icon: '⚡', name: '/skills', description: 'List loaded agent skills' },
  { id: 'context', icon: '#', name: '/context', description: 'Show pinned @context files' },
  { id: 'history', icon: '⟳', name: '/history', description: 'Browse past sessions' },
  { id: 'auth', icon: '🔑', name: '/auth', description: 'Show backend connection status' },
  { id: 'mode', icon: '⚙', name: '/mode', description: 'Toggle autonomous ↔ confirm mode' },
  { id: 'exit', icon: '⏻', name: '/exit', description: 'Quit Elith' },
];

export const CommandPanel: React.FC = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [files, setFiles] = useState<FileItem[]>([]);

  // Fetch files for @ trigger
  useEffect(() => {
    if (state.triggerMode === 'file') {
      api.scanWorkspace(state.workspace)
        .then(setFiles)
        .catch(console.error);
    }
  }, [state.triggerMode, state.workspace]);

  if (!state.triggerMode) return null;

  const getItems = (): CommandItem[] => {
    switch (state.triggerMode) {
      case 'slash':
        return SLASH_COMMANDS.filter(cmd =>
          cmd.name.toLowerCase().includes(state.triggerQuery.toLowerCase())
        );
      case 'file':
        return files
          .filter(f => f.path.toLowerCase().includes(state.triggerQuery.toLowerCase()))
          .slice(0, 10)
          .map(f => ({
            id: f.path,
            icon: f.type === 'directory' ? '📁' : '📄',
            name: f.path,
            description: f.type,
          }));
      case 'shell':
        return [
          { id: 'shell', icon: '⚡', name: 'Shell passthrough', description: 'command runs directly' },
        ];
      case 'context':
        return files
          .filter(f => f.type === 'file' && f.path.toLowerCase().includes(state.triggerQuery.toLowerCase()))
          .slice(0, 10)
          .map(f => ({
            id: f.path,
            icon: '#',
            name: f.path,
            description: '[add to context]',
          }));
      default:
        return [];
    }
  };

  const items = getItems();
  const maxRows = 4;
  const visibleItems = items.slice(0, maxRows);

  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      borderColor={theme.borderDim}
      width="100%"
      paddingX={1}
    >
      {visibleItems.length === 0 ? (
        <Text color={theme.textDim}>No matches found</Text>
      ) : (
        visibleItems.map((item, index) => {
          const isSelected = index === state.panelSelectedIndex;
          return (
            <Box
              key={item.id}
              backgroundColor={isSelected ? theme.surfaceAlt : undefined}
            >
              <Text color={theme.accent}>{item.icon} </Text>
              <Text color={isSelected ? theme.text : theme.textDim} bold={isSelected}>
                {item.name}
              </Text>
              <Text color={theme.textDim}> · {item.description}</Text>
            </Box>
          );
        })
      )}
    </Box>
  );
};

// Made with Bob
