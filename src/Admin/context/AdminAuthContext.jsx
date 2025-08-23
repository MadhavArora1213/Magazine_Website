import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if admin is logged in on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/admin/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAdmin(data.admin);
      } else {
        localStorage.removeItem('adminToken');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch('http://localhost:5000/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token
      localStorage.setItem('adminToken', data.token);
      
      // Set admin data
      setAdmin(data.admin);
      
      return { success: true, admin: data.admin };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (token) {
        await fetch('http://localhost:5000/api/admin/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('adminToken');
      setAdmin(null);
      setError(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('http://localhost:5000/api/admin/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      setAdmin(prev => ({ ...prev, ...data.admin }));
      return { success: true, admin: data.admin };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('http://localhost:5000/api/admin/auth/password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password change failed');
      }

      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Permission checking based on role
  const hasPermission = (permission) => {
    if (!admin) return false;
    
    // Master Admin has all permissions
    if (admin.role === 'Master Admin') return true;
    
    // Check specific role permissions
    switch (admin.role) {
      case 'Content Admin':
        return ['article:create', 'article:read', 'article:update', 'article:delete', 'article:publish', 'article:unpublish',
                'media:create', 'media:read', 'media:update', 'media:delete',
                'category:create', 'category:read', 'category:update', 'category:delete',
                'user:read', 'analytics:read'].includes(permission);
        
      case 'Editor-in-Chief':
        return ['article:create', 'article:read', 'article:update', 'article:publish', 'article:unpublish',
                'media:create', 'media:read', 'media:update',
                'category:read', 'category:update',
                'user:read', 'analytics:read'].includes(permission);
        
      case 'Section Editors':
        return ['article:create', 'article:read', 'article:update', 'article:publish',
                'media:create', 'media:read', 'media:update',
                'category:read', 'category:update',
                'user:read', 'analytics:read'].includes(permission);
        
      case 'Senior Writers':
      case 'Staff Writers':
        return ['article:create', 'article:read', 'article:update',
                'media:create', 'media:read', 'media:update',
                'category:read', 'analytics:read'].includes(permission);
        
      case 'Contributors':
        return ['article:create', 'article:read',
                'media:create', 'media:read',
                'category:read'].includes(permission);
        
      case 'Reviewers':
        return ['article:read', 'article:update',
                'media:read',
                'category:read'].includes(permission);
        
      case 'Social Media Manager':
        return ['article:read',
                'media:read',
                'social:create', 'social:read', 'social:update', 'social:delete',
                'analytics:read'].includes(permission);
        
      case 'Webmaster':
        return ['article:read', 'article:update',
                'media:read', 'media:update',
                'category:read', 'category:update',
                'settings:read', 'settings:update',
                'user:read', 'analytics:read'].includes(permission);
        
      default:
        return false;
    }
  };

  const hasRole = (role) => {
    if (!admin) return false;
    return admin.role === role;
  };

  // Role-based access control
  const isMasterAdmin = () => hasRole('Master Admin');
  const isContentAdmin = () => ['Master Admin', 'Content Admin'].includes(admin?.role);
  const isEditorInChief = () => ['Master Admin', 'Content Admin', 'Editor-in-Chief'].includes(admin?.role);
  const isSectionEditor = () => ['Master Admin', 'Content Admin', 'Editor-in-Chief', 'Section Editors'].includes(admin?.role);
  const isWriter = () => ['Master Admin', 'Content Admin', 'Editor-in-Chief', 'Section Editors', 'Senior Writers', 'Staff Writers'].includes(admin?.role);
  const isContributor = () => ['Master Admin', 'Content Admin', 'Editor-in-Chief', 'Section Editors', 'Senior Writers', 'Staff Writers', 'Contributors'].includes(admin?.role);
  const isReviewer = () => ['Master Admin', 'Content Admin', 'Editor-in-Chief', 'Section Editors', 'Reviewers'].includes(admin?.role);
  const isSocialMediaManager = () => hasRole('Social Media Manager');
  const isWebmaster = () => hasRole('Webmaster');

  const value = {
    admin,
    loading,
    error,
    login,
    logout,
    updateProfile,
    changePassword,
    hasPermission,
    hasRole,
    isMasterAdmin,
    isContentAdmin,
    isEditorInChief,
    isSectionEditor,
    isWriter,
    isContributor,
    isReviewer,
    isSocialMediaManager,
    isWebmaster,
    checkAuthStatus
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
