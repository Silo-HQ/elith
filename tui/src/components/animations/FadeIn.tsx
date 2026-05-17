// Fade in animation component
import React, { useState, useEffect } from 'react';
import { Box, type DOMElement } from 'ink';

interface FadeInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  duration = 300,
  delay = 0,
}) => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      const steps = 20;
      const stepDuration = duration / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        setOpacity(currentStep / steps);

        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(delayTimer);
  }, [duration, delay]);

  // Note: Ink doesn't support opacity directly, so we simulate with visibility
  // For a real fade effect, we'd need to use ANSI escape codes
  if (opacity < 0.1) {
    return null;
  }

  return <Box>{children}</Box>;
};

// Made with Bob
