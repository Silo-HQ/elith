// Banner - Claude Code style two-column welcome panel

import React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../theme.js';

interface BannerProps {
  model?: string;
  workspace?: string;
  compact?: boolean;
}

const ELITH_ICON = `
 _____ _     ___ _____ _   _
|  ___| |   |_ _|_   _| | | |
| |__ | |     | |  | | | |_| |
|  __|| |     | |  | | |  _  |
| |___| |_____| |  | | | | | |
\\____/\\_____/___| |_| \\_| |_/
`;

const TIPS = [
  'Ask Elith to explain, refactor, or add tests to any file in your repo.',
  'Use @filename to pin a file into context before asking questions.',
  'Type /model to switch between claude, lmstudio, and openrouter.',
];

const WHATS_NEW = [
  'Multi-provider support: claude, lmstudio, openrouter',
  '12 active skills: read_file, write_file, git_diff, run_tests...',
  'Context engine: auto-selects the 4-6 most relevant files per query',
];

export const Banner = React.memo<BannerProps>(({ model = 'lmstudio', workspace = process.cwd() }) => {
  
  return (
    <Box 
      flexDirection="column" 
      borderStyle="single" 
      borderColor={theme.textDimmer}
      paddingX={2}
      paddingY={1}
    >
      {/* Two-column layout */}
      <Box>
        {/* Left column - ~40 chars */}
        <Box flexDirection="column" width={40} paddingRight={2}>
          <Text color={theme.brand} bold>Elith v2.1.143</Text>
          <Box marginTop={1}>
            <Text color={theme.textDim}>Welcome back!</Text>
          </Box>
          
          <Box marginTop={1} flexDirection="column">
            <Text color={theme.textDimmer}>{ELITH_ICON}</Text>
          </Box>
          
          <Box marginTop={1}>
            <Text color={theme.accent}>{model}</Text>
            <Text color={theme.textDim}> · API Usage Billing</Text>
          </Box>
          
          <Box marginTop={1}>
            <Text color={theme.textDim}>{workspace}</Text>
          </Box>
        </Box>
        
        {/* Right column - remaining space */}
        <Box flexDirection="column" flexGrow={1}>
          <Box flexDirection="column">
            <Text color={theme.brand} bold>Tips for getting started</Text>
            <Box marginTop={1} flexDirection="column">
              {TIPS.map((tip, i) => (
                <Box key={i} marginBottom={i < TIPS.length - 1 ? 1 : 0}>
                  <Text color={theme.textDim}>• {tip}</Text>
                </Box>
              ))}
            </Box>
          </Box>
          
          <Box marginTop={2} flexDirection="column">
            <Text color={theme.brand} bold>What's new</Text>
            <Box marginTop={1} flexDirection="column">
              {WHATS_NEW.map((item, i) => (
                <Box key={i} marginBottom={i < WHATS_NEW.length - 1 ? 1 : 0}>
                  <Text color={theme.success}>✓ </Text>
                  <Text color={theme.text}>{item}</Text>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

Banner.displayName = 'Banner';

// Made with Bob
