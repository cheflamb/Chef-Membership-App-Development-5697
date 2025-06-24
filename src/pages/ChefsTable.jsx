import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiHeart, FiMessageCircle, FiShare2, FiEdit3, FiArrowRight, FiLock } = FiIcons;

const ChefsTable = () => {
  const { user } = useAuth();
  const [newPost, setNewPost] = useState('');

  const posts = [
    {
      id: 1,
      author: {
        name: 'Chef Marcus Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        tier: 'brigade'
      },
      content: 'Had a breakthrough with my sous chef today. Instead of micromanaging, I asked "What support do you need to succeed?" The shift in their body language was immediate. Sometimes the best leadership is just asking the right questions. #PresenceOverPosition',
      timestamp: '2 hours ago',
      likes: 12,
      comments: 3,
      shares: 1
    },
    {
      id: 2,
      author: {
        name: 'Chef Sarah Thompson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9a9b2f1?w=150&h=150&fit=crop&crop=face',
        tier: 'guild'
      },
      content: 'Implemented the "dignity not domination" principle during tonight\'s dinner rush. Even when we were slammed, I made sure every correction came with respect. The energy in the kitchen stayed positive, and service flowed better than ever. This stuff really works.',
      timestamp: '4 hours ago',
      likes: 18,
      comments: 7,
      shares: 2
    },
    {
      id: 3,
      author: {
        name: 'Chef David Kim',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        tier: 'fraternity'
      },
      content: 'Week 3 of daily check-ins with my team. What started as awkward 5-minute conversations has become the best part of my day. My line cooks are sharing ideas I never would have heard otherwise. Leadership isn\'t about having all the answers - it\'s about creating space for others to contribute theirs.',
      timestamp: '6 hours ago',
      likes: 23,
      comments: 9,
      shares: 4
    },
    {
      id: 4,
      author: {
        name: 'Chef Amanda Foster',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        tier: 'brigade'
      },
      content: 'Honest moment: I used to think showing emotion was weakness. Today I teared up thanking my team for pulling through a crazy weekend. Instead of losing respect, I saw them stand taller. Vulnerability isn\'t weakness - it\'s connection. #LeadFromTheHeart',
      timestamp: '8 hours ago',
      likes: 31,
      comments: 12,
      shares: 6
    }
  ];

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
      case 'free': return 'FREE';
      case 'brigade': return 'BRIGADE';
      case 'fraternity': return 'FRATERNITY';
      case 'guild': return 'GUILD';
      default: return 'MEMBER';
    }
  };

  const handleSubmitPost = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    
    // In real app, this would save to Supabase
    console.log('New post:', newPost);
    setNewPost('');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <SafeIcon icon={FiLock} className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-montserrat font-bold text-charcoal mb-2">
              Join Chef's Table
            </h2>
            <p className="font-lato text-gray-600 mb-6">
              Connect with fellow culinary leaders in a supportive community
            </p>
            <Link
              to="/join"
              className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg font-lato font-medium hover:bg-red-800 transition-colors"
            >
              <span>Join Free</span>
              <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
            </Link>
          </div>

          {/* Preview posts with blur */}
          <div className="relative">
            <div className="absolute inset-0 bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl z-10"></div>
            <div className="space-y-6 opacity-50">
              {posts.slice(0, 2).map((post) => (
                <div key={post.id} className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.name} 
                      className="h-12 w-12 rounded-full" 
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-lato font-medium text-charcoal">{post.author.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-montserrat font-bold border ${getTierColor(post.author.tier)}`}>
                          {getTierLabel(post.author.tier)}
                        </span>
                      </div>
                      <p className="font-lato text-charcoal leading-relaxed">
                        {post.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-montserrat font-bold text-charcoal mb-2">
              Chef's Table
            </h1>
            <p className="font-lato text-gray-600">
              A place for real conversations about leadership, growth, and building better teams
            </p>
          </div>

          {/* Create Post */}
          <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-200">
            <form onSubmit={handleSubmitPost}>
              <div className="flex items-start space-x-4">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="h-12 w-12 rounded-full" 
                />
                <div className="flex-1">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share a leadership insight, challenge, or win from your kitchen..."
                    className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-lato"
                    rows={3}
                  />
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm font-lato text-gray-500">
                      Keep it real, keep it supportive
                    </span>
                    <button
                      type="submit"
                      disabled={!newPost.trim()}
                      className="bg-primary text-white px-4 py-2 rounded-lg font-lato font-medium hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name} 
                    className="h-12 w-12 rounded-full" 
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-lato font-medium text-charcoal">{post.author.name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-montserrat font-bold border ${getTierColor(post.author.tier)}`}>
                        {getTierLabel(post.author.tier)}
                      </span>
                      <span className="text-sm font-lato text-gray-500">{post.timestamp}</span>
                    </div>
                    <p className="font-lato text-charcoal leading-relaxed mb-4">
                      {post.content}
                    </p>

                    {/* Post Actions */}
                    <div className="flex items-center space-x-6">
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-primary transition-colors">
                        <SafeIcon icon={FiHeart} className="h-4 w-4" />
                        <span className="text-sm font-lato">{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-primary transition-colors">
                        <SafeIcon icon={FiMessageCircle} className="h-4 w-4" />
                        <span className="text-sm font-lato">{post.comments}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-primary transition-colors">
                        <SafeIcon icon={FiShare2} className="h-4 w-4" />
                        <span className="text-sm font-lato">{post.shares}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Community Guidelines */}
          <div className="mt-12 bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="font-montserrat font-bold text-charcoal mb-4">Chef's Table Guidelines</h3>
            <ul className="space-y-2 font-lato text-gray-600">
              <li>• Focus on leadership, growth, and team building</li>
              <li>• Share real experiences, challenges, and wins</li>
              <li>• Support fellow chefs with constructive feedback</li>
              <li>• No toxic behavior, personal attacks, or drama</li>
              <li>• Keep conversations professional and respectful</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChefsTable;