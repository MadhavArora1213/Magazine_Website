import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryForm from "../Components/CategoryForm";
import { useTheme } from "../context/ThemeContext";
import categoryService from "../services/categoryService";

const CreateCategory = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [selectedDesign, setSelectedDesign] = useState("design1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Tailwind classes for input fields in both themes
  const inputClass = isDark
    ? "bg-black text-white border-white/20 placeholder-gray-400"
    : "bg-white text-black border-black/20 placeholder-gray-400";

  const handleCreate = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const categoryData = { 
        ...data, 
        design: selectedDesign,
        status: 'active'
      };

      const response = await categoryService.createCategory(categoryData);
      
      alert("✅ Category Created Successfully!");
      console.log('Created category:', response.data);
      
      // Redirect to categories list
      navigate('/admin/category/all');
    } catch (err) {
      setError(err.message);
      alert(`❌ Error creating category: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className={`min-h-screen ${isDark ? "bg-black" : "bg-white"} py-12 px-2 flex items-center justify-center transition-colors duration-300`}>
      <div className={`w-full max-w-6xl ${isDark ? "bg-black border border-white/10" : "bg-white border border-black/10"} rounded-2xl p-8 md:p-12`}>
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

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Design Selection */}
        <div className="mb-8">
          <h3 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-black"}`}>
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

                <h4 className={`text-lg font-bold mb-3 text-center ${isDark ? "text-white" : "text-black"}`}>
                  {design.name}
                </h4>
                
                <p className={`text-sm mb-4 text-center ${isDark ? "text-gray-300" : "text-gray-600"}`}>
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
          <h3 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-black"}`}>
            Category Details
          </h3>
          <CategoryForm 
            onSubmit={handleCreate} 
            inputClass={inputClass} 
            loading={loading}
            selectedDesign={selectedDesign}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateCategory;