import React from 'react';
import { Box, Text } from 'ink';

export interface Edit {
  id: string;
  path: string;
  status: 'pending' | 'accepted' | 'rejected';
  linesAdded: number;
  linesRemoved: number;
  description?: string;
}

interface EditApprovalProps {
  edits: Edit[];
  onAccept?: (editId: string) => void;
  onReject?: (editId: string) => void;
}

export const EditApproval: React.FC<EditApprovalProps> = ({
  edits,
  // onAccept and onReject will be used when keyboard shortcuts are implemented
}) => {
  if (edits.length === 0) {
    return null;
  }

  const pendingEdits = edits.filter(e => e.status === 'pending');
  const acceptedEdits = edits.filter(e => e.status === 'accepted');
  const rejectedEdits = edits.filter(e => e.status === 'rejected');

  const renderEdit = (edit: Edit) => {
    const statusIcon = {
      pending: '⏳',
      accepted: '✓',
      rejected: '✗',
    }[edit.status];

    const statusColor = {
      pending: 'yellow',
      accepted: 'green',
      rejected: 'red',
    }[edit.status];

    const changeText = `(+${edit.linesAdded}, -${edit.linesRemoved})`;

    return (
      <Box key={edit.id} marginBottom={1}>
        <Text color={statusColor}>{statusIcon} </Text>
        <Text color="cyan">{edit.path}</Text>
        <Text color="gray"> {changeText}</Text>
        {edit.status === 'pending' && (
          <Text color="yellow"> → Press Shift+Tab to accept</Text>
        )}
      </Box>
    );
  };

  return (
    <Box 
      flexDirection="column" 
      paddingX={1}
      marginBottom={1}
    >
      {/* Header */}
      <Box marginBottom={1}>
        <Text color="magenta" bold>
          📝 File Edits
        </Text>
        <Text color="gray">
          {' '}({pendingEdits.length} pending, {acceptedEdits.length} accepted)
        </Text>
      </Box>

      {/* Pending Edits */}
      {pendingEdits.length > 0 && (
        <Box flexDirection="column" marginBottom={1}>
          <Text color="yellow" bold>
            Pending:
          </Text>
          {pendingEdits.map(renderEdit)}
        </Box>
      )}

      {/* Accepted Edits */}
      {acceptedEdits.length > 0 && (
        <Box flexDirection="column" marginBottom={1}>
          <Text color="green" bold>
            Accepted:
          </Text>
          {acceptedEdits.slice(-3).map(renderEdit)}
          {acceptedEdits.length > 3 && (
            <Text color="gray" italic>
              ... and {acceptedEdits.length - 3} more
            </Text>
          )}
        </Box>
      )}

      {/* Rejected Edits */}
      {rejectedEdits.length > 0 && (
        <Box flexDirection="column">
          <Text color="red" bold>
            Rejected:
          </Text>
          {rejectedEdits.slice(-2).map(renderEdit)}
          {rejectedEdits.length > 2 && (
            <Text color="gray" italic>
              ... and {rejectedEdits.length - 2} more
            </Text>
          )}
        </Box>
      )}

      {/* Help Text */}
      {pendingEdits.length > 0 && (
        <Box marginTop={1} paddingX={1}>
          <Text color="gray">
            Keyboard: <Text color="white">Shift+Tab</Text> = Accept | 
            <Text color="white"> Shift+Esc</Text> = Reject | 
            <Text color="white"> Shift+A</Text> = Accept All
          </Text>
        </Box>
      )}
    </Box>
  );
};

// Made with Bob
