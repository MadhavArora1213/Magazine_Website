import React, { useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useTheme } from "../context/ThemeContext";

const Header = ({ onMenuClick }) => {
  const { admin, logout } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const isDark = theme === "dark";
  const bgMain = isDark ? "bg-black" : "bg-white";
  const textMain = isDark ? "text-white" : "text-black";
  const borderColor = isDark ? "border-white/10" : "border-black/10";
  const menuBg = isDark ? "bg-gray-900 border-white/10" : "bg-white border-black/10";

  const handleLogout = async () => {
    await logout();
    setShowProfileMenu(false);
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      master_admin: { color: "bg-red-500", text: "Master Admin" },
      content_manager: { color: "bg-blue-500", text: "Content Manager" },
      editor: { color: "bg-green-500", text: "Editor" }
    };
    
    const config = roleConfig[role] || { color: "bg-gray-500", text: "Admin" };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <header className={`${bgMain} border-b ${borderColor} px-4 py-3 flex items-center justify-between transition-colors duration-300`}>
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className={`p-2 rounded-lg ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"} transition-colors duration-200`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="hidden md:block">
          <h1 className={`text-xl font-bold ${textMain}`}>Magazine Admin</h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className={`p-2 rounded-lg ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"} transition-colors duration-200`}
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Theme Menu */}
          {showThemeMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowThemeMenu(false)}
              />
              <div className={`absolute right-0 mt-2 w-48 ${menuBg} rounded-lg shadow-lg border ${borderColor} z-20`}>
                <div className="py-1">
                  <button
                    onClick={() => {
                      toggleTheme();
                      setShowThemeMenu(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${textMain} hover:${isDark ? "bg-gray-800" : "bg-gray-100"} transition-colors duration-200`}
                  >
                    {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Admin Profile */}
        {admin && (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {admin.firstName?.charAt(0) || admin.username?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className={`text-sm font-medium ${textMain}`}>
                  {admin.firstName} {admin.lastName}
                </p>
                {getRoleBadge(admin.role)}
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Profile Menu */}
            {showProfileMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className={`absolute right-0 mt-2 w-64 ${menuBg} rounded-lg shadow-lg border ${borderColor} z-20`}>
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg font-medium">
                          {admin.firstName?.charAt(0) || admin.username?.charAt(0) || 'A'}
                        </span>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${textMain}`}>
                          {admin.firstName} {admin.lastName}
                        </p>
                        <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          {admin.email}
                        </p>
                        {getRoleBadge(admin.role)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-1">
                    <button
                      onClick={() => {
                        // TODO: Navigate to profile page
                        setShowProfileMenu(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${textMain} hover:${isDark ? "bg-gray-800" : "bg-gray-100"} transition-colors duration-200`}
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Profile Settings</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className={`block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200`}
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign Out</span>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;