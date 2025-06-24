import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QuestLogin } from '@questlabs/react-sdk';
import { useAuth } from '../context/AuthContext';
import questConfig from '../questConfig';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiUsers, FiTarget, FiTrendingUp } = FiIcons;

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState('');

  // Redirect if already logged in
  if (user) {
    navigate('/my-chefcoat');
    return null;
  }

  const handleLogin = ({ userId, token, newUser }) => {
    try {
      // Store Quest SDK data
      localStorage.setItem('quest_userId', userId);
      localStorage.setItem('quest_token', token);
      
      if (newUser) {
        // New user - redirect to onboarding
        navigate('/onboarding');
      } else {
        // Existing user - redirect to main app
        navigate('/my-chefcoat');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Section - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-red-700 to-red-900 relative overflow-hidden">
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
                Welcome Back to
                <br />
                <span className="text-gold">The Brigade</span>
              </h1>
              <p className="text-xl font-lato text-red-100 mb-8">
                Continue your leadership journey with fellow culinary professionals.
              </p>
            </div>

            {/* Value Props */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <SafeIcon icon={FiUsers} className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-lg mb-1">Chef's Table Community</h3>
                  <p className="text-red-100 text-sm">Connect with fellow leaders in supportive conversations</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <SafeIcon icon={FiTarget} className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-lg mb-1">Leadership Development</h3>
                  <p className="text-red-100 text-sm">Access proven frameworks and tools for kitchen leadership</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <SafeIcon icon={FiTrendingUp} className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-lg mb-1">Personal Growth</h3>
                  <p className="text-red-100 text-sm">Daily reflection and continuous improvement tools</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full space-y-8"
        >
          {/* Back Button */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="h-5 w-5" />
              <span className="font-lato">Back to Home</span>
            </button>
          </div>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-montserrat font-bold text-charcoal mb-2">
              Sign In
            </h2>
            <p className="font-lato text-gray-600">
              Welcome back to your leadership journey
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600 font-lato">{error}</p>
            </div>
          )}

          {/* Quest Login Component */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <QuestLogin
              onSubmit={handleLogin}
              email={true}
              google={false}
              accent={questConfig.PRIMARY_COLOR}
            />
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm font-lato text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/join" 
                className="font-medium text-primary hover:text-red-800 transition-colors"
              >
                Join The Brigade
              </Link>
            </p>
          </div>

          {/* Mobile Branding */}
          <div className="lg:hidden text-center pt-8 border-t border-gray-200">
            <img 
              src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1750727120961-Brigade2.png" 
              alt="The Successful Chef Brigade Logo" 
              className="h-12 w-12 object-contain mx-auto mb-3"
            />
            <p className="text-sm font-lato text-gray-500">
              The Successful Chef Brigade
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;