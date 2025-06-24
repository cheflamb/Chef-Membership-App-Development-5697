import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiPlus, FiCalendar, FiMessageCircle, FiVideo, FiBook, FiTrendingUp, FiAward } = FiIcons;

const CohortManager = () => {
  const [cohorts, setCohorts] = useState([
    {
      id: 1,
      name: 'The Successful Chef Leadership Bootcamp - Spring 2024',
      description: '12-week intensive leadership development program focused on building confident culinary leaders who can inspire teams and drive results.',
      startDate: '2024-03-01',
      endDate: '2024-05-24',
      participants: 18,
      maxParticipants: 20,
      status: 'active',
      type: 'bootcamp',
      sessions: [
        { date: '2024-03-01', topic: 'Leadership Foundations: From Cook to Leader', completed: true },
        { date: '2024-03-08', topic: 'Building High-Performance Kitchen Teams', completed: true },
        { date: '2024-03-15', topic: 'Communication That Inspires Action', completed: false },
        { date: '2024-03-22', topic: 'Managing Conflict & Difficult Conversations', completed: false }
      ]
    },
    {
      id: 2,
      name: 'Executive Leadership Intensive - Q2',
      description: '6-week advanced program for Executive Chefs focusing on strategic leadership, business acumen, and organizational transformation.',
      startDate: '2024-04-01',
      endDate: '2024-05-15',
      participants: 12,
      maxParticipants: 15,
      status: 'upcoming',
      type: 'executive',
      sessions: []
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCohort, setNewCohort] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    maxParticipants: 20,
    price: 1997,
    type: 'bootcamp',
    requirements: ['2+ years kitchen leadership experience'],
    schedule: 'weekly'
  });

  const cohortTypes = [
    { value: 'bootcamp', label: 'Leadership Bootcamp', description: '12-week comprehensive leadership development' },
    { value: 'executive', label: 'Executive Intensive', description: '6-week advanced strategic leadership' },
    { value: 'specialized', label: 'Specialized Program', description: 'Custom focused leadership training' }
  ];

  const handleCreateCohort = () => {
    const cohort = {
      id: Date.now(),
      ...newCohort,
      participants: 0,
      status: 'draft',
      sessions: []
    };

    setCohorts([...cohorts, cohort]);
    setNewCohort({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      maxParticipants: 20,
      price: 1997,
      type: 'bootcamp',
      requirements: ['2+ years kitchen leadership experience'],
      schedule: 'weekly'
    });
    setShowCreateForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'bootcamp': return FiAward;
      case 'executive': return FiUsers;
      default: return FiBook;
    }
  };

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Create New Leadership Program</h3>
          <button
            onClick={() => setShowCreateForm(false)}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 space-y-6">
          {/* Program Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Program Type *
            </label>
            <div className="grid md:grid-cols-3 gap-3">
              {cohortTypes.map((type) => (
                <label
                  key={type.value}
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                    newCohort.type === type.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="cohortType"
                    value={type.value}
                    checked={newCohort.type === type.value}
                    onChange={(e) => setNewCohort({ ...newCohort, type: e.target.value })}
                    className="sr-only"
                  />
                  <div className="font-medium text-gray-900">{type.label}</div>
                  <div className="text-sm text-gray-600">{type.description}</div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program Name *
              </label>
              <input
                type="text"
                value={newCohort.name}
                onChange={(e) => setNewCohort({ ...newCohort, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., The Successful Chef Leadership Bootcamp - Fall 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Participants *
              </label>
              <input
                type="number"
                value={newCohort.maxParticipants}
                onChange={(e) => setNewCohort({ ...newCohort, maxParticipants: parseInt(e.target.value) || 0 })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="5"
                max="50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Program Description *
            </label>
            <textarea
              value={newCohort.description}
              onChange={(e) => setNewCohort({ ...newCohort, description: e.target.value })}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Describe the leadership development outcomes and program structure..."
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={newCohort.startDate}
                onChange={(e) => setNewCohort({ ...newCohort, startDate: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                value={newCohort.endDate}
                onChange={(e) => setNewCohort({ ...newCohort, endDate: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment (USD)
              </label>
              <input
                type="number"
                value={newCohort.price}
                onChange={(e) => setNewCohort({ ...newCohort, price: parseFloat(e.target.value) || 0 })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="0"
                step="1"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateCohort}
              disabled={!newCohort.name || !newCohort.description || !newCohort.startDate}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Create Program
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Leadership Development Programs</h3>
          <p className="text-sm text-gray-600">Manage your cohort-based leadership training programs</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4" />
          <span>Create Program</span>
        </button>
      </div>

      {cohorts.length > 0 ? (
        <div className="space-y-6">
          {cohorts.map((cohort) => {
            const TypeIcon = getTypeIcon(cohort.type);
            return (
              <motion.div
                key={cohort.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <SafeIcon icon={TypeIcon} className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900 text-lg">{cohort.name}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(cohort.status)}`}>
                          {cohort.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{cohort.description}</p>
                      
                      <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiCalendar} className="h-4 w-4" />
                          <span>{new Date(cohort.startDate).toLocaleDateString()} - {new Date(cohort.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiUsers} className="h-4 w-4" />
                          <span>{cohort.participants}/{cohort.maxParticipants} participants</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiBook} className="h-4 w-4" />
                          <span>{cohort.sessions.length} sessions planned</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiTrendingUp} className="h-4 w-4" />
                          <span>{Math.round((cohort.participants / cohort.maxParticipants) * 100)}% enrolled</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                      <SafeIcon icon={FiMessageCircle} className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-green-600 transition-colors">
                      <SafeIcon icon={FiVideo} className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Enrollment Progress</span>
                    <span>{cohort.participants}/{cohort.maxParticipants}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-600 to-red-600 h-2 rounded-full transition-all"
                      style={{ width: `${(cohort.participants / cohort.maxParticipants) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Upcoming Sessions */}
                {cohort.sessions.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Program Sessions</h5>
                    <div className="space-y-2">
                      {cohort.sessions.slice(0, 4).map((session, index) => (
                        <div key={index} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${session.completed ? 'bg-green-500' : 'bg-blue-500'}`} />
                            <div>
                              <span className="text-sm font-medium text-gray-900">{session.topic}</span>
                              <span className="text-xs text-gray-500 ml-2">
                                Week {index + 1} - {new Date(session.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            session.completed 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {session.completed ? 'Completed' : 'Upcoming'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <SafeIcon icon={FiAward} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No leadership programs yet</h3>
          <p className="text-gray-600 mb-6">Create your first leadership development cohort!</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Create Leadership Program
          </button>
        </div>
      )}
    </div>
  );
};

export default CohortManager;