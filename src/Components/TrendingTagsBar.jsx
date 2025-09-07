import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const TrendingTagsBar = () => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const base = import.meta?.env?.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${base}/api/articles/tags` , { headers: { 'Authorization': '' } });
        const json = await res.json();
        const list = (json.tags || json || []).slice(0, 12).map(t => ({ slug: t.slug, name: t.name }));
        setTags(list);
      } catch (e) {
        setTags([]);
      }
    };
    load();
  }, []);

  if (tags.length === 0) return null;

  return (
    <div className="bg-gray-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-2 items-center">
        <span className="text-sm text-gray-600">Trending tags:</span>
        {tags.map(t => (
          <Link key={t.slug} to={`/tag/${t.slug}`} className="px-2 py-1 text-sm bg-white border border-gray-200 rounded hover:border-blue-400 hover:text-blue-600">#{t.name}</Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingTagsBar;

