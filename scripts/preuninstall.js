#!/usr/bin/env node
/**
 * Pre-uninstall script for npm/pnpm/bun
 * Cleans up Elith installation
 */

const { spawn } = require('child_process');
const { existsSync } = require('fs');
const { join } = require('path');
const { homedir } = require('os');
const readline = require('readline');

const ELITH_DIR = join(homedir(), '.elith');

const colors = {
  reset: '\x1b[0m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase().trim());
    });
  });
}

async function main() {
  log('', 'reset');
  log('Uninstalling Elith CLI...', 'yellow');
  log('', 'reset');

  if (existsSync(ELITH_DIR)) {
    log('Elith data directory found:', 'blue');
    log(`  ${ELITH_DIR}`, 'reset');
    log('', 'reset');
    log('This contains:', 'blue');
    log('  • Python backend installation', 'reset');
    log('  • Configuration files', 'reset');
    log('  • Backend logs', 'reset');
    log('', 'reset');

    const answer = await askQuestion('Do you want to remove this directory? (y/N): ');

    if (answer === 'y' || answer === 'yes') {
      log('', 'reset');
      log('Removing Elith data directory...', 'yellow');
      
      // Stop backend if running
      const stopBackend = spawn('sh', ['-c', `${ELITH_DIR}/venv/bin/python ${ELITH_DIR}/repo/cli.py service stop`], {
        stdio: 'ignore'
      });
      
      await new Promise((resolve) => {
        stopBackend.on('close', resolve);
        setTimeout(resolve, 2000); // Timeout after 2 seconds
      });
      
      // Remove directory
      const rm = spawn('rm', ['-rf', ELITH_DIR], {
        stdio: 'inherit'
      });
      
      await new Promise((resolve) => {
        rm.on('close', resolve);
      });
      
      log('✓ Elith data directory removed', 'green');
    } else {
      log('', 'reset');
      log('Keeping Elith data directory.', 'blue');
      log('You can manually remove it later with:', 'blue');
      log(`  rm -rf ${ELITH_DIR}`, 'reset');
    }
  }

  log('', 'reset');
  log('✓ Elith CLI uninstalled', 'green');
  log('', 'reset');
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});

// Made with Bob
