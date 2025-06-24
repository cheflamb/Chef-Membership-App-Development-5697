import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useFeed } from '../context/FeedContext';
import NotificationSettings from '../components/NotificationSettings';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiCalendar, FiUsers, FiBookOpen, FiSettings, FiEdit3, FiSave, FiX, FiBell } = FiIcons;

const Profile = () => {
  const { user } = useAuth();
  const { posts } = useFeed();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [editedUser, setEditedUser] = useState(user || {});

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <SafeIcon icon={FiUser} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Access Required</h2>
          <p className="text-gray-600">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  const userPosts = posts.filter(post => post.author.name === user.name);

  const getTierColor = (tier) => {
    switch (tier) {
      case 'basic': return 'bg-green-100 text-green-800 border-green-200';
      case 'pro': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'master': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'basic': return '🥉';
      case 'pro': return '🥈';
      case 'master': return '🥇';
      default: return '👤';
    }
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const tabs = [
    { id: 'posts', label: `My Posts (${userPosts.length})`, icon: FiBookOpen },
    { id: 'achievements', label: 'Achievements', icon: FiUser },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 h-32"></div>
            <div className="relative px-6 pb-6">
              <div className="flex items-end space-x-6 -mt-16">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-32 w-32 rounded-full border-4 border-white shadow-lg"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedUser.name}
                          onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                          className="text-2xl font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded-lg px-3 py-1"
                        />
                      ) : (
                        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                      )}
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTierColor(user.tier)}`}>
                          {getTierBadge(user.tier)} {user.tier.toUpperCase()} MEMBER
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleSave}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <SafeIcon icon={FiSave} className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <SafeIcon icon={FiX} className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          <SafeIcon icon={FiEdit3} className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Posts', value: user.posts, icon: FiBookOpen, color: 'text-blue-600' },
              { label: 'Followers', value: user.followers.toLocaleString(), icon: FiUsers, color: 'text-green-600' },
              { label: 'Following', value: user.following.toLocaleString(), icon: FiUsers, color: 'text-purple-600' },
              { label: 'Member Since', value: new Date(user.joinDate).getFullYear(), icon: FiCalendar, color: 'text-orange-600' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6"
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

          {/* Content Tabs */}
          <div className="bg-white rounded-2xl shadow-lg">
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
              {/* My Posts Tab */}
              {activeTab === 'posts' && (
                <div className="space-y-6">
                  {userPosts.length > 0 ? (
                    userPosts.map((post) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start space-x-3">
                          {post.image && (
                            <img
                              src={post.image}
                              alt="Post"
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <p className="text-gray-900 mb-2">{post.content}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{post.timestamp}</span>
                              <span>{post.likes} likes</span>
                              <span>{post.comments} comments</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <SafeIcon icon={FiBookOpen} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                      <p className="text-gray-600">Share your first post with the community!</p>
                    </div>
                  )}
                </div>
              )}

              {/* Achievements Tab */}
              {activeTab === 'achievements' && (
                <div className="text-center py-12">
                  <SafeIcon icon={FiUser} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Achievements Coming Soon</h3>
                  <p className="text-gray-600">Track your culinary milestones and badges here.</p>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <NotificationSettings />
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="text-center py-12">
                  <SafeIcon icon={FiSettings} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Account Settings</h3>
                  <p className="text-gray-600">Manage your account preferences and privacy settings.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;