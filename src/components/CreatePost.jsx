import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useFeed } from '../context/FeedContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCamera, FiSend, FiX } = FiIcons;

const CreatePost = () => {
  const { user } = useAuth();
  const { addPost } = useFeed();
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newPost = {
      author: {
        name: user.name,
        avatar: user.avatar,
        tier: user.tier,
        verified: user.tier !== 'basic'
      },
      content: content.trim(),
      image: image || null,
      tags: extractTags(content)
    };

    addPost(newPost);
    setContent('');
    setImage('');
    setIsExpanded(false);
  };

  const extractTags = (text) => {
    const tags = text.match(/#\w+/g);
    return tags ? tags.map(tag => tag.slice(1)) : [];
  };

  const sampleImages = [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl shadow-sm p-6 mb-6"
    >
      <div className="flex items-start space-x-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="h-12 w-12 rounded-full"
        />
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="Share your culinary thoughts, recipes, or techniques..."
              className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={isExpanded ? 4 : 2}
            />

            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                {/* Image Selection */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add an image (optional)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {sampleImages.map((img, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setImage(image === img ? '' : img)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          image === img 
                            ? 'border-orange-500 ring-2 ring-orange-200' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Option ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {image === img && (
                          <div className="absolute inset-0 bg-orange-500 bg-opacity-20 flex items-center justify-center">
                            <SafeIcon icon={FiX} className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      Use hashtags to categorize your post
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsExpanded(false);
                        setContent('');
                        setImage('');
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!content.trim()}
                      className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <SafeIcon icon={FiSend} className="h-4 w-4" />
                      <span>Post</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default CreatePost;