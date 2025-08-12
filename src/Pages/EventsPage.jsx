import React, { useState } from 'react';

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showTopEvents, setShowTopEvents] = useState(false);
  const [showMediaPartner, setShowMediaPartner] = useState(false);
  const [showDiscountCodes, setShowDiscountCodes] = useState(false);
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    startDate: '',
    endDate: '',
    location: '',
    venue: '',
    category: '',
    industry: '',
    description: '',
    website: '',
    organizer: '',
    contactEmail: '',
    contactPhone: '',
    registrationFee: '',
    hasMediaPartner: false,
    hasDiscountCode: false
  });

  // Real events data from Excel file
  const events = [
    {
      id: 1,
      title: 'Paper Arabia',
      startDate: '2025-09-02',
      endDate: '2025-09-04',
      location: 'Dubai, UAE',
      venue: 'DWTC - Hall 4',
      category: 'Exhibition',
      industry: 'Paper, Packaging and Printing',
      description: 'The premier exhibition for paper, packaging and printing industry in the Middle East region.',
      fullDescription: 'Paper Arabia is the leading trade exhibition for the paper, packaging and printing industry in the Middle East. The event brings together manufacturers, suppliers, distributors and buyers from across the region to showcase the latest innovations, technologies and solutions in the industry.',
      tags: ['Paper', 'Packaging', 'Printing', 'Trade'],
      isTopEvent: true,
      hasMediaPartner: true,
      hasDiscountCode: false,
      website: 'https://www.paperarabia.com/',
      organizer: 'Al Fajer Information & Services',
      registrationFee: 'Free',
      contact: 'nair@alfajer.net'
    },
    {
      id: 2,
      title: 'FESPA Middle East',
      startDate: '2026-01-13',
      endDate: '2026-01-15',
      location: 'Dubai, UAE',
      venue: 'DEC, Expo City',
      category: 'Exhibition',
      industry: 'Printing and Signage',
      description: 'The leading exhibition for printing and signage industry in the Middle East.',
      fullDescription: 'FESPA Middle East is the premier trade exhibition for the printing and signage industry in the Middle East region. The event showcases the latest printing technologies, digital signage solutions, and innovative materials for the growing regional market.',
      tags: ['Printing', 'Signage', 'Digital', 'Technology'],
      isTopEvent: true,
      hasMediaPartner: true,
      hasDiscountCode: false,
      website: 'https://www.fespamiddleeast.com/',
      organizer: 'FESPA',
      registrationFee: 'Free',
      contact: 'sales@fespa.com'
    },
    {
      id: 3,
      title: 'Blockchain Life',
      startDate: '2025-10-28',
      endDate: '2025-10-29',
      location: 'Dubai, UAE',
      venue: 'Festival Arena',
      category: 'Conference',
      industry: 'Web 3 / Blockchain / Crypto',
      description: 'Leading blockchain and cryptocurrency conference in the Middle East.',
      fullDescription: 'Blockchain Life is one of the most significant blockchain and cryptocurrency events in the region, bringing together industry leaders, investors, developers, and enthusiasts to discuss the latest trends, innovations, and opportunities in the Web3 ecosystem.',
      tags: ['Blockchain', 'Crypto', 'Web3', 'Technology'],
      isTopEvent: true,
      hasMediaPartner: true,
      hasDiscountCode: true,
      website: 'https://blockchain-life.com/',
      organizer: 'Blockchain Life',
      registrationFee: 'Paid',
      contact: 'info@blockchain-life.com'
    },
    {
      id: 4,
      title: 'Token 2049 Dubai',
      startDate: '2026-04-29',
      endDate: '2026-04-30',
      location: 'Dubai, UAE',
      venue: 'Madinat Jumeirah',
      category: 'Conference',
      industry: 'Web 3 / Blockchain / Crypto',
      description: 'Premier crypto conference bringing together the global Web3 ecosystem.',
      fullDescription: 'Token 2049 Dubai is one of the most influential crypto conferences globally, featuring top-tier speakers, networking opportunities, and insights into the future of blockchain technology and digital assets.',
      tags: ['Crypto', 'Blockchain', 'Web3', 'Investment'],
      isTopEvent: true,
      hasMediaPartner: true,
      hasDiscountCode: true,
      website: 'https://www.dubai.token2049.com/',
      organizer: 'Token 2049',
      registrationFee: 'Paid',
      contact: 'info@token2049.com'
    },
    {
      id: 5,
      title: 'International Real Estate & Investment Show',
      startDate: '2025-09-12',
      endDate: '2025-09-14',
      location: 'Abu Dhabi, UAE',
      venue: 'ADNEC - Hall 5',
      category: 'Exhibition',
      industry: 'Real Estate',
      description: 'Leading real estate and investment exhibition in the UAE.',
      fullDescription: 'The International Real Estate & Investment Show is the premier platform for real estate professionals, investors, and developers to showcase properties, investment opportunities, and industry innovations across the UAE and international markets.',
      tags: ['Real Estate', 'Investment', 'Property', 'Development'],
      isTopEvent: false,
      hasMediaPartner: true,
      hasDiscountCode: false,
      website: 'https://realestateshow.ae/',
      organizer: 'DOME Exhibitions',
      registrationFee: 'Free',
      contact: 'arun.bose@domeexhibitions.com'
    },
    {
      id: 6,
      title: 'Dubai International Boat Show',
      startDate: '2026-04-08',
      endDate: '2026-04-12',
      location: 'Dubai, UAE',
      venue: 'Dubai Harbour',
      category: 'Show',
      industry: 'Lifestyle (Yacht)',
      description: 'The premier boat and yacht show in the Middle East region.',
      fullDescription: 'Dubai International Boat Show is the leading marine lifestyle event in the Middle East, showcasing luxury yachts, boats, marine equipment, and water sports accessories from leading international brands.',
      tags: ['Yacht', 'Marine', 'Luxury', 'Lifestyle'],
      isTopEvent: false,
      hasMediaPartner: true,
      hasDiscountCode: false,
      website: 'https://www.boatshowdubai.com/',
      organizer: 'DWTC',
      registrationFee: 'Paid',
      contact: 'Neeraj.Dalal@dwtc.com'
    },
    {
      id: 7,
      title: 'Watch & Jewellery Middle East Show',
      startDate: '2025-10-24',
      endDate: '2025-10-28',
      location: 'Sharjah, UAE',
      venue: 'Expo Centre Sharjah',
      category: 'Exhibition',
      industry: 'Lifestyle (Watches and Jewellery)',
      description: 'The largest watch and jewellery exhibition in the Middle East.',
      fullDescription: 'The Watch & Jewellery Middle East Show is the region\'s most prestigious exhibition for timepieces, fine jewellery, precious stones, and luxury accessories, attracting buyers and exhibitors from around the world.',
      tags: ['Watches', 'Jewellery', 'Luxury', 'Gems'],
      isTopEvent: false,
      hasMediaPartner: true,
      hasDiscountCode: false,
      website: 'https://www.mideastjewellery.com/',
      organizer: 'Expo Centre Sharjah',
      registrationFee: 'Free',
      contact: 'Not available'
    },
    {
      id: 8,
      title: 'Middle East Cosmetics Show',
      startDate: '2025-10-08',
      endDate: '2025-10-12',
      location: 'Sharjah, UAE',
      venue: 'Expo Centre Sharjah',
      category: 'Exhibition',
      industry: 'Lifestyle (Beauty and Cosmetics)',
      description: 'Leading beauty and cosmetics exhibition in the Middle East.',
      fullDescription: 'The Middle East Cosmetics Show is the premier trade exhibition for beauty, cosmetics, personal care, and wellness products in the region, featuring the latest trends, innovations, and brands in the beauty industry.',
      tags: ['Beauty', 'Cosmetics', 'Skincare', 'Wellness'],
      isTopEvent: false,
      hasMediaPartner: false,
      hasDiscountCode: false,
      website: 'https://mecosmeticsshow.ae/',
      organizer: 'Expo Centre Sharjah',
      registrationFee: 'Free',
      contact: 'hosam.m@expo-centre.ae'
    },
    {
      id: 9,
      title: 'The Dubai Fixed Income Alternatives Conference',
      startDate: '2025-10-09',
      endDate: '2025-10-09',
      location: 'Dubai, UAE',
      venue: 'DIFC - Ritz Carlton',
      category: 'Conference',
      industry: 'Banking and Capital Markets',
      description: 'Premier conference for fixed income and alternative investments.',
      fullDescription: 'The Dubai Fixed Income Alternatives Conference brings together institutional investors, fund managers, and financial professionals to discuss the latest trends, opportunities, and challenges in fixed income and alternative investment markets.',
      tags: ['Finance', 'Investment', 'Banking', 'Capital Markets'],
      isTopEvent: false,
      hasMediaPartner: true,
      hasDiscountCode: true,
      website: 'https://www.dealcatalyst.io/events/dubai-fixed-income-alternatives-conference',
      organizer: 'Deal Catalyst',
      registrationFee: 'Free / Paid',
      contact: 'events@dealcatalyst.io'
    },
    {
      id: 10,
      title: 'Dubai Future Forum 2025',
      startDate: '2025-11-18',
      endDate: '2025-11-19',
      location: 'Dubai, UAE',
      venue: 'Dubai Future Foundation',
      category: 'Conference',
      industry: 'Future Technology',
      description: 'Leading forum for future technologies and innovation.',
      fullDescription: 'Dubai Future Forum is a premier global platform that brings together world leaders, innovators, and visionaries to explore emerging technologies, discuss future trends, and shape the roadmap for tomorrow\'s world.',
      tags: ['Future Tech', 'Innovation', 'AI', 'Sustainability'],
      isTopEvent: true,
      hasMediaPartner: true,
      hasDiscountCode: false,
      website: 'https://www.dubaifuture.ae/dubai-future-forum-2025',
      organizer: 'Dubai Future Foundation',
      registrationFee: 'Free',
      contact: 'forum@dubaifuture.ae'
    }
  ];

  const categories = ['Exhibition', 'Conference', 'Show'];
  const locations = ['Dubai, UAE', 'Abu Dhabi, UAE', 'Sharjah, UAE'];
  const industries = [
    'Paper, Packaging and Printing',
    'Printing and Signage',
    'Web 3 / Blockchain / Crypto',
    'Real Estate',
    'Lifestyle (Yacht)',
    'Lifestyle (Watches and Jewellery)',
    'Lifestyle (Beauty and Cosmetics)',
    'Banking and Capital Markets',
    'Future Technology'
  ];

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || event.category === selectedCategory;
    const matchesLocation = !selectedLocation || event.location === selectedLocation;
    const matchesTopEvents = !showTopEvents || event.isTopEvent;
    const matchesMediaPartner = !showMediaPartner || event.hasMediaPartner;
    const matchesDiscountCodes = !showDiscountCodes || event.hasDiscountCode;
    
    return matchesSearch && matchesCategory && matchesLocation && matchesTopEvents && matchesMediaPartner && matchesDiscountCodes;
  });

  const topEvents = events.filter(event => event.isTopEvent);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLocation('');
    setShowTopEvents(false);
    setShowMediaPartner(false);
    setShowDiscountCodes(false);
    setShowPastEvents(false);
  };

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    }
    
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmitEvent = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Event submission:', formData);
    alert('Thank you for submitting your event! We will review it and get back to you soon.');
    setShowSubmissionForm(false);
    // Reset form
    setFormData({
      eventName: '',
      startDate: '',
      endDate: '',
      location: '',
      venue: '',
      category: '',
      industry: '',
      description: '',
      website: '',
      organizer: '',
      contactEmail: '',
      contactPhone: '',
      registrationFee: '',
      hasMediaPartner: false,
      hasDiscountCode: false
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#162048] via-[#1a237e] to-[#283593] min-h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 border border-white rounded-full transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 border border-white rounded-full transform -translate-x-16 translate-y-16"></div>
          <div className="absolute top-1/2 right-1/4 w-48 h-48 border border-white rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <p className="text-white/80 text-lg mb-4 font-medium">
              IF AN INDUSTRY EVENT TAKES PLACE AND YOU'RE NOT ATTENDING, DID IT REALLY HAPPEN?
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              All UAE Events Calendar 2025 - 2026
            </h1>
            <p className="text-white/90 text-xl mb-8 max-w-3xl leading-relaxed">
              The 2025 UAE events calendar features exhibitions, conferences, and shows across Dubai, Abu Dhabi, and Sharjah. Connect with industry leaders, discover innovations, and expand your network at premier events in the region.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowSubmissionForm(true)}
                className="bg-[#1a1a1a] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-black transition-colors"
              >
                Submit Your Event
              </button>
              <button className="bg-white text-[#162048] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Sidebar - Filters */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                <h3 className="text-xl font-bold text-[#162048] mb-6">Filter Events</h3>
                
                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Event name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#162048] focus:border-transparent"
                    />
                    <svg className="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                </div>

                {/* Category Dropdown */}
                <div className="mb-6">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#162048] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Location Dropdown */}
                <div className="mb-6">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#162048] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Location</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                {/* Toggle Switches */}
                <div className="space-y-4 mb-6">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={showTopEvents}
                        onChange={(e) => setShowTopEvents(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full transition-colors ${showTopEvents ? 'bg-[#162048]' : 'bg-gray-300'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${showTopEvents ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}></div>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-700 font-medium">Top UAE Events</span>
                  </label>

                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={showMediaPartner}
                        onChange={(e) => setShowMediaPartner(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full transition-colors ${showMediaPartner ? 'bg-[#162048]' : 'bg-gray-300'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${showMediaPartner ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}></div>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-700 font-medium">Media Partner</span>
                  </label>

                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={showDiscountCodes}
                        onChange={(e) => setShowDiscountCodes(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full transition-colors ${showDiscountCodes ? 'bg-[#162048]' : 'bg-gray-300'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${showDiscountCodes ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}></div>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-700 font-medium">Discount Codes</span>
                  </label>

                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={showPastEvents}
                        onChange={(e) => setShowPastEvents(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full transition-colors ${showPastEvents ? 'bg-[#162048]' : 'bg-gray-300'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${showPastEvents ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}></div>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-700 font-medium">Show Past Events</span>
                  </label>
                </div>

                {/* Clear All Button */}
                <button
                  onClick={clearAllFilters}
                  className="text-[#162048] font-medium hover:text-[#1a1a1a] transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Center Content - Events List */}
            <div className="lg:col-span-6">
              {/* Featured Event */}
              {filteredEvents.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[#162048] mb-6">Featured Upcoming UAE Event</h2>
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-[#162048] to-[#1a237e] text-white p-6">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">
                          {formatDateRange(filteredEvents[0].startDate, filteredEvents[0].endDate).toUpperCase()}
                        </span>
                        <span className="text-lg font-bold">
                          {filteredEvents[0].location.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {filteredEvents[0].tags.map(tag => (
                          <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4">{filteredEvents[0].title}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {expandedEvent === filteredEvents[0].id ? filteredEvents[0].fullDescription : filteredEvents[0].description}
                      </p>
                      <button
                        onClick={() => setExpandedEvent(expandedEvent === filteredEvents[0].id ? null : filteredEvents[0].id)}
                        className="text-[#162048] font-medium hover:text-[#1a1a1a] mb-4 flex items-center"
                      >
                        Read {expandedEvent === filteredEvents[0].id ? 'less' : 'more'}
                        <svg className={`w-4 h-4 ml-1 transform transition-transform ${expandedEvent === filteredEvents[0].id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </button>
                      <a
                        href={filteredEvents[0].website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-[#162048] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#1a1a1a] transition-colors"
                      >
                        VISIT WEBSITE
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* All Events */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#162048] mb-6">All Events</h2>
                <div className="space-y-6">
                  {filteredEvents.slice(1).map(event => (
                    <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-[#162048] to-[#1a237e] text-white p-4">
                        <div className="flex justify-between items-center">
                          <span className="font-bold">
                            {formatDateRange(event.startDate, event.endDate).toUpperCase()}
                          </span>
                          <span className="font-bold">
                            {event.location.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {event.tags.map(tag => (
                            <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">{event.title}</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {expandedEvent === event.id ? event.fullDescription : event.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                            className="text-[#162048] font-medium hover:text-[#1a1a1a] flex items-center"
                          >
                            Read {expandedEvent === event.id ? 'less' : 'more'}
                            <svg className={`w-4 h-4 ml-1 transform transition-transform ${expandedEvent === event.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                          </button>
                          <a
                            href={event.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-[#162048] font-bold hover:text-[#1a1a1a] transition-colors"
                          >
                            VISIT WEBSITE
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Calendar and Top Events */}
            <div className="lg:col-span-3">
              <div className="space-y-6">
                {/* Calendar Widget */}
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                      </svg>
                    </button>
                    <h3 className="text-lg font-bold text-[#162048]">
                      {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                      <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: getFirstDayOfMonth(currentDate) }, (_, i) => (
                      <div key={`empty-${i}`} className="h-8"></div>
                    ))}
                    {Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => {
                      const day = i + 1;
                      // Check if this day has any events
                      const hasEvent = events.some(event => {
                        const startDate = new Date(event.startDate);
                        const endDate = new Date(event.endDate);
                        const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                        
                        return currentDay >= startDate && currentDay <= endDate &&
                               startDate.getMonth() === currentDate.getMonth() &&
                               startDate.getFullYear() === currentDate.getFullYear();
                      });
                      
                      return (
                        <div
                          key={day}
                          className={`h-8 flex items-center justify-center text-sm rounded-lg cursor-pointer transition-colors ${
                            hasEvent
                              ? 'bg-[#162048] text-white font-bold'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                  
                  <button className="w-full mt-4 text-[#162048] font-medium hover:text-[#1a1a1a] transition-colors">
                    Back to Today
                  </button>
                </div>

                {/* Top Events Sidebar */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-[#162048] mb-4">Top UAE Conferences & Events</h3>
                  <div className="space-y-4">
                    {topEvents.map(event => (
                      <div key={event.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                        <h4 className="font-bold text-[#1a1a1a] mb-2 hover:text-[#162048] cursor-pointer transition-colors">
                          {event.title}
                        </h4>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <span>{formatDateRange(event.startDate, event.endDate)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Submission Section */}
      <section className="py-16 bg-gradient-to-br from-[#162048] to-[#1a237e] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Get Featured</h2>
            <h3 className="text-2xl md:text-3xl font-bold mb-8">
              LET THE UAE BUSINESS COMMUNITY KNOW ABOUT YOUR EVENT
            </h3>
            <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
              Do you have an exhibition, conference, show, or business event coming up in the UAE? Submit it to our UAE Events Calendar so it gets the attention it deserves and reaches the right audience!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-2">Boost Visibility</h4>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-2">Drive Attendance</h4>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-2">Connect with Industry Leaders</h4>
              </div>
            </div>
            <button
              onClick={() => setShowSubmissionForm(true)}
              className="bg-white/20 backdrop-blur-sm text-white px-12 py-4 rounded-lg font-bold text-xl hover:bg-white/30 transition-colors border border-white/30"
            >
              Submit Your Event
            </button>
          </div>
        </div>
      </section>

      {/* Event Submission Modal */}
      {showSubmissionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#162048] to-[#1a237e] text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Submit Your Event</h2>
                <button
                  onClick={() => setShowSubmissionForm(false)}
                  className="text-white hover:text-gray-300 text-3xl font-bold"
                >
                  ×
                </button>
              </div>
              <p className="text-white/90 mt-2">Fill out the form below to submit your event for review</p>
            </div>
            
            <form onSubmit={handleSubmitEvent} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#162048] mb-2">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#162048] focus:border-transparent"
                    placeholder="Enter your event name"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-bold text-[#162048] mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#162048] focus:border-transparent"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-bold text-[#162048] mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#162048] focus:border-transparent"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-bold text-[#162048] mb-2">
                    Location *
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#162048] focus:border-transparent"
                  >
                    <option value="">Select Location</option>
                    <option value="Dubai, UAE">Dubai, UAE</option>
                    <option value="Abu Dhabi, UAE">Abu Dhabi, UAE</option>
                    <option value="Sharjah, UAE">Sharjah, UAE</option>
                    <option value="Other UAE">Other UAE</option>
                  </select>
                </div>

                {/* Venue */}
                <div>
                  <label className="block text-sm font-bold text-[#162048] mb-2">
                    Venue
                  </label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#162048] focus:border-transparent"
                    placeholder="e.g., DWTC, ADNEC, Expo Centre Sharjah"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-bold text-[#162048] mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#162048] focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    <option value="Exhibition">Exhibition</option>
                    <option value="Conference">Conference</option>
                    <option value="Show">Show</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                  </select>
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-sm font-bold text-[#162048] mb-2">
                    Industry
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#162048] focus:border-transparent"
                    placeholder="e.g., Technology, Healthcare, Finance"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#162048] mb-2">
                    Event Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#162048] focus:border-transparent"
                    placeholder="Provide a detailed description of your event"
                  ></textarea>
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-bold text-[#162048] mb-2">
                    Event Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#162048] focus:border-transparent"
                    placeholder="https://your-event-website.com"
                  />
                </div>

                {/* Organizer */}
                <div>
                  <label className="block text-sm font-bold text-[#162048] mb-2">
                    Organizer *
                  </label>
                  <input
                    type="text"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#162048] focus:border-transparent"
                    placeholder="Event organizing company/organization"
                  />
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-sm font-bold text-[#162048] mb-2">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#162048] focus:border-transparent"
                    placeholder="contact@example.com"
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-sm font-bold text-[#162048] mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#162048] focus:border-transparent"
                    placeholder="+971 XX XXX XXXX"
                  />
                </div>

                {/* Registration Fee */}
                <div>
                  <label className="block text-sm font-bold text-[#162048] mb-2">
                    Registration Fee
                  </label>
                  <select
                    name="registrationFee"
                    value={formData.registrationFee}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#162048] focus:border-transparent"
                  >
                    <option value="">Select Fee Type</option>
                    <option value="Free">Free</option>
                    <option value="Paid">Paid</option>
                    <option value="Free / Paid">Free / Paid</option>
                  </select>
                </div>

                {/* Checkboxes */}
                <div className="md:col-span-2">
                  <div className="space-y-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="hasMediaPartner"
                        checked={formData.hasMediaPartner}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-[#162048] border-gray-300 rounded focus:ring-[#162048]"
                      />
                      <span className="ml-3 text-gray-700 font-medium">This event has media partners</span>
                    </label>

                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="hasDiscountCode"
                        checked={formData.hasDiscountCode}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-[#162048] border-gray-300 rounded focus:ring-[#162048]"
                      />
                      <span className="ml-3 text-gray-700 font-medium">This event offers discount codes</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="bg-[#162048] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#1a1a1a] transition-colors"
                >
                  Submit Event for Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowSubmissionForm(false)}
                  className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;