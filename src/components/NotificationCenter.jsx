import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBell, FiX, FiCheck, FiTrash2, FiSettings, FiChef, FiHeart, FiPlay, FiAward, FiBookOpen } = FiIcons;

const NotificationCenter = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const {
    notifications,
    unreadCount,
    permission,
    requestPermission,
    markAsRead,
    markAllAsRead,
    clearAll
  } = useNotifications();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'welcome':
      case 'recipe':
        return FiChef;
      case 'social':
        return FiHeart;
      case 'live':
      case 'masterclass':
        return FiPlay;
      case 'challenge':
        return FiAward;
      case 'premium':
        return FiBookOpen;
      default:
        return FiBell;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'welcome':
        return 'text-green-600 bg-green-100';
      case 'recipe':
        return 'text-orange-600 bg-orange-100';
      case 'social':
        return 'text-pink-600 bg-pink-100';
      case 'live':
      case 'masterclass':
        return 'text-blue-600 bg-blue-100';
      case 'challenge':
        return 'text-purple-600 bg-purple-100';
      case 'premium':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    
    if (notification.action) {
      switch (notification.action.type) {
        case 'navigate':
          navigate(notification.action.path);
          setIsOpen(false);
          break;
        case 'external':
          window.open(notification.action.url, '_blank');
          break;
        default:
          break;
      }
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleRequestPermission = async () => {
    const result = await requestPermission();
    if (result === 'granted') {
      // Show success notification
    }
  };

  return (
    <>
      {/* Notification Bell Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors rounded-lg hover:bg-orange-50"
        >
          <SafeIcon icon={FiBell} className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black bg-opacity-20 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[80vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Notifications
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <SafeIcon icon={FiX} className="h-5 w-5" />
                  </button>
                </div>

                {/* Permission Request */}
                {permission !== 'granted' && permission !== 'denied' && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
                    <p className="text-sm text-orange-800 mb-2">
                      Enable push notifications to stay updated!
                    </p>
                    <button
                      onClick={handleRequestPermission}
                      className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 transition-colors"
                    >
                      Enable Notifications
                    </button>
                  </div>
                )}

                {/* Filters */}
                <div className="flex space-x-2">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'unread', label: 'Unread' },
                    { key: 'read', label: 'Read' }
                  ].map((filterOption) => (
                    <button
                      key={filterOption.key}
                      onClick={() => setFilter(filterOption.key)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        filter === filterOption.key
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {filterOption.label}
                    </button>
                  ))}
                </div>

                {/* Actions */}
                {notifications.length > 0 && (
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={markAllAsRead}
                      disabled={unreadCount === 0}
                      className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <SafeIcon icon={FiCheck} className="h-4 w-4" />
                      <span>Mark all read</span>
                    </button>
                    <button
                      onClick={clearAll}
                      className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700"
                    >
                      <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                      <span>Clear all</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {filteredNotifications.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {filteredNotifications.map((notification) => {
                      const IconComponent = getNotificationIcon(notification.type);
                      const colorClasses = getNotificationColor(notification.type);

                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          layout
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.read ? 'bg-orange-50 border-l-4 border-orange-600' : ''
                          }`}
                        >
                          <div className="flex space-x-3">
                            <div className={`p-2 rounded-full ${colorClasses} flex-shrink-0`}>
                              <SafeIcon icon={IconComponent} className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${
                                !notification.read ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </p>
                              <p className={`text-sm ${
                                !notification.read ? 'text-gray-700' : 'text-gray-500'
                              } mt-1`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatTimeAgo(notification.timestamp)}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-orange-600 rounded-full flex-shrink-0 mt-2" />
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <SafeIcon icon={FiBell} className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">
                      {filter === 'unread' ? 'No unread notifications' : 
                       filter === 'read' ? 'No read notifications' : 'No notifications yet'}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      We'll notify you when something interesting happens
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-orange-600 transition-colors w-full"
                >
                  <SafeIcon icon={FiSettings} className="h-4 w-4" />
                  <span>Notification Settings</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationCenter;