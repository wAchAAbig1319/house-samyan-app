import React, { createContext, useCallback, useContext, useState } from 'react';
import { authApi } from '@/api/auth';
import type { MockUser } from '@/api/auth';

interface AuthContextValue {
  user: MockUser | null;
  isBusy: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setIsBusy(true);
    setError(null);
    try {
      const loggedInUser = await authApi.login(email, password);
      setUser(loggedInUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เข้าสู่ระบบไม่สำเร็จ');
      throw err;
    } finally {
      setIsBusy(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setIsBusy(true);
    setError(null);
    try {
      const newUser = await authApi.register(name, email, password);
      setUser(newUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'สมัครสมาชิกไม่สำเร็จ');
      throw err;
    } finally {
      setIsBusy(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{ user, isBusy, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
