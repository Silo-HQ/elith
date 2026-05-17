#!/usr/bin/env node
// Production Elith TUI - Full backend integration with enhanced UI

import React from 'react';
import { render } from 'ink';
import { ProductionApp } from './ProductionApp.js';

// Clear terminal and render
process.stdout.write('\x1Bc');
const { unmount, waitUntilExit } = render(<ProductionApp />);

// Handle cleanup
process.on('SIGINT', () => {
  unmount();
  process.exit(0);
});

process.on('SIGTERM', () => {
  unmount();
  process.exit(0);
});

waitUntilExit().then(() => {
  process.exit(0);
});
