import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {useAuth} from '../context/AuthContext';
import {useStreannLive} from '../hooks/useStreannLive';
import StreamannLivePlayer from '../components/StreamannLivePlayer';
import {Link} from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {FiVideo, FiCalendar, FiClock, FiUsers, FiLock, FiArrowRight, FiMic, FiPlay, FiRadio, FiUser} = FiIcons;

const LiveEvents = () => {
  const {user} = useAuth();
  const {liveEvents, currentLiveEvent, isLoading, getUpcomingEvents, registerForEvent} = useStreannLive();
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingEvents = getUpcomingEvents();
  const pastEvents = [
    {
      id: 4,
      title: 'New Year Leadership Intentions Workshop',
      description: 'Set powerful intentions for your leadership growth in 2024.',
      date: '2024-01-15',
      time: '14:00',
      duration: 75,
      type: 'workshop',
      tier_required: 'brigade',
      attendees: 67,
      recording_available: true,
      instructor: 'Chef Adam',
      status: 'completed'
    },
    {
      id: 5,
      title: 'End of Year Leadership Reflection',
      description: 'Reflect on your leadership journey and plan for continued growth.',
      date: '2023-12-20',
      time: '15:00',
      duration: 60,
      type: 'coaching',
      tier_required: 'free',
      attendees: 156,
      recording_available: true,
      instructor: 'Chef Adam',
      status: 'completed'
    }
  ];

  const canAccessEvent = (event) => {
    if (!user) return event.tier_required === 'free';
    
    const tierHierarchy = ['free', 'brigade', 'fraternity', 'guild'];
    const userTierIndex = tierHierarchy.indexOf(user.tier);
    const requiredTierIndex = tierHierarchy.indexOf(event.tier_required);
    
    return userTierIndex >= requiredTierIndex;
  };

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'free': return {label: 'FREE', color: 'bg-gray-100 text-gray-800'};
      case 'brigade': return {label: 'BRIGADE', color: 'bg-red-100 text-red-800'};
      case 'fraternity': return {label: 'FRATERNITY', color: 'bg-yellow-100 text-yellow-800'};
      case 'guild': return {label: 'GUILD', color: 'bg-gold text-charcoal'};
      default: return {label: 'FREE', color: 'bg-gray-100 text-gray-800'};
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'workshop': return FiVideo;
      case 'coaching': return FiUsers;
      case 'mastermind': return FiMic;
      default: return FiPlay;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (timeString.includes(':')) {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm} EST`;
    }
    
    // Handle full datetime string
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const handleRegister = async (eventId) => {
    if (!user) return;
    
    const result = await registerForEvent(eventId);
    if (result.success) {
      alert('Successfully registered for event!');
    } else {
      alert('Registration failed. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-montserrat font-bold text-charcoal mb-4">
              Live Events
            </h1>
            <p className="text-xl font-lato text-gray-600 max-w-3xl mx-auto">
              Join live leadership development sessions, group coaching calls, and exclusive masterminds.
            </p>
          </div>

          {/* Live Stream Player */}
          <div className="mb-12">
            {currentLiveEvent ? (
              <StreamannLivePlayer
                eventId={currentLiveEvent.id}
                title={currentLiveEvent.title}
                description={currentLiveEvent.description}
                isLive={currentLiveEvent.isLive}
                scheduledFor={currentLiveEvent.scheduledFor}
                viewerCount={currentLiveEvent.viewerCount}
              />
            ) : upcomingEvents.length > 0 ? (
              <StreamannLivePlayer
                eventId={upcomingEvents[0].id}
                title={upcomingEvents[0].title}
                description={upcomingEvents[0].description}
                isLive={false}
                scheduledFor={upcomingEvents[0].scheduledFor}
                viewerCount={0}
              />
            ) : (
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-2xl font-montserrat font-bold text-charcoal mb-4 text-center">
                  Live Stream
                </h2>
                <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <SafeIcon icon={FiRadio} className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">No Live Events</h3>
                    <p className="text-gray-300">Check the schedule below for upcoming sessions</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-6 py-2 rounded-md font-lato font-medium transition-colors ${
                  activeTab === 'upcoming'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                Upcoming Events
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-6 py-2 rounded-md font-lato font-medium transition-colors ${
                  activeTab === 'past'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                Resource Toolbox
              </button>
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-6">
            {activeTab === 'upcoming' && (
              <>
                {upcomingEvents.map((event, index) => {
                  const canAccess = canAccessEvent(event);
                  const tierBadge = getTierBadge(event.tier_required);
                  const EventIcon = getEventIcon(event.type);

                  return (
                    <motion.div
                      key={event.id}
                      initial={{opacity: 0, y: 20}}
                      animate={{opacity: 1, y: 0}}
                      transition={{duration: 0.6, delay: index * 0.1}}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="bg-primary p-3 rounded-lg">
                              <SafeIcon icon={EventIcon} className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-montserrat font-bold text-charcoal text-lg">
                                  {event.title}
                                </h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-montserrat font-bold ${tierBadge.color}`}>
                                  {tierBadge.label}
                                </span>
                                {event.isLive && (
                                  <span className="px-2 py-1 rounded-full text-xs font-montserrat font-bold bg-red-500 text-white animate-pulse">
                                    LIVE NOW
                                  </span>
                                )}
                              </div>
                              <p className="font-lato text-gray-600 mb-4">
                                {event.description}
                              </p>
                              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                <div className="flex items-center space-x-2 text-gray-500">
                                  <SafeIcon icon={FiCalendar} className="h-4 w-4" />
                                  <span className="font-lato">{formatDate(event.scheduledFor)}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-500">
                                  <SafeIcon icon={FiClock} className="h-4 w-4" />
                                  <span className="font-lato">{formatTime(event.scheduledFor)}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-500">
                                  <SafeIcon icon={FiUsers} className="h-4 w-4" />
                                  <span className="font-lato">
                                    {event.viewerCount || 0} {event.isLive ? 'watching' : 'registered'}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-500">
                                  <SafeIcon icon={FiUser} className="h-4 w-4" />
                                  <span className="font-lato">{event.instructor}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            {canAccess ? (
                              event.isLive ? (
                                <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-lato font-medium hover:bg-red-700 transition-colors">
                                  Join Live Now
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleRegister(event.id)}
                                  className="bg-primary text-white px-6 py-3 rounded-lg font-lato font-medium hover:bg-red-800 transition-colors"
                                >
                                  {event.userRegistered ? 'Registered ✓' : 'Register Now'}
                                </button>
                              )
                            ) : (
                              <div className="space-y-2">
                                <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-lato font-medium flex items-center space-x-2">
                                  <SafeIcon icon={FiLock} className="h-4 w-4" />
                                  <span>Members Only</span>
                                </div>
                                {!user ? (
                                  <Link
                                    to="/join"
                                    className="block text-primary font-lato font-medium hover:text-red-800 text-sm"
                                  >
                                    Join to Register →
                                  </Link>
                                ) : (
                                  <Link
                                    to="/pricing"
                                    className="block text-primary font-lato font-medium hover:text-red-800 text-sm"
                                  >
                                    Upgrade Membership →
                                  </Link>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {upcomingEvents.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-2xl">
                    <SafeIcon icon={FiVideo} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming events</h3>
                    <p className="text-gray-600">Check back soon for new live sessions!</p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'past' && (
              <>
                {pastEvents.map((event, index) => {
                  const canAccess = canAccessEvent(event);
                  const tierBadge = getTierBadge(event.tier_required);
                  const EventIcon = getEventIcon(event.type);

                  return (
                    <motion.div
                      key={event.id}
                      initial={{opacity: 0, y: 20}}
                      animate={{opacity: 1, y: 0}}
                      transition={{duration: 0.6, delay: index * 0.1}}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="bg-gray-400 p-3 rounded-lg">
                              <SafeIcon icon={EventIcon} className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-montserrat font-bold text-charcoal text-lg">
                                  {event.title}
                                </h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-montserrat font-bold ${tierBadge.color}`}>
                                  {tierBadge.label}
                                </span>
                                {event.recording_available && (
                                  <span className="px-2 py-1 rounded-full text-xs font-montserrat font-bold bg-green-100 text-green-800">
                                    RECORDED
                                  </span>
                                )}
                              </div>
                              <p className="font-lato text-gray-600 mb-4">
                                {event.description}
                              </p>
                              <div className="grid md:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center space-x-2 text-gray-500">
                                  <SafeIcon icon={FiCalendar} className="h-4 w-4" />
                                  <span className="font-lato">{formatDate(event.date)}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-500">
                                  <SafeIcon icon={FiUsers} className="h-4 w-4" />
                                  <span className="font-lato">{event.attendees} attended</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-500">
                                  <SafeIcon icon={FiClock} className="h-4 w-4" />
                                  <span className="font-lato">{event.duration} minutes</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            {canAccess && event.recording_available ? (
                              <button className="bg-gray-600 text-white px-6 py-3 rounded-lg font-lato font-medium hover:bg-gray-700 transition-colors">
                                Watch Recording
                              </button>
                            ) : !canAccess ? (
                              <div className="space-y-2">
                                <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-lato font-medium flex items-center space-x-2">
                                  <SafeIcon icon={FiLock} className="h-4 w-4" />
                                  <span>Members Only</span>
                                </div>
                                {!user ? (
                                  <Link
                                    to="/join"
                                    className="block text-primary font-lato font-medium hover:text-red-800 text-sm"
                                  >
                                    Join to Access →
                                  </Link>
                                ) : (
                                  <Link
                                    to="/pricing"
                                    className="block text-primary font-lato font-medium hover:text-red-800 text-sm"
                                  >
                                    Upgrade Membership →
                                  </Link>
                                )}
                              </div>
                            ) : (
                              <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-lato font-medium">
                                No Recording
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </>
            )}
          </div>

          {/* Call to Action for Non-Users */}
          {!user && (
            <div className="mt-16 bg-gradient-to-r from-primary to-red-800 rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-montserrat font-bold text-white mb-4">
                Ready to Join Live Leadership Sessions?
              </h2>
              <p className="text-xl font-lato text-red-100 mb-8">
                Get access to group coaching calls, workshops, and exclusive masterminds.
              </p>
              <Link
                to="/join"
                className="inline-flex items-center space-x-2 bg-white text-primary px-8 py-4 rounded-lg text-lg font-lato font-medium hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Join Free & Access Events</span>
                <SafeIcon icon={FiArrowRight} className="h-5 w-5" />
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LiveEvents;