import { createContext } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from '../types';

export interface AuthContextType {
  user: SupabaseUser | null;
  profile: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
