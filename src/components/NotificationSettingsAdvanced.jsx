import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNotificationProvider } from './NotificationProvider';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMail, FiSmartphone, FiBell, FiToggleLeft, FiToggleRight, FiClock, FiUsers, FiAlertCircle } = FiIcons;

const NotificationSettingsAdvanced = () => {
  const { user } = useAuth();
  const { notificationSettings, updateNotificationSettings } = useNotificationProvider();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSettingChange = async (category, key, value) => {
    setIsLoading(true);
    
    const newSettings = {
      ...notificationSettings,
      [category]: {
        ...notificationSettings[category],
        [key]: value
      }
    };

    const result = await updateNotificationSettings(newSettings);
    
    if (result.success) {
      setMessage('Settings updated successfully!');
    } else {
      setMessage('Failed to update settings. Please try again.');
    }
    
    setIsLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const ToggleSwitch = ({ enabled, onChange, disabled = false }) => (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        enabled ? 'bg-primary' : disabled ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300'
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
      key: 'newContent',
      label: 'New Content Releases',
      description: 'When new courses or resources are published',
      channels: ['email', 'push']
    },
    {
      key: 'liveEvents',
      label: 'Live Event Reminders',
      description: 'Reminders for upcoming live sessions and workshops',
      channels: ['email', 'sms', 'push']
    },
    {
      key: 'communityActivity',
      label: 'Community Activity',
      description: 'Updates from Chef\'s Table and community interactions',
      channels: ['email', 'push']
    },
    {
      key: 'urgentUpdates',
      label: 'Urgent Updates',
      description: 'Important announcements and critical information',
      channels: ['email', 'sms', 'push']
    },
    {
      key: 'weeklyDigest',
      label: 'Weekly Digest',
      description: 'Summary of your activity and new content',
      channels: ['email']
    },
    {
      key: 'marketing',
      label: 'Marketing & Promotions',
      description: 'Special offers and promotional content',
      channels: ['email']
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-montserrat font-bold text-charcoal mb-2">
            Notification Preferences
          </h2>
          <p className="font-lato text-gray-600">
            Customize how and when you receive notifications from The Brigade
          </p>
        </div>

        {message && (
          <div className={`mb-6 p-3 rounded-lg ${
            message.includes('success') 
              ? 'bg-green-50 border border-green-200 text-green-600' 
              : 'bg-red-50 border border-red-200 text-red-600'
          }`}>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiAlertCircle} className="h-4 w-4" />
              <p className="text-sm font-lato">{message}</p>
            </div>
          </div>
        )}

        {/* Email Notifications */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-lg">
              <SafeIcon icon={FiMail} className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-montserrat font-bold text-charcoal">Email Notifications</h3>
              <p className="text-sm font-lato text-gray-600">Receive updates via email</p>
            </div>
            <ToggleSwitch
              enabled={notificationSettings.email.enabled}
              onChange={(enabled) => handleSettingChange('email', 'enabled', enabled)}
            />
          </div>

          <div className="space-y-4 ml-12">
            {notificationTypes
              .filter(type => type.channels.includes('email'))
              .map((type) => (
                <div key={`email-${type.key}`} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <span className="text-sm font-lato font-medium text-charcoal">
                      {type.label}
                    </span>
                    <p className="text-xs font-lato text-gray-500 mt-1">
                      {type.description}
                    </p>
                  </div>
                  <ToggleSwitch
                    enabled={notificationSettings.email[type.key]}
                    onChange={(enabled) => handleSettingChange('email', type.key, enabled)}
                    disabled={!notificationSettings.email.enabled}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* SMS Notifications */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-green-100 p-3 rounded-lg">
              <SafeIcon icon={FiSmartphone} className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-montserrat font-bold text-charcoal">SMS Notifications</h3>
              <p className="text-sm font-lato text-gray-600">Receive urgent updates via text message</p>
            </div>
            <ToggleSwitch
              enabled={notificationSettings.sms.enabled}
              onChange={(enabled) => handleSettingChange('sms', 'enabled', enabled)}
            />
          </div>

          {!user?.phone && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg ml-12">
              <p className="text-sm font-lato text-yellow-800">
                <SafeIcon icon={FiAlertCircle} className="inline h-4 w-4 mr-1" />
                Please add your phone number to your profile to enable SMS notifications.
              </p>
            </div>
          )}

          <div className="space-y-4 ml-12">
            {notificationTypes
              .filter(type => type.channels.includes('sms'))
              .map((type) => (
                <div key={`sms-${type.key}`} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <span className="text-sm font-lato font-medium text-charcoal">
                      {type.label}
                    </span>
                    <p className="text-xs font-lato text-gray-500 mt-1">
                      {type.description}
                    </p>
                  </div>
                  <ToggleSwitch
                    enabled={notificationSettings.sms[type.key]}
                    onChange={(enabled) => handleSettingChange('sms', type.key, enabled)}
                    disabled={!notificationSettings.sms.enabled || !user?.phone}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Push Notifications */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-purple-100 p-3 rounded-lg">
              <SafeIcon icon={FiBell} className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-montserrat font-bold text-charcoal">Push Notifications</h3>
              <p className="text-sm font-lato text-gray-600">Real-time notifications in your browser</p>
            </div>
            <ToggleSwitch
              enabled={notificationSettings.push.enabled}
              onChange={(enabled) => handleSettingChange('push', 'enabled', enabled)}
            />
          </div>

          <div className="space-y-4 ml-12">
            {notificationTypes
              .filter(type => type.channels.includes('push'))
              .map((type) => (
                <div key={`push-${type.key}`} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <span className="text-sm font-lato font-medium text-charcoal">
                      {type.label}
                    </span>
                    <p className="text-xs font-lato text-gray-500 mt-1">
                      {type.description}
                    </p>
                  </div>
                  <ToggleSwitch
                    enabled={notificationSettings.push[type.key]}
                    onChange={(enabled) => handleSettingChange('push', type.key, enabled)}
                    disabled={!notificationSettings.push.enabled}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Notification Timing */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-orange-100 p-3 rounded-lg">
              <SafeIcon icon={FiClock} className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-montserrat font-bold text-charcoal">Notification Timing</h3>
              <p className="text-sm font-lato text-gray-600">When would you like to receive notifications?</p>
            </div>
          </div>

          <div className="space-y-3 ml-12">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-lato font-medium text-charcoal mb-2">
                  Quiet Hours Start
                </label>
                <input
                  type="time"
                  defaultValue="22:00"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-lato font-medium text-charcoal mb-2">
                  Quiet Hours End
                </label>
                <input
                  type="time"
                  defaultValue="08:00"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <p className="text-xs font-lato text-gray-500">
              Non-urgent notifications will not be sent during quiet hours.
            </p>
          </div>
        </div>

        {/* Notification Preview */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-montserrat font-bold text-charcoal mb-4">Notification Preview</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Email Preview */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <SafeIcon icon={FiMail} className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-lato font-medium text-charcoal">Email</span>
              </div>
              <div className="bg-gray-50 rounded p-3 text-xs">
                <div className="font-medium text-charcoal mb-1">New Course Available!</div>
                <div className="text-gray-600">Leadership Communication Fundamentals is now available in your library.</div>
              </div>
            </div>

            {/* SMS Preview */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <SafeIcon icon={FiSmartphone} className="h-4 w-4 text-green-600" />
                <span className="text-sm font-lato font-medium text-charcoal">SMS</span>
              </div>
              <div className="bg-gray-50 rounded p-3 text-xs">
                <div className="text-charcoal">📱 Brigade Alert: Live session starting in 15 mins! Join now.</div>
              </div>
            </div>

            {/* Push Preview */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <SafeIcon icon={FiBell} className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-lato font-medium text-charcoal">Push</span>
              </div>
              <div className="bg-gray-50 rounded p-3 text-xs">
                <div className="font-medium text-charcoal mb-1">🎉 New Badge Earned!</div>
                <div className="text-gray-600">You've completed your first course.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
          <button
            disabled={isLoading}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-800 disabled:opacity-50 transition-colors font-lato font-medium"
          >
            {isLoading ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationSettingsAdvanced;