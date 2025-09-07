import React, { useState, useEffect } from 'react';
import { useAdminAuth } from './context/AdminAuthContext';

const Dashboard = () => {
  const { admin, logout, isLoading: authLoading, checkAuthStatus } = useAdminAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    // Wait for authentication to be ready before fetching data
    if (!authLoading && admin) {
      fetchDashboardData();
    } else if (!authLoading && !admin) {
      setError('Please log in to access the dashboard');
      setLoading(false);
    }
  }, [authLoading, admin]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const base = import.meta?.env?.VITE_API_URL || 'http://localhost:5000';

      // Fetch dashboard analytics using cookies (same as AdminAuthContext)
      const analyticsResponse = await fetch(`${base}/api/analytics/dashboard`, {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!analyticsResponse.ok) {
        if (analyticsResponse.status === 401) {
          // Try to refresh authentication status
          await checkAuthStatus();
          throw new Error('Session expired. Please refresh the page or log in again.');
        }
        throw new Error('Failed to fetch analytics data');
      }

      const analyticsData = await analyticsResponse.json();

      // Fetch categories count
      const categoriesResponse = await fetch(`${base}/api/articles/categories`, {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json'
        }
      });

      let categoriesCount = 0;
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        categoriesCount = categoriesData.data?.length || 0;
      } else if (categoriesResponse.status === 401) {
        await checkAuthStatus();
        throw new Error('Session expired. Please refresh the page or log in again.');
      }

      // Fetch articles count
      const articlesResponse = await fetch(`${base}/api/articles`, {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json'
        }
      });

      let articlesCount = 0;
      if (articlesResponse.ok) {
        const articlesData = await articlesResponse.json();
        articlesCount = articlesData.data?.length || 0;
      } else if (articlesResponse.status === 401) {
        await checkAuthStatus();
        throw new Error('Session expired. Please refresh the page or log in again.');
      }

      setDashboardData({
        analytics: analyticsData.data,
        categoriesCount,
        articlesCount
      });

    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-md">
            <h2 className="text-red-400 font-semibold mb-2">Error Loading Dashboard</h2>
            <p className="text-red-300 text-sm mb-4">{error}</p>
            <div className="space-x-3">
              <button
                onClick={() => window.location.href = '/admin/login'}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Go to Login
              </button>
              <button
                onClick={fetchDashboardData}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, show login prompt
  if (!admin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-6 max-w-md">
            <h2 className="text-yellow-400 font-semibold mb-2">Authentication Required</h2>
            <p className="text-yellow-300 text-sm mb-4">Please log in to access the admin dashboard.</p>
            <button
              onClick={() => window.location.href = '/admin/login'}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { analytics, categoriesCount, articlesCount } = dashboardData || {};

  return (
    <div className="min-h-screen bg-black py-2 px-1 md:px-2 transition-colors duration-300">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-black mb-1 tracking-tight flex items-center gap-2 text-white">
              <svg width="36" height="36" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
                <rect x="3" y="7" width="18" height="10" rx="4" />
                <circle cx="8" cy="12" r="2" />
              </svg>
              Magazine Admin Dashboard
            </h1>
            <p className="text-base md:text-lg text-gray-300">
              Real-time analytics and content management overview.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="px-4 py-2 rounded-lg font-semibold bg-gray-800 text-white">
              Role: <span className="font-bold">{admin?.role || 'Administrator'}</span>
            </span>
            <span className="text-gray-400 text-xs">
              Last login: {new Date().toLocaleString()}
            </span>
            <button
              onClick={handleLogout}
              className="mt-2 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-white/10 rounded-xl p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-300 truncate">Total Articles</dt>
                  <dd className="text-2xl font-bold text-white">{articlesCount}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-white/10 rounded-xl p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-500 rounded-md flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-300 truncate">Categories</dt>
                  <dd className="text-2xl font-bold text-white">{categoriesCount}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-white/10 rounded-xl p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-500 rounded-md flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-300 truncate">Total Views</dt>
                  <dd className="text-2xl font-bold text-white">{analytics?.traffic?.totalViews || 0}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-white/10 rounded-xl p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-yellow-500 rounded-md flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-300 truncate">Unique Visitors</dt>
                  <dd className="text-2xl font-bold text-white">{analytics?.traffic?.uniqueVisitors || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Device Breakdown */}
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg leading-6 font-medium text-white mb-4">Device Breakdown</h3>
            <div className="space-y-4">
              {analytics?.deviceBreakdown?.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      device.deviceType === 'mobile' ? 'bg-blue-500' :
                      device.deviceType === 'desktop' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-sm font-medium text-white capitalize">
                      {device.deviceType}
                    </span>
                  </div>
                  <span className="text-sm text-gray-300">{device.count}</span>
                </div>
              )) || (
                <p className="text-gray-400 text-sm">No device data available</p>
              )}
            </div>
          </div>

          {/* Geographic Data */}
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg leading-6 font-medium text-white mb-4">Top Countries</h3>
            <div className="space-y-4">
              {analytics?.geographicData?.slice(0, 5).map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-white">
                      {country.country || 'Unknown'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-300">{country.visits}</span>
                </div>
              )) || (
                <p className="text-gray-400 text-sm">No geographic data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-white/10 rounded-xl p-6 mb-8">
          <h3 className="text-lg leading-6 font-medium text-white mb-6">Engagement Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{analytics?.engagement?.article_view || 0}</div>
              <div className="text-sm text-gray-300 mt-2">Article Views</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{analytics?.engagement?.comment_posted || 0}</div>
              <div className="text-sm text-gray-300 mt-2">Comments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{analytics?.engagement?.social_share || 0}</div>
              <div className="text-sm text-gray-300 mt-2">Social Shares</div>
            </div>
          </div>
        </div>

        {/* Top Articles */}
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg leading-6 font-medium text-white mb-4">Top Performing Articles</h3>
          <div className="space-y-4">
            {analytics?.topArticles?.slice(0, 5).map((article, index) => (
              <div key={article.id || index} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white truncate">{article.title}</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    {article.recentViews || 0} recent views
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white">
                    #{index + 1}
                  </span>
                </div>
              </div>
            )) || (
              <p className="text-gray-400 text-sm">No article data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;