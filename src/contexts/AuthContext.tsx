import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authService, UserProfile } from '@/services/auth';
import { getTokens, clearTokens } from '@/services/api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  walletId: string;
  username: string;
  createdAt: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapProfileToUser = (profile: UserProfile): User => ({
  id: profile.username,
  firstName: profile.first_name,
  lastName: profile.last_name,
  email: profile.email,
  phone: profile.phone_number || '',
  avatar: '',
  walletId: '',
  username: profile.username,
  createdAt: new Date().toISOString(),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const profile = await authService.getProfile();
      setUser(mapProfileToUser(profile));
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      clearTokens();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const tokens = getTokens();
      if (tokens?.access) {
        await fetchProfile();
      }
      setIsLoading(false);
    };
    initAuth();
  }, [fetchProfile]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await authService.login(email, password);
      await fetchProfile();
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      return false;
    }
  }, [fetchProfile]);

  // Mock register - replace with real API when available
  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    // For now, just attempt login after "registration"
    return !!(data.email && data.password);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  // Mock reset password - replace with real API when available
  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    return !!email;
  }, []);

  // Mock update profile - replace with real API when available
  const updateProfile = useCallback(async (data: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (user) {
      setUser({ ...user, ...data });
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  }, [user]);

  // Mock change password - replace with real API when available
  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    return !!(currentPassword && newPassword && newPassword.length >= 8);
  }, []);

  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        resetPassword,
        updateProfile,
        changePassword,
        refreshProfile,
      }}
    >
      {children}
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
