import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';

interface AuthContextType {
  isAdmin: boolean;
  loading: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  loading: true,
  login: async () => false,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/api/auth/me', { withCredentials: true })
      .then(() => setIsAdmin(true))
      .catch(() => setIsAdmin(false))
      .finally(() => setLoading(false));
  }, []);

  const login = async (password: string): Promise<boolean> => {
    try {
      await axios.post('/api/auth/login', { password }, { withCredentials: true });
      setIsAdmin(true);
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
    } finally {
      setIsAdmin(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
