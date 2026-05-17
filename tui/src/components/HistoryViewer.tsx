// History viewer component for displaying past sessions
import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { useTheme } from '../hooks/useTheme.js';
import { api } from '../api/client.js';
import type { HistoryEntry } from '../types/api.js';
import { LoadingSpinner } from './animations/EnhancedSpinner.js';

interface HistoryViewerProps {
  onClose: () => void;
  onSelectSession?: (sessionId: string) => void;
}

export const HistoryViewer: React.FC<HistoryViewerProps> = () => {
  const { theme } = useTheme();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await api.getHistory({ limit: 20 });
      setHistory(response.sessions);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (created: string, completed?: string) => {
    if (!completed) return 'N/A';
    const start = new Date(created).getTime();
    const end = new Date(completed).getTime();
    const seconds = Math.floor((end - start) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return theme.colors.success;
      case 'error':
        return theme.colors.error;
      case 'running':
        return theme.colors.accent;
      default:
        return theme.colors.textDim;
    }
  };

  if (loading) {
    return (
      <Box flexDirection="column" padding={2}>
        <LoadingSpinner text="Loading history..." />
      </Box>
    );
  }

  if (error) {
    return (
      <Box flexDirection="column" padding={2}>
        <Text color={theme.colors.error}>Error: {error}</Text>
        <Box marginTop={1}>
          <Text color={theme.colors.textDim}>Press any key to close</Text>
        </Box>
      </Box>
    );
  }

  if (history.length === 0) {
    return (
      <Box flexDirection="column" padding={2}>
        <Text color={theme.colors.textDim}>No session history found</Text>
        <Box marginTop={1}>
          <Text color={theme.colors.textDimmer}>Complete some tasks to see them here</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box paddingX={2} paddingY={1}>
        <Text color={theme.colors.brand} bold>
          📜 Session History
        </Text>
        <Text color={theme.colors.textDim}> ({history.length} sessions)</Text>
      </Box>

      {/* History List */}
      <Box flexDirection="column" marginTop={1}>
        {history.map((entry) => (
          <Box
            key={entry.session_id}
            flexDirection="column"
            paddingX={2}
            paddingY={1}
            marginY={0}
          >
            {/* Session Header */}
            <Box>
              <Text color={theme.colors.brand} bold>
                {entry.operation}
              </Text>
              <Text color={theme.colors.textDim}> · </Text>
              <Text color={theme.colors.accent}>{entry.model}</Text>
              <Text color={theme.colors.textDim}> · </Text>
              <Text color={getStatusColor(entry.status)}>{entry.status}</Text>
            </Box>

            {/* Session Details */}
            <Box marginTop={1}>
              <Text color={theme.colors.textDim}>
                {formatDate(entry.created_at)}
              </Text>
              {entry.completed_at && (
                <>
                  <Text color={theme.colors.textDimmer}> · </Text>
                  <Text color={theme.colors.textDim}>
                    {formatDuration(entry.created_at, entry.completed_at)}
                  </Text>
                </>
              )}
              {entry.files_changed.length > 0 && (
                <>
                  <Text color={theme.colors.textDimmer}> · </Text>
                  <Text color={theme.colors.success}>
                    {entry.files_changed.length} files changed
                  </Text>
                </>
              )}
            </Box>

            {/* Output Preview */}
            {entry.output_preview && (
              <Box marginTop={1}>
                <Text color={theme.colors.textDimmer} dimColor>
                  {entry.output_preview}...
                </Text>
              </Box>
            )}

            {/* Session ID */}
            <Box marginTop={1}>
              <Text color={theme.colors.textDimmer} dimColor>
                ID: {entry.session_id.substring(0, 8)}
              </Text>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Box marginTop={1} paddingX={2}>
        <Text color={theme.colors.textDim}>Press </Text>
        <Text color={theme.colors.accent}>Esc</Text>
        <Text color={theme.colors.textDim}> to close</Text>
      </Box>
    </Box>
  );
};

// Made with Bob
