import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';
import { videoArticleService } from '../../services/videoArticleService';
import categoryService from '../services/categoryService';

const CreateVideoArticle = () => {
  const { theme } = useTheme();
  const { admin, isMasterAdmin, loading: authLoading } = useAdminAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  // Get admin role to determine default status
  const defaultStatus = admin && isMasterAdmin() ? 'published' : 'draft';

  // Show loading if auth is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    excerpt: '',
    description: '',
    youtube_url: '',
    video_type: 'youtube',
    duration: '',
    categoryId: '',
    subcategoryId: '',
    primary_author_id: '',
    co_authors: [],
    tags: [],
    custom_tags: '',
    is_featured: false,
    is_hero_slider: false,
    is_trending: false,
    is_pinned: false,
    allow_comments: true,
    meta_title: '',
    meta_description: '',
    seo_keywords: [],
    scheduled_publish_date: '',
    author_bio_override: '',
    featured_image_caption: '',
    status: defaultStatus
  });

  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-black' : 'bg-white';
  const textMain = isDark ? 'text-white' : 'text-black';
  const cardBg = isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-black/10';
  const inputBg = isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-black';

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (formData.categoryId) {
      fetchSubcategories(formData.categoryId);
    }
  }, [formData.categoryId]);

  const fetchInitialData = async () => {
    try {
      const [categoriesRes, authorsRes] = await Promise.all([
        categoryService.getCategories(),
        videoArticleService.getAuthors()
      ]);

      // Ensure categories is always an array
      const categoriesData = categoriesRes?.data || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);

      // Ensure authors is always an array
      const authorsData = authorsRes?.data || [];
      setAuthors(Array.isArray(authorsData) ? authorsData : []);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      showError('Failed to load categories and authors');
      // Set empty arrays as fallback
      setCategories([]);
      setAuthors([]);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await categoryService.getSubcategories(categoryId);
      setSubcategories(response.data || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleCustomTags = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag],
          custom_tags: ''
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, custom_tags: e.target.value }));
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const required = ['title', 'content', 'youtube_url', 'categoryId', 'primary_author_id'];
    const missing = required.filter(field => !formData[field]);

    if (missing.length > 0) {
      showError(`Missing required fields: ${missing.join(', ')}`);
      return false;
    }

    if (formData.tags.length < 3) {
      showError('Please add at least 3 tags');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Add all form data
      Object.keys(formData).forEach(key => {
        if (key === 'featuredImage' && formData[key]) {
          // Handle file upload
          formDataToSend.append('featured_image', formData[key]);
        } else if (key === 'co_authors' || key === 'tags' || key === 'seo_keywords') {
          // Handle arrays/objects
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
          // Handle regular fields
          formDataToSend.append(key, formData[key]);
        }
      });

      // Use fetch directly for file upload
      const response = await fetch('/api/video-articles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showSuccess('Video article created successfully');
        navigate('/admin/video-articles');
      } else {
        throw new Error(result.message || 'Failed to create video article');
      }
    } catch (error) {
      console.error('Create error:', error);
      let errorMessage = 'Failed to create video article';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${bgMain} p-6`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${textMain}`}>Create Video Article</h1>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
              Create a new video article with YouTube integration
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/video-articles')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Video Articles
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className={`${cardBg} p-6 rounded-lg border`}>
            <h2 className={`text-xl font-semibold ${textMain} mb-4`}>Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium ${textMain} mb-2`}>
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg ${inputBg}`}
                  placeholder="Enter video article title"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${textMain} mb-2`}>
                  Subtitle
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg ${inputBg}`}
                  placeholder="Enter subtitle (optional)"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className={`block text-sm font-medium ${textMain} mb-2`}>
                YouTube URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="youtube_url"
                value={formData.youtube_url}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg ${inputBg}`}
                placeholder="https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID"
                required
              />
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Enter a valid YouTube URL. The system will automatically extract the video ID and generate thumbnails.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium ${textMain} mb-2`}>
                  Video Type
                </label>
                <select
                  name="video_type"
                  value={formData.video_type}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg ${inputBg}`}
                >
                  <option value="youtube">YouTube</option>
                  <option value="youtube_shorts">YouTube Shorts</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${textMain} mb-2`}>
                  Duration (seconds)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg ${inputBg}`}
                  placeholder="Optional duration in seconds"
                  min="0"
                />
              </div>
            </div>

            {/* Featured Image */}
            <div className="mt-6">
              <label className={`block text-sm font-medium ${textMain} mb-2`}>
                Featured Image
              </label>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData(prev => ({ ...prev, featuredImage: file }));
                  }
                }}
                accept="image/*"
                className={`w-full p-3 border rounded-lg ${inputBg}`}
              />
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Upload a featured image for this video article (optional)
              </p>
            </div>

            <div className="mt-6">
              <label className={`block text-sm font-medium ${textMain} mb-2`}>
                Image Caption
              </label>
              <input
                type="text"
                name="featured_image_caption"
                value={formData.featured_image_caption}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg ${inputBg}`}
                placeholder="Enter image caption (optional)"
              />
            </div>

            <div className="mt-6">
              <label className={`block text-sm font-medium ${textMain} mb-2`}>
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={6}
                className={`w-full p-3 border rounded-lg ${inputBg}`}
                placeholder="Enter video article content"
                required
              />
            </div>

            <div className="mt-6">
              <label className={`block text-sm font-medium ${textMain} mb-2`}>
                Excerpt
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                className={`w-full p-3 border rounded-lg ${inputBg}`}
                placeholder="Brief excerpt for the video article"
              />
            </div>
          </div>

          {/* Category & Author */}
          <div className={`${cardBg} p-6 rounded-lg border`}>
            <h2 className={`text-xl font-semibold ${textMain} mb-4`}>Category & Author</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium ${textMain} mb-2`}>
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg ${inputBg}`}
                  required
                >
                  <option value="">Select Category</option>
                  {Array.isArray(categories) && categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${textMain} mb-2`}>
                  Subcategory
                </label>
                <select
                  name="subcategoryId"
                  value={formData.subcategoryId}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg ${inputBg}`}
                >
                  <option value="">Select Subcategory</option>
                  {Array.isArray(subcategories) && subcategories.map(subcategory => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${textMain} mb-2`}>
                  Primary Author <span className="text-red-500">*</span>
                </label>
                <select
                  name="primary_author_id"
                  value={formData.primary_author_id}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg ${inputBg}`}
                  required
                >
                  <option value="">Select Author</option>
                  {Array.isArray(authors) && authors.map(author => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className={`${cardBg} p-6 rounded-lg border`}>
            <h2 className={`text-xl font-semibold ${textMain} mb-4`}>
              Tags <span className="text-red-500">*</span>
            </h2>

            <div>
              <label className={`block text-sm font-medium ${textMain} mb-2`}>
                Add Custom Tags (Press Enter or comma to add)
              </label>
              <input
                type="text"
                value={formData.custom_tags}
                onChange={handleCustomTags}
                onKeyDown={handleCustomTags}
                className={`w-full p-3 border rounded-lg ${inputBg}`}
                placeholder="Type tag and press Enter..."
              />
            </div>

            {formData.tags.length > 0 && (
              <div className="mt-4">
                <label className={`block text-sm font-medium ${textMain} mb-2`}>
                  Selected Tags ({formData.tags.length}/∞)
                </label>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:bg-blue-700 rounded-full p-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                {formData.tags.length < 3 && (
                  <p className="text-red-500 text-sm mt-2">
                    At least 3 tags are required
                  </p>
                )}
              </div>
            )}
          </div>

          {/* SEO Settings */}
          <div className={`${cardBg} p-6 rounded-lg border`}>
            <h2 className={`text-xl font-semibold ${textMain} mb-4`}>SEO Settings</h2>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${textMain} mb-2`}>
                  Meta Title
                </label>
                <input
                  type="text"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg ${inputBg}`}
                  placeholder="SEO title (leave blank to use article title)"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${textMain} mb-2`}>
                  Meta Description
                </label>
                <textarea
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full p-3 border rounded-lg ${inputBg}`}
                  placeholder="SEO description (leave blank to use excerpt)"
                  maxLength={160}
                />
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                  {formData.meta_description.length}/160 characters
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${textMain} mb-2`}>
                  SEO Keywords
                </label>
                <input
                  type="text"
                  name="seo_keywords"
                  value={formData.seo_keywords.join(', ')}
                  onChange={(e) => {
                    const keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k);
                    setFormData(prev => ({ ...prev, seo_keywords: keywords }));
                  }}
                  className={`w-full p-3 border rounded-lg ${inputBg}`}
                  placeholder="Enter keywords separated by commas"
                />
              </div>
            </div>
          </div>

          {/* Author Bio Override */}
          <div className={`${cardBg} p-6 rounded-lg border`}>
            <h2 className={`text-xl font-semibold ${textMain} mb-4`}>Author Bio Override</h2>

            <div>
              <label className={`block text-sm font-medium ${textMain} mb-2`}>
                Author Bio Override
              </label>
              <textarea
                name="author_bio_override"
                value={formData.author_bio_override}
                onChange={handleInputChange}
                rows={3}
                className={`w-full p-3 border rounded-lg ${inputBg}`}
                placeholder="Override author bio for this article..."
              />
            </div>
          </div>

          {/* Publishing Options */}
          <div className={`${cardBg} p-6 rounded-lg border`}>
            <h2 className={`text-xl font-semibold ${textMain} mb-4`}>Publishing Options</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium ${textMain} mb-2`}>
                  Scheduled Publish Date
                </label>
                <input
                  type="datetime-local"
                  name="scheduled_publish_date"
                  value={formData.scheduled_publish_date}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg ${inputBg}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${textMain} mb-2`}>
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg ${inputBg}`}
                >
                  <option value="draft">Draft</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className={textMain}>Featured Article</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_hero_slider"
                  checked={formData.is_hero_slider}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className={textMain}>Show in Hero Slider</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_trending"
                  checked={formData.is_trending}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className={textMain}>Add to Trending</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_pinned"
                  checked={formData.is_pinned}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className={textMain}>Pin to Top</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="allow_comments"
                  checked={formData.allow_comments}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className={textMain}>Allow Comments</span>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/video-articles')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e)}
              disabled={loading}
              className={`px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              type="button"
              onClick={(e) => {
                const formDataToSend = new FormData();
                Object.keys(formData).forEach(key => {
                  if (key === 'featuredImage' && formData[key]) {
                    formDataToSend.append('featured_image', formData[key]);
                  } else if (key === 'co_authors' || key === 'tags' || key === 'seo_keywords') {
                    formDataToSend.append(key, JSON.stringify(formData[key]));
                  } else if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
                    formDataToSend.append(key, formData[key]);
                  }
                });
                formDataToSend.append('status', 'published');

                setLoading(true);
                fetch('/api/video-articles', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                  },
                  body: formDataToSend
                })
                .then(response => response.json())
                .then(result => {
                  if (result.success) {
                    showSuccess('Video article published successfully');
                    navigate('/admin/video-articles');
                  } else {
                    throw new Error(result.message || 'Failed to publish video article');
                  }
                })
                .catch(error => {
                  console.error('Publish error:', error);
                  showError(error.message || 'Failed to publish video article');
                })
                .finally(() => setLoading(false));
              }}
              disabled={loading}
              className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Publishing...' : 'Publish Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVideoArticle;