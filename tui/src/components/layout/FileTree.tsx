// File tree component for sidebar
import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { readdirSync, statSync } from 'fs';
import { join, basename } from 'path';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  expanded?: boolean;
}

interface FileTreeProps {
  root: string;
  onSelect?: (path: string) => void;
  selectedPath?: string;
  maxDepth?: number;
  showHidden?: boolean;
  gitStatus?: boolean;
}

const SKIP_DIRS = new Set([
  '.git',
  'node_modules',
  '__pycache__',
  'venv',
  '.venv',
  'dist',
  'build',
  '.next',
  'target',
]);

const FILE_ICONS: Record<string, string> = {
  // Directories
  directory: '📁',
  'directory-open': '📂',
  
  // Languages
  '.ts': '🔷',
  '.tsx': '⚛️',
  '.js': '🟨',
  '.jsx': '⚛️',
  '.py': '🐍',
  '.go': '🔵',
  '.rs': '🦀',
  '.java': '☕',
  '.cpp': '⚙️',
  '.c': '⚙️',
  
  // Config
  '.json': '📋',
  '.yaml': '📄',
  '.yml': '📄',
  '.toml': '📄',
  '.xml': '📄',
  
  // Docs
  '.md': '📝',
  '.txt': '📄',
  '.pdf': '📕',
  
  // Web
  '.html': '🌐',
  '.css': '🎨',
  '.scss': '🎨',
  
  // Other
  '.gitignore': '🚫',
  '.env': '🔐',
  'default': '📄',
};

function getFileIcon(name: string, type: 'file' | 'directory', expanded?: boolean): string {
  if (type === 'directory') {
    return expanded ? FILE_ICONS['directory-open'] : FILE_ICONS['directory'];
  }
  
  const ext = name.includes('.') ? '.' + name.split('.').pop() : '';
  return FILE_ICONS[ext] || FILE_ICONS[name] || FILE_ICONS['default'];
}

function buildFileTree(
  dir: string,
  depth: number,
  maxDepth: number,
  showHidden: boolean
): FileNode[] {
  if (depth > maxDepth) return [];

  try {
    const entries = readdirSync(dir);
    const nodes: FileNode[] = [];

    for (const entry of entries) {
      // Skip hidden files if not showing them
      if (!showHidden && entry.startsWith('.')) continue;
      
      // Skip common directories
      if (SKIP_DIRS.has(entry)) continue;

      const fullPath = join(dir, entry);
      try {
        const stat = statSync(fullPath);
        const node: FileNode = {
          name: entry,
          path: fullPath,
          type: stat.isDirectory() ? 'directory' : 'file',
          expanded: false,
        };

        if (node.type === 'directory') {
          node.children = buildFileTree(fullPath, depth + 1, maxDepth, showHidden);
        }

        nodes.push(node);
      } catch {
        // Skip files we can't read
        continue;
      }
    }

    // Sort: directories first, then files, alphabetically
    return nodes.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  } catch {
    return [];
  }
}

const FileTreeNode: React.FC<{
  node: FileNode;
  depth: number;
  onSelect?: (path: string) => void;
  selectedPath?: string;
  onToggle?: (path: string) => void;
}> = ({ node, depth, onSelect, selectedPath, onToggle }) => {
  const isSelected = selectedPath === node.path;
  const indent = '  '.repeat(depth);
  const icon = getFileIcon(node.name, node.type, node.expanded);
  const expandIcon = node.type === 'directory' ? (node.expanded ? '▾' : '▸') : ' ';

  return (
    <>
      <Box>
        <Text color="gray">{indent}</Text>
        {node.type === 'directory' && (
          <Text color="cyan">{expandIcon} </Text>
        )}
        <Text>{icon} </Text>
        <Text
          color={isSelected ? 'cyan' : node.type === 'directory' ? 'blue' : 'white'}
          bold={isSelected}
        >
          {node.name}
        </Text>
      </Box>

      {node.type === 'directory' && node.expanded && node.children && (
        <>
          {node.children.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              depth={depth + 1}
              onSelect={onSelect}
              selectedPath={selectedPath}
              onToggle={onToggle}
            />
          ))}
        </>
      )}
    </>
  );
};

export const FileTree: React.FC<FileTreeProps> = ({
  root,
  onSelect,
  selectedPath,
  maxDepth = 3,
  showHidden = false,
}) => {
  const [tree, setTree] = useState<FileNode[]>([]);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  useEffect(() => {
    const nodes = buildFileTree(root, 0, maxDepth, showHidden);
    setTree(nodes);
  }, [root, maxDepth, showHidden]);

  const handleToggle = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });

    // Update tree with expanded state
    const updateExpanded = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => ({
        ...node,
        expanded: expandedPaths.has(node.path),
        children: node.children ? updateExpanded(node.children) : undefined,
      }));
    };

    setTree((prev) => updateExpanded(prev));
  };

  return (
    <Box flexDirection="column" paddingX={1}>
      {/* Header */}
      <Box borderStyle="single" borderColor="gray" paddingX={1} marginBottom={1}>
        <Text color="cyan" bold>
          📁 {basename(root)}
        </Text>
      </Box>

      {/* Tree */}
      <Box flexDirection="column">
        {tree.length === 0 ? (
          <Text color="gray">No files found</Text>
        ) : (
          tree.map((node) => (
            <FileTreeNode
              key={node.path}
              node={node}
              depth={0}
              onSelect={onSelect}
              selectedPath={selectedPath}
              onToggle={handleToggle}
            />
          ))
        )}
      </Box>
    </Box>
  );
};

// Made with Bob
