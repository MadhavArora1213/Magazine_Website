import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";

// Mock data
const stats = [
  { label: "Total Categories", value: 12 },
  { label: "Active Categories", value: 9 },
  { label: "Inactive Categories", value: 3 },
  { label: "Total Articles", value: 120 },
];

const recentCategories = [
  { name: "Bollywood", status: "Active", created: "2025-08-20" },
  { name: "Technology", status: "Inactive", created: "2025-08-18" },
  { name: "Fashion", status: "Active", created: "2025-08-15" },
];

const recentActivity = [
  { action: "Created", target: "Category: Sports", date: "2025-08-21" },
  { action: "Updated", target: "Category: Bollywood", date: "2025-08-20" },
  { action: "Deleted", target: "Category: Health", date: "2025-08-19" },
];

const Dashboard = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const bgMain = isDark ? "bg-black" : "bg-white";
  const textMain = isDark ? "text-white" : "text-black";
  const cardBg = isDark
    ? "bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-white/10"
    : "bg-gradient-to-br from-white via-gray-50 to-gray-200 border border-black/10";
  // Removed shadow from cards
  const cardShadow = ""; // <-- No shadow
  const tableHead = isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-black";
  const tableRowEven = isDark ? "bg-black" : "bg-white";
  const tableRowOdd = isDark ? "bg-gray-800" : "bg-gray-50";
  const iconStroke = isDark ? "#fff" : "#000";
  const btnTheme =
    "rounded-lg px-4 py-2 font-semibold transition border focus:outline-none";
  const btnThemeActive = isDark
    ? "bg-white text-black border-white hover:bg-gray-200"
    : "bg-black text-white border-black hover:bg-gray-900";

  return (
    <div className={`min-h-screen ${bgMain} py-6 px-2 md:px-6 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className={`text-2xl md:text-4xl font-black mb-1 tracking-tight flex items-center gap-2 ${textMain}`}>
              <svg width="36" height="36" fill="none" stroke={iconStroke} strokeWidth="2.5" viewBox="0 0 24 24">
                <rect x="3" y="7" width="18" height="10" rx="4" />
                <circle cx="8" cy="12" r="2" />
              </svg>
              Magazine Admin
            </h1>
            <p className={`text-base md:text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Welcome! Manage your magazine categories and settings below.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <span className={`px-4 py-2 rounded-lg font-semibold ${isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}`}>
              Role: <span className="font-bold">Administrator</span>
            </span>
            <span className="text-gray-400 text-xs">
              Last login: {new Date().toLocaleString()}
            </span>
            <button
              className={`${btnTheme} ${btnThemeActive} mt-2 flex items-center gap-2`}
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <>
                  <svg width="18" height="18" fill="none" stroke="#000" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                  <span className="hidden sm:inline">Light Mode</span>
                </>
              ) : (
                <>
                  <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                  <span className="hidden sm:inline">Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-xl p-6 flex flex-col items-center justify-center ${cardBg} ${cardShadow} w-full`}
            >
              <span className={`text-3xl font-extrabold ${textMain}`}>{stat.value}</span>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-300 mt-2 text-center">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Graph & Table & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Graph Placeholder */}
          <div className={`rounded-2xl p-6 ${cardBg} ${cardShadow} flex flex-col items-center justify-center min-h-[260px] col-span-1`}>
            <span className={`font-bold mb-2 ${textMain}`}>Category Growth (Mock)</span>
            {/* Simple SVG Bar Chart as placeholder */}
            <svg width="100%" height="120" viewBox="0 0 220 120" className="w-full max-w-xs">
              <rect x="20" y="60" width="30" height="40" fill={isDark ? "#fff" : "#000"} opacity="0.7" />
              <rect x="70" y="40" width="30" height="60" fill={isDark ? "#fff" : "#000"} opacity="0.7" />
              <rect x="120" y="20" width="30" height="80" fill={isDark ? "#fff" : "#000"} opacity="0.7" />
              <rect x="170" y="50" width="30" height="50" fill={isDark ? "#fff" : "#000"} opacity="0.7" />
            </svg>
            <span className="text-xs text-gray-400 mt-2">Bar chart placeholder</span>
          </div>
          {/* Recent Categories Table */}
          <div className={`rounded-2xl p-0 overflow-hidden ${cardBg} ${cardShadow} col-span-1`}>
            <div className="p-6 pb-2">
              <span className={`font-bold ${textMain}`}>Recent Categories</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className={tableHead}>
                    <th className="py-3 px-4 text-left font-semibold">Name</th>
                    <th className="py-3 px-4 text-left font-semibold">Status</th>
                    <th className="py-3 px-4 text-left font-semibold">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCategories.map((cat, idx) => (
                    <tr
                      key={cat.name}
                      className={idx % 2 === 0 ? tableRowEven : tableRowOdd}
                    >
                      <td className={`py-2 px-4 font-medium ${textMain}`}>{cat.name}</td>
                      <td className="py-2 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          cat.status === "Active"
                            ? "bg-black text-white"
                            : "bg-white text-black border border-black"
                        }`}>
                          {cat.status}
                        </span>
                      </td>
                      <td className={`py-2 px-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>{cat.created}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Recent Activity */}
          <div className={`rounded-2xl p-0 overflow-hidden ${cardBg} ${cardShadow} col-span-1`}>
            <div className="p-6 pb-2">
              <span className={`font-bold ${textMain}`}>Recent Activity</span>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
              {recentActivity.map((item, idx) => (
                <li key={idx} className="px-6 py-3 flex items-center gap-3">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                    item.action === "Created"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                      : item.action === "Updated"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                  }`}>
                    {item.action}
                  </span>
                  <span className={`flex-1 truncate ${textMain}`}>{item.target}</span>
                  <span className="text-xs text-gray-400">{item.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            to="/admin/category/all"
            className={`group transition rounded-xl p-6 flex flex-col items-center border ${isDark
              ? "bg-black border-white/10 hover:bg-gray-800"
              : "bg-white border-black/10 hover:bg-gray-100"}`}
          >
            <span className="mb-2">
              <svg width="36" height="36" fill="none" stroke={iconStroke} strokeWidth="2.5" viewBox="0 0 24 24">
                <rect x="4" y="7" width="16" height="2" rx="1" />
                <rect x="4" y="15" width="16" height="2" rx="1" />
              </svg>
            </span>
            <span className={`font-semibold text-base ${textMain}`}>All Categories</span>
            <span className="text-xs mt-1 text-center opacity-70">View and manage all categories</span>
          </Link>
          <Link
            to="/admin/category/create"
            className={`group transition rounded-xl p-6 flex flex-col items-center border ${isDark
              ? "bg-black border-white/10 hover:bg-gray-800"
              : "bg-white border-black/10 hover:bg-gray-100"}`}
          >
            <span className="mb-2">
              <svg width="36" height="36" fill="none" stroke={iconStroke} strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v8M8 12h8" strokeLinecap="round" />
              </svg>
            </span>
            <span className={`font-semibold text-base ${textMain}`}>Create Category</span>
            <span className="text-xs mt-1 text-center opacity-70">Add a new category</span>
          </Link>
          <Link
            to="/admin/category/update"
            className={`group transition rounded-xl p-6 flex flex-col items-center border ${isDark
              ? "bg-black border-white/10 hover:bg-gray-800"
              : "bg-white border-black/10 hover:bg-gray-100"}`}
          >
            <span className="mb-2">
              <svg width="36" height="36" fill="none" stroke={iconStroke} strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" />
              </svg>
            </span>
            <span className={`font-semibold text-base ${textMain}`}>Update Category</span>
            <span className="text-xs mt-1 text-center opacity-70">Edit category details</span>
          </Link>
          <Link
            to="/admin/category/delete"
            className={`group transition rounded-xl p-6 flex flex-col items-center border ${isDark
              ? "bg-black border-white/10 hover:bg-gray-800"
              : "bg-white border-black/10 hover:bg-gray-100"}`}
          >
            <span className="mb-2">
              <svg width="36" height="36" fill="none" stroke={iconStroke} strokeWidth="2.5" viewBox="0 0 24 24">
                <rect x="5" y="7" width="14" height="12" rx="2" />
                <path d="M9 11v6M15 11v6" strokeLinecap="round" />
                <path d="M10 7V5a2 2 0 0 1 4 0v2" />
              </svg>
            </span>
            <span className={`font-semibold text-base ${textMain}`}>Delete Category</span>
            <span className="text-xs mt-1 text-center opacity-70">Remove categories</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;