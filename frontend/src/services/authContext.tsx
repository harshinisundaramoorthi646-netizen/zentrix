import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { User, UserRole } from '../types';
import { apiService } from './api';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoadingSession: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  toastMessage: { text: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin-only sections
const ADMIN_RESTRICTED_SECTIONS = ['Team', 'Commission', 'Billing', 'Analytics', 'AI Intelligence', 'Audit Log'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('zentrix_user');
      if (!saved || saved === 'undefined' || saved === 'null') return null;
      const parsed = JSON.parse(saved);
      return (parsed && parsed.id && parsed.role) ? parsed : null;
    } catch (err) {
      console.warn('Invalid user session in localStorage. Clearing state.', err);
      localStorage.removeItem('zentrix_user');
      localStorage.removeItem('zentrix_token');
      return null;
    }
  });


  const [isLoadingSession, setIsLoadingSession] = useState<boolean>(true);
  const [activeSection, setActiveSectionState] = useState<string>('Overview');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const role = user ? user.role : null;
  const isAuthenticated = !!user;

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ text, type });
    if (type === 'success') toast.success(text);
    else if (type === 'error') toast.error(text);
    else toast(text);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Restore & verify session on mount
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('zentrix_token');
      if (!token) {
        setUser(null);
        localStorage.removeItem('zentrix_user');
        setIsLoadingSession(false);
        return;
      }

      try {
        const currentUser = await apiService.getMe();
        setUser(currentUser);
        localStorage.setItem('zentrix_user', JSON.stringify(currentUser));

        // Set default active section according to role
        if (currentUser.role === 'ADMIN') setActiveSectionState('Overview');
        else if (currentUser.role === 'TEAM_A') setActiveSectionState('Lead Journey');
        else if (currentUser.role === 'TEAM_B') setActiveSectionState('Follow-ups');
      } catch (err) {
        // Token verification failed or expired
        if (!token.startsWith('demo_token_')) {
          setUser(null);
          localStorage.removeItem('zentrix_token');
          localStorage.removeItem('zentrix_user');
        }
      } finally {
        setIsLoadingSession(false);
      }

    };

    verifySession();
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('zentrix_user');
    localStorage.removeItem('zentrix_token');
    setActiveSectionState('Overview');
    showToast('Logged out of Zentrix platform.', 'info');
    window.history.pushState(null, '', window.location.href);
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('zentrix_unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('zentrix_unauthorized', handleUnauthorized);
    };
  }, []);

  // Role-based navigation guard for section switching
  const setActiveSection = (section: string) => {
    if (!user) return;

    if (user.role !== 'ADMIN' && ADMIN_RESTRICTED_SECTIONS.includes(section)) {
      showToast(`Access Denied: Section "${section}" is restricted to Admin users.`, 'error');
      return;
    }

    setActiveSectionState(section);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await apiService.login(email, password);
      setUser(res.user);
      localStorage.setItem('zentrix_user', JSON.stringify(res.user));
      
      // Auto redirect based on role
      if (res.user.role === 'ADMIN') setActiveSectionState('Overview');
      else if (res.user.role === 'TEAM_A') setActiveSectionState('Lead Journey');
      else if (res.user.role === 'TEAM_B') setActiveSectionState('Follow-ups');

      showToast(`Welcome back, ${res.user.name}! Authenticated as ${res.user.role}.`, 'success');
      return { success: true };
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Authentication failed. Please check your credentials.';
      return { success: false, error: errorMsg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoadingSession,
        login,
        logout,
        activeSection,
        setActiveSection,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
