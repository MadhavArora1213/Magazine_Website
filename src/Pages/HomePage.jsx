import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  // Sample data for posts
  const featuredPosts = [
    {
      id: 1,
      title: 'The Future of Artificial Intelligence in Everyday Life',
      category: 'Technology',
      author: 'John Doe',
      date: 'August 4, 2023',
      image: 'https://placehold.co/600x400',
      excerpt: 'How AI is transforming our daily lives and what to expect in the coming years.'
    },
    {
      id: 2,
      title: 'Top 10 Travel Destinations for 2023',
      category: 'Travel',
      author: 'Jane Smith',
      date: 'August 2, 2023',
      image: 'https://placehold.co/600x400',
      excerpt: 'Explore the most beautiful and exciting places to visit this year.'
    },
    {
      id: 3,
      title: 'Healthy Eating Habits for Busy Professionals',
      category: 'Lifestyle',
      author: 'Mark Wilson',
      date: 'July 29, 2023',
      image: 'https://placehold.co/600x400',
      excerpt: 'Simple ways to maintain a balanced diet despite your hectic schedule.'
    }
  ];

  const trendingPosts = [
    {
      id: 10,
      title: 'Cryptocurrency Trends to Watch in 2023',
      category: 'Finance',
      date: 'July 30, 2023',
      image: 'https://placehold.co/400x300',
      views: '24.5K'
    },
    {
      id: 11,
      title: 'How Remote Work is Reshaping Urban Centers',
      category: 'Business',
      date: 'July 28, 2023',
      image: 'https://placehold.co/400x300',
      views: '18.2K'
    },
    {
      id: 12,
      title: 'The Rise of Plant-Based Diets: Health and Environmental Impact',
      category: 'Health',
      date: 'July 27, 2023',
      image: 'https://placehold.co/400x300',
      views: '16.8K'
    },
    {
      id: 13,
      title: 'Smart Home Technology: Convenience vs Privacy Concerns',
      category: 'Technology',
      date: 'July 26, 2023',
      image: 'https://placehold.co/400x300',
      views: '15.3K'
    }
  ];

  const latestNews = [
    {
      id: 4,
      title: 'The Rise of Sustainable Fashion',
      category: 'Lifestyle',
      date: 'July 28, 2023',
      image: 'https://placehold.co/300x200',
    },
    {
      id: 5,
      title: 'How Blockchain is Changing Finance',
      category: 'Business',
      date: 'July 27, 2023',
      image: 'https://placehold.co/300x200',
    },
    {
      id: 6,
      title: 'The Psychology of Color in Marketing',
      category: 'Business',
      date: 'July 26, 2023',
      image: 'https://placehold.co/300x200',
    },
    {
      id: 7,
      title: 'Best Smartphones of 2023',
      category: 'Technology',
      date: 'July 25, 2023',
      image: 'https://placehold.co/300x200',
    },
    {
      id: 8,
      title: 'The Benefits of Mindfulness Meditation',
      category: 'Health',
      date: 'July 24, 2023',
      image: 'https://placehold.co/300x200',
    },
    {
      id: 9,
      title: 'Upcoming Movies to Watch This Summer',
      category: 'Entertainment',
      date: 'July 23, 2023',
      image: 'https://placehold.co/300x200',
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
    <div>
      {/* Hero Section with Slider */}
      <section className="relative bg-cover bg-center h-[80vh]" style={{backgroundImage: "url('https://placehold.co/1920x1080')"}}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-3xl">
            <span className="bg-red-600 text-white px-3 py-1 text-sm font-semibold rounded-md">Featured</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4">The Impact of Climate Change on Global Economies</h1>
            <p className="text-xl text-gray-200 mt-4">A comprehensive look at how climate change is affecting economic systems worldwide and what governments are doing about it.</p>
            <div className="mt-6 flex items-center">
              <img src="https://placehold.co/100x100" alt="Author" className="w-10 h-10 rounded-full" />
              <div className="ml-3">
                <span className="text-white font-medium">Alex Johnson</span>
                <div className="flex items-center text-gray-300 text-sm">
                  <span>August 5, 2023</span>
                  <span className="mx-2">•</span>
                  <span>8 min read</span>
                </div>
              </div>
            </div>
            <Link 
              to="/article/1" 
              className="mt-8 inline-block bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors"
            >
              Read Article
            </Link>
          </div>
        </div>
        
        {/* Slider Navigation (dots) */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3">
          {[1, 2, 3].map(index => (
            <button 
              key={index} 
              className={`w-3 h-3 rounded-full ${index === 1 ? 'bg-red-600' : 'bg-white bg-opacity-50'}`}
              aria-label={`Go to slide ${index}`}
            ></button>
          ))}
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold flex items-center">
              <span className="w-10 h-1 bg-red-600 inline-block mr-4"></span>
              Latest News
            </h2>
            <Link to="/category/news" className="text-red-600 hover:text-red-700 font-medium flex items-center">
              View All 
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
          
          {/* Latest News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestNews.slice(0, 6).map((post, index) => (
              <div key={post.id} className={index === 0 ? "lg:col-span-2 lg:row-span-2" : ""}>
                <div className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${index === 0 ? 'h-full' : ''}`}>
                  <div className="relative">
                    <Link to={`/article/${post.id}`}>
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className={`w-full object-cover ${index === 0 ? 'h-80' : 'h-56'}`} 
                      />
                    </Link>
                    <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-xs font-semibold rounded-md">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <Link to={`/article/${post.id}`}>
                      <h3 className={`font-bold hover:text-red-600 transition-colors ${index === 0 ? 'text-2xl' : 'text-lg'}`}>{post.title}</h3>
                    </Link>
                    <div className="mt-4 flex items-center text-gray-500 text-sm">
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold flex items-center">
              <span className="w-10 h-1 bg-red-600 inline-block mr-4"></span>
              Trending Now
            </h2>
            <Link to="/trending" className="text-red-600 hover:text-red-700 font-medium flex items-center">
              View All 
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingPosts.map(post => (
              <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative">
                  <Link to={`/article/${post.id}`}>
                    <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                  </Link>
                  <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-xs font-semibold rounded-md">
                    {post.category}
                  </span>
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 text-xs rounded-md flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    {post.views}
                  </div>
                </div>
                <div className="p-6">
                  <Link to={`/article/${post.id}`}>
                    <h3 className="font-bold text-lg hover:text-red-600 transition-colors">{post.title}</h3>
                  </Link>
                  <div className="mt-4 flex items-center text-gray-500 text-sm">
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discover Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Discover Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our diverse range of categories covering everything from technology and lifestyle to business and entertainment.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link 
                key={index}
                to={`/category/${category.name.toLowerCase()}`} 
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md text-center transition-all hover:-translate-y-1 flex flex-col items-center"
              >
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mb-4`}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={category.icon}></path>
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-1">{category.name}</h3>
                <p className="text-gray-500 text-sm">{category.count} Articles</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold flex items-center">
              <span className="w-10 h-1 bg-red-600 inline-block mr-4"></span>
              Featured Posts
            </h2>
            <Link to="/featured" className="text-red-600 hover:text-red-700 font-medium flex items-center">
              View All 
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map(post => (
              <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative">
                  <Link to={`/article/${post.id}`}>
                    <img src={post.image} alt={post.title} className="w-full h-56 object-cover" />
                  </Link>
                  <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-xs font-semibold rounded-md">
                    {post.category}
                  </span>
                </div>
                <div className="p-6">
                  <Link to={`/article/${post.id}`}>
                    <h3 className="font-bold text-xl hover:text-red-600 transition-colors">{post.title}</h3>
                  </Link>
                  <p className="text-gray-600 mt-3">{post.excerpt}</p>
                  <div className="mt-4 flex items-center">
                    <img src="https://placehold.co/100x100" alt={post.author} className="w-8 h-8 rounded-full" />
                    <div className="ml-3">
                      <span className="text-gray-800 font-medium text-sm">{post.author}</span>
                      <div className="text-gray-500 text-xs">
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

      {/* Popular of the Week Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold flex items-center">
              <span className="w-10 h-1 bg-red-600 inline-block mr-4"></span>
              Popular of the Week
            </h2>
            <Link to="/popular" className="text-red-600 hover:text-red-700 font-medium flex items-center">
              View All 
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {popularPosts.map((post, index) => (
              <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative">
                  <Link to={`/article/${post.id}`}>
                    <img src={post.image} alt={post.title} className="w-full h-56 object-cover" />
                  </Link>
                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <span className="bg-red-600 text-white px-3 py-1 text-xs font-semibold rounded-md">
                      {post.category}
                    </span>
                    <span className="bg-black bg-opacity-75 text-white px-3 py-1 text-xs font-bold rounded-md">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 text-xs rounded-md flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    {post.views}
                  </div>
                </div>
                <div className="p-6">
                  <Link to={`/article/${post.id}`}>
                    <h3 className="font-bold text-xl hover:text-red-600 transition-colors">{post.title}</h3>
                  </Link>
                  <div className="mt-4 flex items-center text-gray-500 text-sm">
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Subscribe to Our Newsletter</h2>
            <p className="text-gray-300 mb-8 text-lg">
              Get the latest news, updates, and insights delivered directly to your inbox. Stay informed with Echo.
            </p>
            <form className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
              <button 
                type="submit" 
                className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors whitespace-nowrap font-medium"
              >
                Subscribe Now
              </button>
            </form>
            <p className="text-gray-400 mt-4 text-sm">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from our team.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <span className="w-8 h-1 bg-red-600 inline-block mr-3"></span>
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gray-700 hover:text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-700 hover:text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-700 hover:text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="text-gray-700 hover:text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Categories */}
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <span className="w-8 h-1 bg-red-600 inline-block mr-3"></span>
                Categories
              </h3>
              <ul className="space-y-3">
                {categories.slice(0, 4).map((category, index) => (
                  <li key={index}>
                    <Link to={`/category/${category.name.toLowerCase()}`} className="text-gray-700 hover:text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Recent Posts */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <span className="w-8 h-1 bg-red-600 inline-block mr-3"></span>
                Recent Posts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {latestNews.slice(0, 4).map(post => (
                  <div key={post.id} className="flex space-x-4">
                    <Link to={`/article/${post.id}`} className="flex-shrink-0">
                      <img src={post.image} alt={post.title} className="w-20 h-20 object-cover rounded" />
                    </Link>
                    <div>
                      <Link to={`/article/${post.id}`}>
                        <h4 className="font-semibold text-sm hover:text-red-600">{post.title}</h4>
                      </Link>
                      <span className="text-gray-500 text-xs">{post.date}</span>
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