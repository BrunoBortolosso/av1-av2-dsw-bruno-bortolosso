import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('aula-user') || 'null'));
  const [token, setToken] = useState(() => localStorage.getItem('aula-token'));

  useEffect(() => {
    function handleExpired() { setUser(null); setToken(null); localStorage.removeItem('aula-user'); localStorage.removeItem('aula-token'); }
    window.addEventListener('aula-session-expired', handleExpired);
    return () => window.removeEventListener('aula-session-expired', handleExpired);
  }, []);

  function saveSession(data) {
    setUser(data.user); setToken(data.token);
    localStorage.setItem('aula-user', JSON.stringify(data.user));
    localStorage.setItem('aula-token', data.token);
  }
  async function login(credentials) { saveSession(await api('/auth/login', { method: 'POST', body: JSON.stringify(credentials) })); }
  async function register(credentials) { return api('/auth/register', { method: 'POST', body: JSON.stringify(credentials) }); }
  function logout() { setUser(null); setToken(null); localStorage.removeItem('aula-user'); localStorage.removeItem('aula-token'); }

  return <AuthContext.Provider value={{ user, token, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }
