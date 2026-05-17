// Theme management hook
import { useState, useEffect, useCallback } from 'react';
import { getTheme, getThemeNames, type Theme } from '../themes/index.js';

const THEME_STORAGE_KEY = 'elith-tui-theme';

export function useTheme() {
  // Load saved theme or default to 'dark'
  const [currentThemeName, setCurrentThemeName] = useState<string>(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
    }
    return 'dark';
  });

  const [theme, setTheme] = useState<Theme>(() => getTheme(currentThemeName));

  // Switch theme
  const switchTheme = useCallback((themeName: string) => {
    const newTheme = getTheme(themeName);
    setTheme(newTheme);
    setCurrentThemeName(themeName);
    
    // Save to localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, themeName);
    }
  }, []);

  // Cycle to next theme
  const nextTheme = useCallback(() => {
    const themeNames = getThemeNames();
    const currentIndex = themeNames.indexOf(currentThemeName);
    const nextIndex = (currentIndex + 1) % themeNames.length;
    switchTheme(themeNames[nextIndex]);
  }, [currentThemeName, switchTheme]);

  // Cycle to previous theme
  const previousTheme = useCallback(() => {
    const themeNames = getThemeNames();
    const currentIndex = themeNames.indexOf(currentThemeName);
    const prevIndex = (currentIndex - 1 + themeNames.length) % themeNames.length;
    switchTheme(themeNames[prevIndex]);
  }, [currentThemeName, switchTheme]);

  // Get all available themes
  const availableThemes = getThemeNames();

  return {
    theme,
    currentThemeName,
    switchTheme,
    nextTheme,
    previousTheme,
    availableThemes,
  };
}

// Made with Bob
