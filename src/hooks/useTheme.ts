import { useEffect } from 'react';
import { useUIStore } from '../stores/uiStore';

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useUIStore();

  useEffect(() => {
    const resolved = resolvedTheme();
    document.documentElement.classList.toggle('dark', resolved === 'dark');

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent) => {
        document.documentElement.classList.toggle('dark', e.matches);
      };
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme, resolvedTheme]);

  return { theme, setTheme, resolvedTheme };
}
