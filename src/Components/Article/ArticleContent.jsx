import React from 'react';

const ArticleContent = ({ article }) => {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Excerpt */}
      {article.excerpt && (
        <div className="text-xl text-gray-700 font-light leading-relaxed mb-8 border-l-4 border-blue-500 pl-6 italic">
          {article.excerpt}
        </div>
      )}

      {/* Main Content */}
      <div
        className="article-content text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Author Bio */}
      {article.primaryAuthor && (article.primaryAuthor.bio || article.author_bio_override) && (
        <div className="mt-12 p-6 bg-gray-50 rounded-lg border">
          <div className="flex items-start gap-4">
            {article.primaryAuthor.profile_image && (
              <img
                src={article.primaryAuthor.profile_image}
                alt={article.primaryAuthor.name}
                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
              />
            )}
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                About {article.primaryAuthor.name}
              </h3>
              <p className="text-gray-700">
                {article.author_bio_override || article.primaryAuthor.bio}
              </p>
              {article.primaryAuthor.title && (
                <p className="text-sm text-gray-600 mt-2 font-medium">
                  {article.primaryAuthor.title}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Article Stats */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>👁️ {article.view_count || 0} views</span>
            <span>❤️ {article.like_count || 0} likes</span>
            <span>💬 {article.comment_count || 0} comments</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📅 Updated {new Date(article.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleContent;