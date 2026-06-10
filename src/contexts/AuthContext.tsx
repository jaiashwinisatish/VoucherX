import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { hasInvalidSupabaseConfig, supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: SupabaseUser | null;
  profile: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INVALID_SUPABASE_CONFIG_MESSAGE =
  'Supabase is not configured. Update VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env with real project values, then restart npm run dev.';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const getSessionWithTimeout = async (timeoutMs: number = 10000) => {
      let timeoutId: ReturnType<typeof setTimeout> | null = null;
      try {
        return await Promise.race([
          supabase.auth.getSession(),
          new Promise<Awaited<ReturnType<typeof supabase.auth.getSession>>>((_, reject) => {
            timeoutId = setTimeout(() => {
              reject(new Error(`Session check timed out after ${timeoutMs}ms`));
            }, timeoutMs);
          }),
        ]);
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }
    };

    const initSession = async () => {
      try {
        const { data: { session }, error } = await getSessionWithTimeout();
        if (error) throw error;

        if (!isMounted) return;

        console.log('Session check on mount:', session?.user?.id);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking initial session:', error);
        if (!isMounted) return;
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    };

    initSession();

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      (async () => {
        try {
          setUser(session?.user ?? null);
          if (session?.user) {
            await fetchProfile(session.user.id);
          } else {
            setProfile(null);
            setLoading(false);
          }
        } catch (error) {
          console.error('Error during auth state change:', error);
          setProfile(null);
          setLoading(false);
        }
      })();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    console.log('Fetching profile for user ID:', userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      console.log('Profile data fetched:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (hasInvalidSupabaseConfig) {
      throw new Error(INVALID_SUPABASE_CONFIG_MESSAGE);
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error(INVALID_SUPABASE_CONFIG_MESSAGE);
      }
      throw error;
    }

    // Profile creation is handled by a database trigger (handle_new_user).
  };

  const signIn = async (email: string, password: string) => {
    if (hasInvalidSupabaseConfig) {
      throw new Error(INVALID_SUPABASE_CONFIG_MESSAGE);
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error(INVALID_SUPABASE_CONFIG_MESSAGE);
      }
      throw error;
    }
  };

  const signOut = async () => {
    console.log('Signing out...');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
    } catch (error) {
      console.error('Unexpected error signing out:', error);
    } finally {
      // Clear local state immediately
      console.log('Clearing local state');
      setProfile(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
