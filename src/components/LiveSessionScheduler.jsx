import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCourses } from '../context/CoursesContext';
import { useNotifications } from '../hooks/useNotifications';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiCalendar, FiClock, FiUsers, FiVideo, FiSettings, FiMic, FiMicOff } = FiIcons;

const LiveSessionScheduler = ({ onClose }) => {
  const { addLiveSession } = useCourses();
  const { addNotification } = useNotifications();
  const [sessionData, setSessionData] = useState({
    title: '',
    description: '',
    type: 'masterclass',
    scheduledFor: '',
    duration: 60,
    maxParticipants: 50,
    price: 0,
    isRecorded: true,
    requiresRegistration: true,
    materials: [''],
    agenda: ['']
  });

  const sessionTypes = [
    { value: 'masterclass', label: 'Masterclass', description: 'In-depth teaching session' },
    { value: 'q&a', label: 'Q&A Session', description: 'Interactive question and answer' },
    { value: 'workshop', label: 'Workshop', description: 'Hands-on cooking session' },
    { value: 'demo', label: 'Cooking Demo', description: 'Live cooking demonstration' },
    { value: 'cohort', label: 'Cohort Session', description: 'Group coaching session' }
  ];

  const handleScheduleSession = () => {
    const session = {
      id: Date.now(),
      ...sessionData,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      registrations: []
    };

    addLiveSession(session);

    // Send notification to followers
    addNotification({
      title: 'New Live Session Scheduled! 📺',
      message: `"${session.title}" is scheduled for ${new Date(session.scheduledFor).toLocaleDateString()}`,
      type: 'live',
      action: { type: 'navigate', path: '/courses' }
    });

    onClose();
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0); // Default to 2 PM
    return tomorrow.toISOString().slice(0, 16);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Schedule Live Session</h2>
              <p className="text-gray-600">Create an engaging live experience for your audience</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <SafeIcon icon={FiX} className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Title *
                </label>
                <input
                  type="text"
                  value={sessionData.title}
                  onChange={(e) => setSessionData({ ...sessionData, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Advanced Knife Skills Masterclass"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={sessionData.description}
                  onChange={(e) => setSessionData({ ...sessionData, description: e.target.value })}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe what participants will learn and do in this session..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Type *
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {sessionTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                        sessionData.type === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="sessionType"
                        value={type.value}
                        checked={sessionData.type === type.value}
                        onChange={(e) => setSessionData({ ...sessionData, type: e.target.value })}
                        className="sr-only"
                      />
                      <div className="font-medium text-gray-900">{type.label}</div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Schedule & Settings */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date & Time *
                </label>
                <div className="relative">
                  <SafeIcon icon={FiCalendar} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="datetime-local"
                    value={sessionData.scheduledFor || getTomorrowDate()}
                    onChange={(e) => setSessionData({ ...sessionData, scheduledFor: e.target.value })}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) *
                </label>
                <div className="relative">
                  <SafeIcon icon={FiClock} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={sessionData.duration}
                    onChange={(e) => setSessionData({ ...sessionData, duration: parseInt(e.target.value) })}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Participants *
                </label>
                <div className="relative">
                  <SafeIcon icon={FiUsers} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    value={sessionData.maxParticipants}
                    onChange={(e) => setSessionData({ ...sessionData, maxParticipants: parseInt(e.target.value) || 0 })}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Price (USD)
                </label>
                <input
                  type="number"
                  value={sessionData.price}
                  onChange={(e) => setSessionData({ ...sessionData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                  placeholder="0.00 (Free)"
                />
              </div>
            </div>

            {/* Session Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Session Options</h3>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={sessionData.isRecorded}
                    onChange={(e) => setSessionData({ ...sessionData, isRecorded: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Record Session</span>
                    <p className="text-sm text-gray-600">Recording will be available to participants after the session</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={sessionData.requiresRegistration}
                    onChange={(e) => setSessionData({ ...sessionData, requiresRegistration: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Require Registration</span>
                    <p className="text-sm text-gray-600">Participants must register in advance to join</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Session Materials */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Materials
              </label>
              {sessionData.materials.map((material, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => {
                      const newMaterials = [...sessionData.materials];
                      newMaterials[index] = e.target.value;
                      setSessionData({ ...sessionData, materials: newMaterials });
                    }}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Chef's knife, cutting board"
                  />
                  {sessionData.materials.length > 1 && (
                    <button
                      onClick={() => {
                        const newMaterials = sessionData.materials.filter((_, i) => i !== index);
                        setSessionData({ ...sessionData, materials: newMaterials });
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <SafeIcon icon={FiX} className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => setSessionData({
                  ...sessionData,
                  materials: [...sessionData.materials, '']
                })}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                + Add material
              </button>
            </div>

            {/* Session Agenda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Agenda
              </label>
              {sessionData.agenda.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newAgenda = [...sessionData.agenda];
                      newAgenda[index] = e.target.value;
                      setSessionData({ ...sessionData, agenda: newAgenda });
                    }}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Introduction and knife safety (5 mins)"
                  />
                  {sessionData.agenda.length > 1 && (
                    <button
                      onClick={() => {
                        const newAgenda = sessionData.agenda.filter((_, i) => i !== index);
                        setSessionData({ ...sessionData, agenda: newAgenda });
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <SafeIcon icon={FiX} className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => setSessionData({
                  ...sessionData,
                  agenda: [...sessionData.agenda, '']
                })}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                + Add agenda item
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t bg-gray-50">
            <div className="text-sm text-gray-600">
              Session will be created and notifications sent to your followers
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleSession}
                disabled={!sessionData.title || !sessionData.description || !sessionData.scheduledFor}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <SafeIcon icon={FiVideo} className="h-4 w-4" />
                <span>Schedule Session</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LiveSessionScheduler;