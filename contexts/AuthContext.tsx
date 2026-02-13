import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User, LoginResponse } from '../types';
import { login as apiLogin, register as apiRegister, requestPasswordReset as apiRequestPasswordReset } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (email: string) => Promise<void>;
  register: (email: string, name: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('nexus_token');
    const userStr = localStorage.getItem('nexus_user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setState({
          isAuthenticated: true,
          user,
          token,
          isLoading: false,
        });
      } catch (e) {
        // Corrupt data
        logout();
      }
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const handleAuthSuccess = (response: LoginResponse) => {
    localStorage.setItem('nexus_token', response.token);
    localStorage.setItem('nexus_user', JSON.stringify(response.user));

    setState({
      isAuthenticated: true,
      user: response.user,
      token: response.token,
      isLoading: false,
    });
  };

  const login = async (email: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await apiLogin(email);
      handleAuthSuccess(response);
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (email: string, name: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await apiRegister(email, name);
      handleAuthSuccess(response);
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await apiRequestPasswordReset(email);
      // No state update needed for success, purely side effect, but stop loading
      setState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_user');
    setState({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, forgotPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};