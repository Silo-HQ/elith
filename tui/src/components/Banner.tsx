// Banner - always visible at top, memoized

import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { theme, glyphs } from '../theme.js';
import { api } from '../api/client.js';

export const Banner = React.memo(() => {
  const [model, setModel] = useState('lmstudio');
  const [backend, setBackend] = useState('http://localhost:8000');
  const cols = process.stdout.columns || 80;

  useEffect(() => {
    // Fetch models and status on mount
    api.getModels()
      .then(data => {
        if (data.current) setModel(data.current);
      })
      .catch(console.error);
  }, []);

  const separator = glyphs.sep.repeat(cols);
  const centerText = (text: string): string => {
    const padding = Math.max(0, Math.floor((cols - text.length) / 2));
    return ' '.repeat(padding) + text;
  };

  return (
    <Box flexDirection="column" paddingBottom={1}>
      {/* Title */}
      <Box justifyContent="center">
        <Text color={theme.brand}>{glyphs.brand}  ELITH v1.0.0</Text>
      </Box>
      
      {/* Auth line */}
      <Box justifyContent="center">
        <Text color={theme.textDim}>Signed in with {model} /auth</Text>
      </Box>
      
      {/* Model and backend */}
      <Box justifyContent="center">
        <Text color={theme.textDim}>Model: </Text>
        <Text color={theme.accent}>{model}</Text>
        <Text color={theme.textDim}> · Backend: </Text>
        <Text color={theme.accent}>{backend}</Text>
      </Box>

      {/* Info lines */}
      <Box marginTop={1}>
        <Text color={theme.warning}>{glyphs.info}  </Text>
        <Text color={theme.text}>MCP connected. 12 skills active. Run /skills for list.</Text>
      </Box>
      
      <Box>
        <Text color={theme.warning}>{glyphs.info}  </Text>
        <Text color={theme.text}>Context engine ready. Workspace: ~/project</Text>
      </Box>

      {/* Separator */}
      <Box marginTop={1}>
        <Text color={theme.separator}>{separator}</Text>
      </Box>
    </Box>
  );
});

Banner.displayName = 'Banner';

// Made with Bob
