import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const FeaturedGrid = () => {
  const [items, setItems] = useState([]);

  // Dummy articles for when database is empty
  const dummyArticles = [
    {
      id: 'dummy-1',
      title: 'The Future of Technology: AI and Innovation',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Technology',
      slug: 'future-technology-ai-innovation'
    },
    {
      id: 'dummy-2',
      title: 'Business Leaders Share Their Success Stories',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Business',
      slug: 'business-leaders-success-stories'
    },
    {
      id: 'dummy-3',
      title: 'Lifestyle Trends That Are Changing the World',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Lifestyle',
      slug: 'lifestyle-trends-changing-world'
    },
    {
      id: 'dummy-4',
      title: 'Cultural Movements and Social Impact',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Culture & Society',
      slug: 'cultural-movements-social-impact'
    },
    {
      id: 'dummy-5',
      title: 'Entertainment Industry: Behind the Scenes',
      image: 'https://images.unsplash.com/photo-1489599511714-7b1be02e3e42?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Entertainment',
      slug: 'entertainment-industry-behind-scenes'
    },
    {
      id: 'dummy-6',
      title: 'Regional Focus: Dubai and UAE Development',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Regional Focus',
      slug: 'dubai-uae-development'
    },
    {
      id: 'dummy-7',
      title: 'Health and Wellness: Modern Approaches',
      image: 'https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Lifestyle',
      slug: 'health-wellness-modern-approaches'
    },
    {
      id: 'dummy-8',
      title: 'Special Features: Innovation Awards 2025',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Special Sections',
      slug: 'innovation-awards-2025'
    }
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const base = import.meta?.env?.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${base}/api/public/homepage`);
        const json = await res.json();
        const list = (json.featured || []).slice(0, 8).map(a => ({
          id: a.id,
          title: a.title,
          image: a.featuredImage || '',
          category: a.category?.name || '',
          slug: a.slug
        }));
        
        // Use dummy data if no featured articles found
        setItems(list.length > 0 ? list : dummyArticles);
      } catch (e) {
        // Use dummy data on error
        setItems(dummyArticles);
      }
    };
    load();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Featured Articles</h2>
        <Link to="/featured" className="text-blue-600 hover:text-blue-800">View All</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(a => (
          <article key={a.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow">
            <Link to={`/article/${a.slug}`}>
              <img src={a.image} alt={a.title} className="w-full h-44 object-cover" />
              <div className="p-4">
                <span className="inline-block mb-2 px-2 py-1 text-xs bg-blue-600 text-white rounded">{a.category}</span>
                <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{a.title}</h3>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default FeaturedGrid;

