import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import articleService from '../../services/articleService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const EditArticle = () => {
  const { id } = useParams();
  const { theme } = useTheme();
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  const navigate = useNavigate();
  const autoSaveRef = useRef(null);
  const quillRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categoryTags, setCategoryTags] = useState([]);
  const [article, setArticle] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    excerpt: '',
    description: '',
    categoryId: '',
    subcategoryId: '',
    authorId: '',
    coAuthors: [],
    tags: [],
    custom_tags: '',
    featured: false,
    heroSlider: false,
    trending: false,
    pinned: false,
    allowComments: true,
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    publishDate: '',
    featuredImage: null,
    imageCaption: '',
    authorBioOverride: '',
    status: 'draft',
    reviewNotes: ''
  });

  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-black' : 'bg-white';
  const textMain = isDark ? 'text-white' : 'text-black';
  const cardBg = isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-black/10';
  const inputBg = isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-black';

  useEffect(() => {
    fetchArticle();
    fetchInitialData();
  }, [id]);

  useEffect(() => {
    if (formData.categoryId) {
      fetchSubcategories(formData.categoryId);
      fetchCategoryTags(formData.categoryId);
    }
  }, [formData.categoryId]);

  // Auto-save functionality
  useEffect(() => {
    if (article && (formData.title !== article.title || formData.content !== article.content)) {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
      autoSaveRef.current = setTimeout(() => {
        autoSave();
      }, 30000);
    }
    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
    };
  }, [formData, article]);

  const fetchArticle = async () => {
    try {
      const response = await articleService.getArticle(id);
      if (response.success) {
        const articleData = response.data;
        setArticle(articleData);

        // Populate form with existing data, preserving any unsaved changes
        setFormData(prevFormData => ({
           title: articleData.title || '',
            subtitle: articleData.subtitle || '',
            content: articleData.content || '',
            excerpt: articleData.excerpt || '',
            description: articleData.description || '',
            categoryId: articleData.categoryId || '',
            subcategoryId: articleData.subcategoryId || '',
            authorId: articleData.authorId || '',
            coAuthors: articleData.coAuthors || [],
            tags: articleData.tags || [],
            featured: articleData.featured || false,
            heroSlider: articleData.heroSlider || false,
            trending: articleData.trending || false,
            pinned: articleData.pinned || false,
            allowComments: articleData.allowComments !== false,
            metaTitle: articleData.metaTitle || '',
            metaDescription: articleData.metaDescription || '',
            keywords: articleData.keywords || [],
            publishDate: articleData.publishDate
              ? new Date(articleData.publishDate).toISOString().slice(0, -1)
              : '',
            featuredImage: prevFormData.featuredImage, // Preserve uploaded file
            imageCaption: articleData.imageCaption || '',
            authorBioOverride: articleData.authorBioOverride || '',
            status: articleData.status || 'draft',
            custom_tags: prevFormData.custom_tags || '', // Preserve custom tags input
            reviewNotes: articleData.reviewNotes || ''
          }));

        showSuccess('Article loaded successfully');
      } else {
        throw new Error(response.message || 'Failed to load article');
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      let errorMessage = 'Failed to load article';
      if (error.response?.status === 404) {
        errorMessage = 'Article not found';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to edit this article';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      showError(errorMessage);
      navigate('/admin/articles');
    } finally {
      setLoading(false);
    }
  };

  const fetchInitialData = async () => {
    try {
      const [categoriesRes, authorsRes] = await Promise.all([
        articleService.getCategories(),
        articleService.getAuthors()
      ]);

      setCategories(categoriesRes.data || []);
      setAuthors(authorsRes.data || []);

      if (categoriesRes.success && authorsRes.success) {
        showSuccess('Categories and authors loaded successfully');
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
      showError('Failed to load categories and authors');
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await articleService.getSubcategories(categoryId);
      setSubcategories(response.data || []);
      if (response.success && response.data?.length > 0) {
        showInfo(`${response.data.length} subcategories loaded`);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      showError('Failed to load subcategories');
    }
  };

  const fetchCategoryTags = async (categoryId) => {
    try {
      const response = await articleService.getTagsByCategory(categoryId);
      setCategoryTags(response.data || []);
      if (response.success && response.data?.length > 0) {
        showInfo(`${response.data.length} category tags loaded`);
      }
    } catch (error) {
      console.error('Error fetching category tags:', error);
      showError('Failed to load category tags');
    }
  };

  const autoSave = async () => {
    if (formData.title && formData.content) {
      try {
        await articleService.updateArticle(id, { ...formData, status: 'draft' });
        showInfo('Changes auto-saved successfully');
      } catch (error) {
        console.error('Auto-save failed:', error);
        showWarning('Auto-save failed - please save manually');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, featuredImage: file }));
    }
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
    const required = ['title', 'content', 'categoryId', 'authorId'];
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

  const handleSubmit = async (e, newStatus = null) => {
    e.preventDefault();

    const statusToSave = newStatus || formData.status;

    if (statusToSave !== 'draft' && !validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const submitData = {
         ...formData,
         status: statusToSave,
         coAuthors: formData.coAuthors,
         tags: formData.tags,
         keywords: formData.keywords
       };

      const response = await articleService.updateArticle(id, submitData);

      if (response.success) {
        // Update the article state with the response data
        if (response.data) {
          setArticle(response.data);
          // Update form data with server response to ensure consistency
          setFormData(prevFormData => ({
            ...prevFormData,
            status: response.data.status || prevFormData.status,
            reviewNotes: response.data.reviewNotes || prevFormData.reviewNotes,
            // Preserve any local changes that weren't sent to server
            featuredImage: prevFormData.featuredImage,
            custom_tags: prevFormData.custom_tags
          }));
        }

        // More specific success messages based on status
        let successMessage = '';
        switch (statusToSave) {
          case 'draft':
            successMessage = 'Article saved as draft successfully';
            break;
          case 'pending_review':
            successMessage = 'Article submitted for review successfully';
            break;
          case 'in_review':
            successMessage = 'Article moved to in-review status';
            break;
          case 'approved':
            successMessage = 'Article approved successfully';
            break;
          case 'published':
            successMessage = 'Article published successfully';
            break;
          case 'scheduled':
            successMessage = 'Article scheduled for publication';
            break;
          case 'rejected':
            successMessage = 'Article rejected';
            break;
          case 'archived':
            successMessage = 'Article archived successfully';
            break;
          default:
            successMessage = 'Article updated successfully';
        }

        showSuccess(successMessage);
        // Fetch fresh data from server to ensure UI is in sync
        fetchArticle();
      }
    } catch (error) {
      console.error('Update error:', error);

      // More specific error messages
      let errorMessage = 'Failed to update article';
      if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to perform this action';
      } else if (error.response?.status === 404) {
        errorMessage = 'Article not found';
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid data provided';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      showError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const getStatusActions = () => {
    const currentStatus = article?.status;
    const actions = [];

    const transitions = {
      draft: ['pending_review'],
      pending_review: ['in_review', 'rejected', 'draft'],
      in_review: ['approved', 'rejected', 'pending_review'],
      approved: ['scheduled', 'published', 'in_review'],
      scheduled: ['published', 'approved'],
      published: ['archived'],
      rejected: ['draft', 'pending_review'],
      archived: ['published']
    };

    if (transitions[currentStatus]) {
      transitions[currentStatus].forEach(status => {
        let buttonText = status.replace('_', ' ').toUpperCase();
        let buttonClass = 'bg-blue-600 hover:bg-blue-700';
        
        if (status === 'rejected') {
          buttonClass = 'bg-red-600 hover:bg-red-700';
        } else if (status === 'published') {
          buttonClass = 'bg-green-600 hover:bg-green-700';
        } else if (status === 'approved') {
          buttonClass = 'bg-emerald-600 hover:bg-emerald-700';
        }

        actions.push(
          <button
            key={status}
            type="button"
            onClick={(e) => handleSubmit(e, status)}
            disabled={saving}
            className={`px-4 py-2 text-white rounded-lg ${buttonClass} ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {buttonText}
          </button>
        );
      });
    }

    return actions;
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${bgMain} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className={`min-h-screen ${bgMain} flex items-center justify-center`}>
        <div className={`text-center ${textMain}`}>
          <h2 className="text-2xl font-bold mb-2">Article Not Found</h2>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            The article you're looking for doesn't exist or you don't have permission to edit it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgMain} p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${textMain}`}>Edit Article</h1>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
              Status: <span className={`font-semibold ${
                article.status === 'published' ? 'text-green-600' : 
                article.status === 'rejected' ? 'text-red-600' : 'text-blue-600'
              }`}>
                {article.status.replace('_', ' ').toUpperCase()}
              </span>
              {article.readingTime && (
                <span className="ml-4">Reading Time: {article.readingTime} min</span>
              )}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/admin/articles')}
              className={`px-4 py-2 border rounded-lg ${isDark ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              Back to Articles
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className={`${cardBg} p-6 rounded-lg border`}>
                <h2 className={`text-xl font-semibold ${textMain} mb-4`}>Basic Information</h2>
                
                <div className="space-y-4">
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
                      placeholder="Enter article title..."
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
                      placeholder="Enter article subtitle..."
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>
                      Content <span className="text-red-500">*</span>
                    </label>
                    <div className={`${isDark ? 'quill-dark' : ''}`}>
                      <ReactQuill
                        ref={quillRef}
                        value={formData.content}
                        onChange={handleContentChange}
                        modules={quillModules}
                        theme="snow"
                        style={{ minHeight: '300px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>
                      Excerpt
                    </label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full p-3 border rounded-lg ${inputBg}`}
                      placeholder="Brief summary of the article (max 500 characters)..."
                      maxLength={500}
                    />
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                      {formData.excerpt.length}/500 characters
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className={`${cardBg} p-6 rounded-lg border`}>
                <h2 className={`text-xl font-semibold ${textMain} mb-4`}>Featured Image</h2>
                
                <div className="space-y-4">
                  {article.featuredImage && !formData.featuredImage && (
                    <div>
                      <label className={`block text-sm font-medium ${textMain} mb-2`}>
                        Current Image
                      </label>
                      <img
                        src={article.featuredImage}
                        alt={article.title}
                        className="max-w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <div>
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>
                      {article.featuredImage ? 'Replace Image' : 'Upload Image'}
                    </label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                      className={`w-full p-3 border rounded-lg ${inputBg}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>
                      Image Caption
                    </label>
                    <input
                      type="text"
                      name="imageCaption"
                      value={formData.imageCaption}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg ${inputBg}`}
                      placeholder="Enter image caption..."
                    />
                  </div>

                  {formData.featuredImage && (
                    <div className="mt-4">
                      <label className={`block text-sm font-medium ${textMain} mb-2`}>
                        New Image Preview
                      </label>
                      <img
                        src={URL.createObjectURL(formData.featuredImage)}
                        alt="Preview"
                        className="max-w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
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
                      name="metaTitle"
                      value={formData.metaTitle}
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
                      name="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full p-3 border rounded-lg ${inputBg}`}
                      placeholder="SEO description (leave blank to use excerpt)"
                      maxLength={160}
                    />
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                      {formData.metaDescription.length}/160 characters
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Notes */}
              {article.reviewNotes && (
                <div className={`${cardBg} p-6 rounded-lg border`}>
                  <h2 className={`text-xl font-semibold ${textMain} mb-4`}>Review Notes</h2>
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <p className={textMain}>{article.reviewNotes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Save Actions */}
              <div className={`${cardBg} p-6 rounded-lg border`}>
                <h2 className={`text-xl font-semibold ${textMain} mb-4`}>Actions</h2>
                
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className={`w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {saving ? 'Saving...' : 'Save Draft'}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, 'published')}
                    disabled={saving}
                    className={`w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {saving ? 'Publishing...' : 'Publish Now'}
                  </button>

                  {getStatusActions().map((action, index) => (
                    <div key={index} className="w-full">
                      {action}
                    </div>
                  ))}
                </div>
              </div>

              {/* Publishing Options */}
              <div className={`${cardBg} p-6 rounded-lg border`}>
                <h2 className={`text-xl font-semibold ${textMain} mb-4`}>Publishing</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>
                      Scheduled Publish Date
                    </label>
                    <input
                      type="datetime-local"
                      name="publishDate"
                      value={formData.publishDate}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg ${inputBg}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className={textMain}>Featured Article</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="heroSlider"
                        checked={formData.heroSlider}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className={textMain}>Show in Hero Slider</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="trending"
                        checked={formData.trending}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className={textMain}>Add to Trending</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="pinned"
                        checked={formData.pinned}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className={textMain}>Pin to Top</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="allowComments"
                        checked={formData.allowComments}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className={textMain}>Allow Comments</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Category & Subcategory */}
              <div className={`${cardBg} p-6 rounded-lg border`}>
                <h2 className={`text-xl font-semibold ${textMain} mb-4`}>Category</h2>
                
                <div className="space-y-4">
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
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {subcategories.length > 0 && (
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
                        {subcategories.map(subcategory => (
                          <option key={subcategory.id} value={subcategory.id}>
                            {subcategory.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Author Selection */}
              <div className={`${cardBg} p-6 rounded-lg border`}>
                <h2 className={`text-xl font-semibold ${textMain} mb-4`}>Author</h2>
                
                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Primary Author <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="authorId"
                    value={formData.authorId}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg ${inputBg}`}
                    required
                  >
                    <option value="">Select Author</option>
                    {authors.map(author => (
                      <option key={author.id} value={author.id}>
                        {author.name} - {author.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4">
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Author Bio Override
                  </label>
                  <textarea
                    name="authorBioOverride"
                    value={formData.authorBioOverride}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full p-3 border rounded-lg ${inputBg}`}
                    placeholder="Override author bio for this article..."
                  />
                </div>
              </div>

              {/* Tags */}
              <div className={`${cardBg} p-6 rounded-lg border`}>
                <h2 className={`text-xl font-semibold ${textMain} mb-4`}>
                  Tags <span className="text-red-500">*</span>
                </h2>
                
                {/* Category Tags */}
                {categoryTags.length > 0 && (
                  <div className="mb-4">
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>
                      Suggested Tags (Category: {categories.find(c => c.id == formData.categoryId)?.name})
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categoryTags.map(tag => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleTagToggle(tag.name)}
                          className={`px-3 py-1 text-sm rounded-full border ${
                            formData.tags.includes(tag.name)
                              ? 'bg-blue-600 text-white border-blue-600'
                              : `${isDark ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'}`
                          }`}
                        >
                          {tag.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Tags Input */}
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

                {/* Selected Tags */}
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
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditArticle;