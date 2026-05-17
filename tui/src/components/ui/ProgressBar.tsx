// Enhanced progress bar with animations
import React from 'react';
import { Box, Text } from 'ink';
import gradient from 'gradient-string';

interface ProgressBarProps {
  progress: number; // 0-100
  width?: number;
  color?: string;
  showPercentage?: boolean;
  label?: string;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  width = 40,
  color = 'cyan',
  showPercentage = true,
  label,
  animated = true,
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const filledWidth = Math.round((clampedProgress / 100) * width);
  const emptyWidth = width - filledWidth;

  const filled = '█'.repeat(filledWidth);
  const empty = '░'.repeat(emptyWidth);

  const bar = animated
    ? gradient(['#00ff00', '#00ffff', '#0000ff'])(filled) + empty
    : filled + empty;

  return (
    <Box flexDirection="column">
      {label && (
        <Box marginBottom={1}>
          <Text color="gray">{label}</Text>
        </Box>
      )}
      <Box>
        <Text color={color}>[{bar}]</Text>
        {showPercentage && (
          <Text color="gray"> {clampedProgress.toFixed(0)}%</Text>
        )}
      </Box>
    </Box>
  );
};

// Indeterminate progress bar (for unknown duration tasks)
export const IndeterminateProgressBar: React.FC<{
  width?: number;
  color?: string;
  label?: string;
}> = ({ width = 40, color = 'cyan', label }) => {
  const [position, setPosition] = React.useState(0);
  const barWidth = 8;

  React.useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => (prev + 1) % (width - barWidth + 1));
    }, 50);

    return () => clearInterval(interval);
  }, [width]);

  const before = '░'.repeat(position);
  const bar = '█'.repeat(barWidth);
  const after = '░'.repeat(width - position - barWidth);

  return (
    <Box flexDirection="column">
      {label && (
        <Box marginBottom={1}>
          <Text color="gray">{label}</Text>
        </Box>
      )}
      <Box>
        <Text color={color}>[{before}{bar}{after}]</Text>
      </Box>
    </Box>
  );
};

// Multi-step progress indicator
export const StepProgress: React.FC<{
  steps: string[];
  currentStep: number;
}> = ({ steps, currentStep }) => {
  return (
    <Box flexDirection="column">
      {steps.map((step, index) => {
        const isComplete = index < currentStep;
        const isCurrent = index === currentStep;
        const icon = isComplete ? '✓' : isCurrent ? '◉' : '○';
        const color = isComplete ? 'green' : isCurrent ? 'cyan' : 'gray';

        return (
          <Box key={index} marginBottom={index < steps.length - 1 ? 1 : 0}>
            <Text color={color}>{icon} </Text>
            <Text color={color} bold={isCurrent}>
              {step}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
};

// Made with Bob
