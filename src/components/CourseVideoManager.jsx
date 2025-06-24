import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import VideoPlayer from './VideoPlayer';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';
import * as FiIcons from 'react-icons/fi';

const { FiVideo, FiPlus, FiEdit3, FiTrash2, FiUpload, FiEye, FiLock, FiCheck, FiPlay } = FiIcons;

const CourseVideoManager = ({ courseId, isInstructor = false }) => {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState({});

  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    streann_video_id: '',
    order_index: 0,
    is_preview: false,
    tier_required: 'free'
  });

  useEffect(() => {
    fetchVideos();
    if (user && !isInstructor) {
      fetchUserProgress();
    }
  }, [courseId, user]);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('course_videos_chef_brigade')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setVideos(data || []);
      
      // Auto-select first video if none selected
      if (data && data.length > 0 && !selectedVideo) {
        setSelectedVideo(data[0]);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('video_progress_chef_brigade')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      if (error) throw error;

      const progressMap = {};
      data?.forEach(item => {
        progressMap[item.video_id] = {
          progress: item.progress_percent,
          completed: item.completed,
          watch_time: item.total_watch_time
        };
      });
      
      setUserProgress(progressMap);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  };

  const handleVideoProgress = async (videoId, progressPercent, currentTime, totalTime) => {
    if (!user || isInstructor) return;

    try {
      const completed = progressPercent >= 90; // Consider 90% as completed

      await supabase
        .from('video_progress_chef_brigade')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          video_id: videoId,
          progress_percent: progressPercent,
          total_watch_time: currentTime,
          completed,
          last_position: currentTime,
          updated_at: new Date().toISOString()
        });

      // Update local progress
      setUserProgress(prev => ({
        ...prev,
        [videoId]: {
          progress: progressPercent,
          completed,
          watch_time: currentTime
        }
      }));

    } catch (error) {
      console.error('Error saving video progress:', error);
    }
  };

  const handleVideoComplete = async (videoId) => {
    await handleVideoProgress(videoId, 100, selectedVideo?.duration || 0, selectedVideo?.duration || 0);
    
    // Auto-advance to next video
    const currentIndex = videos.findIndex(v => v.id === videoId);
    if (currentIndex < videos.length - 1) {
      setSelectedVideo(videos[currentIndex + 1]);
    }
  };

  const addVideo = async () => {
    if (!newVideo.title || !newVideo.streann_video_id) return;

    try {
      const { data, error } = await supabase
        .from('course_videos_chef_brigade')
        .insert([{
          course_id: courseId,
          ...newVideo,
          created_by: user.id,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      setVideos([...videos, data]);
      setNewVideo({
        title: '',
        description: '',
        streann_video_id: '',
        order_index: videos.length,
        is_preview: false,
        tier_required: 'free'
      });
      setShowUploadForm(false);
    } catch (error) {
      console.error('Error adding video:', error);
      alert('Failed to add video');
    }
  };

  const deleteVideo = async (videoId) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      const { error } = await supabase
        .from('course_videos_chef_brigade')
        .delete()
        .eq('id', videoId);

      if (error) throw error;

      setVideos(videos.filter(v => v.id !== videoId));
      if (selectedVideo?.id === videoId) {
        setSelectedVideo(videos[0] || null);
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Failed to delete video');
    }
  };

  const canWatchVideo = (video) => {
    // Instructors can watch everything
    if (isInstructor) return true;
    
    // Preview videos are free
    if (video.is_preview) return true;
    
    // Check user tier
    if (!user) return false;
    
    const tierHierarchy = ['free', 'brigade', 'fraternity', 'guild'];
    const userTierIndex = tierHierarchy.indexOf(user.tier);
    const requiredTierIndex = tierHierarchy.indexOf(video.tier_required);
    
    return userTierIndex >= requiredTierIndex;
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* Video Player */}
      <div className="lg:col-span-3">
        {selectedVideo ? (
          <div className="space-y-4">
            {canWatchVideo(selectedVideo) ? (
              <VideoPlayer
                videoId={selectedVideo.streann_video_id}
                title={selectedVideo.title}
                description={selectedVideo.description}
                onProgress={(progress, current, total) => 
                  handleVideoProgress(selectedVideo.id, progress, current, total)
                }
                onComplete={() => handleVideoComplete(selectedVideo.id)}
                allowSkipping={selectedVideo.is_preview || user?.tier !== 'free'}
                watermark={!selectedVideo.is_preview}
              />
            ) : (
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <SafeIcon icon={FiLock} className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Premium Content</h3>
                  <p className="text-gray-300 mb-4">
                    This video requires {selectedVideo.tier_required} membership
                  </p>
                  <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-800 transition-colors">
                    Upgrade Membership
                  </button>
                </div>
              </div>
            )}

            {/* Video Info */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {selectedVideo.title}
                  </h2>
                  {selectedVideo.description && (
                    <p className="text-gray-600 mb-4">{selectedVideo.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {selectedVideo.is_preview && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                        Free Preview
                      </span>
                    )}
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                      {selectedVideo.tier_required.charAt(0).toUpperCase() + selectedVideo.tier_required.slice(1)} Required
                    </span>
                  </div>
                </div>
                
                {isInstructor && (
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <SafeIcon icon={FiEdit3} className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => deleteVideo(selectedVideo.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <SafeIcon icon={FiTrash2} className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Progress for students */}
              {!isInstructor && userProgress[selectedVideo.id] && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Your Progress</span>
                    <span>{Math.round(userProgress[selectedVideo.id].progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(userProgress[selectedVideo.id].progress)}`}
                      style={{ width: `${userProgress[selectedVideo.id].progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <SafeIcon icon={FiVideo} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Select a video to start watching</p>
            </div>
          </div>
        )}
      </div>

      {/* Video Playlist */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Course Videos</h3>
              {isInstructor && (
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="text-primary hover:text-red-800"
                >
                  <SafeIcon icon={FiPlus} className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {videos.map((video, index) => {
              const progress = userProgress[video.id];
              const canWatch = canWatchVideo(video);
              
              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedVideo?.id === video.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {!canWatch ? (
                        <SafeIcon icon={FiLock} className="h-4 w-4 text-gray-400" />
                      ) : progress?.completed ? (
                        <SafeIcon icon={FiCheck} className="h-4 w-4 text-green-600" />
                      ) : (
                        <SafeIcon icon={FiPlay} className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium ${canWatch ? 'text-gray-900' : 'text-gray-500'}`}>
                        {index + 1}. {video.title}
                      </h4>
                      
                      {video.is_preview && (
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                          Preview
                        </span>
                      )}
                      
                      {!isInstructor && progress && canWatch && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div 
                              className={`h-1 rounded-full ${getProgressColor(progress.progress)}`}
                              style={{ width: `${progress.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {videos.length === 0 && (
            <div className="p-8 text-center">
              <SafeIcon icon={FiVideo} className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 text-sm">No videos yet</p>
              {isInstructor && (
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="text-primary hover:text-red-800 text-sm mt-2"
                >
                  Add your first video
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upload Video Modal */}
      {showUploadForm && isInstructor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Video</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Title
                </label>
                <input
                  type="text"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter video title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Streann Video ID
                </label>
                <input
                  type="text"
                  value={newVideo.streann_video_id}
                  onChange={(e) => setNewVideo({...newVideo, streann_video_id: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., 684788f7cc1e74d15fde7cc4"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get this from your Streann Studio dashboard
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newVideo.description}
                  onChange={(e) => setNewVideo({...newVideo, description: e.target.value})}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Video description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tier Required
                </label>
                <select
                  value={newVideo.tier_required}
                  onChange={(e) => setNewVideo({...newVideo, tier_required: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="free">Free</option>
                  <option value="brigade">Brigade</option>
                  <option value="fraternity">Fraternity</option>
                  <option value="guild">Guild</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPreview"
                  checked={newVideo.is_preview}
                  onChange={(e) => setNewVideo({...newVideo, is_preview: e.target.checked})}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isPreview" className="text-sm text-gray-700">
                  This is a preview video (free to all)
                </label>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowUploadForm(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addVideo}
                disabled={!newVideo.title || !newVideo.streann_video_id}
                className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Video
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CourseVideoManager;