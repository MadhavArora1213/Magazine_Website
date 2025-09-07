import api from './api';

const API_BASE = '/api/analytics';

export const analyticsService = {
  // Get dashboard overview
  async getDashboard(params = {}) {
    try {
      const response = await api.get(`${API_BASE}/dashboard`, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard analytics:', error);
      throw error;
    }
  },

  // Get content performance analytics
  async getContentPerformance(params = {}) {
    try {
      const response = await api.get(`${API_BASE}/content-performance`, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch content performance:', error);
      throw error;
    }
  },

  // Get user behavior analytics
  async getUserBehavior(params = {}) {
    try {
      const response = await api.get(`${API_BASE}/user-behavior`, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user behavior analytics:', error);
      throw error;
    }
  },

  // Get author performance analytics
  async getAuthorPerformance(params = {}) {
    try {
      const response = await api.get(`${API_BASE}/authors`, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch author analytics:', error);
      throw error;
    }
  },

  // Get real-time analytics
  async getRealtimeAnalytics() {
    try {
      const response = await api.get(`${API_BASE}/real-time`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch real-time analytics:', error);
      throw error;
    }
  },

  // Get SEO analytics
  async getSEOAnalytics(params = {}) {
    try {
      const response = await api.get(`${API_BASE}/seo`, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch SEO analytics:', error);
      throw error;
    }
  },

  // Get social media analytics
  async getSocialAnalytics(params = {}) {
    try {
      const response = await api.get(`${API_BASE}/social`, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch social analytics:', error);
      throw error;
    }
  },

  // Create custom report
  async createCustomReport(data) {
    try {
      const response = await api.post(`${API_BASE}/custom-report`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to create custom report:', error);
      throw error;
    }
  },

  // Track analytics event (client-side)
  async trackEvent(eventData) {
    try {
      // Don't use the api instance here as it might not be available for public tracking
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...eventData,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to track event');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to track analytics event:', error);
      // Don't throw error for tracking failures to avoid breaking user experience
      return null;
    }
  },

  // Helper functions for common tracking events
  trackPageView(url, pageTitle, referrer = null) {
    return this.trackEvent({
      eventType: 'page_view',
      eventData: {
        url,
        pageTitle,
        referrer
      },
      url,
      referrer
    });
  },

  trackArticleView(articleId, title, categoryId, authorId) {
    return this.trackEvent({
      eventType: 'article_view',
      eventData: {
        articleId,
        title,
        categoryId,
        authorId
      }
    });
  },

  trackSearch(query, resultsCount, filters = {}) {
    return this.trackEvent({
      eventType: 'search_query',
      eventData: {
        query,
        resultsCount,
        filters
      }
    });
  },

  trackNewsletterSignup(email, source, preferences = {}) {
    return this.trackEvent({
      eventType: 'newsletter_signup',
      eventData: {
        email,
        source,
        preferences
      }
    });
  },

  trackSocialShare(platform, articleId, articleTitle) {
    return this.trackEvent({
      eventType: 'social_share',
      eventData: {
        platform,
        articleId,
        articleTitle
      }
    });
  },

  trackCommentPosted(articleId, commentLength) {
    return this.trackEvent({
      eventType: 'comment_posted',
      eventData: {
        articleId,
        commentLength
      }
    });
  },

  // Utility functions for date formatting
  formatDateRange(startDate, endDate) {
    if (!startDate || !endDate) return {};

    return {
      startDate: new Date(startDate).toISOString().split('T')[0],
      endDate: new Date(endDate).toISOString().split('T')[0]
    };
  },

  // Get predefined date ranges
  getDateRanges() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 30);
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);

    return {
      today: {
        startDate: today.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      },
      yesterday: {
        startDate: yesterday.toISOString().split('T')[0],
        endDate: yesterday.toISOString().split('T')[0]
      },
      last7days: {
        startDate: weekAgo.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      },
      last30days: {
        startDate: monthAgo.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      },
      last90days: {
        startDate: threeMonthsAgo.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      }
    };
  },

  // Format numbers for display
  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  },

  // Format percentage
  formatPercentage(value, total) {
    if (total === 0) return '0%';
    return ((value / total) * 100).toFixed(1) + '%';
  },

  // Calculate growth rate
  calculateGrowth(current, previous) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous * 100).toFixed(1);
  },

  // Get color for growth rate
  getGrowthColor(growth) {
    const num = parseFloat(growth);
    if (num > 0) return 'text-green-600';
    if (num < 0) return 'text-red-600';
    return 'text-gray-600';
  },

  // Get trend indicator
  getTrendIndicator(growth) {
    const num = parseFloat(growth);
    if (num > 0) return '↗️';
    if (num < 0) return '↘️';
    return '➡️';
  }
};

export default analyticsService;