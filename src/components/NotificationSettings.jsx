import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBell, FiMail, FiSmartphone, FiToggleLeft, FiToggleRight, FiInfo } = FiIcons;

const NotificationSettings = () => {
  const { user } = useAuth();
  const { permission, requestPermission } = useNotifications();
  const [settings, setSettings] = useState({
    push: {
      enabled: permission === 'granted',
      newPosts: true,
      likes: true,
      comments: true,
      follows: true,
      masterclasses: true,
      premiumContent: true,
      weeklyDigest: true
    },
    email: {
      enabled: true,
      newPosts: false,
      likes: false,
      comments: true,
      follows: true,
      masterclasses: true,
      premiumContent: true,
      weeklyDigest: true,
      monthly: true
    },
    frequency: {
      instant: true,
      daily: false,
      weekly: false
    }
  });

  useEffect(() => {
    if (user) {
      const savedSettings = localStorage.getItem(`notification_settings_${user.id}`);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    }
  }, [user]);

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    if (user) {
      localStorage.setItem(`notification_settings_${user.id}`, JSON.stringify(newSettings));
    }
  };

  const handlePushToggle = async (enabled) => {
    if (enabled && permission !== 'granted') {
      const result = await requestPermission();
      if (result !== 'granted') {
        return; // Don't update settings if permission denied
      }
    }

    const newSettings = {
      ...settings,
      push: { ...settings.push, enabled }
    };
    saveSettings(newSettings);
  };

  const handleSettingChange = (category, key, value) => {
    const newSettings = {
      ...settings,
      [category]: { ...settings[category], [key]: value }
    };
    saveSettings(newSettings);
  };

  const ToggleButton = ({ enabled, onChange, disabled = false }) => (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
        enabled 
          ? 'bg-orange-600' 
          : disabled 
            ? 'bg-gray-200 cursor-not-allowed' 
            : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const notificationTypes = [
    {
      key: 'newPosts',
      label: 'New Posts',
      description: 'When chefs you follow share new recipes or content'
    },
    {
      key: 'likes',
      label: 'Likes & Reactions',
      description: 'When someone likes your posts or comments'
    },
    {
      key: 'comments',
      label: 'Comments',
      description: 'When someone comments on your posts'
    },
    {
      key: 'follows',
      label: 'New Followers',
      description: 'When someone follows your profile'
    },
    {
      key: 'masterclasses',
      label: 'Live Masterclasses',
      description: 'Reminders for upcoming live cooking sessions'
    },
    {
      key: 'premiumContent',
      label: 'Premium Content',
      description: 'New exclusive recipes and advanced techniques',
      premium: true
    },
    {
      key: 'weeklyDigest',
      label: 'Weekly Digest',
      description: 'Summary of top posts and activities from your network'
    }
  ];

  const frequencyOptions = [
    {
      key: 'instant',
      label: 'Instant',
      description: 'Get notified immediately when something happens'
    },
    {
      key: 'daily',
      label: 'Daily Summary',
      description: 'Receive a daily digest of all notifications'
    },
    {
      key: 'weekly',
      label: 'Weekly Summary',
      description: 'Get a weekly roundup of important notifications'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Notification Preferences
          </h2>
          <p className="text-gray-600">
            Customize how and when you receive notifications from ChefConnect
          </p>
        </div>

        {/* Browser Notifications */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-orange-100 p-2 rounded-lg">
              <SafeIcon icon={FiBell} className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Push Notifications</h3>
              <p className="text-sm text-gray-600">Real-time notifications in your browser</p>
            </div>
            <div className="ml-auto">
              <ToggleButton
                enabled={settings.push.enabled}
                onChange={handlePushToggle}
              />
            </div>
          </div>

          {permission === 'denied' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="flex items-start space-x-2">
                <SafeIcon icon={FiInfo} className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm text-red-800 font-medium">
                    Push notifications are blocked
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    To enable notifications, please allow them in your browser settings and refresh the page.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 ml-10">
            {notificationTypes.map((type) => {
              const isPremiumDisabled = type.premium && user?.tier === 'basic';
              
              return (
                <div
                  key={type.key}
                  className={`flex items-center justify-between py-2 ${
                    isPremiumDisabled ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {type.label}
                      </span>
                      {type.premium && (
                        <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-xs font-medium">
                          Premium
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {type.description}
                    </p>
                  </div>
                  <ToggleButton
                    enabled={settings.push[type.key] && !isPremiumDisabled}
                    onChange={(enabled) => handleSettingChange('push', type.key, enabled)}
                    disabled={!settings.push.enabled || isPremiumDisabled}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Email Notifications */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <SafeIcon icon={FiMail} className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
              <p className="text-sm text-gray-600">Receive updates via email</p>
            </div>
            <div className="ml-auto">
              <ToggleButton
                enabled={settings.email.enabled}
                onChange={(enabled) => handleSettingChange('email', 'enabled', enabled)}
              />
            </div>
          </div>

          <div className="space-y-4 ml-10">
            {notificationTypes.map((type) => {
              const isPremiumDisabled = type.premium && user?.tier === 'basic';
              
              return (
                <div
                  key={type.key}
                  className={`flex items-center justify-between py-2 ${
                    isPremiumDisabled ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {type.label}
                      </span>
                      {type.premium && (
                        <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-xs font-medium">
                          Premium
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {type.description}
                    </p>
                  </div>
                  <ToggleButton
                    enabled={settings.email[type.key] && !isPremiumDisabled}
                    onChange={(enabled) => handleSettingChange('email', type.key, enabled)}
                    disabled={!settings.email.enabled || isPremiumDisabled}
                  />
                </div>
              );
            })}
            
            {/* Monthly Newsletter */}
            <div className="flex items-center justify-between py-2">
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">
                  Monthly Newsletter
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  Curated recipes, chef interviews, and industry insights
                </p>
              </div>
              <ToggleButton
                enabled={settings.email.monthly}
                onChange={(enabled) => handleSettingChange('email', 'monthly', enabled)}
                disabled={!settings.email.enabled}
              />
            </div>
          </div>
        </div>

        {/* Notification Frequency */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-100 p-2 rounded-lg">
              <SafeIcon icon={FiSmartphone} className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Notification Frequency</h3>
              <p className="text-sm text-gray-600">How often would you like to receive notifications?</p>
            </div>
          </div>

          <div className="space-y-3 ml-10">
            {frequencyOptions.map((option) => (
              <label key={option.key} className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="frequency"
                  value={option.key}
                  checked={settings.frequency[option.key]}
                  onChange={() => {
                    const newFrequency = { instant: false, daily: false, weekly: false };
                    newFrequency[option.key] = true;
                    handleSettingChange('frequency', null, newFrequency);
                  }}
                  className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {option.label}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {option.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            onClick={() => {
              // In a real app, this would save to the server
              alert('Notification settings saved!');
            }}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            Save Preferences
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationSettings;