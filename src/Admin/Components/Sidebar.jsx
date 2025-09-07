import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAdminAuth } from "../context/AdminAuthContext";

const navLinks = [
  { to: "/admin", label: "Dashboard", icon: "dashboard" },
];

const navSections = [
  {
    title: "Content Management",
    icon: "content",
    key: "content",
    requiredPermission: "content",
    links: [
      { to: "/admin/articles", label: "Articles", icon: "article", requiredPermission: "content.read" },
      { to: "/admin/articles/create", label: "Create Article", icon: "plus", requiredPermission: "content.create" },
      { to: "/admin/articles/test", label: "Article Display Test", icon: "test", requiredPermission: "content.read" },
      { to: "/admin/video-articles", label: "Video Articles", icon: "article", requiredPermission: "content.read" },
      { to: "/admin/video-articles/create", label: "Create Video Article", icon: "plus", requiredPermission: "content.create" },
      { to: "/admin/categories", label: "Categories", icon: "category", requiredPermission: "content.read" },
      { to: "/admin/categories/create", label: "Create Category", icon: "plus", requiredPermission: "content.create" },
      { to: "/admin/subcategories", label: "Sub Categories", icon: "subcategory", requiredPermission: "content.read" },
      { to: "/admin/subcategories/create", label: "Create Subcategory", icon: "plus", requiredPermission: "content.create" },
      { to: "/admin/tags", label: "Tags", icon: "tag", requiredPermission: "content.read" },
      { to: "/admin/tag/create", label: "Create Tag", icon: "plus", requiredPermission: "content.create" },
      { to: "/admin/events", label: "Events", icon: "event", requiredPermission: "content.read" },
      { to: "/admin/events/create", label: "Create Event", icon: "plus", requiredPermission: "content.create" },
      { to: "/admin/comments", label: "Comments", icon: "comments", requiredPermission: "content.moderate" },
      { to: "/admin/media", label: "Media Library", icon: "media", requiredPermission: "content.read" },
      { to: "/admin/flipbooks", label: "Flipbook Management", icon: "article", requiredPermission: "content.read" },
      { to: "/admin/search", label: "Search Management", icon: "search", requiredPermission: "content.read" },
    ]
  },
  {
    title: "User Management",
    icon: "users",
    key: "users",
    requiredPermission: "users",
    links: [
      { to: "/admin/users", label: "All Users", icon: "user", requiredPermission: "users.read" },
      { to: "/admin/users/create", label: "Create User", icon: "userplus", requiredPermission: "users.create" },
      { to: "/admin/roles", label: "Roles & Permissions", icon: "shield", requiredPermission: "users.manage_roles" },
    ]
  },
  {
    title: "Communication",
    icon: "communication",
    key: "communication",
    requiredPermission: "communication",
    links: [
      { to: "/admin/newsletter", label: "Newsletter", icon: "mail", requiredPermission: "communication.manage" },
      { to: "/admin/sms", label: "SMS Management", icon: "sms", requiredPermission: "communication.manage" },
      { to: "/admin/notifications", label: "Notifications", icon: "bell", requiredPermission: "communication.manage" },
    ]
  },
  {
    title: "Analytics & Performance",
    icon: "analytics",
    key: "analytics",
    requiredPermission: "analytics",
    links: [
      { to: "/admin/analytics", label: "Analytics Dashboard", icon: "chart", requiredPermission: "analytics.read" },
      { to: "/admin/analytics/content", label: "Content Performance", icon: "article", requiredPermission: "analytics.read" },
      { to: "/admin/analytics/users", label: "User Analytics", icon: "user", requiredPermission: "analytics.read" },
      { to: "/admin/analytics/authors", label: "Author Performance", icon: "user", requiredPermission: "analytics.read" },
      { to: "/admin/analytics/realtime", label: "Real-time", icon: "speed", requiredPermission: "analytics.read" },
      { to: "/admin/analytics/seo", label: "SEO Analytics", icon: "search", requiredPermission: "analytics.read" },
      { to: "/admin/analytics/social", label: "Social Media", icon: "communication", requiredPermission: "analytics.read" },
      { to: "/admin/analytics/reports", label: "Custom Reports", icon: "report", requiredPermission: "analytics.read" },
    ]
  },
  {
    title: "Security",
    icon: "security",
    key: "security",
    requiredPermission: "security",
    links: [
      { to: "/admin/security", label: "Security Dashboard", icon: "shield", requiredPermission: "security.read" },
      { to: "/admin/security/logs", label: "Security Logs", icon: "logs", requiredPermission: "security.view_logs" },
      { to: "/admin/security/incidents", label: "Incidents", icon: "alert", requiredPermission: "security.read" },
      { to: "/admin/security/threats", label: "Threat Intelligence", icon: "security", requiredPermission: "security.read" },
      { to: "/admin/security/settings", label: "Security Settings", icon: "settings", requiredPermission: "security.manage" },
      { to: "/admin/security/backup", label: "Backup & Recovery", icon: "backup", requiredPermission: "security.manage" },
    ]
  },
  {
    title: "System",
    icon: "system",
    key: "system",
    requiredPermission: "system",
    links: [
      { to: "/admin/settings", label: "Settings", icon: "settings", requiredPermission: "system.settings" },
      { to: "/admin/logs", label: "System Logs", icon: "logs", requiredPermission: "system.logs" },
    ]
  }
];

const Sidebar = ({ open, onClose, collapsed }) => {
  const location = useLocation();
  const { theme } = useTheme();
  const { hasPermission, admin } = useAdminAuth();
  const [openSections, setOpenSections] = useState({
    content: true,
    users: false,
    communication: false,
    analytics: false,
    security: false,
    system: false
  });

  // Filter navigation sections and links based on permissions
  const filteredNavSections = navSections
    .filter(section => {
      // Master Admin can see all sections
      if (admin?.role === 'Master Admin') return true;
      // Check if user has permission for this section
      return hasPermission(section.requiredPermission);
    })
    .map(section => ({
      ...section,
      links: section.links.filter(link => {
        // Master Admin can see all links
        if (admin?.role === 'Master Admin') return true;
        // Check if user has permission for this link
        return hasPermission(link.requiredPermission);
      })
    }))
    .filter(section => section.links.length > 0); // Only show sections with accessible links

  const toggleSection = (sectionKey) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  // Icon color logic for best contrast
  const getIconColor = (isActive) =>
    isActive
      ? theme === "dark"
        ? "#000"
        : "#fff"
      : theme === "dark"
        ? "#fff"
        : "#000";

  // SVG icons for all admin sections
  const icons = {
    // Dashboard
    dashboard: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 12L12 4l9 8" />
        <rect x="6" y="12" width="12" height="8" rx="2" />
      </svg>
    ),
    // Content Management
    content: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    article: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    category: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="7" width="18" height="10" rx="4" />
        <circle cx="8" cy="12" r="2" />
      </svg>
    ),
    subcategory: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="7" width="18" height="10" rx="4" />
        <circle cx="8" cy="12" r="2" />
        <circle cx="16" cy="12" r="2" />
      </svg>
    ),
    tag: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
    media: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21,15 16,10 5,21" />
      </svg>
    ),
    comments: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M9 10h.01" />
        <path d="M15 10h.01" />
        <path d="M12.5 7.5s.5 2 2 2c1.5 0 2-2 2-2" />
      </svg>
    ),
    // User Management
    users: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    user: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    userplus: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
      </svg>
    ),
    shield: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    // Communication
    communication: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    mail: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    sms: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
    bell: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    // Analytics
    analytics: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
      </svg>
    ),
    chart: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    speed: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <path d="M9 9h.01" />
        <path d="M15 9h.01" />
        <path d="M12 1a10 10 0 0 0-5 19.31l1.12-3.36A7 7 0 1 1 12 1z" />
      </svg>
    ),
    report: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="8" y1="8" x2="16" y2="8" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    // System
    system: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    settings: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    backup: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    logs: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="8" y1="8" x2="16" y2="8" />
        <line x1="8" y1="12" x2="16" y2="12" />
        <line x1="8" y1="16" x2="16" y2="16" />
      </svg>
    ),
    // Security icons
    security: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    alert: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    test: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4" />
        <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z" />
        <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z" />
        <path d="M12 3c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z" />
        <path d="M12 21c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z" />
      </svg>
    ),
    // Common
    plus: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" strokeLinecap="round" />
      </svg>
    ),
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
    search: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    event: (color) => (
      <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  };

  // Collapsed: show only icons
  if (collapsed) {
    return (
      <aside
        className={`
          w-20 transition-transform duration-200 flex-shrink-0
          ${theme === "dark" ? "bg-black border-r border-white/10" : "bg-white border-r border-black/10"}
        `}
        style={{ minHeight: "100vh" }}
      >
        <div className="flex flex-col items-center py-4 gap-2">
          {/* Admin Panel Title */}
          <span className="mb-4 text-xs font-extrabold tracking-widest uppercase select-none text-center">
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
          {/* Section icons */}
          {filteredNavSections.map((section) => (
            <button
              key={section.key}
              className={`flex items-center justify-center w-10 h-10 rounded-lg mb-1 transition
                ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-black/10"}`}
              onClick={() => toggleSection(section.key)}
              title={section.title}
            >
              {icons[section.icon](getIconColor(false))}
            </button>
          ))}
        </div>
      </aside>
    );
  }

  // Expanded: show full navigation
  return (
    <aside
      className={`
        w-64 transition-all duration-200 flex-shrink-0
        ${theme === "dark" ? "bg-black border-r border-white/10" : "bg-white border-r border-black/10"}
        ${open ? "block" : "hidden md:block"}
        ${open ? "fixed md:relative z-50 md:z-auto top-0 left-0 h-full md:h-auto" : ""}
      `}
      style={{ minHeight: "100vh" }}
    >
        <div className="py-4 px-3 flex flex-col gap-1 overflow-y-auto">
          {/* Admin Panel Title */}
          <span className="mb-4 text-xl font-extrabold tracking-widest uppercase select-none">
            ADMIN PANEL
          </span>
          
          {/* Dashboard link */}
          <Link
            to="/admin"
            onClick={onClose}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition ml-0 mb-2 text-sm
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

          {/* Navigation Sections */}
          {filteredNavSections.map((section) => (
            <div key={section.key} className="mb-1">
              {/* Section Header */}
              <button
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition mb-0.5 w-full text-left
                  ${theme === "dark" ? "hover:bg-white/10 text-white" : "hover:bg-black/10 text-black"}`}
                onClick={() => toggleSection(section.key)}
              >
                {icons[section.icon](getIconColor(false))}
                <span className="tracking-tight flex-1">{section.title}</span>
                <span className="ml-auto">
                  {openSections[section.key]
                    ? icons.chevronUp(getIconColor(false))
                    : icons.chevronDown(getIconColor(false))}
                </span>
              </button>

              {/* Section Links */}
              {openSections[section.key] && (
                <div className="ml-3 space-y-0.5">
                  {section.links.map((link) => {
                    const isActive = location.pathname === link.to;
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={onClose}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition text-sm
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
              )}
            </div>
          ))}
        </div>
    </aside>
  );
};

export default Sidebar;