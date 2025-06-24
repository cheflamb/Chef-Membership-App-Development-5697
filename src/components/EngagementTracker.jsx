import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useEngagement } from '../hooks/useEngagement';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiEye, FiHeart, FiMessageCircle, FiPlay, FiBookOpen, FiUsers, FiClock } = FiIcons;

const EngagementTracker = () => {
  const { user } = useAuth();
  const { engagementData, contentPerformance, memberActivity } = useEngagement();
  const [timeframe, setTimeframe] = useState('7'); // days
  const [contentType, setContentType] = useState('all');

  const metricCards = [
    {
      title: 'Total Views',
      value: engagementData.totalViews.toLocaleString(),
      change: `+${engagementData.viewsGrowth}%`,
      trend: 'up',
      icon: FiEye,
      color: 'text-blue-600'
    },
    {
      title: 'Engagement Rate',
      value: `${engagementData.engagementRate}%`,
      change: `+${engagementData.engagementGrowth}%`,
      trend: 'up',
      icon: FiHeart,
      color: 'text-red-600'
    },
    {
      title: 'Completion Rate',
      value: `${engagementData.completionRate}%`,
      change: `+${engagementData.completionGrowth}%`,
      trend: 'up',
      icon: FiPlay,
      color: 'text-green-600'
    },
    {
      title: 'Active Members',
      value: engagementData.activeMembers.toLocaleString(),
      change: `+${engagementData.memberGrowth}%`,
      trend: 'up',
      icon: FiUsers,
      color: 'text-purple-600'
    }
  ];

  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'course': return FiBookOpen;
      case 'live-session': return FiPlay;
      case 'post': return FiMessageCircle;
      default: return FiBookOpen;
    }
  };

  const getEngagementColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Engagement Analytics</h1>
              <p className="text-gray-600 mt-1">Track how your content resonates with Brigade members</p>
            </div>
            <div className="flex space-x-3">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Content</option>
                <option value="course">Courses</option>
                <option value="live-session">Live Sessions</option>
                <option value="post">Community Posts</option>
              </select>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricCards.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${metric.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                    <SafeIcon icon={metric.icon} className={`h-6 w-6 ${metric.color}`} />
                  </div>
                  <span className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Top Performing Content */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Content Performance</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <SafeIcon icon={FiTrendingUp} className="h-4 w-4" />
                  <span>Sorted by engagement</span>
                </div>
              </div>

              <div className="space-y-4">
                {contentPerformance
                  .filter(content => contentType === 'all' || content.type === contentType)
                  .map((content, index) => (
                    <motion.div
                      key={content.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="bg-gray-100 p-2 rounded-lg">
                            <SafeIcon 
                              icon={getContentTypeIcon(content.type)} 
                              className="h-5 w-5 text-gray-600" 
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{content.title}</h4>
                            <p className="text-sm text-gray-600 capitalize">{content.type.replace('-', ' ')}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <SafeIcon icon={FiEye} className="h-3 w-3" />
                                <span>{content.views.toLocaleString()} views</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <SafeIcon icon={FiHeart} className="h-3 w-3" />
                                <span>{content.likes} likes</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <SafeIcon icon={FiMessageCircle} className="h-3 w-3" />
                                <span>{content.comments} comments</span>
                              </div>
                              {content.completionRate && (
                                <div className="flex items-center space-x-1">
                                  <SafeIcon icon={FiPlay} className="h-3 w-3" />
                                  <span>{content.completionRate}% completed</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right ml-4">
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            getEngagementColor(content.engagementScore)
                          }`}>
                            {content.engagementScore}% engagement
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {content.publishedAt}
                          </p>
                        </div>
                      </div>

                      {/* Engagement Breakdown */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{content.avgTimeSpent}</p>
                            <p className="text-xs text-gray-600">Avg. Time</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{content.shareRate}%</p>
                            <p className="text-xs text-gray-600">Share Rate</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{content.returnRate}%</p>
                            <p className="text-xs text-gray-600">Return Rate</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>

            {/* Member Activity Insights */}
            <div className="space-y-6">
              {/* Peak Activity Times */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Activity Times</h3>
                <div className="space-y-3">
                  {memberActivity.peakTimes.map((time, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiClock} className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{time.period}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-600 h-2 rounded-full" 
                            style={{ width: `${time.activity}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{time.activity}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Member Engagement by Tier */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement by Tier</h3>
                <div className="space-y-4">
                  {memberActivity.tierEngagement.map((tier) => (
                    <div key={tier.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{tier.name}</span>
                        <span className="text-sm text-gray-600">{tier.engagement}% engaged</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${tier.color}`}
                          style={{ width: `${tier.engagement}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{tier.activeMembers} active</span>
                        <span>{tier.totalMembers} total</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Suggestions */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Suggestions</h3>
                <div className="space-y-4">
                  {memberActivity.suggestions.map((suggestion, index) => (
                    <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <SafeIcon icon={FiTrendingUp} className="h-4 w-4 text-orange-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-orange-800">{suggestion.title}</p>
                          <p className="text-xs text-orange-700 mt-1">{suggestion.reason}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Trends Chart Placeholder */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Trends Over Time</h3>
            <div className="h-64 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <SafeIcon icon={FiTrendingUp} className="h-12 w-12 text-orange-600 mx-auto mb-2" />
                <p className="text-orange-800 font-medium">Engagement trending upward</p>
                <p className="text-orange-600 text-sm">+{engagementData.engagementGrowth}% this {timeframe === '7' ? 'week' : 'month'}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EngagementTracker;