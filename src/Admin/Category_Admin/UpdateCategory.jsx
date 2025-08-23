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
  const [selectedDesign, setSelectedDesign] = useState(category.design);
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

  const designOptions = [
    {
      id: "design1",
      name: "Design 1",
      description: "Modern card-based layout with hover effects",
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="4" y="4" width="16" height="16" rx="4" />
          <rect x="8" y="8" width="8" height="2" rx="1" />
          <rect x="8" y="12" width="8" height="2" rx="1" />
          <rect x="8" y="16" width="4" height="2" rx="1" />
        </svg>
      ),
      gradient: "from-blue-500 to-purple-600",
      features: ["Card Grid Layout", "Hover Animations", "Status Badges", "Modern Icons"]
    },
    {
      id: "design2",
      name: "Design 2", 
      description: "Clean table layout with modern styling",
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M3 3h18v18H3zM8 12h8M8 16h8M8 8h8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 12h18M3 16h18M3 8h18" strokeWidth="1" strokeDasharray="2 2"/>
        </svg>
      ),
      gradient: "from-green-500 to-teal-600",
      features: ["Table Layout", "Professional Design", "Compact View", "Easy Scanning"]
    },
    {
      id: "design3",
      name: "Design 3",
      description: "Glassmorphism design with modern aesthetics",
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="3" strokeWidth="2"/>
        </svg>
      ),
      gradient: "from-purple-500 to-pink-600",
      features: ["Glassmorphism", "Backdrop Blur", "Gradient Effects", "Premium Look"]
    }
  ];

  const handleUpdate = (data) => {
    const updatedData = { ...data, design: selectedDesign };
    alert("✅ Category Updated!\n\n" + JSON.stringify(updatedData, null, 2));
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-black" : "bg-white"} py-12 px-2 flex items-center justify-center transition-colors duration-300`}>
      <div className={`w-full max-w-6xl ${cardBg} rounded-2xl p-8 md:p-12`}>
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

        {/* Design Selection */}
        <div className="mb-8">
          <h3 className={`text-xl font-bold mb-4 ${textMain}`}>
            Choose Your Category Design
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {designOptions.map((design) => (
              <div
                key={design.id}
                onClick={() => setSelectedDesign(design.id)}
                className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 transform hover:scale-105 ${
                  selectedDesign === design.id
                    ? isDark 
                      ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20" 
                      : "border-blue-600 bg-blue-50 shadow-lg shadow-blue-600/20"
                    : isDark 
                      ? "border-white/20 hover:border-white/40 bg-gray-800/50 hover:bg-gray-700/50" 
                      : "border-black/20 hover:border-black/40 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                {/* Design Icon */}
                <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${design.gradient} flex items-center justify-center text-white shadow-lg`}>
                  {design.icon}
                </div>

                {/* Selection Indicator */}
                {selectedDesign === design.id && (
                  <div className="flex justify-center mb-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-medium">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Selected
                    </div>
                  </div>
                )}

                <h4 className={`text-lg font-bold mb-3 text-center ${textMain}`}>
                  {design.name}
                </h4>
                
                <p className={`text-sm mb-4 text-center ${subText}`}>
                  {design.description}
                </p>
                
                <ul className="space-y-2">
                  {design.features.map((feature, index) => (
                    <li key={index} className={`text-xs flex items-center ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      <svg className="w-3 h-3 mr-2 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Category Form */}
        <div className="border-t pt-8">
          <h3 className={`text-xl font-bold mb-4 ${textMain}`}>
            Category Details
          </h3>
          <CategoryForm initialData={category} onSubmit={handleUpdate} isEdit />
        </div>
      </div>
    </div>
  );
};

export default UpdateCategory;