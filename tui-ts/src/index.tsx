#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import { App } from './App.js';

// Clear the terminal before rendering
process.stdout.write('\x1Bc');

// Render the app
render(<App />);

// Made with Bob
