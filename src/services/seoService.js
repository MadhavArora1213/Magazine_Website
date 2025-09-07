import api from './api';

const API_BASE = '/api/seo';

export const seoService = {
  // SEO Analysis
  async getSEOAnalysis(contentType, contentId) {
    try {
      const response = await api.get(`${API_BASE}/analysis/${contentType}/${contentId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get SEO analysis:', error);
      throw error;
    }
  },

  // SEO Metadata Management
  async updateSEOMetadata(contentType, contentId, seoData) {
    try {
      const response = await api.put(`${API_BASE}/meta-tags/${contentType}/${contentId}`, seoData);
      return response.data;
    } catch (error) {
      console.error('Failed to update SEO metadata:', error);
      throw error;
    }
  },

  // Sitemap Management
  async getSitemap(type = 'main') {
    try {
      const response = await api.get(`${API_BASE}/sitemap/${type}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get sitemap:', error);
      throw error;
    }
  },

  async generateSitemap(type, options = {}) {
    try {
      const response = await api.post(`${API_BASE}/sitemap/${type}/generate`, options);
      return response.data;
    } catch (error) {
      console.error('Failed to generate sitemap:', error);
      throw error;
    }
  },

  // Schema Markup Management
  async getSchemaMarkup(contentType, contentId) {
    try {
      const response = await api.get(`${API_BASE}/schema/${contentType}/${contentId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get schema markup:', error);
      throw error;
    }
  },

  async updateSchemaMarkup(contentType, contentId, schemaData) {
    try {
      const response = await api.put(`${API_BASE}/schema/${contentType}/${contentId}`, schemaData);
      return response.data;
    } catch (error) {
      console.error('Failed to update schema markup:', error);
      throw error;
    }
  },

  // Performance Metrics
  async getPerformanceMetrics(params = {}) {
    try {
      const response = await api.get(`${API_BASE}/performance/metrics`, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to get performance metrics:', error);
      throw error;
    }
  },

  async getCoreWebVitals(timeframe = '30d') {
    try {
      const response = await api.get(`${API_BASE}/performance/core-web-vitals`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get Core Web Vitals:', error);
      throw error;
    }
  },

  // Bulk SEO Operations
  async bulkUpdateSEO(contentIds, contentType, seoData) {
    try {
      const response = await api.put(`${API_BASE}/bulk-update`, {
        contentIds,
        contentType,
        seoData
      });
      return response.data;
    } catch (error) {
      console.error('Failed to perform bulk SEO update:', error);
      throw error;
    }
  },

  // SEO Utilities
  generateSEOSuggestions(content, currentSEO = {}) {
    const suggestions = [];

    // Title suggestions
    if (!currentSEO.title) {
      suggestions.push({
        type: 'title',
        priority: 'high',
        message: 'Add a compelling title tag (30-60 characters)',
        suggestion: this.generateTitleSuggestion(content)
      });
    } else if (currentSEO.title.length < 30) {
      suggestions.push({
        type: 'title',
        priority: 'medium',
        message: 'Title is too short. Consider expanding it.',
        suggestion: this.expandTitleSuggestion(currentSEO.title)
      });
    } else if (currentSEO.title.length > 60) {
      suggestions.push({
        type: 'title',
        priority: 'medium',
        message: 'Title is too long. Consider shortening it.',
        suggestion: this.shortenTitleSuggestion(currentSEO.title)
      });
    }

    // Meta description suggestions
    if (!currentSEO.metaDescription) {
      suggestions.push({
        type: 'description',
        priority: 'high',
        message: 'Add a meta description (120-160 characters)',
        suggestion: this.generateDescriptionSuggestion(content)
      });
    } else if (currentSEO.metaDescription.length < 120) {
      suggestions.push({
        type: 'description',
        priority: 'medium',
        message: 'Meta description is too short',
        suggestion: this.expandDescriptionSuggestion(currentSEO.metaDescription)
      });
    }

    // Schema markup suggestions
    if (!currentSEO.structuredData) {
      suggestions.push({
        type: 'schema',
        priority: 'medium',
        message: 'Add structured data for rich snippets',
        suggestion: 'Implement JSON-LD schema markup for better search visibility'
      });
    }

    // Internal linking suggestions
    if (!currentSEO.internalLinks || currentSEO.internalLinks === 0) {
      suggestions.push({
        type: 'linking',
        priority: 'low',
        message: 'Add internal links to related content',
        suggestion: 'Link to 2-3 related articles or pages'
      });
    }

    return suggestions;
  },

  generateTitleSuggestion(content) {
    // Extract key phrases from content
    const words = content.title || content.headline || content.name || '';
    const keywords = this.extractKeywords(words);

    if (keywords.length > 0) {
      return `${keywords.slice(0, 3).join(' ')} | Your Site Name`;
    }

    return 'Compelling Title | Your Site Name';
  },

  expandTitleSuggestion(currentTitle) {
    const words = ['Guide', 'Complete', 'Ultimate', 'Best', 'Top', 'Essential'];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    return `${randomWord} ${currentTitle}`;
  },

  shortenTitleSuggestion(currentTitle) {
    const words = currentTitle.split(' ');
    if (words.length > 8) {
      return words.slice(0, 6).join(' ') + '...';
    }
    return currentTitle;
  },

  generateDescriptionSuggestion(content) {
    const text = content.description || content.excerpt || content.content || '';
    const cleanText = text.replace(/<[^>]*>/g, '').substring(0, 140);
    return cleanText + '...';
  },

  expandDescriptionSuggestion(currentDesc) {
    return currentDesc + ' Learn more about this topic and related information.';
  },

  extractKeywords(text) {
    // Simple keyword extraction (in production, use NLP library)
    const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'an', 'a'];

    return words
      .filter(word => !stopWords.includes(word))
      .filter((word, index, arr) => arr.indexOf(word) === index) // Remove duplicates
      .slice(0, 5); // Return top 5 keywords
  },

  // Schema.org generators
  generateArticleSchema(article) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': article.title,
      'description': article.excerpt || article.description,
      'image': article.featuredImage,
      'datePublished': article.publishedAt,
      'dateModified': article.updatedAt,
      'author': {
        '@type': 'Person',
        'name': article.author?.name,
        'url': article.author?.profileUrl
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Your Site Name',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://your-domain.com/logo.png'
        }
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `https://your-domain.com/article/${article.slug}`
      },
      'articleSection': article.category?.name,
      'keywords': article.tags?.join(', ')
    };
  },

  generateOrganizationSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'Your Organization Name',
      'url': 'https://your-domain.com',
      'logo': 'https://your-domain.com/logo.png',
      'description': 'Your organization description',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Street Address',
        'addressLocality': 'City',
        'addressRegion': 'State',
        'postalCode': 'ZIP',
        'addressCountry': 'UAE'
      },
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': '+971-XX-XXXXXXX',
        'contactType': 'customer service'
      },
      'sameAs': [
        'https://facebook.com/yourpage',
        'https://twitter.com/yourhandle',
        'https://linkedin.com/company/yourcompany'
      ]
    };
  },

  generateBreadcrumbSchema(breadcrumbs) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': crumb.name,
        'item': crumb.url
      }))
    };
  },

  generateFAQSchema(faqs) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    };
  },

  // Performance monitoring utilities
  measurePerformance(callback) {
    const startTime = performance.now();
    const result = callback();
    const endTime = performance.now();

    return {
      executionTime: endTime - startTime,
      result
    };
  },

  // Core Web Vitals measurement
  measureCoreWebVitals() {
    // This would integrate with web-vitals library
    return {
      lcp: null, // Largest Contentful Paint
      fid: null, // First Input Delay
      cls: null  // Cumulative Layout Shift
    };
  },

  // SEO score calculator
  calculateSEOScore(seoData) {
    let score = 0;
    let maxScore = 100;

    // Title (20 points)
    if (seoData.title) {
      const length = seoData.title.length;
      if (length >= 30 && length <= 60) {
        score += 20;
      } else if (length >= 20 && length <= 70) {
        score += 15;
      } else {
        score += 5;
      }
    }

    // Meta description (15 points)
    if (seoData.metaDescription) {
      const length = seoData.metaDescription.length;
      if (length >= 120 && length <= 160) {
        score += 15;
      } else if (length >= 100 && length <= 180) {
        score += 10;
      } else {
        score += 5;
      }
    }

    // Headings (10 points)
    if (seoData.headingStructure && seoData.headingStructure.h1 > 0) {
      score += 10;
    }

    // Images with alt text (10 points)
    if (seoData.imagesWithAlt && seoData.totalImages) {
      const ratio = seoData.imagesWithAlt / seoData.totalImages;
      score += Math.round(ratio * 10);
    }

    // Internal links (10 points)
    if (seoData.internalLinks && seoData.internalLinks > 0) {
      score += Math.min(seoData.internalLinks * 2, 10);
    }

    // Schema markup (15 points)
    if (seoData.structuredData) {
      score += 15;
    }

    // Canonical URL (5 points)
    if (seoData.canonicalUrl) {
      score += 5;
    }

    // Open Graph (10 points)
    let ogScore = 0;
    if (seoData.ogTitle) ogScore += 3;
    if (seoData.ogDescription) ogScore += 3;
    if (seoData.ogImage) ogScore += 4;
    score += ogScore;

    // Twitter Cards (5 points)
    let twitterScore = 0;
    if (seoData.twitterTitle) twitterScore += 2;
    if (seoData.twitterDescription) twitterScore += 2;
    if (seoData.twitterImage) twitterScore += 1;
    score += twitterScore;

    return Math.min(Math.round((score / maxScore) * 100), 100);
  }
};

export default seoService;