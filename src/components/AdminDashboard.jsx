import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBarChart3, FiUsers, FiTrendingUp, FiDollarSign, FiCalendar, FiPlay, FiBookOpen, FiTarget } = FiIcons;

const AdminDashboard = () => {
  const { user } = useAuth();
  const { analytics, isLoading } = useAnalytics();
  const [timeframe, setTimeframe] = useState('30'); // days

  // Check if user is admin/creator
  const isAdmin = user?.role === 'admin' || user?.tier === 'guild';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <SafeIcon icon={FiTarget} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Access Required</h2>
          <p className="text-gray-600">This dashboard is only available to content creators and administrators.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: `$${analytics.revenue.total.toLocaleString()}`,
      change: `+${analytics.revenue.growth}%`,
      trend: 'up',
      icon: FiDollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Active Members',
      value: analytics.members.active.toLocaleString(),
      change: `+${analytics.members.growth}%`,
      trend: 'up',
      icon: FiUsers,
      color: 'text-blue-600'
    },
    {
      title: 'Content Engagement',
      value: `${analytics.engagement.average}%`,
      change: `+${analytics.engagement.growth}%`,
      trend: 'up',
      icon: FiPlay,
      color: 'text-purple-600'
    },
    {
      title: 'Churn Rate',
      value: `${analytics.churn.rate}%`,
      change: `-${analytics.churn.improvement}%`,
      trend: 'down',
      icon: FiTrendingUp,
      color: 'text-orange-600'
    }
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Complete overview of your Brigade community</p>
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
                  <option value="365">Last year</option>
                </select>
                <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                  Export Report
                </button>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiCards.map((kpi, index) => (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${kpi.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                    <SafeIcon icon={kpi.icon} className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                  <span className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.change}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
              <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <SafeIcon icon={FiBarChart3} className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <p className="text-green-800 font-medium">Revenue trending upward</p>
                  <p className="text-green-600 text-sm">+{analytics.revenue.growth}% this month</p>
                </div>
              </div>
            </div>

            {/* Member Growth Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Member Growth</h3>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <SafeIcon icon={FiUsers} className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <p className="text-blue-800 font-medium">Steady member growth</p>
                  <p className="text-blue-600 text-sm">{analytics.members.newThisMonth} new members this month</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Analytics */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Top Content */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Content</h3>
              <div className="space-y-4">
                {analytics.topContent.map((content, index) => (
                  <div key={content.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{content.title}</p>
                        <p className="text-sm text-gray-600">{content.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{content.views}</p>
                      <p className="text-sm text-gray-600">views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Member Tiers */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Membership Distribution</h3>
              <div className="space-y-4">
                {analytics.memberTiers.map((tier) => (
                  <div key={tier.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{tier.name}</span>
                      <span className="text-gray-600">{tier.count} members</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${tier.color}`}
                        style={{ width: `${tier.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Member Activity</h3>
              <div className="space-y-4">
                {analytics.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${activity.color}`}>
                      <SafeIcon icon={activity.icon} className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-600">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;