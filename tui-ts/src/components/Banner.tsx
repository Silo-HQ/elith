import React from 'react';
import { Box, Text } from 'ink';
import figlet from 'figlet';

interface BannerProps {
  terminalWidth?: number;
}

export const Banner: React.FC<BannerProps> = ({ terminalWidth = 80 }) => {
  // Generate ELITH ASCII art
  const bannerText = figlet.textSync('ELITH', {
    font: 'ANSI Shadow',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: terminalWidth,
    whitespaceBreak: true,
  });

  return (
    <Box flexDirection="column" width="100%">
      {/* ASCII Banner */}
      <Box justifyContent="center" paddingX={1}>
        <Text color="magenta" bold>
          {bannerText}
        </Text>
      </Box>
      
      {/* Subtitle */}
      <Box justifyContent="center" paddingX={1}>
        <Text color="gray">AI-Powered Code Assistant</Text>
      </Box>
      
      {/* Separator */}
      <Box paddingX={1} marginTop={1}>
        <Text color="gray">{'═'.repeat(Math.min(terminalWidth - 2, 80))}</Text>
      </Box>
    </Box>
  );
};

// Made with Bob