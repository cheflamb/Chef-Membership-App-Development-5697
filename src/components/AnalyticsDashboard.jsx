import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiUsers, FiDollarSign, FiBarChart3, FiPieChart, FiActivity, FiTarget, FiCalendar, FiDownload, FiRefreshCw } = FiIcons;

const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const { analytics, isLoading, refreshAnalytics } = useAnalytics();
  const [timeframe, setTimeframe] = useState('30');
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [showExportModal, setShowExportModal] = useState(false);

  // Check if user has analytics access
  const hasAnalyticsAccess = user?.tier === 'guild' || user?.role === 'admin';

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <SafeIcon icon={FiBarChart3} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-montserrat font-bold text-charcoal mb-2">Access Required</h2>
          <p className="font-lato text-gray-600">Please sign in to view analytics.</p>
        </div>
      </div>
    );
  }

  if (!hasAnalyticsAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <SafeIcon icon={FiTarget} className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-montserrat font-bold text-charcoal mb-2">Guild Access Required</h2>
          <p className="font-lato text-gray-600 mb-6">Advanced analytics are available for Guild members and administrators.</p>
          <a href="/pricing" className="bg-primary text-white px-6 py-3 rounded-lg font-lato font-medium hover:bg-red-800 transition-colors">
            Upgrade to Guild
          </a>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const metricCategories = [
    { id: 'overview', label: 'Overview', icon: FiBarChart3 },
    { id: 'revenue', label: 'Revenue', icon: FiDollarSign },
    { id: 'engagement', label: 'Engagement', icon: FiActivity },
    { id: 'members', label: 'Members', icon: FiUsers },
    { id: 'content', label: 'Content', icon: FiTarget },
    { id: 'retention', label: 'Retention', icon: FiTrendingUp }
  ];

  const kpiCards = [
    {
      title: 'Monthly Revenue',
      value: `$${analytics.revenue.monthly.toLocaleString()}`,
      change: `+${analytics.revenue.growth}%`,
      trend: 'up',
      icon: FiDollarSign,
      color: 'text-green-600',
      description: 'Total revenue this month'
    },
    {
      title: 'Active Members',
      value: analytics.members.active.toLocaleString(),
      change: `+${analytics.members.growth}%`,
      trend: 'up',
      icon: FiUsers,
      color: 'text-blue-600',
      description: 'Members active in last 30 days'
    },
    {
      title: 'Engagement Rate',
      value: `${analytics.engagement.average}%`,
      change: `+${analytics.engagement.growth}%`,
      trend: 'up',
      icon: FiActivity,
      color: 'text-purple-600',
      description: 'Average content engagement'
    },
    {
      title: 'Churn Rate',
      value: `${analytics.churn.rate}%`,
      change: `-${analytics.churn.improvement}%`,
      trend: 'down',
      icon: FiTrendingUp,
      color: 'text-orange-600',
      description: 'Monthly member churn'
    }
  ];

  const handleExport = (format) => {
    // In a real app, this would generate and download the report
    const data = {
      timeframe,
      selectedMetric,
      analytics,
      exportedAt: new Date().toISOString()
    };
    
    console.log(`Exporting ${format} report:`, data);
    
    if (format === 'pdf') {
      alert('PDF report would be generated and downloaded');
    } else if (format === 'csv') {
      alert('CSV data would be generated and downloaded');
    } else if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${timeframe}days-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
    
    setShowExportModal(false);
  };

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-montserrat font-bold text-charcoal">Advanced Analytics</h1>
              <p className="font-lato text-gray-600 mt-1">Deep insights into your Brigade's performance and growth</p>
            </div>
            <div className="flex space-x-3">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              <button
                onClick={refreshAnalytics}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <SafeIcon icon={FiRefreshCw} className="h-4 w-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => setShowExportModal(true)}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors flex items-center space-x-2"
              >
                <SafeIcon icon={FiDownload} className="h-4 w-4" />
                <span>Export</span>
              </button>
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
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
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
                  <p className="text-sm font-lato text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-montserrat font-bold text-charcoal">{kpi.value}</p>
                  <p className="text-xs font-lato text-gray-500 mt-1">{kpi.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Metric Categories */}
          <div className="bg-white rounded-2xl shadow-lg mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6 overflow-x-auto">
                {metricCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedMetric(category.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium transition-colors whitespace-nowrap ${
                      selectedMetric === category.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <SafeIcon icon={category.icon} className="h-4 w-4" />
                    <span>{category.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {selectedMetric === 'overview' && (
                <div className="space-y-8">
                  {/* Revenue Trend */}
                  <div>
                    <h3 className="text-lg font-montserrat font-bold text-charcoal mb-4">Revenue Trends</h3>
                    <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <SafeIcon icon={FiBarChart3} className="h-12 w-12 text-green-600 mx-auto mb-2" />
                        <p className="text-green-800 font-medium">Revenue trending upward</p>
                        <p className="text-green-600 text-sm">+{analytics.revenue.growth}% growth this period</p>
                      </div>
                    </div>
                  </div>

                  {/* Member Growth */}
                  <div>
                    <h3 className="text-lg font-montserrat font-bold text-charcoal mb-4">Member Growth</h3>
                    <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <SafeIcon icon={FiUsers} className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                        <p className="text-blue-800 font-medium">Steady member growth</p>
                        <p className="text-blue-600 text-sm">{analytics.members.newThisMonth} new members this month</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Revenue Tab */}
              {selectedMetric === 'revenue' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                      <h4 className="font-montserrat font-bold text-charcoal mb-2">Total Revenue</h4>
                      <p className="text-2xl font-montserrat font-bold text-green-600">${analytics.revenue.total.toLocaleString()}</p>
                      <p className="text-sm font-lato text-green-700">All-time revenue</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                      <h4 className="font-montserrat font-bold text-charcoal mb-2">Monthly Recurring</h4>
                      <p className="text-2xl font-montserrat font-bold text-blue-600">${analytics.revenue.monthly.toLocaleString()}</p>
                      <p className="text-sm font-lato text-blue-700">MRR this month</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                      <h4 className="font-montserrat font-bold text-charcoal mb-2">Average Per User</h4>
                      <p className="text-2xl font-montserrat font-bold text-purple-600">${(analytics.revenue.monthly / analytics.members.active).toFixed(0)}</p>
                      <p className="text-sm font-lato text-purple-700">ARPU</p>
                    </div>
                  </div>

                  {/* Revenue by Tier */}
                  <div>
                    <h4 className="font-montserrat font-bold text-charcoal mb-4">Revenue by Membership Tier</h4>
                    <div className="space-y-3">
                      {analytics.memberTiers.map((tier) => (
                        <div key={tier.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${tier.color}`}></div>
                            <span className="font-montserrat font-bold text-charcoal">{tier.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-montserrat font-bold text-charcoal">${(tier.count * tier.price).toLocaleString()}</p>
                            <p className="text-sm font-lato text-gray-600">{tier.count} members × ${tier.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Engagement Tab */}
              {selectedMetric === 'engagement' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-montserrat font-bold text-charcoal mb-4">Engagement Metrics</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-lato text-charcoal">Content Views</span>
                          <span className="font-montserrat font-bold text-primary">{analytics.engagement.totalViews.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-lato text-charcoal">Completion Rate</span>
                          <span className="font-montserrat font-bold text-primary">{analytics.engagement.completionRate}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-lato text-charcoal">Average Session</span>
                          <span className="font-montserrat font-bold text-primary">24 minutes</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-montserrat font-bold text-charcoal mb-4">Top Performing Content</h4>
                      <div className="space-y-3">
                        {analytics.topContent.slice(0, 5).map((content, index) => (
                          <div key={content.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                              }`}>
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-lato font-medium text-charcoal text-sm">{content.title}</p>
                                <p className="text-xs font-lato text-gray-600">{content.type}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-montserrat font-bold text-charcoal text-sm">{content.views}</p>
                              <p className="text-xs font-lato text-gray-600">views</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Members Tab */}
              {selectedMetric === 'members' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                      <h4 className="font-montserrat font-bold text-charcoal mb-2">Total Members</h4>
                      <p className="text-2xl font-montserrat font-bold text-blue-600">{analytics.members.total.toLocaleString()}</p>
                      <p className="text-sm font-lato text-blue-700">All registered members</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                      <h4 className="font-montserrat font-bold text-charcoal mb-2">Active Members</h4>
                      <p className="text-2xl font-montserrat font-bold text-green-600">{analytics.members.active.toLocaleString()}</p>
                      <p className="text-sm font-lato text-green-700">Active in last 30 days</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                      <h4 className="font-montserrat font-bold text-charcoal mb-2">New This Month</h4>
                      <p className="text-2xl font-montserrat font-bold text-purple-600">{analytics.members.newThisMonth}</p>
                      <p className="text-sm font-lato text-purple-700">New signups</p>
                    </div>
                  </div>

                  {/* Member Distribution */}
                  <div>
                    <h4 className="font-montserrat font-bold text-charcoal mb-4">Membership Distribution</h4>
                    <div className="space-y-4">
                      {analytics.memberTiers.map((tier) => (
                        <div key={tier.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-montserrat font-bold text-charcoal">{tier.name}</span>
                            <span className="font-lato text-gray-600">{tier.count} members ({tier.percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full ${tier.color}`} 
                              style={{ width: `${tier.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Content Tab */}
              {selectedMetric === 'content' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-montserrat font-bold text-charcoal mb-4">Content Performance</h4>
                      <div className="space-y-3">
                        {analytics.topContent.map((content, index) => (
                          <div key={content.id} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-lato font-medium text-charcoal">{content.title}</h5>
                              <span className="text-sm font-montserrat font-bold text-primary">{content.engagementScore}%</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>{content.views} views</span>
                              <span>{content.type}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-montserrat font-bold text-charcoal mb-4">Content Types</h4>
                      <div className="space-y-3">
                        {[
                          { type: 'Courses', count: 12, engagement: 85 },
                          { type: 'Live Sessions', count: 8, engagement: 92 },
                          { type: 'Community Posts', count: 156, engagement: 67 },
                          { type: 'Resources', count: 24, engagement: 78 }
                        ].map((item) => (
                          <div key={item.type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-lato font-medium text-charcoal">{item.type}</p>
                              <p className="text-sm font-lato text-gray-600">{item.count} items</p>
                            </div>
                            <div className="text-right">
                              <p className="font-montserrat font-bold text-primary">{item.engagement}%</p>
                              <p className="text-sm font-lato text-gray-600">engagement</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Retention Tab */}
              {selectedMetric === 'retention' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-montserrat font-bold text-charcoal mb-4">Retention Metrics</h4>
                      <div className="space-y-4">
                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-lato text-charcoal">Monthly Churn Rate</span>
                            <span className="font-montserrat font-bold text-red-600">{analytics.churn.rate}%</span>
                          </div>
                          <p className="text-sm font-lato text-red-700">-{analytics.churn.improvement}% improvement</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-lato text-charcoal">Retention Rate</span>
                            <span className="font-montserrat font-bold text-green-600">{100 - analytics.churn.rate}%</span>
                          </div>
                          <p className="text-sm font-lato text-green-700">Members staying active</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-lato text-charcoal">Average LTV</span>
                            <span className="font-montserrat font-bold text-blue-600">$420</span>
                          </div>
                          <p className="text-sm font-lato text-blue-700">Lifetime value per member</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-montserrat font-bold text-charcoal mb-4">Churn Reasons</h4>
                      <div className="space-y-3">
                        {analytics.churn.reasonsBreakdown.map((reason, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-lato text-charcoal text-sm">{reason.reason}</span>
                              <span className="font-montserrat font-bold text-charcoal text-sm">{reason.percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${reason.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-montserrat font-bold text-charcoal mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${activity.color}`}>
                    <SafeIcon icon={activity.icon} className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-lato font-medium text-charcoal">{activity.title}</p>
                    <p className="text-xs font-lato text-gray-600">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6"
          >
            <h3 className="text-lg font-montserrat font-bold text-charcoal mb-4">Export Analytics Report</h3>
            <p className="font-lato text-gray-600 mb-6">
              Choose your preferred format to export the current analytics data.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleExport('pdf')}
                className="w-full bg-primary text-white py-3 rounded-lg font-lato font-medium hover:bg-red-800 transition-colors"
              >
                Export as PDF Report
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="w-full bg-gray-600 text-white py-3 rounded-lg font-lato font-medium hover:bg-gray-700 transition-colors"
              >
                Export as CSV Data
              </button>
              <button
                onClick={() => handleExport('json')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-lato font-medium hover:bg-blue-700 transition-colors"
              >
                Export as JSON
              </button>
            </div>
            <button
              onClick={() => setShowExportModal(false)}
              className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded-lg font-lato font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;