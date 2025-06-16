
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/services/api';

interface User {
  username: string;
  displayName: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getUserInfo = (username: string): User => {
    switch (username) {
      case 'jeza':
        return { username: 'jeza', displayName: 'Jeza', role: 'Thérapeute' };
      case 'admin':
        return { username: 'admin', displayName: 'Eric', role: 'Développeur' };
      default:
        return { username, displayName: username, role: 'User' };
    }
  };

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('moodcycle_token');
      const storedUser = localStorage.getItem('moodcycle_user');
      
      if (token && storedUser) {
        try {
          // Test the token by making a simple API call
          await apiClient.getInsights();
          setIsAuthenticated(true);
          setUser(JSON.parse(storedUser));
        } catch (err) {
          // Token is invalid or expired
          localStorage.removeItem('moodcycle_token');
          localStorage.removeItem('moodcycle_user');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.login(username, password);
      const userInfo = getUserInfo(username);
      
      localStorage.setItem('moodcycle_token', response.token);
      localStorage.setItem('moodcycle_user', JSON.stringify(userInfo));
      
      setUser(userInfo);
      setIsAuthenticated(true);
    } catch (err) {
      setError('Invalid credentials or server error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('moodcycle_token');
    localStorage.removeItem('moodcycle_user');
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = '/admin/login';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
