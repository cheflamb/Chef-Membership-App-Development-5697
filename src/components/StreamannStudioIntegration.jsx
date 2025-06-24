import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiVideo, FiUpload, FiSettings, FiPlay, FiEdit3, FiTrash2, FiExternalLink } = FiIcons;

const StreamannStudioIntegration = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Sample video data structure from Streann Studio
  const sampleVideos = [
    {
      id: '684788f7cc1e74d15fde7cc4',
      title: 'Leadership Communication Fundamentals',
      description: 'Learn the core principles of effective leadership communication in high-pressure kitchen environments.',
      thumbnail: 'https://images.unsplash.com/photo-1556909092-f6ecd6ba9629?w=400&h=225&fit=crop',
      duration: 1847, // seconds
      status: 'ready',
      upload_date: '2024-01-15T10:30:00Z',
      views: 234,
      streann_url: 'https://studio.streann.com/embed/684788f7cc1e74d15fde7cc4'
    },
    {
      id: '789abc123def456ghi789jkl',
      title: 'Building High-Performance Teams',
      description: 'Strategies for creating cohesive teams that perform under pressure.',
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=225&fit=crop',
      duration: 2156,
      status: 'processing',
      upload_date: '2024-01-20T14:15:00Z',
      views: 0,
      streann_url: 'https://studio.streann.com/embed/789abc123def456ghi789jkl'
    }
  ];

  useEffect(() => {
    // In a real implementation, this would fetch from Streann Studio API
    setVideos(sampleVideos);
  }, []);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUploadToStreann = () => {
    // This would integrate with Streann Studio's upload API
    window.open('https://app.streann.studio/TheSuccessfulChef', '_blank');
  };

  const handleDeleteVideo = (videoId) => {
    if (confirm('Are you sure you want to delete this video?')) {
      setVideos(videos.filter(v => v.id !== videoId));
      // In real implementation, this would call Streann API to delete
    }
  };

  const VideoUploadForm = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload to Streann Studio</h3>
        
        <div className="space-y-4">
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <SafeIcon icon={FiUpload} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Upload videos directly to your Streann Studio account
            </p>
            <button
              onClick={handleUploadToStreann}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-800 transition-colors"
            >
              Open Streann Studio
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Upload Instructions:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Upload your video to Streann Studio</li>
              <li>Wait for processing to complete</li>
              <li>Copy the video ID from the embed URL</li>
              <li>Add the video to your course using the ID</li>
            </ol>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => setShowUploadForm(false)}
            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Streann Studio Integration</h2>
            <p className="text-gray-600">Manage your video content hosted on Streann Studio</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowUploadForm(true)}
              className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors"
            >
              <SafeIcon icon={FiUpload} className="h-4 w-4" />
              <span>Upload Video</span>
            </button>
            <a
              href="https://app.streann.studio/TheSuccessfulChef"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <SafeIcon icon={FiExternalLink} className="h-4 w-4" />
              <span>Open Studio</span>
            </a>
          </div>
        </div>

        {/* Video Library */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Video Library</h3>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : videos.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Thumbnail */}
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <SafeIcon icon={FiPlay} className="h-8 w-8 text-white" />
                    </div>
                    
                    {/* Duration */}
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {formatDuration(video.duration)}
                    </div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(video.status)}`}>
                        {video.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {video.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {video.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>{video.views} views</span>
                      <span>{new Date(video.upload_date).toLocaleDateString()}</span>
                    </div>

                    {/* Video ID for embedding */}
                    <div className="bg-gray-50 rounded p-2 mb-3">
                      <p className="text-xs text-gray-600 mb-1">Streann Video ID:</p>
                      <code className="text-xs font-mono text-gray-800 bg-white px-2 py-1 rounded border">
                        {video.id}
                      </code>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(video.streann_url, '_blank')}
                        className="flex-1 bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700 transition-colors"
                      >
                        Preview
                      </button>
                      <button className="text-gray-600 hover:text-blue-600 p-2">
                        <SafeIcon icon={FiEdit3} className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(video.id)}
                        className="text-gray-600 hover:text-red-600 p-2"
                      >
                        <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <SafeIcon icon={FiVideo} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No videos yet</h3>
              <p className="text-gray-600 mb-6">Upload your first video to Streann Studio to get started</p>
              <button
                onClick={() => setShowUploadForm(true)}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-colors"
              >
                Upload First Video
              </button>
            </div>
          )}
        </div>

        {/* Integration Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration Settings</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Account Information</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Studio Account:</span>
                  <span className="text-sm font-medium text-gray-900">TheSuccessfulChef</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className="text-sm font-medium text-green-600">Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Storage Used:</span>
                  <span className="text-sm font-medium text-gray-900">2.4 GB / 100 GB</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Video Settings</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                  <span className="text-sm text-gray-700">Auto-generate thumbnails</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                  <span className="text-sm text-gray-700">Enable video analytics</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                  <span className="text-sm text-gray-700">Allow downloads</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">API Integration</h4>
                <p className="text-sm text-gray-600">Manage your Streann Studio API connection</p>
              </div>
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                <SafeIcon icon={FiSettings} className="h-4 w-4 inline mr-2" />
                Configure API
              </button>
            </div>
          </div>
        </div>

        {/* Usage Analytics */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Analytics</h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">12</div>
              <div className="text-sm text-gray-600">Total Videos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">1,847</div>
              <div className="text-sm text-gray-600">Total Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">24.3m</div>
              <div className="text-sm text-gray-600">Watch Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">78%</div>
              <div className="text-sm text-gray-600">Avg. Completion</div>
            </div>
          </div>
        </div>

        {/* Upload Form Modal */}
        {showUploadForm && <VideoUploadForm />}
      </motion.div>
    </div>
  );
};

export default StreamannStudioIntegration;