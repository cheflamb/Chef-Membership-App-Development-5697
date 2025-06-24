import React from 'react';
import {motion} from 'framer-motion';
import {useAuth} from '../context/AuthContext';
import {Link} from 'react-router-dom';
import GetStartedComponent from '../components/GetStartedComponent';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {FiTarget, FiArrowRight, FiLock} = FiIcons;

const GetStarted = () => {
  const {user} = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          className="text-center max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <SafeIcon icon={FiLock} className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-montserrat font-bold text-charcoal mb-2">
              Sign In Required
            </h2>
            <p className="font-lato text-gray-600 mb-6">
              Please sign in to access your personalized get started guide.
            </p>
            <div className="space-y-3">
              <Link
                to="/login"
                className="block bg-primary text-white px-6 py-3 rounded-lg font-lato font-medium hover:bg-red-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/join"
                className="block text-primary font-lato font-medium hover:text-red-800"
              >
                Don't have an account? Join free →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-primary p-4 rounded-xl mx-auto mb-4 w-16 h-16 flex items-center justify-center">
              <SafeIcon icon={FiTarget} className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-montserrat font-bold text-charcoal mb-2">
              Get Started with The Brigade
            </h1>
            <p className="font-lato text-gray-600">
              Your personalized leadership journey starts here. Follow these steps to make the most of your Brigade membership.
            </p>
          </div>

          {/* Welcome Message */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-8">
            <h2 className="text-xl font-montserrat font-bold text-charcoal mb-4">
              Welcome to The Brigade, {user.name}! 🎉
            </h2>
            <p className="font-lato text-gray-600 mb-4">
              You're now part of a community of culinary leaders committed to growth and excellence. 
              Let's get you set up for success with our interactive guide below.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiTarget} className="h-4 w-4 text-primary" />
                <span className="font-lato text-gray-700">Leadership Development</span>
              </div>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiTarget} className="h-4 w-4 text-primary" />
                <span className="font-lato text-gray-700">Community Access</span>
              </div>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiTarget} className="h-4 w-4 text-primary" />
                <span className="font-lato text-gray-700">Growth Tracking</span>
              </div>
            </div>
          </div>

          {/* Quest GetStarted Component */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <GetStartedComponent />
          </div>

          {/* Quick Links */}
          <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200">
            <h3 className="font-montserrat font-bold text-charcoal mb-4 text-center">
              Quick Access Links
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                to="/leadership-levelup"
                className="flex items-center space-x-2 bg-white text-charcoal p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SafeIcon icon={FiTarget} className="h-5 w-5 text-primary" />
                <span className="font-lato font-medium">Start Learning</span>
                <SafeIcon icon={FiArrowRight} className="h-4 w-4 ml-auto" />
              </Link>
              <Link
                to="/chefs-table"
                className="flex items-center space-x-2 bg-white text-charcoal p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SafeIcon icon={FiTarget} className="h-5 w-5 text-primary" />
                <span className="font-lato font-medium">Join Community</span>
                <SafeIcon icon={FiArrowRight} className="h-4 w-4 ml-auto" />
              </Link>
              <Link
                to="/journal"
                className="flex items-center space-x-2 bg-white text-charcoal p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SafeIcon icon={FiTarget} className="h-5 w-5 text-primary" />
                <span className="font-lato font-medium">Start Journal</span>
                <SafeIcon icon={FiArrowRight} className="h-4 w-4 ml-auto" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GetStarted;