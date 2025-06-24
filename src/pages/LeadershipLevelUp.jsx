import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';
import * as FiIcons from 'react-icons/fi';

const { FiBook, FiPlay, FiClock, FiUsers, FiStar, FiLock, FiCheck, FiArrowRight } = FiIcons;

const LeadershipLevelUp = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchCourses();
    if (user) {
      fetchUserProgress();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses_chef_brigade')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_progress_chef_brigade')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const progressMap = {};
      data?.forEach(item => {
        progressMap[item.course_id] = item.progress;
      });
      setUserProgress(progressMap);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  };

  const categories = [
    'All Courses',
    'Leadership Fundamentals',
    'Communication',
    'Team Building',
    'Conflict Resolution',
    'Personal Growth'
  ];

  const filteredCourses = courses.filter(course => {
    if (selectedCategory === 'all' || selectedCategory === 'All Courses') return true;
    return course.category === selectedCategory;
  });

  const canAccessCourse = (course) => {
    if (!user) return course.tier_required === 'free';
    
    const tierHierarchy = ['free', 'brigade', 'fraternity', 'guild'];
    const userTierIndex = tierHierarchy.indexOf(user.tier);
    const requiredTierIndex = tierHierarchy.indexOf(course.tier_required);
    
    return userTierIndex >= requiredTierIndex;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'free': return { label: 'FREE', color: 'bg-gray-100 text-gray-800' };
      case 'brigade': return { label: 'BRIGADE', color: 'bg-red-100 text-red-800' };
      case 'fraternity': return { label: 'FRATERNITY', color: 'bg-yellow-100 text-yellow-800' };
      case 'guild': return { label: 'GUILD', color: 'bg-gold text-charcoal' };
      default: return { label: 'FREE', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const startCourse = async (courseId) => {
    if (!user) return;
    
    try {
      await supabase
        .from('user_progress_chef_brigade')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          progress: 0
        });
      
      fetchUserProgress();
    } catch (error) {
      console.error('Error starting course:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-montserrat font-bold text-charcoal mb-4">
              Leadership LevelUp
            </h1>
            <p className="text-xl font-lato text-gray-600 max-w-3xl mx-auto">
              Develop the leadership skills that transform kitchens and careers. No cooking tips—just proven leadership development.
            </p>
          </div>

          {/* Welcome Message for New Users */}
          {!user && (
            <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-12 text-center">
              <div className="bg-primary p-4 rounded-xl mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <SafeIcon icon={FiBook} className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-montserrat font-bold text-charcoal mb-2">
                Start with Kitchen Leadership 101
              </h2>
              <p className="font-lato text-gray-600 mb-6">
                Get instant access to our foundational leadership course when you join The Brigade.
              </p>
              <Link
                to="/join"
                className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg font-lato font-medium hover:bg-red-800 transition-colors"
              >
                <span>Join Free & Start Kitchen Leadership 101</span>
                <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category === 'All Courses' ? 'all' : category)}
                  className={`px-4 py-2 rounded-full text-sm font-lato font-medium transition-colors ${
                    selectedCategory === (category === 'All Courses' ? 'all' : category)
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-600 hover:bg-red-50 hover:text-primary border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => {
              const canAccess = canAccessCourse(course);
              const tierBadge = getTierBadge(course.tier_required);
              const progress = userProgress[course.id] || 0;
              const hasStarted = progress > 0;
              
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Course Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-primary to-red-800 flex items-center justify-center">
                    {canAccess ? (
                      <SafeIcon icon={FiBook} className="h-16 w-16 text-white" />
                    ) : (
                      <SafeIcon icon={FiLock} className="h-16 w-16 text-white" />
                    )}
                  </div>

                  <div className="p-6">
                    {/* Course Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-montserrat font-bold ${getDifficultyColor(course.difficulty)}`}>
                          {course.difficulty.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-montserrat font-bold ${tierBadge.color}`}>
                          {tierBadge.label}
                        </span>
                      </div>
                      {course.price > 0 && (
                        <span className="text-lg font-montserrat font-bold text-primary">
                          ${course.price}
                        </span>
                      )}
                    </div>

                    <h3 className="font-montserrat font-bold text-charcoal text-lg mb-2">
                      {course.title}
                    </h3>
                    
                    <p className="font-lato text-gray-600 text-sm mb-4 line-clamp-3">
                      {course.description}
                    </p>

                    {/* Course Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiPlay} className="h-4 w-4" />
                          <span>{course.lessons?.length || 0} lessons</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiClock} className="h-4 w-4" />
                          <span>
                            {course.lessons?.reduce((total, lesson) => total + (lesson.duration || 0), 0) || 0} min
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar (if started) */}
                    {hasStarted && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-lato text-gray-600">Progress</span>
                          <span className="font-montserrat font-bold text-primary">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    {canAccess ? (
                      <button
                        onClick={() => !hasStarted && startCourse(course.id)}
                        className="w-full bg-primary text-white py-3 rounded-lg font-lato font-medium hover:bg-red-800 transition-colors flex items-center justify-center space-x-2"
                      >
                        {hasStarted ? (
                          <>
                            <SafeIcon icon={FiPlay} className="h-4 w-4" />
                            <span>Continue Learning</span>
                          </>
                        ) : (
                          <>
                            <SafeIcon icon={FiPlay} className="h-4 w-4" />
                            <span>Start Course</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="text-center">
                        <div className="bg-gray-100 text-gray-600 py-3 rounded-lg font-lato font-medium mb-2 flex items-center justify-center space-x-2">
                          <SafeIcon icon={FiLock} className="h-4 w-4" />
                          <span>Requires {tierBadge.label} Membership</span>
                        </div>
                        {!user ? (
                          <Link
                            to="/join"
                            className="text-primary font-lato font-medium hover:text-red-800 text-sm"
                          >
                            Join to unlock →
                          </Link>
                        ) : (
                          <Link
                            to="/pricing"
                            className="text-primary font-lato font-medium hover:text-red-800 text-sm"
                          >
                            Upgrade membership →
                          </Link>
                        )}
                      </div>
                    )}

                    {/* Learning Outcomes Preview */}
                    {course.learning_outcomes && course.learning_outcomes.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="font-montserrat font-bold text-charcoal text-sm mb-2">
                          What You'll Learn:
                        </h4>
                        <ul className="space-y-1">
                          {course.learning_outcomes.slice(0, 2).map((outcome, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <SafeIcon icon={FiCheck} className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                              <span className="text-xs font-lato text-gray-600">{outcome}</span>
                            </li>
                          ))}
                          {course.learning_outcomes.length > 2 && (
                            <li className="text-xs font-lato text-primary">
                              +{course.learning_outcomes.length - 2} more outcomes
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <SafeIcon icon={FiBook} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-montserrat font-bold text-gray-900 mb-2">
                No courses found
              </h3>
              <p className="font-lato text-gray-600">
                Try selecting a different category or check back soon for new content.
              </p>
            </div>
          )}

          {/* Call to Action for Non-Users */}
          {!user && (
            <div className="mt-16 bg-gradient-to-r from-primary to-red-800 rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-montserrat font-bold text-white mb-4">
                Ready to Level Up Your Leadership?
              </h2>
              <p className="text-xl font-lato text-red-100 mb-8">
                Join The Brigade and get instant access to Kitchen Leadership 101 plus our supportive community.
              </p>
              <Link
                to="/join"
                className="inline-flex items-center space-x-2 bg-white text-primary px-8 py-4 rounded-lg text-lg font-lato font-medium hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Join Free & Start Learning</span>
                <SafeIcon icon={FiArrowRight} className="h-5 w-5" />
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LeadershipLevelUp;