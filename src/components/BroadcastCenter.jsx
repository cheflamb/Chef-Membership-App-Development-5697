import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useBroadcast } from '../hooks/useBroadcast';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSend, FiUsers, FiMail, FiSmartphone, FiBell, FiEdit3, FiEye, FiCalendar, FiTarget, FiZap } = FiIcons;

const BroadcastCenter = () => {
  const { user } = useAuth();
  const { sendBroadcast, scheduleBroadcast, getBroadcastHistory, getAudienceSize, createDripCampaign } = useBroadcast();
  const [activeTab, setActiveTab] = useState('compose');
  const [broadcastData, setBroadcastData] = useState({
    type: 'email',
    title: '',
    message: '',
    audience: 'all',
    scheduledFor: '',
    priority: 'normal',
    includeUnsubscribed: false,
    trackOpens: true,
    trackClicks: true
  });

  const [dripCampaign, setDripCampaign] = useState({
    name: '',
    trigger: 'member_join',
    audience: 'all',
    emails: [
      { delay: 0, subject: '', content: '', active: true }
    ]
  });

  const broadcastTypes = [
    {
      value: 'email',
      label: 'Email',
      icon: FiMail,
      description: 'Rich content, attachments, detailed messaging',
      color: 'bg-blue-500'
    },
    {
      value: 'sms',
      label: 'SMS',
      icon: FiSmartphone,
      description: 'Urgent updates, high open rates, 160 chars max',
      color: 'bg-green-500'
    },
    {
      value: 'push',
      label: 'Push Notification',
      icon: FiBell,
      description: 'Real-time alerts, instant delivery',
      color: 'bg-purple-500'
    },
    {
      value: 'in_app',
      label: 'In-App Message',
      icon: FiTarget,
      description: 'Contextual messaging within the platform',
      color: 'bg-orange-500'
    }
  ];

  const audienceSegments = [
    { value: 'all', label: 'All Members', description: 'Everyone in your community', count: 342 },
    { value: 'brigade', label: 'Brigade Only', description: 'Basic tier members', count: 245 },
    { value: 'fraternity', label: 'Fraternity & Above', description: 'Fraternity and Guild members', count: 97 },
    { value: 'guild', label: 'Guild Only', description: 'Premium tier members', count: 19 },
    { value: 'new_members', label: 'New Members', description: 'Joined in last 30 days', count: 28 },
    { value: 'inactive', label: 'Inactive Members', description: 'No activity in 14+ days', count: 45 },
    { value: 'high_engagement', label: 'Highly Engaged', description: 'Top 20% by activity', count: 68 }
  ];

  const messageTemplates = [
    {
      id: 'live_session_reminder',
      title: 'Live Session Reminder',
      type: 'email',
      subject: 'Leadership Coaching Call Starting in 1 Hour',
      content: `Hi {first_name},

This is a friendly reminder that our monthly Brigade coaching call is starting in 1 hour.

📅 Today at {session_time}
🎯 Topic: {session_topic}
🔗 Join Link: {session_link}

Can't make it? No worries - the recording will be available in your member dashboard within 24 hours.

See you there!
Chef {instructor_name}`
    },
    {
      id: 'new_content_alert',
      title: 'New Content Release',
      type: 'push',
      subject: 'New Leadership Content Available',
      content: 'New course "{course_title}" is now available in your Leadership Library. Start learning today!'
    },
    {
      id: 'urgent_sms',
      title: 'Urgent SMS Template',
      type: 'sms',
      content: 'URGENT: Live session starting NOW! Join: {session_link} - Chef Brigade'
    }
  ];

  const handleSendBroadcast = async () => {
    try {
      if (broadcastData.scheduledFor) {
        await scheduleBroadcast(broadcastData);
        alert('Broadcast scheduled successfully!');
      } else {
        await sendBroadcast(broadcastData);
        alert('Broadcast sent successfully!');
      }

      // Reset form
      setBroadcastData({
        type: 'email',
        title: '',
        message: '',
        audience: 'all',
        scheduledFor: '',
        priority: 'normal',
        includeUnsubscribed: false,
        trackOpens: true,
        trackClicks: true
      });
    } catch (error) {
      alert('Failed to send broadcast: ' + error.message);
    }
  };

  const handleCreateDripCampaign = async () => {
    try {
      await createDripCampaign(dripCampaign);
      alert('Drip campaign created successfully!');
      setDripCampaign({
        name: '',
        trigger: 'member_join',
        audience: 'all',
        emails: [
          { delay: 0, subject: '', content: '', active: true }
        ]
      });
    } catch (error) {
      alert('Failed to create drip campaign: ' + error.message);
    }
  };

  const addDripEmail = () => {
    setDripCampaign({
      ...dripCampaign,
      emails: [
        ...dripCampaign.emails,
        { delay: dripCampaign.emails.length, subject: '', content: '', active: true }
      ]
    });
  };

  const updateDripEmail = (index, field, value) => {
    const updatedEmails = dripCampaign.emails.map((email, i) =>
      i === index ? { ...email, [field]: value } : email
    );
    setDripCampaign({ ...dripCampaign, emails: updatedEmails });
  };

  const getCharacterCount = () => {
    if (broadcastData.type === 'sms') {
      return `${broadcastData.message.length}/160`;
    }
    return `${broadcastData.message.length} characters`;
  };

  const tabs = [
    { id: 'compose', label: 'Compose', icon: FiEdit3 },
    { id: 'drip', label: 'Drip Campaigns', icon: FiZap },
    { id: 'history', label: 'Broadcast History', icon: FiEye },
    { id: 'analytics', label: 'Analytics', icon: FiTarget }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Broadcast Center</h1>
            <p className="text-gray-600 mt-1">Communicate with your Brigade members across all channels</p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'border-orange-600 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <SafeIcon icon={tab.icon} className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Compose Tab */}
              {activeTab === 'compose' && (
                <div className="space-y-6">
                  {/* Broadcast Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Communication Channel *
                    </label>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {broadcastTypes.map((type) => (
                        <label
                          key={type.value}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            broadcastData.type === type.value
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="broadcastType"
                            value={type.value}
                            checked={broadcastData.type === type.value}
                            onChange={(e) => setBroadcastData({ ...broadcastData, type: e.target.value })}
                            className="sr-only"
                          />
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`p-2 rounded-lg ${type.color}`}>
                              <SafeIcon icon={type.icon} className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-medium text-gray-900">{type.label}</span>
                          </div>
                          <p className="text-xs text-gray-600">{type.description}</p>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Audience Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Target Audience *
                    </label>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {audienceSegments.map((segment) => (
                        <label
                          key={segment.value}
                          className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                            broadcastData.audience === segment.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="audience"
                            value={segment.value}
                            checked={broadcastData.audience === segment.value}
                            onChange={(e) => setBroadcastData({ ...broadcastData, audience: e.target.value })}
                            className="sr-only"
                          />
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900">{segment.label}</span>
                            <span className="text-sm text-blue-600 font-medium">{segment.count}</span>
                          </div>
                          <p className="text-xs text-gray-600">{segment.description}</p>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Message Templates */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Quick Templates
                    </label>
                    <div className="grid md:grid-cols-3 gap-3">
                      {messageTemplates
                        .filter(template => template.type === broadcastData.type)
                        .map((template) => (
                          <button
                            key={template.id}
                            onClick={() => setBroadcastData({
                              ...broadcastData,
                              title: template.subject || template.title,
                              message: template.content
                            })}
                            className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <p className="font-medium text-gray-900 text-sm">{template.title}</p>
                            <p className="text-xs text-gray-600 mt-1">Click to use template</p>
                          </button>
                        ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Message Composition */}
                    <div className="space-y-4">
                      {/* Title/Subject */}
                      {broadcastData.type !== 'sms' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {broadcastData.type === 'email' ? 'Subject Line' : 'Title'} *
                          </label>
                          <input
                            type="text"
                            value={broadcastData.title}
                            onChange={(e) => setBroadcastData({ ...broadcastData, title: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder={broadcastData.type === 'email' ? 'Enter email subject...' : 'Enter notification title...'}
                          />
                        </div>
                      )}

                      {/* Message Content */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message Content *
                        </label>
                        <textarea
                          value={broadcastData.message}
                          onChange={(e) => setBroadcastData({ ...broadcastData, message: e.target.value })}
                          rows={broadcastData.type === 'sms' ? 4 : 8}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder={broadcastData.type === 'sms' ? 'Enter your SMS message (160 characters max)...' : 'Enter your message content...'}
                          maxLength={broadcastData.type === 'sms' ? 160 : undefined}
                        />
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-500">{getCharacterCount()}</span>
                          {broadcastData.type === 'sms' && broadcastData.message.length > 140 && (
                            <span className="text-xs text-orange-600">Approaching SMS limit</span>
                          )}
                        </div>
                      </div>

                      {/* Scheduling */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Delivery Schedule
                        </label>
                        <div className="flex items-center space-x-3">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="schedule"
                              checked={!broadcastData.scheduledFor}
                              onChange={() => setBroadcastData({ ...broadcastData, scheduledFor: '' })}
                              className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                            />
                            <span className="text-sm text-gray-700">Send Now</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="schedule"
                              checked={!!broadcastData.scheduledFor}
                              onChange={() => {
                                const tomorrow = new Date();
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                tomorrow.setHours(9, 0, 0, 0);
                                setBroadcastData({ ...broadcastData, scheduledFor: tomorrow.toISOString().slice(0, 16) });
                              }}
                              className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                            />
                            <span className="text-sm text-gray-700">Schedule for Later</span>
                          </label>
                        </div>
                        {broadcastData.scheduledFor && (
                          <div className="mt-2">
                            <input
                              type="datetime-local"
                              value={broadcastData.scheduledFor}
                              onChange={(e) => setBroadcastData({ ...broadcastData, scheduledFor: e.target.value })}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Broadcast Options */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Broadcast Options</h4>

                        {/* Priority */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                          <select
                            value={broadcastData.priority}
                            onChange={(e) => setBroadcastData({ ...broadcastData, priority: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          >
                            <option value="low">Low - Regular updates</option>
                            <option value="normal">Normal - Standard communication</option>
                            <option value="high">High - Important updates</option>
                            <option value="urgent">Urgent - Critical alerts</option>
                          </select>
                        </div>

                        {/* Tracking Options */}
                        {broadcastData.type === 'email' && (
                          <div className="space-y-3">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={broadcastData.trackOpens}
                                onChange={(e) => setBroadcastData({ ...broadcastData, trackOpens: e.target.checked })}
                                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-700">Track email opens</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={broadcastData.trackClicks}
                                onChange={(e) => setBroadcastData({ ...broadcastData, trackClicks: e.target.checked })}
                                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-700">Track link clicks</span>
                            </label>
                          </div>
                        )}

                        {/* Preview */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Preview</h5>
                          <div className="bg-white border border-gray-200 rounded-lg p-3">
                            {broadcastData.title && (
                              <p className="font-medium text-gray-900 text-sm mb-1">{broadcastData.title}</p>
                            )}
                            <p className="text-sm text-gray-700">
                              {broadcastData.message || 'Message content will appear here...'}
                            </p>
                            <div className="mt-2 text-xs text-gray-500">
                              To: {audienceSegments.find(s => s.value === broadcastData.audience)?.label} 
                              ({audienceSegments.find(s => s.value === broadcastData.audience)?.count} members)
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Send Button */}
                      <button
                        onClick={handleSendBroadcast}
                        disabled={!broadcastData.message || (broadcastData.type !== 'sms' && !broadcastData.title)}
                        className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                      >
                        <SafeIcon icon={broadcastData.scheduledFor ? FiCalendar : FiSend} className="h-4 w-4" />
                        <span>{broadcastData.scheduledFor ? 'Schedule Broadcast' : 'Send Broadcast'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Drip Campaigns Tab */}
              {activeTab === 'drip' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Email Automation</h3>
                      <p className="text-gray-600">Create automated email sequences for different member journeys</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                    {/* Campaign Settings */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Campaign Name *
                        </label>
                        <input
                          type="text"
                          value={dripCampaign.name}
                          onChange={(e) => setDripCampaign({ ...dripCampaign, name: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="e.g., New Member Welcome Series"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Trigger Event *
                        </label>
                        <select
                          value={dripCampaign.trigger}
                          onChange={(e) => setDripCampaign({ ...dripCampaign, trigger: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="member_join">Member Joins</option>
                          <option value="tier_upgrade">Tier Upgrade</option>
                          <option value="course_complete">Course Completion</option>
                          <option value="inactive_14_days">14 Days Inactive</option>
                          <option value="trial_ending">Trial Ending</option>
                        </select>
                      </div>
                    </div>

                    {/* Email Sequence */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">Email Sequence</h4>
                        <button
                          onClick={addDripEmail}
                          className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center space-x-1"
                        >
                          <SafeIcon icon={FiSend} className="h-4 w-4" />
                          <span>Add Email</span>
                        </button>
                      </div>

                      <div className="space-y-4">
                        {dripCampaign.emails.map((email, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-medium text-gray-900">Email {index + 1}</h5>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">
                                  Send {email.delay === 0 ? 'immediately' : `after ${email.delay} days`}
                                </span>
                                <label className="flex items-center space-x-1">
                                  <input
                                    type="checkbox"
                                    checked={email.active}
                                    onChange={(e) => updateDripEmail(index, 'active', e.target.checked)}
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                  />
                                  <span className="text-sm text-gray-600">Active</span>
                                </label>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Delay (days)
                                </label>
                                <input
                                  type="number"
                                  value={email.delay}
                                  onChange={(e) => updateDripEmail(index, 'delay', parseInt(e.target.value) || 0)}
                                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                  min="0"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Subject Line
                                </label>
                                <input
                                  type="text"
                                  value={email.subject}
                                  onChange={(e) => updateDripEmail(index, 'subject', e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                  placeholder="Email subject..."
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Email Content
                              </label>
                              <textarea
                                value={email.content}
                                onChange={(e) => updateDripEmail(index, 'content', e.target.value)}
                                rows={4}
                                className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Email content..."
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleCreateDripCampaign}
                      disabled={!dripCampaign.name || dripCampaign.emails.some(email => !email.subject || !email.content)}
                      className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      Create Drip Campaign
                    </button>
                  </div>
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Broadcast History</h3>
                    <div className="flex space-x-2">
                      <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                        <option>All Channels</option>
                        <option>Email</option>
                        <option>SMS</option>
                        <option>Push</option>
                      </select>
                      <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                        <option>Last 30 days</option>
                        <option>Last 7 days</option>
                        <option>Last 90 days</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                      <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                        <div className="col-span-4">Message</div>
                        <div className="col-span-2">Channel</div>
                        <div className="col-span-2">Audience</div>
                        <div className="col-span-2">Sent</div>
                        <div className="col-span-1">Delivery</div>
                        <div className="col-span-1">Actions</div>
                      </div>
                    </div>

                    <div className="divide-y divide-gray-200">
                      {/* Sample broadcast history */}
                      {[
                        {
                          title: 'Live Session Reminder - Leadership Communication',
                          type: 'email',
                          audience: 'All Members',
                          sent: '2 hours ago',
                          deliveryRate: '98.5%',
                          status: 'delivered'
                        },
                        {
                          title: 'New Course Available: Managing Kitchen Stress',
                          type: 'push',
                          audience: 'Fraternity & Above',
                          sent: '1 day ago',
                          deliveryRate: '95.2%',
                          status: 'delivered'
                        },
                        {
                          title: 'URGENT: Session starting NOW!',
                          type: 'sms',
                          audience: 'Guild Only',
                          sent: '3 days ago',
                          deliveryRate: '100%',
                          status: 'delivered'
                        }
                      ].map((broadcast, index) => (
                        <div key={index} className="px-6 py-4 hover:bg-gray-50">
                          <div className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-4">
                              <p className="font-medium text-gray-900">{broadcast.title}</p>
                              <p className="text-sm text-gray-600">Click to view details</p>
                            </div>
                            <div className="col-span-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                broadcast.type === 'email' ? 'bg-blue-100 text-blue-800' :
                                broadcast.type === 'sms' ? 'bg-green-100 text-green-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {broadcast.type.toUpperCase()}
                              </span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-sm text-gray-900">{broadcast.audience}</span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-sm text-gray-600">{broadcast.sent}</span>
                            </div>
                            <div className="col-span-1">
                              <span className="text-sm text-green-600">{broadcast.deliveryRate}</span>
                            </div>
                            <div className="col-span-1">
                              <button className="text-gray-400 hover:text-gray-600">
                                <SafeIcon icon={FiEye} className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Communication Analytics</h3>

                  {/* Key Metrics */}
                  <div className="grid md:grid-cols-4 gap-6">
                    {[
                      { label: 'Delivery Rate', value: '98.2%', change: '+0.5%', trend: 'up' },
                      { label: 'Open Rate', value: '45.7%', change: '+2.1%', trend: 'up' },
                      { label: 'Click Rate', value: '12.3%', change: '-0.8%', trend: 'down' },
                      { label: 'Unsubscribe Rate', value: '0.2%', change: '0%', trend: 'neutral' }
                    ].map((metric, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                          </div>
                          <span className={`text-sm font-medium ${
                            metric.trend === 'up' ? 'text-green-600' : 
                            metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {metric.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Channel Performance */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Performance by Channel</h4>
                    <div className="space-y-4">
                      {[
                        { channel: 'Email', sent: '2,847', delivered: '2,798', opened: '1,278', clicked: '351' },
                        { channel: 'SMS', sent: '456', delivered: '456', opened: '-', clicked: '-' },
                        { channel: 'Push', sent: '1,234', delivered: '1,175', opened: '892', clicked: '203' }
                      ].map((channel, index) => (
                        <div key={index} className="grid grid-cols-5 gap-4 py-2">
                          <div className="font-medium text-gray-900">{channel.channel}</div>
                          <div className="text-sm text-gray-600">{channel.sent} sent</div>
                          <div className="text-sm text-gray-600">{channel.delivered} delivered</div>
                          <div className="text-sm text-gray-600">{channel.opened} opened</div>
                          <div className="text-sm text-gray-600">{channel.clicked} clicked</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BroadcastCenter;