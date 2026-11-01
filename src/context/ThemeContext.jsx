import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';

const THEME_KEY = 'unibuddy_campus_theme';
const ThemeContext = createContext(null);

function readTheme() {
  try { return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light'; }
  catch { return 'light'; }
}

export function initializeTheme() {
  const theme = readTheme();
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  return theme;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readTheme);
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#142019' : '#FAF9F5');
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* Theme still works for this session. */ }
  }, [theme]);
  useEffect(() => {
    const sync = event => { if (event.key === THEME_KEY || event.key === null) setTheme(readTheme()); };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  return <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(current => current === 'dark' ? 'light' : 'dark') }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
