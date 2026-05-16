// Message row - renders a single message with all its components

import React from 'react';
import { Box, Text } from 'ink';
import { theme, glyphs } from '../theme.js';
import type { Message } from '../types.js';
import { ThinkingBlock } from './ThinkingBlock.js';
import { SubAgentBlock } from './SubAgentBlock.js';
import { ToolLine } from './ToolLine.js';
import { ActivityLog } from './ActivityLog.js';
import { DiffBlock } from './DiffBlock.js';
import { CodeBlock } from './CodeBlock.js';
import { ApprovalPrompt } from './ApprovalPrompt.js';

interface MessageRowProps {
  message: Message;
  focusedExpandableId: string | null;
}

export const MessageRow: React.FC<MessageRowProps> = ({ message, focusedExpandableId }) => {
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // User message
  if (message.role === 'user') {
    return (
      <Box flexDirection="column" marginBottom={1}>
        <Box backgroundColor={theme.userRowBg} width="100%" paddingX={1} paddingY={1}>
          <Text color={theme.accent}>{glyphs.prompt} </Text>
          <Text color={theme.text}>{message.text}</Text>
          <Box flexGrow={1} />
          <Text color={theme.textDim} dimColor>{formatTime(message.timestamp)}</Text>
        </Box>
      </Box>
    );
  }

  // System message
  if (message.role === 'system') {
    return (
      <Box marginBottom={1}>
        <Text color={theme.warning}>{glyphs.info} </Text>
        <Text color={theme.text}>{message.text}</Text>
      </Box>
    );
  }

  // Agent message
  return (
    <Box flexDirection="column" marginBottom={1}>
      {/* Activity logs */}
      {message.activityLogs && message.activityLogs.length > 0 && (
        <ActivityLog logs={message.activityLogs} isActive={false} />
      )}

      {/* Thinking block */}
      {message.thinking && (
        <ThinkingBlock
          block={message.thinking}
          focused={focusedExpandableId === message.thinking.id}
        />
      )}

      {/* Sub-agent blocks */}
      {message.subAgents?.map((subAgent) => (
        <SubAgentBlock
          key={subAgent.id}
          block={subAgent}
          focused={focusedExpandableId === subAgent.id}
        />
      ))}

      {/* Tool lines */}
      {message.tools?.map((tool) => (
        <ToolLine key={tool.id} tool={tool} />
      ))}

      {/* Agent response text */}
      {message.text && (
        <Box paddingLeft={2} flexDirection="column">
          <Box>
            <Text color={theme.brand}>{glyphs.brand} </Text>
            <Text color={theme.text}>{message.text}</Text>
          </Box>
        </Box>
      )}

      {/* Diff */}
      {message.diff && message.diff.length > 0 && (
        <DiffBlock diff={message.diff} />
      )}

      {/* Code blocks */}
      {message.codeBlocks?.map((block, index) => (
        <CodeBlock key={index} block={block} />
      ))}

      {/* Approval prompt */}
      {message.awaitingApproval && <ApprovalPrompt />}
    </Box>
  );
};

// Made with Bob
