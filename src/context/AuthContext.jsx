import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import { speak } from '../utils/speak';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('admin_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .me()
      .then((res) => {
        setUser(res.data?.user || res.data);
      })
      .catch(() => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const res = await authService.login(credentials);
      const token = res.data?.token;
      const loggedInUser = res.data?.user || res.data;
      if (token) localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      toast.success('Logged in successfully');
      speak('Login successful.');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Login failed');
      speak('Login failed.');
      return { success: false, message: err.message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      /* ignore network errors on logout */
    }
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setUser(null);
    toast.success('Logged out');
    speak('Logged out successfully.');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
