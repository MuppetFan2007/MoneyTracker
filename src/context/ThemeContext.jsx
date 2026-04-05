import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeContextProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem('mt_theme') || 'dark');

  function toggle() {
    setMode(m => {
      const next = m === 'dark' ? 'light' : 'dark';
      localStorage.setItem('mt_theme', next);
      return next;
    });
  }

  return <ThemeContext.Provider value={{ mode, toggle }}>{children}</ThemeContext.Provider>;
}

export function useThemeMode() {
  return useContext(ThemeContext);
}
