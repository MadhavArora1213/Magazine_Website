import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { videoService } from '../../services/videoService';
import VideoPlayer from './VideoPlayer';
import VideoComments from './VideoComments';
import VideoTranscript from './VideoTranscript';
import VideoAnalytics from './VideoAnalytics';
import { formatDistanceToNow } from 'date-fns';

const VideoArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('comments');
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoPlayerRef = useRef(null);

  useEffect(() => {
    loadVideo();
  }, [id]);

  const loadVideo = async () => {
    try {
      setLoading(true);
      setError(null);

      const [videoResponse, relatedResponse] = await Promise.all([
        videoService.getVideoArticleById(id),
        videoService.getRelatedVideos(id, { limit: 8 })
      ]);

      setVideo(videoResponse.video);
      setRelatedVideos(relatedResponse.videos || []);

      // Check if user has liked/saved this video
      // This would typically come from user preferences API
      setIsLiked(false);
      setIsSaved(false);

    } catch (err) {
      console.error('Failed to load video:', err);
      setError('Failed to load video article');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!video) return;

    try {
      // This would call an API to like/unlike the video
      setIsLiked(!isLiked);

      // Track analytics
      await videoService.trackVideoEvent(video.id, {
        eventType: isLiked ? 'unlike' : 'like',
        currentTime,
        metadata: { source: 'video_page' }
      });
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleSave = async () => {
    if (!video) return;

    try {
      // This would call an API to save/unsave the video
      setIsSaved(!isSaved);
    } catch (err) {
      console.error('Failed to toggle save:', err);
    }
  };

  const handleShare = async (platform) => {
    if (!video) return;

    const shareUrl = `${window.location.origin}/videos/${video.id}`;
    const shareText = `Check out this video: ${video.title}`;

    try {
      switch (platform) {
        case 'copy':
          await navigator.clipboard.writeText(shareUrl);
          alert('Link copied to clipboard!');
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
          break;
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
          break;
        case 'email':
          window.open(`mailto:?subject=${encodeURIComponent(video.title)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`);
          break;
      }

      // Track share analytics
      await videoService.trackVideoEvent(video.id, {
        eventType: 'share',
        currentTime,
        metadata: { platform, source: 'video_page' }
      });

      setShowShareModal(false);
    } catch (err) {
      console.error('Failed to share video:', err);
    }
  };

  const handleVideoProgress = useCallback((progress) => {
    setCurrentTime(progress.currentTime);
    setIsPlaying(progress.isPlaying);
  }, []);

  const handleRelatedVideoClick = (relatedVideo) => {
    navigate(`/videos/${relatedVideo.id}`);
  };

  const formatViewCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-300 dark:bg-gray-700 aspect-video rounded-lg mb-6"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            {error || 'Video not found'}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            The video you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/videos')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Videos
          </button>
        </div>
      </div>
    );
  }

  const typeInfo = videoService.getVideoTypeInfo(video.videoType);

  // Prepare structured data for JSON-LD
  const structuredData = video.structuredData ? JSON.stringify(video.structuredData) : null;

  return (
    <>
      <Helmet>
        <title>{video.title}</title>
        <meta name="description" content={video.excerpt || video.description} />
        <meta name="keywords" content={video.tags?.join(', ')} />
        <meta property="og:title" content={video.title} />
        <meta property="og:description" content={video.excerpt || video.description} />
        <meta property="og:image" content={video.thumbnailUrl || video.featuredImage} />
        <meta property="og:type" content="video.other" />
        <meta property="og:video" content={video.youtubeUrl} />
        <meta property="og:video:secure_url" content={video.youtubeUrl} />
        <meta property="og:video:type" content="text/html" />
        <meta property="og:video:width" content="1280" />
        <meta property="og:video:height" content="720" />
        <meta property="article:published_time" content={video.publishDate || video.createdAt} />
        <meta property="article:author" content={video.primaryAuthor?.name} />
        <meta property="article:section" content={video.videoCategory?.name} />
        <meta property="article:tag" content={video.tags?.join(', ')} />
        <link rel="canonical" href={window.location.href} />

        {/* JSON-LD Structured Data */}
        {structuredData && (
          <script type="application/ld+json">
            {structuredData}
          </script>
        )}
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Video Player Section */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="aspect-video">
            <VideoPlayer
              ref={videoPlayerRef}
              src={video.videoUrl}
              poster={video.thumbnailUrl}
              title={video.title}
              onProgress={handleVideoProgress}
              onTimeUpdate={(time) => setCurrentTime(time)}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Video Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Header */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 text-xs rounded-full ${typeInfo.color}`}>
                  {typeInfo.icon} {typeInfo.label}
                </span>
                {video.featured && (
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                    ⭐ Featured
                  </span>
                )}
                {video.isPremium && (
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                    💎 Premium
                  </span>
                )}
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {video.title}
              </h1>

              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center space-x-4">
                  <span>{formatViewCount(video.viewCount)} views</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span>{video.likeCount} likes</span>
                  <span>•</span>
                  <span>{video.shareCount} shares</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isLiked
                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <svg className="h-5 w-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{isLiked ? 'Liked' : 'Like'}</span>
                </button>

                <button
                  onClick={handleSave}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isSaved
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <svg className="h-5 w-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>

                {video.allowDownload && (
                  <button
                    onClick={() => videoService.downloadVideo(video.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download</span>
                  </button>
                )}
              </div>
            </div>

            {/* Author Info */}
            <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <img
                src={video.author?.avatar || '/api/placeholder/40/40'}
                alt={video.author?.displayName}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {video.author?.displayName || video.author?.username}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Published {formatDistanceToNow(new Date(video.publishedAt || video.createdAt), { addSuffix: true })}
                </p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Follow
              </button>
            </div>

            {/* Video Description */}
            {video.excerpt && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {video.excerpt}
                </p>
              </div>
            )}

            {/* Tags */}
            {video.tags && video.tags.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {video.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tabs for Comments/Transcript/Analytics */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('comments')}
                    className={`flex-1 px-4 py-3 text-sm font-medium ${
                      activeTab === 'comments'
                        ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    Comments
                  </button>
                  {video.transcript && (
                    <button
                      onClick={() => setActiveTab('transcript')}
                      className={`flex-1 px-4 py-3 text-sm font-medium ${
                        activeTab === 'transcript'
                          ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      Transcript
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`flex-1 px-4 py-3 text-sm font-medium ${
                      activeTab === 'analytics'
                        ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    Analytics
                  </button>
                </nav>
              </div>

              <div className="p-4">
                {activeTab === 'comments' && (
                  <VideoComments
                    videoId={video.id}
                    videoDuration={video.duration}
                    currentTime={currentTime}
                  />
                )}

                {activeTab === 'transcript' && video.transcript && (
                  <VideoTranscript
                    transcript={video.transcript}
                    currentTime={currentTime}
                    onTimeClick={(time) => {
                      if (videoPlayerRef.current) {
                        videoPlayerRef.current.seekTo(time);
                      }
                    }}
                  />
                )}

                {activeTab === 'analytics' && (
                  <VideoAnalytics
                    videoId={video.id}
                    viewCount={video.viewCount}
                    likeCount={video.likeCount}
                    shareCount={video.shareCount}
                    watchTime={video.watchTime}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Videos */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                Related Videos
              </h3>
              <div className="space-y-3">
                {relatedVideos.map((relatedVideo) => (
                  <div
                    key={relatedVideo.id}
                    onClick={() => handleRelatedVideoClick(relatedVideo)}
                    className="flex space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
                  >
                    <img
                      src={relatedVideo.thumbnailUrl || '/api/placeholder/120/68'}
                      alt={relatedVideo.title}
                      className="w-24 h-14 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                        {relatedVideo.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {formatViewCount(relatedVideo.viewCount)} views
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {videoService.formatDuration(relatedVideo.duration)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                Video Info
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                  <span className="text-gray-900 dark:text-white">
                    {videoService.formatDuration(video.duration)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">File Size:</span>
                  <span className="text-gray-900 dark:text-white">
                    {videoService.formatFileSize(video.fileSize)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Format:</span>
                  <span className="text-gray-900 dark:text-white">
                    {video.format?.toUpperCase() || 'MP4'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Category:</span>
                  <span className="text-gray-900 dark:text-white">
                    {video.category?.name || 'General'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Share Video
                </h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleShare('copy')}
                  className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6 text-gray-600 dark:text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Copy Link</span>
                </button>

                <button
                  onClick={() => handleShare('facebook')}
                  className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <svg className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Facebook</span>
                </button>

                <button
                  onClick={() => handleShare('twitter')}
                  className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <svg className="h-6 w-6 text-blue-400 mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Twitter</span>
                </button>

                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <svg className="h-6 w-6 text-green-600 dark:text-green-400 mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default VideoArticlePage;