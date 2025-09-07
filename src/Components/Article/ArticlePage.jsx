import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaEnvelope, FaPrint, FaDownload, FaBookmark, FaEye, FaCalendar, FaClock, FaTag, FaUser } from 'react-icons/fa';
import AuthorByline from './AuthorByline';
import ShareButtons from './ShareButtons';
import RelatedArticles from './RelatedArticles';
import CommentSection from './CommentSection';
import ReadingProgress from './ReadingProgress';
import PrintVersion from './PrintVersion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { userActivityTracker } from '../../utils/userActivityTracker';

const ArticlePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [shareCount, setShareCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [readingStartTime, setReadingStartTime] = useState(null);
  const articleRef = useRef(null);

  useEffect(() => {
    fetchArticle();
    trackView();

    // Start reading timer for authenticated users
    if (user) {
      setReadingStartTime(Date.now());
    }

    // Track reading when user leaves the page
    const handleBeforeUnload = () => {
      if (user && article && readingStartTime) {
        const readingTime = Math.round((Date.now() - readingStartTime) / 1000 / 60); // in minutes
        userActivityTracker.trackArticleRead(user.id, article.id, article.title, readingTime);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Track reading time when component unmounts
      if (user && article && readingStartTime) {
        const readingTime = Math.round((Date.now() - readingStartTime) / 1000 / 60);
        userActivityTracker.trackArticleRead(user.id, article.id, article.title, readingTime);
      }
    };
  }, [slug, user, article]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/public/articles/${slug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Article not found');
        } else {
          throw new Error('Failed to fetch article');
        }
        return;
      }

      const data = await response.json();
      setArticle(data.article);
      setShareCount(data.article.shareCount || 0);
      setViewCount(data.article.viewCount || 0);

      // Check if article is saved using the new tracking system
      if (user) {
        setIsBookmarked(userActivityTracker.isArticleSaved(user.id, data.article.id));
      } else {
        // Fallback for non-authenticated users
        const bookmarks = JSON.parse(localStorage.getItem('bookmarkedArticles') || '[]');
        setIsBookmarked(bookmarks.includes(data.article.id));
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching article:', err);
    } finally {
      setLoading(false);
    }
  };

  const trackView = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/public/articles/${slug}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          timestamp: new Date().toISOString()
        })
      });
    } catch (err) {
      console.error('Error tracking view:', err);
    }
  };

  const handleShare = async (platform) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/public/articles/${article.id}/share-count`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ platform })
      });
      
      setShareCount(prev => prev + 1);
      toast.success(`Shared on ${platform}!`);
    } catch (err) {
      console.error('Error updating share count:', err);
    }
  };

  const handleBookmark = () => {
    if (!user) {
      // Fallback for non-authenticated users
      const bookmarks = JSON.parse(localStorage.getItem('bookmarkedArticles') || '[]');

      if (isBookmarked) {
        const updatedBookmarks = bookmarks.filter(id => id !== article.id);
        localStorage.setItem('bookmarkedArticles', JSON.stringify(updatedBookmarks));
        setIsBookmarked(false);
        toast.success('Removed from bookmarks');
      } else {
        bookmarks.push(article.id);
        localStorage.setItem('bookmarkedArticles', JSON.stringify(bookmarks));
        setIsBookmarked(true);
        toast.success('Added to bookmarks');
      }
    } else {
      // Use the new tracking system for authenticated users
      if (isBookmarked) {
        userActivityTracker.trackArticleSave(user.id, article.id, article.title, false);
        setIsBookmarked(false);
        toast.success('Removed from saved articles');
      } else {
        userActivityTracker.trackArticleSave(user.id, article.id, article.title, true);
        setIsBookmarked(true);
        toast.success('Added to saved articles');
      }
    }
  };

  const handlePrint = () => {
    setShowPrintModal(true);
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/public/articles/${article.id}/pdf`);
      if (!response.ok) throw new Error('Failed to generate PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${article.slug}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded successfully!');
    } catch (err) {
      toast.error('Failed to download PDF');
      console.error('Error downloading PDF:', err);
    }
  };

  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="w-full h-96 bg-gray-300 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-gray-400 mb-4">📄</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Article Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (!article) return null;

  return (
    <>
      <ReadingProgress />
      
      <div className="min-h-screen bg-white" ref={articleRef}>
        {/* Hero Section */}
        <div className="relative h-96 md:h-[500px] bg-gray-900 overflow-hidden">
          {article.featuredImage && (
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover opacity-80"
            />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
            <div className="container mx-auto px-4 pb-8">
              <div className="max-w-4xl">
                {article.category && (
                  <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                    {article.category.name}
                  </span>
                )}
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  {article.title}
                </h1>
                {article.subtitle && (
                  <p className="text-xl text-gray-200 mb-6 max-w-3xl">
                    {article.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b">
              <div className="flex items-center gap-2 text-gray-600">
                <FaCalendar className="text-sm" />
                <span>{formatDate(article.publishedAt || article.createdAt)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <FaClock className="text-sm" />
                <span>{calculateReadingTime(article.content)} min read</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <FaEye className="text-sm" />
                <span>{viewCount.toLocaleString()} views</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 ml-auto">
                <button
                  onClick={handleBookmark}
                  className={`p-2 rounded-full transition-colors ${
                    isBookmarked 
                      ? 'bg-yellow-100 text-yellow-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
                >
                  <FaBookmark />
                </button>
                
                <button
                  onClick={handlePrint}
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  title="Print article"
                >
                  <FaPrint />
                </button>
                
                <button
                  onClick={handleDownloadPDF}
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  title="Download PDF"
                >
                  <FaDownload />
                </button>
              </div>
            </div>

            {/* Author Byline */}
            {article.author && (
              <AuthorByline author={article.author} publishedAt={article.publishedAt} />
            )}

            {/* Share Buttons */}
            <ShareButtons 
              article={article}
              shareCount={shareCount}
              onShare={handleShare}
            />

            {/* Article Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <div 
                dangerouslySetInnerHTML={{ __html: article.content }}
                className="article-content leading-relaxed"
              />
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaTag className="text-gray-500" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => navigate(`/tags/${tag.slug}`)}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-100 transition-colors"
                    >
                      #{tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio */}
            {article.author && article.author.bio && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <div className="flex items-start gap-4">
                  {article.author.avatar && (
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">About {article.author.name}</h3>
                    <p className="text-gray-600 leading-relaxed mb-3">{article.author.bio}</p>
                    
                    {/* Author Social Links */}
                    {(article.author.socialLinks) && (
                      <div className="flex gap-3">
                        {article.author.socialLinks.twitter && (
                          <a
                            href={article.author.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600"
                          >
                            <FaTwitter />
                          </a>
                        )}
                        {article.author.socialLinks.linkedin && (
                          <a
                            href={article.author.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 hover:text-blue-800"
                          >
                            <FaLinkedin />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
              <p className="text-blue-100 mb-6">
                Subscribe to our newsletter and get the latest articles delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Related Articles */}
            <RelatedArticles articleId={article.id} categoryId={article.category?.id} />

            {/* Comments Section */}
            <CommentSection articleId={article.id} />
          </div>
        </div>
      </div>

      {/* Print Modal */}
      {showPrintModal && (
        <PrintVersion 
          article={article} 
          onClose={() => setShowPrintModal(false)} 
        />
      )}
    </>
  );
};

export default ArticlePage;