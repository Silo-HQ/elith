// Command panel - two-column filtered dropdown, Claude Code style

import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { useAppState } from '../store/appStore.js';
import { theme } from '../theme.js';
import type { CommandItem, FileItem } from '../types.js';
import { readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const SLASH_COMMANDS: CommandItem[] = [
  { id: 'add-dir', icon: '📁', name: '/add-dir', description: 'Add a new working directory' },
  { id: 'agents', icon: '🤖', name: '/agents', description: 'Manage agent configurations' },
  { id: 'clear', icon: '✗', name: '/clear', description: 'Start a new session with empty context' },
  { id: 'model', icon: '◆', name: '/model', description: 'Show and switch active model' },
  { id: 'skills', icon: '⚡', name: '/skills', description: 'List loaded agent skills' },
  { id: 'export', icon: '💾', name: '/export', description: 'Export conversation to file' },
  { id: 'exit', icon: '⏻', name: '/exit', description: 'Exit the CLI' },
];

function scanLocalFiles(dir: string, depth = 0): FileItem[] {
  if (depth > 3) return [];
  const SKIP = new Set(['.git', 'node_modules', '__pycache__', 'venv', '.venv', 'dist', 'build']);
  try {
    return readdirSync(dir).flatMap(name => {
      if (SKIP.has(name)) return [];
      const full = join(dir, name);
      const stat = statSync(full);
      const path = relative(process.cwd(), full);
      if (stat.isDirectory()) {
        return [{ path, type: 'directory' as const }, ...scanLocalFiles(full, depth + 1)];
      }
      return [{ path, type: 'file' as const }];
    });
  } catch {
    return [];
  }
}

export const CommandPanel: React.FC = () => {
  const state = useAppState();
  const [files, setFiles] = useState<FileItem[]>([]);

  // Scan files locally for @ trigger
  useEffect(() => {
    if (state.triggerMode === 'file') {
      const scannedFiles = scanLocalFiles(state.workspace);
      setFiles(scannedFiles);
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
          { id: 'shell', icon: '!', name: 'Shell passthrough', description: 'command runs directly' },
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
  const maxRows = 7;
  const visibleItems = items.slice(0, maxRows);

  return (
    <Box
      flexDirection="column"
      paddingX={2}
      marginBottom={1}
    >
      {visibleItems.length === 0 ? (
        <Box>
          <Text color={theme.textDim}>No matches found</Text>
        </Box>
      ) : (
        visibleItems.map((item, index) => {
          const isSelected = index === state.panelSelectedIndex;
          return (
            <Box key={item.id}>
              {/* Left column - command name (20 chars) */}
              <Box width={20}>
                <Text color={isSelected ? theme.brand : theme.accent} bold={isSelected}>
                  {item.name}
                </Text>
              </Box>
              
              {/* Right column - description */}
              <Box flexGrow={1}>
                <Text color={isSelected ? theme.text : theme.textDim}>
                  {item.description}
                </Text>
              </Box>
            </Box>
          );
        })
      )}
    </Box>
  );
};

// Made with Bob
