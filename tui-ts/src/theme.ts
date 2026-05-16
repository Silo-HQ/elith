// Theme configuration matching Elith design system
// Pure black background with purple accents

import chalk from 'chalk';

export const colors = {
  // Base colors
  background: '#0A0A0A',
  backgroundAlt: '#121212',
  
  // Primary purple accent
  primary: '#A855F7',
  primaryDim: '#9333EA',
  
  // Text colors
  text: '#FFFFFF',
  textDim: '#888888',
  textMuted: '#666666',
  
  // Status colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Model-specific colors
  bob: '#00BFFF',
  claude: '#FF6B35',
  gemini: '#4285F4',
  gpt: '#10A37F',
  local: '#A855F7',
  
  // UI elements
  border: '#333333',
  borderActive: '#A855F7',
  input: '#1A1A1A',
};

// Chalk theme helpers
export const theme = {
  primary: chalk.hex(colors.primary),
  text: chalk.hex(colors.text),
  textDim: chalk.hex(colors.textDim),
  textMuted: chalk.hex(colors.textMuted),
  success: chalk.hex(colors.success),
  error: chalk.hex(colors.error),
  warning: chalk.hex(colors.warning),
  info: chalk.hex(colors.info),
  
  // Model colors
  bob: chalk.hex(colors.bob),
  claude: chalk.hex(colors.claude),
  gemini: chalk.hex(colors.gemini),
  gpt: chalk.hex(colors.gpt),
  local: chalk.hex(colors.local),
  
  // Helpers
  bold: chalk.bold,
  dim: chalk.dim,
  italic: chalk.italic,
  underline: chalk.underline,
};

// Model color mapping
export function getModelColor(model: string): typeof chalk {
  const modelLower = model.toLowerCase();
  if (modelLower.includes('bob')) return theme.bob;
  if (modelLower.includes('claude')) return theme.claude;
  if (modelLower.includes('gemini')) return theme.gemini;
  if (modelLower.includes('gpt')) return theme.gpt;
  return theme.local;
}

// Status indicator
export function getStatusIndicator(status: 'active' | 'inactive' | 'error'): string {
  switch (status) {
    case 'active':
      return theme.success('●');
    case 'inactive':
      return theme.textDim('○');
    case 'error':
      return theme.error('●');
    default:
      return theme.textDim('○');
  }
}

// Made with Bob
