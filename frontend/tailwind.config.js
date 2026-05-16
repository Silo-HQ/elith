/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#000000',
        'bg-secondary': '#0D0D0D',
        'bg-tertiary': '#141414',
        'bg-hover': '#1A1A1A',
        'border': '#222222',
        'border-light': '#333333',
        'text-primary': '#FFFFFF',
        'text-secondary': '#888888',
        'text-muted': '#444444',
        'accent': '#A855F7',
        'accent-dim': '#7C3AED',
        'bob': '#3B82F6',
        'claude': '#F97316',
        'gemini': '#06B6D4',
        'codex': '#84CC16',
        'local': '#8B5CF6',
        'success': '#22C55E',
        'warning': '#EAB308',
        'error': '#EF4444',
        'running': '#A855F7',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'sidebar': '260px',
      },
    },
  },
  plugins: [],
}

// Made with Bob
