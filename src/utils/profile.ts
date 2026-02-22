import { supabase } from '../lib/supabase';
import { User } from '../types';

/**
 * Fetch a public user profile by username
 */
export async function fetchPublicProfile(username: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (error) throw error;
    return data as User | null;
  } catch (error) {
    console.error('Error fetching public profile:', error);
    return null;
  }
}

/**
 * Get active listings count for a user
 */
export async function getUserActiveListings(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .rpc('get_user_active_listings', { user_id: userId });

    if (error) throw error;
    return data || 0;
  } catch (error) {
    console.error('Error fetching active listings:', error);
    // Fallback: query directly
    const { count } = await supabase
      .from('vouchers')
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', userId)
      .eq('is_verified', true)
      .in('status', ['verified', 'active']);
    
    return count || 0;
  }
}

/**
 * Upload avatar to Supabase Storage
 */
export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateProfile(userId: string, updates: {
  full_name?: string;
  username?: string;
  bio?: string;
  avatar_url?: string;
}): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating profile:', error);
    return false;
  }
}
