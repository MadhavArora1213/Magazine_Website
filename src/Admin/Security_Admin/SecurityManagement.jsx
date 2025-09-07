import React, { useState } from 'react';
import { SecurityDashboard } from '../../Components/Security';

const SecurityManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', component: SecurityDashboard }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || SecurityDashboard;

  return (
    <div className="security-management">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Security Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Comprehensive security monitoring, threat detection, and compliance management.
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
      <div className="security-content">
        <ActiveComponent />
      </div>

      {/* Security Status Footer */}
      <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Security Status Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">🛡️</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Firewall Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">🔒</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Encryption Enabled</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">👁️</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Monitoring Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">✅</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Compliance Ready</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityManagement;