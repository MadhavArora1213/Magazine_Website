import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MobileMenu = ({ isOpen, onClose, navigationStructure }) => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  const toggleSubmenu = (menuName) => {
    setActiveSubmenu(activeSubmenu === menuName ? null : menuName);
    setActiveCategory(null);
  };

  const toggleCategory = (categoryName) => {
    setActiveCategory(activeCategory === categoryName ? null : categoryName);
  };

  const handleLinkClick = () => {
    onClose();
    setActiveSubmenu(null);
    setActiveCategory(null);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 xl:hidden"
        onClick={onClose}
      />

      {/* Mobile Menu */}
      <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl z-50 xl:hidden transform transition-transform duration-300 ease-in-out overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1a1a1a]/20">
          <div className="flex items-center space-x-3">
            <div className="bg-[#162048] text-[#ffffff] px-3 py-1 rounded-lg font-bold text-lg">
              MAGAZINE
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#1a1a1a]/10 transition-colors duration-200"
          >
            <svg className="h-6 w-6 text-[#1a1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Section */}
        <div className="p-4 border-b border-[#1a1a1a]/20">
          <div className="relative">
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full px-4 py-3 pl-10 pr-4 text-sm border border-[#1a1a1a]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#162048] focus:border-transparent"
            />
            <svg className="absolute left-3 top-3.5 h-4 w-4 text-[#1a1a1a]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Navigation */}
        <div className="py-2">
          {navigationStructure.map((item) => (
            <div key={item.name} className="border-b border-[#1a1a1a]/10 last:border-b-0">
              {/* Main Menu Item */}
              <div className="flex items-center justify-between">
                <Link
                  to={item.path}
                  onClick={handleLinkClick}
                  className="flex-1 px-4 py-3 text-[#1a1a1a] hover:bg-[#1a1a1a]/5 transition-colors duration-200"
                >
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>

                {/* Submenu Toggle */}
                {item.megaMenu && item.name !== 'HOME' && (
                  <button
                    onClick={() => toggleSubmenu(item.name)}
                    className="px-4 py-3 text-[#1a1a1a]/70 hover:text-[#162048] transition-colors duration-200"
                  >
                    <svg
                      className={`h-5 w-5 transform transition-transform duration-200 ${
                        activeSubmenu === item.name ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Submenu */}
              {item.megaMenu && activeSubmenu === item.name && (
                <div className="bg-[#1a1a1a]/5 border-t border-[#1a1a1a]/10">
                  {item.megaMenu.map((category) => (
                    <div key={category.category} className="border-b border-[#1a1a1a]/10 last:border-b-0">
                      {/* Category Header */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => toggleCategory(category.category)}
                          className="flex-1 px-6 py-3 text-left text-sm font-medium text-[#1a1a1a] hover:bg-[#1a1a1a]/10 transition-colors duration-200"
                        >
                          {category.category}
                        </button>
                        <button
                          onClick={() => toggleCategory(category.category)}
                          className="px-4 py-3 text-[#1a1a1a]/60 hover:text-[#162048] transition-colors duration-200"
                        >
                          <svg
                            className={`h-4 w-4 transform transition-transform duration-200 ${
                              activeCategory === category.category ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>

                      {/* Category Items */}
                      {activeCategory === category.category && (
                        <div className="bg-[#ffffff]">
                          {category.items.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              onClick={handleLinkClick}
                              className="block px-8 py-2.5 text-sm text-[#1a1a1a]/70 hover:text-[#162048] hover:bg-[#162048]/5 transition-colors duration-200"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="p-4 border-t border-[#1a1a1a]/20 bg-[#1a1a1a]/5">
          <h3 className="text-sm font-medium text-[#1a1a1a] mb-3">Quick Links</h3>
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/trending"
              onClick={handleLinkClick}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-[#1a1a1a]/70 hover:text-[#162048] hover:bg-[#ffffff] rounded-lg transition-colors duration-200"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>Trending</span>
            </Link>
            <Link
              to="/featured"
              onClick={handleLinkClick}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-[#1a1a1a]/70 hover:text-[#162048] hover:bg-[#ffffff] rounded-lg transition-colors duration-200"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span>Featured</span>
            </Link>
            <Link
              to="/multimedia"
              onClick={handleLinkClick}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-[#1a1a1a]/70 hover:text-[#162048] hover:bg-[#ffffff] rounded-lg transition-colors duration-200"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Videos</span>
            </Link>
            <Link
              to="/events"
              onClick={handleLinkClick}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-[#1a1a1a]/70 hover:text-[#162048] hover:bg-[#ffffff] rounded-lg transition-colors duration-200"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Events</span>
            </Link>
          </div>
        </div>

        {/* Social Links */}
        <div className="p-4 border-t border-[#1a1a1a]/20">
          <h3 className="text-sm font-medium text-[#1a1a1a] mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              href="#"
              className="flex items-center justify-center w-10 h-10 bg-[#1a1a1a] text-[#ffffff] rounded-lg hover:bg-[#162048] transition-colors duration-200"
              title="Pinterest"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
              </svg>
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-10 h-10 bg-[#162048] text-[#ffffff] rounded-lg hover:bg-[#1a1a1a] transition-colors duration-200"
              title="Facebook"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-10 h-10 bg-[#1a1a1a] text-[#ffffff] rounded-lg hover:bg-[#162048] transition-colors duration-200"
              title="YouTube"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-10 h-10 bg-[#162048] text-[#ffffff] rounded-lg hover:bg-[#1a1a1a] transition-colors duration-200"
              title="Twitter"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="p-4 border-t border-[#1a1a1a]/20 bg-[#1a1a1a]/5">
          <h3 className="text-sm font-medium text-[#1a1a1a] mb-2">Stay Updated</h3>
          <p className="text-xs text-[#1a1a1a]/60 mb-3">Get the latest news delivered to your inbox</p>
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 text-sm border border-[#1a1a1a]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#162048] focus:border-transparent"
            />
            <button className="w-full bg-[#162048] text-[#ffffff] py-2 px-4 rounded-lg text-sm font-medium hover:bg-[#1a1a1a] transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;