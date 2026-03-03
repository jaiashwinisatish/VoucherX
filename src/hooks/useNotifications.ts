import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { userService } from '../services/userService';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

/**
 * Hook for managing user notifications with real-time updates.
 * Subscribes to Supabase Realtime for new notifications and provides
 * functions to mark notifications as read.
 */
export function useNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await userService.getNotifications(userId);
      setNotifications(data as Notification[]);
      setUnreadCount((data as Notification[]).filter((n) => !n.is_read).length);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    loadNotifications();

    // Real-time subscription for new notifications
    const channel = supabase
      .channel('user-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications((current) => [newNotification, ...current]);
          setUnreadCount((c) => c + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, loadNotifications]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await userService.markNotificationRead(notificationId);
        setNotifications((current) =>
          current.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    },
    []
  );

  const markAllAsRead = useCallback(async () => {
    if (!userId) return;
    try {
      await userService.markAllNotificationsRead(userId);
      setNotifications((current) => current.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }, [userId]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refresh: loadNotifications,
  };
}
