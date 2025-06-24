import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useContentCalendar } from '../hooks/useContentCalendar';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiPlus, FiEdit3, FiTrash2, FiClock, FiUsers, FiVideo, FiBookOpen, FiMic } = FiIcons;

const ContentCalendar = () => {
  const { user } = useAuth();
  const { scheduledContent, addScheduledContent, updateScheduledContent, deleteScheduledContent, getContentForDate } = useContentCalendar();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [newContent, setNewContent] = useState({
    title: '',
    type: 'course',
    description: '',
    scheduledDate: '',
    scheduledTime: '14:00',
    targetTier: 'all',
    estimatedDuration: 60,
    status: 'draft',
    notes: ''
  });

  const contentTypes = [
    { value: 'course', label: 'Course Release', icon: FiBookOpen, color: 'bg-blue-500' },
    { value: 'live-session', label: 'Live Session', icon: FiVideo, color: 'bg-red-500' },
    { value: 'podcast', label: 'Podcast Episode', icon: FiMic, color: 'bg-purple-500' },
    { value: 'announcement', label: 'Announcement', icon: FiUsers, color: 'bg-green-500' }
  ];

  const memberTiers = [
    { value: 'all', label: 'All Members' },
    { value: 'brigade', label: 'Brigade Only' },
    { value: 'fraternity', label: 'Fraternity & Above' },
    { value: 'guild', label: 'Guild Only' }
  ];

  // Generate calendar days
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleCreateContent = () => {
    const content = {
      id: Date.now(),
      ...newContent,
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };

    addScheduledContent(content);
    setNewContent({
      title: '',
      type: 'course',
      description: '',
      scheduledDate: '',
      scheduledTime: '14:00',
      targetTier: 'all',
      estimatedDuration: 60,
      status: 'draft',
      notes: ''
    });
    setShowCreateForm(false);
  };

  const handleEditContent = (content) => {
    setEditingContent(content);
    setNewContent(content);
    setShowCreateForm(true);
  };

  const handleUpdateContent = () => {
    updateScheduledContent(editingContent.id, newContent);
    setEditingContent(null);
    setNewContent({
      title: '',
      type: 'course',
      description: '',
      scheduledDate: '',
      scheduledTime: '14:00',
      targetTier: 'all',
      estimatedDuration: 60,
      status: 'draft',
      notes: ''
    });
    setShowCreateForm(false);
  };

  const getContentTypeStyle = (type) => {
    const contentType = contentTypes.find(ct => ct.value === type);
    return contentType ? contentType.color : 'bg-gray-500';
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Content Calendar</h1>
              <p className="text-gray-600 mt-1">Plan and schedule your Brigade content</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <SafeIcon icon={FiPlus} className="h-4 w-4" />
              <span>Schedule Content</span>
            </button>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Calendar Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                      className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setCurrentDate(new Date())}
                      className="px-3 py-1 bg-orange-100 text-orange-600 rounded text-sm font-medium hover:bg-orange-200 transition-colors"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                      className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      →
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="p-6">
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day, index) => {
                      const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                      const isToday = formatDate(day) === formatDate(today);
                      const dayContent = getContentForDate(formatDate(day));

                      return (
                        <div
                          key={index}
                          className={`min-h-[100px] p-2 border border-gray-100 rounded-lg cursor-pointer transition-colors ${
                            isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 text-gray-400'
                          } ${isToday ? 'ring-2 ring-orange-500' : ''}`}
                          onClick={() => setSelectedDate(day)}
                        >
                          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-orange-600' : ''}`}>
                            {day.getDate()}
                          </div>
                          <div className="space-y-1">
                            {dayContent.map((content) => (
                              <div
                                key={content.id}
                                className={`text-xs p-1 rounded text-white truncate ${getContentTypeStyle(content.type)}`}
                                title={content.title}
                              >
                                {content.title}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Content */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Content</h3>
                <div className="space-y-4">
                  {scheduledContent
                    .filter(content => new Date(content.scheduledDate) >= today)
                    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
                    .slice(0, 5)
                    .map((content) => (
                      <div key={content.id} className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${getContentTypeStyle(content.type)}`}>
                          <SafeIcon 
                            icon={contentTypes.find(ct => ct.value === content.type)?.icon || FiCalendar} 
                            className="h-4 w-4 text-white" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{content.title}</p>
                          <p className="text-xs text-gray-600">
                            {new Date(content.scheduledDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEditContent(content)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <SafeIcon icon={FiEdit3} className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => deleteScheduledContent(content.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <SafeIcon icon={FiTrash2} className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Content Types Legend */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Types</h3>
                <div className="space-y-3">
                  {contentTypes.map((type) => (
                    <div key={type.value} className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${type.color}`}>
                        <SafeIcon icon={type.icon} className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm text-gray-700">{type.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Create/Edit Content Modal */}
          {showCreateForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingContent ? 'Edit Scheduled Content' : 'Schedule New Content'}
                  </h2>
                </div>

                <div className="p-6 space-y-6">
                  {/* Content Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Type *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {contentTypes.map((type) => (
                        <label
                          key={type.value}
                          className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                            newContent.type === type.value
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="contentType"
                            value={type.value}
                            checked={newContent.type === type.value}
                            onChange={(e) => setNewContent({ ...newContent, type: e.target.value })}
                            className="sr-only"
                          />
                          <div className="flex items-center space-x-2">
                            <SafeIcon icon={type.icon} className="h-5 w-5 text-gray-600" />
                            <span className="font-medium text-gray-900">{type.label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={newContent.title}
                      onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter content title"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newContent.description}
                      onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Brief description of the content"
                    />
                  </div>

                  {/* Schedule Details */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={newContent.scheduledDate}
                        onChange={(e) => setNewContent({ ...newContent, scheduledDate: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        value={newContent.scheduledTime}
                        onChange={(e) => setNewContent({ ...newContent, scheduledTime: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Target Audience */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Audience
                      </label>
                      <select
                        value={newContent.targetTier}
                        onChange={(e) => setNewContent({ ...newContent, targetTier: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        {memberTiers.map((tier) => (
                          <option key={tier.value} value={tier.value}>{tier.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={newContent.estimatedDuration}
                        onChange={(e) => setNewContent({ ...newContent, estimatedDuration: parseInt(e.target.value) })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        min="5"
                        step="5"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={newContent.notes}
                      onChange={(e) => setNewContent({ ...newContent, notes: e.target.value })}
                      rows={2}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Internal notes or reminders"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingContent(null);
                      setNewContent({
                        title: '',
                        type: 'course',
                        description: '',
                        scheduledDate: '',
                        scheduledTime: '14:00',
                        targetTier: 'all',
                        estimatedDuration: 60,
                        status: 'draft',
                        notes: ''
                      });
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingContent ? handleUpdateContent : handleCreateContent}
                    disabled={!newContent.title || !newContent.scheduledDate}
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {editingContent ? 'Update' : 'Schedule'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ContentCalendar;