'use me';
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '../supabase/client';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  companyName: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (email: string, pass: string, displayName?: string, companyName?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'avex_auth_user_session_v1';
const USERS_DB_KEY = 'avex_users_database_v1';

// Default initial user for demo
const defaultUser: UserProfile = {
  id: 'usr_demo_alex',
  email: 'alex@avexagency.com',
  displayName: 'Alex Avex',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
  companyName: 'Avex Creative Studio',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedSession) {
        setUser(JSON.parse(savedSession));
      } else {
        setUser(defaultUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultUser));
      }
    } catch (e) {
      setUser(defaultUser);
    }
    setIsLoaded(true);
  }, []);

  const saveSession = (profile: UserProfile | null) => {
    setUser(profile);
    if (profile) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      // Try Supabase auth if connected
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (!error && data?.user) {
        const profile: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          displayName: data.user.user_metadata?.displayName || email.split('@')[0],
          avatarUrl: data.user.user_metadata?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          companyName: data.user.user_metadata?.companyName || 'Agency',
        };
        saveSession(profile);
        return true;
      }
    } catch {
      // Supabase fallback
    }

    // Local user auth lookup fallback
    try {
      const usersDbRaw = localStorage.getItem(USERS_DB_KEY);
      const usersDb = usersDbRaw ? JSON.parse(usersDbRaw) : {};
      
      const existingUser = usersDb[email.toLowerCase()];
      if (existingUser) {
        saveSession(existingUser.profile);
        return true;
      } else {
        // Create user session on the fly for any company email
        const newUser: UserProfile = {
          id: 'usr_' + Math.random().toString(36).substr(2, 9),
          email,
          displayName: email.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase()),
          avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop`,
          companyName: email.split('@')[1]?.split('.')[0] || 'My Company',
        };
        usersDb[email.toLowerCase()] = { profile: newUser, password: pass };
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb));
        saveSession(newUser);
        return true;
      }
    } catch {
      return false;
    }
  };

  const signup = async (email: string, pass: string, displayName?: string, companyName?: string): Promise<boolean> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: { data: { displayName, companyName } }
      });
      if (!error && data?.user) {
        const profile: UserProfile = {
          id: data.user.id,
          email,
          displayName: displayName || email.split('@')[0],
          avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?w=150&auto=format&fit=crop`,
          companyName: companyName || 'Company',
        };
        saveSession(profile);
        return true;
      }
    } catch {}

    // Local user creation
    const newUser: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      email,
      displayName: displayName || email.split('@')[0].replace('.', ' '),
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?w=150&auto=format&fit=crop`,
      companyName: companyName || 'Company',
    };

    try {
      const usersDbRaw = localStorage.getItem(USERS_DB_KEY);
      const usersDb = usersDbRaw ? JSON.parse(usersDbRaw) : {};
      usersDb[email.toLowerCase()] = { profile: newUser, password: pass };
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb));
    } catch {}

    saveSession(newUser);
    return true;
  };

  const logout = () => {
    try {
      const supabase = createClient();
      supabase.auth.signOut();
    } catch {}
    saveSession(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    saveSession(updated);

    // Sync to local users db
    try {
      const usersDbRaw = localStorage.getItem(USERS_DB_KEY);
      if (usersDbRaw) {
        const usersDb = JSON.parse(usersDbRaw);
        if (usersDb[user.email.toLowerCase()]) {
          usersDb[user.email.toLowerCase()].profile = updated;
          localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb));
        }
      }
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateProfile,
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
