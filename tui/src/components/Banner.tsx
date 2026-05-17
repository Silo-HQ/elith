// Banner - ELITH ASCII art with info

import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { theme } from '../theme.js';
import { api } from '../api/client.js';

const LOGO = `███████╗██╗     ██╗████████╗██╗  ██╗
██╔════╝██║     ██║╚══██╔══╝██║  ██║
█████╗  ██║     ██║   ██║   ███████║
██╔══╝  ██║     ██║   ██║   ██╔══██║
███████╗███████╗██║   ██║   ██║  ██║
╚══════╝╚══════╝╚═╝   ╚═╝   ╚═╝  ╚═╝`;

export const Banner = React.memo(() => {
  const [model, setModel] = useState('lmstudio');

  useEffect(() => {
    // Fetch models and status on mount - silently fail if backend offline
    api.getModels()
      .then(data => {
        if (data.current) setModel(data.current);
      })
      .catch(() => {
        // Silently ignore - backend may be offline
      });
  }, []);

  return (
    <Box flexDirection="column" flexShrink={0} paddingBottom={1}>
      {/* ASCII Art Logo */}
      <Box justifyContent="center">
        <Text color={theme.brand}>{LOGO}</Text>
      </Box>
      
      {/* Info section - single line */}
      <Box justifyContent="center">
        <Text color={theme.textDim}>AI-Powered Code Assistant · </Text>
        <Text color={theme.accent}>v1.0.0</Text>
        <Text color={theme.textDim}> · Model: </Text>
        <Text color={theme.accent}>{model}</Text>
        <Text color={theme.textDim}> · Status: </Text>
        <Text color={theme.success}>Ready</Text>
      </Box>
    </Box>
  );
});

Banner.displayName = 'Banner';

// Made with Bob
