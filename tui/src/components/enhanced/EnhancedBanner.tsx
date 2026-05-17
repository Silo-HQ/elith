// Enhanced banner with gradient effects and animations
import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import gradient from 'gradient-string';
import { useTheme } from '../../hooks/useTheme.js';

const LOGO_FRAMES = [
  `███████╗██╗     ██╗████████╗██╗  ██╗
██╔════╝██║     ██║╚══██╔══╝██║  ██║
█████╗  ██║     ██║   ██║   ███████║
██╔══╝  ██║     ██║   ██║   ██╔══██║
███████╗███████╗██║   ██║   ██║  ██║
╚══════╝╚══════╝╚═╝   ╚═╝   ╚═╝  ╚═╝`,
];

const TAGLINES = [
  'Universal Repo-Aware AI Agent Framework',
  'Any Model. Bob-Level. Your Choice.',
  'Powered by IBM Bob Hackathon 2026',
];

export const EnhancedBanner: React.FC<{
  showAnimation?: boolean;
  compact?: boolean;
}> = ({ showAnimation = true, compact = false }) => {
  const { theme, currentThemeName } = useTheme();
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [visible, setVisible] = useState(!showAnimation);

  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [showAnimation]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  const logo = LOGO_FRAMES[0];
  const gradientLogo = gradient([theme.colors.primary, theme.colors.accent])(logo);

  if (compact) {
    return (
      <Box flexDirection="column" paddingBottom={1}>
        <Box justifyContent="center">
          <Text color={theme.colors.brand} bold>ELITH</Text>
          <Text color={theme.colors.textDim}> · </Text>
          <Text color={theme.colors.accent}>v1.0.0</Text>
          <Text color={theme.colors.textDim}> · </Text>
          <Text color={theme.colors.textDim}>Theme: </Text>
          <Text color={theme.colors.accent}>{currentThemeName}</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" paddingY={1}>
      {/* ASCII Art Logo with gradient */}
      <Box justifyContent="center" marginBottom={1}>
        <Text>{gradientLogo}</Text>
      </Box>

      {/* Animated tagline */}
      <Box justifyContent="center" marginBottom={1}>
        <Text color={theme.colors.textDim}>{TAGLINES[taglineIndex]}</Text>
      </Box>

      {/* Info bar */}
      <Box justifyContent="center">
        <Text color={theme.colors.accent}>v1.0.0</Text>
        <Text color={theme.colors.textDim}> · </Text>
        <Text color={theme.colors.textDim}>Theme: </Text>
        <Text color={theme.colors.brand}>{currentThemeName}</Text>
        <Text color={theme.colors.textDim}> · </Text>
        <Text color={theme.colors.success}>Ready</Text>
      </Box>

      {/* Separator */}
      <Box justifyContent="center" marginTop={1}>
        <Text color={theme.colors.border}>{'─'.repeat(80)}</Text>
      </Box>
    </Box>
  );
};

// Made with Bob
