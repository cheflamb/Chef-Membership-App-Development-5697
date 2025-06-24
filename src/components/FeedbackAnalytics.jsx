import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useFeedbackTracking } from '../hooks/useFeedbackTracking';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMessageCircle, FiStar, FiTrendingUp, FiCalendar, FiBarChart3 } = FiIcons;

const FeedbackAnalytics = () => {
  const { user } = useAuth();
  const { feedbackHistory, getFeedbackStats } = useFeedbackTracking();
  const [timeframe, setTimeframe] = useState('30'); // days

  if (!user || user.tier !== 'guild') {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <div className="text-center">
          <SafeIcon icon={FiBarChart3} className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-montserrat font-bold text-charcoal mb-2">
            Feedback Analytics
          </h3>
          <p className="font-lato text-gray-600 mb-4">
            Advanced feedback analytics are available for Guild members.
          </p>
          <a
            href="/pricing"
            className="bg-primary text-white px-4 py-2 rounded-lg font-lato font-medium hover:bg-red-800 transition-colors"
          >
            Upgrade to Guild
          </a>
        </div>
      </div>
    );
  }

  const stats = getFeedbackStats();
  const filteredFeedback = feedbackHistory.filter(feedback => {
    const feedbackDate = new Date(feedback.timestamp);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeframe));
    return feedbackDate >= cutoffDate;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-montserrat font-bold text-charcoal">
          Feedback Analytics
        </h2>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">All time</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-lato text-gray-600">Total Feedback</p>
              <p className="text-2xl font-montserrat font-bold text-charcoal">
                {filteredFeedback.length}
              </p>
            </div>
            <SafeIcon icon={FiMessageCircle} className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-lato text-gray-600">Average Rating</p>
              <p className="text-2xl font-montserrat font-bold text-charcoal">
                {stats.averageRating || 0}
              </p>
            </div>
            <SafeIcon icon={FiStar} className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-lato text-gray-600">Response Rate</p>
              <p className="text-2xl font-montserrat font-bold text-charcoal">
                {filteredFeedback.length > 0 ? '100%' : '0%'}
              </p>
            </div>
            <SafeIcon icon={FiTrendingUp} className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-montserrat font-bold text-charcoal mb-4">
          Recent Feedback
        </h3>
        {filteredFeedback.length > 0 ? (
          <div className="space-y-4">
            {filteredFeedback.slice(0, 5).map((feedback) => (
              <div
                key={feedback.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-lato font-medium text-charcoal">
                      Rating: {feedback.rating}/5
                    </span>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <SafeIcon
                          key={i}
                          icon={FiStar}
                          className={`h-4 w-4 ${
                            i < feedback.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm font-lato text-gray-500">
                    {new Date(feedback.timestamp).toLocaleDateString()}
                  </span>
                </div>
                {feedback.message && (
                  <p className="font-lato text-gray-700 text-sm">
                    {feedback.message}
                  </p>
                )}
                <p className="font-lato text-gray-500 text-xs mt-2">
                  Page: {feedback.page}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <SafeIcon icon={FiMessageCircle} className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="font-lato text-gray-600">No feedback in this timeframe</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FeedbackAnalytics;