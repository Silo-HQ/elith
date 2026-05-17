#!/usr/bin/env node
// Demo showcasing all enhanced TUI features

import React, { useState, useEffect } from 'react';
import { render, Box, Text } from 'ink';
import { EnhancedBanner } from './components/enhanced/EnhancedBanner.js';
import { ThinkingSpinner, LoadingSpinner, ProcessingSpinner } from './components/animations/EnhancedSpinner.js';
import { ProgressBar, IndeterminateProgressBar, StepProgress } from './components/ui/ProgressBar.js';
import { SplitPane } from './components/layout/SplitPane.js';
import { TabBar, useTabManager, TabContent } from './components/layout/TabBar.js';
import { FileTree } from './components/layout/FileTree.js';
import { useTheme } from './hooks/useTheme.js';

const DemoApp: React.FC = () => {
  const [demoStep, setDemoStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const { theme, currentThemeName, availableThemes } = useTheme();
  const { tabs, activeTabId, addTab, selectTab } = useTabManager([
    { id: '1', title: 'Demo 1', icon: '🎨' },
    { id: '2', title: 'Demo 2', icon: '🚀' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev + 5) % 105);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % 5);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box flexDirection="column" padding={1}>
      {/* Enhanced Banner */}
      <EnhancedBanner showAnimation={true} compact={false} />

      {/* Theme Info */}
      <Box marginY={1} paddingX={2}>
        <Text color={theme.colors.brand} bold>Current Theme: </Text>
        <Text color={theme.colors.accent}>{currentThemeName}</Text>
        <Text color={theme.colors.textDim}> (Press Ctrl+Shift+T to cycle)</Text>
      </Box>

      {/* Demo Steps */}
      <Box marginY={1}>
        <StepProgress
          steps={[
            'Spinners & Animations',
            'Progress Bars',
            'Split Panes',
            'Tabs System',
            'File Tree',
          ]}
          currentStep={demoStep}
        />
      </Box>

      {/* Demo Content */}
      {demoStep === 0 && (
        <Box flexDirection="column" padding={1}>
          <Text color={theme.colors.brand} bold>✨ Spinners & Animations</Text>
          <Box marginTop={1}>
            <ThinkingSpinner />
          </Box>
          <Box marginTop={1}>
            <LoadingSpinner />
          </Box>
          <Box marginTop={1}>
            <ProcessingSpinner />
          </Box>
        </Box>
      )}

      {demoStep === 1 && (
        <Box flexDirection="column" padding={1}>
          <Text color={theme.colors.brand} bold>📊 Progress Bars</Text>
          <Box marginTop={1}>
            <ProgressBar progress={progress} label="Analyzing code..." animated />
          </Box>
          <Box marginTop={1}>
            <IndeterminateProgressBar label="Loading..." />
          </Box>
        </Box>
      )}

      {demoStep === 2 && (
        <Box flexDirection="column" padding={1}>
          <Text color={theme.colors.brand} bold>📱 Split Panes</Text>
          <Box marginTop={1} height={10}>
            <SplitPane orientation="vertical" sizes={[60, 40]}>
              <Box flexDirection="column" padding={1}>
                <Text color={theme.colors.accent}>Left Pane</Text>
                <Text color={theme.colors.textDim}>Main content area</Text>
              </Box>
              <Box flexDirection="column" padding={1}>
                <Text color={theme.colors.accent}>Right Pane</Text>
                <Text color={theme.colors.textDim}>Side panel</Text>
              </Box>
            </SplitPane>
          </Box>
        </Box>
      )}

      {demoStep === 3 && (
        <Box flexDirection="column" padding={1}>
          <Text color={theme.colors.brand} bold>📑 Tabs System</Text>
          <Box marginTop={1}>
            <TabBar
              tabs={tabs}
              activeTabId={activeTabId}
              onTabSelect={selectTab}
              onNewTab={() => addTab({ id: Date.now().toString(), title: 'New Tab', icon: '✨' })}
            />
          </Box>
          {tabs.map((tab) => (
            <TabContent key={tab.id} tabId={tab.id} activeTabId={activeTabId}>
              <Box padding={1}>
                <Text color={theme.colors.accent}>Content for {tab.title}</Text>
              </Box>
            </TabContent>
          ))}
        </Box>
      )}

      {demoStep === 4 && (
        <Box flexDirection="column" padding={1}>
          <Text color={theme.colors.brand} bold>🗂️ File Tree</Text>
          <Box marginTop={1} height={15}>
            <FileTree
              root={process.cwd()}
              maxDepth={2}
              showHidden={false}
            />
          </Box>
        </Box>
      )}

      {/* Available Themes */}
      <Box marginTop={1} paddingX={2}>
        <Text color={theme.colors.textDim}>Available Themes: </Text>
        {availableThemes.map((name, i) => (
          <React.Fragment key={name}>
            {i > 0 && <Text color={theme.colors.textDimmer}> · </Text>}
            <Text color={name === currentThemeName ? theme.colors.brand : theme.colors.textDim}>
              {name}
            </Text>
          </React.Fragment>
        ))}
      </Box>

      {/* Footer */}
      <Box marginTop={1}>
        <Text color={theme.colors.textDim}>
          Press Ctrl+C to exit · Demo cycles every 5 seconds
        </Text>
      </Box>
    </Box>
  );
};

// Clear terminal and render
process.stdout.write('\x1Bc');
const { unmount, waitUntilExit } = render(<DemoApp />);

// Handle cleanup
process.on('SIGINT', () => {
  unmount();
  process.exit(0);
});

waitUntilExit().then(() => {
  process.exit(0);
});

// Made with Bob
