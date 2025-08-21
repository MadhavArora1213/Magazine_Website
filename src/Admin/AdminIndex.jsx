import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import Dashboard from "./Dashboard";
import AllCategory from "./Category_Admin/AllCategory";
import CreateCategory from "./Category_Admin/CreateCategory";
import UpdateCategory from "./Category_Admin/UpdateCategory";
import DeleteCategory from "./Category_Admin/DeleteCategory";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { themeStyles } = useTheme();

  const handleMenuClick = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  return (
    <div className={`flex ${themeStyles.body} min-h-screen transition-colors duration-300`}>
      <Sidebar
        open={sidebarOpen || !sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed && window.innerWidth >= 768}
      />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header onMenuClick={handleMenuClick} />
        <main className={`flex-1 ${themeStyles.main} p-4 md:p-8 transition-colors duration-300`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="category/all" element={<AllCategory />} />
            <Route path="category/create" element={<CreateCategory />} />
            <Route path="category/update" element={<UpdateCategory />} />
            <Route path="category/delete" element={<DeleteCategory />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function AdminIndex() {
  return (
    <ThemeProvider>
      <MainLayout />
    </ThemeProvider>
  );
}

export default AdminIndex;