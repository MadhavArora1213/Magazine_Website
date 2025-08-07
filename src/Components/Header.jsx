import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Only use these three colors
const COLORS = {
  white: '#ffffff',
  blue: '#162048',
  black: '#1a1a1a',
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [temperature] = useState('31°C');
  const [location] = useState('New York');
  const [showTopBar, setShowTopBar] = useState(true);

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
      {/* Top Notice Bar */}
      {showTopBar && (
        <div
          className="w-full font-bold text-center py-3 px-2 flex items-center justify-between border-b-2"
          style={{ background: COLORS.blue, color: COLORS.white, borderColor: COLORS.black }}
        >
          <span className="mx-auto">
            GET ACCESS TO PREMIUM POSTS. TRY OUR GOLD PACKAGE FOR 14 DAYS FREE
          </span>
          <button
            className="text-2xl font-bold px-4"
            aria-label="Close"
            onClick={() => setShowTopBar(false)}
            style={{ color: COLORS.white }}
          >
            ×
          </button>
        </div>
      )}

      {/* Main Header */}
      <header
        className={`w-full z-50 transition-all duration-300`}
        style={{ borderBottom: `4px solid ${COLORS.black}`, background: COLORS.white }}
      >
        <div className="flex flex-col md:flex-row items-stretch justify-between">
          {/* Logo */}
          <div
            className="flex items-center justify-center md:justify-start border-r-4 px-6 py-4 min-w-[220px]"
            style={{ borderColor: COLORS.black, background: COLORS.white }}
          >
            <Link to="/" className="flex items-center">
              <span
                className="text-3xl font-extrabold px-4 py-2 rounded-r-full rounded-l-lg"
                style={{
                  background: COLORS.blue,
                  color: COLORS.white,
                  border: `4px solid ${COLORS.black}`,
                  fontFamily: 'monospace',
                  letterSpacing: '2px',
                }}
              >
                echo
              </span>
              <span className="hidden sm:inline text-lg font-semibold ml-2" style={{ color: COLORS.blue }}>
                Magazine
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav
            className="flex-1 flex items-center justify-center border-r-4 px-2"
            style={{ borderColor: COLORS.black, background: COLORS.white }}
          >
            <ul className="flex flex-wrap items-center justify-center gap-6 text-lg font-bold tracking-wide" style={{ color: COLORS.black }}>
              <li><Link to="/" className="hover:text-[#162048] transition">Home</Link></li>
              <li className="text-2xl font-bold" style={{ color: COLORS.blue }}>*</li>
              <li><Link to="/about" className="hover:text-[#162048] transition">About</Link></li>
              <li className="text-2xl font-bold" style={{ color: COLORS.blue }}>*</li>
              <li><Link to="/category/technology" className="hover:text-[#162048] transition">Technology</Link></li>
              <li className="text-2xl font-bold" style={{ color: COLORS.blue }}>*</li>
              <li><Link to="/category/lifestyle" className="hover:text-[#162048] transition">Lifestyle</Link></li>
              <li className="text-2xl font-bold" style={{ color: COLORS.blue }}>*</li>
              <li><Link to="/category/travel" className="hover:text-[#162048] transition">Travel</Link></li>
              <li className="text-2xl font-bold" style={{ color: COLORS.blue }}>*</li>
              <li><Link to="/category/food" className="hover:text-[#162048] transition">Food</Link></li>
              <li className="text-2xl font-bold" style={{ color: COLORS.blue }}>*</li>
              <li><Link to="/news/latest" className="hover:text-[#162048] transition">Latest News</Link></li>
              <li className="text-2xl font-bold" style={{ color: COLORS.blue }}>*</li>
              <li><Link to="/news/trending" className="hover:text-[#162048] transition">Trending</Link></li>
              <li className="text-2xl font-bold" style={{ color: COLORS.blue }}>*</li>
              <li><Link to="/news/popular" className="hover:text-[#162048] transition">Popular</Link></li>
              <li className="text-2xl font-bold" style={{ color: COLORS.blue }}>*</li>
              <li><Link to="/contact" className="hover:text-[#162048] transition">Contact</Link></li>
              <li>
                <button
                  className="ml-4 text-2xl hover:text-[#162048] transition"
                  aria-label="Search"
                  onClick={() => setSearchOpen(!searchOpen)}
                  style={{ color: COLORS.black }}
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" stroke={COLORS.black} />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" stroke={COLORS.black} />
                  </svg>
                </button>
              </li>
            </ul>
          </nav>

          {/* Sign In / Register */}
          <div
            className="flex items-center justify-center px-8 py-4 min-w-[220px] border-black"
            style={{ background: COLORS.blue, borderColor: COLORS.black }}
          >
            <Link
              to="/login"
              className="text-lg font-bold tracking-wide"
              style={{ color: COLORS.white }}
            >
              SIGN IN / REGISTER
            </Link>
          </div>
        </div>
      </header>

      {/* Topbar with date, weather, subscribe, socials */}
      <div className="w-full bg-[#ffffff] border-b border-[#162048] text-xs">
        <div className="container mx-auto px-4 flex justify-between items-center h-10">
          <div className="flex items-center space-x-4">
            <span className="flex items-center font-semibold" style={{ color: COLORS.blue }}>
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"/></svg>
              Trending:
            </span>
            <span className="text-[#1a1a1a] hidden sm:inline">Elevating Your Office Attire...</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline-flex items-center" style={{ color: COLORS.black }}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {currentDate}
            </span>
            <span className="hidden md:inline-flex items-center" style={{ color: COLORS.black }}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 008 0M21 15a4 4 0 01-8 0"/></svg>
              {temperature}, {location}
            </span>
            <Link to="/subscribe" className="border px-3 py-1 rounded hover:bg-[#162048] hover:text-white font-medium hidden sm:inline" style={{ borderColor: COLORS.blue, color: COLORS.black }}>
              Subscribe
            </Link>
            <div className="flex space-x-2">
              <a href="#" className="text-[#162048] hover:text-[#1a1a1a]"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-[#162048] hover:text-[#1a1a1a]"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-[#162048] hover:text-[#1a1a1a]"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-[#162048] hover:text-[#1a1a1a]"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-[#ffffffee] z-50 flex items-center justify-center">
          <form className="flex items-center bg-white border-2 border-[#162048] rounded-lg px-4 py-2 shadow-lg">
            <input
              type="search"
              placeholder="Search..."
              className="w-64 px-4 py-2 border-none focus:outline-none text-[#1a1a1a] bg-transparent"
            />
            <button type="submit" className="ml-2 text-[#162048] text-xl font-bold">
              <svg className="w-6 h-6" fill="none" stroke="#162048" strokeWidth="3" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" stroke="#162048" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#162048" />
              </svg>
            </button>
          </form>
          <button
            className="absolute top-8 right-8 text-3xl font-bold"
            aria-label="Close Search"
            onClick={() => setSearchOpen(false)}
            style={{ color: COLORS.black }}
          >
            ×
          </button>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-[120px] left-0 w-full bg-white shadow-md py-4 px-4 z-40 border-t-2" style={{ borderColor: COLORS.black }}>
          <nav className="flex flex-col space-y-3">
            <Link to="/" className="py-2 border-b border-[#162048] hover:text-[#162048]">Home</Link>
            <Link to="/about" className="py-2 border-b border-[#162048] hover:text-[#162048]">About</Link>
            <Link to="/category/technology" className="py-2 border-b border-[#162048] hover:text-[#162048]">Technology</Link>
            <Link to="/category/lifestyle" className="py-2 border-b border-[#162048] hover:text-[#162048]">Lifestyle</Link>
            <Link to="/category/travel" className="py-2 border-b border-[#162048] hover:text-[#162048]">Travel</Link>
            <Link to="/category/food" className="py-2 border-b border-[#162048] hover:text-[#162048]">Food</Link>
            <Link to="/news/latest" className="py-2 border-b border-[#162048] hover:text-[#162048]">Latest News</Link>
            <Link to="/news/trending" className="py-2 border-b border-[#162048] hover:text-[#162048]">Trending</Link>
            <Link to="/news/popular" className="py-2 border-b border-[#162048] hover:text-[#162048]">Popular</Link>
            <Link to="/contact" className="py-2 border-b border-[#162048] hover:text-[#162048]">Contact</Link>
            <Link to="/subscribe" className="py-2 border-b border-[#162048] hover:text-[#162048]">Subscribe</Link>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;