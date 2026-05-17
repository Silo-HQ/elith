#!/usr/bin/env node
const noop = () => {};
console.error = noop;
console.warn = noop;
console.log = noop;

// Production Elith TUI - Full backend integration with enhanced UI

import React from 'react';
import { render } from 'ink';
import { ProductionApp } from './ProductionApp.js';

// Suppress all console output to prevent breaking Ink's render
const noop = () => {};
console.error = noop;
console.warn = noop;
console.log = noop;

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
