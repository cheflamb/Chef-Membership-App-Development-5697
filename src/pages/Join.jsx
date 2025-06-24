import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiCheck, FiAlertCircle } = FiIcons;

const Join = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (!formData.agreeTerms) {
      setError('You must agree to the terms and conditions');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const { data } = await signUp(
        formData.email.trim(),
        formData.password,
        formData.name.trim(),
        formData.agreeTerms
      );
      
      if (data?.user) {
        setSuccess(true);
        // Navigate to welcome page after successful signup
        setTimeout(() => {
          navigate('/my-chefcoat');
        }, 2000);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    'Kitchen Leadership 101 Course (Free)',
    'Access to Chef\'s Table Community',
    'Daily Leadership Journal Prompts',
    'Chef Retention Recipe & F&B Retention Playbook',
    'Private Podcast Feed',
    'Leadership Badge System'
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="bg-green-100 p-4 rounded-xl mx-auto mb-6 w-16 h-16 flex items-center justify-center">
              <SafeIcon icon={FiCheck} className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-montserrat font-bold text-charcoal mb-4">
              Welcome to The Brigade! 🎉
            </h2>
            <p className="font-lato text-gray-600 mb-6">
              Your account has been created successfully. You now have access to Kitchen Leadership 101 and our community.
            </p>
            <p className="text-sm font-lato text-gray-500">
              Redirecting to your dashboard...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <div className="bg-primary p-4 rounded-xl mx-auto mb-6 w-16 h-16 flex items-center justify-center">
            <SafeIcon icon={FiUser} className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-montserrat font-bold text-charcoal">
            Join The Brigade
          </h2>
          <p className="mt-2 text-sm font-lato text-gray-600">
            Start your leadership journey with our free tier
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiAlertCircle} className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-600 font-lato">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-lato font-medium text-charcoal mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-lato"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-lato font-medium text-charcoal mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiMail} className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-lato"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-lato font-medium text-charcoal mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiLock} className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-lato"
                  placeholder="Create a password (min 6 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <SafeIcon icon={showPassword ? FiEyeOff : FiEye} className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-lato font-medium text-charcoal mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiLock} className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-lato"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <SafeIcon icon={showConfirmPassword ? FiEyeOff : FiEye} className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
                  required
                />
                <span className="text-xs font-lato text-gray-600 leading-relaxed">
                  I agree to the coaching disclaimer, hold harmless agreement, and media release. 
                  I understand this is leadership coaching and not therapy or medical advice.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !formData.agreeTerms}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-lato font-medium hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creating Account...' : 'Join Free & Start Kitchen Leadership 101'}
            </button>
          </form>

          {/* Benefits */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-montserrat font-bold text-charcoal mb-3">
              What You Get (Free):
            </h3>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm font-lato text-charcoal">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm font-lato text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-red-800"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Join;