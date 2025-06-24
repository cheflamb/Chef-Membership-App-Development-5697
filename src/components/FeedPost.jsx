import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFeed } from '../context/FeedContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHeart, FiMessageCircle, FiShare2, FiMoreHorizontal, FiLock, FiCheckCircle } = FiIcons;

const FeedPost = ({ post, canViewPremium }) => {
  const { likePost } = useFeed();
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    likePost(post.id);
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'basic': return 'text-green-600';
      case 'pro': return 'text-blue-600';
      case 'master': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const isPremiumContent = post.type === 'premium';
  const canView = !isPremiumContent || canViewPremium;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* Post Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="h-12 w-12 rounded-full"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                {post.author.verified && (
                  <SafeIcon icon={FiCheckCircle} className="h-4 w-4 text-blue-500" />
                )}
                <span className={`text-sm font-medium ${getTierColor(post.author.tier)}`}>
                  {post.author.tier.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-500">{post.timestamp}</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <SafeIcon icon={FiMoreHorizontal} className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-6 pb-4">
        {isPremiumContent && !canView ? (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6 text-center">
            <SafeIcon icon={FiLock} className="h-12 w-12 text-orange-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Premium Content</h4>
            <p className="text-gray-600 mb-4">
              This exclusive content is available to Pro and Master members only.
            </p>
            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
              Upgrade to Access
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-900 mb-4 whitespace-pre-wrap">{post.content}</p>
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Post Image */}
            {post.image && (
              <div className="mb-4">
                <img
                  src={post.image}
                  alt="Post content"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-colors ${
                isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
              }`}
            >
              <SafeIcon icon={FiHeart} className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{post.likes}</span>
            </button>
            
            <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors">
              <SafeIcon icon={FiMessageCircle} className="h-5 w-5" />
              <span className="text-sm font-medium">{post.comments}</span>
            </button>
            
            <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors">
              <SafeIcon icon={FiShare2} className="h-5 w-5" />
              <span className="text-sm font-medium">{post.shares}</span>
            </button>
          </div>

          {isPremiumContent && canView && (
            <div className="flex items-center space-x-1 text-orange-600">
              <SafeIcon icon={FiLock} className="h-4 w-4" />
              <span className="text-sm font-medium">Premium</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FeedPost;