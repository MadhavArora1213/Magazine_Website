import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import articleService from '../../services/articleService';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Suppress ReactQuill findDOMNode warning
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes?.('findDOMNode is deprecated') && args[0]?.includes?.('ReactQuill')) {
    return;
  }
  originalWarn.apply(console, args);
};

const CreateArticle = () => {
  const { theme } = useTheme();
  const { admin, isMasterAdmin, loading: authLoading } = useAdminAuth();
  const navigate = useNavigate();
  const autoSaveRef = useRef(null);

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [categoryTags, setCategoryTags] = useState([]);
  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [showTagForm, setShowTagForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [authorSuggestions, setAuthorSuggestions] = useState([]);
  const [tagSuggestions, setTagSuggestions] = useState([]);

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
    gallery: [],
    authorBioOverride: '',
    status: defaultStatus
  });

  const [newAuthor, setNewAuthor] = useState({
    name: '',
    email: '',
    bio: '',
    title: '',
    experience: '',
    education: '',
    profileImage: null,
    social_media: {
      twitter: '',
      linkedin: '',
      facebook: '',
      instagram: '',
      website: ''
    },
    expertise: []
  });

  const [newTag, setNewTag] = useState({
    name: '',
    slug: '',
    type: 'regular',
    category: '',
    description: ''
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
      fetchCategoryTags(formData.categoryId);
    }
  }, [formData.categoryId]);

  // Auto-save functionality
  useEffect(() => {
    if (formData.title && formData.content && formData.categoryId && formData.authorId) {
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
  }, [formData.title, formData.content, formData.categoryId, formData.authorId]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, authorsRes, tagsRes] = await Promise.all([
        articleService.getCategories(),
        articleService.getAuthors(),
        fetchAllTags()
      ]);

      if (categoriesRes.success) {
        setCategories(categoriesRes.data || []);
      } else {
        throw new Error(categoriesRes.message || 'Failed to load categories');
      }

      if (authorsRes.success) {
        setAuthors(authorsRes.data || []);
        // Set author suggestions when no author is selected
        if (!formData.authorId) {
          setAuthorSuggestions(authorsRes.data || []);
        }
      } else {
        throw new Error(authorsRes.message || 'Failed to load authors');
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast.error(error.message || 'Failed to load initial data. Please refresh the page.');
      setErrors({ general: 'Failed to load required data. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTags = async () => {
    try {
      // For now, we'll use the existing category tags. In a real implementation,
      // you might want to add an API endpoint to fetch all tags
      const response = await articleService.getTagsByCategory('all');
      if (response.success) {
        setAllTags(response.data || []);
        setTagSuggestions(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching all tags:', error);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await articleService.getSubcategories(categoryId);
      setSubcategories(response.data || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const fetchCategoryTags = async (categoryId) => {
    try {
      const response = await articleService.getTagsByCategory(categoryId);
      setCategoryTags(response.data || []);
    } catch (error) {
      console.error('Error fetching category tags:', error);
    }
  };

  const autoSave = async () => {
    if (formData.title && formData.content && formData.categoryId && formData.authorId) {
      try {
        const response = await articleService.createArticle({ ...formData, status: 'draft' });
        if (response.success) {
          toast.info('Draft auto-saved', { autoClose: 2000 });
          // Redirect to edit mode after first save
          navigate(`/admin/articles/edit/${response.data.id}`);
        }
      } catch (error) {
        console.error('Auto-save failed:', error);
        let errorMessage = 'Auto-save failed. Please save manually.';
        if (error.message && error.message.toLowerCase().includes('author')) {
          errorMessage = 'Please select an author before auto-saving.';
        } else if (error.message) {
          errorMessage = error.message;
        }
        toast.error(errorMessage);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Clear field-specific error
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }

    // Real-time validation for critical fields
    if (name === 'title' && value.length > 60) {
      setErrors(prev => ({
        ...prev,
        title: 'Title should be under 60 characters for better SEO'
      }));
    }

    if (name === 'metaTitle' && value.length > 60) {
      setErrors(prev => ({
        ...prev,
        metaTitle: 'Meta title should be under 60 characters'
      }));
    }

    if (name === 'metaDescription' && value.length > 160) {
      setErrors(prev => ({
        ...prev,
        metaDescription: 'Meta description should be under 160 characters'
      }));
    }
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, featuredImage: file }));
    }
  };

  const handleGalleryImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 5;

    if (formData.gallery.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed in gallery`);
      return;
    }

    // Validate each file
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 5MB`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      return true;
    });

    setFormData(prev => ({
      ...prev,
      gallery: [...prev.gallery, ...validFiles]
    }));
  };

  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
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
      const newTag = e.target.value.trim().toLowerCase();
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

  const handleAuthorInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const platform = name.replace('social_', '');
      setNewAuthor(prev => ({
        ...prev,
        social_media: {
          ...prev.social_media,
          [platform]: value
        }
      }));
    } else {
      setNewAuthor(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAuthorImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAuthor(prev => ({ ...prev, profileImage: file }));
    }
  };

  const createAuthor = async () => {
    try {
      // Validate required fields
      const requiredFields = ['name', 'email'];
      const missingFields = requiredFields.filter(field => !newAuthor[field] || newAuthor[field].trim() === '');

      if (missingFields.length > 0) {
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newAuthor.email)) {
        toast.error('Please enter a valid email address');
        return;
      }

      // Validate name length
      if (newAuthor.name.length < 2 || newAuthor.name.length > 100) {
        toast.error('Author name must be between 2 and 100 characters');
        return;
      }

      const response = await articleService.createAuthor(newAuthor);
      if (response.success) {
        toast.success('Author created successfully');
        setAuthors(prev => [...prev, response.data]);
        setFormData(prev => ({ ...prev, authorId: response.data.id }));
        setShowAuthorForm(false);
        setNewAuthor({
          name: '',
          email: '',
          bio: '',
          title: '',
          experience: '',
          education: '',
          profileImage: null,
          social_media: {
            twitter: '',
            linkedin: '',
            facebook: '',
            instagram: '',
            website: ''
          },
          expertise: []
        });
      }
    } catch (error) {
      console.error('Create author error:', error);
      toast.error(error.message || 'Failed to create author');
    }
  };

  const handleTagInputChange = (e) => {
    const { name, value } = e.target;
    setNewTag(prev => ({ ...prev, [name]: value }));

    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setNewTag(prev => ({ ...prev, slug }));
    }
  };

  const createTag = async () => {
    try {
      // Validate required fields
      if (!newTag.name || !newTag.slug) {
        toast.error('Tag name and slug are required');
        return;
      }

      // Validate slug format
      const slugRegex = /^[a-z0-9-]+$/;
      if (!slugRegex.test(newTag.slug)) {
        toast.error('Slug can only contain lowercase letters, numbers, and hyphens');
        return;
      }

      // For now, we'll add the tag to the local state
      // In a real implementation, you would call an API to create the tag
      const tagData = {
        ...newTag,
        id: Date.now().toString(), // Temporary ID
        categoryId: formData.categoryId
      };

      setAllTags(prev => [...prev, tagData]);
      setCategoryTags(prev => [...prev, tagData]);
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.name]
      }));

      toast.success('Tag created successfully');
      setShowTagForm(false);
      setNewTag({
        name: '',
        slug: '',
        type: 'regular',
        category: '',
        description: ''
      });
    } catch (error) {
      console.error('Create tag error:', error);
      toast.error(error.message || 'Failed to create tag');
    }
  };

  const validateForm = () => {
    const errors = {};

    // Required fields validation
    const required = ['title', 'content', 'categoryId', 'authorId'];
    const missing = required.filter(field => !formData[field]);

    if (missing.length > 0) {
      missing.forEach(field => {
        if (field === 'authorId') {
          errors[field] = 'Please select a primary author';
        } else {
          errors[field] = `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
        }
      });
    }

    // Title length validation
    if (formData.title && formData.title.length > 60) {
      errors.title = 'Title should be under 60 characters for better SEO';
    }

    // Tags validation
    if (formData.tags.length < 3) {
      errors.tags = 'Please add at least 3 tags';
    }

    // Word count validation
    const wordCount = formData.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount < 100) {
      errors.content = `Article content should be at least 100 words (currently ${wordCount} words)`;
    }

    // Meta title validation
    if (formData.metaTitle && formData.metaTitle.length > 60) {
      errors.metaTitle = 'Meta title should be under 60 characters';
    }

    // Meta description validation
    if (formData.metaDescription && formData.metaDescription.length > 160) {
      errors.metaDescription = 'Meta description should be under 160 characters';
    }

    // Excerpt length validation
    if (formData.excerpt && formData.excerpt.length > 500) {
      errors.excerpt = 'Excerpt should be under 500 characters';
    }

    return errors;
  };

  const handleSubmit = async (e, status = 'draft') => {
    e.preventDefault();

    // Mark all fields as touched for validation display
    const allFields = Object.keys(formData);
    const touchedFields = allFields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouched(touchedFields);

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the validation errors before submitting');
      return;
    }

    if (status !== 'draft' && !validateForm()) {
      return;
    }

    setSaving(true);
    setErrors({}); // Clear any previous errors

    try {
      // Ensure required fields are not empty
      const requiredFields = ['title', 'content', 'categoryId', 'authorId'];
      const missingFields = requiredFields.filter(field => !formData[field] || formData[field] === '');

      if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields);
        console.error('Form data:', formData);
        toast.error(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }

      let submitData = {
         ...formData,
         status,
         coAuthors: formData.coAuthors,
         tags: formData.tags,
         keywords: formData.keywords
        };

      console.log('Submitting article data:', submitData);

      // Handle gallery images upload
      if (formData.gallery.length > 0) {
        const galleryImagePaths = [];
        for (const file of formData.gallery) {
          try {
            const formDataUpload = new FormData();
            formDataUpload.append('image', file);

            const uploadResponse = await articleService.uploadFile('/api/upload/image', formDataUpload);
            if (uploadResponse.success && uploadResponse.data?.filename) {
              galleryImagePaths.push(uploadResponse.data.filename);
            }
          } catch (uploadError) {
            console.error('Error uploading gallery image:', uploadError);
            toast.error(`Failed to upload ${file.name}`);
          }
        }
        submitData.gallery_images = galleryImagePaths;
      }

      console.log('=== FRONTEND SUBMIT DEBUG ===');
      console.log('submitData:', submitData);
      console.log('categoryId type:', typeof submitData.categoryId);
      console.log('authorId type:', typeof submitData.authorId);
      console.log('categoryId value:', submitData.categoryId);
      console.log('authorId value:', submitData.authorId);

      const response = await articleService.createArticle(submitData);

      if (response.success) {
        toast.success(`Article ${status === 'draft' ? 'saved as draft' : 'created'} successfully`);
        navigate('/admin/articles');
      } else {
        throw new Error(response.message || 'Failed to create article');
      }
    } catch (error) {
      console.error('Create article error:', error);

      // Handle different types of errors
      if (error.response?.status === 400) {
        toast.error('Invalid data provided. Please check your inputs.');
        setErrors({ general: 'Please check your form data and try again.' });
      } else if (error.response?.status === 401) {
        toast.error('You are not authorized to create articles.');
        setErrors({ general: 'Authorization failed. Please log in again.' });
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to create articles.');
        setErrors({ general: 'Permission denied.' });
      } else if (error.response?.status >= 500) {
        toast.error('Server error. Please try again later.');
        setErrors({ general: 'Server error occurred. Please try again later.' });
      } else {
        toast.error(error.message || 'Failed to create article');
        setErrors({ general: error.message || 'An unexpected error occurred.' });
      }
    } finally {
      setSaving(false);
    }
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

  return (
    <div className={`min-h-screen ${bgMain} p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${textMain}`}>Create New Article</h1>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
              Create engaging content for your magazine
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/admin/articles')}
              className={`px-4 py-2 border rounded-lg ${isDark ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              Cancel
            </button>
          </div>
        </div>

        <form className="space-y-6">
          {/* General Error Display */}
          {errors.general && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <strong>Error:</strong> {errors.general}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading form data...</span>
            </div>
          )}

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
                      className={`w-full p-3 border rounded-lg ${inputBg} ${errors.title ? 'border-red-500' : ''}`}
                      placeholder="Enter compelling article title..."
                      required
                    />
                    <div className={`text-sm mt-1 ${errors.title ? 'text-red-500' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {errors.title || 'Keep it under 60 characters for better SEO'}
                    </div>
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
                        value={formData.content}
                        onChange={handleContentChange}
                        modules={quillModules}
                        theme="snow"
                        style={{ minHeight: '400px' }}
                        placeholder="Write your article content here..."
                      />
                    </div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
                      Word count: {formData.content ? formData.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length : 0} (minimum 100 words)
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
                      placeholder="Brief summary of the article (auto-generated if left empty)..."
                      maxLength={500}
                    />
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                      {formData.excerpt.length}/500 characters
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={2}
                      className={`w-full p-3 border rounded-lg ${inputBg}`}
                      placeholder="Additional description for internal use..."
                    />
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className={`${cardBg} p-6 rounded-lg border`}>
                <h2 className={`text-xl font-semibold ${textMain} mb-4`}>Featured Image</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>
                      Upload Image
                    </label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                      className={`w-full p-3 border rounded-lg ${inputBg}`}
                    />
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                      Recommended: 1200x630px, Max size: 5MB
                    </div>
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
                        Image Preview
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

              {/* Image Gallery */}
              <div className={`${cardBg} p-6 rounded-lg border`}>
                <h2 className={`text-xl font-semibold ${textMain} mb-4`}>Image Gallery</h2>

                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>
                      Upload Gallery Images (Max 5)
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={handleGalleryImageChange}
                      accept="image/*"
                      className={`w-full p-3 border rounded-lg ${inputBg}`}
                    />
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                      Select multiple images. Maximum 5 images allowed, each up to 5MB.
                    </div>
                  </div>

                  {/* Gallery Preview */}
                  {formData.gallery.length > 0 && (
                    <div className="mt-4">
                      <label className={`block text-sm font-medium ${textMain} mb-2`}>
                        Gallery Preview ({formData.gallery.length}/5)
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {formData.gallery.map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(index)}
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
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
                      maxLength={60}
                    />
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                      {formData.metaTitle.length}/60 characters
                    </div>
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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Save Actions */}
              <div className={`${cardBg} p-6 rounded-lg border`}>
                <h2 className={`text-xl font-semibold ${textMain} mb-4`}>Actions</h2>
                
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, 'draft')}
                    disabled={saving}
                    className={`w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
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

                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, 'pending_review')}
                    disabled={saving}
                    className={`w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Submit for Review
                  </button>
                </div>
              </div>

              {/* Publishing Options */}
              <div className={`${cardBg} p-6 rounded-lg border`}>
                <h2 className={`text-xl font-semibold ${textMain} mb-4`}>Publishing Options</h2>
                
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
                      min={new Date().toISOString().slice(0, -1)}
                      className={`w-full p-3 border rounded-lg ${inputBg}`}
                    />
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                      Leave empty for manual publishing
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="mr-3 h-4 w-4 text-blue-600"
                      />
                      <span className={textMain}>Featured Article</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="heroSlider"
                        checked={formData.heroSlider}
                        onChange={handleInputChange}
                        className="mr-3 h-4 w-4 text-blue-600"
                      />
                      <span className={textMain}>Show in Hero Slider</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="trending"
                        checked={formData.trending}
                        onChange={handleInputChange}
                        className="mr-3 h-4 w-4 text-blue-600"
                      />
                      <span className={textMain}>Add to Trending</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="pinned"
                        checked={formData.pinned}
                        onChange={handleInputChange}
                        className="mr-3 h-4 w-4 text-blue-600"
                      />
                      <span className={textMain}>Pin to Top</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="allowComments"
                        checked={formData.allowComments}
                        onChange={handleInputChange}
                        className="mr-3 h-4 w-4 text-blue-600"
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
                      <option value="all">All Categories</option>
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

                <div className="space-y-4">
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
                      <option value="">
                        {authors.length > 0 ? 'Select Author (or choose from suggestions below)' : 'No authors available - create new'}
                      </option>
                      <option value="all">All Authors</option>
                      {authors.map(author => (
                        <option key={author.id} value={author.id}>
                          {author.name} {author.title && `- ${author.title}`}
                        </option>
                      ))}
                      <option value="new">+ Add New Author</option>
                    </select>
                  </div>

                  {/* Author Suggestions */}
                  {!formData.authorId && authors.length > 0 && (
                    <div className="mt-4">
                      <label className={`block text-sm font-medium ${textMain} mb-2`}>
                        Suggested Authors
                      </label>
                      <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                        {authors.slice(0, 5).map(author => (
                          <button
                            key={author.id}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, authorId: author.id }))}
                            className={`p-3 text-left border rounded-lg transition-colors ${
                              isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className={`font-medium ${textMain}`}>{author.name}</div>
                            {author.title && (
                              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {author.title}
                              </div>
                            )}
                            {author.bio && (
                              <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-1 line-clamp-2`}>
                                {author.bio}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.authorId === 'new' && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                          Please fill in all required author information below. The author will be automatically added to the database upon article publication.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAuthorForm(true)}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Create New Author
                      </button>
                    </div>
                  )}

                  <div>
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
                      Suggested Tags ({categories.find(c => c.id == formData.categoryId)?.name})
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categoryTags.map(tag => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleTagToggle(tag.name)}
                          className={`px-3 py-1 text-sm rounded-full border transition-colors ${
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

                {/* All Tags Suggestions */}
                {allTags.length > 0 && (
                  <div className="mb-4">
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>
                      All Available Tags
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {allTags.slice(0, 20).map(tag => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleTagToggle(tag.name)}
                          className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                            formData.tags.includes(tag.name)
                              ? 'bg-blue-600 text-white border-blue-600'
                              : `${isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`
                          }`}
                        >
                          {tag.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Tags Input */}
                <div className="mb-4">
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Add Custom Tags
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.custom_tags}
                      onChange={handleCustomTags}
                      onKeyDown={handleCustomTags}
                      className={`flex-1 p-3 border rounded-lg ${inputBg}`}
                      placeholder="Type tag and press Enter or comma..."
                    />
                    <button
                      type="button"
                      onClick={() => setShowTagForm(true)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      + New Tag
                    </button>
                  </div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                    Press Enter or comma to add multiple tags, or click "New Tag" to create a structured tag
                  </div>
                </div>

                {/* Selected Tags */}
                {formData.tags.length > 0 && (
                  <div className="mt-4">
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>
                      Selected Tags ({formData.tags.length})
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
                            className="hover:bg-blue-700 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    {formData.tags.length < 3 && (
                      <p className="text-red-500 text-sm mt-2">
                        At least 3 tags are required for publication
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Author Creation Modal */}
        {showAuthorForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`${cardBg} rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-semibold ${textMain}`}>Create New Author</h3>
                <button
                  onClick={() => setShowAuthorForm(false)}
                  className={`text-gray-500 hover:text-gray-700`}
                >
                  ×
                </button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                  <strong>Note:</strong> All required fields must be filled. The author will be automatically added to the database upon article publication.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newAuthor.name}
                      onChange={handleAuthorInputChange}
                      className={`w-full p-3 border rounded-lg ${inputBg}`}
                      placeholder="Author's full name"
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={newAuthor.email}
                      onChange={handleAuthorInputChange}
                      className={`w-full p-3 border rounded-lg ${inputBg}`}
                      placeholder="author@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Title/Position
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newAuthor.title}
                    onChange={handleAuthorInputChange}
                    className={`w-full p-3 border rounded-lg ${inputBg}`}
                    placeholder="e.g., Senior Writer, Editor, Freelancer"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Bio <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="bio"
                    value={newAuthor.bio}
                    onChange={handleAuthorInputChange}
                    rows={4}
                    className={`w-full p-3 border rounded-lg ${inputBg}`}
                    placeholder="Brief biography of the author..."
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Experience
                  </label>
                  <textarea
                    name="experience"
                    value={newAuthor.experience}
                    onChange={handleAuthorInputChange}
                    rows={3}
                    className={`w-full p-3 border rounded-lg ${inputBg}`}
                    placeholder="Professional experience and achievements..."
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Education
                  </label>
                  <textarea
                    name="education"
                    value={newAuthor.education}
                    onChange={handleAuthorInputChange}
                    rows={2}
                    className={`w-full p-3 border rounded-lg ${inputBg}`}
                    placeholder="Educational background..."
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Profile Image
                  </label>
                  <input
                    type="file"
                    onChange={handleAuthorImageChange}
                    accept="image/*"
                    className={`w-full p-3 border rounded-lg ${inputBg}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Social Media Links
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(newAuthor.social_media).map(platform => (
                      <div key={platform}>
                        <label className={`block text-sm ${textMain} mb-1 capitalize`}>
                          {platform}
                        </label>
                        <input
                          type="url"
                          name={`social_${platform}`}
                          value={newAuthor.social_media[platform]}
                          onChange={handleAuthorInputChange}
                          className={`w-full p-2 border rounded ${inputBg}`}
                          placeholder={`https://${platform}.com/...`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAuthorForm(false)}
                  className={`px-4 py-2 border rounded-lg ${isDark ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={createAuthor}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Author
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tag Creation Modal */}
        {showTagForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`${cardBg} rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-semibold ${textMain}`}>Create New Tag</h3>
                <button
                  onClick={() => setShowTagForm(false)}
                  className={`text-gray-500 hover:text-gray-700`}
                >
                  ×
                </button>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mb-4">
                <p className={`text-sm ${isDark ? 'text-purple-300' : 'text-purple-800'}`}>
                  <strong>Note:</strong> All required fields must be filled. The tag will be automatically added to the database upon article publication.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Tag Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newTag.name}
                    onChange={handleTagInputChange}
                    className={`w-full p-3 border rounded-lg ${inputBg}`}
                    placeholder="e.g., Technology, Health, Politics"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={newTag.slug}
                    onChange={handleTagInputChange}
                    className={`w-full p-3 border rounded-lg ${inputBg}`}
                    placeholder="URL-friendly version (auto-generated)"
                    required
                  />
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                    Auto-generated from name. Only lowercase letters, numbers, and hyphens allowed.
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Type
                  </label>
                  <select
                    name="type"
                    value={newTag.type}
                    onChange={handleTagInputChange}
                    className={`w-full p-3 border rounded-lg ${inputBg}`}
                  >
                    <option value="regular">Regular</option>
                    <option value="special_feature">Special Feature</option>
                    <option value="trending">Trending</option>
                    <option value="multimedia">Multimedia</option>
                    <option value="interactive">Interactive</option>
                    <option value="event">Event</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newTag.description}
                    onChange={handleTagInputChange}
                    rows={3}
                    className={`w-full p-3 border rounded-lg ${inputBg}`}
                    placeholder="Brief description of the tag..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowTagForm(false)}
                  className={`px-4 py-2 border rounded-lg ${isDark ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={createTag}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Create Tag
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateArticle;