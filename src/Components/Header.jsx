import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Only use these three colors
const COLORS = {
  white: '#ffffff',
  blue: '#162048',
  black: '#1a1a1a',
};

const NAV_ITEMS = [
  { label: 'HOME', to: '/', dropdown: [
    { label: 'Hero Slider', to: '/' },
    { label: 'Trending Tags', to: '/' },
    { label: 'Quick Access', to: '/' },
    { label: 'Suggested Reads', to: '/' },
    { label: 'Newsletter', to: '/' },
  ]},
  { label: 'PEOPLE & PROFILES', to: '/people', dropdown: [
    { label: 'Celebrity Spotlight', to: '/people/celebrity' },
    { label: 'Influencer Stories', to: '/people/influencers' },
    { label: 'Business Leaders', to: '/people/business-leaders' },
    { label: 'Rising Stars', to: '/people/rising-stars' },
    { label: 'Local Personalities', to: '/people/local' },
    { label: 'International Icons', to: '/people/international' },
    { label: 'Changemakers', to: '/people/changemakers' },
    { label: 'Entrepreneurs', to: '/people/entrepreneurs' },
  ]},
  { label: 'ENTERTAINMENT', to: '/entertainment', dropdown: [
    { label: 'Bollywood News', to: '/entertainment/bollywood' },
    { label: 'Hollywood Updates', to: '/entertainment/hollywood' },
    { label: 'TV Shows & Series', to: '/entertainment/tv' },
    { label: 'Music & Artists', to: '/entertainment/music' },
    { label: 'Movie Reviews', to: '/entertainment/reviews' },
    { label: 'Red Carpet Events', to: '/entertainment/red-carpet' },
    { label: 'Award Shows', to: '/entertainment/awards' },
    { label: 'Celebrity Interviews', to: '/entertainment/interviews' },
    { label: 'Behind the Scenes', to: '/entertainment/behind-scenes' },
  ]},
  { label: 'LIFESTYLE', to: '/lifestyle', dropdown: [
    { label: 'Fashion & Style', to: '/lifestyle/fashion' },
    { label: 'Beauty & Skincare', to: '/lifestyle/beauty' },
    { label: 'Health & Wellness', to: '/lifestyle/health' },
    { label: 'Food & Recipes', to: '/lifestyle/food' },
    { label: 'Travel & Destinations', to: '/lifestyle/travel' },
    { label: 'Home & Decor', to: '/lifestyle/home' },
    { label: 'Relationships & Dating', to: '/lifestyle/relationships' },
    { label: 'Parenting & Family', to: '/lifestyle/parenting' },
  ]},
  { label: 'CULTURE & SOCIETY', to: '/culture', dropdown: [
    { label: 'Art & Photography', to: '/culture/art' },
    { label: 'Books & Literature', to: '/culture/books' },
    { label: 'Social Issues', to: '/culture/social-issues' },
    { label: 'Cultural Events', to: '/culture/events' },
    { label: 'Heritage & Traditions', to: '/culture/heritage' },
    { label: 'Pop Culture', to: '/culture/pop' },
    { label: 'Digital Trends', to: '/culture/digital' },
    { label: 'Youth Culture', to: '/culture/youth' },
  ]},
  { label: 'BUSINESS & LEADERSHIP', to: '/business', dropdown: [
    { label: 'Industry Leaders', to: '/business/industry-leaders' },
    { label: 'Startup Stories', to: '/business/startups' },
    { label: 'Women in Business', to: '/business/women' },
    { label: 'Corporate News', to: '/business/corporate' },
    { label: 'Economic Trends', to: '/business/economics' },
    { label: 'Leadership Insights', to: '/business/leadership' },
    { label: 'Career Advice', to: '/business/career' },
    { label: 'Money & Finance', to: '/business/finance' },
  ]},
  { label: 'REGIONAL FOCUS', to: '/regional', dropdown: [
    { label: 'UAE Spotlight', to: '/regional/uae' },
    { label: 'Local Events', to: '/regional/events' },
    { label: 'Community Heroes', to: '/regional/heroes' },
    { label: 'Government News', to: '/regional/government' },
    { label: 'Cultural Festivals', to: '/regional/festivals' },
    { label: 'Business Hub', to: '/regional/business-hub' },
    { label: 'Tourism & Attractions', to: '/regional/tourism' },
    { label: 'Local Personalities', to: '/regional/personalities' },
  ]},
  { label: 'SPECIAL SECTIONS', to: '/special', dropdown: [
  { label: 'Power Lists', to: '/special/power-lists' },
  { label: 'Annual Awards', to: '/special/awards' },
  { label: 'Top Doctors', to: '/special/doctors' },
  { label: 'Women Leaders', to: '/special/women-leaders' },
  { label: 'Most Influential', to: '/special/influential' },
  { label: 'Rising Entrepreneurs', to: '/special/entrepreneurs' },
  { label: 'Social Impact Leaders', to: '/special/social-impact' },
  ]},
  { label: 'EVENTS', to: '/events' },
  { label: 'FLIPBOOK', to: '/flipbook' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [temperature] = useState('31°C');
  const [location] = useState('New York');
  const [showTopBar, setShowTopBar] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now.toLocaleDateString('en-US', {
      weekday: 'short', day: 'numeric', month: 'long'
    }));
    
    // Add scroll listener
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle dropdown open/close for desktop
  const handleDropdown = idx => {
    setActiveDropdown(activeDropdown === idx ? null : idx);
  };

  // Close dropdown on mobile menu close
  useEffect(() => {
    if (!isMenuOpen) setActiveDropdown(null);
  }, [isMenuOpen]);

  // Responsive: show menu icon below 1000px
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1000);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
   

      {/* Main Header */}
      <header
        className={`w-full z-50 transition-all duration-300 ${isScrolled ? 'fixed top-0 left-0' : ''}`}
        style={{ borderBottom: `4px solid ${COLORS.black}`, background: COLORS.white }}
      >
        <div className="flex items-stretch justify-between">
          {/* Logo */}
          <div
            className="flex items-center justify-center border-r-4 px-6 py-4 min-w-[180px]"
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
                NEONPULSE
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className={`flex-1 ${isMobile ? 'hidden' : 'flex'} items-center justify-center border-r-4 px-2`}
            style={{ borderColor: COLORS.black, background: COLORS.white }}>
            <ul className="flex flex-wrap items-center justify-center gap-6 text-lg font-bold tracking-wide" style={{ color: COLORS.black }}>
              {NAV_ITEMS.map((item, idx) => (
                <li key={item.label} className="relative group">
                  <div className="flex items-center gap-1">
                    <Link
                      to={item.to}
                      className="hover:bg-[#cacaca] hover:text-white transition-colors px-2 py-1 rounded"
                      style={{ color: COLORS.black }}
                    >
                      {item.label}
                    </Link>
                    {item.dropdown && (
                      <button
                        className="transition flex items-center"
                        style={{ background: 'none', border: 'none', color: COLORS.black }}
                        onClick={() => handleDropdown(idx)}
                        onMouseEnter={() => setActiveDropdown(idx)}
                        onMouseLeave={() => setActiveDropdown(null)}
                        tabIndex={-1}
                        aria-label={`Show ${item.label} dropdown`}
                      >
                        <svg className="w-4 h-4 ml-1" fill="none" stroke={COLORS.blue} strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </button>
                    )}
                  </div>
                  {/* Dropdown */}
                  {item.dropdown && activeDropdown === idx && (
                    <div
                      className="absolute left-0 mt-2 min-w-[220px] bg-white border border-[#162048] rounded shadow-lg py-2 z-20"
                      onMouseEnter={() => setActiveDropdown(idx)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {item.dropdown.map(sub => (
                        <Link key={sub.label} to={sub.to} className="block px-4 py-2 hover:bg-[#e9e9ea] hover:text-white transition-colors" style={{ color: COLORS.black }}>
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
              <li>
                <button
                  className="ml-4 text-2xl hover:bg-[#162048] hover:text-white transition rounded-full p-1"
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

          {/* Mobile Menu Button & Sign In/Register */}
          <div className="flex items-center min-w-[80px] border-black" style={{ background: COLORS.white, borderColor: COLORS.black }}>
            {isMobile && (
              <button
                className="flex items-center justify-center w-16 h-full"
                aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  // Close icon
                  <svg width="32" height="32" viewBox="0 0 32 32">
                    <line x1="8" y1="10" x2="24" y2="22" stroke={COLORS.black} strokeWidth="3" />
                    <line x1="24" y1="10" x2="8" y2="22" stroke={COLORS.black} strokeWidth="3" />
                  </svg>
                ) : (
                  // Hamburger icon
                  <svg width="32" height="32" viewBox="0 0 32 32">
                    <line x1="8" y1="12" x2="24" y2="12" stroke={COLORS.black} strokeWidth="3" />
                    <line x1="8" y1="16" x2="24" y2="16" stroke={COLORS.black} strokeWidth="3" />
                    <line x1="8" y1="20" x2="24" y2="20" stroke={COLORS.black} strokeWidth="3" />
                  </svg>
                )}
              </button>
            )}
            <Link
              to="/login"
              className="hidden md:flex items-center justify-center px-8 py-4 text-lg font-bold tracking-wide"
              style={{ color: COLORS.black }}
            >
              SIGN IN / REGISTER
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer - Based on screenshots */}
      {isMobile && isMenuOpen && (
        <div className="fixed top-[80px] left-0 w-full bg-white border-t-4 border-b-4 border-black z-40 shadow-lg overflow-y-auto h-[calc(100vh-80px)]">
         
          <div className="flex justify-end p-4 border-b border-gray-200">
            <Link to="/login" className="text-lg font-bold" style={{ color: COLORS.black }}>
              SIGN IN / REGISTER
            </Link>
          </div>
          
          <div className="py-2">
            <ul className="text-lg font-bold">
              {NAV_ITEMS.map((item, idx) => (
                <li key={item.label} className="border-b border-gray-100">
                  <div className="flex items-center justify-between px-6 py-4">
                    <Link to={item.to} style={{ color: COLORS.black }}>
                      {item.label}
                    </Link>
                    {item.dropdown && (
                      <button
                        className="p-2"
                        onClick={() => setActiveDropdown(activeDropdown === idx ? null : idx)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          {activeDropdown === idx ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"/>
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                          )}
                        </svg>
                      </button>
                    )}
                  </div>
                  {/* Mobile Dropdown */}
                  {item.dropdown && activeDropdown === idx && (
                    <ul className="bg-gray-50 py-2">
                      {item.dropdown.map(sub => (
                        <li key={sub.label}>
                          <Link
                            to={sub.to}
                            className="block py-2 px-10 hover:bg-[#162048] hover:text-white transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                            style={{ color: COLORS.black }}
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Topbar with date, weather, subscribe, socials */}
      <div className="w-full bg-[#ffffff] border-b border-[#162048] text-xs">
        <div className="container mx-auto px-4 flex flex-wrap justify-between items-center py-2">
          <div className="flex items-center space-x-2 w-full sm:w-auto mb-1 sm:mb-0">
            <span className="flex items-center font-semibold" style={{ color: COLORS.blue }}>
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"/></svg>
              Trending:
            </span>
            <span className="text-[#1a1a1a] inline-block">Elevating Your Office Attire...</span>
          </div>
          <div className="flex items-center space-x-4 flex-wrap">
            <span className="inline-flex items-center mr-2" style={{ color: COLORS.black }}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {currentDate}
            </span>
            <span className="inline-flex items-center mr-2" style={{ color: COLORS.black }}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 008 0M21 15a4 4 0 01-8 0"/></svg>
              {temperature}, {location}
            </span>
            <Link to="/subscribe" className="border px-3 py-1 rounded hover:bg-[#162048] hover:text-white font-medium inline-block" style={{ borderColor: COLORS.blue, color: COLORS.black }}>
              Subscribe
            </Link>
            <div className="flex space-x-2 mt-1 sm:mt-0">
              <a href="#" className="text-[#162048] hover:text-white hover:bg-[#162048] rounded-full p-1 transition-colors"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-[#162048] hover:text-white hover:bg-[#162048] rounded-full p-1 transition-colors"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-[#162048] hover:text-white hover:bg-[#162048] rounded-full p-1 transition-colors"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-[#162048] hover:text-white hover:bg-[#162048] rounded-full p-1 transition-colors"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-[#ffffffee] z-50 flex items-center justify-center">
          <form className="flex items-center bg-white border-2 border-[#162048] rounded-lg px-4 py-2 shadow-lg w-[90%] max-w-md">
            <input
              type="search"
              placeholder="Search..."
              className="w-full px-4 py-2 border-none focus:outline-none text-[#1a1a1a] bg-transparent"
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
    </>
  );
};

export default Header;