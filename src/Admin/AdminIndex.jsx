import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminAuthProvider, useAdminAuth } from "./context/AdminAuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import AdminLogin from "./Components/AdminLogin";
import Dashboard from "./Dashboard";
import AllCategory from "./Category_Admin/AllCategory";
import CreateCategory from "./Category_Admin/CreateCategory";
import UpdateCategory from "./Category_Admin/UpdateCategory";
import DeleteCategory from "./Category_Admin/DeleteCategory";
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";

// Protected Route Component
const ProtectedRoute = ({ children, requiredPermission = null, requiredRole = null }) => {
  const { admin, loading, hasPermission, hasRole } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-white text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-300 mb-4">You don't have permission to access this page.</p>
          <p className="text-gray-400 text-sm">Required: {requiredPermission}</p>
        </div>
      </div>
    );
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-white text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-300 mb-4">You don't have the required role for this page.</p>
          <p className="text-gray-400 text-sm">Required: {requiredRole}</p>
        </div>
      </div>
    );
  }

  return children;
};

// Main Layout Component
const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-black">
      <Sidebar 
        open={sidebarOpen} 
        onClose={handleSidebarClose}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={handleMenuClick} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-black">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/category/all" element={<AllCategory />} />
            <Route path="/category/create" element={<CreateCategory />} />
            <Route path="/category/update/:id" element={<UpdateCategory />} />
            <Route path="/category/delete" element={<DeleteCategory />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function AdminIndex() {
  return (
    <ThemeProvider>
      <AdminAuthProvider>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </AdminAuthProvider>
    </ThemeProvider>
  );
}

export default AdminIndex;