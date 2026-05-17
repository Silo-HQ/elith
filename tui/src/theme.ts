// Professional Theme - Clean, modern, business-appropriate color scheme
// Inspired by VS Code Dark+ and GitHub Dark themes

import chalk from 'chalk';

export const theme = {
  background:    '#1e1e1e',      // Professional dark gray
  surface:       '#252526',      // Slightly lighter surface
  surfaceAlt:    '#2d2d30',      // Alternative surface
  userRowBg:     '#1a1a1a',      // Darker user message background
  borderDim:     '#3e3e42',      // Subtle borders
  borderDimmer:  '#2d2d30',      // Even more subtle
  border:        '#454545',      // Standard border
  text:          '#d4d4d4',      // Clean white text
  textDim:       '#9d9d9d',      // Dimmed text
  textDimmer:    '#6e6e6e',      // Very dim text
  brand:         '#007acc',      // Professional blue (VS Code blue)
  accent:        '#4ec9b0',      // Teal accent for highlights
  accentBlue:    '#569cd6',      // Light blue for links
  success:       '#4ec9b0',      // Teal for success
  warning:       '#dcdcaa',      // Soft yellow for warnings
  error:         '#f48771',      // Soft red for errors
  thinking:      '#569cd6',      // Blue for thinking states
  diffAdd:       '#4ec9b0',      // Teal for additions
  diffRemove:    '#f48771',      // Soft red for removals
  codeBg:        '#1e1e1e',      // Code background
  separator:     '#454545',      // Separator lines
  promptColor:   '#007acc',      // Professional blue for prompts
  tipsHeader:    '#569cd6',      // Light blue for tips
} as const;

export const glyphs = {
  brand:        '◆',
  info:         'i',
  running:      '◉',
  success:      '✓',
  error:        '✗',
  prompt:       '>',
  collapsed:    '▸',
  expanded:     '▾',
  tree1:        '├──',
  tree2:        '└──',
  sep:          '━',
  sepLight:     '─',
  borderLeft:   '│',
  star:         '✦',
  arrow:        '▹',
  diamond:      '◈',
  spin1:        '⣾',
  spin2:        '⣽',
  spin3:        '⣻',
  spin4:        '⢿',
  spin5:        '⡿',
  spin6:        '⣟',
  spin7:        '⣯',
  spin8:        '⣷',
} as const;

// Chalk helpers for consistent styling
export const c = {
  brand: chalk.hex(theme.brand),
  text: chalk.hex(theme.text),
  textDim: chalk.hex(theme.textDim),
  textDimmer: chalk.hex(theme.textDimmer),
  accent: chalk.hex(theme.accent),
  accentBlue: chalk.hex(theme.accentBlue),
  success: chalk.hex(theme.success),
  warning: chalk.hex(theme.warning),
  error: chalk.hex(theme.error),
  thinking: chalk.hex(theme.thinking),
  separator: chalk.hex(theme.separator),
  promptColor: chalk.hex(theme.promptColor),
  tipsHeader: chalk.hex(theme.tipsHeader),
  
  // Helpers
  bold: chalk.bold,
  dim: chalk.dim,
  italic: chalk.italic,
  underline: chalk.underline,
};

// Spinner frames for animations
export const spinnerFrames = [
  glyphs.spin1,
  glyphs.spin2,
  glyphs.spin3,
  glyphs.spin4,
  glyphs.spin5,
  glyphs.spin6,
  glyphs.spin7,
  glyphs.spin8,
];

// Activity log message templates (Professional)
export const activityMessages = [
  'Processing...',
  'Analyzing...',
  'Computing...',
  'Generating...',
  'Reading files...',
  'Completed in',
];

// Tips for getting started
export const startupTips = [
  'Ask Elith to analyze, refactor, or document your code',
  'Use /help to see available commands',
  'Press Ctrl+C to interrupt or exit',
];

// What's new messages
export const whatsNew = [
  'Multi-provider support: Claude, LM Studio, OpenRouter',
  '12 active skills for code analysis and modification',
  'Smart context engine for relevant file selection',
];

// Made with Bob
