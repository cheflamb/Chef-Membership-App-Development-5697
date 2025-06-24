import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import supabase from '../lib/supabase';

const JournalContext = createContext();

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};

export const JournalProvider = ({ children }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [todaysPrompt, setTodaysPrompt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [streakData, setStreakData] = useState({
    current: 0,
    longest: 0,
    thisMonth: 0
  });

  const prompts = [
    "What's one leadership moment from today that you're proud of?",
    "How did you show up for your team today? What could you do better tomorrow?",
    "What's weighing on your mind as a leader right now?",
    "Describe a time today when you felt truly present in your kitchen.",
    "What's one thing you learned about yourself as a leader this week?",
    "How are you taking care of yourself so you can take care of others?",
    "What would your best day as a leader look like?",
    "What's one toxic pattern you're working to change in your kitchen?",
    "How did you handle stress today? What worked? What didn't?",
    "What's one way you showed empathy to a team member recently?",
    "What leadership principle are you trying to embody this month?",
    "How are you creating psychological safety in your kitchen?",
    "What's one difficult conversation you've been avoiding?",
    "How do you want to be remembered as a leader?",
    "What's working well in your leadership right now? What isn't?",
    "When did you last feel truly energized by your work?",
    "What would you tell a younger version of yourself about leadership?",
    "How do you balance being firm and being compassionate?",
    "What's one small change that could make a big difference in your kitchen?",
    "What are you most grateful for in your leadership journey right now?"
  ];

  useEffect(() => {
    if (user) {
      fetchTodaysPrompt();
      fetchEntries();
    }
  }, [user]);

  const fetchTodaysPrompt = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const promptIndex = dayOfYear % prompts.length;
    
    setTodaysPrompt({
      id: dayOfYear,
      text: prompts[promptIndex],
      date: today.toISOString().split('T')[0]
    });
  };

  const fetchEntries = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('journal_entries_chef_brigade')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching journal entries:', error);
        // Fall back to localStorage
        loadFromLocalStorage();
      } else {
        setEntries(data || []);
        calculateStreaks(data || []);
      }
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      // Fall back to localStorage
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    if (!user) return;
    
    const saved = localStorage.getItem(`journal_entries_${user.id}`);
    if (saved) {
      const entries = JSON.parse(saved);
      setEntries(entries);
      calculateStreaks(entries);
    }
  };

  const saveToLocalStorage = (entries) => {
    if (!user) return;
    localStorage.setItem(`journal_entries_${user.id}`, JSON.stringify(entries));
  };

  const calculateStreaks = (entriesData) => {
    if (entriesData.length === 0) {
      setStreakData({ current: 0, longest: 0, thisMonth: 0 });
      return;
    }

    const today = new Date();
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();

    // Calculate current streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let thisMonthCount = 0;

    // Sort entries by date
    const sortedEntries = entriesData
      .map(entry => ({
        ...entry,
        date: new Date(entry.created_at).toISOString().split('T')[0]
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Get unique dates (in case of multiple entries per day)
    const uniqueDates = [...new Set(sortedEntries.map(entry => entry.date))];

    // Count this month's entries
    thisMonthCount = entriesData.filter(entry => {
      const entryDate = new Date(entry.created_at);
      return entryDate.getMonth() === thisMonth && entryDate.getFullYear() === thisYear;
    }).length;

    // Calculate current streak from today backwards
    for (let i = 0; i < uniqueDates.length; i++) {
      const entryDate = new Date(uniqueDates[i]);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (entryDate.toDateString() === expectedDate.toDateString()) {
        currentStreak++;
      } else if (i === 0 && entryDate.toDateString() !== today.toDateString()) {
        // If no entry today, check yesterday
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        if (entryDate.toDateString() === yesterday.toDateString()) {
          currentStreak++;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    // Calculate longest streak
    for (let i = 0; i < uniqueDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const currentDate = new Date(uniqueDates[i]);
        const previousDate = new Date(uniqueDates[i - 1]);
        const dayDifference = (previousDate - currentDate) / (1000 * 60 * 60 * 24);
        
        if (dayDifference === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    setStreakData({
      current: currentStreak,
      longest: longestStreak,
      thisMonth: thisMonthCount
    });
  };

  const saveEntry = async (content, mood, isPrivate = false) => {
    if (!user || !content.trim()) return;

    const newEntry = {
      id: Date.now(), // Fallback ID for localStorage
      user_id: user.id,
      content: content.trim(),
      mood,
      prompt_id: todaysPrompt?.id,
      is_private: isPrivate,
      created_at: new Date().toISOString()
    };

    try {
      // Try to save to Supabase first
      const { data, error } = await supabase
        .from('journal_entries_chef_brigade')
        .insert([newEntry])
        .select()
        .single();

      if (error) {
        console.error('Error saving to Supabase:', error);
        // Fall back to localStorage
        const updatedEntries = [newEntry, ...entries];
        setEntries(updatedEntries);
        saveToLocalStorage(updatedEntries);
        calculateStreaks(updatedEntries);
      } else {
        const updatedEntries = [data, ...entries];
        setEntries(updatedEntries);
        calculateStreaks(updatedEntries);
      }

      return newEntry;
    } catch (error) {
      console.error('Error saving journal entry:', error);
      // Fall back to localStorage
      const updatedEntries = [newEntry, ...entries];
      setEntries(updatedEntries);
      saveToLocalStorage(updatedEntries);
      calculateStreaks(updatedEntries);
      return newEntry;
    }
  };

  const updateEntry = async (entryId, updates) => {
    try {
      const { error } = await supabase
        .from('journal_entries_chef_brigade')
        .update(updates)
        .eq('id', entryId);

      if (error) {
        console.error('Error updating entry:', error);
      }

      // Update local state regardless
      const updatedEntries = entries.map(entry =>
        entry.id === entryId ? { ...entry, ...updates } : entry
      );
      setEntries(updatedEntries);
      saveToLocalStorage(updatedEntries);
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  const deleteEntry = async (entryId) => {
    try {
      const { error } = await supabase
        .from('journal_entries_chef_brigade')
        .delete()
        .eq('id', entryId);

      if (error) {
        console.error('Error deleting entry:', error);
      }

      // Update local state regardless
      const updatedEntries = entries.filter(entry => entry.id !== entryId);
      setEntries(updatedEntries);
      saveToLocalStorage(updatedEntries);
      calculateStreaks(updatedEntries);
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const getTodaysEntry = () => {
    const today = new Date().toISOString().split('T')[0];
    return entries.find(entry => 
      entry.created_at.split('T')[0] === today
    );
  };

  const getEntriesByDateRange = (startDate, endDate) => {
    return entries.filter(entry => {
      const entryDate = new Date(entry.created_at);
      return entryDate >= startDate && entryDate <= endDate;
    });
  };

  const getMoodAnalysis = () => {
    if (entries.length === 0) return null;

    const moodCounts = entries.reduce((acc, entry) => {
      if (entry.mood) {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      }
      return acc;
    }, {});

    const totalEntries = entries.filter(entry => entry.mood).length;
    const averageMood = entries
      .filter(entry => entry.mood)
      .reduce((sum, entry) => sum + entry.mood, 0) / totalEntries;

    return {
      counts: moodCounts,
      average: Math.round(averageMood * 10) / 10,
      total: totalEntries
    };
  };

  const value = {
    entries,
    todaysPrompt,
    loading,
    streakData,
    saveEntry,
    updateEntry,
    deleteEntry,
    getTodaysEntry,
    getEntriesByDateRange,
    getMoodAnalysis,
    fetchEntries
  };

  return (
    <JournalContext.Provider value={value}>
      {children}
    </JournalContext.Provider>
  );
};