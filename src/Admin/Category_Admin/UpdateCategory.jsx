import React, { useState } from "react";
import CategoryForm from "../Components/CategoryForm";
import { useTheme } from "../context/ThemeContext";

// Mock existing category data
const mockCategory = {
  name: "Bollywood",
  slug: "bollywood",
  design: "design1",
  status: "active",
  description: "All about Bollywood movies and stars.",
};

const UpdateCategory = () => {
  const [category] = useState(mockCategory);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cardBg = isDark
    ? "bg-black border border-white/10"
    : "bg-white border border-black/10";
  const textMain = isDark ? "text-white" : "text-black";
  const subText = isDark ? "text-gray-300" : "text-gray-600";
  const btnBg =
    isDark
      ? "bg-white text-black"
      : "bg-black text-white";

  return (
    <div className={`min-h-screen ${isDark ? "bg-black" : "bg-white"} py-12 px-2 flex items-center justify-center transition-colors duration-300`}>
      <div className={`w-full max-w-2xl ${cardBg} rounded-2xl p-8 md:p-12`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h2 className={`text-3xl md:text-4xl font-extrabold mb-2 ${textMain}`}>
              Update Category
            </h2>
            <p className={`text-base ${subText}`}>
              Edit the details and design of your category.
            </p>
          </div>
          <div className="flex-shrink-0">
            <span className={`inline-block ${btnBg} px-4 py-2 rounded-lg font-semibold`}>
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
                  d="M12 20h9"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5l-4 1 1-4L16.5 3.5z"
                />
              </svg>
              Edit Category
            </span>
          </div>
        </div>
        <CategoryForm initialData={category} onSubmit={data => {
          alert("✅ Category Updated!\n\n" + JSON.stringify(data, null, 2));
        }} isEdit />
      </div>
    </div>
  );
};

export default UpdateCategory;