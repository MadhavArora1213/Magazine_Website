import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TransitionProvider, useTransition } from './context/TransitionContext';
import Loading from './Components/Loading';
import Header from './Components/Header';
import Footer from './Components/Footer';
import HomePage from './Pages/HomePage';
import Popup from './Components/Popup';

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
                {/* Add more routes as needed */}
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
