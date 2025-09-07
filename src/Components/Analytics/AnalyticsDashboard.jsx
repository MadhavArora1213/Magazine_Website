import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { formatDistanceToNow } from 'date-fns';
import ContentPerformance from './ContentPerformance';
import UserAnalytics from './UserAnalytics';
import AuthorPerformance from './AuthorPerformance';
import RealtimeAnalytics from './RealtimeAnalytics';
import SEOAnalytics from './SEOAnalytics';
import SocialAnalytics from './SocialAnalytics';
import CustomReports from './CustomReports';

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [dateRange, setDateRange] = useState('last30days');
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [realtimeData, setRealtimeData] = useState(null);

  // Date range options
  const dateRanges = analyticsService.getDateRanges();

  useEffect(() => {
    loadDashboardData();
    // Set up real-time updates
    const interval = setInterval(loadRealtimeData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [dateRange, customDateRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = dateRange === 'custom'
        ? analyticsService.formatDateRange(customDateRange.startDate, customDateRange.endDate)
        : dateRanges[dateRange];

      const response = await analyticsService.getDashboard(params);
      setDashboardData(response.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const loadRealtimeData = async () => {
    try {
      const response = await analyticsService.getRealtimeAnalytics();
      setRealtimeData(response.data);
    } catch (err) {
      console.error('Failed to load real-time data:', err);
    }
  };

  const MetricCard = ({ title, value, change, changeType, icon, color = 'blue' }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change && (
            <p className={`text-sm flex items-center ${
              changeType === 'positive' ? 'text-green-600' :
              changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
            }`}>
              <span className="mr-1">
                {changeType === 'positive' ? '↗️' :
                 changeType === 'negative' ? '↘️' : '➡️'}
              </span>
              {change} from last period
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          color === 'blue' ? 'bg-blue-100 dark:bg-blue-900' :
          color === 'green' ? 'bg-green-100 dark:bg-green-900' :
          color === 'purple' ? 'bg-purple-100 dark:bg-purple-900' :
          color === 'orange' ? 'bg-orange-100 dark:bg-orange-900' :
          'bg-gray-100 dark:bg-gray-700'
        }`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'content', label: 'Content', icon: '📝' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'authors', label: 'Authors', icon: '✍️' },
    { id: 'realtime', label: 'Real-time', icon: '⚡' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
    { id: 'social', label: 'Social', icon: '📱' },
    { id: 'reports', label: 'Reports', icon: '📋' }
  ];

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="flex items-center">
          <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
        </div>
        <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
        <button
          onClick={loadDashboardData}
          className="mt-4 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-4 py-2 rounded text-sm hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive insights into your website performance and audience behavior.
        </p>
      </div>

      {/* Date Range Selector */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Date Range:
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last7days">Last 7 days</option>
            <option value="last30days">Last 30 days</option>
            <option value="last90days">Last 90 days</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {dateRange === 'custom' && (
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={customDateRange.startDate}
              onChange={(e) => setCustomDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-gray-500 dark:text-gray-400">to</span>
            <input
              type="date"
              value={customDateRange.endDate}
              onChange={(e) => setCustomDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        <button
          onClick={loadDashboardData}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Real-time Status */}
      {realtimeData && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Live Data
              </span>
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              {realtimeData.activeUsers} active users in last 5 minutes
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
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

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && dashboardData && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Page Views"
                value={analyticsService.formatNumber(dashboardData.traffic?.totalViews || 0)}
                icon="👁️"
                color="blue"
              />
              <MetricCard
                title="Unique Visitors"
                value={analyticsService.formatNumber(dashboardData.traffic?.uniqueVisitors || 0)}
                icon="👤"
                color="green"
              />
              <MetricCard
                title="Avg. Session Duration"
                value={`${Math.round((dashboardData.traffic?.avgSessionDuration || 0) / 60)}m`}
                icon="⏱️"
                color="purple"
              />
              <MetricCard
                title="Bounce Rate"
                value={`${((dashboardData.traffic?.bounceRate || 0) / (dashboardData.traffic?.totalViews || 1) * 100).toFixed(1)}%`}
                icon="📈"
                color="orange"
              />
            </div>

            {/* Engagement Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Article Views"
                value={analyticsService.formatNumber(dashboardData.engagement?.article_view || 0)}
                icon="📖"
                color="blue"
              />
              <MetricCard
                title="Newsletter Signups"
                value={analyticsService.formatNumber(dashboardData.engagement?.newsletter_signup || 0)}
                icon="📧"
                color="green"
              />
              <MetricCard
                title="Social Shares"
                value={analyticsService.formatNumber(dashboardData.engagement?.social_share || 0)}
                icon="🔗"
                color="purple"
              />
            </div>

            {/* Top Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Top Performing Articles
              </h3>
              <div className="space-y-3">
                {dashboardData.topArticles?.slice(0, 5).map((article, index) => (
                  <div key={article.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">
                        {index + 1}.
                      </span>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {article.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {analyticsService.formatNumber(article.recentViews || 0)} views
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {analyticsService.formatNumber(article.viewCount || 0)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">total</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Device Breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Device Breakdown
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {dashboardData.deviceBreakdown?.map((device, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {analyticsService.formatNumber(device.count)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {device.deviceType}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && <ContentPerformance />}
        {activeTab === 'users' && <UserAnalytics />}
        {activeTab === 'authors' && <AuthorPerformance />}
        {activeTab === 'realtime' && <RealtimeAnalytics />}
        {activeTab === 'seo' && <SEOAnalytics />}
        {activeTab === 'social' && <SocialAnalytics />}
        {activeTab === 'reports' && <CustomReports />}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;