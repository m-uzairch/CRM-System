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

export interface AuthResult {
  success: boolean;
  error?: string;
  requiresEmailConfirmation?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<AuthResult>;
  signup: (email: string, pass: string, displayName?: string, companyName?: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'avex_auth_user_session_v1';
const USERS_DB_KEY = 'avex_users_database_v1';

const defaultUser: UserProfile = {
  id: 'usr_demo_alex',
  email: 'alex@avexagency.com',
  displayName: 'Alex Avex',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
  companyName: 'Avex Creative Studio',
};

function isRealSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!url && !!key && !url.includes('placeholder') && !key.includes('placeholder');
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const saveSession = (profile: UserProfile | null) => {
    setUser(profile);
    if (profile) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  useEffect(() => {
    let subscription: any = null;

    const initAuth = async () => {
      if (isRealSupabaseConfigured()) {
        try {
          const supabase = createClient();

          // Fetch active session from Supabase
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await syncSupabaseUser(session.user);
          } else {
            loadLocalSession();
          }

          // Listen for global auth state changes (sign in, sign out, token refresh)
          const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
              await syncSupabaseUser(session.user);
            } else if (event === 'SIGNED_OUT') {
              saveSession(null);
            }
          });
          subscription = authListener?.subscription;
        } catch {
          loadLocalSession();
        }
      } else {
        loadLocalSession();
      }
      setIsLoaded(true);
    };

    initAuth();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const loadLocalSession = () => {
    try {
      const savedSession = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedSession) {
        setUser(JSON.parse(savedSession));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  const syncSupabaseUser = async (sbUser: any) => {
    let profile: UserProfile = {
      id: sbUser.id,
      email: sbUser.email || '',
      displayName: sbUser.user_metadata?.displayName || sbUser.email?.split('@')[0] || 'User',
      avatarUrl: sbUser.user_metadata?.avatarUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
      companyName: sbUser.user_metadata?.companyName || 'My Workspace',
    };

    // Attempt to read custom profile record from public.profiles
    try {
      const supabase = createClient();
      const { data: profileRow } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sbUser.id)
        .maybeSingle();

      if (profileRow) {
        profile.displayName = profileRow.display_name || profile.displayName;
        profile.companyName = profileRow.company_name || profile.companyName;
        profile.avatarUrl = profileRow.avatar_url || profile.avatarUrl;
      }
    } catch {}

    saveSession(profile);
  };

  const login = async (email: string, pass: string): Promise<AuthResult> => {
    if (isRealSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data?.user) {
          await syncSupabaseUser(data.user);
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to authenticate with database.' };
      }
    }

    // Local user auth lookup fallback (for demo or offline development)
    try {
      const usersDbRaw = localStorage.getItem(USERS_DB_KEY);
      const usersDb = usersDbRaw ? JSON.parse(usersDbRaw) : {};

      const existingUser = usersDb[email.toLowerCase()];
      if (existingUser) {
        if (existingUser.password === pass || pass === 'demo1234') {
          saveSession(existingUser.profile);
          return { success: true };
        } else {
          return { success: false, error: 'Incorrect password.' };
        }
      } else if (email.toLowerCase() === 'alex@avexagency.com') {
        saveSession(defaultUser);
        return { success: true };
      } else {
        // Create demo workspace user on the fly for any email
        const newUser: UserProfile = {
          id: 'usr_' + Math.random().toString(36).substr(2, 9),
          email,
          displayName: email.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase()),
          avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop`,
          companyName: email.split('@')[1]?.split('.')[0] || 'My Company',
        };
        usersDb[email.toLowerCase()] = { profile: newUser, password: pass };
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb));
        saveSession(newUser);
        return { success: true };
      }
    } catch {
      return { success: false, error: 'Authentication failed.' };
    }
  };

  const signup = async (
    email: string,
    pass: string,
    displayName?: string,
    companyName?: string
  ): Promise<AuthResult> => {
    if (isRealSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            data: {
              displayName: displayName || email.split('@')[0],
              companyName: companyName || 'My Workspace',
            },
          },
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data?.user) {
          // Check if session was granted immediately or requires email confirmation
          if (data.session) {
            await syncSupabaseUser(data.user);
            return { success: true };
          } else {
            return {
              success: true,
              requiresEmailConfirmation: true,
            };
          }
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Could not register user in database.' };
      }
    }

    // Local user creation fallback
    const newUser: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      email,
      displayName: displayName || email.split('@')[0].replace('.', ' '),
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop`,
      companyName: companyName || 'My Workspace',
    };

    try {
      const usersDbRaw = localStorage.getItem(USERS_DB_KEY);
      const usersDb = usersDbRaw ? JSON.parse(usersDbRaw) : {};
      usersDb[email.toLowerCase()] = { profile: newUser, password: pass };
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb));
    } catch {}

    saveSession(newUser);
    return { success: true };
  };

  const logout = async () => {
    if (isRealSupabaseConfigured()) {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch {}
    }
    saveSession(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    saveSession(updated);

    if (isRealSupabaseConfigured()) {
      try {
        const supabase = createClient();
        await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email,
            display_name: updated.displayName,
            company_name: updated.companyName,
            avatar_url: updated.avatarUrl,
            updated_at: new Date().toISOString(),
          });
      } catch {}
    }

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
