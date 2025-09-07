import React, { useState, useEffect } from 'react';
import { FaUser, FaReply, FaThumbsUp, FaThumbsDown, FaFlag, FaTrash, FaEdit, FaClock, FaHeart, FaShare } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const CommentSection = ({ articleId, className = '' }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, popular
  const [showReplies, setShowReplies] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const commentsPerPage = 10;

  useEffect(() => {
    fetchComments();
  }, [articleId, sortBy, currentPage]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: commentsPerPage.toString(),
        sort: sortBy
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/public/articles/${articleId}/comments?${params}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data = await response.json();
      setComments(data.comments || []);
      setTotalComments(data.total || 0);
    } catch (err) {
      console.error('Error fetching comments:', err);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async (content, parentId = null) => {
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      return;
    }

    if (!content.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/public/articles/${articleId}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            content: content.trim(),
            parentId
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit comment');
      }

      const data = await response.json();
      
      // Add new comment to state
      if (parentId) {
        // It's a reply - update the parent comment's replies
        setComments(prev => prev.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), data.comment],
              replyCount: (comment.replyCount || 0) + 1
            };
          }
          return comment;
        }));
      } else {
        // It's a new top-level comment
        setComments(prev => [data.comment, ...prev]);
        setTotalComments(prev => prev + 1);
      }

      // Reset form
      setNewComment('');
      setReplyingTo(null);
      toast.success('Comment posted successfully!');
      
    } catch (err) {
      console.error('Error submitting comment:', err);
      toast.error('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const updateComment = async (commentId, newContent) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/public/articles/${articleId}/comments/${commentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ content: newContent.trim() })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update comment');
      }

      const data = await response.json();
      
      // Update comment in state
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, content: data.comment.content, isEdited: true };
        }
        return comment;
      }));

      setEditingComment(null);
      toast.success('Comment updated successfully!');
      
    } catch (err) {
      console.error('Error updating comment:', err);
      toast.error('Failed to update comment');
    }
  };

  const deleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/public/articles/${articleId}/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      // Remove comment from state
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      setTotalComments(prev => prev - 1);
      toast.success('Comment deleted successfully!');
      
    } catch (err) {
      console.error('Error deleting comment:', err);
      toast.error('Failed to delete comment');
    }
  };

  const voteComment = async (commentId, voteType) => {
    if (!isAuthenticated) {
      toast.error('Please login to vote');
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/public/comments/${commentId}/vote`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ voteType })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to vote');
      }

      const data = await response.json();
      
      // Update comment votes in state
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            upvotes: data.upvotes,
            downvotes: data.downvotes,
            userVote: data.userVote
          };
        }
        return comment;
      }));
      
    } catch (err) {
      console.error('Error voting:', err);
      toast.error('Failed to vote');
    }
  };

  const reportComment = async (commentId, reason) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/public/comments/${commentId}/report`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ reason })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to report comment');
      }

      toast.success('Comment reported successfully');
    } catch (err) {
      console.error('Error reporting comment:', err);
      toast.error('Failed to report comment');
    }
  };

  const toggleReplies = (commentId) => {
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CommentForm = ({ onSubmit, placeholder, initialValue = '', submitLabel = 'Post Comment' }) => {
    const [content, setContent] = useState(initialValue);
    
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(content);
      setContent('');
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          required
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {content.length}/500 characters
          </span>
          <div className="flex gap-2">
            {initialValue && (
              <button
                type="button"
                onClick={() => {
                  setContent('');
                  setEditingComment(null);
                  setReplyingTo(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!content.trim() || submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Posting...' : submitLabel}
            </button>
          </div>
        </div>
      </form>
    );
  };

  const Comment = ({ comment, isReply = false }) => (
    <div className={`${isReply ? 'ml-8 pt-4' : 'py-4'} ${!isReply ? 'border-b border-gray-200' : ''}`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {comment.author?.avatar ? (
            <img
              src={comment.author.avatar}
              alt={comment.author.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <FaUser className="w-4 h-4 text-gray-600" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Comment Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-gray-900">
              {comment.author?.name || 'Anonymous'}
            </span>
            {comment.author?.verified && (
              <span className="text-blue-500 text-sm">✓</span>
            )}
            <span className="text-gray-500 text-sm flex items-center gap-1">
              <FaClock className="w-3 h-3" />
              {formatDate(comment.createdAt)}
            </span>
            {comment.isEdited && (
              <span className="text-gray-400 text-sm">(edited)</span>
            )}
          </div>

          {/* Comment Content */}
          {editingComment === comment.id ? (
            <CommentForm
              onSubmit={(content) => updateComment(comment.id, content)}
              placeholder="Edit your comment..."
              initialValue={comment.content}
              submitLabel="Update Comment"
            />
          ) : (
            <div className="mb-3">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          )}

          {/* Comment Actions */}
          {editingComment !== comment.id && (
            <div className="flex items-center gap-4">
              {/* Voting */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => voteComment(comment.id, 'up')}
                  className={`flex items-center gap-1 text-sm transition-colors ${
                    comment.userVote === 'up'
                      ? 'text-green-600'
                      : 'text-gray-500 hover:text-green-600'
                  }`}
                >
                  <FaThumbsUp className="w-3 h-3" />
                  <span>{comment.upvotes || 0}</span>
                </button>
                
                <button
                  onClick={() => voteComment(comment.id, 'down')}
                  className={`flex items-center gap-1 text-sm transition-colors ${
                    comment.userVote === 'down'
                      ? 'text-red-600'
                      : 'text-gray-500 hover:text-red-600'
                  }`}
                >
                  <FaThumbsDown className="w-3 h-3" />
                  <span>{comment.downvotes || 0}</span>
                </button>
              </div>

              {/* Reply */}
              {!isReply && (
                <button
                  onClick={() => setReplyingTo(comment.id)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <FaReply className="w-3 h-3" />
                  Reply
                </button>
              )}

              {/* Edit/Delete (own comments) */}
              {user && user.id === comment.author?.id && (
                <>
                  <button
                    onClick={() => setEditingComment(comment.id)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <FaEdit className="w-3 h-3" />
                    Edit
                  </button>
                  
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <FaTrash className="w-3 h-3" />
                    Delete
                  </button>
                </>
              )}

              {/* Report */}
              {user && user.id !== comment.author?.id && (
                <button
                  onClick={() => reportComment(comment.id, 'inappropriate')}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                  <FaFlag className="w-3 h-3" />
                  Report
                </button>
              )}
            </div>
          )}

          {/* Reply Form */}
          {replyingTo === comment.id && (
            <div className="mt-4">
              <CommentForm
                onSubmit={(content) => submitComment(content, comment.id)}
                placeholder={`Reply to ${comment.author?.name}...`}
                submitLabel="Post Reply"
              />
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4">
              <button
                onClick={() => toggleReplies(comment.id)}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors mb-3"
              >
                {showReplies[comment.id] 
                  ? `Hide ${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}`
                  : `Show ${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}`
                }
              </button>
              
              {showReplies[comment.id] && (
                <div className="space-y-4">
                  {comment.replies.map(reply => (
                    <Comment key={reply.id} comment={reply} isReply={true} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const totalPages = Math.ceil(totalComments / commentsPerPage);

  return (
    <div className={`bg-white rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          Comments ({totalComments})
        </h3>
        
        {/* Sort Options */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* Comment Form */}
      {isAuthenticated ? (
        <div className="mb-8">
          <CommentForm
            onSubmit={(content) => submitComment(content)}
            placeholder="Share your thoughts..."
          />
        </div>
      ) : (
        <div className="mb-8 text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">Please login to join the conversation</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Login to Comment
          </button>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex gap-3 py-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <>
          <div className="space-y-0">
            {comments.map(comment => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl text-gray-300 mb-4">💬</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h3>
          <p className="text-gray-500">Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;