// Enhanced spinner with multiple styles and animations
import React, { useState, useEffect } from 'react';
import { Text } from 'ink';
import spinners from 'cli-spinners';

interface EnhancedSpinnerProps {
  type?: keyof typeof spinners;
  color?: string;
  text?: string;
}

export const EnhancedSpinner: React.FC<EnhancedSpinnerProps> = ({
  type = 'dots',
  color = 'cyan',
  text,
}) => {
  const [frame, setFrame] = useState(0);
  const spinner = spinners[type];

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % spinner.frames.length);
    }, spinner.interval);

    return () => clearInterval(interval);
  }, [spinner]);

  return (
    <>
      <Text color={color}>{spinner.frames[frame]}</Text>
      {text && <Text color="gray"> {text}</Text>}
    </>
  );
};

// Preset spinner types for different contexts
export const ThinkingSpinner: React.FC<{ text?: string }> = ({ text = 'Thinking...' }) => (
  <EnhancedSpinner type="dots12" color="magenta" text={text} />
);

export const LoadingSpinner: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => (
  <EnhancedSpinner type="dots" color="cyan" text={text} />
);

export const ProcessingSpinner: React.FC<{ text?: string }> = ({ text = 'Processing...' }) => (
  <EnhancedSpinner type="arc" color="yellow" text={text} />
);

export const AnalyzingSpinner: React.FC<{ text?: string }> = ({ text = 'Analyzing...' }) => (
  <EnhancedSpinner type="bouncingBar" color="blue" text={text} />
);

export const GeneratingSpinner: React.FC<{ text?: string }> = ({ text = 'Generating...' }) => (
  <EnhancedSpinner type="growVertical" color="green" text={text} />
);

// Made with Bob
