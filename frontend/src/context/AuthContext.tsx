import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { type AuthState, type AuthContextType, type User } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        return {
          token: storedToken,
          user: JSON.parse(storedUser) as User,
          isAuthenticated: true,
          isLoading: false,
        };
      } catch (error) {
        console.error(error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    };
  });

  // syncs context state when axiosInstance clears localStorage on 401
  useEffect(() => {
    const handler = () =>
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setState({
      token,
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setState({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {!state.isLoading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
