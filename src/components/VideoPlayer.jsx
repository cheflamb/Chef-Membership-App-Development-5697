import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize, FiSettings, FiLoader } = FiIcons;

const VideoPlayer = ({ 
  videoId, 
  title, 
  description, 
  onProgress, 
  onComplete,
  allowSkipping = true,
  watermark = true 
}) => {
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const progressUpdateRef = useRef(null);

  // Streann Studio embed URL
  const streamUrl = `https://studio.streann.com/embed/${videoId}`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const current = video.currentTime;
      const total = video.duration;
      
      setCurrentTime(current);
      
      // Report progress every 5 seconds
      if (progressUpdateRef.current) {
        clearTimeout(progressUpdateRef.current);
      }
      
      progressUpdateRef.current = setTimeout(() => {
        if (onProgress && total > 0) {
          const progressPercent = Math.round((current / total) * 100);
          onProgress(progressPercent, current, total);
        }
      }, 1000);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setLoading(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onComplete) {
        onComplete();
      }
    };

    const handleError = () => {
      setError('Failed to load video. Please try again.');
      setLoading(false);
    };

    const handleCanPlay = () => {
      setLoading(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
      
      if (progressUpdateRef.current) {
        clearTimeout(progressUpdateRef.current);
      }
    };
  }, [onProgress, onComplete]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    if (!allowSkipping) return;
    
    const video = videoRef.current;
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (error) {
    return (
      <div className="relative bg-black rounded-lg overflow-hidden">
        <div className="aspect-video flex items-center justify-center">
          <div className="text-center text-white">
            <SafeIcon icon={FiSettings} className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-semibold mb-2">Video Error</p>
            <p className="text-sm opacity-75">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative bg-black rounded-lg overflow-hidden group"
      ref={containerRef}
    >
      {/* Video Title Overlay */}
      {title && (
        <div className="absolute top-4 left-4 right-4 z-20">
          <div className="bg-black bg-opacity-50 rounded-lg p-3">
            <h3 className="text-white font-semibold text-lg">{title}</h3>
            {description && (
              <p className="text-white opacity-75 text-sm mt-1">{description}</p>
            )}
          </div>
        </div>
      )}

      {/* Watermark */}
      {watermark && user && (
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-black bg-opacity-50 rounded-lg px-3 py-2">
            <p className="text-white text-xs font-medium">
              Licensed to: {user.name}
            </p>
          </div>
        </div>
      )}

      {/* Streann Studio Video Embed */}
      <div className="relative aspect-video">
        <iframe
          src={streamUrl}
          className="w-full h-full"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={title || 'Course Video'}
        />
        
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
            <div className="text-center text-white">
              <SafeIcon icon={FiLoader} className="h-8 w-8 mx-auto mb-2 animate-spin" />
              <p>Loading video...</p>
            </div>
          </div>
        )}
      </div>

      {/* Custom Controls Overlay (if needed) */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Progress Bar */}
        <div className="mb-3">
          <div 
            className="w-full h-2 bg-white bg-opacity-30 rounded-full cursor-pointer"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-red-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="text-white hover:text-red-400 transition-colors"
            >
              <SafeIcon icon={isPlaying ? FiPause : FiPlay} className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="text-white hover:text-red-400 transition-colors"
              >
                <SafeIcon icon={isMuted ? FiVolumeX : FiVolume2} className="h-5 w-5" />
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 accent-red-600"
              />
            </div>
            
            <div className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-red-400 transition-colors"
            >
              <SafeIcon icon={FiMaximize} className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Anti-piracy overlay (for premium content) */}
      {!allowSkipping && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-black bg-opacity-10" />
          <div className="absolute bottom-20 right-4 text-white text-xs opacity-50">
            Premium Content - The Successful Chef Brigade
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default VideoPlayer;