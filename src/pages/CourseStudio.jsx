import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CoursesContext';
import CourseBuilder from '../components/CourseBuilder';
import LiveSessionScheduler from '../components/LiveSessionScheduler';
import CohortManager from '../components/CohortManager';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiBook, FiVideo, FiUsers, FiCalendar, FiBarChart3, FiSettings, FiAward } = FiIcons;

const CourseStudio = () => {
  const { user } = useAuth();
  const { courses, liveSessions } = useCourses();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCourseBuilder, setShowCourseBuilder] = useState(false);
  const [showSessionScheduler, setShowSessionScheduler] = useState(false);

  // Check if user can host content (Brigade/Fraternity/Guild members)
  const canHostContent = user?.tier === 'brigade' || user?.tier === 'fraternity' || user?.tier === 'guild';

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <SafeIcon icon={FiAward} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Required</h2>
          <p className="text-gray-600">Please sign in to access Leadership Studio.</p>
        </div>
      </div>
    );
  }

  if (!canHostContent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <SafeIcon icon={FiAward} className="h-16 w-16 text-orange-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Brigade Membership Required</h2>
          <p className="text-gray-600 mb-6">Leadership Studio is available for Brigade, Fraternity, and Guild members.</p>
          <button className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg hover:from-orange-700 hover:to-red-700 transition-colors">
            Upgrade Membership
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBarChart3 },
    { id: 'courses', label: 'Leadership Library', icon: FiBook },
    { id: 'sessions', label: 'Live Coaching', icon: FiVideo },
    { id: 'cohorts', label: 'Leadership Programs', icon: FiAward },
    { id: 'analytics', label: 'Analytics', icon: FiBarChart3 },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ];

  const myCourses = courses.filter(course => course.instructor.id === user.id);
  const myLiveSessions = liveSessions.filter(session => session.host.id === user.id);
  const upcomingSessions = myLiveSessions.filter(session => new Date(session.scheduledFor) > new Date());

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Leadership Studio</h1>
                <p className="text-gray-600 mt-1">Create and manage leadership development content and coaching sessions</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSessionScheduler(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <SafeIcon icon={FiVideo} className="h-4 w-4" />
                  <span>Schedule Coaching</span>
                </button>
                <button
                  onClick={() => setShowCourseBuilder(true)}
                  className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <SafeIcon icon={FiPlus} className="h-4 w-4" />
                  <span>Create Content</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'border-orange-600 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <SafeIcon icon={tab.icon} className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid md:grid-cols-4 gap-6">
                    {[
                      { label: 'Leadership Resources', value: myCourses.length, icon: FiBook, color: 'text-blue-600' },
                      { label: 'Coaching Sessions', value: myLiveSessions.length, icon: FiVideo, color: 'text-green-600' },
                      { label: 'Leaders Developed', value: myCourses.reduce((sum, course) => sum + course.enrolled, 0), icon: FiUsers, color: 'text-purple-600' },
                      { label: 'Upcoming Sessions', value: upcomingSessions.length, icon: FiCalendar, color: 'text-orange-600' }
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="bg-gray-50 rounded-xl p-6"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                          </div>
                          <SafeIcon icon={stat.icon} className={`h-8 w-8 ${stat.color}`} />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Leadership Activity</h3>
                    <div className="space-y-3">
                      {[
                        { type: 'course', title: 'Leadership Communication Masterclass', action: '12 new enrollments', time: '2 hours ago' },
                        { type: 'session', title: 'Monthly Brigade Coaching Call', action: 'Session completed - 45 attendees', time: '1 day ago' },
                        { type: 'cohort', title: 'Leadership Bootcamp Spring 2024', action: 'Week 3 completed successfully', time: '3 days ago' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3 py-2">
                          <SafeIcon 
                            icon={activity.type === 'course' ? FiBook : activity.type === 'session' ? FiVideo : FiAward} 
                            className="h-5 w-5 text-gray-400" 
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-600">{activity.action}</p>
                          </div>
                          <span className="text-sm text-gray-400">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Leadership Library Tab */}
              {activeTab === 'courses' && (
                <div className="space-y-6">
                  {myCourses.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myCourses.map((course) => (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                course.status === 'published' ? 'bg-green-100 text-green-800' :
                                course.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {course.status}
                              </span>
                              <span className="text-lg font-bold text-orange-600">${course.price}</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                            <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span>{course.enrolled} leaders</span>
                              <span>{course.lessons} lessons</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <SafeIcon icon={FiBook} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No leadership content yet</h3>
                      <p className="text-gray-600 mb-6">Create your first leadership development resource!</p>
                      <button
                        onClick={() => setShowCourseBuilder(true)}
                        className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        Create Leadership Content
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Live Coaching Tab */}
              {activeTab === 'sessions' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Coaching Sessions</h3>
                    {upcomingSessions.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingSessions.map((session) => (
                          <motion.div
                            key={session.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-blue-50 border border-blue-200 rounded-xl p-6"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-1">{session.title}</h4>
                                <p className="text-sm text-gray-600 mb-2">{session.description}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span>{new Date(session.scheduledFor).toLocaleDateString()}</span>
                                  <span>{new Date(session.scheduledFor).toLocaleTimeString()}</span>
                                  <span>{session.maxParticipants} max participants</span>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                  Join Session
                                </button>
                                <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                                  Edit
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-xl">
                        <SafeIcon icon={FiVideo} className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">No upcoming coaching sessions scheduled</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Leadership Programs Tab */}
              {activeTab === 'cohorts' && (
                <CohortManager />
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="text-center py-12">
                  <SafeIcon icon={FiBarChart3} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Leadership Impact Analytics</h3>
                  <p className="text-gray-600">Detailed analytics and impact metrics coming soon!</p>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="text-center py-12">
                  <SafeIcon icon={FiSettings} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Studio Settings</h3>
                  <p className="text-gray-600">Leadership content and coaching settings coming soon!</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Modals */}
        {showCourseBuilder && (
          <CourseBuilder onClose={() => setShowCourseBuilder(false)} />
        )}

        {showSessionScheduler && (
          <LiveSessionScheduler onClose={() => setShowSessionScheduler(false)} />
        )}
      </div>
    </div>
  );
};

export default CourseStudio;