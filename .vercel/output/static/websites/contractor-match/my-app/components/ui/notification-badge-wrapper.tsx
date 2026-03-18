'use client'

import * as React from 'react'
import { NotificationBadge, Notification, useNotifications } from './notification-badge'
import { createClient } from '@/lib/supabase/client'

interface NotificationBadgeWrapperProps {
  initialNotifications?: Notification[]
  userId: string
  className?: string
}

export function NotificationBadgeWrapper({
  initialNotifications = [],
  userId,
  className,
}: NotificationBadgeWrapperProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, addNotification } = useNotifications()
  const supabase = createClient()

  React.useEffect(() => {
    // Load initial notifications
    if (initialNotifications.length > 0) {
      initialNotifications.forEach((n) => addNotification(n))
    }

    // Subscribe to real-time notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification
          addNotification(newNotification)
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [userId, initialNotifications, addNotification, supabase])

  const handleMarkAsRead = async (id: string) => {
    // Optimistic update
    markAsRead(id)
    
    // Persist to server
    await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('id', id)
  }

  const handleMarkAllAsRead = async () => {
    // Optimistic update
    markAllAsRead()
    
    // Persist to server
    await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('read', false)
  }

  const handleDismiss = async (id: string) => {
    await supabase
      .from('notifications')
      .delete()
      .eq('id', id)
  }

  const handleNotificationClick = (notification: Notification) => {
    if (notification.action_url) {
      window.location.href = notification.action_url
    }
  }

  return (
    <NotificationBadge
      notifications={notifications}
      onMarkAsRead={handleMarkAsRead}
      onMarkAllAsRead={handleMarkAllAsRead}
      onDismiss={handleDismiss}
      onNotificationClick={handleNotificationClick}
      className={className}
    />
  )
}
