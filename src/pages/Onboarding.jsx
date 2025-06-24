import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { OnBoarding } from '@questlabs/react-sdk';
import questConfig from '../questConfig';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTarget, FiUsers, FiTrendingUp, FiHeart, FiArrowRight } = FiIcons;

const Onboarding = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(0);

  // Get userId and token from localStorage (set by QuestLogin)
  const userId = localStorage.getItem('quest_userId');
  const token = localStorage.getItem('quest_token');

  useEffect(() => {
    // Redirect if no auth data
    if (!userId || !token) {
      navigate('/login');
    }
  }, [userId, token, navigate]);

  const getAnswers = () => {
    console.log('Onboarding completed with answers:', answers);
    // Navigate to main application after completion
    navigate('/my-chefcoat');
  };

  if (!userId || !token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Section - Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-charcoal via-gray-800 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <img 
                src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1750727120961-Brigade2.png" 
                alt="The Successful Chef Brigade Logo" 
                className="h-20 w-20 object-contain mb-6"
              />
              <h1 className="text-4xl font-montserrat font-bold mb-4">
                Let's Get You
                <br />
                <span className="text-gold">Set Up!</span>
              </h1>
              <p className="text-xl font-lato text-gray-300 mb-8">
                We're personalizing your leadership development experience.
              </p>
            </div>

            {/* Core Values */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary p-3 rounded-lg">
                  <SafeIcon icon={FiTarget} className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-lg mb-1">Presence Over Position</h3>
                  <p className="text-gray-300 text-sm">True leadership comes from being fully present with your team</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-primary p-3 rounded-lg">
                  <SafeIcon icon={FiTrendingUp} className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-lg mb-1">1% Better Than Yesterday</h3>
                  <p className="text-gray-300 text-sm">Small improvements create massive transformation over time</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-primary p-3 rounded-lg">
                  <SafeIcon icon={FiHeart} className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-lg mb-1">Lead From the Heart</h3>
                  <p className="text-gray-300 text-sm">Authentic leadership flows from emotional intelligence and empathy</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-primary p-3 rounded-lg">
                  <SafeIcon icon={FiUsers} className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-lg mb-1">Community Over Ego</h3>
                  <p className="text-gray-300 text-sm">Put the team and community first, setting aside personal ego</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Section - Onboarding Component */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <img 
              src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1750727120961-Brigade2.png" 
              alt="The Successful Chef Brigade Logo" 
              className="h-16 w-16 object-contain mx-auto mb-4"
            />
            <h1 className="text-2xl font-montserrat font-bold text-charcoal mb-2">
              Let's Get You Set Up!
            </h1>
            <p className="font-lato text-gray-600">
              Personalizing your leadership journey
            </p>
          </div>

          {/* Quest Onboarding Component */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <OnBoarding
              userId={userId}
              token={token}
              questId={questConfig.QUEST_ONBOARDING_QUESTID}
              answer={answers}
              setAnswer={setAnswers}
              getAnswers={getAnswers}
              accent={questConfig.PRIMARY_COLOR}
              singleChoose="modal1"
              multiChoice="modal2"
            >
              <OnBoarding.Header />
              <OnBoarding.Content />
              <OnBoarding.Footer />
            </OnBoarding>
          </div>

          {/* Skip Option */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/my-chefcoat')}
              className="flex items-center space-x-2 text-gray-500 hover:text-primary transition-colors mx-auto"
            >
              <span className="font-lato text-sm">Skip for now</span>
              <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
            </button>
          </div>

          {/* Welcome Message */}
          <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200">
            <h3 className="font-montserrat font-bold text-charcoal mb-2 text-center">
              Welcome to The Brigade! 🎉
            </h3>
            <p className="font-lato text-gray-600 text-sm text-center mb-4">
              You're now part of a community of culinary leaders committed to growth and excellence.
            </p>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiTarget} className="h-4 w-4 text-primary" />
                <span className="font-lato text-gray-700">Leadership Library</span>
              </div>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiUsers} className="h-4 w-4 text-primary" />
                <span className="font-lato text-gray-700">Chef's Table Community</span>
              </div>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiHeart} className="h-4 w-4 text-primary" />
                <span className="font-lato text-gray-700">Daily Journal Prompts</span>
              </div>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiTrendingUp} className="h-4 w-4 text-primary" />
                <span className="font-lato text-gray-700">Growth Tracking</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;