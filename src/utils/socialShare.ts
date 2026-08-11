import { Trade, Voucher } from '../types';
import { supabase } from '../lib/supabase';

/**
 * Generate share URL for a trade
 */
export function getTradeShareUrl(tradeId: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/trade/${tradeId}`;
}

/**
 * Share to Twitter/X
 */
export function shareToTwitter(trade: Trade, vouchers?: { initiator?: Voucher; recipient?: Voucher }): void {
  const url = getTradeShareUrl(trade.id);
  const text = vouchers?.initiator && vouchers?.recipient
    ? `Check out this amazing trade on VoucherX! ${vouchers.initiator.brand_name} ↔️ ${vouchers.recipient.brand_name}`
    : `Check out this trade on VoucherX!`;
  
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(twitterUrl, '_blank', 'width=550,height=420');
  
  // Track share
  trackShare(trade.id, 'twitter');
}

/**
 * Share to LinkedIn
 */
export function shareToLinkedIn(trade: Trade, vouchers?: { initiator?: Voucher; recipient?: Voucher }): void {
  const url = getTradeShareUrl(trade.id);
  const title = vouchers?.initiator && vouchers?.recipient
    ? `VoucherX Trade: ${vouchers.initiator.brand_name} ↔️ ${vouchers.recipient.brand_name}`
    : 'VoucherX Trade';
  
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  window.open(linkedInUrl, '_blank', 'width=550,height=420');
  
  // Track share
  trackShare(trade.id, 'linkedin');
}

/**
 * Copy link to clipboard
 */
export async function copyTradeLink(tradeId: string): Promise<boolean> {
  try {
    const url = getTradeShareUrl(tradeId);
    await navigator.clipboard.writeText(url);
    
    // Track share
    trackShare(tradeId, 'copy_link');
    return true;
  } catch (error) {
    console.error('Error copying link:', error);
    return false;
  }
}

/**
 * Track share in database
 */
async function trackShare(tradeId: string, platform: 'twitter' | 'linkedin' | 'copy_link'): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('trade_shares')
      .insert({
        trade_id: tradeId,
        shared_by_id: user.id,
        share_platform: platform,
      });
  } catch (error) {
    console.error('Error tracking share:', error);
    // Don't throw - tracking is non-critical
  }
}

/**
 * Generate Open Graph metadata for a trade
 */
export function generateTradeOGMetadata(trade: Trade, vouchers?: { initiator?: Voucher; recipient?: Voucher }): {
  title: string;
  description: string;
  image?: string;
  url: string;
} {
  const url = getTradeShareUrl(trade.id);
  const title = vouchers?.initiator && vouchers?.recipient
    ? `${vouchers.initiator.brand_name} ↔️ ${vouchers.recipient.brand_name} Trade on VoucherX`
    : 'VoucherX Trade';
  
  const description = vouchers?.initiator && vouchers?.recipient
    ? `Trade ${vouchers.initiator.brand_name} voucher for ${vouchers.recipient.brand_name} on VoucherX - the smart way to exchange vouchers!`
    : 'Discover amazing voucher trades on VoucherX - trade, earn, and repeat!';

  return {
    title,
    description,
    url,
  };
}
