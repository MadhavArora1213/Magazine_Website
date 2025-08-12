import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TransitionProvider, useTransition } from './context/TransitionContext';
import Loading from './Components/Loading';
import Header from './Components/Header';
import Footer from './Components/Footer';
import HomePage from './Pages/HomePage';
import AboutPage from './Pages/AboutPage';
import PrivacyPolicySection from './Components/PrivacyPolicySection';
import Popup from './Components/Popup';
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

function App() {
  return (
    <TransitionProvider>
      <Router>
        <RouteChangeDetector>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-20">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/our-team" element={<OurTeam />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/awards" element={<AwardsRecognition />} />
                <Route path="/advertise" element={<AdvertiseWithUs />} />
                <Route path="/contact" element={<ContactUsForm />} /> {/* Contact Us Form route */}
                <Route path="/privacy-policy" element={<PrivacyPolicySection />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                <Route path="/cookies" element={<CookiePolicySection />} />
                <Route path="/editorial-standards" element={<EditorialStandardsSection />} />
                <Route path="/editorial-guidelines" element={<EditorialGuidelines />} /> {/* Editorial Guidelines route */}
               <Route path="/editorial-contact" element={<EditorialContact />} /> {/* Editorial Contact route */}
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
                
                <Route path="*" element={<div className="flex justify-center items-center h-screen">Page not found</div>} />
              </Routes>
            </main>
            <Footer />
            <Popup />
          </div>
        </RouteChangeDetector>
      </Router>
    </TransitionProvider>
  );
}

export default App;
// filepath: c:\Users\DELL\OneDrive\Desktop\Magazine_Website\Magazine_Website\src\App.jsx
