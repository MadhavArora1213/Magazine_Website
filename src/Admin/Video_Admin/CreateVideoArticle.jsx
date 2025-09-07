import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import videoArticleService from '../../services/videoArticleService';
import categoryService from '../services/categoryService';
import { toast } from 'react-toastify';

// Simple slug generation function
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

const CreateVideoArticle = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { admin, isMasterAdmin } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [tags, setTags] = useState([]);

  // Get admin role to determine default status
  const defaultStatus = admin && isMasterAdmin() ? 'published' : 'draft';

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    excerpt: '',
    description: '',
    youtubeUrl: '',
    videoType: 'youtube',
    duration: '',
    thumbnailUrl: '',
    categoryId: '',
    subcategoryId: '',
    authorId: '',
    coAuthors: [],
    authorBioOverride: '',
    featured: false,
    heroSlider: false,
    trending: false,
    pinned: false,
    allowComments: true,
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    tags: [],
    status: defaultStatus,
    workflowStage: 'creation',
    publishDate: '',
    scheduledPublishDate: '',
    assignedTo: '',
    nextAction: '',
    reviewNotes: '',
    rejectionReason: '',
    deadline: '',
    priority: 'normal'
  });
  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-black' : 'bg-white';
  const textMain = isDark ? 'text-white' : 'text-black';
  const cardBg = isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-black/10';

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [categoriesRes, authorsRes, tagsRes] = await Promise.all([
        categoryService.getCategories(),
        videoArticleService.getAuthors(),
        videoArticleService.getAllTags()
      ]);

      if (categoriesRes && categoriesRes.data && categoriesRes.data.success) {
        setCategories(categoriesRes.data.data);
      }
      if (authorsRes && authorsRes.success) {
        setAuthors(authorsRes.data);
      }
      if (tagsRes && tagsRes.success) {
        setTags(tagsRes.data);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast.error('Failed to load form data');
    }
  };

  const handleCategoryChange = async (categoryId) => {
    setFormData(prev => ({ ...prev, categoryId, subcategoryId: '' }));
    if (categoryId) {
      try {
        const response = await videoArticleService.getSubcategories(categoryId);
        if (response && response.success) {
          setSubcategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    } else {
      setSubcategories([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeaturedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleTagChange = (tagId) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        featuredImage: featuredImage
      };

      const response = await videoArticleService.createVideoArticle(submitData);

      if (response.success) {
        toast.success('Video article created successfully');
        navigate('/admin/video-articles');
      } else {
        toast.error('Failed to create video article');
      }
    } catch (error) {
      console.error('Error creating video article:', error);
      toast.error(error.message || 'Failed to create video article');
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
              Create a new video article for your magazine
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/video-articles')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>

        {/* Workflow Status Indicator */}
        <div className={`${cardBg} p-6 rounded-lg border mb-6`}>
          <h2 className={`text-xl font-semibold ${textMain} mb-4`}>Workflow Status</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                formData.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                formData.status === 'pending_review' ? 'bg-yellow-100 text-yellow-800' :
                formData.status === 'in_review' ? 'bg-blue-100 text-blue-800' :
                formData.status === 'approved' ? 'bg-green-100 text-green-800' :
                formData.status === 'scheduled' ? 'bg-purple-100 text-purple-800' :
                formData.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                formData.status === 'archived' ? 'bg-orange-100 text-orange-800' :
                formData.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {formData.status.replace('_', ' ').toUpperCase()}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                formData.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                formData.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                formData.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {formData.priority.toUpperCase()} PRIORITY
              </div>
            </div>
            {formData.deadline && (
              <div className="text-right">
                <div className={`text-sm font-medium ${textMain}`}>
                  Deadline: {new Date(formData.deadline).toLocaleString()}
                </div>
                <div className={`text-xs ${
                  new Date(formData.deadline) < new Date() ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {new Date(formData.deadline) < new Date() ? 'OVERDUE' : 'ON TRACK'}
                </div>
              </div>
            )}
          </div>

          {/* SLA Timer Display */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className={`text-xs font-medium ${textMain} mb-1`}>SLA Status</div>
              <div className={`text-sm ${
                formData.status === 'pending_review' && new Date() > new Date(Date.now() + 4 * 60 * 60 * 1000) ? 'text-red-500' :
                formData.status === 'in_review' && new Date() > new Date(Date.now() + 48 * 60 * 60 * 1000) ? 'text-red-500' :
                'text-green-500'
              }`}>
                {formData.status === 'pending_review' ? '4h assignment SLA' :
                 formData.status === 'in_review' ? '48h review SLA' :
                 'No active SLA'}
              </div>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className={`text-xs font-medium ${textMain} mb-1`}>Time in Current Status</div>
              <div className={`text-sm ${textMain}`}>
                Just created
              </div>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className={`text-xs font-medium ${textMain} mb-1`}>Auto-publish Status</div>
              <div className={`text-sm ${
                formData.status === 'scheduled' && formData.scheduledPublishDate ?
                  (new Date(formData.scheduledPublishDate) <= new Date() ? 'text-green-500' : 'text-blue-500') :
                  'text-gray-500'
              }`}>
                {formData.status === 'scheduled' && formData.scheduledPublishDate ?
                  (new Date(formData.scheduledPublishDate) <= new Date() ? 'Ready to publish' : 'Scheduled for later') :
                  'Not scheduled'}
              </div>
            </div>
          </div>

          {formData.nextAction && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className={`text-sm font-medium ${textMain} mb-1`}>Next Action Required:</div>
              <div className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                {formData.nextAction}
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={`${cardBg} p-6 rounded-lg border`}>
            {/* Basic Information */}
            <div className="mb-6">
              <h3 className={`text-lg font-semibold ${textMain} mb-4`}>Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
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
                    className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Slug (Auto-generated)
                  </label>
                  <input
                    type="text"
                    value={formData.title ? generateSlug(formData.title) : ''}
                    readOnly
                    className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-600'} cursor-not-allowed`}
                    placeholder="Slug will be generated from title"
                  />
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    URL-friendly version of the title
                  </p>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Reading Time (Auto-calculated)
                  </label>
                  <input
                    type="text"
                    value={formData.content ? `~${Math.ceil(formData.content.split(/\s+/).length / 200)} min read` : '0 min read'}
                    readOnly
                    className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-600'} cursor-not-allowed`}
                    placeholder="Calculated from content"
                  />
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Estimated reading time based on word count
                  </p>
                </div>
              </div>
            </div>

            {/* Video Information */}
            <div className="mb-6">
              <h3 className={`text-lg font-semibold ${textMain} mb-4`}>Video Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    YouTube URL *
                  </label>
                  <input
                    type="url"
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleInputChange}
                    required
                    placeholder="https://www.youtube.com/watch?v=..."
                    className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Video Type
                  </label>
                  <select
                    name="videoType"
                    value={formData.videoType}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="youtube">YouTube</option>
                    <option value="youtube_shorts">YouTube Shorts</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 10:30"
                    className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    name="thumbnailUrl"
                    value={formData.thumbnailUrl}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="mb-6">
              <h3 className={`text-lg font-semibold ${textMain} mb-4`}>Content</h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Excerpt *
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Full Content
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={8}
                    className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
              </div>
            </div>

            {/* Categories and Authors */}
            <div className="mb-6">
              <h3 className={`text-lg font-semibold ${textMain} mb-4`}>Categories & Authors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Category *
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    required
                    className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
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
                    className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories.map(subcategory => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Primary Author *
                  </label>
                  <select
                    name="authorId"
                    value={formData.authorId}
                    onChange={handleInputChange}
                    required
                    className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="">Select Author</option>
                    {authors.map(author => (
                      <option key={author.id} value={author.id}>
                        {author.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="draft">Draft</option>
                    <option value="pending_review">Pending Review</option>
                    <option value="in_review">In Review</option>
                    <option value="approved">Approved</option>
                    <option value="scheduled">Scheduled</option>
                    {admin && isMasterAdmin() && (
                      <option value="published">Published</option>
                    )}
                    <option value="archived">Archived</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {admin && isMasterAdmin()
                      ? 'Master admins can publish directly'
                      : 'Follow the editorial workflow process'
                    }
                  </p>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Workflow Stage
                  </label>
                  <select
                    name="workflowStage"
                    value={formData.workflowStage}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="creation">Creation</option>
                    <option value="section_editor_review">Section Editor Review</option>
                    <option value="fact_checking">Fact Checking</option>
                    <option value="copy_editing">Copy Editing</option>
                    <option value="final_review">Final Review</option>
                    <option value="scheduling">Scheduling</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Assigned To
                  </label>
                  <select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="">Select Editor</option>
                    {authors.map(author => (
                      <option key={author.id} value={author.id}>
                        {author.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Workflow Management */}
              <div className="mb-6">
                <h3 className={`text-lg font-semibold ${textMain} mb-4`}>Workflow Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>
                      Deadline
                    </label>
                    <input
                      type="datetime-local"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                </div>

                {/* Next Action */}
                <div className="mt-4">
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Next Action
                  </label>
                  <textarea
                    name="nextAction"
                    value={formData.nextAction}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Describe the next action required for this article"
                    className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>

                {/* Review Notes */}
                <div className="mt-4">
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Review Notes
                  </label>
                  <textarea
                    name="reviewNotes"
                    value={formData.reviewNotes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Add any review notes or feedback"
                    className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>

                {/* Rejection Reason (only show if status is rejected) */}
                {formData.status === 'rejected' && (
                  <div className="mt-4">
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>
                      Rejection Reason *
                    </label>
                    <textarea
                      name="rejectionReason"
                      value={formData.rejectionReason}
                      onChange={handleInputChange}
                      rows={3}
                      required={formData.status === 'rejected'}
                      placeholder="Explain why this article was rejected"
                      className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                )}
              </div>

              {/* Author Bio Override */}
              <div className="mb-4">
                <label className={`block text-sm font-medium ${textMain} mb-2`}>
                  Author Bio Override
                </label>
                <textarea
                  name="authorBioOverride"
                  value={formData.authorBioOverride}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Override the default author bio (optional)"
                  className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>

              {/* Publish Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Publish Date
                  </label>
                  <input
                    type="datetime-local"
                    name="publishDate"
                    value={formData.publishDate}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Scheduled Publish Date
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduledPublishDate"
                    value={formData.scheduledPublishDate}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
              </div>

            </div>

            {/* Featured Image */}
            <div className="mb-6">
              <h3 className={`text-lg font-semibold ${textMain} mb-4`}>Featured Image</h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                {imagePreview && (
                  <div>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>
                      Image Caption
                    </label>
                    <input
                      type="text"
                      name="imageCaption"
                      value={formData.imageCaption || ''}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>
                      Image Alt Text
                    </label>
                    <input
                      type="text"
                      name="imageAlt"
                      value={formData.imageAlt || ''}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="mb-6">
              <h3 className={`text-lg font-semibold ${textMain} mb-4`}>Settings</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className={`text-sm ${textMain}`}>Featured</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="heroSlider"
                    checked={formData.heroSlider}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className={`text-sm ${textMain}`}>Hero Slider</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="trending"
                    checked={formData.trending}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className={`text-sm ${textMain}`}>Trending</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="allowComments"
                    checked={formData.allowComments}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className={`text-sm ${textMain}`}>Allow Comments</span>
                </label>
              </div>
            </div>

            {/* SEO */}
            <div className="mb-6">
              <h3 className={`text-lg font-semibold ${textMain} mb-4`}>SEO Settings</h3>
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
                    className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
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
                    className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Keywords
                  </label>
                  <textarea
                    name="keywords"
                    value={Array.isArray(formData.keywords) ? formData.keywords.join('\n') : formData.keywords}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        keywords: value ? value.split('\n').map(k => k.trim()).filter(k => k) : []
                      }));
                    }}
                    placeholder="Enter each keyword on a new line"
                    rows={4}
                    className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Enter each keyword on a separate line
                  </p>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>
                    Tags
                  </label>
                  <div className={`border rounded-lg p-3 ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {Array.isArray(formData.tags) && formData.tags.map(tagId => {
                        const tag = tags.find(t => t.id === tagId);
                        return tag ? (
                          <span
                            key={tagId}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                          >
                            {tag.name}
                            <button
                              type="button"
                              onClick={() => handleTagChange(tagId)}
                              className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                    <select
                      onChange={(e) => {
                        const tagId = e.target.value;
                        if (tagId && !formData.tags.includes(tagId)) {
                          handleTagChange(tagId);
                        }
                        e.target.value = '';
                      }}
                      className={`w-full p-2 border rounded ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    >
                      <option value="">Select tags to add...</option>
                      {tags.filter(tag => !formData.tags.includes(tag.id)).map(tag => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Select tags from the dropdown to associate with this article
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Actions */}
          <div className={`${cardBg} p-6 rounded-lg border mb-6`}>
            <h2 className={`text-xl font-semibold ${textMain} mb-4`}>Workflow Actions</h2>
            <div className="flex flex-wrap gap-3">
              {formData.status === 'draft' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, status: 'pending_review' }));
                      setFormData(prev => ({ ...prev, nextAction: 'Awaiting section editor assignment' }));
                    }}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                  >
                    Submit for Review
                  </button>
                  {admin && isMasterAdmin() && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, status: 'published' }))}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Publish Now
                    </button>
                  )}
                </>
              )}

              {formData.status === 'pending_review' && admin && isMasterAdmin() && (
                <>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status: 'in_review' }))}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Start Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status: 'rejected' }))}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Reject Article
                  </button>
                </>
              )}

              {formData.status === 'in_review' && admin && isMasterAdmin() && (
                <>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status: 'approved' }))}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Approve for Publishing
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status: 'rejected' }))}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Reject Article
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status: 'draft' }))}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                  >
                    Request Revisions
                  </button>
                </>
              )}

              {formData.status === 'approved' && admin && isMasterAdmin() && (
                <>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status: 'scheduled' }))}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                  >
                    Schedule for Publishing
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status: 'published' }))}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Publish Now
                  </button>
                </>
              )}

              {formData.status === 'scheduled' && admin && isMasterAdmin() && (
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status: 'published' }))}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Publish Now
                </button>
              )}

              {formData.status === 'published' && admin && isMasterAdmin() && (
                <>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status: 'archived' }))}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                  >
                    Archive Article
                  </button>
                </>
              )}

              {formData.status === 'rejected' && (
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status: 'draft' }))}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Resubmit for Review
                </button>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Video Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVideoArticle;