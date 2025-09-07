import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { videoArticleService } from '../services/videoArticleService';

const VideoArticleRenderer = ({ videoArticle, onViewTracked }) => {
  const { theme } = useTheme();
  const { showError } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [watchTime, setWatchTime] = useState(0);
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const playerRef = useRef(null);
  const watchStartTime = useRef(null);
  const lastTrackedTime = useRef(0);

  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-black' : 'bg-white';
  const textMain = isDark ? 'text-white' : 'text-black';
  const cardBg = isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-black/10';

  // Extract YouTube video ID
  const getYouTubeVideoId = (url) => {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const videoId = getYouTubeVideoId(videoArticle.youtubeUrl);

  // Track view when component mounts
  useEffect(() => {
    if (videoArticle && !hasTrackedView) {
      trackView();
    }
  }, [videoArticle, hasTrackedView]);

  // Load comments when component mounts
  useEffect(() => {
    if (videoArticle && showComments) {
      loadComments();
    }
  }, [videoArticle, showComments]);

  const trackView = async () => {
    try {
      await videoArticleService.trackView(videoArticle.id);
      setHasTrackedView(true);
      if (onViewTracked) {
        onViewTracked();
      }
    } catch (error) {
      console.error('Failed to track view:', error);
    }
  };

  const loadComments = async () => {
    if (!videoArticle) return;

    setLoadingComments(true);
    try {
      const response = await videoArticleService.getComments(videoArticle.id);
      if (response.success) {
        setComments(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
      showError('Failed to load comments');
    } finally {
      setLoadingComments(false);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    watchStartTime.current = Date.now();
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (watchStartTime.current) {
      const currentWatchTime = Math.floor((Date.now() - watchStartTime.current) / 1000);
      setWatchTime(prev => prev + currentWatchTime);
      watchStartTime.current = null;
    }
  };

  const handleTimeUpdate = (event) => {
    const currentTime = event.target.getCurrentTime();
    setCurrentTime(currentTime);

    // Track watch time every 10 seconds
    if (Math.floor(currentTime) - lastTrackedTime.current >= 10) {
      lastTrackedTime.current = Math.floor(currentTime);
      // You can implement additional tracking here if needed
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (watchStartTime.current) {
      const finalWatchTime = Math.floor((Date.now() - watchStartTime.current) / 1000);
      setWatchTime(prev => prev + finalWatchTime);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await videoArticleService.addComment(videoArticle.id, {
        content: newComment.trim(),
        timestamp: Math.floor(currentTime)
      });

      if (response.success) {
        setNewComment('');
        loadComments(); // Reload comments
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
      showError('Failed to add comment');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!videoArticle || !videoId) {
    return (
      <div className={`p-6 ${cardBg} rounded-lg border`}>
        <p className={textMain}>Invalid video URL or video not found.</p>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto ${bgMain} p-6`}>
      {/* Video Player */}
      <div className={`${cardBg} rounded-lg border overflow-hidden mb-6`}>
        <div className="relative" style={{ paddingBottom: '56.25%' }}>
          <iframe
            ref={playerRef}
            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={videoArticle.title}
            onLoad={() => {
              // YouTube iframe API integration would go here for advanced tracking
              // For now, we'll use basic event listeners
            }}
          />
        </div>

        {/* Video Info */}
        <div className="p-6">
          <h1 className={`text-2xl font-bold ${textMain} mb-2`}>
            {videoArticle.title}
          </h1>

          {videoArticle.subtitle && (
            <h2 className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              {videoArticle.subtitle}
            </h2>
          )}

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {videoArticle.viewCount || 0} views
              </span>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {videoArticle.likeCount || 0} likes
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowComments(!showComments)}
                className={`px-3 py-1 text-sm rounded ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                💬 {comments.length} Comments
              </button>
            </div>
          </div>

          {/* Author and Date */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                By {videoArticle.author?.name || 'Unknown Author'}
              </span>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                •
              </span>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {new Date(videoArticle.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Tags */}
          {videoArticle.tags && videoArticle.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {videoArticle.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 text-xs rounded ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={`${cardBg} rounded-lg border p-6 mb-6`}>
        <div
          className={`prose max-w-none ${isDark ? 'prose-invert' : ''}`}
          dangerouslySetInnerHTML={{ __html: videoArticle.content }}
        />
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className={`${cardBg} rounded-lg border p-6`}>
          <h3 className={`text-lg font-semibold ${textMain} mb-4`}>
            Comments ({comments.length})
          </h3>

          {/* Add Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <div className="flex space-x-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className={`flex-1 p-3 border rounded-lg resize-none ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                rows={3}
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Comment
              </button>
            </div>
            <div className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {newComment.length}/500 characters
            </div>
          </form>

          {/* Comments List */}
          {loadingComments ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Loading comments...
              </p>
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}>
                      <span className="text-sm font-medium">
                        {comment.user?.username?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`font-medium text-sm ${textMain}`}>
                          {comment.user?.username || 'Anonymous'}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                        {comment.timestamp && (
                          <span className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            {formatTime(comment.timestamp)}
                          </span>
                        )}
                      </div>
                      <p className={`${textMain} text-sm`}>
                        {comment.content}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <button className={`text-xs ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
                          👍 {comment.likeCount || 0}
                        </button>
                        <button className={`text-xs ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
                          👎 {comment.dislikeCount || 0}
                        </button>
                        <button className={`text-xs ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
                          Reply ({comment.replyCount || 0})
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoArticleRenderer;