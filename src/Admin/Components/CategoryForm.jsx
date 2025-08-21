import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

// Helper to generate slug from name
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

const designOptions = [
  {
    key: "design1",
    label: "Design 1",
    preview: (
      <div className="border-2 border-blue-500 rounded-lg p-4 text-center bg-blue-50 dark:bg-blue-900">
        <h4 className="font-bold text-blue-700 dark:text-blue-200 mb-2">Design 1</h4>
        <div className="h-12 bg-blue-200 dark:bg-blue-700 rounded mb-2"></div>
        <p className="text-xs text-blue-700 dark:text-blue-200">Simple & Clean</p>
      </div>
    ),
  },
  {
    key: "design2",
    label: "Design 2",
    preview: (
      <div className="border-2 border-green-500 rounded-lg p-4 text-center bg-green-50 dark:bg-green-900">
        <h4 className="font-bold text-green-700 dark:text-green-200 mb-2">Design 2</h4>
        <div className="h-12 bg-green-200 dark:bg-green-700 rounded mb-2"></div>
        <p className="text-xs text-green-700 dark:text-green-200">Modern Card</p>
      </div>
    ),
  },
  {
    key: "design3",
    label: "Design 3",
    preview: (
      <div className="border-2 border-yellow-500 rounded-lg p-4 text-center bg-yellow-50 dark:bg-yellow-900">
        <h4 className="font-bold text-yellow-700 dark:text-yellow-200 mb-2">Design 3</h4>
        <div className="h-12 bg-yellow-200 dark:bg-yellow-700 rounded mb-2"></div>
        <p className="text-xs text-yellow-700 dark:text-yellow-200">Bold & Highlighted</p>
      </div>
    ),
  },
];

const CategoryForm = ({ initialData = {}, onSubmit, isEdit = false, inputClass = "" }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [name, setName] = useState(initialData.name || "");
  const [slug, setSlug] = useState(initialData.slug || "");
  const [design, setDesign] = useState(initialData.design || "design1");
  const [status, setStatus] = useState(initialData.status || "active");
  const [description, setDescription] = useState(initialData.description || "");

  // Auto-generate slug from name
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setSlug(slugify(value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !slug) return;
    onSubmit &&
      onSubmit({
        name,
        slug,
        design,
        status,
        description,
      });
  };

  // Theme-aware classes for form background and text
  const formBg = isDark
    ? "bg-black border border-white/10"
    : "bg-white border border-black/10";
  const labelText = isDark ? "text-white" : "text-black";
  const inputBase =
    "w-full rounded px-3 py-2 border focus:outline-none transition";
  const inputTheme = isDark
    ? "bg-black text-white border-white/20 placeholder-gray-400 focus:ring-2 focus:ring-blue-900"
    : "bg-white text-black border-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-400";
  const selectTheme = isDark
    ? "bg-black text-white border-white/20"
    : "bg-white text-black border-gray-300";
  const buttonTheme = isDark
    ? "bg-blue-800 hover:bg-blue-900 text-white"
    : "bg-blue-700 hover:bg-blue-800 text-white";

  return (
    <form
      className={`${formBg} rounded-xl p-6 max-w-xl mx-auto space-y-6`}
      onSubmit={handleSubmit}
    >
      <div>
        <label className={`block font-semibold mb-1 ${labelText}`}>Category Name</label>
        <input
          type="text"
          className={`${inputBase} ${inputTheme} ${inputClass}`}
          value={name}
          onChange={handleNameChange}
          placeholder="Enter category name"
          required
        />
      </div>
      <div>
        <label className={`block font-semibold mb-1 ${labelText}`}>Slug</label>
        <input
          type="text"
          className={`${inputBase} ${isDark ? "bg-gray-800 text-white border-white/20" : "bg-gray-100 text-black border-gray-300"} cursor-not-allowed`}
          value={slug}
          readOnly
        />
      </div>
      <div>
        <label className={`block font-semibold mb-2 ${labelText}`}>Choose Design</label>
        <div className="flex flex-col sm:flex-row gap-4">
          {designOptions.map((option) => (
            <label key={option.key} className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="design"
                value={option.key}
                checked={design === option.key}
                onChange={() => setDesign(option.key)}
                className="hidden"
              />
              <div
                className={`transition border-2 rounded-lg p-2 ${
                  design === option.key
                    ? "border-blue-600 ring-2 ring-blue-200 dark:ring-blue-900"
                    : "border-transparent"
                }`}
              >
                {option.preview}
              </div>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className={`block font-semibold mb-1 ${labelText}`}>Description</label>
        <textarea
          className={`${inputBase} ${inputTheme} ${inputClass}`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description (optional)"
          rows={3}
        />
      </div>
      <div>
        <label className={`block font-semibold mb-1 ${labelText}`}>Status</label>
        <select
          className={`${inputBase} ${selectTheme} ${inputClass}`}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <button
        type="submit"
        className={`w-full ${buttonTheme} font-bold py-3 rounded-lg transition`}
      >
        {isEdit ? "Update Category" : "Create Category"}
      </button>
    </form>
  );
};
export default CategoryForm;