import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as FiIcons from 'react-icons/fi';

export const useEngagement = () => {
  const { user } = useAuth();
  const [engagementData, setEngagementData] = useState({});
  const [contentPerformance, setContentPerformance] = useState([]);
  const [memberActivity, setMemberActivity] = useState({});

  useEffect(() => {
    if (user) {
      // Simulate fetching engagement data
      const mockEngagementData = {
        totalViews: 25847,
        viewsGrowth: 18.5,
        engagementRate: 76,
        engagementGrowth: 12.3,
        completionRate: 68,
        completionGrowth: 8.7,
        activeMembers: 289,
        memberGrowth: 15.2
      };

      const mockContentPerformance = [
        {
          id: 1,
          title: 'Leadership Communication Fundamentals',
          type: 'course',
          views: 1847,
          likes: 234,
          comments: 67,
          completionRate: 85,
          engagementScore: 92,
          publishedAt: '2024-01-15',
          avgTimeSpent: '24m 35s',
          shareRate: 12,
          returnRate: 76
        },
        {
          id: 2,
          title: 'Monthly Brigade Coaching Call - January',
          type: 'live-session',
          views: 1456,
          likes: 189,
          comments: 89,
          completionRate: 78,
          engagementScore: 87,
          publishedAt: '2024-01-20',
          avgTimeSpent: '45m 12s',
          shareRate: 8,
          returnRate: 82
        },
        {
          id: 3,
          title: 'Building High-Performance Kitchen Teams',
          type: 'course',
          views: 1234,
          likes: 156,
          comments: 45,
          completionRate: 72,
          engagementScore: 83,
          publishedAt: '2024-01-10',
          avgTimeSpent: '31m 22s',
          shareRate: 15,
          returnRate: 68
        },
        {
          id: 4,
          title: 'Quick Win: Daily Team Huddles',
          type: 'post',
          views: 987,
          likes: 98,
          comments: 34,
          completionRate: null,
          engagementScore: 79,
          publishedAt: '2024-01-22',
          avgTimeSpent: '3m 45s',
          shareRate: 22,
          returnRate: 45
        },
        {
          id: 5,
          title: 'Managing Kitchen Stress & Burnout',
          type: 'course',
          views: 876,
          likes: 87,
          comments: 23,
          completionRate: 65,
          engagementScore: 75,
          publishedAt: '2024-01-18',
          avgTimeSpent: '28m 18s',
          shareRate: 9,
          returnRate: 71
        }
      ];

      const mockMemberActivity = {
        peakTimes: [
          { period: '6:00 - 8:00 AM', activity: 45 },
          { period: '12:00 - 2:00 PM', activity: 78 },
          { period: '6:00 - 8:00 PM', activity: 92 },
          { period: '9:00 - 11:00 PM', activity: 65 }
        ],
        tierEngagement: [
          {
            name: 'The Brigade',
            engagement: 72,
            activeMembers: 176,
            totalMembers: 245,
            color: 'bg-blue-500'
          },
          {
            name: 'The Fraternity',
            engagement: 84,
            activeMembers: 66,
            totalMembers: 78,
            color: 'bg-purple-500'
          },
          {
            name: 'The Guild',
            engagement: 95,
            activeMembers: 18,
            totalMembers: 19,
            color: 'bg-orange-500'
          }
        ],
        suggestions: [
          {
            title: 'Create more interactive content',
            reason: 'Live sessions have 23% higher engagement than static courses'
          },
          {
            title: 'Focus on morning content releases',
            reason: 'Your audience is most active between 6-8 AM'
          },
          {
            title: 'Develop advanced leadership content',
            reason: 'Guild members are requesting more strategic-level material'
          }
        ]
      };

      setEngagementData(mockEngagementData);
      setContentPerformance(mockContentPerformance);
      setMemberActivity(mockMemberActivity);
    }
  }, [user]);

  const getEngagementTrend = (timeframe = 7) => {
    // Mock trend data
    const trends = [];
    for (let i = timeframe; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      trends.push({
        date: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 500) + 200,
        engagement: Math.floor(Math.random() * 30) + 60,
        completions: Math.floor(Math.random() * 20) + 40
      });
    }
    return trends;
  };

  const getTopPerformingContent = (limit = 5, type = 'all') => {
    let filtered = contentPerformance;
    if (type !== 'all') {
      filtered = contentPerformance.filter(content => content.type === type);
    }
    return filtered
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, limit);
  };

  const getMemberEngagementByTier = () => {
    return memberActivity.tierEngagement || [];
  };

  const getContentSuggestions = () => {
    return memberActivity.suggestions || [];
  };

  return {
    engagementData,
    contentPerformance,
    memberActivity,
    getEngagementTrend,
    getTopPerformingContent,
    getMemberEngagementByTier,
    getContentSuggestions
  };
};