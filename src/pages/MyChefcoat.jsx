import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useJournal } from '../context/JournalContext';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiCalendar, FiBook, FiAward, FiTrendingUp, FiHeart, FiEdit3, FiExternalLink, FiLock, FiTarget } = FiIcons;

const MyChefcoat = () => {
  const { user } = useAuth();
  const { entries } = useJournal();
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProgress();
    }
  }, [user]);

  const fetchUserProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_progress_chef_brigade')
        .select(`
          *,
          courses_chef_brigade(title, category, tier_required)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      setUserProgress(data || []);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const badgeDefinitions = {
    'joined-brigade': {
      name: 'Joined the Brigade',
      description: 'Welcome to The Successful Chef Brigade!',
      icon: FiUser,
      color: 'bg-blue-100 text-blue-800'
    },
    'leadership-starter': {
      name: 'Leadership Starter',
      description: 'Completed Kitchen Leadership 101',
      icon: FiBook,
      color: 'bg-green-100 text-green-800'
    },
    'consistent-learner': {
      name: 'Consistent Learner',
      description: '7-day journal streak',
      icon: FiTrendingUp,
      color: 'bg-purple-100 text-purple-800'
    },
    'course-completer': {
      name: 'Course Completer',
      description: 'Completed your first course',
      icon: FiAward,
      color: 'bg-gold text-charcoal'
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'free': return 'text-charcoal bg-background border-charcoal';
      case 'brigade': return 'text-primary bg-red-50 border-primary';
      case 'fraternity': return 'text-gold bg-yellow-50 border-gold';
      case 'guild': return 'text-charcoal bg-gold border-gold';
      default: return 'text-charcoal bg-background border-charcoal';
    }
  };

  const getTierLabel = (tier) => {
    switch (tier) {
      case 'free': return 'FREE MEMBER';
      case 'brigade': return 'BRIGADE MEMBER';
      case 'fraternity': return 'FRATERNITY MEMBER';
      case 'guild': return 'GUILD MEMBER';
      default: return 'MEMBER';
    }
  };

  const getTierBenefits = (tier) => {
    switch (tier) {
      case 'free': return [
        'Kitchen Leadership 101 Course',
        'Daily Journal Prompts',
        "Chef's Table Community Access",
        'Private Podcast Feed'
      ];
      case 'brigade': return [
        'Full Leadership Library',
        'Monthly Group Coaching',
        'Downloadable Tools & Templates',
        'Monthly Leadership Challenges'
      ];
      case 'fraternity': return [
        'Biweekly Q&A Sessions',
        'Leadership Deep Dive Workshops',
        "Chef's Playbook Library",
        'Early Access to Content'
      ];
      case 'guild': return [
        'Private Strategy Calls',
        'Monthly Hot Seat Masterminds',
        'Text/Voice Support Access',
        'VIP Retreat Invitations'
      ];
      default: return [];
    }
  };

  const getJournalStreak = () => {
    if (entries.length === 0) return 0;

    // Simple streak calculation - count consecutive days from today
    const today = new Date();
    let streak = 0;

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = checkDate.toISOString().split('T')[0];

      const entryExists = entries.some(entry =>
        entry.created_at.split('T')[0] === dateString
      );

      if (entryExists) {
        streak++;
      } else if (i === 0) {
        // If no entry today, streak is broken
        break;
      } else {
        // Allow one day gap
        continue;
      }
    }

    return streak;
  };

  const completedCourses = userProgress.filter(p => p.progress === 100);
  const inProgressCourses = userProgress.filter(p => p.progress > 0 && p.progress < 100);
  const journalStreak = getJournalStreak();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <SafeIcon icon={FiLock} className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-montserrat font-bold text-charcoal mb-2">Access Required</h2>
          <p className="font-lato text-gray-600">Please sign in to view your Chefcoat.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-montserrat font-bold text-charcoal mb-4">
              My Chefcoat
            </h1>
            <p className="text-xl font-lato text-gray-600">
              Your leadership journey dashboard and personal growth tracker.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 mb-6">
                <div className="text-center mb-6">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="h-24 w-24 rounded-full mx-auto mb-4 border-4 border-primary" 
                  />
                  <h2 className="text-xl font-montserrat font-bold text-charcoal mb-2">
                    {user.name}
                  </h2>
                  <span className={`px-4 py-2 rounded-full text-sm font-montserrat font-bold border ${getTierColor(user.tier)}`}>
                    {getTierLabel(user.tier)}
                  </span>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-montserrat font-bold text-primary">
                      {entries.length}
                    </div>
                    <div className="text-sm font-lato text-gray-600">Journal Entries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-montserrat font-bold text-primary">
                      {journalStreak}
                    </div>
                    <div className="text-sm font-lato text-gray-600">Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-montserrat font-bold text-primary">
                      {completedCourses.length}
                    </div>
                    <div className="text-sm font-lato text-gray-600">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-montserrat font-bold text-primary">
                      {user.badges?.length || 0}
                    </div>
                    <div className="text-sm font-lato text-gray-600">Badges</div>
                  </div>
                </div>

                {/* Private Podcast Link */}
                <div className="bg-background rounded-xl p-4 mb-6">
                  <h3 className="font-montserrat font-bold text-charcoal mb-2">
                    Your Private Podcast Feed
                  </h3>
                  <p className="font-lato text-gray-600 text-sm mb-3">
                    Access your personalized Brigade podcast content.
                  </p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={user.private_rss_url || ''}
                      readOnly
                      className="flex-1 p-2 bg-white border border-gray-300 rounded text-sm font-mono"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(user.private_rss_url)}
                      className="p-2 bg-primary text-white rounded hover:bg-red-800 transition-colors"
                    >
                      <SafeIcon icon={FiEdit3} className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Tier Benefits */}
                <div className="bg-background rounded-xl p-4">
                  <h3 className="font-montserrat font-bold text-charcoal mb-3">
                    Your Benefits
                  </h3>
                  <ul className="space-y-2">
                    {getTierBenefits(user.tier).map((benefit, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <SafeIcon icon={FiTarget} className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="font-lato text-gray-700 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  {user.tier !== 'guild' && (
                    <Link
                      to="/pricing"
                      className="inline-flex items-center space-x-2 text-primary font-lato font-medium hover:text-red-800 text-sm mt-4"
                    >
                      <span>Upgrade for more benefits</span>
                      <SafeIcon icon={FiExternalLink} className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-xl font-montserrat font-bold text-charcoal mb-4">
                  Quick Actions
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <Link
                    to="/journal"
                    className="bg-primary text-white p-4 rounded-xl hover:bg-red-800 transition-colors text-center"
                  >
                    <SafeIcon icon={FiHeart} className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-montserrat font-bold">Daily Journal</div>
                    <div className="text-sm opacity-90">Reflect & grow</div>
                  </Link>
                  <Link
                    to="/leadership-levelup"
                    className="bg-gold text-charcoal p-4 rounded-xl hover:bg-yellow-600 transition-colors text-center"
                  >
                    <SafeIcon icon={FiBook} className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-montserrat font-bold">Continue Learning</div>
                    <div className="text-sm opacity-90">Level up skills</div>
                  </Link>
                  <Link
                    to="/chefs-table"
                    className="bg-charcoal text-white p-4 rounded-xl hover:bg-gray-800 transition-colors text-center"
                  >
                    <SafeIcon icon={FiUser} className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-montserrat font-bold">Chef's Table</div>
                    <div className="text-sm opacity-90">Connect & share</div>
                  </Link>
                </div>
              </div>

              {/* Learning Progress */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-xl font-montserrat font-bold text-charcoal mb-4">
                  Learning Progress
                </h3>

                {inProgressCourses.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-montserrat font-bold text-charcoal mb-3">Continue Learning</h4>
                    <div className="space-y-3">
                      {inProgressCourses.map((progress) => (
                        <div key={progress.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-montserrat font-bold text-charcoal">
                              {progress.courses_chef_brigade.title}
                            </h5>
                            <span className="text-sm font-montserrat font-bold text-primary">
                              {progress.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress.progress}%` }}
                            />
                          </div>
                          <button className="bg-primary text-white px-4 py-2 rounded-lg font-lato font-medium hover:bg-red-800 transition-colors text-sm">
                            Continue Course
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {completedCourses.length > 0 && (
                  <div>
                    <h4 className="font-montserrat font-bold text-charcoal mb-3">Completed Courses</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {completedCourses.map((progress) => (
                        <div key={progress.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <h5 className="font-montserrat font-bold text-charcoal text-sm">
                            {progress.courses_chef_brigade.title}
                          </h5>
                          <div className="flex items-center space-x-2 mt-2">
                            <SafeIcon icon={FiAward} className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-lato text-green-800">Completed</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {userProgress.length === 0 && (
                  <div className="text-center py-6">
                    <SafeIcon icon={FiBook} className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="font-lato text-gray-600">
                      No courses started yet.{' '}
                      <Link to="/leadership-levelup" className="text-primary hover:text-red-800 font-medium">
                        Start learning →
                      </Link>
                    </p>
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-xl font-montserrat font-bold text-charcoal mb-4">
                  Leadership Badges
                </h3>

                {user.badges && user.badges.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {user.badges.map((badgeId) => {
                      const badge = badgeDefinitions[badgeId];
                      if (!badge) return null;

                      return (
                        <div
                          key={badgeId}
                          className={`p-4 rounded-xl border-2 ${badge.color.replace('text-', 'border-').replace('bg-', 'bg-opacity-20 bg-')}`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${badge.color}`}>
                              <SafeIcon icon={badge.icon} className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-montserrat font-bold text-charcoal text-sm">
                                {badge.name}
                              </h4>
                              <p className="font-lato text-gray-600 text-xs">
                                {badge.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <SafeIcon icon={FiAward} className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="font-lato text-gray-600">
                      Complete activities to earn leadership badges!
                    </p>
                  </div>
                )}
              </div>

              {/* Recent Journal Activity */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-montserrat font-bold text-charcoal">
                    Recent Reflections
                  </h3>
                  <Link
                    to="/journal"
                    className="text-primary hover:text-red-800 font-lato font-medium text-sm"
                  >
                    View all →
                  </Link>
                </div>

                {entries.slice(0, 3).map((entry) => (
                  <div key={entry.id} className="border-l-4 border-primary pl-4 mb-4 last:mb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-lato text-gray-500">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-lato text-charcoal text-sm line-clamp-2">
                      {entry.content}
                    </p>
                  </div>
                ))}

                {entries.length === 0 && (
                  <div className="text-center py-6">
                    <SafeIcon icon={FiCalendar} className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="font-lato text-gray-600 mb-3">
                      Start your leadership reflection journey.
                    </p>
                    <Link
                      to="/journal"
                      className="bg-primary text-white px-4 py-2 rounded-lg font-lato font-medium hover:bg-red-800 transition-colors"
                    >
                      Write First Entry
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MyChefcoat;