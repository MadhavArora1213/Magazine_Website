import React from "react";
import CategoryForm from "../Components/CategoryForm";
import { useTheme } from "../context/ThemeContext";

const CreateCategory = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Tailwind classes for input fields in both themes
  const inputClass = isDark
    ? "bg-black text-white border-white/20 placeholder-gray-400"
    : "bg-white text-black border-black/20 placeholder-gray-400";

  const handleCreate = (data) => {
    alert("🎉 Category Created!\n\n" + JSON.stringify(data, null, 2));
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-black" : "bg-white"} py-12 px-2 flex items-center justify-center transition-colors duration-300`}>
      <div className={`w-full max-w-2xl ${isDark ? "bg-black border border-white/10" : "bg-white border border-black/10"} rounded-2xl p-8 md:p-12`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h2 className={`text-3xl md:text-4xl font-extrabold mb-2 ${isDark ? "text-white" : "text-black"}`}>
              Create New Category
            </h2>
            <p className={`text-base ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Add a new category to your magazine and choose a design for it.
            </p>
          </div>
          <div className="flex-shrink-0">
            <span className={`inline-block ${isDark ? "bg-white text-black" : "bg-black text-white"} px-4 py-2 rounded-lg font-semibold`}>
              <svg
                className="inline w-6 h-6 mr-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Category
            </span>
          </div>
        </div>
        {/* Pass inputClass to CategoryForm */}
        <CategoryForm onSubmit={handleCreate} inputClass={inputClass} />
      </div>
    </div>
  );
};

export default CreateCategory;