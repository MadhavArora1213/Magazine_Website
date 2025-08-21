import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TransitionProvider, useTransition } from './context/TransitionContext';
import Loading from './Components/Loading';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Popup from './Components/Popup';
import HomePage from './Pages/HomePage';
import AboutPage from './Pages/AboutPage';
import PrivacyPolicySection from './Components/PrivacyPolicySection';
import TermsAndConditions from './Pages/TermsAndConditions';
import CookiePolicySection from './Components/Cookie_Policy';
import EditorialStandardsSection from './Components/EditorialStandards';
import CorrectionPolicySection from './Components/CorrectionPolicy';
import CopyrightInformationSection from './Components/CopyrightInformation';
import DisclaimerSection from './Components/Disclaimer';
import MissionVision from './Pages/MissionVision';
import OurTeam from './Pages/OurTeam'; // <-- Import OurTeam page
import EditorialGuidelines from './Pages/Editorial_Guidelines'; // Add this import
import Careers from './Pages/Careers'; // Add this import
import AwardsRecognition from './Pages/AwardsRecognition'; // Add this import
import AdvertiseWithUs from './Pages/AdvertiseWithUs'; // Add this import
import ContactUsForm from './Pages/ContactUsForm'; // Add this import
import EditorialContact from './Pages/EditorialContact'; // Add this import
// New imports for additional pages
import TechnicalSupport from './Pages/TechnicalSupport';
import OfficeLocations from './Pages/OfficeLocations';
import SocialMediaLinks from './Pages/SocialMediaLinks';
import MediaKit from './Pages/MediaKit';
import PressReleases from './Pages/PressReleases';
import RSSFeeds from './Pages/RSSFeeds';
import Archive from './Pages/Archive';
import SiteSearch from './Pages/SiteSearch';
import NewsletterArchive from './Pages/NewsletterArchive';
import AdvertisingEnquiries from './Pages/AdvertisingEnquiries';
import EventsPage from './Pages/EventsPage';
import Flipbook from './Pages/Flipbook';
import Entertainment from './Pages/Category/Entertainment'; // <-- Add this import
import PeopleProfile from './Pages/Category/People&Profile';
import Lifestyle from './Pages/Category/Lifestyle'; // Add this import
import BusinessLeadership from './Pages/Category/Business&Leadership';
import CultureSociety from './Pages/Category/Culture&Society';
import SpecialSection from './Pages/Category/SpecialSection';
import RegionalFocus from './Pages/Category/RegionalFocus';
import CelebritySpotlight from './Pages/SubCategory/CelebritySpotlight';
import InfluencerStories from './Pages/SubCategory/InfluencerStories'; // <-- Add this import
import Changemakers from './Pages/SubCategory/Changemakers';
import BusinessLeaders from './Pages/SubCategory/BusinessLeaders';
import InternationalIcons from './Pages/SubCategory/InternationalIcons';
import Entrepreneurs from './Pages/SubCategory/Entrepreneurs';
import LocalPersonalities from './Pages/SubCategory/LocalPersonalities';
import RisingStars from './Pages/SubCategory/RisingStars';
import BollywoodNews from './Pages/SubCategory/Entertainment/BollywoodNews';
import CelebrityInterviews from './Pages/SubCategory/Entertainment/CelebrityInterviews';
import HollywoodUpdates from './Pages/SubCategory/Entertainment/HollywoodUpdates';
import MovieReviews from './Pages/SubCategory/Entertainment/MovieReviews';
import MusicArtists from './Pages/SubCategory/Entertainment/Music&Artists';
import RedCarpetEvents from './Pages/SubCategory/Entertainment/RedCarpetEvents';
import TvShowsSeries from './Pages/SubCategory/Entertainment/TvShows&Series';
import AwardShows from './Pages/SubCategory/Entertainment/AwardShows';
import BehindTheScenes from './Pages/SubCategory/Entertainment/BehindTheScenes';
import AdminIndex from './Admin/AdminIndex';

// RouteChangeDetector for detecting route changes
const RouteChangeDetector = ({ children }) => {
  const { isLoading, setIsLoading } = useTransition();
  
  return (
    <>
      <Loading isLoading={isLoading} setIsLoading={setIsLoading} />
      {children}
    </>
  );
};

const MainSiteLayout = ({ children }) => (
  <>
    <Header />
    <main className="flex-grow pt-20">{children}</main>
    <Footer />
    <Popup />
  </>
);

function App() {
  return (
    <TransitionProvider>
      <Router>
        <Routes>
          {/* Admin panel: no header/footer */}
          <Route path="/admin/*" element={<AdminIndex />} />

          {/* Main site: header/footer shown */}
          <Route
            path="*"
            element={
              <RouteChangeDetector>
                <MainSiteLayout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/our-team" element={<OurTeam />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/awards" element={<AwardsRecognition />} />
                    <Route path="/advertise" element={<AdvertiseWithUs />} />
                    <Route path="/contact" element={<ContactUsForm />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicySection />} />
                    <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                    <Route path="/cookies" element={<CookiePolicySection />} />
                    <Route path="/editorial-standards" element={<EditorialStandardsSection />} />
                    <Route path="/editorial-guidelines" element={<EditorialGuidelines />} />
                    <Route path="/editorial-contact" element={<EditorialContact />} />
                    <Route path="/correction-policy" element={<CorrectionPolicySection />} />
                    <Route path="/copyright" element={<CopyrightInformationSection />} />
                    <Route path="/disclaimer" element={<DisclaimerSection />} />
                    <Route path="/mission-vision" element={<MissionVision />} />

                    {/* New routes for additional pages */}
                    <Route path="/support" element={<TechnicalSupport />} />
                    <Route path="/locations" element={<OfficeLocations />} />
                    <Route path="/social-media" element={<SocialMediaLinks />} />
                    <Route path="/media-kit" element={<MediaKit />} />
                    <Route path="/press" element={<PressReleases />} />
                    <Route path="/rss" element={<RSSFeeds />} />
                    <Route path="/archive" element={<Archive />} />
                    <Route path="/search" element={<SiteSearch />} />
                    <Route path="/newsletter-archive" element={<NewsletterArchive />} />
                    <Route path="/advertising" element={<AdvertisingEnquiries />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/flipbook" element={<Flipbook />} />
                    
                    {/* Category routes */}
                    <Route path="/entertainment" element={<Entertainment />} />
                    <Route path="/people" element={<PeopleProfile />} />
                    <Route path="/lifestyle" element={<Lifestyle />} />
                    <Route path="/business" element={<BusinessLeadership />} />
                    <Route path="/culture" element={<CultureSociety />} />
                    <Route path="/special" element={<SpecialSection />} />
                    <Route path="/regional" element={<RegionalFocus />} />
                    <Route path="/people/celebrity-spotlight" element={<CelebritySpotlight />} />
                    <Route path="/people/influencer-stories" element={<InfluencerStories />} /> {/* <-- Add this route */}
                    <Route path="/people/changemakers" element={<Changemakers />} />
                    <Route path="/people/leaders" element={<BusinessLeaders />} />
                    <Route path="/people/international-icons" element={<InternationalIcons />} />
                    <Route path="/people/entrepreneurs" element={<Entrepreneurs />} />
                    <Route path="/people/local-personalities" element={<LocalPersonalities />} />
                    <Route path="/people/rising-stars" element={<RisingStars />} />

                    {/* Entertainment subcategory routes */}
                    <Route path="/entertainment/bollywood-news" element={<BollywoodNews />} />
                    <Route path="/entertainment/celebrity-interviews" element={<CelebrityInterviews />} />
                    <Route path="/entertainment/hollywood-updates" element={<HollywoodUpdates />} />
                    <Route path="/entertainment/movie-reviews" element={<MovieReviews />} />
                    <Route path="/entertainment/music-artists" element={<MusicArtists />} />
                    <Route path="/entertainment/red-carpet-events" element={<RedCarpetEvents />} />
                    <Route path="/entertainment/tv-shows-series" element={<TvShowsSeries />} />
                    <Route path="/entertainment/award-shows" element={<AwardShows />} />
                    <Route path="/entertainment/behind-the-scenes" element={<BehindTheScenes />} />

                    <Route path="*" element={<div className="flex justify-center items-center h-screen">Page not found</div>} />
                  </Routes>
                </MainSiteLayout>
              </RouteChangeDetector>
            }
          />
        </Routes>
      </Router>
    </TransitionProvider>
  );
}

export default App;
// filepath: c:\Users\DELL\OneDrive\Desktop\Magazine_Website\Magazine_Website\src\App.jsx
