import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Session check on mount:', session?.user?.id);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      (async () => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const createProfileIfNotExists = async (userId: string, email: string, fullName?: string) => {
    try {
      const username = fullName
        ? fullName.toLowerCase().replace(/\s+/g, '_') + '_' + userId.slice(0, 4)
        : email.split('@')[0] + '_' + userId.slice(0, 4);
      
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          id: userId,
          full_name: fullName || 'New User',
          username: username,
          voucher_coins: 100
        }])
        .select()
        .single();

      if (error && error.code !== '23505') { // 23505 is unique violation, which is ok
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      return null;
    }
  };

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
      
      // If profile doesn't exist, create it
      if (!data) {
        console.log('Profile not found, creating one...');
        const user = (await supabase.auth.getUser()).data.user;
        const createdProfile = await createProfileIfNotExists(userId, user?.email || '', user?.user_metadata?.full_name);
        setProfile(createdProfile || null);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) throw error;

    // Profile creation is now handled by a database trigger (handle_new_user)
    // This ensures the 100 coins are always credited and username is generated.
    // If trigger fails, the profile will be created on first fetch
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
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
