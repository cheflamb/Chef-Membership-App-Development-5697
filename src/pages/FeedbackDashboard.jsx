import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import FeedbackAnalytics from '../components/FeedbackAnalytics';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMessageCircle, FiLock } = FiIcons;

const FeedbackDashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <SafeIcon icon={FiLock} className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-montserrat font-bold text-charcoal mb-2">
            Access Required
          </h2>
          <p className="font-lato text-gray-600">
            Please sign in to view feedback analytics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="bg-primary p-4 rounded-xl mx-auto mb-4 w-16 h-16 flex items-center justify-center">
              <SafeIcon icon={FiMessageCircle} className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-montserrat font-bold text-charcoal mb-4">
              Feedback Dashboard
            </h1>
            <p className="text-xl font-lato text-gray-600 max-w-3xl mx-auto">
              Track and analyze user feedback to improve The Brigade experience.
            </p>
          </div>

          {/* Analytics Component */}
          <FeedbackAnalytics />

          {/* Feedback Guidelines */}
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-montserrat font-bold text-charcoal mb-6">
              Feedback Best Practices
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-montserrat font-bold text-charcoal mb-3">
                  For Users:
                </h3>
                <ul className="space-y-2 font-lato text-gray-700">
                  <li>• Be specific about what you experienced</li>
                  <li>• Include the page or feature you were using</li>
                  <li>• Suggest improvements when possible</li>
                  <li>• Rate your overall experience honestly</li>
                </ul>
              </div>
              <div>
                <h3 className="font-montserrat font-bold text-charcoal mb-3">
                  For Administrators:
                </h3>
                <ul className="space-y-2 font-lato text-gray-700">
                  <li>• Review feedback regularly</li>
                  <li>• Look for patterns in user concerns</li>
                  <li>• Prioritize high-impact improvements</li>
                  <li>• Follow up on critical issues</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeedbackDashboard;