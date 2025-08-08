import React from 'react';
import { Link } from 'react-router-dom';

const COLORS = {
  white: '#ffffff',
  blue: '#162048',
  black: '#1a1a1a'
};

const HomePage = () => {
  // Sample data for posts with real images
  const featuredPosts = [
    {
      id: 1,
      title: 'The Future of Artificial Intelligence in Everyday Life',
      category: 'Technology',
      author: 'John Doe',
      date: 'August 4, 2023',
      image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
      excerpt: 'How AI is transforming our daily lives and what to expect in the coming years.'
    },
    {
      id: 2,
      title: 'Top 10 Travel Destinations for 2023',
      category: 'Travel',
      author: 'Jane Smith',
      date: 'August 2, 2023',
      image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
      excerpt: 'Explore the most beautiful and exciting places to visit this year.'
    },
    {
      id: 3,
      title: 'Healthy Eating Habits for Busy Professionals',
      category: 'Lifestyle',
      author: 'Mark Wilson',
      date: 'July 29, 2023',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
      excerpt: 'Simple ways to maintain a balanced diet despite your hectic schedule.'
    }
  ];

  const trendingPosts = [
    {
      id: 10,
      title: 'Cryptocurrency Trends to Watch in 2023',
      category: 'Finance',
      date: 'July 30, 2023',
      image: 'https://images.unsplash.com/photo-1625217527288-3204044c0c04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      views: '24.5K'
    },
    {
      id: 11,
      title: 'How Remote Work is Reshaping Urban Centers',
      category: 'Business',
      date: 'July 28, 2023',
      image: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      views: '18.2K'
    },
    {
      id: 12,
      title: 'The Rise of Plant-Based Diets: Health and Environmental Impact',
      category: 'Health',
      date: 'July 27, 2023',
      image: 'https://images.unsplash.com/photo-1540914124281-342587941389?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      views: '16.8K'
    },
    {
      id: 13,
      title: 'Smart Home Technology: Convenience vs Privacy Concerns',
      category: 'Technology',
      date: 'July 26, 2023',
      image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      views: '15.3K'
    }
  ];

  const latestNews = [
    {
      id: 4,
      title: 'The Rise of Sustainable Fashion',
      category: 'Lifestyle',
      date: 'July 28, 2023',
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 5,
      title: 'How Blockchain is Changing Finance',
      category: 'Business',
      date: 'July 27, 2023',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 6,
      title: 'The Psychology of Color in Marketing',
      category: 'Business',
      date: 'July 26, 2023',
      image: 'https://images.unsplash.com/photo-1580554530778-ca36943938b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 7,
      title: 'Best Smartphones of 2023',
      category: 'Technology',
      date: 'July 25, 2023',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02ff9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 8,
      title: 'The Benefits of Mindfulness Meditation',
      category: 'Health',
      date: 'July 24, 2023',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 9,
      title: 'Upcoming Movies to Watch This Summer',
      category: 'Entertainment',
      date: 'July 23, 2023',
      image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    }
  ];

  const popularPosts = [
    {
      id: 14,
      title: 'Climate Change: How Individual Actions Make a Difference',
      category: 'Environment',
      date: 'July 20, 2023',
      image: 'https://placehold.co/500x300',
      views: '38.2K'
    },
    {
      id: 15,
      title: 'The Science Behind Productivity: Work Smarter Not Harder',
      category: 'Lifestyle',
      date: 'July 18, 2023',
      image: 'https://placehold.co/500x300',
      views: '35.7K'
    },
    {
      id: 16,
      title: 'Financial Freedom: Steps to Achieve Independence',
      category: 'Finance',
      date: 'July 15, 2023',
      image: 'https://placehold.co/500x300',
      views: '32.1K'
    }
  ];

  const categories = [
    {
      name: 'Technology',
      count: 24,
      icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      name: 'Lifestyle',
      count: 18,
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      color: 'bg-green-100 text-green-600'
    },
    {
      name: 'Travel',
      count: 12,
      icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      name: 'Business',
      count: 15,
      icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      name: 'Health',
      count: 9,
      icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      color: 'bg-red-100 text-red-600'
    },
    {
      name: 'Entertainment',
      count: 21,
      icon: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z',
      color: 'bg-indigo-100 text-indigo-600'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center min-h-[400px] flex items-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1470723710355-95304d8aece4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-2xl w-full bg-[#162048]/80 rounded-xl p-6 sm:p-10 shadow-xl">
            <span className="bg-[#162048] text-white px-4 py-1 text-md font-bold rounded block w-fit mb-4 shadow">
              Featured
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white mt-2 leading-tight break-words drop-shadow">
              The Impact of Climate Change on Global Economies
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 mt-4 break-words">
              A comprehensive look at how climate change is affecting economic systems worldwide and what governments are doing about it.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                alt="Author"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-4 border-[#162048] shadow"
              />
              <div>
                <span className="text-white font-bold text-base sm:text-xl block">Alex Johnson</span>
                <div className="flex items-center text-white text-sm sm:text-md">
                  <span>August 5, 2023</span>
                  <span className="mx-2">•</span>
                  <span>8 min read</span>
                </div>
              </div>
            </div>
            <Link
              to="/article/1"
              className="mt-6 inline-block bg-white text-[#162048] px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-xl font-bold rounded-md border-2 border-[#162048] hover:bg-[#162048] hover:text-white transition-colors shadow"
            >
              Read Article
            </Link>
          </div>
        </div>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-3">
          {[1, 2, 3].map((index) => (
            <button
              key={index}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white ${
                index === 1 ? "bg-[#162048] border-[#162048]" : "bg-transparent"
              }`}
              aria-label={`Go to slide ${index}`}
            ></button>
          ))}
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 border-b-8 border-[#1a1a1a] bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b-4 border-[#162048] pb-4">
            <h2 className="text-3xl md:text-4xl font-extrabold flex items-center text-[#162048]">
              <span className="w-10 h-1 bg-[#162048] inline-block mr-4 rounded"></span>
              Latest News
            </h2>
            <Link to="/category/news" className="text-[#162048] hover:text-[#1a1a1a] font-bold text-lg md:text-xl flex items-center">
              View All
              <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestNews.slice(0, 6).map((post, index) => (
              <div key={post.id} className="bg-white border-2 border-[#162048] rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Link to={`/article/${post.id}`}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-56 object-cover"
                    />
                  </Link>
                  <span className="absolute top-4 left-4 bg-[#162048] text-white px-3 py-1 text-sm font-bold rounded shadow">
                    {post.category}
                  </span>
                </div>
                <div className="p-6">
                  <Link to={`/article/${post.id}`}>
                    <h3 className="font-extrabold text-xl hover:text-[#162048] transition-colors text-[#1a1a1a]">{post.title}</h3>
                  </Link>
                  <div className="mt-4 flex items-center text-[#162048] font-bold">
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16 bg-[#162048] text-white border-b-8 border-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b-4 border-white pb-4">
            <h2 className="text-3xl md:text-4xl font-extrabold flex items-center">
              <span className="w-10 h-1 bg-white inline-block mr-4 rounded"></span>
              Trending Now
            </h2>
            <Link to="/trending" className="text-white hover:text-[#1a1a1a] font-bold text-lg md:text-xl flex items-center">
              View All
              <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingPosts.map(post => (
              <div key={post.id} className="bg-[#1a1a1a] rounded-xl overflow-hidden border-2 border-white hover:border-[#162048] transition-colors">
                <div className="relative">
                  <Link to={`/article/${post.id}`}>
                    <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                  </Link>
                  <span className="absolute top-4 left-4 bg-[#162048] text-white px-3 py-1 text-sm font-bold rounded shadow">
                    {post.category}
                  </span>
                  <div className="absolute bottom-4 right-4 bg-[#162048] bg-opacity-80 text-white px-3 py-1 text-sm rounded flex items-center font-bold">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    {post.views}
                  </div>
                </div>
                <div className="p-6">
                  <Link to={`/article/${post.id}`}>
                    <h3 className="font-bold text-lg hover:text-white transition-colors">{post.title}</h3>
                  </Link>
                  <div className="mt-4 flex items-center text-gray-300 font-bold">
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 border-b-8 border-[#1a1a1a] bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-[#162048]">Discover Categories</h2>
            <p className="text-[#162048] max-w-2xl mx-auto text-lg font-bold">
              Explore our diverse range of categories covering everything from technology and lifestyle to business and entertainment.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/category/${category.name.toLowerCase()}`}
                className="bg-white border-2 border-[#162048] rounded-xl p-6 hover:bg-[#162048] hover:text-white text-center transition-all hover:-translate-y-2 flex flex-col items-center shadow"
              >
                <div className="w-16 h-16 bg-[#162048] text-white rounded-md flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={category.icon}></path>
                  </svg>
                </div>
                <h3 className="font-extrabold text-lg mb-2">{category.name}</h3>
                <p className="text-[#162048] font-bold">{category.count} Articles</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-16 bg-white border-b-8 border-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b-4 border-[#162048] pb-4">
            <h2 className="text-3xl md:text-4xl font-extrabold flex items-center text-[#162048]">
              <span className="w-10 h-1 bg-[#162048] inline-block mr-4 rounded"></span>
              Featured Posts
            </h2>
            <Link to="/featured" className="text-[#162048] hover:text-[#1a1a1a] font-bold text-lg md:text-xl flex items-center">
              View All
              <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPosts.map(post => (
              <div key={post.id} className="bg-white border-2 border-[#162048] rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Link to={`/article/${post.id}`}>
                    <img src={post.image} alt={post.title} className="w-full h-56 object-cover" />
                  </Link>
                  <span className="absolute top-4 left-4 bg-[#162048] text-white px-3 py-1 text-sm font-bold rounded shadow">
                    {post.category}
                  </span>
                </div>
                <div className="p-6">
                  <Link to={`/article/${post.id}`}>
                    <h3 className="font-extrabold text-lg hover:text-[#162048] transition-colors text-[#1a1a1a]">{post.title}</h3>
                  </Link>
                  <p className="text-[#162048] mt-4 font-bold">{post.excerpt}</p>
                  <div className="mt-6 flex items-center">
                    <img src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt={post.author} className="w-10 h-10 rounded-full border-2 border-[#162048]" />
                    <div className="ml-4">
                      <span className="text-[#162048] font-bold">{post.author}</span>
                      <div className="text-[#162048] font-bold">
                        {post.date}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-[#162048] text-white border-b-8 border-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-center">Get Weekly Newsletter</h2>
            <form className="flex flex-col md:flex-row w-full mb-8">
              <input
                type="email"
                placeholder="Your Email *"
                className="flex-1 px-6 py-4 rounded-l-full rounded-r-none bg-white text-[#162048] text-lg outline-none border-none mb-4 md:mb-0"
                required
              />
              <button
                type="submit"
                className="bg-[#1a1a1a] text-white font-bold px-10 py-4 rounded-r-full rounded-l-none text-lg hover:bg-[#162048] transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="text-gray-300 text-center text-md">
              By subscribing, you agree to our <Link to="/privacy-policy" className="text-white underline font-bold">Privacy Policy</Link> and consent to receive updates from our team.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-16 bg-[#ffffff] border-b-8 border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Quick Links */}
            <div className="md:col-span-1">
              <h3 className="text-2xl font-extrabold mb-8 flex items-center">
                <span className="w-10 h-1 bg-[#162048] inline-block mr-4 rounded"></span>
                <span className="text-[#1a1a1a]">Quick Links</span>
              </h3>
              <ul className="space-y-6">
                <li>
                  <Link to="/" className="text-[#162048] hover:text-[#1a1a1a] flex items-center text-lg font-medium">
                    <span className="mr-3 text-2xl font-bold">&gt;</span> Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-[#162048] hover:text-[#1a1a1a] flex items-center text-lg font-medium">
                    <span className="mr-3 text-2xl font-bold">&gt;</span> About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-[#162048] hover:text-[#1a1a1a] flex items-center text-lg font-medium">
                    <span className="mr-3 text-2xl font-bold">&gt;</span> Contact
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="text-[#162048] hover:text-[#1a1a1a] flex items-center text-lg font-medium">
                    <span className="mr-3 text-2xl font-bold">&gt;</span> Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            {/* Categories */}
            <div className="md:col-span-1">
              <h3 className="text-2xl font-extrabold mb-8 flex items-center">
                <span className="w-10 h-1 bg-[#162048] inline-block mr-4 rounded"></span>
                <span className="text-[#1a1a1a]">Categories</span>
              </h3>
              <ul className="space-y-6">
                {categories.slice(0, 4).map((category, index) => (
                  <li key={index}>
                    <Link to={`/category/${category.name.toLowerCase()}`} className="text-[#162048] hover:text-[#1a1a1a] flex items-center text-lg font-medium">
                      <span className="mr-3 text-2xl font-bold">&gt;</span> {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Recent Posts - wider column */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-extrabold mb-8 flex items-center">
                <span className="w-10 h-1 bg-[#162048] inline-block mr-4 rounded"></span>
                <span className="text-[#1a1a1a]">Recent Posts</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {latestNews.slice(0, 4).map(post => (
                  <div key={post.id} className="flex space-x-5 items-center mb-6">
                    <Link to={`/article/${post.id}`} className="flex-shrink-0">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-32 h-24 object-cover rounded-md border-2 border-[#162048]"
                      />
                    </Link>
                    <div className="min-w-0">
                      <Link to={`/article/${post.id}`}>
                        <h4 className="font-bold text-[#1a1a1a] text-lg hover:text-[#162048] leading-snug break-words">{post.title}</h4>
                      </Link>
                      <span className="text-[#162048] text-sm">{post.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;