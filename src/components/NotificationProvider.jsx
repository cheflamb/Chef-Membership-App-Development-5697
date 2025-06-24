import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import supabase from '../lib/supabase';

const NotificationContext = createContext();

export const useNotificationProvider = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationProvider must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      enabled: true,
      newContent: true,
      liveEvents: true,
      communityUpdates: false,
      marketing: false,
      weeklyDigest: true
    },
    sms: {
      enabled: false,
      urgentUpdates: true,
      liveEventReminders: true,
      emergencyNotifications: true
    },
    push: {
      enabled: false,
      newContent: true,
      liveEvents: true,
      communityActivity: false,
      dailyReminders: true
    }
  });

  useEffect(() => {
    if (user) {
      loadNotificationSettings();
    }
  }, [user]);

  const loadNotificationSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_settings_chef_brigade')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading notification settings:', error);
        return;
      }

      if (data) {
        setNotificationSettings({
          email: data.email_settings || notificationSettings.email,
          sms: data.sms_settings || notificationSettings.sms,
          push: data.push_settings || notificationSettings.push
        });
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const updateNotificationSettings = async (newSettings) => {
    try {
      const { error } = await supabase
        .from('notification_settings_chef_brigade')
        .upsert({
          user_id: user.id,
          email_settings: newSettings.email,
          sms_settings: newSettings.sms,
          push_settings: newSettings.push,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setNotificationSettings(newSettings);
      return { success: true };
    } catch (error) {
      console.error('Error updating notification settings:', error);
      return { success: false, error: error.message };
    }
  };

  const sendNotification = async (notification) => {
    try {
      const { error } = await supabase
        .from('notifications_queue_chef_brigade')
        .insert([{
          user_id: notification.userId || user.id,
          type: notification.type,
          channel: notification.channel, // 'email', 'sms', 'push', 'in_app'
          title: notification.title,
          message: notification.message,
          data: notification.data || {},
          scheduled_for: notification.scheduledFor || new Date().toISOString(),
          priority: notification.priority || 'normal',
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      // If it's an immediate notification, trigger processing
      if (!notification.scheduledFor) {
        await processNotification(notification);
      }

      return { success: true };
    } catch (error) {
      console.error('Error sending notification:', error);
      return { success: false, error: error.message };
    }
  };

  const processNotification = async (notification) => {
    // This would typically be handled by a background service
    // For demo purposes, we'll simulate the different notification types
    
    if (notification.channel === 'email' && notificationSettings.email.enabled) {
      await sendEmailNotification(notification);
    }
    
    if (notification.channel === 'sms' && notificationSettings.sms.enabled) {
      await sendSMSNotification(notification);
    }
    
    if (notification.channel === 'push' && notificationSettings.push.enabled) {
      await sendPushNotification(notification);
    }
  };

  const sendEmailNotification = async (notification) => {
    try {
      // In a real app, this would call your email service (SendGrid, AWS SES, etc.)
      const emailData = {
        to: user.email,
        from: 'noreply@successfulchefbrigade.com',
        subject: notification.title,
        html: generateEmailTemplate(notification),
        text: notification.message
      };

      console.log('Email notification would be sent:', emailData);
      
      // Simulate API call to email service
      // await fetch('/api/send-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(emailData)
      // });

      return { success: true };
    } catch (error) {
      console.error('Error sending email notification:', error);
      return { success: false, error: error.message };
    }
  };

  const sendSMSNotification = async (notification) => {
    try {
      // In a real app, this would call your SMS service (Twilio, AWS SNS, etc.)
      const smsData = {
        to: user.phone,
        from: '+1234567890', // Your Twilio number
        body: `${notification.title}\n\n${notification.message}\n\nReply STOP to unsubscribe`
      };

      console.log('SMS notification would be sent:', smsData);
      
      // Simulate API call to SMS service
      // await fetch('/api/send-sms', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(smsData)
      // });

      return { success: true };
    } catch (error) {
      console.error('Error sending SMS notification:', error);
      return { success: false, error: error.message };
    }
  };

  const sendPushNotification = async (notification) => {
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/chef-icon.svg',
          badge: '/chef-icon.svg',
          tag: notification.type,
          data: notification.data
        });
      }

      // For web push notifications to work across devices, you'd typically use
      // a service worker and push subscription
      console.log('Push notification sent:', notification);
      
      return { success: true };
    } catch (error) {
      console.error('Error sending push notification:', error);
      return { success: false, error: error.message };
    }
  };

  const generateEmailTemplate = (notification) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${notification.title}</title>
          <style>
            body { font-family: 'Lato', Arial, sans-serif; margin: 0; padding: 0; background-color: #f8f8f8; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #8b0000 0%, #dc2626 100%); padding: 20px; text-align: center; }
            .header h1 { color: white; margin: 0; font-family: 'Montserrat', sans-serif; }
            .content { padding: 30px; }
            .footer { background-color: #2f2f2f; color: white; padding: 20px; text-align: center; font-size: 12px; }
            .btn { background-color: #8b0000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>The Successful Chef Brigade</h1>
            </div>
            <div class="content">
              <h2>${notification.title}</h2>
              <p>${notification.message}</p>
              ${notification.data?.actionUrl ? `<a href="${notification.data.actionUrl}" class="btn">Take Action</a>` : ''}
            </div>
            <div class="footer">
              <p>© 2024 The Successful Chef Brigade. All rights reserved.</p>
              <p>You're receiving this because you're a member of The Brigade.</p>
              <p><a href="#" style="color: #d3a625;">Unsubscribe</a> | <a href="#" style="color: #d3a625;">Update Preferences</a></p>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const sendBulkNotification = async (notification, userIds) => {
    try {
      const notifications = userIds.map(userId => ({
        user_id: userId,
        type: notification.type,
        channel: notification.channel,
        title: notification.title,
        message: notification.message,
        data: notification.data || {},
        scheduled_for: notification.scheduledFor || new Date().toISOString(),
        priority: notification.priority || 'normal',
        created_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('notifications_queue_chef_brigade')
        .insert(notifications);

      if (error) throw error;

      return { success: true, count: notifications.length };
    } catch (error) {
      console.error('Error sending bulk notification:', error);
      return { success: false, error: error.message };
    }
  };

  const scheduleRecurringNotification = async (notification, schedule) => {
    try {
      const { error } = await supabase
        .from('recurring_notifications_chef_brigade')
        .insert([{
          user_id: notification.userId || user.id,
          type: notification.type,
          channel: notification.channel,
          title: notification.title,
          message: notification.message,
          data: notification.data || {},
          schedule_pattern: schedule.pattern, // 'daily', 'weekly', 'monthly'
          schedule_time: schedule.time,
          schedule_days: schedule.days, // for weekly notifications
          is_active: true,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error scheduling recurring notification:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    notificationSettings,
    updateNotificationSettings,
    sendNotification,
    sendBulkNotification,
    scheduleRecurringNotification,
    processNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;