import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const useFeedbackTracking = () => {
  const { user } = useAuth();
  const [feedbackHistory, setFeedbackHistory] = useState([]);

  useEffect(() => {
    if (user) {
      loadFeedbackHistory();
    }
  }, [user]);

  const loadFeedbackHistory = () => {
    if (!user) return;
    
    const saved = localStorage.getItem(`feedback_history_${user.id}`);
    if (saved) {
      setFeedbackHistory(JSON.parse(saved));
    }
  };

  const saveFeedbackHistory = (newFeedback) => {
    if (!user) return;
    
    const updated = [newFeedback, ...feedbackHistory].slice(0, 50); // Keep last 50
    setFeedbackHistory(updated);
    localStorage.setItem(`feedback_history_${user.id}`, JSON.stringify(updated));
  };

  const trackFeedbackSubmission = (feedbackData) => {
    const feedback = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type: feedbackData.type || 'general',
      rating: feedbackData.rating,
      message: feedbackData.message,
      page: window.location.pathname,
      userAgent: navigator.userAgent,
      userId: user?.id
    };

    saveFeedbackHistory(feedback);

    // Track in analytics (if you have analytics service)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'feedback_submitted', {
        event_category: 'engagement',
        event_label: feedback.type,
        value: feedback.rating
      });
    }

    return feedback;
  };

  const getFeedbackStats = () => {
    if (feedbackHistory.length === 0) {
      return {
        totalSubmissions: 0,
        averageRating: 0,
        lastSubmission: null
      };
    }

    const totalSubmissions = feedbackHistory.length;
    const ratingsSum = feedbackHistory.reduce((sum, feedback) => sum + (feedback.rating || 0), 0);
    const averageRating = ratingsSum / totalSubmissions;
    const lastSubmission = feedbackHistory[0];

    return {
      totalSubmissions,
      averageRating: Math.round(averageRating * 10) / 10,
      lastSubmission
    };
  };

  return {
    feedbackHistory,
    trackFeedbackSubmission,
    getFeedbackStats
  };
};