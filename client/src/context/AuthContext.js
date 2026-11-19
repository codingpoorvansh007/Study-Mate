import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('studymate_token'));
  const [loading, setLoading] = useState(!!localStorage.getItem('studymate_token'));

  const logout = useCallback(() => {
    localStorage.removeItem('studymate_token');
    setToken(null);
    setUser(null);
  }, []);

  // On first load, check that the saved token is still valid
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => logout()) // invalid or expired token
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveSession = (data) => {
    localStorage.setItem('studymate_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    saveSession(res.data);
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    saveSession(res.data);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
