import { supabase } from '../lib/supabase';

/**
 * Service layer for wallet (user_vouchers) operations.
 * Manages vouchers owned by the user.
 */
export const walletService = {
  /**
   * Get all vouchers in the user's wallet.
   */
  async getWalletVouchers(userId: string) {
    const { data, error } = await supabase
      .from('user_vouchers')
      .select('*, vouchers(*)')
      .eq('user_id', userId)
      .order('acquired_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Mark a voucher as redeemed.
   */
  async redeemVoucher(userVoucherId: string) {
    const { data, error } = await supabase
      .from('user_vouchers')
      .update({
        is_redeemed: true,
        redeemed_at: new Date().toISOString(),
      })
      .eq('id', userVoucherId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get decrypted voucher code (only available after purchase).
   */
  async getVoucherCode(voucherId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('voucher_codes')
      .select('*')
      .eq('voucher_id', voucherId)
      .single();

    if (error) throw error;
    if (!data) return null;

    // Decrypt code via RPC
    const { data: decrypted } = await supabase.rpc('decrypt_voucher_code', {
      encrypted_code: data.encrypted_code,
    });

    return decrypted;
  },
};
