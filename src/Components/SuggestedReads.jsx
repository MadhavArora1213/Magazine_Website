import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

// Simple client-side suggestion heuristic using localStorage of last viewed categories/tags
const SuggestedReads = () => {
  const [items, setItems] = useState([]);

  // Dummy suggested reads for when database is empty
  const dummySuggestedReads = [
    {
      id: 'suggested-1',
      title: 'Top 10 Business Strategies for 2025',
      slug: 'top-business-strategies-2025',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Business',
      score: 5
    },
    {
      id: 'suggested-2',
      title: 'Latest Fashion Trends from Dubai Fashion Week',
      slug: 'dubai-fashion-week-trends',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Lifestyle',
      score: 4
    },
    {
      id: 'suggested-3',
      title: 'Technology Innovations Changing Healthcare',
      slug: 'tech-innovations-healthcare',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Technology',
      score: 4
    },
    {
      id: 'suggested-4',
      title: 'Cultural Festivals Around the UAE',
      slug: 'cultural-festivals-uae',
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Culture & Society',
      score: 3
    },
    {
      id: 'suggested-5',
      title: 'Celebrity Interview: Behind the Success',
      slug: 'celebrity-interview-success',
      image: 'https://images.unsplash.com/photo-1594736797933-d0d8e67b5b84?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Entertainment',
      score: 3
    },
    {
      id: 'suggested-6',
      title: 'Regional Development Projects in the Middle East',
      slug: 'regional-development-middle-east',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Regional Focus',
      score: 2
    }
  ];

  const interest = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('reader_interest') || '{}');
    } catch {
      return {};
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const base = import.meta?.env?.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${base}/api/public/homepage`);
        const json = await res.json();
        const pool = [ ...(json.featured || []), ...Object.values(json.sections || {}).flat() ];
        const scored = pool.map(a => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
          image: a.featuredImage || '',
          category: a.category?.name || '',
          score: (interest[a.category?.name] || 0) + (a.tags || []).reduce((s,t)=> s + (interest[`tag:${t.name}`]||0), 0)
        }))
        .sort((a,b) => b.score - a.score)
        .slice(0, 6);
        
        // Use dummy data if no articles found
        setItems(scored.length > 0 ? scored : dummySuggestedReads);
      } catch (e) {
        // Use dummy data on error
        setItems(dummySuggestedReads);
      }
    };
    load();
  }, [interest]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Suggested Reads For You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(a => (
          <Link key={a.id} to={`/article/${a.slug}`} className="flex gap-4 bg-white border border-gray-200 rounded-lg p-3 hover:shadow">
            <img src={a.image} alt={a.title} className="w-28 h-20 object-cover rounded" />
            <div>
              <span className="block text-xs text-blue-600 mb-1">{a.category}</span>
              <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{a.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SuggestedReads;

