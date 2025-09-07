import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { adminAuthService } from '../services/adminAuthService';
import toast from 'react-hot-toast';

// Initial state
const initialState = {
  admin: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
const ADMIN_AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_ADMIN: 'UPDATE_ADMIN',
  SET_ADMIN: 'SET_ADMIN',
};

// Reducer function
const adminAuthReducer = (state, action) => {
  switch (action.type) {
    case ADMIN_AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case ADMIN_AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        admin: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case ADMIN_AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
      };

    case ADMIN_AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case ADMIN_AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case ADMIN_AUTH_ACTIONS.UPDATE_ADMIN:
      return {
        ...state,
        admin: { ...state.admin, ...action.payload },
      };

    case ADMIN_AUTH_ACTIONS.SET_ADMIN:
      return {
        ...state,
        admin: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const AdminAuthContext = createContext();

// Custom hook to use admin auth context
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

// AdminAuthProvider component
export const AdminAuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminAuthReducer, initialState);

  // Load admin on app start - check authentication status
  useEffect(() => {
    const loadAdmin = async () => {
      try {
        dispatch({ type: ADMIN_AUTH_ACTIONS.SET_LOADING, payload: true });

        // First check if we have stored admin info
        const storedAdminInfo = adminAuthService.getStoredAdminInfo();

        if (storedAdminInfo) {
          // Verify with server that the stored info is still valid
          const response = await adminAuthService.checkAuthStatus();

          if (response.authenticated) {
            dispatch({ type: ADMIN_AUTH_ACTIONS.SET_ADMIN, payload: response.admin });
          } else {
            // Stored info is invalid, clear it
            adminAuthService.clearStoredAdminInfo();
            dispatch({ type: ADMIN_AUTH_ACTIONS.SET_LOADING, payload: false });
          }
        } else {
          // No stored info, user is not authenticated
          dispatch({ type: ADMIN_AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        // If status check fails, clear stored data and set as not authenticated
        adminAuthService.clearStoredAdminInfo();
        dispatch({ type: ADMIN_AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    loadAdmin();
  }, []);

  // Admin login function
  const login = async (credentials) => {
    try {
      dispatch({ type: ADMIN_AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: ADMIN_AUTH_ACTIONS.CLEAR_ERROR });

      const response = await adminAuthService.login(credentials);
      dispatch({ type: ADMIN_AUTH_ACTIONS.LOGIN_SUCCESS, payload: response.admin });

      return response;
    } catch (error) {
      dispatch({ type: ADMIN_AUTH_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Admin logout function
  const logout = async () => {
    try {
      await adminAuthService.logout();
      dispatch({ type: ADMIN_AUTH_ACTIONS.LOGOUT });
    } catch (error) {
      // Even if logout fails on server, clear local state
      adminAuthService.clearStoredAdminInfo();
      dispatch({ type: ADMIN_AUTH_ACTIONS.LOGOUT });
      throw error;
    }
  };

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      const response = await adminAuthService.checkAuthStatus();

      if (response.authenticated) {
        dispatch({ type: ADMIN_AUTH_ACTIONS.SET_ADMIN, payload: response.admin });
      } else {
        adminAuthService.clearStoredAdminInfo();
        dispatch({ type: ADMIN_AUTH_ACTIONS.SET_ADMIN, payload: null });
      }

      return response;
    } catch (error) {
      adminAuthService.clearStoredAdminInfo();
      dispatch({ type: ADMIN_AUTH_ACTIONS.SET_ADMIN, payload: null });
      throw error;
    }
  };

  // Get admin role
  const getAdminRole = () => {
    return state.admin?.role || null;
  };

  // Check if admin has specific permission
  const hasPermission = (permission) => {
    if (!state.admin?.permissions) return false;

    const permissions = state.admin.permissions;

    // Check direct permission
    if (permissions[permission]) {
      return true;
    }

    // Check wildcard permissions (e.g., 'content.*' covers 'content.create', 'content.edit', etc.)
    const permissionParts = permission.split('.');
    for (let i = permissionParts.length - 1; i > 0; i--) {
      const wildcardPermission = permissionParts.slice(0, i).join('.') + '.*';
      if (permissions[wildcardPermission]) {
        return true;
      }
    }

    return false;
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: ADMIN_AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Context value
  const value = {
    ...state,
    login,
    logout,
    checkAuthStatus,
    getAdminRole,
    hasPermission,
    clearError,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthContext;