import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import CourseVideoManager from '../components/CourseVideoManager';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiBook, FiUsers, FiClock, FiAward, FiLock, FiCheck } = FiIcons;

const CourseViewer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canAccess, setCanAccess] = useState(false);
  const [userProgress, setUserProgress] = useState(null);

  useEffect(() => {
    fetchCourse();
    if (user) {
      checkAccess();
      fetchUserProgress();
    }
  }, [courseId, user]);

  const fetchCourse = async () => {
    try {
      const { data, error } = await supabase
        .from('courses_chef_brigade')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) throw error;
      setCourse(data);
    } catch (error) {
      console.error('Error fetching course:', error);
      navigate('/leadership-levelup');
    } finally {
      setLoading(false);
    }
  };

  const checkAccess = () => {
    if (!user || !course) return;

    // Check if user can access this course
    const tierHierarchy = ['free', 'brigade', 'fraternity', 'guild'];
    const userTierIndex = tierHierarchy.indexOf(user.tier);
    const requiredTierIndex = tierHierarchy.indexOf(course.tier_required);
    
    setCanAccess(userTierIndex >= requiredTierIndex);
  };

  const fetchUserProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_progress_chef_brigade')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setUserProgress(data);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  };

  const startCourse = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_progress_chef_brigade')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          progress: 0,
          started_at: new Date().toISOString()
        });

      if (error) throw error;
      fetchUserProgress();
    } catch (error) {
      console.error('Error starting course:', error);
    }
  };

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'free':
        return { label: 'FREE', color: 'bg-gray-100 text-gray-800' };
      case 'brigade':
        return { label: 'BRIGADE', color: 'bg-red-100 text-red-800' };
      case 'fraternity':
        return { label: 'FRATERNITY', color: 'bg-yellow-100 text-yellow-800' };
      case 'guild':
        return { label: 'GUILD', color: 'bg-purple-100 text-purple-800' };
      default:
        return { label: 'FREE', color: 'bg-gray-100 text-gray-800' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <SafeIcon icon={FiBook} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const tierBadge = getTierBadge(course.tier_required);
  const isInstructor = user?.id === course.created_by;

  if (!user) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <SafeIcon icon={FiLock} className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to access this course.</p>
            <button
              onClick={() => navigate('/join')}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!canAccess && !isInstructor) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <SafeIcon icon={FiLock} className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Premium Content</h2>
            <p className="text-gray-600 mb-4">
              This course requires {tierBadge.label} membership to access.
            </p>
            <p className="text-gray-500 mb-6">
              Upgrade your membership to unlock this and other premium content.
            </p>
            <button
              onClick={() => navigate('/pricing')}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-colors"
            >
              Upgrade Membership
            </button>
          </div>
        </div>
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
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate('/leadership-levelup')}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="h-6 w-6" />
            </button>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${tierBadge.color}`}>
                  {tierBadge.label}
                </span>
              </div>
              <p className="text-gray-600">{course.description}</p>
            </div>
          </div>

          {/* Course Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiUsers} className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Enrolled</p>
                  <p className="font-semibold text-gray-900">{course.enrolled || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiClock} className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold text-gray-900">{course.duration || 'Self-paced'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiBook} className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Difficulty</p>
                  <p className="font-semibold text-gray-900 capitalize">{course.difficulty}</p>
                </div>
              </div>
            </div>
            
            {userProgress && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiAward} className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Progress</p>
                    <p className="font-semibold text-gray-900">{userProgress.progress || 0}%</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Start Course Button */}
          {!userProgress && !isInstructor && (
            <div className="bg-white rounded-lg p-6 border border-gray-200 mb-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Start Learning?</h3>
                <p className="text-gray-600 mb-4">
                  Begin your journey with this comprehensive leadership course.
                </p>
                <button
                  onClick={startCourse}
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-colors"
                >
                  Start Course
                </button>
              </div>
            </div>
          )}

          {/* Video Manager */}
          <CourseVideoManager 
            courseId={courseId} 
            isInstructor={isInstructor}
          />

          {/* Learning Outcomes */}
          {course.learning_outcomes && course.learning_outcomes.length > 0 && (
            <div className="mt-8 bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Learn</h3>
              <ul className="grid md:grid-cols-2 gap-2">
                {course.learning_outcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <SafeIcon icon={FiCheck} className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {course.requirements && course.requirements.length > 0 && (
            <div className="mt-6 bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
              <ul className="space-y-2">
                {course.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <SafeIcon icon={FiBook} className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CourseViewer;