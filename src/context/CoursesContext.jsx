import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const CoursesContext = createContext();

export const useCourses = () => {
  const context = useContext(CoursesContext);
  if (!context) {
    throw new Error('useCourses must be used within a CoursesProvider');
  }
  return context;
};

export const CoursesProvider = ({ children }) => {
  const { user } = useAuth();
  
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: 'Advanced Pastry Techniques',
      description: 'Master the art of professional pastry making with advanced techniques used in Michelin-starred restaurants.',
      category: 'Baking & Pastry',
      difficulty: 'advanced',
      price: 299,
      thumbnail: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop',
      instructor: {
        id: 1,
        name: 'Chef Isabella',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9a9b2f1?w=150&h=150&fit=crop&crop=face'
      },
      enrolled: 127,
      lessons: 12,
      duration: '8 weeks',
      status: 'published',
      rating: 4.9,
      createdAt: '2024-01-10T00:00:00Z',
      learningOutcomes: [
        'Master lamination techniques for croissants and puff pastry',
        'Create perfect macarons with consistent results',
        'Understanding chocolate tempering and bonbon making'
      ],
      requirements: [
        'Basic baking knowledge',
        'Access to a kitchen with oven',
        'Basic pastry tools'
      ]
    },
    {
      id: 2,
      title: 'Molecular Gastronomy Fundamentals',
      description: 'Explore the science behind modern cooking techniques and create stunning culinary presentations.',
      category: 'Molecular Gastronomy',
      difficulty: 'intermediate',
      price: 199,
      thumbnail: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop',
      instructor: {
        id: 1,
        name: 'Chef Isabella',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9a9b2f1?w=150&h=150&fit=crop&crop=face'
      },
      enrolled: 89,
      lessons: 8,
      duration: '6 weeks',
      status: 'published',
      rating: 4.7,
      createdAt: '2024-01-15T00:00:00Z'
    }
  ]);

  const [liveSession, setLiveSessions] = useState([
    {
      id: 1,
      title: 'Live Q&A: Knife Skills Masterclass',
      description: 'Interactive session covering proper knife techniques, maintenance, and safety practices.',
      type: 'q&a',
      scheduledFor: '2024-02-15T19:00:00Z',
      duration: 60,
      maxParticipants: 50,
      price: 25,
      host: {
        id: 1,
        name: 'Chef Isabella',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9a9b2f1?w=150&h=150&fit=crop&crop=face'
      },
      status: 'scheduled',
      registrations: 32,
      isRecorded: true,
      materials: ['Sharp chef knife', 'Cutting board', 'Various vegetables for practice'],
      agenda: [
        'Introduction and safety overview (5 mins)',
        'Knife grip and posture demonstration (10 mins)',
        'Basic cuts: julienne, dice, chiffonade (20 mins)',
        'Q&A and practice troubleshooting (20 mins)',
        'Wrap-up and next steps (5 mins)'
      ]
    },
    {
      id: 2,
      title: 'Advanced Sauce Making Workshop',
      description: 'Hands-on workshop covering mother sauces and their variations.',
      type: 'workshop',
      scheduledFor: '2024-02-20T18:00:00Z',
      duration: 90,
      maxParticipants: 30,
      price: 45,
      host: {
        id: 1,
        name: 'Chef Isabella',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9a9b2f1?w=150&h=150&fit=crop&crop=face'
      },
      status: 'scheduled',
      registrations: 18,
      isRecorded: true
    }
  ]);

  const addCourse = (course) => {
    setCourses(prev => [course, ...prev]);
  };

  const updateCourse = (updatedCourse) => {
    setCourses(prev => prev.map(course => 
      course.id === updatedCourse.id ? updatedCourse : course
    ));
  };

  const deleteCourse = (courseId) => {
    setCourses(prev => prev.filter(course => course.id !== courseId));
  };

  const addLiveSession = (session) => {
    setLiveSessions(prev => [session, ...prev]);
  };

  const updateLiveSession = (updatedSession) => {
    setLiveSessions(prev => prev.map(session => 
      session.id === updatedSession.id ? updatedSession : session
    ));
  };

  const deleteLiveSession = (sessionId) => {
    setLiveSessions(prev => prev.filter(session => session.id !== sessionId));
  };

  const enrollInCourse = (courseId) => {
    setCourses(prev => prev.map(course =>
      course.id === courseId 
        ? { ...course, enrolled: course.enrolled + 1 }
        : course
    ));
  };

  const registerForSession = (sessionId) => {
    setLiveSessions(prev => prev.map(session =>
      session.id === sessionId 
        ? { ...session, registrations: session.registrations + 1 }
        : session
    ));
  };

  const value = {
    courses,
    liveSession,
    addCourse,
    updateCourse,
    deleteCourse,
    addLiveSession,
    updateLiveSession,
    deleteLiveSession,
    enrollInCourse,
    registerForSession
  };

  return (
    <CoursesContext.Provider value={value}>
      {children}
    </CoursesContext.Provider>
  );
};