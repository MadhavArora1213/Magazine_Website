import React, { useState } from 'react';
import {
  SEOManager,
  MetaTagManager,
  SchemaBuilder,
  SitemapGenerator,
  PerformanceMonitor,
  PerformanceReports
} from '../../Components/SEO';

const SEOManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedContent, setSelectedContent] = useState({
    id: null,
    type: 'article',
    title: ''
  });

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: '📊',
      description: 'SEO dashboard and analytics'
    },
    {
      id: 'meta-tags',
      label: 'Meta Tags',
      icon: '🏷️',
      description: 'Manage meta tags and social media tags'
    },
    {
      id: 'schema',
      label: 'Schema Markup',
      icon: '📋',
      description: 'Structured data and rich snippets'
    },
    {
      id: 'sitemaps',
      label: 'Sitemaps',
      icon: '🗺️',
      description: 'XML sitemap generation and management'
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: '⚡',
      description: 'Core Web Vitals and performance monitoring'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: '📈',
      description: 'SEO and performance reports'
    }
  ];

  const handleContentSelect = (content) => {
    setSelectedContent(content);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* SEO Overview Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Pages</p>
                    <p className="text-2xl font-bold">1,247</p>
                  </div>
                  <svg className="h-8 w-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-blue-100 text-xs mt-2">+12% from last month</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Avg SEO Score</p>
                    <p className="text-2xl font-bold">78</p>
                  </div>
                  <svg className="h-8 w-8 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <p className="text-green-100 text-xs mt-2">+5 points from last month</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Schema Markups</p>
                    <p className="text-2xl font-bold">89</p>
                  </div>
                  <svg className="h-8 w-8 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-purple-100 text-xs mt-2">12 invalid schemas</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Core Web Vitals</p>
                    <p className="text-2xl font-bold">65%</p>
                  </div>
                  <svg className="h-8 w-8 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-orange-100 text-xs mt-2">Good vitals score</p>
              </div>
            </div>

            {/* Recent SEO Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Recent SEO Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Sitemap generated successfully
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Articles sitemap updated with 45 new URLs • 2 minutes ago
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Schema markup updated
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Article schema validated for "Latest Tech Trends" • 15 minutes ago
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Performance alert
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      LCP exceeded threshold on 3 pages • 1 hour ago
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab('meta-tags')}
                  className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🏷️</div>
                    <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Update Meta Tags
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('schema')}
                  className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📋</div>
                    <div className="text-sm font-medium text-green-800 dark:text-green-200">
                      Add Schema Markup
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('sitemaps')}
                  className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🗺️</div>
                    <div className="text-sm font-medium text-purple-800 dark:text-purple-200">
                      Generate Sitemap
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('performance')}
                  className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="text-sm font-medium text-orange-800 dark:text-orange-200">
                      Check Performance
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );

      case 'meta-tags':
        return (
          <div className="space-y-6">
            {/* Content Selector */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Select Content to Edit
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => handleContentSelect({ id: 1, type: 'article', title: 'Sample Article' })}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    selectedContent.type === 'article'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📝</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Article</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Edit article meta tags</div>
                  </div>
                </button>

                <button
                  onClick={() => handleContentSelect({ id: 2, type: 'page', title: 'About Page' })}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    selectedContent.type === 'page'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📄</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Page</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Edit page meta tags</div>
                  </div>
                </button>

                <button
                  onClick={() => handleContentSelect({ id: 3, type: 'category', title: 'Technology' })}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    selectedContent.type === 'category'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📂</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Category</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Edit category meta tags</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Meta Tag Manager */}
            {selectedContent.id && (
              <MetaTagManager
                contentId={selectedContent.id}
                contentType={selectedContent.type}
                content={{ title: selectedContent.title }}
                onMetaUpdate={(data) => {
                  console.log('Meta data updated:', data);
                }}
              />
            )}
          </div>
        );

      case 'schema':
        return (
          <SchemaBuilder
            contentId={selectedContent.id || 1}
            contentType={selectedContent.type || 'article'}
            content={{ title: selectedContent.title || 'Sample Content' }}
            onSchemaUpdate={(data) => {
              console.log('Schema updated:', data);
            }}
          />
        );

      case 'sitemaps':
        return <SitemapGenerator />;

      case 'performance':
        return (
          <PerformanceMonitor
            pageUrl={window.location.href}
            autoRefresh={true}
            refreshInterval={60000} // 1 minute
          />
        );

      case 'reports':
        return <PerformanceReports />;

      default:
        return null;
    }
  };

  return (
    <div className="seo-management">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          SEO Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Optimize your website for search engines and improve performance
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center px-3 py-4 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <span className="text-lg mb-1">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {renderTabContent()}
      </div>

      {/* SEO Tips Sidebar */}
      <div className="fixed right-6 top-24 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 hidden xl:block">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          SEO Best Practices
        </h3>

        <div className="space-y-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
              Title Tags
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Keep titles under 60 characters and include target keywords
            </p>
          </div>

          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
              Meta Descriptions
            </h4>
            <p className="text-xs text-green-700 dark:text-green-300">
              Write compelling descriptions between 120-160 characters
            </p>
          </div>

          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h4 className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-1">
              Schema Markup
            </h4>
            <p className="text-xs text-purple-700 dark:text-purple-300">
              Add structured data to enable rich snippets in search results
            </p>
          </div>

          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <h4 className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-1">
              Core Web Vitals
            </h4>
            <p className="text-xs text-orange-700 dark:text-orange-300">
              Optimize for LCP, FID, and CLS to improve user experience
            </p>
          </div>

          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
              Mobile Optimization
            </h4>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              Ensure your site works perfectly on mobile devices
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Need Help?
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            Check out our SEO documentation for detailed guides and best practices.
          </p>
          <button className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
            View Documentation
          </button>
        </div>
      </div>
    </div>
  );
};

export default SEOManagement;