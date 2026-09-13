import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, getToken, setToken } from '../services/api';

const AuthContext = createContext(null);

/** Lê o payload do JWT sem validar assinatura — a validação real é do back-end. */
export function readTokenPayload(token) {
  try {
    const [, payload] = token.split('.');
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

function userFromToken(token) {
  if (!token) return null;
  const payload = readTokenPayload(token);
  if (!payload) return null;
  if (payload.exp && payload.exp * 1000 <= Date.now()) return null;
  return { username: payload.username, role: payload.role, exp: payload.exp };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = getToken();
    const restored = userFromToken(stored);
    if (stored && !restored) setToken(null); // token vencido: limpa
    return restored;
  });

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async (username, role) => {
    const data = await api.login(username.trim(), role);
    setToken(data.token);
    const logged = userFromToken(data.token);
    setUser(logged);
    return logged;
  }, []);

  // O token da API vale 1 hora: agenda o encerramento da sessão no vencimento.
  useEffect(() => {
    if (!user?.exp) return undefined;
    const ms = user.exp * 1000 - Date.now();
    if (ms <= 0) {
      logout();
      return undefined;
    }
    const timer = setTimeout(logout, ms);
    return () => clearTimeout(timer);
  }, [user, logout]);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: Boolean(user),
      isTeacher: user?.role === 'professor',
    }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth precisa estar dentro de <AuthProvider>.');
  return context;
}

export default AuthContext;
