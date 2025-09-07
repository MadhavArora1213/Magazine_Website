import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import articleService from '../services/articleService';
import { toast } from 'react-toastify';

// Lazy load components for better performance
const ArticleContent = React.lazy(() => import('./Article/ArticleContent'));
const ArticleHeader = React.lazy(() => import('./Article/ArticleHeader'));
const ArticleMeta = React.lazy(() => import('./Article/ArticleMeta'));
const RelatedArticles = React.lazy(() => import('./Article/RelatedArticles'));

const ArticleRenderer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await articleService.getArticle(id);

      if (response.success) {
        setArticle(response.data);

        // Fetch related articles based on category
        if (response.data.category_id) {
          fetchRelatedArticles(response.data.category_id, response.data.id);
        }

        // Update page title and meta tags
        updateMetaTags(response.data);
      } else {
        throw new Error(response.message || 'Article not found');
      }
    } catch (err) {
      console.error('Error fetching article:', err);
      setError(err.message || 'Article not found');

      if (err.response?.status === 404) {
        toast.error('Article not found');
        navigate('/404');
      } else {
        toast.error('Failed to load article');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async (categoryId, currentArticleId) => {
    try {
      const response = await articleService.getAllArticles({
        category_id: categoryId,
        status: 'published',
        limit: 3
      });

      if (response.success) {
        // Filter out current article
        const related = response.data.articles.filter(
          art => art.id !== parseInt(currentArticleId)
        );
        setRelatedArticles(related);
      }
    } catch (err) {
      console.warn('Error fetching related articles:', err);
    }
  };

  const updateMetaTags = (articleData) => {
    // Meta tags are handled by Helmet in the render
  };

  const LoadingSkeleton = () => (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
        <div className="h-64 bg-gray-300 rounded mb-8"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );

  const ErrorDisplay = ({ message }) => (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-red-800 mb-4">Article Not Found</h2>
        <p className="text-red-600 mb-6">{message}</p>
        <button
          onClick={() => navigate('/')}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !article) {
    return <ErrorDisplay message={error || 'Article not found'} />;
  }

  // Prepare structured data for JSON-LD
  const structuredData = article.structuredData ? JSON.stringify(article.structuredData) : null;

  // Prepare images for 5-image layout
  const images = article.gallery ? JSON.parse(article.gallery) : [];
  const displayImages = [...images];

  // Ensure we have exactly 5 images (pad with featured image if needed)
  if (displayImages.length < 5 && article.featured_image) {
    while (displayImages.length < 5) {
      displayImages.push(article.featured_image);
    }
  }

  // Split content into sections for the layout
  const contentSections = article.content ? article.content.split('\n\n') : [];

  // For long-form articles, create more sophisticated content distribution
  const totalSections = contentSections.length;
  const sectionSize = Math.max(1, Math.floor(totalSections / 4));

  const contentPart1 = contentSections.slice(0, sectionSize);
  const contentPart2 = contentSections.slice(sectionSize, sectionSize * 2);
  const contentPart3 = contentSections.slice(sectionSize * 2, sectionSize * 3);
  const contentPart4 = contentSections.slice(sectionSize * 3);

  return (
    <>
      <Helmet>
        <title>{article.meta_title || article.title}</title>
        <meta name="description" content={article.meta_description || article.excerpt} />
        <meta name="keywords" content={article.tags?.join(', ')} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt || article.description} />
        <meta property="og:image" content={article.featured_image} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={article.publish_date || article.createdAt} />
        <meta property="article:author" content={article.primaryAuthor?.name} />
        <meta property="article:section" content={article.category?.name} />
        <meta property="article:tag" content={article.tags?.join(', ')} />
        <link rel="canonical" href={window.location.href} />

        {/* JSON-LD Structured Data */}
        {structuredData && (
          <script type="application/ld+json">
            {structuredData}
          </script>
        )}
      </Helmet>

      <article className="min-h-screen bg-white">
        {/* Elegant Header */}
        <header className="border-b border-gray-200 py-12 px-8 md:px-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs uppercase tracking-widest text-gray-500 font-medium">
                {article.category?.name || 'Feature Article'}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-6 leading-tight text-center">
              {article.title}
            </h1>
            {article.subtitle && (
              <p className="text-lg md:text-xl text-gray-600 font-light text-center max-w-2xl mx-auto leading-relaxed">
                {article.subtitle}
              </p>
            )}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mt-8">
              <span className="font-medium">By {article.primaryAuthor?.name}</span>
              <span>•</span>
              <span>{new Date(article.publish_date || article.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
              <span>•</span>
              <span>{Math.ceil((article.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0) / 200)} min read</span>
            </div>
          </div>
        </header>

        {/* Main Article Content */}
        <main className="px-8 md:px-16 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            <div className="mb-12">
              <img
                src={displayImages[0]}
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
              {/* Lead Paragraph with Drop Cap */}
              <div dangerouslySetInnerHTML={{
                __html: contentPart1.join('\n\n').replace(/^(<p>)/, '<p class="drop-cap">')
              }} />

              {/* Second Image */}
              <div className="my-12 text-center">
                <img
                  src={displayImages[1]}
                  alt="Article illustration"
                  className="w-full max-w-md mx-auto h-64 object-cover rounded-lg shadow-md"
                />
              </div>

              {/* Continue Content */}
              <div dangerouslySetInnerHTML={{
                __html: contentPart2.join('\n\n')
              }} />

              {/* Third Image - Full Width */}
              <div className="my-16">
                <img
                  src={displayImages[2]}
                  alt="Article feature"
                  className="w-full h-80 md:h-96 object-cover rounded-lg shadow-lg"
                />
              </div>

              {/* More Content */}
              <div dangerouslySetInnerHTML={{
                __html: contentPart3.join('\n\n')
              }} />

              {/* Fourth Image */}
              <div className="my-12 float-right ml-8 mb-4 w-64 h-48">
                <img
                  src={displayImages[3]}
                  alt="Article illustration"
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              </div>

              {/* Final Content */}
              <div dangerouslySetInnerHTML={{
                __html: contentPart4.join('\n\n')
              }} />

              {/* Fifth Image */}
              <div className="my-16 text-center clear-both">
                <img
                  src={displayImages[4]}
                  alt="Article conclusion"
                  className="w-full max-w-lg mx-auto h-64 object-cover rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </main>

        {/* Author Bio Section */}
        {article.primaryAuthor && (
          <section className="py-16 px-8 md:px-16 bg-gray-50 border-t border-gray-200">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-start gap-8">
                {article.primaryAuthor.profile_image && (
                  <img
                    src={article.primaryAuthor.profile_image}
                    alt={article.primaryAuthor.name}
                    className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                  />
                )}
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-3">About the Author</h3>
                  <h4 className="text-lg font-light text-gray-800 mb-2">{article.primaryAuthor.name}</h4>
                  {article.primaryAuthor.title && (
                    <p className="text-sm text-gray-600 mb-3">{article.primaryAuthor.title}</p>
                  )}
                  <p className="text-gray-700 leading-relaxed">
                    {article.author_bio_override || article.primaryAuthor.bio}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tags Section */}
        {article.tags && article.tags.length > 0 && (
          <section className="py-12 px-8 md:px-16 bg-white border-t border-gray-200">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap gap-3">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="py-8 px-8 md:px-16 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-gray-400">
              Published on {new Date(article.publish_date || article.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </footer>
      </article>

      <style jsx>{`
        .prose {
          color: #374151;
          font-family: 'Georgia', 'Times New Roman', serif;
          line-height: 1.7;
        }
        .prose h1, .prose h2, .prose h3 {
          color: #1f2937;
          font-weight: 400;
          font-family: 'Helvetica Neue', 'Arial', sans-serif;
          letter-spacing: -0.01em;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
        }
        .prose h2 {
          font-size: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 0.5rem;
        }
        .prose p {
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
          text-align: justify;
        }
        .prose p:first-of-type {
          font-size: 1.2rem;
          font-weight: 400;
          color: #111827;
        }
        .drop-cap::first-letter {
          float: left;
          font-size: 3.5rem;
          line-height: 1;
          margin-right: 0.2em;
          margin-top: 0.1em;
          font-weight: bold;
          color: #374151;
          font-family: 'Georgia', serif;
        }
        .prose img {
          margin: 2rem auto;
          display: block;
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </>
  );
};

export default ArticleRenderer;