import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const useContentCalendar = () => {
  const { user } = useAuth();
  const [scheduledContent, setScheduledContent] = useState([]);

  useEffect(() => {
    if (user) {
      // Load scheduled content from localStorage
      const saved = localStorage.getItem(`scheduled_content_${user.id}`);
      if (saved) {
        setScheduledContent(JSON.parse(saved));
      } else {
        // Initialize with some sample data
        const sampleContent = [
          {
            id: 1,
            title: 'Leadership Communication Masterclass',
            type: 'live-session',
            description: 'Deep dive into effective kitchen communication',
            scheduledDate: '2024-01-25',
            scheduledTime: '14:00',
            targetTier: 'all',
            estimatedDuration: 90,
            status: 'scheduled',
            createdAt: new Date().toISOString(),
            createdBy: user.id
          },
          {
            id: 2,
            title: 'New Course: Managing Kitchen Stress',
            type: 'course',
            description: 'Strategies for handling high-pressure situations',
            scheduledDate: '2024-01-28',
            scheduledTime: '10:00',
            targetTier: 'fraternity',
            estimatedDuration: 120,
            status: 'draft',
            createdAt: new Date().toISOString(),
            createdBy: user.id
          }
        ];
        setScheduledContent(sampleContent);
        localStorage.setItem(`scheduled_content_${user.id}`, JSON.stringify(sampleContent));
      }
    }
  }, [user]);

  const saveToStorage = (content) => {
    if (user) {
      localStorage.setItem(`scheduled_content_${user.id}`, JSON.stringify(content));
    }
  };

  const addScheduledContent = (content) => {
    const updated = [...scheduledContent, content];
    setScheduledContent(updated);
    saveToStorage(updated);
  };

  const updateScheduledContent = (id, updates) => {
    const updated = scheduledContent.map(item =>
      item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
    );
    setScheduledContent(updated);
    saveToStorage(updated);
  };

  const deleteScheduledContent = (id) => {
    const updated = scheduledContent.filter(item => item.id !== id);
    setScheduledContent(updated);
    saveToStorage(updated);
  };

  const getContentForDate = (date) => {
    return scheduledContent.filter(content => content.scheduledDate === date);
  };

  const getUpcomingContent = (days = 7) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return scheduledContent
      .filter(content => {
        const contentDate = new Date(content.scheduledDate);
        return contentDate >= today && contentDate <= futureDate;
      })
      .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
  };

  return {
    scheduledContent,
    addScheduledContent,
    updateScheduledContent,
    deleteScheduledContent,
    getContentForDate,
    getUpcomingContent
  };
};