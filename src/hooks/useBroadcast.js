import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from './useNotifications';

export const useBroadcast = () => {
  const { user } = useAuth();
  const { sendBrowserNotification } = useNotifications();
  const [broadcastHistory, setBroadcastHistory] = useState([]);
  const [dripCampaigns, setDripCampaigns] = useState([]);

  // Send immediate broadcast
  const sendBroadcast = useCallback(async (broadcastData) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get audience size
      const audienceSize = getAudienceSize(broadcastData.audience);

      // Create broadcast record
      const broadcast = {
        id: Date.now(),
        ...broadcastData,
        sentAt: new Date().toISOString(),
        sentBy: user.id,
        audienceSize,
        status: 'sent',
        deliveryStats: {
          sent: audienceSize,
          delivered: Math.floor(audienceSize * 0.98),
          opened: Math.floor(audienceSize * 0.45),
          clicked: Math.floor(audienceSize * 0.12),
          bounced: Math.floor(audienceSize * 0.02),
          unsubscribed: Math.floor(audienceSize * 0.002)
        }
      };

      // Add to history
      setBroadcastHistory(prev => [broadcast, ...prev]);

      // Send actual notifications based on type
      if (broadcastData.type === 'push') {
        sendBrowserNotification(broadcastData.title, {
          body: broadcastData.message,
          icon: '/chef-icon.svg',
          tag: 'brigade-broadcast'
        });
      } else if (broadcastData.type === 'email') {
        // In real app, this would trigger email service
        console.log('Email sent:', {
          subject: broadcastData.title,
          content: broadcastData.message,
          audience: broadcastData.audience
        });
      } else if (broadcastData.type === 'sms') {
        // In real app, this would trigger SMS service
        console.log('SMS sent:', {
          message: broadcastData.message,
          audience: broadcastData.audience
        });
      }

      // Save to localStorage
      const saved = localStorage.getItem('broadcast_history') || '[]';
      const history = JSON.parse(saved);
      history.unshift(broadcast);
      localStorage.setItem('broadcast_history', JSON.stringify(history.slice(0, 50)));

      return broadcast;
    } catch (error) {
      throw new Error('Failed to send broadcast: ' + error.message);
    }
  }, [user, sendBrowserNotification]);

  // Schedule broadcast for later
  const scheduleBroadcast = useCallback(async (broadcastData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const scheduledBroadcast = {
        id: Date.now(),
        ...broadcastData,
        scheduledAt: new Date().toISOString(),
        scheduledBy: user.id,
        status: 'scheduled',
        audienceSize: getAudienceSize(broadcastData.audience)
      };

      // In real app, this would be stored in backend with cron job
      console.log('Broadcast scheduled:', scheduledBroadcast);

      return scheduledBroadcast;
    } catch (error) {
      throw new Error('Failed to schedule broadcast: ' + error.message);
    }
  }, [user]);

  // Create drip campaign
  const createDripCampaign = useCallback(async (campaignData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const campaign = {
        id: Date.now(),
        ...campaignData,
        createdAt: new Date().toISOString(),
        createdBy: user.id,
        status: 'active',
        stats: {
          triggered: 0,
          completed: 0,
          unsubscribed: 0
        }
      };

      setDripCampaigns(prev => [campaign, ...prev]);

      // Save to localStorage
      const saved = localStorage.getItem('drip_campaigns') || '[]';
      const campaigns = JSON.parse(saved);
      campaigns.unshift(campaign);
      localStorage.setItem('drip_campaigns', JSON.stringify(campaigns));

      return campaign;
    } catch (error) {
      throw new Error('Failed to create drip campaign: ' + error.message);
    }
  }, [user]);

  // Get audience size for segmentation
  const getAudienceSize = useCallback((audienceType) => {
    const audienceSizes = {
      all: 342,
      brigade: 245,
      fraternity: 97,
      guild: 19,
      new_members: 28,
      inactive: 45,
      high_engagement: 68
    };
    return audienceSizes[audienceType] || 0;
  }, []);

  // Get broadcast history
  const getBroadcastHistory = useCallback((filters = {}) => {
    // In real app, this would fetch from API with filters
    return broadcastHistory.filter(broadcast => {
      if (filters.type && broadcast.type !== filters.type) return false;
      if (filters.audience && broadcast.audience !== filters.audience) return false;
      return true;
    });
  }, [broadcastHistory]);

  // Get analytics data
  const getBroadcastAnalytics = useCallback((timeframe = 30) => {
    // Mock analytics data
    return {
      totalSent: 4537,
      deliveryRate: 98.2,
      openRate: 45.7,
      clickRate: 12.3,
      unsubscribeRate: 0.2,
      byChannel: {
        email: {
          sent: 2847,
          delivered: 2798,
          opened: 1278,
          clicked: 351
        },
        sms: {
          sent: 456,
          delivered: 456,
          opened: null,
          clicked: null
        },
        push: {
          sent: 1234,
          delivered: 1175,
          opened: 892,
          clicked: 203
        }
      },
      topPerforming: [
        { subject: 'New Leadership Course Available', openRate: 67.3, clickRate: 18.9 },
        { subject: 'Live Session Reminder', openRate: 54.1, clickRate: 15.2 },
        { subject: 'Weekly Brigade Update', openRate: 48.7, clickRate: 11.4 }
      ]
    };
  }, []);

  // Send test message
  const sendTestMessage = useCallback(async (broadcastData, testEmail) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Send test to specified email
      console.log('Test message sent to:', testEmail, broadcastData);
      
      return { success: true, message: 'Test message sent successfully' };
    } catch (error) {
      throw new Error('Failed to send test message: ' + error.message);
    }
  }, []);

  return {
    sendBroadcast,
    scheduleBroadcast,
    createDripCampaign,
    getBroadcastHistory,
    getBroadcastAnalytics,
    getAudienceSize,
    sendTestMessage,
    broadcastHistory,
    dripCampaigns
  };
};