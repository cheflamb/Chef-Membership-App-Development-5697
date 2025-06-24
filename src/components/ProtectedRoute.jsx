import React from 'react';
import { useAuth } from '../context/AuthContext';
import SafeIcon from '../common/SafeIcon';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';

const { FiLock, FiArrowRight } = FiIcons;

const ProtectedRoute = ({ children, requiredTier = 'free', fallbackContent = null }) => {
  const { user, loading, hasAccess } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
        <div className="text-center max-w-md">
          <SafeIcon icon={FiLock} className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-montserrat font-bold text-charcoal mb-2">
            Sign In Required
          </h2>
          <p className="font-lato text-gray-600 mb-6">
            Please sign in to access this content.
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
      </div>
    );
  }

  // Insufficient tier access
  if (!hasAccess(requiredTier)) {
    return fallbackContent || (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
        <div className="text-center max-w-md">
          <SafeIcon icon={FiLock} className="h-16 w-16 text-gold mx-auto mb-4" />
          <h2 className="text-2xl font-montserrat font-bold text-charcoal mb-2">
            Upgrade Required
          </h2>
          <p className="font-lato text-gray-600 mb-4">
            This content requires {requiredTier.toUpperCase()} membership.
          </p>
          <p className="font-lato text-gray-500 mb-6">
            Your current tier: {user.tier.toUpperCase()}
          </p>
          <Link
            to="/pricing"
            className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg font-lato font-medium hover:bg-red-800 transition-colors"
          >
            <span>Upgrade Membership</span>
            <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;