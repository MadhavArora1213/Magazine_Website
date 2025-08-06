import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [temperature] = useState('31°C');
  const [location] = useState('New York');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const now = new Date();
    setCurrentDate(now.toLocaleDateString('en-US', {
      weekday: 'short', day: 'numeric', month: 'long'
    }));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Topbar */}
      <div className="bg-gray-50 border-b border-gray-100 text-xs">
        <div className="container mx-auto px-4 flex justify-between items-center h-10">
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-blue-600 font-semibold">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"/></svg>
              Trending:
            </span>
            <span className="text-gray-600 hidden sm:inline">Elevating Your Office Attire...</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline-flex items-center text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {currentDate}
            </span>
            <span className="hidden md:inline-flex items-center text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 008 0M21 15a4 4 0 01-8 0"/></svg>
              {temperature}, {location}
            </span>
            <Link to="/subscribe" className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 text-gray-700 font-medium hidden sm:inline">Subscribe</Link>
            <div className="flex space-x-2">
              <a href="#" className="text-gray-400 hover:text-blue-600"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-gray-400 hover:text-blue-400"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-gray-400 hover:text-pink-600"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-gray-400 hover:text-red-600"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className={`w-full z-50 transition-all duration-300 bg-white ${isScrolled ? 'shadow-md sticky top-0' : ''}`}>
        <div className="container mx-auto px-4 flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-3xl font-extrabold text-blue-600 mr-2">echo</span>
            <span className="hidden sm:inline text-lg font-semibold text-gray-700">Magazine</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 font-medium">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <div className="relative group">
              <button className="flex items-center hover:text-blue-600 focus:outline-none">
                Pages
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
              </button>
              <div className="absolute left-0 mt-2 w-40 bg-white rounded shadow-lg py-2 z-20 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition">
                <Link to="/about" className="block px-4 py-2 hover:bg-gray-100">About</Link>
                <Link to="/contact" className="block px-4 py-2 hover:bg-gray-100">Contact</Link>
                <Link to="/404" className="block px-4 py-2 hover:bg-gray-100">404</Link>
              </div>
            </div>
            <div className="relative group">
              <button className="flex items-center hover:text-blue-600 focus:outline-none">
                Categories
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
              </button>
              <div className="absolute left-0 mt-2 w-44 bg-white rounded shadow-lg py-2 z-20 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition">
                <Link to="/category/technology" className="block px-4 py-2 hover:bg-gray-100">Technology</Link>
                <Link to="/category/lifestyle" className="block px-4 py-2 hover:bg-gray-100">Lifestyle</Link>
                <Link to="/category/travel" className="block px-4 py-2 hover:bg-gray-100">Travel</Link>
                <Link to="/category/food" className="block px-4 py-2 hover:bg-gray-100">Food</Link>
              </div>
            </div>
            <Link to="/news/latest" className="hover:text-blue-600">Latest News</Link>
            <Link to="/news/trending" className="hover:text-blue-600">Trending</Link>
            <Link to="/news/popular" className="hover:text-blue-600">Popular</Link>
            <Link to="/contact" className="hover:text-blue-600">Contact</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              className="text-gray-500 hover:text-blue-600 focus:outline-none"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </button>
            <button
              className="md:hidden text-gray-500 hover:text-blue-600 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        {searchOpen && (
          <div className="absolute top-20 left-0 w-full bg-white shadow-md py-4 px-4 z-40">
            <div className="container mx-auto">
              <form className="flex items-center">
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white shadow-md py-4 px-4 z-40">
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="py-2 border-b border-gray-100 hover:text-blue-600">Home</Link>
              <Link to="/about" className="py-2 border-b border-gray-100 hover:text-blue-600">About</Link>
              <Link to="/contact" className="py-2 border-b border-gray-100 hover:text-blue-600">Contact</Link>
              <Link to="/category/technology" className="py-2 border-b border-gray-100 hover:text-blue-600">Technology</Link>
              <Link to="/category/lifestyle" className="py-2 border-b border-gray-100 hover:text-blue-600">Lifestyle</Link>
              <Link to="/category/travel" className="py-2 border-b border-gray-100 hover:text-blue-600">Travel</Link>
              <Link to="/category/food" className="py-2 border-b border-gray-100 hover:text-blue-600">Food</Link>
              <Link to="/news/latest" className="py-2 border-b border-gray-100 hover:text-blue-600">Latest News</Link>
              <Link to="/news/trending" className="py-2 border-b border-gray-100 hover:text-blue-600">Trending</Link>
              <Link to="/news/popular" className="py-2 border-b border-gray-100 hover:text-blue-600">Popular</Link>
              <Link to="/subscribe" className="py-2 border-b border-gray-100 hover:text-blue-600">Subscribe</Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;