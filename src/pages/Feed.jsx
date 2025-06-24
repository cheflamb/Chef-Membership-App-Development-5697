import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useFeed } from '../context/FeedContext';
import CreatePost from '../components/CreatePost';
import FeedPost from '../components/FeedPost';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiUsers, FiBookOpen, FiLock } = FiIcons;

const Feed = () => {
  const { user } = useAuth();
  const { posts } = useFeed();
  const [activeFilter, setActiveFilter] = useState('all');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <SafeIcon icon={FiLock} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Required</h2>
          <p className="text-gray-600">Please sign in to access the community feed.</p>
        </div>
      </div>
    );
  }

  const filters = [
    { id: 'all', label: 'All Posts', icon: FiTrendingUp },
    { id: 'following', label: 'Following', icon: FiUsers },
    { id: 'premium', label: 'Premium', icon: FiBookOpen },
  ];

  const filteredPosts = posts.filter(post => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'following') return true; // Simulate following filter
    if (activeFilter === 'premium') return post.type === 'premium';
    return true;
  });

  const canViewPremium = user.tier === 'pro' || user.tier === 'master';

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Community Feed</h1>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <SafeIcon icon={filter.icon} className="h-4 w-4" />
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Create Post */}
          <CreatePost />

          {/* Feed Posts */}
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <FeedPost 
                key={post.id} 
                post={post} 
                canViewPremium={canViewPremium}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <SafeIcon icon={FiUsers} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
              <p className="text-gray-600">Be the first to share something with the community!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Feed;