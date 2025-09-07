import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const [heroStories, setHeroStories] = useState([]);

  // Dummy content for when database is empty
  const dummyHeroStories = [
    {
      id: 'dummy-1',
      title: 'Latest Tech Innovations Reshaping the Future',
      excerpt: 'Discover how cutting-edge technology is transforming industries and creating new opportunities for innovation across the globe.',
      category: 'Technology',
      author: 'Magazine Editorial Team',
      publishedAt: new Date().toISOString(),
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      slug: 'tech-innovations-future',
      trending: true
    },
    {
      id: 'dummy-2',
      title: 'Business Leaders Share Success Strategies',
      excerpt: 'Exclusive interviews with top entrepreneurs and business leaders about their journey to success and key lessons learned.',
      category: 'Business',
      author: 'Business Desk',
      publishedAt: new Date().toISOString(),
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      slug: 'business-leaders-success-strategies',
      trending: false
    }
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const base = import.meta?.env?.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${base}/api/public/homepage`);
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          throw new Error('Unexpected response type');
        }
        const json = await res.json();
        const list = (json.featured || []).map((a) => ({
          id: a.id,
          title: a.title,
          excerpt: a.summary || '',
          category: a.category?.name || '',
          subcategory: '',
          author: a.author?.name || '',
          publishedAt: a.publishedAt || a.publishDate || a.createdAt,
          readTime: a.readTime || '',
          image: a.featuredImage || a.coverImage || '',
          slug: a.slug
        }));
        
        // Use dummy data if no featured articles found
        setHeroStories(list.length > 0 ? list : dummyHeroStories);
      } catch (e) {
        console.error('HeroSlider fetch failed', e);
        // Use dummy data on error
        setHeroStories(dummyHeroStories);
      }
    };
    load();
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying || heroStories.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroStories.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, heroStories.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + heroStories.length) % heroStories.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroStories.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Always show content - dummy data will be used if no real data
  if (heroStories.length === 0) {
    return (
      <section className="relative h-[70vh] lg:h-[80vh] overflow-hidden bg-gray-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </section>
    );
  }

  const currentStory = heroStories[currentSlide] || heroStories[0];

  return (
    <section className="relative h-[70vh] lg:h-[80vh] overflow-hidden bg-gray-900">
      {/* Background Slides */}
      <div className="relative w-full h-full">
        {heroStories.map((story, index) => (
          <div
            key={story.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: story.image
                  ? `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url(${story.image})`
                  : 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3))'
              }}
            />
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-3xl">
            {/* Story Content */}
            <div className="text-white space-y-4">
              {/* Category Badge */}
              <div className="flex items-center space-x-3 mb-4">
                {currentStory?.category && (
                  <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {currentStory.category}
                  </span>
                )}
                {currentStory?.trending && (
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                    <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                    TRENDING
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-4">
                {currentStory?.title || 'Featured Article'}
              </h1>

              {/* Excerpt */}
              <p className="text-lg lg:text-xl text-gray-200 leading-relaxed mb-6 max-w-2xl">
                {currentStory?.excerpt || 'Discover the latest stories and insights from our magazine.'}
              </p>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-300 mb-8">
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>By {currentStory?.author || 'Editorial Team'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{currentStory?.publishedAt ? formatDate(currentStory.publishedAt) : formatDate(new Date())}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{currentStory?.readTime || '5 min read'}</span>
                </div>
              </div>

              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Link
                  to={`/article/${currentStory?.slug || 'featured-article'}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 text-center"
                >
                  Read Full Story
                </Link>
                <button className="border border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-y-0 left-4 flex items-center">
        <button
          onClick={goToPrevious}
          className="w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
          aria-label="Previous slide"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="absolute inset-y-0 right-4 flex items-center">
        <button
          onClick={goToNext}
          className="w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
          aria-label="Next slide"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {heroStories.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentSlide
                  ? 'bg-white'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-30">
        <div 
          className="h-full bg-blue-600 transition-all duration-1000 ease-linear"
          style={{ 
            width: isAutoPlaying ? '100%' : `${((currentSlide + 1) / heroStories.length) * 100}%`
          }}
        />
      </div>

      {/* Side Story Preview */}
      <div className="absolute top-4 right-4 hidden lg:block">
        <div className="bg-black bg-opacity-70 backdrop-blur-sm rounded-lg p-4 max-w-sm">
          <h3 className="text-white text-sm font-medium mb-2">Coming Up Next</h3>
          {heroStories.length > 1 && heroStories[(currentSlide + 1) % heroStories.length] && (
            <div className="text-white">
              <div className="text-xs text-blue-400 mb-1">
                {heroStories[(currentSlide + 1) % heroStories.length]?.category || 'Featured'}
              </div>
              <h4 className="text-sm font-medium line-clamp-2">
                {heroStories[(currentSlide + 1) % heroStories.length]?.title || 'Next Article'}
              </h4>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;