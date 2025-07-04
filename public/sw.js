// Service Worker for handling push notifications
self.addEventListener('push', function(event) {
  console.log('Push event received:', event);
  
  if (event.data) {
    const data = event.data.json();
    console.log('Push notification data:', data);
    
    const options = {
      body: data.body,
      icon: data.icon || '/chef-icon.svg',
      badge: data.badge || '/chef-icon.svg',
      data: data.data || {},
      actions: data.actions || [],
      requireInteraction: data.requireInteraction || false,
      silent: data.silent || false,
      tag: data.tag || 'brigade-notification',
      timestamp: Date.now()
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  // Handle different action types
  if (event.action) {
    switch (event.action) {
      case 'view':
      case 'join':
        event.waitUntil(
          clients.openWindow(event.notification.data.url || '/my-chefcoat')
        );
        break;
      case 'journal':
        event.waitUntil(
          clients.openWindow('/journal')
        );
        break;
      case 'dismiss':
        // Just close the notification
        break;
      default:
        event.waitUntil(
          clients.openWindow('/my-chefcoat')
        );
    }
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/my-chefcoat')
    );
  }
});

self.addEventListener('notificationclose', function(event) {
  console.log('Notification closed:', event);
  // Track notification dismissals if needed
});

// Handle background sync for offline notifications
self.addEventListener('sync', function(event) {
  if (event.tag === 'notification-sync') {
    event.waitUntil(
      // Sync pending notifications when back online
      syncPendingNotifications()
    );
  }
});

async function syncPendingNotifications() {
  // This would sync any pending notifications that couldn't be sent while offline
  console.log('Syncing pending notifications...');
}