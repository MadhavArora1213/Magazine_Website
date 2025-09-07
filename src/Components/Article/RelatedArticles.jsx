import React from 'react';
import { Link } from 'react-router-dom';

const RelatedArticles = ({ articles }) => {
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Article Image */}
            {article.featured_image && (
              <div className="h-48 overflow-hidden">
                <img
                  src={article.featured_image}
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="p-6">
              {/* Category */}
              {article.category && (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mb-2">
                  {article.category.name}
                </span>
              )}

              {/* Title */}
              <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                <Link
                  to={`/article/${article.id}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {article.title}
                </Link>
              </h4>

              {/* Excerpt */}
              {article.excerpt && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
              )}

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{article.primaryAuthor?.name || 'Unknown Author'}</span>
                <time dateTime={article.publish_date || article.createdAt}>
                  {new Date(article.publish_date || article.createdAt).toLocaleDateString()}
                </time>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;