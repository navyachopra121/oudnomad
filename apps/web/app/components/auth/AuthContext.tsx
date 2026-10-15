'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { StoreApi } from '../../store-api';

import AuthModal from './AuthModal';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  setDemoUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'oudnomad_auth_token';
const USER_KEY = 'oudnomad_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(TOKEN_KEY) || localStorage.getItem('token');
      const savedUser = localStorage.getItem(USER_KEY);
      // Automatically purge legacy demo sessions from previous development runs
      if (savedToken && savedToken.startsWith('demo-')) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('token');
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
        return;
      }
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.email?.includes('collector@oudnomad') || parsed.name === 'Tariq Al-Mansoor') {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem('token');
          localStorage.removeItem(USER_KEY);
          setToken(null);
          setUser(null);
          return;
        }
        setUser(parsed);
      }
      if (savedToken) setToken(savedToken);
    } catch (_) { }
  }, []);

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const saveAuthSession = (authToken: string, userObj: UserProfile) => {
    setToken(authToken);
    setUser(userObj);
    try {
      localStorage.setItem(TOKEN_KEY, authToken);
      localStorage.setItem('token', authToken);
      localStorage.setItem(USER_KEY, JSON.stringify(userObj));
    } catch (_) { }
  };

  const login = async (email: string, password: string) => {
    const res = await StoreApi.login({ email, password });
    const authToken = res.accessToken || res.token;
    if (!authToken) {
      throw new Error('Authentication response did not include a valid session token.');
    }
    const userObj = res.user || { id: res.userId || 'usr-1', email, name: email.split('@')[0] };
    saveAuthSession(authToken, userObj);
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string }) => {
    const res = await StoreApi.register(data);
    const authToken = res.accessToken || res.token;
    if (!authToken) {
      throw new Error('Registration did not return an access token.');
    }
    const userObj = res.user || {
      id: res.id || res.userId || `usr-${Date.now()}`,
      email: data.email,
      name: data.name,
      phone: data.phone,
    };
    saveAuthSession(authToken, userObj);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('token');
      localStorage.removeItem(USER_KEY);
    } catch (_) { }
    StoreApi.logout().catch(() => { });
  };

  const setDemoUser = () => {
    const demoUser: UserProfile = {
      id: 'usr-vip-001',
      name: 'Tariq Al-Mansoor',
      email: 'collector@oudnomaddubai.com',
      phone: '+971 50 888 1234',
    };
    saveAuthSession('demo-vip-token-001', demoUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        setDemoUser,
      }}
    >
      {children}
      <AuthModal />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
