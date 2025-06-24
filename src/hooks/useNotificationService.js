import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotificationProvider } from '../components/NotificationProvider';

export const useNotificationService = () => {
  const { user } = useAuth();
  const { sendNotification, sendBulkNotification } = useNotificationProvider();
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if browser supports notifications
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
  }, []);

  const requestPermission = async () => {
    if (!isSupported) return 'unsupported';
    
    if (Notification.permission === 'granted') return 'granted';
    if (Notification.permission === 'denied') return 'denied';
    
    const permission = await Notification.requestPermission();
    return permission;
  };

  const registerServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) return null;
    
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      return registration;
    } catch (error) {
      console.error('Service worker registration failed:', error);
      return null;
    }
  };

  const subscribeToPush = async () => {
    if (!isSupported) return null;
    
    const registration = await registerServiceWorker();
    if (!registration) return null;
    
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY)
      });
      
      // Save subscription to your backend
      await saveSubscription(subscription);
      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  };

  const saveSubscription = async (subscription) => {
    try {
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          subscription
        })
      });
    } catch (error) {
      console.error('Failed to save push subscription:', error);
    }
  };

  // Notification sending methods
  const sendWelcomeEmail = async (userData) => {
    return await sendNotification({
      userId: userData.id,
      type: 'welcome',
      channel: 'email',
      title: 'Welcome to The Successful Chef Brigade!',
      message: `Hi ${userData.name}, welcome to your leadership journey!`,
      data: {
        templateId: 'welcome',
        dashboardUrl: `${window.location.origin}/my-chefcoat`
      }
    });
  };

  const sendLiveEventReminder = async (eventData, userIds, minutesBefore = 15) => {
    const title = `${eventData.title} starting in ${minutesBefore} minutes!`;
    const message = `Join the live session: ${eventData.title}`;
    
    // Send email reminders
    await sendBulkNotification({
      type: 'live_event_reminder',
      channel: 'email',
      title,
      message,
      data: {
        templateId: 'live_event_reminder',
        eventTitle: eventData.title,
        timeUntilStart: minutesBefore,
        joinUrl: eventData.joinUrl
      }
    }, userIds);
    
    // Send push notifications
    await sendBulkNotification({
      type: 'live_event_reminder',
      channel: 'push',
      title: '📺 Live Session Starting Soon!',
      message: title,
      data: {
        eventId: eventData.id,
        joinUrl: eventData.joinUrl
      }
    }, userIds);
    
    // Send SMS for urgent reminders (5 minutes before)
    if (minutesBefore <= 5) {
      await sendBulkNotification({
        type: 'live_event_urgent',
        channel: 'sms',
        title: 'Live Session Alert',
        message: `🚨 LIVE NOW: ${eventData.title} starting in ${minutesBefore} mins! Join: ${eventData.joinUrl}`,
        priority: 'urgent'
      }, userIds);
    }
  };

  const sendContentReleaseNotification = async (contentData, userIds) => {
    return await sendBulkNotification({
      type: 'content_release',
      channel: 'email',
      title: 'New Leadership Content Available!',
      message: `${contentData.title} is now available in your learning library.`,
      data: {
        templateId: 'content_release',
        contentTitle: contentData.title,
        contentUrl: contentData.url,
        contentType: contentData.type
      }
    }, userIds);
  };

  const sendDailyJournalReminder = async (userData, streak) => {
    // Send push notification first
    await sendNotification({
      userId: userData.id,
      type: 'daily_reminder',
      channel: 'push',
      title: '📝 Daily Reflection Time',
      message: `Continue your ${streak}-day journal streak!`,
      data: { streak }
    });
    
    // Send SMS if enabled and it's been more than 2 days without journaling
    if (streak === 0) {
      await sendNotification({
        userId: userData.id,
        type: 'journal_reminder',
        channel: 'sms',
        title: 'Journal Reminder',
        message: `Hi ${userData.name}! 🌅 Take 5 minutes today to reflect on your leadership growth.`,
        priority: 'normal'
      });
    }
  };

  const sendAchievementNotification = async (userData, achievement) => {
    // Send across all enabled channels
    const notifications = [
      {
        channel: 'email',
        title: `🏆 Achievement Unlocked: ${achievement.name}!`,
        message: `Congratulations ${userData.name}! You've earned the ${achievement.name} badge.`,
        data: {
          achievementId: achievement.id,
          badgeUrl: achievement.badgeUrl
        }
      },
      {
        channel: 'push',
        title: '🏆 Achievement Unlocked!',
        message: `You've earned the ${achievement.name} badge!`,
        data: {
          achievementId: achievement.id,
          action: 'view_achievement'
        }
      }
    ];
    
    for (const notification of notifications) {
      await sendNotification({
        userId: userData.id,
        type: 'achievement',
        ...notification
      });
    }
  };

  // Utility function for VAPID key conversion
  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  return {
    isSupported,
    requestPermission,
    subscribeToPush,
    sendWelcomeEmail,
    sendLiveEventReminder,
    sendContentReleaseNotification,
    sendDailyJournalReminder,
    sendAchievementNotification
  };
};