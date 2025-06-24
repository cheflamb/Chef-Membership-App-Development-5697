import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize, FiUsers, FiClock, FiVideo} = FiIcons;

const StreamannLivePlayer = ({
  eventId,
  title,
  description,
  isLive = false,
  scheduledFor,
  viewerCount = 0
}) => {
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [error, setError] = useState(null);

  // Streann Studio live event embed URL
  const liveEventUrl = `https://studio.streann.com/embed/event/${eventId}`;

  useEffect(() => {
    // Simulate checking if stream is live
    const checkLiveStatus = () => {
      setIsPlayerReady(true);
    };

    const timer = setTimeout(checkLiveStatus, 1000);
    return () => clearTimeout(timer);
  }, [eventId]);

  const formatScheduledTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      })
    };
  };

  const scheduled = scheduledFor ? formatScheduledTime(scheduledFor) : null;

  if (error) {
    return (
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="aspect-video flex items-center justify-center">
          <div className="text-center text-white">
            <SafeIcon icon={FiVideo} className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-semibold mb-2">Stream Error</p>
            <p className="text-sm opacity-75">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      className="bg-black rounded-lg overflow-hidden"
    >
      {/* Live Event Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isLive ? (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-white font-semibold">LIVE</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiClock} className="h-4 w-4 text-white" />
                <span className="text-white font-semibold">SCHEDULED</span>
              </div>
            )}
            <h3 className="text-white font-semibold">{title}</h3>
          </div>
          
          {isLive && (
            <div className="flex items-center space-x-2 text-white">
              <SafeIcon icon={FiUsers} className="h-4 w-4" />
              <span className="text-sm">{viewerCount.toLocaleString()} watching</span>
            </div>
          )}
        </div>
        
        {description && (
          <p className="text-red-100 text-sm mt-2">{description}</p>
        )}
      </div>

      {/* Video Player */}
      <div className="relative aspect-video">
        {isLive ? (
          <iframe
            src={liveEventUrl}
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={title || 'Live Event Stream'}
          />
        ) : scheduled ? (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <SafeIcon icon={FiClock} className="h-16 w-16 mx-auto mb-4 opacity-75" />
              <h3 className="text-xl font-semibold mb-2">Event Scheduled</h3>
              <div className="space-y-1 text-gray-300">
                <p className="text-lg">{scheduled.date}</p>
                <p className="text-lg">{scheduled.time}</p>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                Stream will begin automatically at the scheduled time
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <SafeIcon icon={FiVideo} className="h-16 w-16 mx-auto mb-4 opacity-75" />
              <p className="text-lg font-semibold">Event Not Available</p>
              <p className="text-sm text-gray-400 mt-2">Check back later for live content</p>
            </div>
          </div>
        )}
        
        {!isPlayerReady && isLive && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p>Loading live stream...</p>
            </div>
          </div>
        )}
      </div>

      {/* Stream Controls/Info */}
      {isLive && (
        <div className="bg-gray-900 p-4">
          <div className="flex items-center justify-between">
            <div className="text-white text-sm">
              <p>Live from The Successful Chef Brigade</p>
            </div>
            <div className="flex items-center space-x-4 text-white text-sm">
              <span>HD Quality</span>
              <button className="hover:text-red-400 transition-colors">
                <SafeIcon icon={FiMaximize} className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StreamannLivePlayer;