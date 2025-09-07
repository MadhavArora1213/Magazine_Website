import React from 'react';
import HeroSlider from '../Components/HeroSlider';
import BreakingNewsTicker from '../Components/BreakingNewsTicker';
import TrendingTagsBar from '../Components/TrendingTagsBar';
import FeaturedGrid from '../Components/FeaturedGrid';
import CategoryQuickAccess from '../Components/CategoryQuickAccess';
import SuggestedReads from '../Components/SuggestedReads';
import NewsletterSignup from '../Components/NewsletterSignup';
import WeatherWidget from '../Components/WeatherWidget';
import StockTicker from '../Components/StockTicker';
import SocialBar from '../Components/SocialBar';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Slider with Top Stories */}
      <HeroSlider />

      {/* Breaking News Ticker */}
      <BreakingNewsTicker />

      {/* Trending Tags Bar */}
      <TrendingTagsBar />

      {/* Featured Articles Grid */}
      <FeaturedGrid />

      {/* Category Quick Access */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <CategoryQuickAccess />
      </div>

      {/* Suggested Reads Algorithm */}
      <SuggestedReads />

      {/* Newsletter Signup (Email + WhatsApp) */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <NewsletterSignup />
      </div>

      {/* Weather Widget */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <WeatherWidget />
      </div>

      {/* Stock Market Ticker */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <StockTicker />
      </div>

      {/* Social Media Integration */}
      <SocialBar />
    </div>
  );
};

export default HomePage;