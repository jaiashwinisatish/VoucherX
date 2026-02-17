import { User } from '../types';
import { supabase } from '../lib/supabase';

export async function fetchProfile(userId: string): Promise<User | null> {
  console.log('Fetching profile for user ID:', userId);
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    console.log('Profile data fetched:', data);
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}
