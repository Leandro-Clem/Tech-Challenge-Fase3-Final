import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { themes } from '../styles/theme';

const STORAGE_KEY = 'blog.tema';

const ThemeModeContext = createContext(null);

function systemPrefersDark() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

function readStoredMode() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* storage indisponível */
  }
  return null;
}

/**
 * Escolhe o modo na primeira visita pela preferência do sistema operacional
 * e, a partir da primeira troca manual, respeita a escolha do usuário.
 */
export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState(() => readStoredMode() ?? (systemPrefersDark() ? 'dark' : 'light'));
  const [followsSystem, setFollowsSystem] = useState(() => readStoredMode() === null);

  const changeMode = useCallback((next) => {
    setMode(next);
    setFollowsSystem(false);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage indisponível: a escolha vale só nesta sessão */
    }
  }, []);

  const toggleMode = useCallback(() => {
    setMode((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      setFollowsSystem(false);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* storage indisponível */
      }
      return next;
    });
  }, []);

  // Enquanto o usuário não escolher manualmente, acompanha o sistema.
  useEffect(() => {
    if (!followsSystem || typeof window.matchMedia !== 'function') return undefined;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (event) => setMode(event.matches ? 'dark' : 'light');
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }, [followsSystem]);

  // Mantém a cor da barra do navegador e o color-scheme nativo em sintonia.
  useEffect(() => {
    document.documentElement.style.colorScheme = mode;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', themes[mode].colors.paper);
  }, [mode]);

  const value = useMemo(
    () => ({ mode, isDark: mode === 'dark', toggleMode, changeMode }),
    [mode, toggleMode, changeMode],
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <StyledThemeProvider theme={themes[mode]}>{children}</StyledThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (!context) throw new Error('useThemeMode precisa estar dentro de <ThemeModeProvider>.');
  return context;
}

export default ThemeModeContext;
