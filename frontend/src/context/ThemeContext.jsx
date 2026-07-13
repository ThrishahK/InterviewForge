import { createContext, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  // null = "no explicit user preference yet". Previously this fell back to
  // the OS preference; the updated brief specifies dark mode should remain
  // the default regardless of system preference, so first-time visitors now
  // get dark unless they explicitly switch.
  const [storedTheme, setStoredTheme] = useLocalStorage('interviewforge:theme', null);

  const theme = storedTheme ?? 'dark';

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      setTheme: (next) => setStoredTheme(next),
      toggleTheme: () => setStoredTheme(theme === 'dark' ? 'light' : 'dark'),
    }),
    [theme, setStoredTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
