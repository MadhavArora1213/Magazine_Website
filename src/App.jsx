import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TransitionProvider, useTransition } from './context/TransitionContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Loading from './Components/Loading';
import Header from './Components/Header';
import Footer from './Components/Footer';
import ToastContainer from './Components/ToastContainer';
// Authentication Components
import { LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm, VerifyEmail, MFASetup, UserProfile, RoleManagement } from './components/Auth';
// CMS Components
import { CMSDashboard } from './components/CMS';
// Article Components
import ArticleRenderer from './Components/ArticleRenderer';
import HomePage from './Pages/HomePage';
import AboutPage from './Pages/AboutPage';
import Dashboard from './Pages/Dashboard';
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
// Import new module components
import { AdvancedSearch, SearchResults, SearchSuggestions, SavedSearches } from './Components/Search';
import { MediaLibrary, MediaUploader, ImageGallery, VideoPlayer, MediaEditor, MediaMetadata, BulkMediaActions } from './Components/Media';
import { NewsletterSignup, NewsletterPreferences, NewsletterBuilder, EmailTemplateEditor, WhatsAppIntegration, CommunicationLog, SubscriberManagement, NewsletterManagement } from './Components/Newsletter';
import NewsletterArchive from './Pages/NewsletterArchive';
import NewsletterConfirm from './Pages/NewsletterConfirm';
import NewsletterSuccess from './Pages/NewsletterSuccess';
import AdvertisingEnquiries from './Pages/AdvertisingEnquiries';
import EventsPage from './Pages/EventsPage';
import Flipbook from './Pages/Flipbook';
import TrendingPage from './Pages/TrendingPage';
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
import NewsletterSubscriptionPopup from './Components/Newsletter/NewsletterSubscriptionPopup';
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

// RouteChangeDetector for detecting route changes
const RouteChangeDetector = ({ children, excludeLoading = false }) => {
  const { isLoading, setIsLoading } = useTransition();

  return (
    <>
      {!excludeLoading && <Loading isLoading={isLoading} setIsLoading={setIsLoading} />}
      {children}
    </>
  );
};

const MainSiteLayout = ({ children }) => (
  <>
    <Header />
    <main className="flex-grow pt-20">{children}</main>
    <Footer />
  </>
);

function App() {
  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false);

  useEffect(() => {
    // Check if user has already seen/dismissed the newsletter popup
    const hasSeenNewsletter = localStorage.getItem('newsletter-popup-seen');
    const hasSubscribed = localStorage.getItem('newsletter-subscribed');

    // Show popup if user hasn't seen it and hasn't subscribed
    if (!hasSeenNewsletter && !hasSubscribed) {
      // Show after a short delay to not interrupt initial page load
      const timer = setTimeout(() => {
        setShowNewsletterPopup(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleNewsletterSubscribe = (subscriptionData) => {
    // Mark as subscribed to prevent showing popup again
    localStorage.setItem('newsletter-subscribed', 'true');
    setShowNewsletterPopup(false);
  };

  const handleNewsletterClose = () => {
    // Mark as seen to prevent showing popup again
    localStorage.setItem('newsletter-popup-seen', 'true');
    setShowNewsletterPopup(false);
  };

  return (
    <ToastProvider>
      <AuthProvider>
        <TransitionProvider>
          <Router>
          <Routes>
            {/* Admin panel: no header/footer */}
            <Route path="/admin/*" element={<AdminIndex />} />

            {/* Authentication routes - no loading animation */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            <Route path="/reset-password/:token" element={<ResetPasswordForm />} />

            {/* Main site: header/footer shown with loading animation */}
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
                    <Route path="/advanced-search" element={<AdvancedSearch />} />
                    <Route path="/search-results" element={<SearchResults />} />
                    <Route path="/search-suggestions" element={<SearchSuggestions />} />
                    <Route path="/saved-searches" element={<SavedSearches />} />
                    <Route path="/media-library" element={<MediaLibrary showUploader={false} />} />
                    <Route path="/media-upload" element={<MediaUploader />} />
                    <Route path="/image-gallery" element={<ImageGallery />} />
                    <Route path="/video-player" element={<VideoPlayer />} />
                    <Route path="/media-editor" element={<MediaEditor />} />
                    <Route path="/media-metadata" element={<MediaMetadata />} />
                    <Route path="/bulk-media-actions" element={<BulkMediaActions />} />
                    <Route path="/newsletter-archive" element={<NewsletterArchive />} />
                    <Route path="/newsletter/confirm" element={<NewsletterConfirm />} />
                    <Route path="/newsletter/success" element={<NewsletterSuccess />} />
                    <Route path="/newsletter-signup" element={<NewsletterSignup />} />
                    <Route path="/newsletter-preferences" element={<NewsletterPreferences />} />
                    <Route path="/newsletter-builder" element={<NewsletterBuilder />} />
                    <Route path="/email-template-editor" element={<EmailTemplateEditor />} />
                    <Route path="/whatsapp-integration" element={<WhatsAppIntegration />} />
                    <Route path="/communication-log" element={<CommunicationLog />} />
                    <Route path="/subscriber-management" element={<SubscriberManagement />} />
                    <Route path="/newsletter-management" element={<NewsletterManagement />} />
                    <Route path="/advertising" element={<AdvertisingEnquiries />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/flipbook" element={<Flipbook />} />
                    <Route path="/flipbook/:id" element={<Flipbook />} />
                    <Route path="/trending" element={<TrendingPage />} />

                    {/* Protected routes */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/mfa-setup" element={<MFASetup />} />
                    <Route path="/admin/roles" element={<RoleManagement />} />

                    {/* CMS routes */}
                    <Route path="/cms/*" element={<CMSDashboard />} />

                    {/* Article routes */}
                    <Route path="/articles/:id" element={<ArticleRenderer />} />
                    <Route path="/article/:id" element={<ArticleRenderer />} />

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

        {/* Newsletter Subscription Popup */}
        {showNewsletterPopup && (
          <NewsletterSubscriptionPopup
            onSubscribe={handleNewsletterSubscribe}
            onClose={handleNewsletterClose}
          />
        )}

        {/* Toast Notifications */}
        <ToastContainer />
      </Router>
        </TransitionProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
// filepath: c:\Users\DELL\OneDrive\Desktop\Magazine_Website\Magazine_Website\src\App.jsx
