import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const COLORS = {
  white: '#ffffff',
  blue: '#162048',
  black: '#1a1a1a',
  yellow: '#ffe000'
};

const Footer = () => {
  const [activeTab, setActiveTab] = useState('legal');

  const footerSections = {
    about: {
      title: 'ABOUT',
      links: [
        { name: 'About Us', url: '/about-us' },
        { name: 'Our Team', url: '/our-team' },
        { name: 'Mission & Vision', url: '/mission' },
        { name: 'Editorial Guidelines', url: '/editorial-guidelines' },
        { name: 'Awards & Recognition', url: '/awards' },
        { name: 'Careers', url: '/careers' },
        { name: 'Advertise With Us', url: '/advertise' }
      ]
    },
    contact: {
      title: 'CONTACT & SUPPORT',
      links: [
        { name: 'Contact Us Form', url: '/contact' },
        { name: 'Editorial Contact', url: '/editorial-contact' },
        { name: 'Advertising Enquiries', url: '/advertising' },
        { name: 'Technical Support', url: '/support' },
        { name: 'Office Locations', url: '/locations' },
        { name: 'Social Media Links', url: '/social-media' }
      ]
    },
    legal: {
      title: 'LEGAL',
      links: [
        { name: 'Privacy Policy', url: '/privacy-policy' },
        { name: 'Terms & Conditions', url: '/terms-and-conditions' }, // <-- Updated route
        { name: 'Cookie Policy', url: '/cookies' },
        { name: 'Correction Policy', url: '/correction-policy' },
        { name: 'Editorial Standards', url: '/editorial-standards' },
        { name: 'Copyright Information', url: '/copyright' },
        { name: 'Disclaimer', url: '/disclaimer' }
      ]
    },
    resources: {
      title: 'RESOURCES',
      links: [
        { name: 'Media Kit', url: '/media-kit' },
        { name: 'Press Releases', url: '/press' },
        { name: 'Sitemap', url: '/sitemap' },
        { name: 'RSS Feeds', url: '/rss' },
        { name: 'Archive', url: '/archive' },
        { name: 'Site Search', url: '/search' },
        { name: 'Newsletter Archive', url: '/newsletter-archive' }
      ]
    }
  };

  return (
    <footer className="bg-black text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 border-b-8 border-[#222]">
        {/* Left column - Tabs and Links */}
        <div className="p-8 md:p-12 border-r-8 border-[#222]">
          <div className="flex flex-wrap gap-8 mb-10">
            {Object.keys(footerSections).map(section => (
              <button
                key={section}
                className={`text-xl font-bold tracking-wide ${activeTab === section ? 'text-white underline' : 'text-gray-400'} hover:text-white transition-colors`}
                onClick={() => setActiveTab(section)}
                style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer' }}
              >
                {footerSections[section].title}
              </button>
            ))}
          </div>
          <ul className="space-y-6 text-2xl font-bold">
            {footerSections[activeTab].links.map(link => (
              <li key={link.name}>
                <Link
                  to={link.url}
                  className="hover:text-[#ffe000] transition-colors"
                >
                  {link.name} <span className="font-extrabold">//</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Right column - Newsletter */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h3 className="text-2xl font-bold mb-8">GET WEEKLY NEWSLETTER</h3>
          <form className="flex flex-col md:flex-row w-full mb-8">
            <input
              type="email"
              placeholder="Your Email *"
              className="flex-1 px-6 py-4 rounded-l-full rounded-r-none bg-[#f5f2ee] text-black text-lg outline-none border-none mb-4 md:mb-0"
              required
            />
            <button
              type="submit"
              className="bg-[#ffe000] text-black font-bold px-8 py-4 rounded-r-full rounded-l-none text-lg hover:bg-yellow-400 transition-colors"
            >
              SUBSCRIBE
            </button>
          </form>
          <div className="flex justify-end mt-4">
            <svg width="180" height="60" viewBox="0 0 180 60" fill="none">
              <path d="M10 40 Q90 10 170 40" stroke="#fff" strokeWidth="4" fill="none" />
              <path d="M170 40 Q175 45 180 40" stroke="#fff" strokeWidth="4" fill="none" />
            </svg>
          </div>
        </div>
      </div>
      {/* Copyright */}
      <div className="p-6 text-center border-t-4 border-[#222]">
        <p className="text-gray-300 text-base">
          © {new Date().getFullYear()} NEONPULSE Magazine. All rights reserved.
        </p>
      </div>
      <div className="p-6">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Echo Magazine. All rights reserved.
        </p>
      </div>
    </footer>
  );
}; export default Footer;