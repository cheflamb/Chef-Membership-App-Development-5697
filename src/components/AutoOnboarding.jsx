import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useOnboarding } from '../hooks/useOnboarding';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheckCircle, FiPlay, FiBookOpen, FiUsers, FiTarget, FiArrowRight, FiX } = FiIcons;

const AutoOnboarding = ({ isVisible, onComplete }) => {
  const { user } = useAuth();
  const { 
    onboardingSteps, 
    currentStep, 
    completeStep, 
    markOnboardingComplete,
    getPersonalizedContent 
  } = useOnboarding();

  const [personalizedContent, setPersonalizedContent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && isVisible) {
      setIsLoading(true);
      // Simulate API call to get personalized content
      setTimeout(() => {
        const content = getPersonalizedContent(user.tier, user.experience);
        setPersonalizedContent(content);
        setIsLoading(false);
      }, 1000);
    }
  }, [user, isVisible]);

  const handleStepComplete = async (stepId) => {
    await completeStep(stepId);
    
    // If this was the last step, complete onboarding
    if (stepId === onboardingSteps[onboardingSteps.length - 1].id) {
      await markOnboardingComplete();
      onComplete();
    }
  };

  const getStepIcon = (type) => {
    switch (type) {
      case 'welcome': return FiTarget;
      case 'profile': return FiUsers;
      case 'content': return FiBookOpen;
      case 'community': return FiUsers;
      default: return FiCheckCircle;
    }
  };

  const getTierWelcomeMessage = (tier) => {
    switch (tier) {
      case 'brigade':
        return "Welcome to The Brigade! You're now part of a community of culinary leaders committed to growth and excellence.";
      case 'fraternity':
        return "Welcome to The Fraternity! Get ready for deeper leadership development and biweekly support calls.";
      case 'guild':
        return "Welcome to The Guild! You now have exclusive access to high-touch coaching and private masterminds.";
      default:
        return "Welcome to The Successful Chef community! Let's get you started on your leadership journey.";
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Welcome to Your Leadership Journey!</h2>
                <p className="text-gray-600 mt-1">{getTierWelcomeMessage(user?.tier)}</p>
              </div>
              <button
                onClick={onComplete}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <SafeIcon icon={FiX} className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Getting Started Progress</span>
                <span>{onboardingSteps.filter(step => step.completed).length} of {onboardingSteps.length} completed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-600 to-red-600 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(onboardingSteps.filter(step => step.completed).length / onboardingSteps.length) * 100}%` 
                  }}
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Onboarding Steps */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Next Steps</h3>
                <div className="space-y-4">
                  {onboardingSteps.map((step, index) => {
                    const StepIcon = getStepIcon(step.type);
                    const isActive = step.id === currentStep?.id;
                    
                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`border-2 rounded-xl p-4 transition-all cursor-pointer ${
                          step.completed 
                            ? 'border-green-200 bg-green-50'
                            : isActive 
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => !step.completed && handleStepComplete(step.id)}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-lg ${
                            step.completed 
                              ? 'bg-green-600' 
                              : isActive 
                              ? 'bg-orange-600' 
                              : 'bg-gray-400'
                          }`}>
                            <SafeIcon 
                              icon={step.completed ? FiCheckCircle : StepIcon} 
                              className="h-6 w-6 text-white" 
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-semibold ${
                              step.completed ? 'text-green-800' : 'text-gray-900'
                            }`}>
                              {step.title}
                            </h4>
                            <p className={`text-sm mt-1 ${
                              step.completed ? 'text-green-700' : 'text-gray-600'
                            }`}>
                              {step.description}
                            </p>
                            {step.action && !step.completed && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStepComplete(step.id);
                                }}
                                className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 text-sm font-medium mt-2"
                              >
                                <span>{step.action.label}</span>
                                <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Personalized Content Recommendations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended for You</h3>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {personalizedContent.map((content, index) => (
                      <motion.div
                        key={content.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${content.color}`}>
                            <SafeIcon icon={content.icon} className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{content.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{content.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>{content.duration} min</span>
                              <span>{content.difficulty}</span>
                              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                                {content.category}
                              </span>
                            </div>
                          </div>
                          <button
                            className="text-orange-600 hover:text-orange-700 transition-colors"
                            title="Start Learning"
                          >
                            <SafeIcon icon={FiPlay} className="h-5 w-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Quick Actions */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <SafeIcon icon={FiUsers} className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Join Community</span>
                    </button>
                    <button className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <SafeIcon icon={FiBookOpen} className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Browse Library</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Welcome Message for Tier */}
            <div className={`mt-8 p-6 rounded-xl ${
              user?.tier === 'guild' 
                ? 'bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200'
                : user?.tier === 'fraternity'
                ? 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200'
                : 'bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200'
            }`}>
              <h3 className="font-semibold text-gray-900 mb-2">
                Your {user?.tier?.charAt(0).toUpperCase() + user?.tier?.slice(1)} Benefits
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                {user?.tier === 'guild' && (
                  <>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCheckCircle} className="h-4 w-4 text-green-600" />
                      <span>Private 1:1 Strategy Calls</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCheckCircle} className="h-4 w-4 text-green-600" />
                      <span>Exclusive Mastermind Access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCheckCircle} className="h-4 w-4 text-green-600" />
                      <span>Direct Text/Voice Support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCheckCircle} className="h-4 w-4 text-green-600" />
                      <span>VIP Retreat Invitations</span>
                    </div>
                  </>
                )}
                {user?.tier === 'fraternity' && (
                  <>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCheckCircle} className="h-4 w-4 text-green-600" />
                      <span>Biweekly Q&A Calls</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCheckCircle} className="h-4 w-4 text-green-600" />
                      <span>Leadership Deep Dives</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCheckCircle} className="h-4 w-4 text-green-600" />
                      <span>Chef's Playbook Library</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCheckCircle} className="h-4 w-4 text-green-600" />
                      <span>Early Access to Content</span>
                    </div>
                  </>
                )}
                {user?.tier === 'brigade' && (
                  <>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCheckCircle} className="h-4 w-4 text-green-600" />
                      <span>Monthly Group Coaching</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCheckCircle} className="h-4 w-4 text-green-600" />
                      <span>Leadership Library Access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCheckCircle} className="h-4 w-4 text-green-600" />
                      <span>Community Forum</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCheckCircle} className="h-4 w-4 text-green-600" />
                      <span>Monthly Challenges</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Need help getting started? <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">Contact Support</a>
            </p>
            <button
              onClick={onComplete}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              Continue to Dashboard
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AutoOnboarding;