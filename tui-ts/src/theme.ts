// Theme configuration matching Gemini CLI / Claude Code CLI aesthetic
// GitHub dark theme colors with purple brand accent

import chalk from 'chalk';

export const theme = {
  background:    '#0d1117',
  surface:       '#13141f',
  surfaceAlt:    '#1a1a2e',
  userRowBg:     '#0d1f2d',
  borderDim:     '#21262d',
  borderDimmer:  '#161b22',
  text:          '#e6edf3',
  textDim:       '#6e7681',
  textDimmer:    '#3d444d',
  brand:         '#e040fb',
  accent:        '#58a6ff',
  success:       '#3fb950',
  warning:       '#d29922',
  error:         '#f85149',
  thinking:      '#6e40c9',
  diffAdd:       '#3fb950',
  diffRemove:    '#f85149',
  codeBg:        '#161b22',
  separator:     '#3d444d',
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
  success: chalk.hex(theme.success),
  warning: chalk.hex(theme.warning),
  error: chalk.hex(theme.error),
  thinking: chalk.hex(theme.thinking),
  separator: chalk.hex(theme.separator),
  
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

// Activity log message templates
export const activityMessages = [
  'indexing workspace...',
  'generating execution plan...',
  'scanning dependencies...',
  'analyzing repository...',
  'context engine compressing tokens...',
  'waiting for model response...',
  'building task packet...',
];

// Made with Bob
