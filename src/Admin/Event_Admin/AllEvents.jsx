import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import { eventService } from "../services/eventService";
import { Link } from "react-router-dom";

const AllEvents = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { showSuccess, showError } = useToast();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [statistics, setStatistics] = useState({
    totalEvents: 0,
    publishedEvents: 0,
    upcomingEvents: 0,
    totalRegistrations: 0
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    prevPage: null
  });

  const [pageSize] = useState(20);

  useEffect(() => {
    loadEvents();
    loadStatistics();
  }, []);

  const loadEvents = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pageSize,
        ...(selectedStatus && { status: selectedStatus }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(searchTerm && { search: searchTerm })
      };

      const response = await eventService.getAllEvents(params);
      console.log('Events response:', response);

      let eventsData = [];
      let paginationData = null;

      if (response && response.data) {
        // Axios wraps the response in data property
        const responseData = response.data;

        if (responseData.events && Array.isArray(responseData.events)) {
          eventsData = responseData.events;
        } else if (Array.isArray(responseData)) {
          eventsData = responseData;
        }

        if (responseData.pagination) {
          paginationData = responseData.pagination;
        }
      } else if (response && typeof response === 'object') {
        // Fallback for direct response
        if (response.events && Array.isArray(response.events)) {
          eventsData = response.events;
        } else if (Array.isArray(response)) {
          eventsData = response;
        }

        if (response.pagination) {
          paginationData = response.pagination;
        }
      }

      console.log('Setting events:', eventsData.length);
      setEvents(eventsData);

      // Update pagination
      if (paginationData) {
        setPagination({
          currentPage: paginationData.currentPage || page,
          totalPages: paginationData.totalPages || 1,
          totalCount: paginationData.total || eventsData.length,
          hasNextPage: paginationData.currentPage < paginationData.totalPages,
          hasPrevPage: paginationData.currentPage > 1,
          nextPage: paginationData.currentPage < paginationData.totalPages ? paginationData.currentPage + 1 : null,
          prevPage: paginationData.currentPage > 1 ? paginationData.currentPage - 1 : null
        });
      }
    } catch (error) {
      console.error('Failed to load events:', error);
      showError('Failed to load events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await eventService.getEventsAnalytics();
      if (response && response.data && response.data.analytics) {
        setStatistics(response.data.analytics);
      } else if (response && response.analytics) {
        setStatistics(response.analytics);
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const handleSearch = () => {
    loadEvents(1);
  };

  const handleFilterChange = () => {
    loadEvents(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadEvents(newPage);
    }
  };

  const handleDeleteClick = (eventId, eventTitle) => {
    setDeleteTarget({ id: eventId, title: eventTitle });
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      await eventService.deleteEvent(deleteTarget.id);
      setEvents(events.filter(event => event.id !== deleteTarget.id));
      showSuccess(`Event "${deleteTarget.title}" deleted successfully!`);
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      loadStatistics(); // Refresh statistics
    } catch (error) {
      console.error('Failed to delete event:', error);
      showError(error.response?.data?.message || error.message || 'Failed to delete event');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  };

  const handlePublishToggle = async (eventId, currentStatus) => {
    try {
      if (currentStatus === 'published') {
        await eventService.unpublishEvent(eventId);
        showSuccess('Event unpublished successfully!');
      } else {
        await eventService.publishEvent(eventId);
        showSuccess('Event published successfully!');
      }
      loadEvents(pagination.currentPage); // Refresh the list
    } catch (error) {
      console.error('Failed to toggle event status:', error);
      showError('Failed to update event status');
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = !searchTerm ||
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || event.status === selectedStatus;
    const matchesCategory = !selectedCategory || event.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status) => {
    const colors = {
      draft: isDark ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-800',
      published: isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-800',
      cancelled: isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-800',
      postponed: isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-800',
      completed: isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-800'
    };
    return colors[status] || colors.draft;
  };

  const getEventStatus = (event) => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    if (event.status === 'cancelled') return 'cancelled';
    if (event.status === 'postponed') return 'postponed';
    if (now < startDate) return 'upcoming';
    if (now >= startDate && now <= endDate) return 'ongoing';
    if (now > endDate) return 'completed';
    return 'unknown';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const cardBg = isDark ? "bg-black border border-white/10" : "bg-white border border-black/10";
  const textMain = isDark ? "text-white" : "text-black";
  const subText = isDark ? "text-gray-300" : "text-gray-600";
  const innerCardBg = isDark ? "bg-gray-800/50" : "bg-gray-50";
  const innerBorderColor = isDark ? "border-white/10" : "border-gray-200";

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? "bg-black" : "bg-white"} py-12 px-2 flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className={`text-xl ${textMain}`}>Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? "bg-black" : "bg-white"} py-12 px-2`}>
      <div className={`w-full max-w-7xl mx-auto ${cardBg} rounded-2xl p-8 md:p-12`}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h2 className={`text-3xl md:text-4xl font-extrabold mb-2 ${textMain}`}>
              All Events
            </h2>
            <p className={`text-base ${subText}`}>
              Manage all events in your system.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/events/create"
              className={`px-6 py-3 rounded-lg font-bold transition ${isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-900"}`}
            >
              + Create Event
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div>
            <label className={`block text-sm font-medium mb-2 ${textMain}`}>Search Events</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isDark ? "bg-black text-white border-white/20" : "bg-white text-black border-black/20"}`}
              />
              <button
                onClick={handleSearch}
                className={`px-4 py-2 rounded-lg font-medium transition ${isDark ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
              >
                Search
              </button>
            </div>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${textMain}`}>Filter by Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                handleFilterChange();
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isDark ? "bg-black text-white border-white/20" : "bg-white text-black border-black/20"}`}
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
              <option value="postponed">Postponed</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${textMain}`}>Filter by Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                handleFilterChange();
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isDark ? "bg-black text-white border-white/20" : "bg-white text-black border-black/20"}`}
            >
              <option value="">All Categories</option>
              <option value="business">Business</option>
              <option value="entertainment">Entertainment</option>
              <option value="cultural">Cultural</option>
              <option value="social">Social</option>
              <option value="educational">Educational</option>
              <option value="fashion">Fashion</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="technology">Technology</option>
              <option value="health">Health</option>
              <option value="sports">Sports</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${textMain}`}>Actions</label>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedStatus("");
                setSelectedCategory("");
                loadEvents(1);
              }}
              className={`w-full px-4 py-2 rounded-lg font-medium transition ${isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-900"}`}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`${innerCardBg} rounded-xl p-6 border ${innerBorderColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${subText}`}>Total Events</p>
                <p className={`text-3xl font-bold ${textMain}`}>{statistics.totalEvents}</p>
              </div>
              <div className={`p-3 rounded-lg ${isDark ? "bg-white/10" : "bg-black/10"}`}>
                <svg className={`w-6 h-6 ${textMain}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className={`${innerCardBg} rounded-xl p-6 border ${innerBorderColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${subText}`}>Published Events</p>
                <p className={`text-3xl font-bold ${textMain}`}>{statistics.publishedEvents}</p>
              </div>
              <div className={`p-3 rounded-lg ${isDark ? "bg-green-500/20" : "bg-green-100"}`}>
                <svg className={`w-6 h-6 ${isDark ? "text-green-400" : "text-green-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
          <div className={`${innerCardBg} rounded-xl p-6 border ${innerBorderColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${subText}`}>Upcoming Events</p>
                <p className={`text-3xl font-bold ${textMain}`}>{statistics.upcomingEvents}</p>
              </div>
              <div className={`p-3 rounded-lg ${isDark ? "bg-blue-500/20" : "bg-blue-100"}`}>
                <svg className={`w-6 h-6 ${isDark ? "text-blue-400" : "text-blue-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className={`${innerCardBg} rounded-xl p-6 border ${innerBorderColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${subText}`}>Total Registrations</p>
                <p className={`text-3xl font-bold ${textMain}`}>{statistics.totalRegistrations}</p>
              </div>
              <div className={`p-3 rounded-lg ${isDark ? "bg-purple-500/20" : "bg-purple-100"}`}>
                <svg className={`w-6 h-6 ${isDark ? "text-purple-400" : "text-purple-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div className={`overflow-x-auto rounded-2xl shadow-2xl ${isDark ? "bg-gray-900" : "bg-white"} border ${innerBorderColor} w-full`}>
          <table className="min-w-full w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr className={isDark ? "bg-gray-800" : "bg-gray-100"}>
                <th className={`py-4 px-4 text-left font-semibold ${textMain}`}>Title</th>
                <th className={`py-4 px-4 text-left font-semibold ${textMain}`}>Type</th>
                <th className={`py-4 px-4 text-left font-semibold ${textMain}`}>Category</th>
                <th className={`py-4 px-4 text-left font-semibold ${textMain}`}>Status</th>
                <th className={`py-4 px-4 text-left font-semibold ${textMain}`}>Start Date</th>
                <th className={`py-4 px-4 text-left font-semibold ${textMain}`}>Capacity</th>
                <th className={`py-4 px-4 text-left font-semibold ${textMain}`}>Registrations</th>
                <th className={`py-4 px-4 text-center font-semibold ${textMain}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <svg className={`w-16 h-16 mx-auto mb-4 ${subText}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className={`text-xl font-semibold mb-2 ${textMain}`}>No events found</h3>
                    <p className={`text-sm ${subText} mb-4`}>
                      {searchTerm || selectedStatus || selectedCategory ? "Try adjusting your search or filter criteria." : "Create your first event to get started."}
                    </p>
                    {!searchTerm && !selectedStatus && !selectedCategory && (
                      <Link
                        to="/admin/events/create"
                        className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition ${isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-900"}`}
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create First Event
                      </Link>
                    )}
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event, idx) => {
                  const eventStatus = getEventStatus(event);
                  return (
                    <tr
                      key={event.id}
                      className={
                        idx % 2 === 0
                          ? `${isDark ? "bg-gray-900" : "bg-white"} hover:${isDark ? "bg-gray-800" : "bg-gray-100"} transition`
                          : `${isDark ? "bg-gray-800" : "bg-gray-50"} hover:${isDark ? "bg-gray-800" : "bg-gray-100"} transition`
                      }
                    >
                      <td className={`py-3 px-4 font-medium ${textMain}`}>
                        <div>
                          <div className="font-semibold">{event.title}</div>
                          <div className={`text-sm ${subText} truncate max-w-xs`}>
                            {event.shortDescription || event.description?.substring(0, 50) + '...'}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${
                          event.eventType === 'conference' ? 'bg-blue-500' :
                          event.eventType === 'workshop' ? 'bg-green-500' :
                          event.eventType === 'seminar' ? 'bg-purple-500' :
                          event.eventType === 'networking' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        }`}>
                          {event.eventType?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </td>
                      <td className={`py-3 px-4 ${subText}`}>
                        {event.category?.charAt(0).toUpperCase() + event.category?.slice(1)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                          {event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}
                        </span>
                      </td>
                      <td className={`py-3 px-4 ${subText}`}>
                        {formatDate(event.startDate)}
                      </td>
                      <td className={`py-3 px-4 ${subText}`}>
                        {event.capacity || 'Unlimited'}
                      </td>
                      <td className={`py-3 px-4 ${subText}`}>
                        {event.registrationCount || 0}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex flex-row gap-2 justify-center items-center">
                          <Link
                            to={`/admin/events/update/${event.id}`}
                            className={`inline-flex items-center gap-1 ${isDark ? "bg-white hover:bg-gray-200 text-black" : "bg-black hover:bg-gray-800 text-white"} px-3 py-1 rounded transition shadow`}
                            title="Edit"
                          >
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" />
                            </svg>
                            Edit
                          </Link>
                          <button
                            onClick={() => handlePublishToggle(event.id, event.status)}
                            className={`inline-flex items-center gap-1 ${
                              event.status === 'published'
                                ? (isDark ? "bg-yellow-600 hover:bg-yellow-700 text-white" : "bg-yellow-500 hover:bg-yellow-600 text-white")
                                : (isDark ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-500 hover:bg-green-600 text-white")
                            } px-3 py-1 rounded transition shadow`}
                            title={event.status === 'published' ? 'Unpublish' : 'Publish'}
                          >
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              {event.status === 'published' ? (
                                <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                              ) : (
                                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              )}
                            </svg>
                            {event.status === 'published' ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(event.id, event.title)}
                            className={`inline-flex items-center gap-1 ${isDark ? "bg-red-600 hover:bg-red-700 text-white" : "bg-red-500 hover:bg-red-600 text-white"} px-3 py-1 rounded transition shadow`}
                            title="Delete"
                          >
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <rect x="5" y="7" width="14" height="12" rx="2" />
                              <path d="M9 11v6M15 11v6" strokeLinecap="round" />
                              <path d="M10 7V5a2 2 0 0 1 4 0v2" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className={`text-sm ${subText}`}>
              Showing {((pagination.currentPage - 1) * pageSize) + 1} to {Math.min(pagination.currentPage * pageSize, pagination.totalCount)} of {pagination.totalCount} events
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                  pagination.hasPrevPage
                    ? `${isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-black"}`
                    : `${isDark ? "bg-gray-800 text-gray-500" : "bg-gray-100 text-gray-400"} cursor-not-allowed`
                }`}
              >
                Previous
              </button>

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

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                  pagination.hasNextPage
                    ? `${isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-black"}`
                    : `${isDark ? "bg-gray-800 text-gray-500" : "bg-gray-100 text-gray-400"} cursor-not-allowed`
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${isDark ? "bg-gray-800" : "bg-white"} border ${isDark ? "border-gray-700" : "border-gray-200"}`}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-full ${isDark ? "bg-red-500/20" : "bg-red-100"}`}>
                  <svg className={`w-6 h-6 ${isDark ? "text-red-400" : "text-red-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3M4 7h16" />
                  </svg>
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${textMain}`}>Delete Event</h3>
                  <p className={`text-sm ${subText}`}>This action cannot be undone</p>
                </div>
              </div>

              <div className={`p-4 rounded-lg mb-6 ${isDark ? "bg-red-500/10 border border-red-500/20" : "bg-red-50 border border-red-200"}`}>
                <p className={`text-sm ${textMain}`}>
                  Are you sure you want to delete <span className="font-semibold">"{deleteTarget.title}"</span>?
                </p>
                <p className={`text-xs ${subText} mt-2`}>
                  This will permanently remove the event and all associated registrations. This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCancel}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-900"}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition"
                >
                  Delete Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllEvents;