import React, { useState, useEffect, useRef } from 'react';
import { FaArrowUp, FaClock, FaBookOpen } from 'react-icons/fa';

const ReadingProgress = ({ 
  showScrollToTop = true,
  showReadingTime = true,
  showProgressPercentage = false,
  variant = 'bar', // bar, circle, minimal
  position = 'top', // top, bottom, fixed
  className = ''
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const startTimeRef = useRef(null);
  const lastScrollRef = useRef(0);
  const inactivityTimeoutRef = useRef(null);

  useEffect(() => {
    calculateReadingTime();
    startReadingSession();

    const handleScroll = () => {
      updateScrollProgress();
      handleUserActivity();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseReadingSession();
      } else {
        resumeReadingSession();
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Initial scroll calculation
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, []);

  const calculateReadingTime = () => {
    const articleContent = document.querySelector('.article-content, .prose');
    if (articleContent) {
      const text = articleContent.innerText || articleContent.textContent || '';
      const wordCount = text.trim().split(/\s+/).length;
      const wordsPerMinute = 200; // Average reading speed
      const minutes = Math.ceil(wordCount / wordsPerMinute);
      setReadingTime(minutes);
    }
  };

  const updateScrollProgress = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    
    setScrollProgress(Math.min(Math.max(progress, 0), 100));
    setIsVisible(scrollTop > 100);

    // Update last scroll position
    lastScrollRef.current = scrollTop;
  };

  const startReadingSession = () => {
    startTimeRef.current = Date.now();
    setIsReading(true);
    
    // Start time tracking
    const timeTracker = setInterval(() => {
      if (isReading && !document.hidden) {
        setTimeSpent(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timeTracker);
  };

  const handleUserActivity = () => {
    setIsReading(true);
    
    // Clear existing timeout
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    
    // Set new inactivity timeout (30 seconds)
    inactivityTimeoutRef.current = setTimeout(() => {
      setIsReading(false);
    }, 30000);
  };

  const pauseReadingSession = () => {
    setIsReading(false);
  };

  const resumeReadingSession = () => {
    setIsReading(true);
    handleUserActivity();
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const formatTime = (seconds) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  };

  const getReadingSpeed = () => {
    if (timeSpent === 0) return 0;
    const progressDecimal = scrollProgress / 100;
    const estimatedWordsRead = (readingTime * 200) * progressDecimal;
    const actualMinutes = timeSpent / 60;
    return actualMinutes > 0 ? Math.round(estimatedWordsRead / actualMinutes) : 0;
  };

  const renderProgressBar = () => (
    <div 
      className={`fixed z-50 transition-all duration-300 ${
        position === 'top' ? 'top-0 left-0 right-0' : 'bottom-0 left-0 right-0'
      } ${isVisible ? 'opacity-100' : 'opacity-0'} ${className}`}
    >
      {/* Progress Bar */}
      <div className="h-1 bg-gray-200">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      
      {/* Reading Info */}
      {(showReadingTime || showProgressPercentage) && (
        <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            {showReadingTime && (
              <div className="flex items-center gap-2 text-gray-600">
                <FaClock className="w-3 h-3" />
                <span>{readingTime} min read</span>
                <span className="text-gray-400">•</span>
                <span>{formatTime(timeSpent)} spent</span>
              </div>
            )}
            {showProgressPercentage && (
              <div className="text-blue-600 font-medium">
                {Math.round(scrollProgress)}% complete
              </div>
            )}
          </div>
          
          {isReading && (
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs">Reading</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderCircularProgress = () => (
    <div 
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      } ${className}`}
    >
      <div className="relative">
        {/* Circular Progress */}
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="4"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 28}`}
            strokeDashoffset={`${2 * Math.PI * 28 * (1 - scrollProgress / 100)}`}
            className="transition-all duration-150"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {showScrollToTop ? (
            <button
              onClick={scrollToTop}
              className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
              title="Scroll to top"
            >
              <FaArrowUp className="w-3 h-3" />
            </button>
          ) : (
            <div className="text-xs font-medium text-gray-700">
              {Math.round(scrollProgress)}%
            </div>
          )}
        </div>
      </div>
      
      {/* Reading Time Info */}
      {showReadingTime && (
        <div className="absolute -top-12 right-0 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
          {formatTime(timeSpent)} / {readingTime}m
        </div>
      )}
    </div>
  );

  const renderMinimalProgress = () => (
    <div 
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      } ${className}`}
    >
      <div className="bg-white rounded-full shadow-lg px-4 py-2 flex items-center gap-3">
        {/* Progress Indicator */}
        <div className="flex items-center gap-2">
          <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-150"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
          <span className="text-xs text-gray-600 font-medium">
            {Math.round(scrollProgress)}%
          </span>
        </div>
        
        {/* Reading Time */}
        {showReadingTime && (
          <>
            <div className="w-px h-4 bg-gray-300" />
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <FaBookOpen className="w-3 h-3" />
              <span>{formatTime(timeSpent)}</span>
            </div>
          </>
        )}
        
        {/* Scroll to Top */}
        {showScrollToTop && (
          <>
            <div className="w-px h-4 bg-gray-300" />
            <button
              onClick={scrollToTop}
              className="text-gray-500 hover:text-blue-600 transition-colors"
              title="Scroll to top"
            >
              <FaArrowUp className="w-3 h-3" />
            </button>
          </>
        )}
      </div>
    </div>
  );

  const renderFixedProgress = () => (
    <div 
      className={`fixed left-4 top-1/2 transform -translate-y-1/2 z-40 transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      <div className="bg-white rounded-lg shadow-lg p-3">
        {/* Vertical Progress Bar */}
        <div className="relative h-32 w-1 bg-gray-200 rounded-full overflow-hidden mb-3">
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-purple-600 transition-all duration-150"
            style={{ height: `${scrollProgress}%` }}
          />
        </div>
        
        {/* Progress Percentage */}
        <div className="text-center text-xs text-gray-600 font-medium mb-2">
          {Math.round(scrollProgress)}%
        </div>
        
        {/* Reading Stats */}
        {showReadingTime && (
          <div className="text-center space-y-1">
            <div className="text-xs text-gray-500">
              {formatTime(timeSpent)}
            </div>
            <div className="text-xs text-gray-400">
              {readingTime}m total
            </div>
          </div>
        )}
        
        {/* Scroll to Top */}
        {showScrollToTop && (
          <button
            onClick={scrollToTop}
            className="w-full mt-2 p-1 text-gray-500 hover:text-blue-600 transition-colors"
            title="Scroll to top"
          >
            <FaArrowUp className="w-3 h-3 mx-auto" />
          </button>
        )}
      </div>
    </div>
  );

  // Render based on variant
  switch (variant) {
    case 'circle':
      return renderCircularProgress();
    case 'minimal':
      return renderMinimalProgress();
    case 'fixed':
      return renderFixedProgress();
    default:
      return renderProgressBar();
  }
};

export default ReadingProgress;