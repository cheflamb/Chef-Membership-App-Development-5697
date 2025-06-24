import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const useAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = () => {
      // Simulate API call with realistic data
      setTimeout(() => {
        const mockAnalytics = {
          revenue: {
            total: 47850,
            growth: 23.5,
            monthly: 8200,
            newThisMonth: 12
          },
          members: {
            active: 342,
            growth: 15.8,
            newThisMonth: 28,
            churnRate: 4.2,
            byTier: {
              brigade: 245,
              fraternity: 78,
              guild: 19
            }
          },
          engagement: {
            average: 76,
            growth: 8.3,
            totalViews: 15420,
            completionRate: 68
          },
          churn: {
            rate: 4.2,
            improvement: 2.1,
            reasonsBreakdown: [
              { reason: 'Too busy', percentage: 35 },
              { reason: 'Price concerns', percentage: 28 },
              { reason: 'Content not relevant', percentage: 22 },
              { reason: 'Technical issues', percentage: 15 }
            ]
          },
          topContent: [
            {
              id: 1,
              title: 'Leadership Communication Basics',
              type: 'course',
              views: 1245,
              engagementScore: 89
            },
            {
              id: 2,
              title: 'Monthly Brigade Coaching Call',
              type: 'live-session',
              views: 987,
              engagementScore: 85
            },
            {
              id: 3,
              title: 'Managing Kitchen Stress',
              type: 'course',
              views: 876,
              engagementScore: 82
            },
            {
              id: 4,
              title: 'Team Building Strategies',
              type: 'post',
              views: 654,
              engagementScore: 78
            }
          ],
          memberTiers: [
            {
              name: 'The Brigade',
              count: 245,
              percentage: 71.6,
              color: 'bg-blue-500'
            },
            {
              name: 'The Fraternity',
              count: 78,
              percentage: 22.8,
              color: 'bg-purple-500'
            },
            {
              name: 'The Guild',
              count: 19,
              percentage: 5.6,
              color: 'bg-orange-500'
            }
          ],
          recentActivity: [
            {
              title: 'New member joined The Guild',
              time: '2 hours ago',
              icon: 'FiUsers',
              color: 'bg-green-500'
            },
            {
              title: 'Course completion milestone reached',
              time: '4 hours ago',
              icon: 'FiBookOpen',
              color: 'bg-blue-500'
            },
            {
              title: 'Live session scheduled',
              time: '6 hours ago',
              icon: 'FiVideo',
              color: 'bg-purple-500'
            },
            {
              title: 'Member feedback received',
              time: '8 hours ago',
              icon: 'FiMessageCircle',
              color: 'bg-orange-500'
            }
          ]
        };

        setAnalytics(mockAnalytics);
        setIsLoading(false);
      }, 1000);
    };

    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  return { analytics, isLoading };
};