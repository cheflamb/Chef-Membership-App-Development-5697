import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSmartphone, FiCheck, FiSettings, FiDollarSign, FiUsers, FiTrendingUp } = FiIcons;

const SMSProvider = () => {
  const [activeProvider, setActiveProvider] = useState('twilio');
  const [smsSettings, setSmsSettings] = useState({
    provider: 'twilio',
    accountSid: '',
    authToken: '',
    phoneNumber: '',
    enabled: false,
    rateLimiting: true,
    optInRequired: true,
    includeUnsubscribeLink: true
  });

  const smsProviders = [
    {
      id: 'twilio',
      name: 'Twilio',
      description: 'Industry leader with global reach',
      pricing: '$0.0075 per SMS',
      features: ['Global delivery', 'High deliverability', 'Rich analytics', 'Two-way messaging'],
      logo: '📱'
    },
    {
      id: 'messagebird',
      name: 'MessageBird',
      description: 'European-focused with competitive pricing',
      pricing: '$0.0065 per SMS',
      features: ['EU compliance', 'Multi-channel', 'Voice calls', 'Chat APIs'],
      logo: '🐦'
    },
    {
      id: 'clicksend',
      name: 'ClickSend',
      description: 'Australian provider with global coverage',
      pricing: '$0.008 per SMS',
      features: ['Direct carrier routes', 'Email to SMS', 'Fax integration', 'Voice'],
      logo: '📨'
    }
  ];

  const smsTemplates = [
    {
      name: 'Session Reminder',
      content: 'Hi {first_name}! Your Brigade coaching call starts in 15 minutes. Join: {link}',
      useCase: 'Live session alerts'
    },
    {
      name: 'Urgent Update',
      content: 'BRIGADE ALERT: {message}. Check your email for details.',
      useCase: 'Critical announcements'
    },
    {
      name: 'Welcome SMS',
      content: 'Welcome to The Brigade, {first_name}! Your leadership journey starts now. Reply STOP to opt out.',
      useCase: 'New member onboarding'
    }
  ];

  const handleSaveSettings = () => {
    // In real app, this would save to backend
    localStorage.setItem('sms_settings', JSON.stringify(smsSettings));
    alert('SMS settings saved successfully!');
  };

  const handleTestSMS = () => {
    if (!smsSettings.phoneNumber || !smsSettings.accountSid) {
      alert('Please configure your SMS provider settings first.');
      return;
    }
    
    // Simulate sending test SMS
    alert('Test SMS sent! Check your phone for delivery.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <SafeIcon icon={FiSmartphone} className="h-16 w-16 text-orange-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">SMS Integration</h2>
          <p className="text-gray-600">Send urgent updates and reminders directly to your members' phones</p>
        </div>

        {/* Provider Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose SMS Provider</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {smsProviders.map((provider) => (
              <label
                key={provider.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  activeProvider === provider.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="smsProvider"
                  value={provider.id}
                  checked={activeProvider === provider.id}
                  onChange={(e) => {
                    setActiveProvider(e.target.value);
                    setSmsSettings({ ...smsSettings, provider: e.target.value });
                  }}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="text-3xl mb-2">{provider.logo}</div>
                  <h4 className="font-semibold text-gray-900 mb-1">{provider.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{provider.description}</p>
                  <p className="text-sm font-medium text-orange-600 mb-3">{provider.pricing}</p>
                  <div className="space-y-1">
                    {provider.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-1 text-xs text-gray-600">
                        <SafeIcon icon={FiCheck} className="h-3 w-3 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Configuration */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">SMS Configuration</h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account SID *
              </label>
              <input
                type="text"
                value={smsSettings.accountSid}
                onChange={(e) => setSmsSettings({ ...smsSettings, accountSid: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your Account SID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auth Token *
              </label>
              <input
                type="password"
                value={smsSettings.authToken}
                onChange={(e) => setSmsSettings({ ...smsSettings, authToken: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your Auth Token"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMS Phone Number *
              </label>
              <input
                type="tel"
                value={smsSettings.phoneNumber}
                onChange={(e) => setSmsSettings({ ...smsSettings, phoneNumber: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="+1234567890"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={smsSettings.enabled}
                  onChange={(e) => setSmsSettings({ ...smsSettings, enabled: e.target.checked })}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Enable SMS</span>
              </label>
            </div>
          </div>

          {/* SMS Options */}
          <div className="space-y-4 mb-6">
            <h4 className="font-medium text-gray-900">SMS Options</h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={smsSettings.rateLimiting}
                  onChange={(e) => setSmsSettings({ ...smsSettings, rateLimiting: e.target.checked })}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Enable rate limiting</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={smsSettings.optInRequired}
                  onChange={(e) => setSmsSettings({ ...smsSettings, optInRequired: e.target.checked })}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Require opt-in consent</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={smsSettings.includeUnsubscribeLink}
                  onChange={(e) => setSmsSettings({ ...smsSettings, includeUnsubscribeLink: e.target.checked })}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Include unsubscribe option</span>
              </label>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleSaveSettings}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Save Configuration
            </button>
            <button
              onClick={handleTestSMS}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Send Test SMS
            </button>
          </div>
        </div>

        {/* SMS Templates */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">SMS Templates</h3>
          <div className="space-y-4">
            {smsTemplates.map((template, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                  <span className="text-xs text-gray-500">{template.useCase}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{template.content}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {template.content.length}/160 characters
                  </span>
                  <button className="text-orange-600 hover:text-orange-700 text-sm">
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SMS Analytics Preview */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">SMS Analytics</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <SafeIcon icon={FiUsers} className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">456</p>
              <p className="text-sm text-gray-600">Messages Sent</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <SafeIcon icon={FiTrendingUp} className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">99.8%</p>
              <p className="text-sm text-gray-600">Delivery Rate</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <SafeIcon icon={FiDollarSign} className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">$3.42</p>
              <p className="text-sm text-gray-600">Total Cost</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SMSProvider;