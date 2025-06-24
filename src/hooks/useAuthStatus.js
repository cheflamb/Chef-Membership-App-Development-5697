import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const useAuthStatus = () => {
  const { user, loading } = useAuth();
  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    tier: 'free'
  });

  useEffect(() => {
    setAuthStatus({
      isAuthenticated: !!user,
      isLoading: loading,
      user: user,
      tier: user?.tier || 'free'
    });
  }, [user, loading]);

  return authStatus;
};

export const useTierAccess = () => {
  const { user, hasAccess } = useAuth();

  const checkAccess = (requiredTier) => {
    return hasAccess(requiredTier);
  };

  const getTierInfo = () => {
    if (!user) return { tier: 'free', label: 'Free Member' };

    const tierLabels = {
      free: 'Free Member',
      brigade: 'Brigade Member', 
      fraternity: 'Fraternity Member',
      guild: 'Guild Member'
    };

    return {
      tier: user.tier,
      label: tierLabels[user.tier] || 'Member'
    };
  };

  const getAvailableFeatures = () => {
    if (!user) return ['journal', 'courses_basic'];

    const featuresByTier = {
      free: ['journal', 'courses_basic'],
      brigade: ['journal', 'courses_basic', 'courses_advanced', 'live_sessions', 'group_coaching'],
      fraternity: ['journal', 'courses_basic', 'courses_advanced', 'live_sessions', 'group_coaching', 'qa_sessions', 'deep_dives'],
      guild: ['journal', 'courses_basic', 'courses_advanced', 'live_sessions', 'group_coaching', 'qa_sessions', 'deep_dives', 'private_calls', 'masterminds', 'text_support']
    };

    return featuresByTier[user.tier] || featuresByTier.free;
  };

  return {
    checkAccess,
    getTierInfo,
    getAvailableFeatures,
    currentTier: user?.tier || 'free'
  };
};