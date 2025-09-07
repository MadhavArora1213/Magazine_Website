import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import articleService from '../../services/articleService';
import categoryService from '../services/categoryService';
import { toast } from 'react-toastify';

const ArticleManagement = () => {
  const { theme } = useTheme();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [filterDataLoading, setFilterDataLoading] = useState(true);
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

  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-black' : 'bg-white';
  const textMain = isDark ? 'text-white' : 'text-black';
  const cardBg = isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-black/10';

  useEffect(() => {
    fetchArticles();
  }, [filters, pagination.current_page]);

  useEffect(() => {
    const loadFilterData = async () => {
      try {
        setFilterDataLoading(true);
        await Promise.all([fetchCategories(), fetchAuthors()]);
      } catch (error) {
        console.error('Error loading filter data:', error);
      } finally {
        setFilterDataLoading(false);
      }
    };

    loadFilterData();
  }, []);

  const fetchArticles = async () => {
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

      const response = await articleService.getAllArticles(params);
      
      if (response.success) {
        setArticles(response.data.articles || []);
        setPagination(response.data.pagination || {
          current_page: 1,
          total_pages: 1,
          total_items: 0
        });
      } else {
        setArticles([]);
        toast.error('Failed to fetch articles');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
      toast.error('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();

      // Axios wraps the response, so response.data is the actual API response
      if (response && response.data && response.data.success && response.data.data) {
        setCategories(response.data.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await articleService.getAuthors();

      if (response && response.success && response.data) {
        setAuthors(response.data);
      } else {
        setAuthors([]);
      }
    } catch (error) {
      console.error('Error fetching authors:', error);
      setAuthors([]);
    }
  };


  const deleteArticle = async (articleId) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        const response = await articleService.deleteArticle(articleId);
        if (response.success) {
          toast.success('Article deleted successfully');
          fetchArticles();
        }
      } catch (error) {
        toast.error('Failed to delete article');
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
            <h1 className={`text-3xl font-bold ${textMain}`}>Article Management</h1>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
              Manage all articles across the editorial workflow
            </p>
          </div>
          <Link
            to="/admin/articles/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Article
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Total Articles', value: pagination.total_items, color: 'blue' },
            { label: 'Published', value: articles.filter(a => a.status === 'published').length, color: 'green' },
            { label: 'In Review', value: articles.filter(a => a.status === 'in_review').length, color: 'yellow' },
            { label: 'Drafts', value: articles.filter(a => a.status === 'draft').length, color: 'gray' }
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
              placeholder="Search articles..."
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
              {filterDataLoading ? (
                <option disabled>Loading categories...</option>
              ) : categories && categories.length > 0 ? (
                categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              ) : (
                <option disabled>No categories found</option>
              )}
            </select>
            <select
              value={filters.author}
              onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
              className={`p-2 border rounded ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            >
              <option value="all">All Authors</option>
              {filterDataLoading ? (
                <option disabled>Loading authors...</option>
              ) : authors && authors.length > 0 ? (
                authors.map(author => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))
              ) : (
                <option disabled>No authors found</option>
              )}
            </select>
          </div>
        </div>

        {/* Articles Table */}
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
                      Article
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
                  {articles.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={`px-6 py-12 text-center ${textMain}`}>
                        No articles found. <Link to="/admin/articles/create" className="text-blue-600 hover:text-blue-800">Create your first article</Link>
                      </td>
                    </tr>
                  ) : (
                    articles.map((article) => (
                      <tr key={article.id} className={`${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-12 w-16 bg-gray-300 rounded mr-3 flex-shrink-0">
                              {article.featured_image && (
                                <img
                                  src={article.featured_image}
                                  alt={article.title}
                                  className="h-12 w-16 object-cover rounded"
                                />
                              )}
                            </div>
                            <div>
                              <div className={`text-sm font-medium ${textMain} line-clamp-2`}>
                                {article.title}
                              </div>
                              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} line-clamp-1`}>
                                {article.excerpt}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${textMain}`}>
                          {article.primaryAuthor?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(article.status)}`}>
                            {article.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${textMain}`}>
                          {article.category?.name || 'Uncategorized'}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(article.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Link
                            to={`/admin/articles/edit/${article.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteArticle(article.id)}
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
              Showing {articles.length} of {pagination.total_items} articles
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

export default ArticleManagement;