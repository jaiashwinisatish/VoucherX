import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Voucher } from '../types';

/**
 * Hook for real-time voucher updates in the marketplace.
 * Subscribes to Supabase Realtime for INSERT, UPDATE, and DELETE events
 * on the vouchers table, keeping the UI in sync automatically.
 */
export function useRealtimeVouchers(initialVouchers: Voucher[]) {
  const [vouchers, setVouchers] = useState<Voucher[]>(initialVouchers);

  // Sync when initialVouchers changes (e.g., after a refetch)
  useEffect(() => {
    setVouchers(initialVouchers);
  }, [initialVouchers]);

  useEffect(() => {
    const channel = supabase
      .channel('marketplace-vouchers')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'vouchers',
          filter: 'is_verified=eq.true',
        },
        (payload) => {
          setVouchers((current) => [payload.new as Voucher, ...current]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'vouchers',
        },
        (payload) => {
          setVouchers((current) =>
            current.map((v) =>
              v.id === (payload.new as Voucher).id ? (payload.new as Voucher) : v
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'vouchers',
        },
        (payload) => {
          setVouchers((current) =>
            current.filter((v) => v.id !== (payload.old as { id: string }).id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return vouchers;
}
