import api from './api';

class VideoArticleService {
  // Get all video articles with filters and pagination
  async getAllVideoArticles(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/video-articles${queryString ? `?${queryString}` : ''}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch video articles');
    }
  }

  // Get single video article by ID or slug
  async getVideoArticle(id) {
    try {
      const response = await api.get(`/video-articles/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch video article');
    }
  }

  // Create new video article
  async createVideoArticle(videoArticleData) {
    try {
      const formData = new FormData();

      // Field mapping from camelCase to snake_case for specific fields
      const fieldMapping = {
        categoryId: 'category_id',
        subcategoryId: 'subcategory_id',
        authorId: 'primary_author_id',
        coAuthors: 'co_authors',
        featured: 'is_featured',
        heroSlider: 'is_hero_slider',
        trending: 'is_trending',
        pinned: 'is_pinned',
        allowComments: 'allow_comments',
        metaTitle: 'meta_title',
        metaDescription: 'meta_description',
        publishDate: 'scheduled_publish_date',
        imageCaption: 'featured_image_caption',
        authorBioOverride: 'author_bio_override',
        reviewNotes: 'review_notes',
        youtubeUrl: 'youtube_url',
        videoType: 'video_type'
      };

      // Add text fields with proper field name mapping
      Object.keys(videoArticleData).forEach(key => {
        if (videoArticleData[key] !== null && videoArticleData[key] !== undefined && key !== 'featuredImage') {
          // Use mapped field name if available, otherwise use original
          const fieldName = fieldMapping[key] || key;

          if (typeof videoArticleData[key] === 'object') {
            formData.append(fieldName, JSON.stringify(videoArticleData[key]));
          } else {
            formData.append(fieldName, videoArticleData[key]);
          }
        }
      });

      // Add file if exists
      if (videoArticleData.featuredImage instanceof File) {
        formData.append('featured_image', videoArticleData.featuredImage);
      }

      console.log('=== VIDEO ARTICLE FORM DATA DEBUG ===');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value} (type: ${typeof value})`);
      }

      const response = await api.post('/video-articles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create video article');
    }
  }

  // Update video article
  async updateVideoArticle(id, videoArticleData) {
    try {
      const formData = new FormData();

      // Field mapping from camelCase to snake_case for specific fields
      const fieldMapping = {
        categoryId: 'category_id',
        subcategoryId: 'subcategory_id',
        authorId: 'primary_author_id',
        coAuthors: 'co_authors',
        featured: 'is_featured',
        heroSlider: 'is_hero_slider',
        trending: 'is_trending',
        pinned: 'is_pinned',
        allowComments: 'allow_comments',
        metaTitle: 'meta_title',
        metaDescription: 'meta_description',
        publishDate: 'scheduled_publish_date',
        imageCaption: 'featured_image_caption',
        authorBioOverride: 'author_bio_override',
        reviewNotes: 'review_notes',
        youtubeUrl: 'youtube_url',
        videoType: 'video_type'
      };

      // Add text fields with proper field name mapping
      Object.keys(videoArticleData).forEach(key => {
        if (videoArticleData[key] !== null && videoArticleData[key] !== undefined && key !== 'featuredImage') {
          // Use mapped field name if available, otherwise use original
          const fieldName = fieldMapping[key] || key;

          if (typeof videoArticleData[key] === 'object') {
            formData.append(fieldName, JSON.stringify(videoArticleData[key]));
          } else {
            formData.append(fieldName, videoArticleData[key]);
          }
        }
      });

      // Add file if exists
      if (videoArticleData.featuredImage instanceof File) {
        formData.append('featured_image', videoArticleData.featuredImage);
      }

      const response = await api.put(`/video-articles/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update video article');
    }
  }

  // Delete video article
  async deleteVideoArticle(id) {
    try {
      const response = await api.delete(`/video-articles/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete video article');
    }
  }

  // Change video article status
  async changeVideoArticleStatus(id, statusData) {
    try {
      const response = await api.patch(`/video-articles/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to change video article status');
    }
  }

  // Publish video article
  async publishVideoArticle(id) {
    try {
      const response = await api.post(`/video-articles/${id}/publish`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to publish video article');
    }
  }

  // Get tags by category
  async getTagsByCategory(categoryId) {
    try {
      const response = await api.get(`/video-articles/tags/category/${categoryId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tags');
    }
  }

  // Get all tags
  async getAllTags() {
    try {
      const response = await api.get('/video-articles/tags/all');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tags');
    }
  }

  // Get all authors
  async getAuthors() {
    try {
      const response = await api.get('/video-articles/authors/all');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch authors');
    }
  }

  // Create new author
  async createAuthor(authorData) {
    try {
      const formData = new FormData();

      Object.keys(authorData).forEach(key => {
        if (authorData[key] !== null && authorData[key] !== undefined && key !== 'profileImage') {
          if (typeof authorData[key] === 'object') {
            formData.append(key, JSON.stringify(authorData[key]));
          } else {
            formData.append(key, authorData[key]);
          }
        }
      });

      if (authorData.profileImage instanceof File) {
        formData.append('profile_image', authorData.profileImage);
      }

      const response = await api.post('/video-articles/authors', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create author');
    }
  }

  // Get single author
  async getAuthor(id) {
    try {
      const response = await api.get(`/video-articles/authors/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch author');
    }
  }

  // Update author
  async updateAuthor(id, authorData) {
    try {
      const formData = new FormData();

      Object.keys(authorData).forEach(key => {
        if (authorData[key] !== null && authorData[key] !== undefined && key !== 'profileImage') {
          if (typeof authorData[key] === 'object') {
            formData.append(key, JSON.stringify(authorData[key]));
          } else {
            formData.append(key, authorData[key]);
          }
        }
      });

      if (authorData.profileImage instanceof File) {
        formData.append('profile_image', authorData.profileImage);
      }

      const response = await api.put(`/video-articles/authors/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update author');
    }
  }

  // Get categories
  async getCategories() {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  }

  // Get subcategories by category
  async getSubcategories(categoryId) {
    try {
      const response = await api.get(`/subcategories/category/${categoryId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch subcategories');
    }
  }

  // Get filtered categories
  async getFilteredCategories(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/video-articles/categories/filtered${queryString ? `?${queryString}` : ''}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch filtered categories');
    }
  }

  // Get filtered authors
  async getFilteredAuthors(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/video-articles/authors/filtered${queryString ? `?${queryString}` : ''}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch filtered authors');
    }
  }

  // Get comments for video article
  async getComments(videoArticleId) {
    try {
      const response = await api.get(`/video-articles/${videoArticleId}/comments`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch comments');
    }
  }

  // Add comment to video article
  async addComment(videoArticleId, commentData) {
    try {
      const response = await api.post(`/video-articles/${videoArticleId}/comments`, commentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add comment');
    }
  }

  // Track view for video article
  async trackView(videoArticleId) {
    try {
      const response = await api.post(`/video-articles/${videoArticleId}/track-view`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to track view');
    }
  }

  // Get RSS feed
  async getRSSFeed() {
    try {
      const response = await api.get('/video-articles/rss');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch RSS feed');
    }
  }
}

export default new VideoArticleService();