import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAdminAuth } from "../context/AdminAuthContext";
import categoryService from "../services/categoryService";

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
                <path d="15 9l-6 6M9 9l6 6" />
            </svg>
            Inactive
        </span>
    );

const AllCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingDesign, setUpdatingDesign] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        hasNextPage: false,
        hasPrevPage: false,
        nextPage: null,
        prevPage: null
    });
    const [pageSize] = useState(10);
    const { theme } = useTheme();
    const { admin } = useAdminAuth();
    const navigate = useNavigate();
    const isDark = theme === "dark";

    const bgMain = isDark ? "bg-black" : "bg-white";
    const textMain = isDark ? "text-white" : "text-black";
    const subText = isDark ? "text-gray-300" : "text-gray-600";
    const cardBg = isDark ? "bg-gray-800/50" : "bg-gray-50";
    const borderColor = isDark ? "border-white/10" : "border-gray-200";

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories(1);
    }, []);

    const fetchCategories = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching categories for page:', page);

            const response = await categoryService.getCategories({ page, limit: pageSize });
            console.log('API Response:', response);

            // Ensure categories is always an array
            let categoriesArray = [];
            if (response && typeof response === 'object') {
                console.log('Response structure:', Object.keys(response));

                // Check if response.success and response.data exists (backend API structure)
                if (response.success && response.data && Array.isArray(response.data)) {
                    categoriesArray = response.data;
                    console.log('Found categories in response.data:', categoriesArray.length);
                } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                    categoriesArray = response.data.data;
                    console.log('Found categories in response.data.data:', categoriesArray.length);
                } else if (response.data && Array.isArray(response.data)) {
                    categoriesArray = response.data;
                    console.log('Response.data is array:', categoriesArray.length);
                } else if (Array.isArray(response)) {
                    categoriesArray = response;
                    console.log('Response is array:', categoriesArray.length);
                } else if (response.categories && Array.isArray(response.categories)) {
                    categoriesArray = response.categories;
                    console.log('Response.categories is array:', categoriesArray.length);
                } else if (response.data && response.data.categories && Array.isArray(response.data.categories)) {
                    categoriesArray = response.data.categories;
                    console.log('Response.data.categories is array:', categoriesArray.length);
                } else {
                    console.log('Could not find categories array in response');
                    console.log('Full response:', JSON.stringify(response, null, 2));
                }
            } else {
                console.log('Response is not an object:', typeof response);
            }

            console.log('Setting categories:', categoriesArray.length);
            setCategories(categoriesArray);

            // Update pagination state
            if (response && response.pagination) {
                setPagination(response.pagination);
            } else if (response && response.success) {
                // Fallback: construct pagination from direct response properties
                setPagination({
                    currentPage: response.currentPage || 1,
                    totalPages: response.totalPages || 1,
                    totalCount: response.totalCount || 0,
                    hasNextPage: (response.currentPage || 1) < (response.totalPages || 1),
                    hasPrevPage: (response.currentPage || 1) > 1,
                    nextPage: (response.currentPage || 1) < (response.totalPages || 1) ? (response.currentPage || 1) + 1 : null,
                    prevPage: (response.currentPage || 1) > 1 ? (response.currentPage || 1) - 1 : null
                });
            }

            // Update pagination state
            if (response && response.pagination) {
                setPagination(response.pagination);
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
            console.error('Error details:', err.response?.data || err.message);
            setError(err.message || 'Failed to fetch categories');
            setCategories([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (categoryId) => {
        if (!window.confirm('Are you sure you want to delete this category?')) {
            return;
        }

        try {
            await categoryService.deleteCategory(categoryId);
            // Note: cmsService.deleteCategory expects the ID as a parameter, which should work
            setCategories(categories.filter(cat => cat.id !== categoryId));
            alert('Category deleted successfully!');
        } catch (err) {
            alert(`Error deleting category: ${err.message}`);
        }
    };

    const handleToggleStatus = async (categoryId) => {
        try {
            const response = await categoryService.toggleCategoryStatus(categoryId);
            const newStatus = response?.data?.status || response?.status;
            if (newStatus) {
                setCategories(categories.map(cat =>
                    cat.id === categoryId
                        ? { ...cat, status: newStatus }
                        : cat
                ));
            }
        } catch (err) {
            alert(`Error updating status: ${err.message}`);
        }
    };

    const handleDesignChange = async (categoryId, newDesign) => {
        try {
            setUpdatingDesign(categoryId);
            const response = await categoryService.updateCategoryDesign(categoryId, newDesign);

            // Update local state
            setCategories(categories.map(cat =>
                cat.id === categoryId
                    ? { ...cat, design: newDesign }
                    : cat
            ));

            alert(`Category design updated to ${newDesign}!`);
        } catch (err) {
            alert(`Error updating design: ${err.message}`);
        } finally {
            setUpdatingDesign(null);
        }
    };

    const handleEdit = (category) => {
        navigate(`/admin/category/update/${category.id}`, {
            state: { category }
        });
    };

    // Pagination functions
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchCategories(newPage);
        }
    };

    const handlePrevPage = () => {
        if (pagination.hasPrevPage) {
            handlePageChange(pagination.currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (pagination.hasNextPage) {
            handlePageChange(pagination.currentPage + 1);
        }
    };

    const handleFirstPage = () => {
        handlePageChange(1);
    };

    const handleLastPage = () => {
        handlePageChange(pagination.totalPages);
    };

    if (loading) {
        return (
            <div className={`min-h-screen ${bgMain} flex items-center justify-center`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-current mx-auto mb-4"></div>
                    <p className={`text-xl ${textMain}`}>Loading categories...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`min-h-screen ${bgMain} flex items-center justify-center`}>
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className={`text-2xl font-bold mb-2 ${textMain}`}>Error Loading Categories</h2>
                    <p className={`mb-4 ${subText}`}>{error}</p>
                    <button
                        onClick={() => fetchCategories(1)}
                        className={`px-4 py-2 rounded-lg ${isDark ? "bg-white text-black" : "bg-black text-white"}`}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${bgMain} py-6 px-2 md:px-6 transition-colors duration-300`}>
            <div className="w-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                    <div>
                        <h2 className={`text-2xl md:text-4xl font-black mb-1 tracking-tight flex items-center gap-2 ${textMain}`}>
                            <svg
                                width="32"
                                height="32"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                            >
                                <rect x="3" y="7" width="18" height="10" rx="4" />
                                <circle cx="8" cy="12" r="2" />
                            </svg>
                            All Categories
                        </h2>
                        <p className={`text-base ${subText}`}>
                            Overview of all magazine categories with their design and status.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            to="/admin/category/create"
                            className={`${isDark ? "bg-white hover:bg-gray-200 text-black" : "bg-black hover:bg-gray-900 text-white"} font-bold px-5 py-2 rounded-lg shadow transition flex items-center gap-2`}
                        >
                            <svg
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <circle cx="12" cy="12" r="9" />
                                <path d="M12 8v8M8 12h8" strokeLinecap="round" />
                            </svg>
                            Add Category
                        </Link>
                    </div>
                </div>

                {/* Design Preview Section */}
                <div className={`mb-8 p-6 ${cardBg} rounded-2xl border ${borderColor}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${textMain}`}>Available Designs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`text-center p-4 ${isDark ? "bg-gray-900" : "bg-white"} rounded-xl border ${borderColor}`}>
                            <div className={`w-16 h-16 mx-auto mb-3 ${isDark ? "bg-white" : "bg-black"} rounded-lg flex items-center justify-center`}>
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={isDark ? "text-black" : "text-white"}>
                                    <rect x="4" y="4" width="16" height="16" rx="4" />
                                </svg>
                            </div>
                            <h4 className={`font-semibold mb-1 ${textMain}`}>Design 1</h4>
                            <p className={`text-xs ${subText}`}>Card Grid Layout</p>
                        </div>
                        <div className={`text-center p-4 ${isDark ? "bg-gray-900" : "bg-white"} rounded-xl border ${borderColor}`}>
                            <div className={`w-16 h-16 mx-auto mb-3 ${isDark ? "bg-gray-700" : "bg-gray-100"} rounded-lg flex items-center justify-center border ${isDark ? "border-gray-600" : "border-gray-300"}`}>
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={isDark ? "text-gray-300" : "text-gray-700"}>
                                    <circle cx="12" cy="12" r="8" />
                                </svg>
                            </div>
                            <h4 className={`font-semibold mb-1 ${textMain}`}>Design 2</h4>
                            <p className={`text-xs ${subText}`}>Table Layout</p>
                        </div>
                        <div className={`text-center p-4 ${isDark ? "bg-gray-900" : "bg-white"} rounded-xl border ${borderColor}`}>
                            <div className={`w-16 h-16 mx-auto mb-3 ${isDark ? "bg-white" : "bg-black"} rounded-lg flex items-center justify-center`}>
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={isDark ? "text-black" : "text-white"}>
                                    <polygon points="12,4 20,20 4,20" />
                                </svg>
                            </div>
                            <h4 className={`font-semibold mb-1 ${textMain}`}>Design 3</h4>
                            <p className={`text-xs ${subText}`}>Glassmorphism</p>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className={`overflow-x-auto rounded-2xl shadow-2xl ${isDark ? "bg-gray-900" : "bg-white"} border ${borderColor} w-full`}>
                    <table className="min-w-full w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                            <tr className={isDark ? "bg-gray-800" : "bg-gray-100"}>
                                <th className={`py-4 px-4 text-left font-semibold ${textMain}`}>
                                    Name
                                </th>
                                <th className={`py-4 px-4 text-left font-semibold ${textMain}`}>
                                    Slug
                                </th>
                                <th className={`py-4 px-4 text-left font-semibold ${textMain}`}>
                                    Design
                                </th>
                                <th className={`py-4 px-4 text-left font-semibold ${textMain}`}>
                                    Status
                                </th>
                                <th className={`py-4 px-4 text-left font-semibold ${textMain}`}>
                                    Description
                                </th>
                                <th className={`py-4 px-4 text-center font-semibold ${textMain}`}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat, idx) => (
                                <tr
                                    key={cat.id}
                                    className={
                                        idx % 2 === 0
                                            ? `${isDark ? "bg-gray-900" : "bg-white"} hover:${isDark ? "bg-gray-800" : "bg-gray-100"} transition`
                                            : `${isDark ? "bg-gray-800" : "bg-gray-50"} hover:${isDark ? "bg-gray-800" : "bg-gray-100"} transition`
                                    }
                                >
                                    <td className={`py-3 px-4 font-medium ${textMain}`}>
                                        {cat.name}
                                    </td>
                                    <td className={`py-3 px-4 ${subText}`}>
                                        {cat.slug}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            {designBadges[cat.design]}
                                            <select
                                                value={cat.design}
                                                onChange={(e) => handleDesignChange(cat.id, e.target.value)}
                                                disabled={updatingDesign === cat.id}
                                                className={`text-xs px-2 py-1 rounded border ${isDark ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
                                            >
                                                <option value="design1">Design 1</option>
                                                <option value="design2">Design 2</option>
                                                <option value="design3">Design 3</option>
                                            </select>
                                            {updatingDesign === cat.id && (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <button
                                            onClick={() => handleToggleStatus(cat.id)}
                                            className="hover:opacity-80 transition"
                                        >
                                            {statusBadge(cat.status)}
                                        </button>
                                    </td>
                                    <td className={`py-3 px-4 ${subText}`}>
                                        {cat.description || 'No description'}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex flex-row gap-2 justify-center items-center">
                                            <button
                                                onClick={() => handleEdit(cat)}
                                                className={`inline-flex items-center gap-1 ${isDark ? "bg-white hover:bg-gray-200 text-black" : "bg-black hover:bg-gray-800 text-white"} px-3 py-1 rounded transition shadow`}
                                                title="Edit"
                                            >
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" />
                                                </svg>
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                className={`inline-flex items-center gap-1 ${isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-white hover:bg-gray-100 text-black"} border ${isDark ? "border-gray-600" : "border-gray-300"} px-3 py-1 rounded transition shadow`}
                                                title="Delete"
                                            >
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    fill="none"
                                                    stroke="currentColor"
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

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className={`text-sm ${subText}`}>
                            Showing {((pagination.currentPage - 1) * pageSize) + 1} to {Math.min(pagination.currentPage * pageSize, pagination.totalCount)} of {pagination.totalCount} categories
                        </div>

                        <div className="flex items-center gap-2">
                            {/* First Page */}
                            <button
                                onClick={handleFirstPage}
                                disabled={!pagination.hasPrevPage}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                                    pagination.hasPrevPage
                                        ? `${isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-black"}`
                                        : `${isDark ? "bg-gray-800 text-gray-500" : "bg-gray-100 text-gray-400"} cursor-not-allowed`
                                }`}
                            >
                                First
                            </button>

                            {/* Previous Page */}
                            <button
                                onClick={handlePrevPage}
                                disabled={!pagination.hasPrevPage}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                                    pagination.hasPrevPage
                                        ? `${isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-black"}`
                                        : `${isDark ? "bg-gray-800 text-gray-500" : "bg-gray-100 text-gray-400"} cursor-not-allowed`
                                }`}
                            >
                                Previous
                            </button>

                            {/* Page Numbers */}
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                    const pageNum = Math.max(1, Math.min(pagination.totalPages - 4, pagination.currentPage - 2)) + i;
                                    if (pageNum > pagination.totalPages) return null;

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                                                pageNum === pagination.currentPage
                                                    ? `${isDark ? "bg-blue-600 text-white" : "bg-blue-500 text-white"}`
                                                    : `${isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-black"}`
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Next Page */}
                            <button
                                onClick={handleNextPage}
                                disabled={!pagination.hasNextPage}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                                    pagination.hasNextPage
                                        ? `${isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-black"}`
                                        : `${isDark ? "bg-gray-800 text-gray-500" : "bg-gray-100 text-gray-400"} cursor-not-allowed`
                                }`}
                            >
                                Next
                            </button>

                            {/* Last Page */}
                            <button
                                onClick={handleLastPage}
                                disabled={!pagination.hasNextPage}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                                    pagination.hasNextPage
                                        ? `${isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-black"}`
                                        : `${isDark ? "bg-gray-800 text-gray-500" : "bg-gray-100 text-gray-400"} cursor-not-allowed`
                                }`}
                            >
                                Last
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllCategory;