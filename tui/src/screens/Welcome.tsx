import React from 'react';
import { Box, Text } from 'ink';

const ELITH_ASCII = `
███████╗██╗     ██╗████████╗██╗  ██╗
██╔════╝██║     ██║╚══██╔══╝██║  ██║
█████╗  ██║     ██║   ██║   ███████║
██╔══╝  ██║     ██║   ██║   ██╔══██║
███████╗███████╗██║   ██║   ██║  ██║
╚══════╝╚══════╝╚═╝   ╚═╝   ╚═╝  ╚═╝
`;

interface WelcomeProps {
  version?: string;
  availableModels?: string[];
  configuredModels?: string[];
  repoPath?: string;
  onReady?: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({
  version = 'v1.0.0',
  availableModels = [],
  configuredModels = [],
  repoPath = '.',
  onReady,
}) => {
  React.useEffect(() => {
    // Auto-transition after showing welcome
    const timer = setTimeout(() => {
      if (onReady) onReady();
    }, 100);
    return () => clearTimeout(timer);
  }, [onReady]);

  return (
    <Box flexDirection="column">
      {/* ASCII Logo - No box, just text */}
      <Box paddingX={2} paddingY={1}>
        <Text color="yellow" bold>
          {ELITH_ASCII}
        </Text>
      </Box>

      {/* Straight line under banner */}
      <Box paddingX={2}>
        <Text color="gray">{'─'.repeat(80)}</Text>
      </Box>

      {/* Version and Info */}
      <Box marginTop={1} paddingX={2}>
        <Text color="yellow" bold>
          Elith Agent {version} (2026.5.16)
        </Text>
        <Text color="gray"> · upstream </Text>
        <Text color="cyan">main</Text>
      </Box>

      {/* Available Tools Section - Vertical layout */}
      <Box marginTop={2} paddingX={2} flexDirection="column">
        <Text color="yellow" bold>
          Available Tools
        </Text>
        <Box marginTop={1} flexDirection="column">
          <Text>
            <Text color="gray">browser: </Text>
            <Text color="white">browser_back, browser_click, ...</Text>
          </Text>
          <Text>
            <Text color="gray">clarity: </Text>
            <Text color="white">clarify</Text>
          </Text>
          <Text>
            <Text color="gray">code_execution: </Text>
            <Text color="white">execute_code</Text>
          </Text>
          <Text>
            <Text color="gray">cronjob: </Text>
            <Text color="white">cronjob</Text>
          </Text>
          <Text>
            <Text color="gray">delegate: </Text>
            <Text color="white">delegate_task</Text>
          </Text>
        </Box>
      </Box>

      {/* Available Skills Section - Vertical layout */}
      <Box marginTop={2} paddingX={2} flexDirection="column">
        <Text color="yellow" bold>
          Available Skills
        </Text>
        <Box marginTop={1} flexDirection="column">
          <Text>
            <Text color="gray">code: </Text>
            <Text color="white">read_file, write_file, search_code, ...</Text>
          </Text>
          <Text>
            <Text color="gray">architecture: </Text>
            <Text color="white">architecture-diagram, novel-proposals, ...</Text>
          </Text>
          <Text>
            <Text color="gray">testing: </Text>
            <Text color="white">test-generation, coverage-analysis, ...</Text>
          </Text>
          <Text>
            <Text color="gray">git: </Text>
            <Text color="white">git-diff, git-commit, git-status, ...</Text>
          </Text>
        </Box>
      </Box>

      {/* Repository Info */}
      <Box marginTop={2} paddingX={2}>
        <Text color="gray">Repository: </Text>
        <Text color="white">{repoPath}</Text>
      </Box>

      {/* Model Status */}
      <Box marginTop={1} paddingX={2}>
        <Text color="gray">Active models: </Text>
        {availableModels.length === 0 ? (
          <Text color="gray">none</Text>
        ) : (
          availableModels.map((model, i) => (
            <React.Fragment key={model}>
              <Text color={configuredModels.includes(model) ? 'green' : 'gray'}>
                {model}
              </Text>
              {i < availableModels.length - 1 && <Text color="gray">, </Text>}
            </React.Fragment>
          ))
        )}
      </Box>

      {/* Welcome Message */}
      <Box marginTop={2} paddingX={2}>
        <Text color="cyan">
          Welcome to Elith Agent! Type your message or /help for commands.
        </Text>
      </Box>
    </Box>
  );
};

// Made with Bob
