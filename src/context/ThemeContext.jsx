import React, { createContext, useContext, useState } from 'react';

export const THEME_IDS = ['dark', 'light', 'racing-miku', 'nier', 'bunny'];

export const THEME_META = {
  dark:         { name: 'Dark',          emoji: '🌙', palette: ['#0C0E14', '#7C6EFA', '#10B981'], dark: true  },
  light:        { name: 'Light',         emoji: '☀️', palette: ['#F0F2F8', '#7C6EFA', '#10B981'], dark: false },
  'racing-miku':{ name: 'Racing Miku',   emoji: '🏎️', palette: ['#000C0F', '#00E5FF', '#FF1E8E'], dark: true  },
  nier:         { name: 'NieR:Automata', emoji: '⚔️', palette: ['#080808', '#C8A84B', '#E8E5D7'], dark: true  },
  bunny:        { name: 'Bunny',         emoji: '🐰', palette: ['#FFF0F7', '#FF6BB5', '#C77DFF'], dark: false },
};

const ThemeContext = createContext();

export function ThemeContextProvider({ children }) {
  const [themeId, setThemeIdState] = useState(() => {
    const saved = localStorage.getItem('mt_theme');
    return THEME_IDS.includes(saved) ? saved : 'dark';
  });

  function setThemeId(id) {
    if (THEME_IDS.includes(id)) {
      setThemeIdState(id);
      localStorage.setItem('mt_theme', id);
    }
  }

  // Back-compat: mode + toggle for existing code that uses them
  const mode = THEME_META[themeId]?.dark ? 'dark' : 'light';
  function toggle() {
    setThemeId(themeId === 'dark' ? 'light' : 'dark');
  }

  return (
    <ThemeContext.Provider value={{ themeId, setThemeId, mode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeContext);
}
