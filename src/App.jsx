import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Loading from './Components/Loading';
import HomePage from './Pages/HomePage';
import Popup from './Components/Popup';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
