import { supabase } from '../lib/supabase';
import { Review, Trade } from '../types';

/**
 * Check if a user can review a trade
 * - Trade must be completed
 * - User must be part of the trade
 * - User cannot review themselves
 * - User cannot review the same trade twice
 */
export async function canReviewTrade(tradeId: string, userId: string): Promise<{
  canReview: boolean;
  reason?: string;
  trade?: Trade;
}> {
  try {
    // Fetch the trade
    const { data: trade, error: tradeError } = await supabase
      .from('trades')
      .select('*')
      .eq('id', tradeId)
      .maybeSingle();

    if (tradeError || !trade) {
      return { canReview: false, reason: 'Trade not found' };
    }

    // Check if trade is completed
    if (trade.status !== 'completed') {
      return { canReview: false, reason: 'Trade must be completed before reviewing' };
    }

    // Check if user is part of the trade
    if (trade.initiator_id !== userId && trade.recipient_id !== userId) {
      return { canReview: false, reason: 'You are not part of this trade' };
    }

    // Determine who to rate (the other party)
    const ratedUserId = trade.initiator_id === userId ? trade.recipient_id : trade.initiator_id;

    // Check if user already reviewed this trade
    const { data: existingReview } = await supabase
      .from('ratings')
      .select('id')
      .eq('trade_id', tradeId)
      .eq('rater_id', userId)
      .maybeSingle();

    if (existingReview) {
      return { canReview: false, reason: 'You have already reviewed this trade' };
    }

    return { canReview: true, trade: trade as Trade };
  } catch (error) {
    console.error('Error checking review eligibility:', error);
    return { canReview: false, reason: 'Error checking review eligibility' };
  }
}

/**
 * Create a review
 */
export async function createReview(
  tradeId: string,
  raterId: string,
  ratedId: string,
  rating: number,
  review?: string
): Promise<boolean> {
  try {
    // Validate rating
    if (rating < 1 || rating > 5) {
      console.error('Rating must be between 1 and 5');
      return false;
    }

    const { error } = await supabase
      .from('ratings')
      .insert({
        trade_id: tradeId,
        rater_id: raterId,
        rated_id: ratedId,
        rating,
        review: review || null,
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error creating review:', error);
    return false;
  }
}

/**
 * Get reviews for a user
 */
export async function getUserReviews(userId: string): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from('ratings')
      .select(`
        *,
        rater:profiles!ratings_rater_id_fkey(*),
        trade:trades(*)
      `)
      .eq('rated_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Review[];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}
