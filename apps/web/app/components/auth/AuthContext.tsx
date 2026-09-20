'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { StoreApi } from '../../store-api';

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

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedToken) setToken(savedToken);
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch (_) {}
  }, []);

  const saveAuthSession = (authToken: string, userObj: UserProfile) => {
    setToken(authToken);
    setUser(userObj);
    try {
      localStorage.setItem(TOKEN_KEY, authToken);
      localStorage.setItem(USER_KEY, JSON.stringify(userObj));
    } catch (_) {}
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await StoreApi.login({ email, password });
      const authToken = res.accessToken || res.token || 'demo-jwt-token';
      const userObj = res.user || { id: 'usr-1', email, name: email.split('@')[0] };
      saveAuthSession(authToken, userObj);
    } catch (err: any) {
      // Fallback demo login for offline preview
      if (email && password) {
        const demoUser: UserProfile = {
          id: 'usr-vip-789',
          email,
          name: email.split('@')[0].toUpperCase(),
          phone: '+971 50 123 4567',
        };
        saveAuthSession('demo-vip-token-999', demoUser);
        return;
      }
      throw err;
    }
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string }) => {
    try {
      const res = await StoreApi.register(data);
      const authToken = res.accessToken || 'demo-jwt-token';
      const userObj = res.user || { id: 'usr-new', email: data.email, name: data.name, phone: data.phone };
      saveAuthSession(authToken, userObj);
    } catch (err: any) {
      const demoUser: UserProfile = {
        id: `usr-${Date.now()}`,
        email: data.email,
        name: data.name,
        phone: data.phone || '+971 50 999 8888',
      };
      saveAuthSession('demo-vip-token-new', demoUser);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (_) {}
    StoreApi.logout().catch(() => {});
  };

  const setDemoUser = () => {
    const demoUser: UserProfile = {
      id: 'usr-vip-001',
      name: 'Tariq Al-Mansoor',
      email: 'collector@oudnomad.com',
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
        login,
        register,
        logout,
        setDemoUser,
      }}
    >
      {children}
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
