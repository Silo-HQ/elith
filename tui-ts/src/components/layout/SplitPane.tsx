// Split pane component for side-by-side layouts
import React, { useState } from 'react';
import { Box, Text } from 'ink';

interface SplitPaneProps {
  children: [React.ReactNode, React.ReactNode];
  orientation?: 'horizontal' | 'vertical';
  sizes?: [number, number]; // Percentage split (e.g., [60, 40])
  minSize?: number;
  resizable?: boolean;
  borderColor?: string;
}

export const SplitPane: React.FC<SplitPaneProps> = ({
  children,
  orientation = 'vertical',
  sizes = [50, 50],
  minSize = 20,
  resizable = true,
  borderColor = 'gray',
}) => {
  const [leftSize, rightSize] = sizes;
  const [currentSizes, setCurrentSizes] = useState<[number, number]>([leftSize, rightSize]);

  // For terminal UI, we'll use fixed sizes for now
  // In a real implementation, we'd handle resize events

  if (orientation === 'vertical') {
    return (
      <Box width="100%" height="100%">
        <Box width={`${currentSizes[0]}%`} flexDirection="column" borderStyle="single" borderColor={borderColor}>
          {children[0]}
        </Box>
        <Box width={`${currentSizes[1]}%`} flexDirection="column" borderStyle="single" borderColor={borderColor}>
          {children[1]}
        </Box>
      </Box>
    );
  }

  // Horizontal orientation
  return (
    <Box flexDirection="column" width="100%" height="100%">
      <Box height={`${currentSizes[0]}%`} borderStyle="single" borderColor={borderColor}>
        {children[0]}
      </Box>
      <Box height={`${currentSizes[1]}%`} borderStyle="single" borderColor={borderColor}>
        {children[1]}
      </Box>
    </Box>
  );
};

// Triple pane layout (common for code editors)
export const TriplePaneLayout: React.FC<{
  sidebar: React.ReactNode;
  main: React.ReactNode;
  panel: React.ReactNode;
  sidebarWidth?: number;
  panelWidth?: number;
}> = ({ sidebar, main, panel, sidebarWidth = 20, panelWidth = 30 }) => {
  const mainWidth = 100 - sidebarWidth - panelWidth;

  return (
    <Box width="100%" height="100%">
      {/* Sidebar */}
      <Box width={`${sidebarWidth}%`} flexDirection="column" borderStyle="single" borderColor="gray">
        {sidebar}
      </Box>

      {/* Main content */}
      <Box width={`${mainWidth}%`} flexDirection="column" borderStyle="single" borderColor="gray">
        {main}
      </Box>

      {/* Right panel */}
      <Box width={`${panelWidth}%`} flexDirection="column" borderStyle="single" borderColor="gray">
        {panel}
      </Box>
    </Box>
  );
};

// Collapsible sidebar
export const CollapsibleSidebar: React.FC<{
  children: React.ReactNode;
  collapsed?: boolean;
  width?: number;
  onToggle?: () => void;
}> = ({ children, collapsed = false, width = 25, onToggle }) => {
  if (collapsed) {
    return (
      <Box width={3} flexDirection="column" borderStyle="single" borderColor="gray">
        <Box justifyContent="center" paddingY={1}>
          <Text color="cyan">▸</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box width={`${width}%`} flexDirection="column" borderStyle="single" borderColor="gray">
      <Box justifyContent="space-between" paddingX={1} borderStyle="single" borderColor="gray">
        <Text color="cyan" bold>Sidebar</Text>
        <Text color="gray">◂</Text>
      </Box>
      <Box flexGrow={1} flexDirection="column">
        {children}
      </Box>
    </Box>
  );
};

// Made with Bob
