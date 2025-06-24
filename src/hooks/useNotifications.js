import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  // Initialize notifications on mount
  useEffect(() => {
    if (user) {
      // Load existing notifications from localStorage
      const savedNotifications = localStorage.getItem(`notifications_${user.id}`);
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
        setUnreadCount(parsed.filter(n => !n.read).length);
      }

      // Add some demo notifications for new users
      if (!savedNotifications) {
        const welcomeNotifications = [
          {
            id: Date.now(),
            title: 'Welcome to ChefConnect! 🎉',
            message: 'Start exploring premium recipes and connect with fellow chefs.',
            type: 'welcome',
            timestamp: new Date().toISOString(),
            read: false,
            action: { type: 'navigate', path: '/feed' }
          },
          {
            id: Date.now() + 1,
            title: 'New Masterclass Available',
            message: 'Chef Isabella is hosting "Advanced Pastry Techniques" tomorrow at 3 PM.',
            type: 'masterclass',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            read: false,
            action: { type: 'navigate', path: '/feed' }
          }
        ];
        
        if (user.tier !== 'basic') {
          welcomeNotifications.push({
            id: Date.now() + 2,
            title: 'Premium Content Unlocked! 🔓',
            message: 'You now have access to exclusive recipes and live sessions.',
            type: 'premium',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            read: false,
            action: { type: 'navigate', path: '/feed' }
          });
        }

        setNotifications(welcomeNotifications);
        setUnreadCount(welcomeNotifications.length);
        localStorage.setItem(`notifications_${user.id}`, JSON.stringify(welcomeNotifications));
      }
    }
  }, [user]);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') {
      return 'unsupported';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  // Send browser notification
  const sendBrowserNotification = useCallback((title, options = {}) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/chef-icon.svg',
        badge: '/chef-icon.svg',
        ...options
      });

      notification.onclick = () => {
        window.focus();
        if (options.onClick) {
          options.onClick();
        }
        notification.close();
      };

      // Auto close after 5 seconds
      setTimeout(() => notification.close(), 5000);
    }
  }, []);

  // Add new notification
  const addNotification = useCallback((notification) => {
    if (!user) return;

    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, 50); // Keep only last 50
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
      return updated;
    });

    setUnreadCount(prev => prev + 1);

    // Send browser notification if permission granted
    if (Notification.permission === 'granted') {
      sendBrowserNotification(notification.title, {
        body: notification.message,
        tag: notification.type,
        onClick: notification.action?.onClick
      });
    }
  }, [user, sendBrowserNotification]);

  // Mark notification as read
  const markAsRead = useCallback((notificationId) => {
    if (!user) return;

    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
      return updated;
    });

    setUnreadCount(prev => Math.max(0, prev - 1));
  }, [user]);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    if (!user) return;

    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
      return updated;
    });

    setUnreadCount(0);
  }, [user]);

  // Clear all notifications
  const clearAll = useCallback(() => {
    if (!user) return;

    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem(`notifications_${user.id}`);
  }, [user]);

  // Simulate real-time notifications (in real app, this would come from websocket/server)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const randomEvents = [
        {
          title: 'New Recipe Posted! 🍳',
          message: 'Chef Marcus shared "Perfect Beef Wellington" technique',
          type: 'recipe'
        },
        {
          title: 'Live Session Starting Soon 📺',
          message: 'Advanced Knife Skills masterclass begins in 15 minutes',
          type: 'live'
        },
        {
          title: 'Someone liked your post! ❤️',
          message: 'Your risotto technique post received 5 new likes',
          type: 'social'
        },
        {
          title: 'Weekly Challenge! 🏆',
          message: 'This week: Create the perfect French omelette',
          type: 'challenge'
        }
      ];

      // 20% chance every 30 seconds to get a notification
      if (Math.random() < 0.2) {
        const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
        addNotification(event);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user, addNotification]);

  return {
    notifications,
    unreadCount,
    permission,
    requestPermission,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    sendBrowserNotification
  };
};