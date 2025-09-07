import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const RoleManagement = () => {
  const { theme } = useTheme();
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    accessLevel: 1,
    isAdmin: false,
    canManageUsers: false,
    canManageRoles: false,
    rolePermissions: {}
  });

  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-black' : 'bg-white';
  const textMain = isDark ? 'text-white' : 'text-black';
  const cardBg = isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-black/10';
  const inputBg = isDark ? 'bg-gray-800 border-white/20 text-white' : 'bg-white border-gray-300 text-black';
  const modalBg = isDark ? 'bg-gray-900' : 'bg-white';

  // Available permissions grouped by category
  const permissionCategories = {
    system: [
      { key: 'full_access', label: 'Full System Access' },
      { key: 'user_management', label: 'User Management' },
      { key: 'role_management', label: 'Role Management' },
      { key: 'site_config', label: 'Site Configuration' }
    ],
    content: [
      { key: 'create', label: 'Create Content' },
      { key: 'edit', label: 'Edit Content' },
      { key: 'delete', label: 'Delete Content' },
      { key: 'publish', label: 'Publish Content' },
      { key: 'moderate', label: 'Moderate Content' },
      { key: 'schedule', label: 'Schedule Content' }
    ],
    analytics: [
      { key: 'view', label: 'View Analytics' },
      { key: 'export', label: 'Export Analytics' }
    ],
    security: [
      { key: 'view_logs', label: 'View Security Logs' },
      { key: 'manage_security', label: 'Manage Security Settings' }
    ],
    social: [
      { key: 'manage_platforms', label: 'Manage Social Platforms' },
      { key: 'content_promotion', label: 'Content Promotion' },
      { key: 'engagement', label: 'Engagement Management' }
    ]
  };

  // Mock data - replace with actual API calls
  useEffect(() => {
    setRoles([
      {
        id: 1,
        name: 'Master Admin',
        description: 'Full system control, user management, site configuration',
        accessLevel: 10,
        isAdmin: true,
        canManageUsers: true,
        canManageRoles: true,
        rolePermissions: {
          system: ['full_access', 'user_management', 'role_management', 'site_config'],
          content: ['create', 'edit', 'delete', 'publish', 'moderate'],
          analytics: ['view', 'export'],
          security: ['view_logs', 'manage_security']
        },
        userCount: 2,
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        name: 'Content Admin',
        description: 'Content oversight, publishing schedule, category management',
        accessLevel: 8,
        isAdmin: true,
        canManageUsers: false,
        canManageRoles: false,
        rolePermissions: {
          content: ['create', 'edit', 'delete', 'publish', 'moderate', 'schedule'],
          analytics: ['view']
        },
        userCount: 5,
        created_at: '2024-01-15T00:00:00Z'
      },
      {
        id: 3,
        name: 'Editor-in-Chief',
        description: 'Editorial decisions, content strategy, quality standards',
        accessLevel: 7,
        isAdmin: false,
        canManageUsers: false,
        canManageRoles: false,
        rolePermissions: {
          content: ['create', 'edit', 'delete', 'publish', 'approve', 'quality_control'],
          editorial: ['strategy', 'standards', 'approvals']
        },
        userCount: 3,
        created_at: '2024-02-01T00:00:00Z'
      },
      {
        id: 4,
        name: 'Senior Writers',
        description: 'Feature articles, investigative pieces, major interviews',
        accessLevel: 5,
        isAdmin: false,
        canManageUsers: false,
        canManageRoles: false,
        rolePermissions: {
          content: ['create', 'edit', 'publish', 'feature_articles', 'investigative']
        },
        userCount: 8,
        created_at: '2024-02-15T00:00:00Z'
      },
      {
        id: 5,
        name: 'Social Media Manager',
        description: 'Digital presence, social engagement, content promotion',
        accessLevel: 1,
        isAdmin: false,
        canManageUsers: false,
        canManageRoles: false,
        rolePermissions: {
          social: ['manage_platforms', 'content_promotion', 'engagement', 'analytics']
        },
        userCount: 2,
        created_at: '2024-03-01T00:00:00Z'
      }
    ]);
  }, []);

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAccessLevelColor = (level) => {
    if (level >= 8) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    if (level >= 6) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    if (level >= 4) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  };

  const handleCreateRole = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const newId = Math.max(...roles.map(r => r.id), 0) + 1;
      const role = {
        id: newId,
        ...newRole,
        userCount: 0,
        created_at: new Date().toISOString()
      };

      setRoles(prev => [role, ...prev]);
      setNewRole({
        name: '',
        description: '',
        accessLevel: 1,
        isAdmin: false,
        canManageUsers: false,
        canManageRoles: false,
        rolePermissions: {}
      });
      setShowCreateModal(false);
      setLoading(false);
    }, 1500);
  };

  const handleEditRole = (role) => {
    setEditingRole({ ...role });
    setShowEditModal(true);
  };

  const handleUpdateRole = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setRoles(prev => prev.map(role =>
        role.id === editingRole.id
          ? { ...editingRole, updated_at: new Date().toISOString() }
          : role
      ));
      setShowEditModal(false);
      setEditingRole(null);
      setLoading(false);
    }, 1000);
  };

  const handleDeleteRole = (roleId) => {
    if (window.confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
      setRoles(prev => prev.filter(role => role.id !== roleId));
    }
  };

  const togglePermission = (role, category, permission) => {
    const updatedPermissions = { ...role.rolePermissions };

    if (!updatedPermissions[category]) {
      updatedPermissions[category] = [];
    }

    if (updatedPermissions[category].includes(permission)) {
      updatedPermissions[category] = updatedPermissions[category].filter(p => p !== permission);
    } else {
      updatedPermissions[category].push(permission);
    }

    if (role === editingRole) {
      setEditingRole(prev => ({ ...prev, rolePermissions: updatedPermissions }));
    } else {
      setNewRole(prev => ({ ...prev, rolePermissions: updatedPermissions }));
    }
  };

  const PermissionSelector = ({ role, isEditing }) => (
    <div className="space-y-4">
      {Object.entries(permissionCategories).map(([category, perms]) => (
        <div key={category} className={`p-4 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
          <h4 className={`font-medium mb-3 capitalize ${textMain}`}>{category.replace('_', ' ')}</h4>
          <div className="grid grid-cols-2 gap-2">
            {perms.map(perm => (
              <label key={perm.key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={role.rolePermissions[category]?.includes(perm.key) || false}
                  onChange={() => togglePermission(role, category, perm.key)}
                  className="rounded"
                />
                <span className={`text-sm ${textMain}`}>{perm.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`min-h-screen ${bgMain} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold ${textMain} mb-2`}>Roles & Permissions</h1>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Manage user roles and their associated permissions
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create New Role
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-lg border ${cardBg}`}>
            <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
              Total Roles
            </h3>
            <p className={`text-3xl font-bold ${textMain}`}>{roles.length}</p>
          </div>
          <div className={`p-6 rounded-lg border ${cardBg}`}>
            <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
              Admin Roles
            </h3>
            <p className={`text-3xl font-bold text-blue-600`}>
              {roles.filter(r => r.isAdmin).length}
            </p>
          </div>
          <div className={`p-6 rounded-lg border ${cardBg}`}>
            <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
              Total Users
            </h3>
            <p className={`text-3xl font-bold ${textMain}`}>
              {roles.reduce((sum, role) => sum + role.userCount, 0)}
            </p>
          </div>
          <div className={`p-6 rounded-lg border ${cardBg}`}>
            <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
              System Roles
            </h3>
            <p className={`text-3xl font-bold text-green-600`}>
              {roles.filter(r => r.accessLevel >= 8).length}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className={`rounded-lg border ${cardBg} p-6 mb-8`}>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>
        </div>

        {/* Roles Table */}
        <div className={`rounded-lg border ${cardBg} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Role Name
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Access Level
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Admin
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Users
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Permissions
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`${isDark ? 'bg-gray-900' : 'bg-white'} divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredRoles.map((role) => (
                  <tr key={role.id}>
                    <td className="px-6 py-4">
                      <div>
                        <div className={`text-sm font-medium ${textMain}`}>
                          {role.name}
                        </div>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {role.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAccessLevelColor(role.accessLevel)}`}>
                        Level {role.accessLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        role.isAdmin
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {role.isAdmin ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${textMain}`}>
                      {role.userCount}
                    </td>
                    <td className={`px-6 py-4 text-sm ${textMain}`}>
                      {Object.values(role.rolePermissions).flat().length} permissions
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditRole(role)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Role Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${modalBg} p-6 rounded-lg w-full max-w-4xl mx-4 max-h-screen overflow-y-auto`}>
              <h2 className={`text-xl font-bold ${textMain} mb-4`}>Create New Role</h2>
              <form onSubmit={handleCreateRole} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>Role Name</label>
                    <input
                      type="text"
                      value={newRole.name}
                      onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>Access Level</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={newRole.accessLevel}
                      onChange={(e) => setNewRole(prev => ({ ...prev, accessLevel: parseInt(e.target.value) }))}
                      className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>Description</label>
                  <textarea
                    value={newRole.description}
                    onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                    rows="3"
                    className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newRole.isAdmin}
                      onChange={(e) => setNewRole(prev => ({ ...prev, isAdmin: e.target.checked }))}
                      className="rounded"
                    />
                    <span className={`text-sm ${textMain}`}>Admin Role</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newRole.canManageUsers}
                      onChange={(e) => setNewRole(prev => ({ ...prev, canManageUsers: e.target.checked }))}
                      className="rounded"
                    />
                    <span className={`text-sm ${textMain}`}>Can Manage Users</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newRole.canManageRoles}
                      onChange={(e) => setNewRole(prev => ({ ...prev, canManageRoles: e.target.checked }))}
                      className="rounded"
                    />
                    <span className={`text-sm ${textMain}`}>Can Manage Roles</span>
                  </label>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-4`}>Permissions</label>
                  <PermissionSelector role={newRole} isEditing={false} />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className={`px-4 py-2 rounded-lg border ${isDark ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'} hover:bg-gray-100 dark:hover:bg-gray-800`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg font-semibold ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                  >
                    {loading ? 'Creating...' : 'Create Role'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Role Modal */}
        {showEditModal && editingRole && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${modalBg} p-6 rounded-lg w-full max-w-4xl mx-4 max-h-screen overflow-y-auto`}>
              <h2 className={`text-xl font-bold ${textMain} mb-4`}>Edit Role</h2>
              <form onSubmit={handleUpdateRole} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>Role Name</label>
                    <input
                      type="text"
                      value={editingRole.name}
                      onChange={(e) => setEditingRole(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>Access Level</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={editingRole.accessLevel}
                      onChange={(e) => setEditingRole(prev => ({ ...prev, accessLevel: parseInt(e.target.value) }))}
                      className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>Description</label>
                  <textarea
                    value={editingRole.description}
                    onChange={(e) => setEditingRole(prev => ({ ...prev, description: e.target.value }))}
                    rows="3"
                    className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingRole.isAdmin}
                      onChange={(e) => setEditingRole(prev => ({ ...prev, isAdmin: e.target.checked }))}
                      className="rounded"
                    />
                    <span className={`text-sm ${textMain}`}>Admin Role</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingRole.canManageUsers}
                      onChange={(e) => setEditingRole(prev => ({ ...prev, canManageUsers: e.target.checked }))}
                      className="rounded"
                    />
                    <span className={`text-sm ${textMain}`}>Can Manage Users</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingRole.canManageRoles}
                      onChange={(e) => setEditingRole(prev => ({ ...prev, canManageRoles: e.target.checked }))}
                      className="rounded"
                    />
                    <span className={`text-sm ${textMain}`}>Can Manage Roles</span>
                  </label>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-4`}>Permissions</label>
                  <PermissionSelector role={editingRole} isEditing={true} />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingRole(null);
                    }}
                    className={`px-4 py-2 rounded-lg border ${isDark ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'} hover:bg-gray-100 dark:hover:bg-gray-800`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg font-semibold ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                  >
                    {loading ? 'Updating...' : 'Update Role'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleManagement;