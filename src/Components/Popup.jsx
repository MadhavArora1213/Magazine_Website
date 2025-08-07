import React, { useState, useEffect } from 'react';

// Professional, Gen-Z inspired magazine popup with specified color scheme
const Popup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => setIsVisible(false), 350);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 transition-opacity duration-300 ${
        isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'rgba(22,32,72,0.75)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl overflow-hidden animate__animated ${
          isClosing ? 'animate__fadeOutDown' : 'animate__fadeInUp'
        }`}
        style={{
          boxShadow: '0 12px 40px 0 rgba(22,32,72,0.25), 0 2px 8px 0 rgba(0,0,0,0.10)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-[#1a1a1a] hover:text-[#162048] transition-colors z-10 bg-white rounded-full p-1.5 shadow-md"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Left Image Section - Only visible on md and up */}
          <div className="hidden md:block w-2/5 bg-[#162048] relative overflow-hidden">
            <img
              src="https://api.dicebear.com/7.x/bottts/svg?seed=Echo&backgroundColor=162048"
              alt="Magazine Illustration"
              className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-30"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-white">
              <h3 className="text-2xl font-bold mb-4 text-center">Stay Updated</h3>
              <p className="text-sm text-center mb-4">Join our community of readers and get exclusive content delivered to your inbox!</p>
              <div className="flex items-center justify-center space-x-3 mt-4">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-pulse delay-100"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-pulse delay-200"></span>
              </div>
            </div>
          </div>

          {/* Right Content Section */}
          <div className="p-6 md:p-8 w-full md:w-3/5">
            <div className="text-center md:text-left mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#162048] mb-2">
                Echo Magazine
              </h2>
              <p className="text-[#1a1a1a] text-sm md:text-base">
                Get exclusive news, trends, and updates directly to your inbox.
              </p>
            </div>

            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-[#1a1a1a] mb-1">Full Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#162048] transition-all bg-[#ffffff] text-[#1a1a1a]"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-[#1a1a1a] mb-1">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#162048] transition-all bg-[#ffffff] text-[#1a1a1a]"
                />
              </div>

              <div className="flex items-start mt-4">
                <input 
                  id="terms" 
                  type="checkbox" 
                  className="mt-1 h-4 w-4 border-gray-300 rounded text-[#162048] focus:ring-[#162048]"
                />
                <label htmlFor="terms" className="ml-2 text-xs text-gray-600">
                  I agree to receive newsletters and accept the <span className="text-[#162048] underline">Privacy Policy</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#162048] text-white font-medium px-4 py-3 rounded-lg hover:bg-opacity-90 transition-all shadow-sm flex items-center justify-center"
              >
                Subscribe Now
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>

            {/* Mobile Only Decoration */}
            <div className="md:hidden flex justify-center mt-6">
              <div className="w-12 h-1 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;