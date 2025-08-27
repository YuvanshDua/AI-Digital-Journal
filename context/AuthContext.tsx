
import React, { createContext, useState, useEffect, useContext } from 'react';
import * as api from '../services/api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // This effect runs on app startup to check if a user session exists.
    const checkAuthStatus = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          // You might want a '/api/users/me/' endpoint to verify the token
          // and get user data. For now, we'll assume the token is valid
          // and decode it for user info, or just set isAuthenticated.
          // For simplicity, we'll just set isAuthenticated and a placeholder user.
          // A real app should fetch user data.
          const username = localStorage.getItem('username'); // Simple way to persist username
          if (username) {
            setUser({ id: 0, username, email: '' }); // Dummy user data
          }
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Session check failed", error);
          logout();
        }
      }
      setIsLoading(false);
    };
    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string) => {
    const data = await api.login(username, password);
    localStorage.setItem('accessToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);
    localStorage.setItem('username', username); // Store username for display
    setUser({ id: 0, username, email: '' }); // Set dummy user data
    setIsAuthenticated(true);
  };

  const register = async (username: string, email: string, password: string) => {
    await api.register(username, email, password);
    // After successful registration, log the user in automatically
    await login(username, password);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
