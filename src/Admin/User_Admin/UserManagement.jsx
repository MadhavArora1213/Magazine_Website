import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const UserManagement = () => {
  const { theme } = useTheme();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({
    role: 'all',
    status: 'all',
    dateRange: 'all'
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'author',
    status: 'active',
    password: '',
    confirmPassword: ''
  });

  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-black' : 'bg-white';
  const textMain = isDark ? 'text-white' : 'text-black';
  const cardBg = isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-black/10';
  const inputBg = isDark ? 'bg-gray-800 border-white/20 text-white' : 'bg-white border-gray-300 text-black';
  const modalBg = isDark ? 'bg-gray-900' : 'bg-white';

  // Mock data - replace with actual API calls
  useEffect(() => {
    setUsers([
      {
        id: 1,
        firstName: 'Ahmed',
        lastName: 'Hassan',
        email: 'ahmed.hassan@echomagazine.com',
        phone: '+971 50 123 4567',
        role: 'editor',
        status: 'active',
        avatar: null,
        articles_count: 15,
        last_login: '2025-01-26T08:30:00Z',
        created_at: '2024-12-01T10:00:00Z',
        updated_at: '2025-01-25T16:45:00Z'
      },
      {
        id: 2,
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'priya.sharma@echomagazine.com',
        phone: '+91 98765 43210',
        role: 'author',
        status: 'active',
        avatar: null,
        articles_count: 8,
        last_login: '2025-01-25T14:20:00Z',
        created_at: '2024-11-15T09:30:00Z',
        updated_at: '2025-01-24T11:15:00Z'
      },
      {
        id: 3,
        firstName: 'Vikram',
        lastName: 'Patel',
        email: 'vikram.patel@echomagazine.com',
        phone: '+91 87654 32109',
        role: 'author',
        status: 'active',
        avatar: null,
        articles_count: 12,
        last_login: '2025-01-24T19:45:00Z',
        created_at: '2024-10-20T14:00:00Z',
        updated_at: '2025-01-23T09:30:00Z'
      },
      {
        id: 4,
        firstName: 'Sneha',
        lastName: 'Kapoor',
        email: 'sneha.kapoor@echomagazine.com',
        phone: '+91 76543 21098',
        role: 'contributor',
        status: 'active',
        avatar: null,
        articles_count: 5,
        last_login: '2025-01-23T12:15:00Z',
        created_at: '2024-12-10T16:20:00Z',
        updated_at: '2025-01-22T14:30:00Z'
      },
      {
        id: 5,
        firstName: 'Ravi',
        lastName: 'Kumar',
        email: 'ravi.kumar@echomagazine.com',
        phone: '+91 65432 10987',
        role: 'author',
        status: 'inactive',
        avatar: null,
        articles_count: 3,
        last_login: '2025-01-10T10:00:00Z',
        created_at: '2024-11-01T11:45:00Z',
        updated_at: '2025-01-10T10:00:00Z'
      },
      {
        id: 6,
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@echomagazine.com',
        phone: '+1 555 123 4567',
        role: 'admin',
        status: 'active',
        avatar: null,
        articles_count: 0,
        last_login: '2025-01-26T09:00:00Z',
        created_at: '2024-09-15T08:00:00Z',
        updated_at: '2025-01-26T09:00:00Z'
      }
    ]);

    setRoles([
      { id: 1, name: 'admin', display_name: 'Administrator', permissions: ['all'] },
      { id: 2, name: 'editor', display_name: 'Editor', permissions: ['publish', 'edit_all', 'manage_users'] },
      { id: 3, name: 'author', display_name: 'Author', permissions: ['write', 'edit_own'] },
      { id: 4, name: 'contributor', display_name: 'Contributor', permissions: ['write'] }
    ]);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filter.role === 'all' || user.role === filter.role;
    const matchesStatus = filter.status === 'all' || user.status === filter.status;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'editor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'author': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'contributor': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (newUser.password !== newUser.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const newId = Math.max(...users.map(u => u.id), 0) + 1;
      const user = {
        id: newId,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        status: newUser.status,
        avatar: null,
        articles_count: 0,
        last_login: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setUsers(prev => [user, ...prev]);
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'author',
        status: 'active',
        password: '',
        confirmPassword: ''
      });
      setShowCreateModal(false);
      setLoading(false);
    }, 1500);
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id 
          ? { ...editingUser, updated_at: new Date().toISOString() }
          : user
      ));
      setShowEditModal(false);
      setEditingUser(null);
      setLoading(false);
    }, 1000);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) {
      alert('Please select users first');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (action === 'activate') {
        setUsers(prev => prev.map(user => 
          selectedUsers.includes(user.id) 
            ? { ...user, status: 'active', updated_at: new Date().toISOString() }
            : user
        ));
      } else if (action === 'deactivate') {
        setUsers(prev => prev.map(user => 
          selectedUsers.includes(user.id) 
            ? { ...user, status: 'inactive', updated_at: new Date().toISOString() }
            : user
        ));
      } else if (action === 'delete') {
        setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));
      }
      setSelectedUsers([]);
      setLoading(false);
    }, 1000);
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const getUserInitials = (user) => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className={`min-h-screen ${bgMain} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold ${textMain} mb-2`}>User Management</h1>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Manage users, roles, and permissions
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Export Users
              </button>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Add New User
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-lg border ${cardBg}`}>
            <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
              Total Users
            </h3>
            <p className={`text-3xl font-bold ${textMain}`}>{users.length}</p>
          </div>
          <div className={`p-6 rounded-lg border ${cardBg}`}>
            <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
              Active Users
            </h3>
            <p className={`text-3xl font-bold text-green-600`}>
              {users.filter(u => u.status === 'active').length}
            </p>
          </div>
          <div className={`p-6 rounded-lg border ${cardBg}`}>
            <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
              Authors
            </h3>
            <p className={`text-3xl font-bold text-blue-600`}>
              {users.filter(u => u.role === 'author').length}
            </p>
          </div>
          <div className={`p-6 rounded-lg border ${cardBg}`}>
            <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
              Total Articles
            </h3>
            <p className={`text-3xl font-bold ${textMain}`}>
              {users.reduce((sum, user) => sum + user.articles_count, 0)}
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className={`rounded-lg border ${cardBg} p-6 mb-8`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <select
                value={filter.role}
                onChange={(e) => setFilter(prev => ({ ...prev, role: e.target.value }))}
                className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role.name} value={role.name}>{role.display_name}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={filter.status}
                onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div>
              <select
                value={filter.dateRange}
                onChange={(e) => setFilter(prev => ({ ...prev, dateRange: e.target.value }))}
                className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All Time</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className={`text-sm ${textMain}`}>
                {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleBulkAction('activate')}
                  disabled={loading}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                >
                  Activate
                </button>
                <button 
                  onClick={() => handleBulkAction('deactivate')}
                  disabled={loading}
                  className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 disabled:opacity-50"
                >
                  Deactivate
                </button>
                <button 
                  onClick={() => handleBulkAction('delete')}
                  disabled={loading}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className={`rounded-lg border ${cardBg} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={selectAllUsers}
                      className="rounded"
                    />
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    User
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Role
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Status
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Articles
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Last Login
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`${isDark ? 'bg-gray-900' : 'bg-white'} divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className={selectedUsers.includes(user.id) ? (isDark ? 'bg-gray-800' : 'bg-blue-50') : ''}>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`h-10 w-10 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center text-sm font-medium ${textMain} mr-4`}>
                          {getUserInitials(user)}
                        </div>
                        <div>
                          <div className={`text-sm font-medium ${textMain}`}>
                            {user.firstName} {user.lastName}
                          </div>
                          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {user.email}
                          </div>
                          <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {user.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {roles.find(r => r.name === user.role)?.display_name || user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${textMain}`}>
                      {user.articles_count}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                      {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button className="text-green-600 hover:text-green-900">View</button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
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

        {/* Create User Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${modalBg} p-6 rounded-lg w-full max-w-lg mx-4 max-h-screen overflow-y-auto`}>
              <h2 className={`text-xl font-bold ${textMain} mb-4`}>Create New User</h2>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>First Name</label>
                    <input
                      type="text"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser(prev => ({ ...prev, firstName: e.target.value }))}
                      className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>Last Name</label>
                    <input
                      type="text"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser(prev => ({ ...prev, lastName: e.target.value }))}
                      className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>Phone</label>
                  <input
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                    className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                      className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      {roles.filter(r => r.name !== 'admin').map(role => (
                        <option key={role.name} value={role.name}>{role.display_name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>Status</label>
                    <select
                      value={newUser.status}
                      onChange={(e) => setNewUser(prev => ({ ...prev, status: e.target.value }))}
                      className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>Password</label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                      className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>Confirm Password</label>
                    <input
                      type="password"
                      value={newUser.confirmPassword}
                      onChange={(e) => setNewUser(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                  </div>
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
                    {loading ? 'Creating...' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${modalBg} p-6 rounded-lg w-full max-w-lg mx-4 max-h-screen overflow-y-auto`}>
              <h2 className={`text-xl font-bold ${textMain} mb-4`}>Edit User</h2>
              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>First Name</label>
                    <input
                      type="text"
                      value={editingUser.firstName}
                      onChange={(e) => setEditingUser(prev => ({ ...prev, firstName: e.target.value }))}
                      className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>Last Name</label>
                    <input
                      type="text"
                      value={editingUser.lastName}
                      onChange={(e) => setEditingUser(prev => ({ ...prev, lastName: e.target.value }))}
                      className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser(prev => ({ ...prev, email: e.target.value }))}
                    className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textMain} mb-2`}>Phone</label>
                  <input
                    type="tel"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser(prev => ({ ...prev, phone: e.target.value }))}
                    className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>Role</label>
                    <select
                      value={editingUser.role}
                      onChange={(e) => setEditingUser(prev => ({ ...prev, role: e.target.value }))}
                      className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      {roles.map(role => (
                        <option key={role.name} value={role.name}>{role.display_name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${textMain} mb-2`}>Status</label>
                    <select
                      value={editingUser.status}
                      onChange={(e) => setEditingUser(prev => ({ ...prev, status: e.target.value }))}
                      className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingUser(null);
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
                    {loading ? 'Updating...' : 'Update User'}
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

export default UserManagement;