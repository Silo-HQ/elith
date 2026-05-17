// Enhanced theme system with multiple beautiful themes
import gradient from 'gradient-string';

export interface Theme {
  name: string;
  colors: {
    background: string;
    surface: string;
    surfaceAlt: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textDim: string;
    textDimmer: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    border: string;
    borderDim: string;
    thinking: string;
    brand: string;
  };
  gradients: {
    primary: [string, string];
    accent: [string, string];
    success: [string, string];
    error: [string, string];
  };
  effects: {
    blur: number;
    opacity: number;
    glow: boolean;
  };
  animations: {
    duration: number;
    easing: string;
  };
}

// Dark Theme (Default - GitHub Dark inspired)
export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    background: '#0d1117',
    surface: '#13141f',
    surfaceAlt: '#1a1a2e',
    primary: '#e040fb',
    secondary: '#58a6ff',
    accent: '#58a6ff',
    text: '#e6edf3',
    textDim: '#6e7681',
    textDimmer: '#3d444d',
    success: '#3fb950',
    warning: '#d29922',
    error: '#f85149',
    info: '#58a6ff',
    border: '#30363d',
    borderDim: '#21262d',
    thinking: '#6e40c9',
    brand: '#e040fb',
  },
  gradients: {
    primary: ['#e040fb', '#7c4dff'],
    accent: ['#58a6ff', '#1f6feb'],
    success: ['#3fb950', '#2ea043'],
    error: ['#f85149', '#da3633'],
  },
  effects: {
    blur: 8,
    opacity: 0.95,
    glow: true,
  },
  animations: {
    duration: 300,
    easing: 'ease-in-out',
  },
};

// Light Theme (Clean and bright)
export const lightTheme: Theme = {
  name: 'light',
  colors: {
    background: '#ffffff',
    surface: '#f6f8fa',
    surfaceAlt: '#eaeef2',
    primary: '#8250df',
    secondary: '#0969da',
    accent: '#0969da',
    text: '#1f2328',
    textDim: '#656d76',
    textDimmer: '#8c959f',
    success: '#1a7f37',
    warning: '#9a6700',
    error: '#d1242f',
    info: '#0969da',
    border: '#d0d7de',
    borderDim: '#e1e4e8',
    thinking: '#8250df',
    brand: '#8250df',
  },
  gradients: {
    primary: ['#8250df', '#6639ba'],
    accent: ['#0969da', '#0550ae'],
    success: ['#1a7f37', '#116329'],
    error: ['#d1242f', '#a40e26'],
  },
  effects: {
    blur: 4,
    opacity: 0.98,
    glow: false,
  },
  animations: {
    duration: 250,
    easing: 'ease-out',
  },
};

// Cyberpunk Theme (Neon and high contrast)
export const cyberpunkTheme: Theme = {
  name: 'cyberpunk',
  colors: {
    background: '#0a0e27',
    surface: '#1a1f3a',
    surfaceAlt: '#252a4a',
    primary: '#ff00ff',
    secondary: '#00ffff',
    accent: '#00ff00',
    text: '#ffffff',
    textDim: '#b4b4ff',
    textDimmer: '#6666cc',
    success: '#00ff00',
    warning: '#ffff00',
    error: '#ff0066',
    info: '#00ffff',
    border: '#ff00ff',
    borderDim: '#6600cc',
    thinking: '#ff00ff',
    brand: '#ff00ff',
  },
  gradients: {
    primary: ['#ff00ff', '#ff0066'],
    accent: ['#00ffff', '#00ff00'],
    success: ['#00ff00', '#00ffff'],
    error: ['#ff0066', '#ff00ff'],
  },
  effects: {
    blur: 12,
    opacity: 0.9,
    glow: true,
  },
  animations: {
    duration: 400,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

// Dracula Theme (Popular dark theme)
export const draculaTheme: Theme = {
  name: 'dracula',
  colors: {
    background: '#282a36',
    surface: '#343746',
    surfaceAlt: '#44475a',
    primary: '#bd93f9',
    secondary: '#8be9fd',
    accent: '#50fa7b',
    text: '#f8f8f2',
    textDim: '#6272a4',
    textDimmer: '#44475a',
    success: '#50fa7b',
    warning: '#f1fa8c',
    error: '#ff5555',
    info: '#8be9fd',
    border: '#6272a4',
    borderDim: '#44475a',
    thinking: '#bd93f9',
    brand: '#ff79c6',
  },
  gradients: {
    primary: ['#bd93f9', '#ff79c6'],
    accent: ['#8be9fd', '#50fa7b'],
    success: ['#50fa7b', '#8be9fd'],
    error: ['#ff5555', '#ff79c6'],
  },
  effects: {
    blur: 6,
    opacity: 0.95,
    glow: true,
  },
  animations: {
    duration: 300,
    easing: 'ease-in-out',
  },
};

// Nord Theme (Arctic, cool palette)
export const nordTheme: Theme = {
  name: 'nord',
  colors: {
    background: '#2e3440',
    surface: '#3b4252',
    surfaceAlt: '#434c5e',
    primary: '#88c0d0',
    secondary: '#81a1c1',
    accent: '#5e81ac',
    text: '#eceff4',
    textDim: '#d8dee9',
    textDimmer: '#4c566a',
    success: '#a3be8c',
    warning: '#ebcb8b',
    error: '#bf616a',
    info: '#88c0d0',
    border: '#4c566a',
    borderDim: '#3b4252',
    thinking: '#b48ead',
    brand: '#88c0d0',
  },
  gradients: {
    primary: ['#88c0d0', '#81a1c1'],
    accent: ['#5e81ac', '#81a1c1'],
    success: ['#a3be8c', '#8fbcbb'],
    error: ['#bf616a', '#d08770'],
  },
  effects: {
    blur: 5,
    opacity: 0.96,
    glow: false,
  },
  animations: {
    duration: 280,
    easing: 'ease-in-out',
  },
};

// Solarized Dark Theme (Classic)
export const solarizedDarkTheme: Theme = {
  name: 'solarized-dark',
  colors: {
    background: '#002b36',
    surface: '#073642',
    surfaceAlt: '#0e4c5a',
    primary: '#268bd2',
    secondary: '#2aa198',
    accent: '#859900',
    text: '#fdf6e3',
    textDim: '#93a1a1',
    textDimmer: '#586e75',
    success: '#859900',
    warning: '#b58900',
    error: '#dc322f',
    info: '#268bd2',
    border: '#586e75',
    borderDim: '#073642',
    thinking: '#6c71c4',
    brand: '#d33682',
  },
  gradients: {
    primary: ['#268bd2', '#2aa198'],
    accent: ['#859900', '#2aa198'],
    success: ['#859900', '#268bd2'],
    error: ['#dc322f', '#d33682'],
  },
  effects: {
    blur: 4,
    opacity: 0.97,
    glow: false,
  },
  animations: {
    duration: 260,
    easing: 'ease-out',
  },
};

// Monokai Theme (Sublime Text inspired)
export const monokaiTheme: Theme = {
  name: 'monokai',
  colors: {
    background: '#272822',
    surface: '#3e3d32',
    surfaceAlt: '#49483e',
    primary: '#f92672',
    secondary: '#66d9ef',
    accent: '#a6e22e',
    text: '#f8f8f2',
    textDim: '#75715e',
    textDimmer: '#49483e',
    success: '#a6e22e',
    warning: '#e6db74',
    error: '#f92672',
    info: '#66d9ef',
    border: '#75715e',
    borderDim: '#49483e',
    thinking: '#ae81ff',
    brand: '#fd971f',
  },
  gradients: {
    primary: ['#f92672', '#fd971f'],
    accent: ['#66d9ef', '#a6e22e'],
    success: ['#a6e22e', '#66d9ef'],
    error: ['#f92672', '#ae81ff'],
  },
  effects: {
    blur: 6,
    opacity: 0.95,
    glow: true,
  },
  animations: {
    duration: 300,
    easing: 'ease-in-out',
  },
};

// Ocean Theme (Deep blue)
export const oceanTheme: Theme = {
  name: 'ocean',
  colors: {
    background: '#0c1e2e',
    surface: '#1a2f42',
    surfaceAlt: '#234056',
    primary: '#4fc3f7',
    secondary: '#29b6f6',
    accent: '#00acc1',
    text: '#e0f7fa',
    textDim: '#80deea',
    textDimmer: '#4dd0e1',
    success: '#26a69a',
    warning: '#ffa726',
    error: '#ef5350',
    info: '#4fc3f7',
    border: '#00838f',
    borderDim: '#006064',
    thinking: '#7986cb',
    brand: '#4fc3f7',
  },
  gradients: {
    primary: ['#4fc3f7', '#29b6f6'],
    accent: ['#00acc1', '#26a69a'],
    success: ['#26a69a', '#4fc3f7'],
    error: ['#ef5350', '#ff7043'],
  },
  effects: {
    blur: 8,
    opacity: 0.94,
    glow: true,
  },
  animations: {
    duration: 320,
    easing: 'ease-in-out',
  },
};

// All available themes
export const themes: Record<string, Theme> = {
  dark: darkTheme,
  light: lightTheme,
  cyberpunk: cyberpunkTheme,
  dracula: draculaTheme,
  nord: nordTheme,
  'solarized-dark': solarizedDarkTheme,
  monokai: monokaiTheme,
  ocean: oceanTheme,
};

// Default theme
export const defaultTheme = darkTheme;

// Helper to create gradient text
export function createGradient(text: string, colors: [string, string]): string {
  return gradient(colors)(text);
}

// Helper to get theme by name
export function getTheme(name: string): Theme {
  return themes[name] || defaultTheme;
}

// Helper to list all theme names
export function getThemeNames(): string[] {
  return Object.keys(themes);
}

// Made with Bob
