import React from "react";
import { useTheme } from "../context/ThemeContext";

const Header = ({ onMenuClick }) => {
  const { switchTheme, theme, themeStyles } = useTheme();

  return (
    <header className={`sticky top-0 z-30 w-full ${themeStyles.header} border-b`}>
      <div className="w-full px-4 py-3 flex items-center justify-between">
        {/* Unique geometric accent and bold name */}
        <div className="flex items-center gap-3 select-none">
          <span
            className={`w-6 h-6 rounded-lg ${
              theme === "dark" ? "bg-white" : "bg-black"
            } rotate-12 mr-2`}
            style={{
              display: "inline-block",
              boxShadow:
                theme === "dark"
                  ? "0 2px 8px 0 rgba(255,255,255,0.08)"
                  : "0 2px 8px 0 rgba(0,0,0,0.08)",
            }}
          />
          <span className="text-2xl font-extrabold tracking-tight font-mono uppercase">
            Admin<span className="font-light ml-1 opacity-60">Panel</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Menu Icon (always visible) */}
          <button
            title="Toggle Menu"
            onClick={onMenuClick}
            className={`rounded-full p-2 border transition hover:scale-110 ${
              theme === "dark" ? "border-white/20" : "border-black/20"
            } bg-transparent`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="4" y="7" width="16" height="2" rx="1" fill={theme === "dark" ? "#fff" : "#000"} />
              <rect x="4" y="15" width="16" height="2" rx="1" fill={theme === "dark" ? "#fff" : "#000"} />
            </svg>
          </button>
          {/* Theme Switch Icon */}
          <button
            title="Switch Theme"
            onClick={switchTheme}
            className={`rounded-full p-2 border transition hover:scale-110 ${
              theme === "dark" ? "border-white/20" : "border-black/20"
            } bg-transparent`}
          >
            {theme === "dark" ? (
              // Sun icon for light mode
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="white" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414m12.728 0l-1.414-1.414M6.05 6.05L4.636 4.636" />
              </svg>
            ) : (
              // Moon icon for dark mode
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="white" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;