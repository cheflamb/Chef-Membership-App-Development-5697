import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CoursesContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBook, FiVideo, FiUser, FiClock, FiUsers, FiStar, FiPlay, FiCalendar } = FiIcons;

const Courses = () => {
  const { user } = useAuth();
  const { courses, liveSession, enrollInCourse, registerForSession } = useCourses();
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'All Categories',
    'Baking & Pastry',
    'Cooking Techniques',
    'International Cuisine',
    'Knife Skills',
    'Molecular Gastronomy',
    'Food Safety',
    'Restaurant Management'
  ];

  const upcomingSessions = liveSession.filter(session => 
    new Date(session.scheduledFor) > new Date()
  ).sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor));

  const filteredCourses = courses.filter(course => {
    if (selectedCategory === 'all') return true;
    return course.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600';
      case 'intermediate': return 'text-yellow-600';
      case 'advanced': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleEnroll = (courseId) => {
    if (user) {
      enrollInCourse(courseId);
      // In real app, this would handle payment and enrollment
      alert('Successfully enrolled in course!');
    }
  };

  const handleRegister = (sessionId) => {
    if (user) {
      registerForSession(sessionId);
      alert('Successfully registered for live session!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Culinary Learning Hub
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master your craft with expert-led courses, live masterclasses, and hands-on workshops from world-class chefs
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setActiveTab('courses')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'courses'
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                <SafeIcon icon={FiBook} className="inline h-4 w-4 mr-2" />
                Courses
              </button>
              <button
                onClick={() => setActiveTab('live')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'live'
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                <SafeIcon icon={FiVideo} className="inline h-4 w-4 mr-2" />
                Live Sessions
              </button>
            </div>
          </div>

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <>
              {/* Category Filter */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-2 justify-center">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category === 'All Categories' ? 'all' : category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === (category === 'All Categories' ? 'all' : category)
                          ? 'bg-orange-600 text-white'
                          : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Courses Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${getDifficultyColor(course.difficulty)}`}>
                          {course.difficulty.toUpperCase()}
                        </span>
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiStar} className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{course.rating}</span>
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-gray-900 text-lg mb-2">{course.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                      
                      <div className="flex items-center space-x-2 mb-4">
                        <img
                          src={course.instructor.avatar}
                          alt={course.instructor.name}
                          className="h-6 w-6 rounded-full"
                        />
                        <span className="text-sm text-gray-600">{course.instructor.name}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <SafeIcon icon={FiBook} className="h-4 w-4" />
                            <span>{course.lessons} lessons</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <SafeIcon icon={FiUsers} className="h-4 w-4" />
                            <span>{course.enrolled}</span>
                          </div>
                        </div>
                        <span className="font-bold text-orange-600">${course.price}</span>
                      </div>

                      <button
                        onClick={() => handleEnroll(course.id)}
                        disabled={!user}
                        className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        {user ? 'Enroll Now' : 'Sign In to Enroll'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* Live Sessions Tab */}
          {activeTab === 'live' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Live Sessions</h2>
                <p className="text-gray-600">Join interactive sessions with expert chefs in real-time</p>
              </div>

              {upcomingSessions.length > 0 ? (
                <div className="space-y-6">
                  {upcomingSessions.map((session) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <SafeIcon icon={FiVideo} className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">{session.title}</h3>
                              <span className="text-sm text-blue-600 font-medium">
                                {session.type.toUpperCase()}
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-600 mb-4">{session.description}</p>

                          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500 mb-4">
                            <div className="flex items-center space-x-2">
                              <SafeIcon icon={FiCalendar} className="h-4 w-4" />
                              <span>{new Date(session.scheduledFor).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <SafeIcon icon={FiClock} className="h-4 w-4" />
                              <span>{new Date(session.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <SafeIcon icon={FiUsers} className="h-4 w-4" />
                              <span>{session.registrations}/{session.maxParticipants}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <SafeIcon icon={FiUser} className="h-4 w-4" />
                              <span>{session.host.name}</span>
                            </div>
                          </div>

                          {session.materials && session.materials.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-medium text-gray-900 mb-2">Required Materials:</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {session.materials.filter(material => material).map((material, index) => (
                                  <li key={index}>• {material}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-orange-600 mb-2">
                            {session.price > 0 ? `$${session.price}` : 'FREE'}
                          </div>
                          <button
                            onClick={() => handleRegister(session.id)}
                            disabled={!user || session.registrations >= session.maxParticipants}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                          >
                            {!user ? 'Sign In to Register' : 
                             session.registrations >= session.maxParticipants ? 'Full' : 'Register'}
                          </button>
                          {session.isRecorded && (
                            <p className="text-xs text-gray-500 mt-2">Recording available</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <SafeIcon icon={FiVideo} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming sessions</h3>
                  <p className="text-gray-600">Check back soon for new live sessions!</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Courses;