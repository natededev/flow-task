import { useEffect } from 'react';
import { useClientStore } from '@/store/clientStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const theme = useClientStore(state => state.theme);

  useEffect(() => {
    // Apply theme to document
    const applyTheme = (currentTheme: string) => {
      if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (currentTheme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // system: match prefers-color-scheme
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    // Apply theme on mount and when theme changes
    applyTheme(theme);

    // Listen for system theme changes when theme is 'system'
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    if (theme === 'system') {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    }

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

  return <>{children}</>;
};
