import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMail, FiPlay, FiPause, FiEdit3, FiTrash2, FiUsers, FiClock, FiTrendingUp, FiZap } = FiIcons;

const EmailAutomation = () => {
  const [activeCampaigns, setActiveCampaigns] = useState([
    {
      id: 1,
      name: 'New Member Welcome Series',
      trigger: 'member_join',
      audience: 'all',
      status: 'active',
      enrolled: 28,
      completed: 12,
      emails: [
        { delay: 0, subject: 'Welcome to The Brigade!', openRate: 68.5 },
        { delay: 1, subject: 'Your Leadership Journey Starts Here', openRate: 54.2 },
        { delay: 3, subject: 'Meet Your Fellow Brigade Members', openRate: 45.8 },
        { delay: 7, subject: 'Your First Week Recap & Next Steps', openRate: 42.1 }
      ]
    },
    {
      id: 2,
      name: 'Guild Member Onboarding',
      trigger: 'tier_upgrade',
      audience: 'guild',
      status: 'active',
      enrolled: 5,
      completed: 3,
      emails: [
        { delay: 0, subject: 'Welcome to The Guild - Premium Access Unlocked', openRate: 85.0 },
        { delay: 1, subject: 'Schedule Your Private Strategy Call', openRate: 70.0 },
        { delay: 3, subject: 'Guild Mastermind Invitation', openRate: 65.0 }
      ]
    },
    {
      id: 3,
      name: 'Re-engagement Campaign',
      trigger: 'inactive_14_days',
      audience: 'all',
      status: 'paused',
      enrolled: 45,
      completed: 8,
      emails: [
        { delay: 0, subject: 'We miss you in The Brigade', openRate: 32.4 },
        { delay: 2, subject: 'Your leadership journey is waiting', openRate: 28.9 },
        { delay: 5, subject: 'Last chance - exclusive content inside', openRate: 25.1 }
      ]
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  const emailTriggers = [
    { value: 'member_join', label: 'Member Joins', description: 'When someone joins The Brigade' },
    { value: 'tier_upgrade', label: 'Tier Upgrade', description: 'When member upgrades to higher tier' },
    { value: 'course_complete', label: 'Course Completion', description: 'When member completes a course' },
    { value: 'inactive_7_days', label: '7 Days Inactive', description: 'No login for 7 days' },
    { value: 'inactive_14_days', label: '14 Days Inactive', description: 'No login for 14 days' },
    { value: 'trial_ending', label: 'Trial Ending', description: '3 days before trial expires' },
    { value: 'payment_failed', label: 'Payment Failed', description: 'When payment fails' },
    { value: 'birthday', label: 'Member Birthday', description: 'On member\'s birthday' }
  ];

  const emailTemplates = {
    welcome: {
      subject: 'Welcome to The Successful Chef Brigade!',
      content: `Hi {first_name},

Welcome to The Brigade! 🎉

You've just joined a community of culinary leaders committed to growth, excellence, and building thriving kitchen teams.

Here's what you can expect:
• Monthly group coaching calls with Chef {instructor_name}
• Access to our Leadership Library with proven frameworks
• Connection with fellow culinary leaders who "get it"
• Tools and templates to transform your kitchen culture

Your first step: Complete your profile and introduce yourself to the community.

Ready to lead with confidence?

Chef {instructor_name}
The Successful Chef Brigade`
    },
    upgrade: {
      subject: 'Welcome to {tier_name} - Your Premium Access is Ready',
      content: `Congratulations {first_name}!

You've just unlocked exclusive {tier_name} benefits. Here's what's new for you:

{tier_benefits}

Your next steps:
1. Explore your new premium content library
2. Join our private {tier_name} community
3. Schedule your welcome call (Guild members only)

Questions? Reply to this email - I personally read every message.

To your leadership success,
Chef {instructor_name}`
    },
    reengagement: {
      subject: 'Your leadership journey is waiting...',
      content: `Hi {first_name},

I noticed you haven't been active in The Brigade lately. Life gets busy - I get it.

But here's what you're missing:
• New leadership frameworks that are transforming kitchens
• Success stories from members just like you
• Tools that could solve your biggest team challenges TODAY

Take just 5 minutes to check out what's new: {dashboard_link}

Still committed to your growth?

Chef {instructor_name}
P.S. If you're too busy right now, no worries. But don't let another month slip by.`
    }
  };

  const toggleCampaignStatus = (campaignId) => {
    setActiveCampaigns(campaigns =>
      campaigns.map(campaign =>
        campaign.id === campaignId
          ? { ...campaign, status: campaign.status === 'active' ? 'paused' : 'active' }
          : campaign
      )
    );
  };

  const deleteCampaign = (campaignId) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      setActiveCampaigns(campaigns =>
        campaigns.filter(campaign => campaign.id !== campaignId)
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateCompletionRate = (campaign) => {
    return campaign.enrolled > 0 ? Math.round((campaign.completed / campaign.enrolled) * 100) : 0;
  };

  const calculateAverageOpenRate = (emails) => {
    if (emails.length === 0) return 0;
    const total = emails.reduce((sum, email) => sum + (email.openRate || 0), 0);
    return Math.round(total / emails.length);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Automation</h2>
            <p className="text-gray-600">Create automated email sequences for different member journeys</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            <SafeIcon icon={FiZap} className="h-4 w-4" />
            <span>Create Campaign</span>
          </button>
        </div>

        {/* Campaign Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeCampaigns.filter(c => c.status === 'active').length}
                </p>
              </div>
              <SafeIcon icon={FiZap} className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Enrolled</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeCampaigns.reduce((sum, c) => sum + c.enrolled, 0)}
                </p>
              </div>
              <SafeIcon icon={FiUsers} className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Open Rate</p>
                <p className="text-2xl font-bold text-gray-900">47.3%</p>
              </div>
              <SafeIcon icon={FiMail} className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">65.4%</p>
              </div>
              <SafeIcon icon={FiTrendingUp} className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Email Campaigns</h3>
          
          {activeCampaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{campaign.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    Trigger: {emailTriggers.find(t => t.value === campaign.trigger)?.label}
                  </p>
                  
                  {/* Campaign Stats */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Enrolled</p>
                      <p className="text-lg font-semibold text-gray-900">{campaign.enrolled}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-lg font-semibold text-gray-900">{campaign.completed}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Completion Rate</p>
                      <p className="text-lg font-semibold text-gray-900">{calculateCompletionRate(campaign)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg. Open Rate</p>
                      <p className="text-lg font-semibold text-gray-900">{calculateAverageOpenRate(campaign.emails)}%</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleCampaignStatus(campaign.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      campaign.status === 'active' 
                        ? 'text-yellow-600 hover:bg-yellow-50' 
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={campaign.status === 'active' ? 'Pause Campaign' : 'Activate Campaign'}
                  >
                    <SafeIcon icon={campaign.status === 'active' ? FiPause : FiPlay} className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setEditingCampaign(campaign)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Campaign"
                  >
                    <SafeIcon icon={FiEdit3} className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteCampaign(campaign.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Campaign"
                  >
                    <SafeIcon icon={FiTrash2} className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Email Sequence */}
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Email Sequence ({campaign.emails.length} emails)</h5>
                <div className="grid md:grid-cols-2 gap-3">
                  {campaign.emails.map((email, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          Email {index + 1}
                          {email.delay === 0 ? ' (Immediate)' : ` (Day ${email.delay})`}
                        </span>
                        <span className="text-sm text-green-600 font-medium">
                          {email.openRate}% open
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{email.subject}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {activeCampaigns.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <SafeIcon icon={FiMail} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No email campaigns yet</h3>
              <p className="text-gray-600 mb-6">Create your first automated email sequence!</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Create Email Campaign
              </button>
            </div>
          )}
        </div>

        {/* Email Templates */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Templates</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(emailTemplates).map(([key, template]) => (
              <div key={key} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{template.subject}</h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{template.content}</p>
                <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Best Performing Subject Lines</h4>
              <div className="space-y-2">
                {[
                  { subject: 'Welcome to The Guild - Premium Access Unlocked', rate: '85.0%' },
                  { subject: 'Welcome to The Brigade!', rate: '68.5%' },
                  { subject: 'Your Leadership Journey Starts Here', rate: '54.2%' },
                  { subject: 'Meet Your Fellow Brigade Members', rate: '45.8%' }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-900">{item.subject}</span>
                    <span className="text-sm text-green-600 font-medium">{item.rate}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Optimization Tips</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <SafeIcon icon={FiTrendingUp} className="h-4 w-4 text-green-600 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    Welcome emails have 23% higher open rates than other automated emails
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <SafeIcon icon={FiClock} className="h-4 w-4 text-blue-600 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    Emails sent on Tuesday-Thursday perform 15% better
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <SafeIcon icon={FiUsers} className="h-4 w-4 text-purple-600 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    Personalized subject lines increase open rates by 26%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailAutomation;