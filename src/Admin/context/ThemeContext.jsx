import React, { createContext, useContext, useState, useEffect } from "react";

// Minimal GenZ-inspired black/white themes
const themes = {
  light: {
    name: "Light",
    body: "bg-white text-black",
    header: "bg-white text-black border-b border-black/10",
    sidebar: "bg-white text-black border-r border-black/10",
    main: "bg-white",
    accent: "bg-black text-white",
    accentHover: "bg-black/80 text-white",
    shadow: "shadow-[0_2px_16px_0_rgba(0,0,0,0.06)]",
  },
  dark: {
    name: "Dark",
    body: "bg-black text-white",
    header: "bg-black text-white border-b border-white/10",
    sidebar: "bg-black text-white border-r border-white/10",
    main: "bg-black",
    accent: "bg-white text-black",
    accentHover: "bg-white/80 text-black",
    shadow: "shadow-[0_2px_16px_0_rgba(255,255,255,0.06)]",
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("admin-theme") || "light"
  );

  useEffect(() => {
    localStorage.setItem("admin-theme", theme);
    document.body.className = themes[theme].body;
  }, [theme]);

  const switchTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, switchTheme, themeStyles: themes[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);