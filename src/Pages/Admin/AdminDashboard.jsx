import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminDashboard = () => {
  const { admin, logout, isLoading } = useAdminAuth();
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
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const base = import.meta?.env?.VITE_API_URL || 'http://localhost:5000';

      // Fetch dashboard analytics
      const analyticsResponse = await fetch(`${base}/api/analytics/dashboard`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!analyticsResponse.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const analyticsData = await analyticsResponse.json();

      // Fetch categories count
      const categoriesResponse = await fetch(`${base}/api/articles/categories`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      let categoriesCount = 0;
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        categoriesCount = categoriesData.data?.length || 0;
      }

      // Fetch articles count
      const articlesResponse = await fetch(`${base}/api/articles`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      let articlesCount = 0;
      if (articlesResponse.ok) {
        const articlesData = await articlesResponse.json();
        articlesCount = articlesData.data?.length || 0;
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

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h2 className="text-red-800 font-semibold mb-2">Error Loading Dashboard</h2>
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { analytics, categoriesCount, articlesCount } = dashboardData || {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {admin?.name}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {admin?.role}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Articles</dt>
                    <dd className="text-lg font-medium text-gray-900">{articlesCount}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Categories</dt>
                    <dd className="text-lg font-medium text-gray-900">{categoriesCount}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Views</dt>
                    <dd className="text-lg font-medium text-gray-900">{analytics?.traffic?.totalViews || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Unique Visitors</dt>
                    <dd className="text-lg font-medium text-gray-900">{analytics?.traffic?.uniqueVisitors || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Device Breakdown */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Device Breakdown</h3>
              <div className="space-y-3">
                {analytics?.deviceBreakdown?.map((device, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        device.deviceType === 'mobile' ? 'bg-blue-500' :
                        device.deviceType === 'desktop' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {device.deviceType}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{device.count}</span>
                  </div>
                )) || (
                  <p className="text-gray-500 text-sm">No device data available</p>
                )}
              </div>
            </div>
          </div>

          {/* Geographic Data */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Top Countries</h3>
              <div className="space-y-3">
                {analytics?.geographicData?.slice(0, 5).map((country, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-900">
                        {country.country || 'Unknown'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{country.visits}</span>
                  </div>
                )) || (
                  <p className="text-gray-500 text-sm">No geographic data available</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Engagement Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{analytics?.engagement?.article_view || 0}</div>
                <div className="text-sm text-gray-500">Article Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{analytics?.engagement?.comment_posted || 0}</div>
                <div className="text-sm text-gray-500">Comments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{analytics?.engagement?.social_share || 0}</div>
                <div className="text-sm text-gray-500">Social Shares</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Articles */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Top Performing Articles</h3>
            <div className="space-y-4">
              {analytics?.topArticles?.slice(0, 5).map((article, index) => (
                <div key={article.id || index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{article.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {article.recentViews || 0} recent views
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      #{index + 1}
                    </span>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 text-sm">No article data available</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;