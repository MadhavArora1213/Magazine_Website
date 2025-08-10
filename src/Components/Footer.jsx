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
        { name: 'About Us', url: '/about' },
        { name: 'Our Team', url: '/our-team' },
        { name: 'Mission & Vision', url: '/mission-vision' },
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
        { name: 'Terms & Conditions', url: '/terms-and-conditions' },
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
        { name: 'RSS Feeds', url: '/rss' },
        { name: 'Archive', url: '/archive' },
        { name: 'Site Search', url: '/search' },
        { name: 'Newsletter Archive', url: '/newsletter-archive' }
      ]
    }
  };

  return (
    <footer className="bg-black text-white w-full">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8 md:gap-0 border-b-8 border-[#222]">
          {/* Left column - Tabs and Links */}
          <div className="md:w-1/2 p-4 md:p-8 border-b-8 md:border-b-0 md:border-r-8 border-[#222]">
            <div className="flex flex-wrap gap-6 mb-8">
              {Object.keys(footerSections).map(section => (
                <button
                  key={section}
                  className={`text-lg md:text-xl font-bold tracking-wide ${activeTab === section ? 'text-white underline' : 'text-gray-400'} hover:text-white transition-colors`}
                  onClick={() => setActiveTab(section)}
                  style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer' }}
                >
                  {footerSections[section].title}
                </button>
              ))}
            </div>
            <ul className="space-y-4 md:space-y-6 text-lg md:text-2xl font-bold">
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
          <div className="md:w-1/2 p-4 md:p-8 flex flex-col justify-center bg-black">
            <h3 className="text-lg md:text-2xl font-bold mb-6 md:mb-8">GET WEEKLY NEWSLETTER</h3>
            <form className="flex flex-col md:flex-row w-full mb-6 md:mb-8">
              <input
                type="email"
                placeholder="Your Email *"
                className="flex-1 px-4 py-3 rounded-l-full rounded-r-none bg-[#f5f2ee] text-black text-base md:text-lg outline-none border-none mb-3 md:mb-0 transition-all duration-200"
                required
                style={{
                  maxWidth: '100%',
                  minWidth: '180px'
                }}
              />
              <button
                type="submit"
                className="bg-[#ffe000] text-black font-bold px-6 py-3 rounded-r-full rounded-l-none text-base md:text-lg hover:bg-yellow-400 transition-colors"
              >
                SUBSCRIBE
              </button>
            </form>
            <div className="flex justify-end mt-2 md:mt-4">
              <svg width="180" height="60" viewBox="0 0 180 60" fill="none">
                <path d="M10 40 Q90 10 170 40" stroke="#fff" strokeWidth="4" fill="none" />
                <path d="M170 40 Q175 45 180 40" stroke="#fff" strokeWidth="4" fill="none" />
              </svg>
            </div>
          </div>
        </div>
        {/* Copyright */}
        <div className="pt-6 text-center border-t-4 border-[#222]">
          <p className="text-gray-300 text-xs md:text-base">
            © {new Date().getFullYear()} NEONPULSE Magazine. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs md:text-sm mt-1">
            © {new Date().getFullYear()} Echo Magazine. All rights reserved.
          </p>
        </div>
      </div>
      <style>
        {`
          @media (max-width: 820px) {
            .footer-newsletter-input {
              font-size: 14px !important;
              padding: 8px 12px !important;
              min-width: 120px !important;
              max-width: 220px !important;
            }
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;
// filepath: c:\Users\DELL\OneDrive\Desktop\Magazine_Website\Magazine_Website\src\Components\Footer.jsx