#!/usr/bin/env node

import React from 'react';
import { render } from 'ink';
import { App } from './App.js';

// Clear terminal before rendering
process.stdout.write('\x1Bc');

// Render the app
const { unmount, waitUntilExit } = render(<App />);

// Handle cleanup
process.on('SIGINT', () => {
  unmount();
  process.exit(0);
});

process.on('SIGTERM', () => {
  unmount();
  process.exit(0);
});

// Wait for exit
waitUntilExit().then(() => {
  process.exit(0);
});

// Made with Bob
