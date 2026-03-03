import { supabase } from '../lib/supabase';

/**
 * Service layer for trade (exchange) operations.
 * Handles trade requests, acceptance, and history.
 */
export const tradeService = {
  /**
   * Create a new trade request.
   */
  async createTradeRequest(
    recipientId: string,
    initiatorVoucherId: string,
    recipientVoucherId: string
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('trades')
      .insert({
        initiator_id: user.id,
        recipient_id: recipientId,
        initiator_voucher_id: initiatorVoucherId,
        recipient_voucher_id: recipientVoucherId,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Accept a trade request.
   */
  async acceptTrade(tradeId: string) {
    const { data, error } = await supabase
      .from('trades')
      .update({ status: 'accepted' })
      .eq('id', tradeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Reject a trade request.
   */
  async rejectTrade(tradeId: string) {
    const { data, error } = await supabase
      .from('trades')
      .update({ status: 'rejected' })
      .eq('id', tradeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Cancel a trade request (initiator only).
   */
  async cancelTrade(tradeId: string) {
    const { data, error } = await supabase
      .from('trades')
      .update({ status: 'cancelled' })
      .eq('id', tradeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get all trades for the current user.
   */
  async getUserTrades(userId: string) {
    const { data, error } = await supabase
      .from('trades')
      .select(
        `*,
        initiator:profiles!initiator_id(*),
        recipient:profiles!recipient_id(*),
        initiator_voucher:vouchers!initiator_voucher_id(*),
        recipient_voucher:vouchers!recipient_voucher_id(*)`
      )
      .or(`initiator_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};
