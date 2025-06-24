import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useJournal } from '../context/JournalContext';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiEdit3, FiHeart, FiCalendar, FiTrendingUp, FiSmile, FiMeh, FiFrown, 
  FiSave, FiLock, FiEye, FiEyeOff, FiTrash2, FiPlus, FiBarChart3
} = FiIcons;

const Journal = () => {
  const { user } = useAuth();
  const { 
    todaysPrompt, 
    saveEntry, 
    getTodaysEntry, 
    entries, 
    loading, 
    streakData, 
    getMoodAnalysis,
    deleteEntry 
  } = useJournal();
  
  const [journalEntry, setJournalEntry] = useState('');
  const [mood, setMood] = useState(3);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('today');
  const [selectedEntry, setSelectedEntry] = useState(null);

  const todaysEntry = getTodaysEntry();

  useEffect(() => {
    if (todaysEntry) {
      setJournalEntry(todaysEntry.content);
      setMood(todaysEntry.mood || 3);
      setIsPrivate(todaysEntry.is_private || false);
    }
  }, [todaysEntry]);

  const moodOptions = [
    { value: 1, icon: FiFrown, label: 'Struggling', color: 'text-red-500', bg: 'bg-red-100' },
    { value: 2, icon: FiMeh, label: 'Challenging', color: 'text-orange-500', bg: 'bg-orange-100' },
    { value: 3, icon: FiSmile, label: 'Good', color: 'text-yellow-500', bg: 'bg-yellow-100' },
    { value: 4, icon: FiSmile, label: 'Strong', color: 'text-green-500', bg: 'bg-green-100' },
    { value: 5, icon: FiHeart, label: 'Excellent', color: 'text-primary', bg: 'bg-red-100' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!journalEntry.trim()) return;

    setIsSubmitting(true);
    try {
      await saveEntry(journalEntry, mood, isPrivate);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (confirm('Are you sure you want to delete this journal entry?')) {
      await deleteEntry(entryId);
      setSelectedEntry(null);
    }
  };

  const moodAnalysis = getMoodAnalysis();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
        <div className="text-center max-w-md">
          <SafeIcon icon={FiLock} className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-montserrat font-bold text-charcoal mb-2">
            Leadership Journal
          </h2>
          <p className="font-lato text-gray-600 mb-6">
            Daily reflection prompts to develop your leadership mindset
          </p>
          <Link
            to="/join"
            className="bg-primary text-white px-6 py-3 rounded-lg font-lato font-medium hover:bg-red-800 transition-colors"
          >
            Join to Start Journaling
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-montserrat font-bold text-charcoal mb-2">
              Leadership Journal
            </h1>
            <p className="font-lato text-gray-600">
              Daily reflection to strengthen your leadership mindset
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
              {[
                { id: 'today', label: 'Today\'s Entry' },
                { id: 'history', label: 'Journal History' },
                { id: 'insights', label: 'Insights' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2 rounded-md font-lato font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Today's Entry Tab */}
              {activeTab === 'today' && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-6">
                    <SafeIcon icon={FiCalendar} className="h-5 w-5 text-primary" />
                    <span className="font-montserrat font-bold text-charcoal">
                      {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  {todaysPrompt && (
                    <div className="bg-background rounded-xl p-6 mb-6 border-l-4 border-primary">
                      <h3 className="font-montserrat font-bold text-charcoal mb-2">Today's Prompt</h3>
                      <p className="font-playfair italic text-lg text-charcoal">
                        "{todaysPrompt.text}"
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    {/* Mood Check */}
                    <div className="mb-6">
                      <h4 className="font-lato font-medium text-charcoal mb-3">
                        How are you feeling as a leader today?
                      </h4>
                      <div className="flex space-x-2 md:space-x-4">
                        {moodOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setMood(option.value)}
                            className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                              mood === option.value
                                ? `border-primary ${option.bg}`
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <SafeIcon icon={option.icon} className={`h-6 w-6 ${option.color} mb-1`} />
                            <span className="text-xs font-lato text-charcoal">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Entry Privacy */}
                    <div className="mb-6">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={isPrivate}
                          onChange={(e) => setIsPrivate(e.target.checked)}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <span className="font-lato text-gray-700 text-sm">
                          Keep this entry private (only visible to you)
                        </span>
                        <SafeIcon icon={isPrivate ? FiEyeOff : FiEye} className="h-4 w-4 text-gray-400" />
                      </label>
                    </div>

                    {/* Journal Entry */}
                    <div className="mb-6">
                      <textarea
                        value={journalEntry}
                        onChange={(e) => setJournalEntry(e.target.value)}
                        placeholder="Take a moment to reflect on your leadership journey today..."
                        className="w-full h-48 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-lato"
                      />
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm font-lato text-gray-500">
                          {journalEntry.length} characters
                        </span>
                        {journalEntry.length > 500 && (
                          <span className="text-sm font-lato text-green-600">
                            Great depth! 🌟
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-sm font-lato text-gray-500">
                        {todaysEntry ? 'Update your entry' : 'Write your first entry'} for today
                      </p>
                      <button
                        type="submit"
                        disabled={!journalEntry.trim() || isSubmitting}
                        className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg font-lato font-medium hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <SafeIcon icon={FiSave} className="h-4 w-4" />
                        <span>
                          {isSubmitting ? 'Saving...' : (todaysEntry ? 'Update Entry' : 'Save Entry')}
                        </span>
                      </button>
                    </div>
                  </form>

                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <p className="text-sm text-green-600 font-lato">Entry saved successfully!</p>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Journal History Tab */}
              {activeTab === 'history' && (
                <div className="space-y-4">
                  {entries.length > 0 ? (
                    entries.map((entry) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedEntry(selectedEntry?.id === entry.id ? null : entry)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="font-lato text-gray-500 text-sm">
                              {new Date(entry.created_at).toLocaleDateString()}
                            </span>
                            {entry.mood && (
                              <SafeIcon
                                icon={moodOptions.find(m => m.value === entry.mood)?.icon || FiSmile}
                                className={`h-4 w-4 ${moodOptions.find(m => m.value === entry.mood)?.color || 'text-gray-400'}`}
                              />
                            )}
                            {entry.is_private && (
                              <SafeIcon icon={FiEyeOff} className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteEntry(entry.id);
                            }}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <p className={`font-lato text-charcoal ${
                          selectedEntry?.id === entry.id ? '' : 'line-clamp-3'
                        }`}>
                          {entry.content}
                        </p>
                        
                        {selectedEntry?.id !== entry.id && (
                          <p className="text-sm text-primary mt-2 font-lato">
                            Click to read full entry →
                          </p>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-white rounded-2xl">
                      <SafeIcon icon={FiEdit3} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No entries yet</h3>
                      <p className="text-gray-600 mb-6">Start your leadership reflection journey today!</p>
                      <button
                        onClick={() => setActiveTab('today')}
                        className="bg-primary text-white px-6 py-3 rounded-lg font-lato font-medium hover:bg-red-800 transition-colors"
                      >
                        Write First Entry
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Insights Tab */}
              {activeTab === 'insights' && (
                <div className="space-y-6">
                  {/* Mood Analysis */}
                  {moodAnalysis && (
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <h3 className="text-lg font-montserrat font-bold text-charcoal mb-4">
                        Mood Patterns
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm font-lato text-gray-600 mb-3">
                            Average Mood Score: <span className="font-bold text-primary">{moodAnalysis.average}/5</span>
                          </p>
                          <div className="space-y-2">
                            {moodOptions.map((option) => {
                              const count = moodAnalysis.counts[option.value] || 0;
                              const percentage = moodAnalysis.total > 0 ? (count / moodAnalysis.total) * 100 : 0;
                              return (
                                <div key={option.value} className="flex items-center space-x-3">
                                  <SafeIcon icon={option.icon} className={`h-4 w-4 ${option.color}`} />
                                  <span className="text-sm font-lato text-gray-700 flex-1">{option.label}</span>
                                  <span className="text-sm font-lato text-gray-500">{count} ({Math.round(percentage)}%)</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="bg-background rounded-lg p-4">
                          <h4 className="font-montserrat font-bold text-charcoal mb-2">Insights</h4>
                          <ul className="space-y-2 text-sm font-lato text-gray-600">
                            {moodAnalysis.average >= 4 && (
                              <li>🌟 You're maintaining strong emotional leadership!</li>
                            )}
                            {moodAnalysis.average < 3 && (
                              <li>💪 Consider focusing on self-care and stress management.</li>
                            )}
                            {streakData.current >= 7 && (
                              <li>🔥 Your consistency is building powerful self-awareness!</li>
                            )}
                            <li>📈 Keep reflecting to strengthen your leadership mindset.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Writing Prompts */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <h3 className="text-lg font-montserrat font-bold text-charcoal mb-4">
                      Additional Reflection Prompts
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        "What's one leadership skill you want to develop this month?",
                        "How do you handle feedback from your team?",
                        "What's your biggest leadership challenge right now?",
                        "When do you feel most confident as a leader?",
                        "How do you maintain work-life balance?",
                        "What would your ideal kitchen culture look like?"
                      ].map((prompt, index) => (
                        <div key={index} className="bg-background rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer">
                          <p className="text-sm font-lato text-charcoal italic">"{prompt}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Streak Stats */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="font-montserrat font-bold text-charcoal mb-4">Your Progress</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-lato text-gray-600">Current Streak</span>
                    <span className="font-montserrat font-bold text-primary text-xl">
                      {streakData.current} 🔥
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-lato text-gray-600">Longest Streak</span>
                    <span className="font-montserrat font-bold text-charcoal">
                      {streakData.longest} days
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-lato text-gray-600">This Month</span>
                    <span className="font-montserrat font-bold text-charcoal">
                      {streakData.thisMonth} entries
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-lato text-gray-600">Total Entries</span>
                    <span className="font-montserrat font-bold text-charcoal">
                      {entries.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Journal Tips */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="font-montserrat font-bold text-charcoal mb-4">Reflection Tips</h3>
                <ul className="space-y-2 font-lato text-gray-600 text-sm">
                  <li>• Be honest about your challenges</li>
                  <li>• Celebrate small wins and progress</li>
                  <li>• Focus on specific situations</li>
                  <li>• Consider how you can grow tomorrow</li>
                  <li>• Write consistently, even if brief</li>
                  <li>• Use the mood tracker to spot patterns</li>
                </ul>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="font-montserrat font-bold text-charcoal mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('today')}
                    className="w-full bg-primary text-white py-2 px-4 rounded-lg font-lato font-medium hover:bg-red-800 transition-colors"
                  >
                    Today's Entry
                  </button>
                  <Link
                    to="/leadership-levelup"
                    className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-lato font-medium hover:bg-gray-200 transition-colors text-center"
                  >
                    Continue Learning
                  </Link>
                  <Link
                    to="/chefs-table"
                    className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-lato font-medium hover:bg-gray-200 transition-colors text-center"
                  >
                    Share in Community
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Journal;