import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text

const CategoryForm = ({ 
  initialData = {}, 
  onSubmit, 
  isEdit = false, 
  inputClass = "",
  loading = false,
  selectedDesign = "design1"
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [formData, setFormData] = useState({
    name: initialData.name || "",
    description: initialData.description || "",
    featureImage: initialData.featureImage || "",
    parentId: initialData.parentId || "",
    order: initialData.order || 0,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData.name) {
      setFormData(prev => ({
        ...prev,
        name: initialData.name,
        description: initialData.description || "",
        featureImage: initialData.featureImage || "",
        parentId: initialData.parentId || "",
        order: initialData.order || 0,
      }));
    }
  }, [initialData]);

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData(prev => ({ ...prev, name }));
    
    // Auto-generate slug
    if (name) {
      const slug = slugify(name);
      // You can add slug to formData if needed
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Category name must be at least 2 characters";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    if (formData.order < 0) {
      newErrors.order = "Order must be a non-negative number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const textMain = isDark ? "text-white" : "text-black";
  const subText = isDark ? "text-gray-300" : "text-gray-600";
  const errorText = "text-red-500";
  const labelClass = `block text-sm font-medium mb-2 ${textMain}`;
  const inputBaseClass = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${inputClass}`;
  const errorClass = `border-red-500 focus:ring-red-500`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Selected Design Display */}
      <div className={`p-4 rounded-lg ${isDark ? "bg-gray-800/50" : "bg-gray-50"} border ${isDark ? "border-white/10" : "border-gray-200"}`}>
        <label className={labelClass}>Selected Design</label>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg ${isDark ? "bg-white" : "bg-black"} flex items-center justify-center`}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={isDark ? "text-black" : "text-white"}>
              {selectedDesign === "design1" && <rect x="4" y="4" width="16" height="16" rx="4" />}
              {selectedDesign === "design2" && <circle cx="12" cy="12" r="8" />}
              {selectedDesign === "design3" && <polygon points="12,4 20,20 4,20" />}
            </svg>
          </div>
          <span className={`font-semibold ${textMain}`}>
            {selectedDesign === "design1" && "Design 1 - Card Grid Layout"}
            {selectedDesign === "design2" && "Design 2 - Table Layout"}
            {selectedDesign === "design3" && "Design 3 - Glassmorphism"}
          </span>
        </div>
      </div>

      {/* Category Name */}
      <div>
        <label htmlFor="name" className={labelClass}>
          Category Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleNameChange}
          className={`${inputBaseClass} ${errors.name ? errorClass : ""}`}
          placeholder="Enter category name"
          disabled={loading}
        />
        {errors.name && (
          <p className={`mt-1 text-sm ${errorText}`}>{errors.name}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows="3"
          className={`${inputBaseClass} ${errors.description ? errorClass : ""}`}
          placeholder="Enter category description (optional)"
          disabled={loading}
        />
        {errors.description && (
          <p className={`mt-1 text-sm ${errorText}`}>{errors.description}</p>
        )}
        <p className={`mt-1 text-xs ${subText}`}>
          {formData.description.length}/500 characters
        </p>
      </div>

      {/* Feature Image */}
      <div>
        <label htmlFor="featureImage" className={labelClass}>
          Feature Image URL
        </label>
        <input
          type="url"
          id="featureImage"
          name="featureImage"
          value={formData.featureImage}
          onChange={handleInputChange}
          className={`${inputBaseClass} ${errors.featureImage ? errorClass : ""}`}
          placeholder="https://example.com/image.jpg"
          disabled={loading}
        />
        {errors.featureImage && (
          <p className={`mt-1 text-sm ${errorText}`}>{errors.featureImage}</p>
        )}
        <p className={`mt-1 text-xs ${subText}`}>
          Optional: URL for category hero image
        </p>
      </div>

      {/* Parent Category */}
      <div>
        <label htmlFor="parentId" className={labelClass}>
          Parent Category
        </label>
        <input
          type="text"
          id="parentId"
          name="parentId"
          value={formData.parentId}
          onChange={handleInputChange}
          className={inputBaseClass}
          placeholder="Leave empty for main category"
          disabled={loading}
        />
        <p className={`mt-1 text-xs ${subText}`}>
          Optional: UUID of parent category for subcategories
        </p>
      </div>

      {/* Display Order */}
      <div>
        <label htmlFor="order" className={labelClass}>
          Display Order
        </label>
        <input
          type="number"
          id="order"
          name="order"
          value={formData.order}
          onChange={handleInputChange}
          min="0"
          className={`${inputBaseClass} ${errors.order ? errorClass : ""}`}
          placeholder="0"
          disabled={loading}
        />
        {errors.order && (
          <p className={`mt-1 text-sm ${errorText}`}>{errors.order}</p>
        )}
        <p className={`mt-1 text-xs ${subText}`}>
          Lower numbers appear first
        </p>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition-all duration-200 ${
            loading
              ? "opacity-50 cursor-not-allowed"
              : "hover:scale-105 active:scale-95"
          } ${
            isDark
              ? "bg-white text-black hover:bg-gray-200"
              : "bg-black text-white hover:bg-gray-900"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
              {isEdit ? "Updating..." : "Creating..."}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                {isEdit ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                )}
              </svg>
              {isEdit ? "Update Category" : "Create Category"}
            </div>
          )}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;