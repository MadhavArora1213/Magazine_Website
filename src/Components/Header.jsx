import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MobileMenu from './MobileMenu';
import WeatherWidget from './WeatherWidget';
import StockTicker from './StockTicker';
import TrendingBar from './TrendingBar';

const fetchNavigation = async () => {
  try {
    const base = import.meta?.env?.VITE_API_URL || 'http://localhost:5000';
    const res = await fetch(`${base}/api/public/homepage`);
    const json = await res.json();
    return json.navigation || [];
  } catch (e) {
    console.error('Failed to fetch navigation', e);
    return [];
  }
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Replace hardcoded structure with API-driven navigation
  const [navigationStructure, setNavigationStructure] = useState([]);

  useEffect(() => {
    const toSlug = (t) => `/${t.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}`;

    const navigationData = [
      {
        name: 'HOME',
        path: '/',
        isHome: true,
        megaMenu: [
          {
            category: 'Featured Content',
            items: [
              { name: 'Hero Slider', path: '/hero-slider' },
              { name: 'Trending Tags', path: '/trending-tags' },
              { name: 'Quick Access', path: '/quick-access' },
              { name: 'Suggested Reads', path: '/suggested-reads' },
              { name: 'Newsletter', path: '/newsletter' }
            ]
          }
        ],
        subcategories: ['Hero Slider', 'Trending Tags', 'Quick Access', 'Suggested Reads', 'Newsletter']
      },
      {
        name: 'PEOPLE & PROFILES',
        path: toSlug('PEOPLE & PROFILES'),
        isHome: false,
        megaMenu: [
          {
            category: 'All Categories',
            items: [
              { name: 'Celebrity Spotlight', path: `${toSlug('PEOPLE & PROFILES')}${toSlug('Celebrity Spotlight')}` },
              { name: 'Influencer Stories', path: `${toSlug('PEOPLE & PROFILES')}${toSlug('Influencer Stories')}` },
              { name: 'Business Leaders', path: `${toSlug('PEOPLE & PROFILES')}${toSlug('Business Leaders')}` },
              { name: 'Rising Stars', path: `${toSlug('PEOPLE & PROFILES')}${toSlug('Rising Stars')}` },
              { name: 'Local Personalities', path: `${toSlug('PEOPLE & PROFILES')}${toSlug('Local Personalities')}` },
              { name: 'International Icons', path: `${toSlug('PEOPLE & PROFILES')}${toSlug('International Icons')}` },
              { name: 'Changemakers', path: `${toSlug('PEOPLE & PROFILES')}${toSlug('Changemakers')}` },
              { name: 'Entrepreneurs', path: `${toSlug('PEOPLE & PROFILES')}${toSlug('Entrepreneurs')}` }
            ]
          }
        ],
        subcategories: ['Celebrity Spotlight', 'Influencer Stories', 'Business Leaders', 'Rising Stars', 'Local Personalities', 'International Icons', 'Changemakers', 'Entrepreneurs']
      },
      {
        name: 'ENTERTAINMENT',
        path: toSlug('ENTERTAINMENT'),
        isHome: false,
        megaMenu: [
          {
            category: 'All Categories',
            items: [
              { name: 'Bollywood News', path: `${toSlug('ENTERTAINMENT')}${toSlug('Bollywood News')}` },
              { name: 'Hollywood Updates', path: `${toSlug('ENTERTAINMENT')}${toSlug('Hollywood Updates')}` },
              { name: 'TV Shows & Series', path: `${toSlug('ENTERTAINMENT')}${toSlug('TV Shows & Series')}` },
              { name: 'Music & Artists', path: `${toSlug('ENTERTAINMENT')}${toSlug('Music & Artists')}` },
              { name: 'Movie Reviews', path: `${toSlug('ENTERTAINMENT')}${toSlug('Movie Reviews')}` },
              { name: 'Red Carpet Events', path: `${toSlug('ENTERTAINMENT')}${toSlug('Red Carpet Events')}` },
              { name: 'Award Shows', path: `${toSlug('ENTERTAINMENT')}${toSlug('Award Shows')}` },
              { name: 'Celebrity Interviews', path: `${toSlug('ENTERTAINMENT')}${toSlug('Celebrity Interviews')}` },
              { name: 'Behind the Scenes', path: `${toSlug('ENTERTAINMENT')}${toSlug('Behind the Scenes')}` }
            ]
          }
        ],
        subcategories: ['Bollywood News', 'Hollywood Updates', 'TV Shows & Series', 'Music & Artists', 'Movie Reviews', 'Red Carpet Events', 'Award Shows', 'Celebrity Interviews', 'Behind the Scenes']
      },
      {
        name: 'LIFESTYLE',
        path: toSlug('LIFESTYLE'),
        isHome: false,
        megaMenu: [
          {
            category: 'All Categories',
            items: [
              { name: 'Fashion & Style', path: `${toSlug('LIFESTYLE')}${toSlug('Fashion & Style')}` },
              { name: 'Beauty & Skincare', path: `${toSlug('LIFESTYLE')}${toSlug('Beauty & Skincare')}` },
              { name: 'Health & Wellness', path: `${toSlug('LIFESTYLE')}${toSlug('Health & Wellness')}` },
              { name: 'Food & Recipes', path: `${toSlug('LIFESTYLE')}${toSlug('Food & Recipes')}` },
              { name: 'Travel & Destinations', path: `${toSlug('LIFESTYLE')}${toSlug('Travel & Destinations')}` },
              { name: 'Home & Decor', path: `${toSlug('LIFESTYLE')}${toSlug('Home & Decor')}` },
              { name: 'Relationships & Dating', path: `${toSlug('LIFESTYLE')}${toSlug('Relationships & Dating')}` },
              { name: 'Parenting & Family', path: `${toSlug('LIFESTYLE')}${toSlug('Parenting & Family')}` }
            ]
          }
        ],
        subcategories: ['Fashion & Style', 'Beauty & Skincare', 'Health & Wellness', 'Food & Recipes', 'Travel & Destinations', 'Home & Decor', 'Relationships & Dating', 'Parenting & Family']
      },
      {
        name: 'CULTURE & SOCIETY',
        path: toSlug('CULTURE & SOCIETY'),
        isHome: false,
        megaMenu: [
          {
            category: 'All Categories',
            items: [
              { name: 'Art & Photography', path: `${toSlug('CULTURE & SOCIETY')}${toSlug('Art & Photography')}` },
              { name: 'Books & Literature', path: `${toSlug('CULTURE & SOCIETY')}${toSlug('Books & Literature')}` },
              { name: 'Social Issues', path: `${toSlug('CULTURE & SOCIETY')}${toSlug('Social Issues')}` },
              { name: 'Cultural Events', path: `${toSlug('CULTURE & SOCIETY')}${toSlug('Cultural Events')}` },
              { name: 'Heritage & Traditions', path: `${toSlug('CULTURE & SOCIETY')}${toSlug('Heritage & Traditions')}` },
              { name: 'Pop Culture', path: `${toSlug('CULTURE & SOCIETY')}${toSlug('Pop Culture')}` },
              { name: 'Digital Trends', path: `${toSlug('CULTURE & SOCIETY')}${toSlug('Digital Trends')}` },
              { name: 'Youth Culture', path: `${toSlug('CULTURE & SOCIETY')}${toSlug('Youth Culture')}` }
            ]
          }
        ],
        subcategories: ['Art & Photography', 'Books & Literature', 'Social Issues', 'Cultural Events', 'Heritage & Traditions', 'Pop Culture', 'Digital Trends', 'Youth Culture']
      },
      {
        name: 'BUSINESS & LEADERSHIP',
        path: toSlug('BUSINESS & LEADERSHIP'),
        isHome: false,
        megaMenu: [
          {
            category: 'All Categories',
            items: [
              { name: 'Industry Leaders', path: `${toSlug('BUSINESS & LEADERSHIP')}${toSlug('Industry Leaders')}` },
              { name: 'Startup Stories', path: `${toSlug('BUSINESS & LEADERSHIP')}${toSlug('Startup Stories')}` },
              { name: 'Women in Business', path: `${toSlug('BUSINESS & LEADERSHIP')}${toSlug('Women in Business')}` },
              { name: 'Corporate News', path: `${toSlug('BUSINESS & LEADERSHIP')}${toSlug('Corporate News')}` },
              { name: 'Economic Trends', path: `${toSlug('BUSINESS & LEADERSHIP')}${toSlug('Economic Trends')}` },
              { name: 'Leadership Insights', path: `${toSlug('BUSINESS & LEADERSHIP')}${toSlug('Leadership Insights')}` },
              { name: 'Career Advice', path: `${toSlug('BUSINESS & LEADERSHIP')}${toSlug('Career Advice')}` },
              { name: 'Money & Finance', path: `${toSlug('BUSINESS & LEADERSHIP')}${toSlug('Money & Finance')}` }
            ]
          }
        ],
        subcategories: ['Industry Leaders', 'Startup Stories', 'Women in Business', 'Corporate News', 'Economic Trends', 'Leadership Insights', 'Career Advice', 'Money & Finance']
      },
      {
        name: 'REGIONAL FOCUS',
        path: toSlug('REGIONAL FOCUS'),
        isHome: false,
        megaMenu: [
          {
            category: 'All Categories',
            items: [
              { name: 'UAE Spotlight', path: `${toSlug('REGIONAL FOCUS')}${toSlug('UAE Spotlight')}` },
              { name: 'Local Events', path: `${toSlug('REGIONAL FOCUS')}${toSlug('Local Events')}` },
              { name: 'Community Heroes', path: `${toSlug('REGIONAL FOCUS')}${toSlug('Community Heroes')}` },
              { name: 'Government News', path: `${toSlug('REGIONAL FOCUS')}${toSlug('Government News')}` },
              { name: 'Cultural Festivals', path: `${toSlug('REGIONAL FOCUS')}${toSlug('Cultural Festivals')}` },
              { name: 'Business Hub', path: `${toSlug('REGIONAL FOCUS')}${toSlug('Business Hub')}` },
              { name: 'Tourism & Attractions', path: `${toSlug('REGIONAL FOCUS')}${toSlug('Tourism & Attractions')}` },
              { name: 'Local Personalities', path: `${toSlug('REGIONAL FOCUS')}${toSlug('Local Personalities')}` }
            ]
          }
        ],
        subcategories: ['UAE Spotlight', 'Local Events', 'Community Heroes', 'Government News', 'Cultural Festivals', 'Business Hub', 'Tourism & Attractions', 'Local Personalities']
      },
      {
        name: 'SPECIAL SECTIONS',
        path: toSlug('SPECIAL SECTIONS'),
        isHome: false,
        megaMenu: [
          {
            category: 'All Categories',
            items: [
              { name: 'Power Lists (30 Under 30, 40 Under 40)', path: `${toSlug('SPECIAL SECTIONS')}${toSlug('Power Lists')}` },
              { name: 'Annual Awards', path: `${toSlug('SPECIAL SECTIONS')}${toSlug('Annual Awards')}` },
              { name: 'Top Doctors', path: `${toSlug('SPECIAL SECTIONS')}${toSlug('Top Doctors')}` },
              { name: 'Women Leaders', path: `${toSlug('SPECIAL SECTIONS')}${toSlug('Women Leaders')}` },
              { name: 'Most Influential', path: `${toSlug('SPECIAL SECTIONS')}${toSlug('Most Influential')}` },
              { name: 'Rising Entrepreneurs', path: `${toSlug('SPECIAL SECTIONS')}${toSlug('Rising Entrepreneurs')}` },
              { name: 'Social Impact Leaders', path: `${toSlug('SPECIAL SECTIONS')}${toSlug('Social Impact Leaders')}` }
            ]
          }
        ],
        subcategories: ['Power Lists (30 Under 30, 40 Under 40)', 'Annual Awards', 'Top Doctors', 'Women Leaders', 'Most Influential', 'Rising Entrepreneurs', 'Social Impact Leaders']
      }
    ];

    setNavigationStructure(navigationData);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuHover = (menuName) => {
    setActiveMenu(menuName);
  };

  const handleMenuLeave = () => {
    setActiveMenu(null);
  };

  return (
    <>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#ffffff]/95 backdrop-blur-md shadow-lg border-b border-[#1a1a1a]/20'
          : 'bg-[#ffffff]/80 backdrop-blur-sm'
      }`}>
        
        {/* Merged Header Bar with Weather, Logo, and Stocks */}
        <div className="bg-[#162048] shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Mobile Layout - Merged Header */}
            <div className="block xl:hidden">
              <div className="flex items-center justify-between h-16">
                {/* Left: Logo */}
                <Link to="/" className="flex items-center">
                  <div className="bg-[#ffffff] text-[#162048] px-4 py-2 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    MAGAZINE
                  </div>
                </Link>

                {/* Right: Social Icons and Menu Icon */}
                <div className="flex items-center space-x-3">
                  {/* Social Icons */}
                  <div className="flex items-center space-x-2">
                    <a href="#" className="text-[#ffffff] hover:text-[#ffffff]/80 transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    <a href="#" className="text-[#ffffff] hover:text-[#ffffff]/80 transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                      </svg>
                    </a>
                    <a href="#" className="text-[#ffffff] hover:text-[#ffffff]/80 transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                    <a href="#" className="text-[#ffffff] hover:text-[#ffffff]/80 transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                  </div>

                  {/* Menu Icon */}
                  <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 text-[#ffffff] hover:text-[#ffffff]/80 transition-colors rounded-lg hover:bg-[#ffffff]/10"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden xl:flex justify-between items-center h-20">
              {/* Left: Weather and Date */}
              <div className="flex items-center space-x-3 lg:space-x-4 text-[#ffffff]">
                <div className="flex items-center space-x-2">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>Dubai, UAE</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>{new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}</span>
                </div>
                <WeatherWidget />
              </div>

              {/* Center: Magazine Logo */}
              <div className="flex justify-center">
                <Link to="/" className="flex items-center">
                  <div className="bg-[#ffffff] text-[#162048] px-6 py-3 rounded-lg font-bold text-xl md:text-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                    MAGAZINE
                  </div>
                </Link>
              </div>

              {/* Right: Stocks and Social */}
              <div className="flex items-center space-x-3">
                <StockTicker />
                <div className="flex items-center space-x-2 text-[#ffffff]">
                  <a href="#" className="hover:text-[#ffffff] transition-colors">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                    </svg>
                  </a>
                  <a href="#" className="hover:text-[#ffffff] transition-colors">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="hover:text-[#ffffff] transition-colors">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Bar - Desktop Only */}
        <div className="hidden xl:block bg-[#ffffff] border-b border-[#1a1a1a]/20 shadow-sm relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-3">
              <nav className="flex items-center space-x-8 relative">
                {navigationStructure.map((item, index) => (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => handleMenuHover(item.name)}
                    onMouseLeave={handleMenuLeave}
                  >
                    <Link
                      to={item.path}
                      className={`text-sm font-medium hover:text-[#162048] transition-colors duration-200 whitespace-nowrap px-2 py-1 rounded ${
                        location.pathname === item.path ? 'text-[#162048] bg-[#ffffff]' : 'text-[#1a1a1a]'
                      }`}
                    >
                      {item.name}
                    </Link>
                    {activeMenu === item.name && item.megaMenu && item.megaMenu.length > 0 && item.name !== 'HOME' && (
                      <div className={`absolute top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 ${
                        index >= navigationStructure.length - 2 ? 'right-0' : 'left-0'
                      }`}>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-[#162048] mb-3">{item.megaMenu[0].category}</h3>
                          <div className="grid grid-cols-1 gap-2">
                            {item.megaMenu[0].items.map((subItem) => (
                              <Link
                                key={subItem.name}
                                to={subItem.path}
                                className="text-sm text-[#1a1a1a] hover:text-[#162048] hover:bg-gray-50 px-3 py-2 rounded transition-colors duration-200"
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Trending News Bar */}
        <div className="bg-[#ffffff] border-t border-b border-[#1a1a1a]/20">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2">
            <TrendingBar />
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigationStructure={navigationStructure}
      />
    </>
  );
};

export default Header;
