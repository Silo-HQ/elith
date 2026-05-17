#!/usr/bin/env node
/**
 * Post-install script for npm/pnpm/bun global installation
 * Sets up Python environment and dependencies
 */

const { spawn } = require('child_process');
const { existsSync } = require('fs');
const { join } = require('path');
const { homedir } = require('os');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function banner() {
  log('', 'reset');
  log('  _____ _ _ _   _     ', 'cyan');
  log(' | ____| (_) |_| |__  ', 'cyan');
  log(' |  _| | | | __| \'_ \\ ', 'cyan');
  log(' | |___| | | |_| | | |', 'cyan');
  log(' |_____|_|_|\\__|_| |_|', 'cyan');
  log('', 'reset');
  log('Universal Repo-Aware AI Agent', 'blue');
  log('', 'reset');
}

async function checkPython() {
  return new Promise((resolve) => {
    const python = spawn('python3', ['--version']);
    python.on('close', (code) => resolve(code === 0));
    python.on('error', () => resolve(false));
  });
}

async function main() {
  banner();
  
  log('📦 Setting up Elith...', 'blue');
  log('', 'reset');
  
  // Check Python
  const hasPython = await checkPython();
  if (!hasPython) {
    log('⚠️  Python 3 not found', 'yellow');
    log('', 'reset');
    log('Elith requires Python 3.10 or higher.', 'reset');
    log('The Python backend will be installed on first run.', 'yellow');
    log('', 'reset');
    log('To install Python:', 'blue');
    log('  • macOS: brew install python@3.10', 'reset');
    log('  • Ubuntu: sudo apt install python3.10', 'reset');
    log('  • Windows: https://www.python.org/downloads/', 'reset');
    log('', 'reset');
  } else {
    log('✓ Python 3 found', 'green');
  }
  
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green');
  log('✓ Elith CLI installed successfully!', 'green');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green');
  log('', 'reset');
  log('Quick Start:', 'blue');
  log('  1. Run: elith', 'reset');
  log('  2. Follow the setup wizard', 'reset');
  log('  3. Start coding!', 'reset');
  log('', 'reset');
  log('Commands:', 'blue');
  log('  elith                  - Start interactive mode', 'reset');
  log('  elith init             - Configure providers', 'reset');
  log('  elith service status   - Check backend status', 'reset');
  log('  elith --help           - Show all commands', 'reset');
  log('', 'reset');
  log('Documentation: https://github.com/Silo-HQ/elith', 'yellow');
  log('', 'reset');
}

main().catch((error) => {
  log(`✗ Error: ${error.message}`, 'red');
  process.exit(1);
});

// Made with Bob
