import { useEffect } from 'react';
import { useSocketEvent } from './useSocket.js';

export const useNotifications = (enabled = true) => {
  useEffect(() => {
    if (enabled && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [enabled]);

  const showNotification = (title, options = {}) => {
    if (enabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
    }
  };

  // Listen for new messages and show notifications
  useSocketEvent('new_message', (message) => {
    if (document.hidden) {
      showNotification(`New message from ${message.username}`, {
        body: message.text,
        tag: message.roomId
      });
    }
  });

  useSocketEvent('user_mentioned', (data) => {
    showNotification(`${data.mentionedBy} mentioned you`, {
      body: data.message
    });
  });

  return { showNotification };
};