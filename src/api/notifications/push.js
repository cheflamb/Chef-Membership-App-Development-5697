// Web Push notification service
import webpush from 'web-push';

// Configure VAPID keys for web push
webpush.setVapidDetails(
  'mailto:support@successfulchefbrigade.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subscription, payload, options = {} } = req.body;

    const pushPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: '/chef-icon.svg',
      badge: '/chef-icon.svg',
      data: payload.data || {},
      actions: payload.actions || [],
      ...options
    });

    const result = await webpush.sendNotification(
      subscription,
      pushPayload,
      options
    );

    res.status(200).json({ 
      success: true, 
      result: 'Push notification sent' 
    });
  } catch (error) {
    console.error('Push notification error:', error);
    res.status(500).json({ 
      error: 'Failed to send push notification',
      details: error.message 
    });
  }
}

// Push notification templates
export const pushTemplates = {
  newContent: (title, type) => ({
    title: '📚 New Content Available!',
    body: `${title} is now available in your ${type === 'course' ? 'library' : 'resources'}.`,
    actions: [
      { action: 'view', title: 'View Now' },
      { action: 'later', title: 'Remind Later' }
    ]
  }),

  liveEvent: (eventTitle, minutesUntil) => ({
    title: '📺 Live Session Alert',
    body: `${eventTitle} starts in ${minutesUntil} minutes!`,
    actions: [
      { action: 'join', title: 'Join Now' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  }),

  dailyReminder: (streak) => ({
    title: '📝 Daily Reflection Time',
    body: `Continue your ${streak}-day journal streak with today's leadership prompt.`,
    actions: [
      { action: 'journal', title: 'Open Journal' },
      { action: 'skip', title: 'Skip Today' }
    ]
  }),

  achievement: (badgeName) => ({
    title: '🏆 Achievement Unlocked!',
    body: `Congratulations! You've earned the ${badgeName} badge.`,
    actions: [
      { action: 'view', title: 'View Badge' },
      { action: 'share', title: 'Share' }
    ]
  })
};

// Service Worker for handling push notifications
export const serviceWorkerCode = `
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: data.icon || '/chef-icon.svg',
      badge: data.badge || '/chef-icon.svg',
      data: data.data,
      actions: data.actions,
      requireInteraction: data.requireInteraction || false,
      silent: data.silent || false
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'view' || event.action === 'join') {
    event.waitUntil(
      clients.openWindow('/my-chefcoat')
    );
  } else if (event.action === 'journal') {
    event.waitUntil(
      clients.openWindow('/journal')
    );
  }
});
`;