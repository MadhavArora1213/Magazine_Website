import React, { useState } from "react";
import { Link } from "react-router-dom";

const mockCategories = [
    {
        name: "Bollywood",
        slug: "bollywood",
        design: "design1",
        status: "active",
        description: "All about Bollywood movies and stars.",
    },
    {
        name: "Technology",
        slug: "technology",
        design: "design2",
        status: "inactive",
        description: "Latest in tech and gadgets.",
    },
    {
        name: "Fashion",
        slug: "fashion",
        design: "design3",
        status: "active",
        description: "Trends and style tips.",
    },
];

const designBadges = {
    design1: (
        <span className="inline-flex flex-nowrap items-center gap-1 px-3 py-1 rounded-full bg-black text-white text-xs font-semibold">
            <svg
                width="16"
                height="16"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <rect x="4" y="4" width="16" height="16" rx="4" />
            </svg>
            Design 1
        </span>
    ),
    design2: (
        <span className="inline-flex flex-nowrap items-center gap-1 px-3 py-1 rounded-full bg-white text-black border border-black text-xs font-semibold">
            <svg
                width="16"
                height="16"
                fill="none"
                stroke="black"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <circle cx="12" cy="12" r="8" />
            </svg>
            Design 2
        </span>
    ),
    design3: (
        <span className="inline-flex flex-nowrap items-center gap-1 px-3 py-1 rounded-full bg-black text-white text-xs font-semibold border border-white">
            <svg
                width="16"
                height="16"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <polygon points="12,4 20,20 4,20" />
            </svg>
            Design 3
        </span>
    ),
};

const statusBadge = (status) =>
    status === "active" ? (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-black text-white">
            <svg
                width="14"
                height="14"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <circle cx="12" cy="12" r="10" />
                <path d="M9 12l2 2 4-4" />
            </svg>
            Active
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white text-black border border-black">
            <svg
                width="14"
                height="14"
                fill="none"
                stroke="black"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <circle cx="12" cy="12" r="10" />
                <path d="M15 9l-6 6M9 9l6 6" />
            </svg>
            Inactive
        </span>
    );

const AllCategory = () => {
    const [categories] = useState(mockCategories);

    return (
        <div className="min-h-screen bg-white dark:bg-black py-6 px-2 md:px-6 transition-colors duration-300">
            <div className="w-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl md:text-4xl font-black text-black dark:text-white mb-1 tracking-tight flex items-center gap-2">
                            <svg
                                width="32"
                                height="32"
                                fill="none"
                                stroke="black"
                                className="dark:stroke-white"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                            >
                                <rect x="3" y="7" width="18" height="10" rx="4" />
                                <circle cx="8" cy="12" r="2" />
                            </svg>
                            All Categories
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-base">
                            Overview of all magazine categories with their design and status.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            to="/admin/category/create"
                            className="bg-black hover:bg-gray-900 text-white font-bold px-5 py-2 rounded-lg shadow transition flex items-center gap-2"
                        >
                            <svg
                                width="18"
                                height="18"
                                fill="none"
                                stroke="white"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                            >
                                <circle cx="12" cy="12" r="9" />
                                <path d="M12 8v8M8 12h8" strokeLinecap="round" />
                            </svg>
                            Add Category
                        </Link>
                    </div>
                </div>
                {/* Table */}
                <div className="overflow-x-auto rounded-2xl shadow-2xl bg-white dark:bg-black border border-black/10 dark:border-white/10 w-full">
                    <table className="min-w-full w-full divide-y divide-black/10 dark:divide-white/10">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-900">
                                <th className="py-4 px-4 text-left font-semibold text-black dark:text-white">
                                    Name
                                </th>
                                <th className="py-4 px-4 text-left font-semibold text-black dark:text-white">
                                    Slug
                                </th>
                                <th className="py-4 px-4 text-left font-semibold text-black dark:text-white">
                                    Design
                                </th>
                                <th className="py-4 px-4 text-left font-semibold text-black dark:text-white">
                                    Status
                                </th>
                                <th className="py-4 px-4 text-left font-semibold text-black dark:text-white">
                                    Description
                                </th>
                                <th className="py-4 px-4 text-center font-semibold text-black dark:text-white">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat, idx) => (
                                <tr
                                    key={cat.slug}
                                    className={
                                        idx % 2 === 0
                                            ? "bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                                            : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                                    }
                                >
                                    <td className="py-3 px-4 font-medium text-black dark:text-white">
                                        {cat.name}
                                    </td>
                                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                                        {cat.slug}
                                    </td>
                                    <td className="py-3 px-4">
                                        {designBadges[cat.design]}
                                    </td>
                                    <td className="py-3 px-4">
                                        {statusBadge(cat.status)}
                                    </td>
                                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                                        {cat.description}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex flex-row gap-2 justify-center items-center">
                                            <button
                                                className="inline-flex items-center gap-1 bg-black hover:bg-gray-800 text-white px-3 py-1 rounded transition shadow"
                                                title="Edit"
                                            >
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    fill="none"
                                                    stroke="white"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" />
                                                </svg>
                                                Edit
                                            </button>
                                            <button
                                                className="inline-flex items-center gap-1 bg-white border border-black text-black hover:bg-gray-200 px-3 py-1 rounded transition shadow"
                                                title="Delete"
                                            >
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    fill="none"
                                                    stroke="black"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <rect x="5" y="7" width="14" height="12" rx="2" />
                                                    <path d="M9 11v6M15 11v6" strokeLinecap="round" />
                                                    <path d="M10 7V5a2 2 0 0 1 4 0v2" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-8 text-center text-gray-400 dark:text-gray-500"
                                    >
                                        No categories found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center">
                    Showing {categories.length} categories
                </div>
            </div>
        </div>
    );
};

export default AllCategory;