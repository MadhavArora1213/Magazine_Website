import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const navLinks = [
  { to: "/admin", label: "Dashboard", icon: "dashboard" },
  { to: "/admin/category/all", label: "All Categories", icon: "list" },
  { to: "/admin/category/create", label: "Create Category", icon: "plus" },
  { to: "/admin/category/update", label: "Update Category", icon: "edit" },
  { to: "/admin/category/delete", label: "Delete Category", icon: "trash" },
];

const Sidebar = ({ open, onClose, collapsed }) => {
  const location = useLocation();
  const { theme } = useTheme();
  const [categoryOpen, setCategoryOpen] = useState(true);

  // Icon color logic for best contrast
  const getIconColor = (isActive) =>
    isActive
      ? theme === "dark"
        ? "#000"
        : "#fff"
      : theme === "dark"
        ? "#fff"
        : "#000";

  // SVG icons for each action
  const icons = {
    // Dashboard icon (home)
    dashboard: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 12L12 4l9 8" />
        <rect x="6" y="12" width="12" height="8" rx="2" />
      </svg>
    ),
    // Category main icon (tag)
    category: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="7" width="18" height="10" rx="4" />
        <circle cx="8" cy="12" r="2" />
      </svg>
    ),
    // List icon for "All Categories"
    list: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <circle cx="4" cy="6" r="1.5" />
        <circle cx="4" cy="12" r="1.5" />
        <circle cx="4" cy="18" r="1.5" />
      </svg>
    ),
    // Plus icon for "Create Category"
    plus: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" strokeLinecap="round" />
      </svg>
    ),
    // Edit icon for "Update Category"
    edit: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" />
      </svg>
    ),
    // Trash icon for "Delete Category"
    trash: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <rect x="5" y="7" width="14" height="12" rx="2" />
        <path d="M9 11v6M15 11v6" strokeLinecap="round" />
        <path d="M10 7V5a2 2 0 0 1 4 0v2" />
      </svg>
    ),
    // Chevron icons for dropdown
    chevronDown: (color) => (
      <svg width="18" height="18" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M6 9l6 6 6-6" />
      </svg>
    ),
    chevronUp: (color) => (
      <svg width="18" height="18" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    ),
  };

  // Collapsed: show only icons
  if (collapsed) {
    return (
      <aside
        className={`
          fixed z-40 top-0 left-0 h-full w-20 transition-transform duration-200
          ${theme === "dark" ? "bg-black border-r border-white/10" : "bg-white border-r border-black/10"}
          md:static md:block
        `}
        style={{ minHeight: "100vh" }}
      >
        <div className="flex flex-col items-center py-6 gap-3">
          {/* Admin Panel Title */}
          <span className="mb-6 text-xs font-extrabold tracking-widest uppercase select-none text-center">
            ADMIN<br />PANEL
          </span>
          {/* Dashboard link */}
          <Link
            to="/admin"
            onClick={onClose}
            className={`flex items-center justify-center w-10 h-10 rounded-lg mb-1 transition
              ${
                location.pathname === "/admin"
                  ? theme === "dark"
                    ? "bg-white"
                    : "bg-black"
                  : theme === "dark"
                    ? "hover:bg-white/10"
                    : "hover:bg-black/10"
              }`}
            title="Dashboard"
          >
            {icons.dashboard(getIconColor(location.pathname === "/admin"))}
          </Link>
          <button
            className="mb-2"
            onClick={() => setCategoryOpen((v) => !v)}
            title="Category"
          >
            {icons.category(getIconColor(false))}
          </button>
          {categoryOpen &&
            navLinks.slice(1).map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={`flex items-center justify-center w-10 h-10 rounded-lg mb-1 transition
                    ${
                      isActive
                        ? theme === "dark"
                          ? "bg-white"
                          : "bg-black"
                        : theme === "dark"
                          ? "hover:bg-white/10"
                          : "hover:bg-black/10"
                    }`}
                  title={link.label}
                >
                  {icons[link.icon](getIconColor(isActive))}
                </Link>
              );
            })}
        </div>
      </aside>
    );
  }

  // Expanded: show dropdown and all links
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity md:hidden ${
          open ? "block" : "hidden"
        }`}
        onClick={onClose}
      />
      <aside
        className={`
          fixed z-40 top-0 left-0 h-full w-64 transform transition-transform duration-200
          ${theme === "dark" ? "bg-black border-r border-white/10" : "bg-white border-r border-black/10"}
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:block
        `}
        style={{ minHeight: "100vh" }}
      >
        <div className="py-6 px-4 flex flex-col gap-1">
          {/* Admin Panel Title */}
          <span className="mb-6 text-2xl font-extrabold tracking-widest uppercase select-none">
            ADMIN PANEL
          </span>
          {/* Dashboard link */}
          <Link
            to="/admin"
            onClick={onClose}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition ml-0
              ${
                location.pathname === "/admin"
                  ? theme === "dark"
                    ? "bg-white text-black"
                    : "bg-black text-white"
                  : theme === "dark"
                    ? "hover:bg-white/10 text-white"
                    : "hover:bg-black/10 text-black"
              }`}
          >
            {icons.dashboard(getIconColor(location.pathname === "/admin"))}
            <span className="tracking-tight">Dashboard</span>
          </Link>
          {/* Category Dropdown */}
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition mb-1 w-full"
            onClick={() => setCategoryOpen((v) => !v)}
          >
            {icons.category(getIconColor(false))}
            <span className="tracking-tight">Category</span>
            <span className="">
              {categoryOpen
                ? icons.chevronUp(getIconColor(false))
                : icons.chevronDown(getIconColor(false))}
            </span>
          </button>
          {/* Dropdown links */}
          {categoryOpen &&
            navLinks.slice(1).map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition ml-4
                    ${
                      isActive
                        ? theme === "dark"
                          ? "bg-white text-black"
                          : "bg-black text-white"
                        : theme === "dark"
                          ? "hover:bg-white/10 text-white"
                          : "hover:bg-black/10 text-black"
                    }`}
                >
                  {icons[link.icon](getIconColor(isActive))}
                  <span className="tracking-tight">{link.label}</span>
                </Link>
              );
            })}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;