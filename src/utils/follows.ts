import { supabase } from '../lib/supabase';
import { Follow, User } from '../types';

/**
 * Check if current user is following a target user
 */
export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking follow status:', error);
    return false;
  }
}

/**
 * Follow a user
 */
export async function followUser(followerId: string, followingId: string): Promise<boolean> {
  if (followerId === followingId) {
    console.error('Cannot follow yourself');
    return false;
  }

  try {
    const { error } = await supabase
      .from('follows')
      .insert({
        follower_id: followerId,
        following_id: followingId,
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error following user:', error);
    return false;
  }
}

/**
 * Unfollow a user
 */
export async function unfollowUser(followerId: string, followingId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return false;
  }
}

/**
 * Get followers for a user
 */
export async function getFollowers(userId: string): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from('follows')
      .select(`
        follower:profiles!follows_follower_id_fkey(*)
      `)
      .eq('following_id', userId);

    if (error) throw error;
    return (data || []).map((item: any) => item.follower) as User[];
  } catch (error) {
    console.error('Error fetching followers:', error);
    return [];
  }
}

/**
 * Get users that a user is following
 */
export async function getFollowing(userId: string): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from('follows')
      .select(`
        following:profiles!follows_following_id_fkey(*)
      `)
      .eq('follower_id', userId);

    if (error) throw error;
    return (data || []).map((item: any) => item.following) as User[];
  } catch (error) {
    console.error('Error fetching following:', error);
    return [];
  }
}
