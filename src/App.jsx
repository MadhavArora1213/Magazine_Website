import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TransitionProvider, useTransition } from './context/TransitionContext';
import Loading from './Components/Loading';
import Header from './Components/Header';
import Footer from './Components/Footer';
import HomePage from './Pages/HomePage';
import AboutPage from './Pages/AboutPage';
import PrivacyPolicySection from './Components/PrivacyPolicySection'; // <-- Import PrivacyPolicySection
import Popup from './Components/Popup';
import TermsAndConditions from './Pages/TermsAndConditions'; // Add this import
import CookiePolicySection from './Components/Cookie_Policy'; // Add this import
import EditorialStandardsSection from './Components/EditorialStandards'; // Add this import
import CorrectionPolicySection from './Components/CorrectionPolicy'; // Add this import
import CopyrightInformationSection from './Components/CopyrightInformation'; // Add this import
import DisclaimerSection from './Components/Disclaimer'; // Add this import

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
                <Route path="/privacy-policy" element={<PrivacyPolicySection />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                <Route path="/cookies" element={<CookiePolicySection />} />
                <Route path="/editorial-standards" element={<EditorialStandardsSection />} />
                <Route path="/correction-policy" element={<CorrectionPolicySection />} />
                <Route path="/copyright" element={<CopyrightInformationSection />} />
                                <Route path="/disclaimer" element={<DisclaimerSection />} /> {/* <-- Disclaimer route */}

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
