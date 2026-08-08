/**
 * Payment Service
 *
 * Integrates with Stripe for voucher purchases.
 * Provides a checkout session flow:
 *   1. Create a Stripe Checkout session via Edge Function / API route
 *   2. Redirect user to Stripe's hosted checkout
 *   3. Handle success / cancellation callbacks
 *
 * When VITE_STRIPE_PUBLISHABLE_KEY is not set, the service falls back to a
 * simulated payment flow for local development / demo purposes.
 */

import { supabase } from '../lib/supabase';
import { Voucher } from '../types';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '';

export const isStripeConfigured = Boolean(STRIPE_PUBLISHABLE_KEY);

export type PaymentStatus = 'idle' | 'processing' | 'success' | 'error' | 'cancelled';

export interface PaymentResult {
  status: PaymentStatus;
  transactionId?: string;
  message?: string;
}

export interface CheckoutDetails {
  voucher: Voucher;
  buyerEmail: string;
}

/**
 * Create a Stripe Checkout Session via the Supabase Edge Function and redirect.
 *
 * If Stripe is not configured the function simulates a successful payment after
 * a short delay so the rest of the UI can be exercised in dev/demo mode.
 */
export async function createCheckoutSession(
  details: CheckoutDetails,
): Promise<PaymentResult> {
  const { voucher, buyerEmail } = details;

  /* ── Demo / fallback mode ─────────────────────────────────────────── */
  if (!isStripeConfigured) {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1500));

    const transactionId = `demo_txn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    return {
      status: 'success',
      transactionId,
      message: `Demo payment successful for ${voucher.brand_name} voucher ($${voucher.selling_price}).`,
    };
  }

  /* ── Real Stripe Checkout ─────────────────────────────────────────── */
  try {
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        voucherId: voucher.id,
        amount: Math.round(voucher.selling_price * 100), // cents
        currency: 'usd',
        buyerEmail,
        brandName: voucher.brand_name,
        description: voucher.description ?? `${voucher.brand_name} voucher – ${voucher.discount_percentage}% off`,
        successUrl: `${window.location.origin}?payment=success&voucher=${voucher.id}`,
        cancelUrl: `${window.location.origin}?payment=cancelled`,
      },
    });

    if (error) throw error;

    // Redirect to Stripe Checkout
    if (data?.url) {
      window.location.href = data.url;
      return { status: 'processing', message: 'Redirecting to Stripe…' };
    }

    throw new Error('No checkout URL returned from server.');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Payment failed. Please try again.';
    return { status: 'error', message };
  }
}

/**
 * Verify a completed payment against the backend.
 *
 * Called after the user returns from Stripe Checkout with a session_id query
 * parameter. In demo mode it always returns success.
 */
export async function verifyPayment(sessionId: string): Promise<PaymentResult> {
  if (!isStripeConfigured) {
    return { status: 'success', transactionId: sessionId, message: 'Demo payment verified.' };
  }

  try {
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: { sessionId },
    });

    if (error) throw error;

    return {
      status: data?.paid ? 'success' : 'error',
      transactionId: data?.transactionId,
      message: data?.paid ? 'Payment verified successfully.' : 'Payment not confirmed.',
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not verify payment.';
    return { status: 'error', message };
  }
}

/**
 * Request a refund for a transaction.
 */
export async function requestRefund(transactionId: string): Promise<PaymentResult> {
  if (!isStripeConfigured) {
    await new Promise((r) => setTimeout(r, 1000));
    return { status: 'success', transactionId, message: 'Demo refund processed.' };
  }

  try {
    const { data, error } = await supabase.functions.invoke('request-refund', {
      body: { transactionId },
    });

    if (error) throw error;

    return {
      status: data?.refunded ? 'success' : 'error',
      transactionId,
      message: data?.refunded ? 'Refund processed successfully.' : 'Refund request failed.',
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Refund request failed.';
    return { status: 'error', message };
  }
}
