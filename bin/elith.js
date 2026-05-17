#!/usr/bin/env node
/**
 * Elith CLI Wrapper for npm/pnpm/bun global installation
 * This script ensures Python backend is installed and runs the CLI
 */

const { spawn } = require('child_process');
const { existsSync, mkdirSync } = require('fs');
const { join } = require('path');
const { homedir } = require('os');

const ELITH_DIR = join(homedir(), '.elith');
const VENV_DIR = join(ELITH_DIR, 'venv');
const REPO_DIR = join(ELITH_DIR, 'repo');
const PYTHON_CMD = process.platform === 'win32' ? 'python' : 'python3';

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkPython() {
  return new Promise((resolve) => {
    const python = spawn(PYTHON_CMD, ['--version']);
    python.on('close', (code) => {
      resolve(code === 0);
    });
    python.on('error', () => {
      resolve(false);
    });
  });
}

async function ensureInstallation() {
  // Check if Python is available
  const hasPython = await checkPython();
  if (!hasPython) {
    log('✗ Python 3 not found', 'red');
    log('Please install Python 3.10 or higher', 'yellow');
    log('Visit: https://www.python.org/downloads/', 'blue');
    process.exit(1);
  }

  // Check if Elith is installed
  if (!existsSync(REPO_DIR) || !existsSync(VENV_DIR)) {
    log('', 'reset');
    log('Elith backend not found. Installing...', 'yellow');
    log('', 'reset');
    
    // Run the web installer
    const installer = spawn('sh', ['-c', 'curl -fsSL https://elith.silohq.tech/install.sh | sh'], {
      stdio: 'inherit'
    });
    
    return new Promise((resolve, reject) => {
      installer.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          log('✗ Installation failed', 'red');
          reject(new Error('Installation failed'));
        }
      });
    });
  }
}

async function runElith() {
  try {
    await ensureInstallation();
    
    // Activate venv and run CLI
    const activateScript = process.platform === 'win32'
      ? join(VENV_DIR, 'Scripts', 'activate.bat')
      : join(VENV_DIR, 'bin', 'activate');
    
    const pythonPath = process.platform === 'win32'
      ? join(VENV_DIR, 'Scripts', 'python.exe')
      : join(VENV_DIR, 'bin', 'python');
    
    const cliPath = join(REPO_DIR, 'cli.py');
    
    // Pass all arguments to the Python CLI
    const args = process.argv.slice(2);
    
    const elith = spawn(pythonPath, [cliPath, ...args], {
      cwd: REPO_DIR,
      stdio: 'inherit',
      env: {
        ...process.env,
        VIRTUAL_ENV: VENV_DIR,
        PATH: `${join(VENV_DIR, 'bin')}:${process.env.PATH}`
      }
    });
    
    elith.on('close', (code) => {
      process.exit(code || 0);
    });
    
    elith.on('error', (err) => {
      log(`✗ Error running Elith: ${err.message}`, 'red');
      process.exit(1);
    });
    
  } catch (error) {
    log(`✗ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the CLI
runElith();

// Made with Bob
