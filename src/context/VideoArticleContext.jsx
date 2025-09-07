import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { videoArticleService } from '../services/videoArticleService';
import { toast } from 'react-toastify';

const VideoArticleContext = createContext();

export const useVideoArticleContext = () => {
  const context = useContext(VideoArticleContext);
  if (!context) {
    throw new Error('useVideoArticleContext must be used within a VideoArticleProvider');
  }
  return context;
};

export const VideoArticleProvider = ({ children }) => {
  const [videoArticles, setVideoArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    author: 'all',
    search: ''
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0
  });
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Fetch video articles with current filters and pagination
  const fetchVideoArticles = useCallback(async (customFilters = {}, customPagination = {}) => {
    try {
      setLoading(true);

      const params = {
        page: customPagination.current_page || pagination.current_page,
        limit: 10
      };

      const currentFilters = { ...filters, ...customFilters };

      // Add filters only if they have values and are not 'all'
      if (currentFilters.status !== 'all') params.status = currentFilters.status;
      if (currentFilters.category !== 'all') params.category_id = currentFilters.category;
      if (currentFilters.author !== 'all') params.author_id = currentFilters.author;
      if (currentFilters.search) params.search = currentFilters.search;

      const response = await videoArticleService.getAllVideoArticles(params);

      if (response.success) {
        setVideoArticles(response.data.videoArticles || []);
        setPagination(response.data.pagination || {
          current_page: 1,
          total_pages: 1,
          total_items: 0
        });
        setLastUpdate(Date.now());
      } else {
        toast.error('Failed to fetch video articles');
      }
    } catch (error) {
      console.error('Error fetching video articles:', error);
      toast.error('Failed to fetch video articles');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.current_page]);

  // Update video article with optimistic update
  const updateVideoArticle = useCallback(async (id, updateData) => {
    // Optimistic update - update UI immediately
    const originalArticles = [...videoArticles];
    const articleIndex = videoArticles.findIndex(article => article.id === id);

    if (articleIndex !== -1) {
      const updatedArticle = { ...videoArticles[articleIndex], ...updateData };
      const newArticles = [...videoArticles];
      newArticles[articleIndex] = updatedArticle;
      setVideoArticles(newArticles);
    }

    try {
      const response = await videoArticleService.updateVideoArticle(id, updateData);

      if (response.success) {
        // Update with server response
        if (response.data) {
          const serverUpdatedArticle = response.data;
          setVideoArticles(prev =>
            prev.map(article =>
              article.id === id ? serverUpdatedArticle : article
            )
          );
        }
        toast.success('Video article updated successfully');
        setLastUpdate(Date.now());
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to update video article');
      }
    } catch (error) {
      // Revert optimistic update on error
      setVideoArticles(originalArticles);
      console.error('Update error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update video article';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [videoArticles]);

  // Create video article
  const createVideoArticle = useCallback(async (articleData) => {
    try {
      const response = await videoArticleService.createVideoArticle(articleData);

      if (response.success) {
        // Add new article to the list
        setVideoArticles(prev => [response.data, ...prev]);
        setLastUpdate(Date.now());
        toast.success('Video article created successfully');
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to create video article');
      }
    } catch (error) {
      console.error('Create error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create video article';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Delete video article with optimistic update
  const deleteVideoArticle = useCallback(async (id) => {
    // Optimistic update - remove from UI immediately
    const originalArticles = [...videoArticles];
    setVideoArticles(prev => prev.filter(article => article.id !== id));

    try {
      const response = await videoArticleService.deleteVideoArticle(id);

      if (response.success) {
        toast.success('Video article deleted successfully');
        setLastUpdate(Date.now());
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to delete video article');
      }
    } catch (error) {
      // Revert optimistic update on error
      setVideoArticles(originalArticles);
      console.error('Delete error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete video article';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [videoArticles]);

  // Refresh data
  const refreshData = useCallback(() => {
    fetchVideoArticles();
  }, [fetchVideoArticles]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, current_page: 1 })); // Reset to first page
  }, []);

  // Update pagination
  const updatePagination = useCallback((newPagination) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  }, []);

  // Auto-refresh every 30 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        fetchVideoArticles();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchVideoArticles, loading]);

  // Refresh when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !loading) {
        fetchVideoArticles();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchVideoArticles, loading]);

  const value = {
    videoArticles,
    loading,
    filters,
    pagination,
    lastUpdate,
    fetchVideoArticles,
    updateVideoArticle,
    createVideoArticle,
    deleteVideoArticle,
    refreshData,
    updateFilters,
    updatePagination
  };

  return (
    <VideoArticleContext.Provider value={value}>
      {children}
    </VideoArticleContext.Provider>
  );
};

export default VideoArticleContext;