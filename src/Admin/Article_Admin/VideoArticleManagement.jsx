import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { videoArticleService } from '../../services/videoArticleService';
import categoryService from '../services/categoryService';
import { toast } from 'react-toastify';

const VideoArticleManagement = () => {
  const { theme } = useTheme();
  const [videoArticles, setVideoArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
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
  const [mounted, setMounted] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-black' : 'bg-white';
  const textMain = isDark ? 'text-white' : 'text-black';
  const cardBg = isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-black/10';

  useEffect(() => {
    fetchVideoArticles();
  }, [filters, pagination.current_page, mounted, refreshTrigger]);

  // Function to manually refresh the data
  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Set mounted to true on component mount
  useEffect(() => {
    setMounted(true);

    // Refresh data when page becomes visible (user navigates back)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchAuthors();
  }, []);

  const fetchVideoArticles = async () => {
    try {
      setLoading(true);

      // Prepare query parameters
      const params = {
        page: pagination.current_page,
        limit: 10
      };

      // Add filters only if they have values and are not 'all'
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.category !== 'all') params.category_id = filters.category;
      if (filters.author !== 'all') params.author_id = filters.author;
      if (filters.search) params.search = filters.search;

      const response = await videoArticleService.getAllVideoArticles(params);

      if (response.success) {
        setVideoArticles(response.data.videoArticles || []);
        setPagination(response.data.pagination || {
          current_page: 1,
          total_pages: 1,
          total_items: 0
        });
      } else {
        setVideoArticles([]);
        toast.error('Failed to fetch video articles');
      }
    } catch (error) {
      console.error('Error fetching video articles:', error);
      setVideoArticles([]);
      toast.error('Failed to fetch video articles');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await videoArticleService.getAuthors();
      if (response.success) {
        setAuthors(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };


  const deleteVideoArticle = async (videoArticleId) => {
    if (window.confirm('Are you sure you want to delete this video article?')) {
      try {
        const response = await videoArticleService.deleteVideoArticle(videoArticleId);
        if (response.success) {
          toast.success('Video article deleted successfully');
          fetchVideoArticles();
        }
      } catch (error) {
        toast.error('Failed to delete video article');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      pending_review: 'bg-yellow-100 text-yellow-800',
      in_review: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      scheduled: 'bg-purple-100 text-purple-800',
      published: 'bg-emerald-100 text-emerald-800',
      archived: 'bg-orange-100 text-orange-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.draft;
  };



  return (
    <div className={`min-h-screen ${bgMain} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${textMain}`}>Video Article Management</h1>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
              Manage all video articles across the editorial workflow
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={refreshData}
              disabled={loading}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <Link
              to="/admin/video-articles/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create New Video Article
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Total Video Articles', value: pagination.total_items, color: 'blue' },
            { label: 'Published', value: videoArticles.filter(a => a.status === 'published').length, color: 'green' },
            { label: 'In Review', value: videoArticles.filter(a => a.status === 'in_review').length, color: 'yellow' },
            { label: 'Drafts', value: videoArticles.filter(a => a.status === 'draft').length, color: 'gray' }
          ].map((stat, index) => (
            <div key={index} className={`${cardBg} p-6 rounded-lg border`}>
              <div className={`text-2xl font-bold ${textMain}`}>{stat.value}</div>
              <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className={`${cardBg} p-4 rounded-lg border mb-6`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search video articles..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className={`p-2 border rounded ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className={`p-2 border rounded ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending_review">Pending Review</option>
              <option value="in_review">In Review</option>
              <option value="approved">Approved</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className={`p-2 border rounded ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              value={filters.author}
              onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
              className={`p-2 border rounded ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            >
              <option value="all">All Authors</option>
              {authors.map(author => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Video Articles Table */}
        <div className={`${cardBg} rounded-lg border overflow-hidden`}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                      Video Article
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                      Author
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                      Status
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                      Category
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                      Created
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {videoArticles.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={`px-6 py-12 text-center ${textMain}`}>
                        No video articles found. <Link to="/admin/video-articles/create" className="text-blue-600 hover:text-blue-800">Create your first video article</Link>
                      </td>
                    </tr>
                  ) : (
                    videoArticles.map((videoArticle) => (
                      <tr key={videoArticle.id} className={`${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-12 w-16 bg-gray-300 rounded mr-3 flex-shrink-0">
                              {videoArticle.thumbnailUrl && (
                                <img
                                  src={videoArticle.thumbnailUrl}
                                  alt={videoArticle.title}
                                  className="h-12 w-16 object-cover rounded"
                                />
                              )}
                            </div>
                            <div>
                              <div className={`text-sm font-medium ${textMain} line-clamp-2`}>
                                {videoArticle.title}
                              </div>
                              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} line-clamp-1`}>
                                {videoArticle.youtubeUrl}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${textMain}`}>
                          {videoArticle.videoAuthor?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(videoArticle.status)}`}>
                            {videoArticle.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${textMain}`}>
                          {videoArticle.videoCategory?.name || 'Uncategorized'}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(videoArticle.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Link
                            to={`/admin/video-articles/edit/${videoArticle.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteVideoArticle(videoArticle.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Showing {videoArticles.length} of {pagination.total_items} video articles
            </div>
            <div className="flex space-x-2">
              {pagination.current_page > 1 && (
                <button
                  onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page - 1 }))}
                  className={`px-3 py-1 border rounded ${isDark ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}
                >
                  Previous
                </button>
              )}
              {pagination.current_page < pagination.total_pages && (
                <button
                  onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page + 1 }))}
                  className={`px-3 py-1 border rounded ${isDark ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VideoArticleManagement;