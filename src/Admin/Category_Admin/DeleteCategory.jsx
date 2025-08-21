import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

// Mock categories
const mockCategories = [
  { name: "Bollywood", slug: "bollywood" },
  { name: "Technology", slug: "technology" },
  { name: "Fashion", slug: "fashion" },
];

const DeleteCategory = () => {
  const [categories, setCategories] = useState(mockCategories);
  const [selected, setSelected] = useState("");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cardBg = isDark
    ? "bg-black border border-white/10"
    : "bg-white border border-black/10";
  const textMain = isDark ? "text-white" : "text-black";
  const subText = isDark ? "text-gray-300" : "text-gray-600";
  const btnDanger = isDark
    ? "bg-white text-black hover:bg-gray-200"
    : "bg-black text-white hover:bg-gray-900";
  const selectTheme = isDark
    ? "bg-black text-white border-white/20"
    : "bg-white text-black border-black/20";
  const listText = isDark ? "text-gray-200" : "text-gray-700";

  const handleDelete = (e) => {
    e.preventDefault();
    if (!selected) return;
    setCategories(categories.filter((cat) => cat.slug !== selected));
    setSelected("");
    alert("🗑️ Category deleted!");
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-black" : "bg-white"} py-12 px-2 flex items-center justify-center`}>
      <div className={`w-full max-w-xl ${cardBg} rounded-2xl p-8 md:p-12`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h2 className={`text-3xl md:text-4xl font-extrabold mb-2 ${textMain}`}>
              Delete Category
            </h2>
            <p className={`text-base ${subText}`}>
              Select a category to permanently remove it from your magazine.
            </p>
          </div>
          <div className="flex-shrink-0">
            <span className={`inline-block ${isDark ? "bg-white text-black" : "bg-black text-white"} px-4 py-2 rounded-lg font-semibold`}>
              <svg className="inline w-6 h-6 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3M4 7h16" />
              </svg>
              Danger Zone
            </span>
          </div>
        </div>
        <form onSubmit={handleDelete} className={`${isDark ? "bg-black" : "bg-white"} rounded-xl p-6 space-y-6 border border-transparent`}>
          <div>
            <label className={`block font-semibold mb-2 ${textMain}`}>Select Category to Delete</label>
            <select
              className={`w-full rounded px-3 py-2 border focus:outline-none transition ${selectTheme}`}
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              required
            >
              <option value="">-- Choose Category --</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-bold transition ${btnDanger}`}
            disabled={!selected}
          >
            Delete Category
          </button>
        </form>
        <div className="mt-8">
          <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-white" : "text-black"}`}>Current Categories:</h3>
          <ul className={`list-disc list-inside ${listText}`}>
            {categories.length === 0 ? (
              <li className="text-gray-400">No categories left.</li>
            ) : (
              categories.map((cat) => <li key={cat.slug}>{cat.name}</li>)
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategory;