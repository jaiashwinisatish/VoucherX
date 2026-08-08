import { supabase } from '../lib/supabase';

/**
 * Service layer for transaction-related operations.
 * Handles purchases, escrow, and transaction history.
 */
export const transactionService = {
  /**
   * Create a purchase transaction (starts in 'pending' status).
   */
  async createPurchase(voucherId: string, sellerId: string, amount: number) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        buyer_id: user.id,
        seller_id: sellerId,
        voucher_id: voucherId,
        amount,
        status: 'pending',
        payment_method: 'escrow',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update a transaction status (e.g., escrow → completed → refunded).
   */
  async updateTransactionStatus(
    transactionId: string,
    status: 'escrow' | 'completed' | 'refunded' | 'disputed'
  ) {
    const { data, error } = await supabase
      .from('transactions')
      .update({
        status,
        completed_at: status === 'completed' ? new Date().toISOString() : null,
      })
      .eq('id', transactionId)
      .select()
      .single();

    if (error) throw error;

    // If completed, reveal voucher code to buyer
    if (status === 'completed') {
      await supabase.rpc('reveal_voucher_code', {
        p_voucher_id: data.voucher_id,
        p_buyer_id: data.buyer_id,
      });
    }

    return data;
  },

  /**
   * Get all transactions for the current user (as buyer or seller).
   */
  async getUserTransactions(userId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select(
        `*,
        vouchers(brand_name, category),
        buyer:profiles!buyer_id(full_name),
        seller:profiles!seller_id(full_name)`
      )
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};
