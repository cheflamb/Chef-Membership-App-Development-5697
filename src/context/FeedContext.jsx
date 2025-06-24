import React, { createContext, useContext, useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';

const FeedContext = createContext();

export const useFeed = () => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
};

export const FeedProvider = ({ children }) => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: {
        name: 'Chef Isabella',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9a9b2f1?w=150&h=150&fit=crop&crop=face',
        tier: 'master',
        verified: true
      },
      content: 'Just finished creating a new molecular gastronomy course! The science behind perfect spherification is fascinating. Can\'t wait to share this with my Master tier students! 🧪✨',
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop',
      timestamp: '2 hours ago',
      likes: 234,
      comments: 45,
      shares: 12,
      tags: ['molecular', 'gastronomy', 'course'],
      type: 'premium'
    },
    {
      id: 2,
      author: {
        name: 'Chef Marcus',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        tier: 'pro',
        verified: true
      },
      content: 'Today\'s special: Pan-seared duck breast with cherry gastrique. The key is getting that perfect crispy skin while keeping the meat tender and juicy. What\'s your go-to duck preparation?',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop',
      timestamp: '4 hours ago',
      likes: 189,
      comments: 32,
      shares: 8,
      tags: ['duck', 'technique', 'plating']
    },
    {
      id: 3,
      author: {
        name: 'Chef Sophia',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        tier: 'basic',
        verified: false
      },
      content: 'Learning so much from the ChefConnect community! Just mastered the perfect risotto technique thanks to the video tutorials. The patience required is incredible but so worth it! 🍚',
      image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&h=400&fit=crop',
      timestamp: '6 hours ago',
      likes: 156,
      comments: 28,
      shares: 5,
      tags: ['risotto', 'learning', 'technique']
    },
    {
      id: 4,
      author: {
        name: 'Chef Antoine',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        tier: 'master',
        verified: true
      },
      content: 'Exclusive Master Class Alert! 🎓 Tomorrow I\'ll be hosting a live session on advanced pastry techniques. We\'ll cover lamination, temperature control, and my secret to perfect croissants. Master tier only!',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop',
      timestamp: '8 hours ago',
      likes: 312,
      comments: 67,
      shares: 23,
      tags: ['pastry', 'masterclass', 'croissants'],
      type: 'premium'
    }
  ]);

  const addPost = (newPost) => {
    const post = {
      id: Date.now(),
      ...newPost,
      timestamp: 'now',
      likes: 0,
      comments: 0,
      shares: 0
    };
    setPosts([post, ...posts]);
  };

  const likePost = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const value = {
    posts,
    addPost,
    likePost
  };

  return (
    <FeedContext.Provider value={value}>
      {children}
    </FeedContext.Provider>
  );
};