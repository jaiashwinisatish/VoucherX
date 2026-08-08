import { supabase } from '../lib/supabase';
import { Voucher } from '../types';

/**
 * Service layer for voucher-related CRUD operations.
 * Replaces hardcoded mock data with real Supabase queries.
 */
export const voucherService = {
  /**
   * Fetch all verified vouchers for the marketplace.
   */
  async getMarketplaceVouchers(filters?: {
    category?: string;
    searchTerm?: string;
    sortBy?: string;
    limit?: number;
    offset?: number;
  }): Promise<Voucher[]> {
    let query = supabase
      .from('vouchers')
      .select('*, seller:profiles!seller_id(full_name, username, rating, total_trades)')
      .eq('is_verified', true)
      .in('status', ['active', 'verified']);

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    if (filters?.searchTerm) {
      query = query.or(
        `brand_name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`
      );
    }

    switch (filters?.sortBy) {
      case 'discount':
        query = query.order('discount_percentage', { ascending: false });
        break;
      case 'expiry':
        query = query.order('expiry_date', { ascending: true });
        break;
      case 'popular':
        query = query.order('views', { ascending: false });
        break;
      case 'price_low':
        query = query.order('selling_price', { ascending: true });
        break;
      case 'price_high':
        query = query.order('selling_price', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    if (filters?.limit) {
      query = query.range(
        filters.offset || 0,
        (filters.offset || 0) + filters.limit - 1
      );
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Voucher[];
  },

  /**
   * Create a new voucher listing.
   */
  async createVoucher(voucher: {
    brand_name: string;
    category: string;
    original_value: number;
    selling_price: number;
    expiry_date: string;
    description?: string;
    voucher_code: string;
    proof_file?: File;
  }): Promise<Voucher> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Upload proof if provided
    let proof_url: string | null = null;
    if (voucher.proof_file) {
      const fileName = `${user.id}/${Date.now()}_${voucher.proof_file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('voucher-proofs')
        .upload(fileName, voucher.proof_file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('voucher-proofs').getPublicUrl(fileName);

      proof_url = publicUrl;
    }

    // Create voucher
    const { data, error } = await supabase
      .from('vouchers')
      .insert({
        seller_id: user.id,
        brand_name: voucher.brand_name,
        category: voucher.category,
        original_value: voucher.original_value,
        selling_price: voucher.selling_price,
        expiry_date: voucher.expiry_date,
        description: voucher.description,
        voucher_code: voucher.voucher_code,
        proof_url,
        status: 'pending_verification',
        is_verified: false,
      })
      .select()
      .single();

    if (error) throw error;

    // Store encrypted voucher code in separate table
    const { data: encryptedData } = await supabase.rpc('encrypt_voucher_code', {
      code: voucher.voucher_code,
    });

    if (encryptedData) {
      await supabase.from('voucher_codes').insert({
        voucher_id: data.id,
        encrypted_code: encryptedData,
      });
    }

    return data as Voucher;
  },

  /**
   * Get a user's own voucher listings.
   */
  async getUserVouchers(userId: string): Promise<Voucher[]> {
    const { data, error } = await supabase
      .from('vouchers')
      .select('*')
      .eq('seller_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Voucher[];
  },

  /**
   * Increment the view count for a voucher.
   */
  async incrementViews(voucherId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_voucher_views', {
      p_voucher_id: voucherId,
    });

    if (error) console.error('Failed to increment views:', error);
  },

  /**
   * Get a single voucher with seller details.
   */
  async getVoucherById(id: string) {
    const { data, error } = await supabase
      .from('vouchers')
      .select('*, seller:profiles!seller_id(full_name, username, rating, total_trades)')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Increment views in the background
    this.incrementViews(id);

    return data;
  },

  /**
   * Delete a voucher (only if unsold).
   */
  async deleteVoucher(id: string): Promise<void> {
    const { error } = await supabase.from('vouchers').delete().eq('id', id);

    if (error) throw error;
  },
};
