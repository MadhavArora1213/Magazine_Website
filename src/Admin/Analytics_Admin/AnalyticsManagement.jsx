import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  AnalyticsDashboard,
  ContentPerformance,
  UserAnalytics,
  AuthorPerformance,
  RealtimeAnalytics,
  SEOAnalytics,
  SocialAnalytics,
  CustomReports
} from '../../Components/Analytics';

const AnalyticsManagement = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Determine active tab based on current URL
    const path = location.pathname;
    if (path.includes('/content')) setActiveTab('content');
    else if (path.includes('/users')) setActiveTab('users');
    else if (path.includes('/authors')) setActiveTab('authors');
    else if (path.includes('/realtime')) setActiveTab('realtime');
    else if (path.includes('/seo')) setActiveTab('seo');
    else if (path.includes('/social')) setActiveTab('social');
    else if (path.includes('/reports')) setActiveTab('reports');
    else setActiveTab('dashboard');
  }, [location.pathname]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', component: AnalyticsDashboard },
    { id: 'content', label: 'Content', icon: '📝', component: ContentPerformance },
    { id: 'users', label: 'Users', icon: '👥', component: UserAnalytics },
    { id: 'authors', label: 'Authors', icon: '✍️', component: AuthorPerformance },
    { id: 'realtime', label: 'Real-time', icon: '⚡', component: RealtimeAnalytics },
    { id: 'seo', label: 'SEO', icon: '🔍', component: SEOAnalytics },
    { id: 'social', label: 'Social', icon: '📱', component: SocialAnalytics },
    { id: 'reports', label: 'Reports', icon: '📋', component: CustomReports }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || AnalyticsDashboard;

  return (
    <div className="analytics-management">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Analytics Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Comprehensive analytics and performance monitoring for your magazine website.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="analytics-content">
        <ActiveComponent />
      </div>

      {/* Quick Stats Footer */}
      <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Quick Stats Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">24/7</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Monitoring</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">8</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Analytics Types</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">∞</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Data Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">3</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Export Formats</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsManagement;