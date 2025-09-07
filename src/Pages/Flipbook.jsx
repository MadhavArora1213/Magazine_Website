import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import $ from 'jquery';
import 'turn.js';
import { flipbookService } from '../services/flipbookService';

// Import react-pdf for page rendering
import { Document, Page, pdfjs } from 'react-pdf';

// Configure PDF.js worker for Vite compatibility
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


const Flipbook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const flipBookRef = useRef();
  const [currentPage, setCurrentPage] = useState(0);
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageWidth] = useState(600);
  const [pageHeight] = useState(800);
  const [magazine, setMagazine] = useState(null);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [pagesData, setPagesData] = useState(new Map()); // pageNumber -> image data
  const [pdfFile, setPdfFile] = useState(null);

  // Magazine list state
  const [magazines, setMagazines] = useState([]);
  const [magazinesLoading, setMagazinesLoading] = useState(false);
  const [magazinesError, setMagazinesError] = useState(null);

  // Memoized options for PDF Document to prevent unnecessary reloads
  const documentOptions = useMemo(() => ({
    cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
    cMapPacked: true,
  }), [pdfjs.version]);

  // Load magazine data if ID is provided, otherwise load magazine list
  useEffect(() => {
    if (id) {
      loadMagazine();
    } else {
      loadMagazines();
    }
  }, [id]);

  const loadMagazines = async () => {
    try {
      setMagazinesLoading(true);
      setMagazinesError(null);
      const response = await flipbookService.getFlipbookMagazines({ limit: 50 });
      setMagazines(response.magazines || []);
    } catch (err) {
      console.error('Failed to load magazines:', err);
      setMagazinesError('Failed to load magazines');
    } finally {
      setMagazinesLoading(false);
    }
  };

  const loadMagazine = async () => {
    try {
      setLoading(true);
      setError(null);
      const magazineData = await flipbookService.getFlipbookMagazineById(id);
      setMagazine(magazineData.magazine);
      setPdfFile(`/api/flipbook/download/${id}`);
    } catch (err) {
      console.error('Failed to load magazine:', err);
      setError('Failed to load magazine data');
    } finally {
      setLoading(false);
    }
  };





  // Navigation functions
  const nextPage = useCallback(() => {
    if (currentPage < numPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, numPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const goToPage = useCallback((pageNumber) => {
    if (pageNumber >= 0 && pageNumber < numPages) {
      setCurrentPage(pageNumber);
    }
  }, [numPages]);


  const handleMagazineClick = (magazineId) => {
    navigate(`/flipbook/${magazineId}`);
  };

  // If no ID provided, show magazine list
  if (!id) {
    return (
      <div className="bg-gradient-to-br from-[#e3e7f7] via-white to-[#e3e7f7] min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-[#e3e7f7] rounded-full flex items-center justify-center border-4 border-[#162048]">
                <svg className="w-10 h-10 text-[#162048]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#162048] mb-4 tracking-wide drop-shadow-lg">
              DIGITAL MAGAZINE LIBRARY
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Explore Our Collection of Interactive Magazines
            </p>
            <p className="text-lg text-gray-500">
              Click on any magazine to start your reading experience
            </p>
          </div>

        {/* Loading State */}
        {magazinesLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#e3e7f7] border-t-[#162048]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#162048]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
            </div>
            <div className="ml-6">
              <span className="text-[#162048] font-bold text-lg">Loading your magazine collection...</span>
              <div className="flex space-x-1 mt-2">
                <div className="w-2 h-2 bg-[#162048] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#162048] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-[#162048] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {magazinesError && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-200">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#162048] mb-2">Unable to Load Magazines</h2>
            <p className="text-gray-600 mb-4">{magazinesError}</p>
            <button
              onClick={loadMagazines}
              className="bg-[#ffe000] text-[#162048] font-extrabold px-8 py-3 rounded-full hover:bg-yellow-400 transition-colors border-2 border-[#162048] shadow-lg flex items-center mx-auto"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Try Again
            </button>
          </div>
        )}

        {/* Magazine Grid */}
        {!magazinesLoading && !magazinesError && (
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-fr">
              {magazines.map((mag, index) => (
                <div
                  key={mag.id}
                  onClick={() => handleMagazineClick(mag.id)}
                  className="bg-white rounded-2xl shadow-xl border-4 border-[#162048] p-6 flex flex-col cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-500 h-full group"
                >
                  <div className="flex flex-col h-full">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-[#e3e7f7] rounded-full flex items-center justify-center border-2 border-[#162048]">
                        <svg className="w-8 h-8 text-[#162048]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-[#162048] mb-3 text-center line-clamp-2 flex-grow">
                      {mag.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 text-center flex-grow">
                      {mag.description}
                    </p>

                    {/* Category and Pages */}
                    <div className="flex justify-between items-center text-sm mb-6 bg-[#e3e7f7] rounded-lg p-3">
                      <span className="bg-[#ffe000] text-[#162048] px-3 py-1 rounded-full text-xs font-semibold">
                        {mag.category || 'General'}
                      </span>
                      <span className="bg-[#162048] text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        {mag.totalPages || 0} pages
                      </span>
                    </div>

                    {/* Read Now Button */}
                    <div className="flex justify-center mb-4">
                      <button className="bg-[#ffe000] text-[#162048] font-extrabold px-6 py-3 rounded-full hover:bg-yellow-400 transition-colors border-2 border-[#162048] shadow-lg flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        Read Now
                      </button>
                    </div>

                    {/* Rating stars */}
                    <div className="flex justify-center space-x-1 mt-auto">
                      <svg className="w-4 h-4 text-[#ffe000]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <svg className="w-4 h-4 text-[#ffe000]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <svg className="w-4 h-4 text-[#ffe000]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <svg className="w-4 h-4 text-[#ffe000]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {magazines.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-[#e3e7f7] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#162048]">
                  <svg className="w-10 h-10 text-[#162048]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#162048] mb-2">No Magazines Found Yet</h3>
                <p className="text-gray-600">Check back later for exciting new publications!</p>
                <div className="mt-4 flex justify-center space-x-2">
                  <div className="w-3 h-3 bg-[#162048] rounded-full animate-ping"></div>
                  <div className="w-3 h-3 bg-[#162048] rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-3 h-3 bg-[#162048] rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    );
  }

  // Individual flipbook view
  if (error) {
    return (
      <div className="bg-gradient-to-br from-[#e3e7f7] via-white to-[#e3e7f7] min-h-screen flex items-center justify-center py-12">
        <div className="container mx-auto px-4 max-w-xl">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-200">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#162048] mb-2">Unable to Load Magazine</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-[#ffe000] text-[#162048] font-extrabold px-8 py-3 rounded-full hover:bg-yellow-400 transition-colors border-2 border-[#162048] shadow-lg flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Try Again
              </button>
              <button
                onClick={() => navigate('/flipbook')}
                className="bg-[#162048] text-white font-extrabold px-8 py-3 rounded-full hover:bg-black transition-colors border-2 border-[#162048] shadow-lg flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to Library
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#e3e7f7] via-white to-[#e3e7f7] min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#e3e7f7] rounded-full flex items-center justify-center border-4 border-[#162048]">
              <svg className="w-10 h-10 text-[#162048]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#162048] mb-4 tracking-wide drop-shadow-lg">
            {magazine ? magazine.title : 'DIGITAL MAGAZINE'}
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            {magazine ? magazine.description : 'Interactive Flipbook Experience'}
          </p>
          <p className="text-lg text-gray-500">
            {magazine ? `By ${magazine.author?.name || 'Unknown Author'}` : 'Professional Magazine Reader'}
          </p>
          {numPages && (
            <div className="mt-4 flex justify-center">
              <div className="bg-[#e3e7f7] inline-block px-4 py-2 rounded-full border-2 border-[#162048]">
                <span className="text-[#162048] font-semibold">
                  📖 {pagesData.size} of {numPages} pages loaded
                </span>
              </div>
            </div>
          )}
        </div>


        {/* Flipbook Container */}
        <div className="flex justify-center items-center mb-8">
          <div className="relative">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow-xl border-4 border-[#162048]">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#e3e7f7] border-t-[#162048] mb-4"></div>
                <span className="text-[#162048] font-bold text-lg">Loading Magazine...</span>
                <span className="text-gray-600 text-sm mt-2">📄 Preparing your reading experience</span>
                <div className="mt-4 flex space-x-1">
                  <div className="w-2 h-2 bg-[#162048] rounded-full animate-bounce"></div>
                </div>
              </div>
            ) : pdfFile ? (
              <div className="bg-white rounded-lg shadow-xl border-4 border-[#162048] p-4">
                <Document
                  file={pdfFile}
                  onLoadSuccess={({ numPages }) => {
                    setNumPages(numPages);
                    console.log(`PDF loaded successfully with ${numPages} pages`);
                  }}
                  onLoadError={(error) => {
                    console.error("Error loading PDF:", error);
                    if (error.message.includes('Invalid PDF structure')) {
                      setError('The PDF file appears to be corrupted or invalid. Please contact support if this persists.');
                    } else {
                      setError(`Error loading PDF: ${error.message || 'Unknown error'}`);
                    }
                  }}
                  loading={
                    <div className="flex flex-col items-center justify-center py-20">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#e3e7f7] border-t-[#162048] mb-4"></div>
                      <span className="text-[#162048] font-semibold">Loading PDF Document...</span>
                    </div>
                  }
                  error={
                    <div className="flex flex-col items-center justify-center py-20 text-red-600">
                      <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                      </svg>
                      <span className="font-semibold">Failed to load PDF</span>
                      <span className="text-sm mt-2">Please check if the file exists and try again</span>
                    </div>
                  }
                  options={documentOptions}
                >
                  <Page
                    pageNumber={currentPage + 1}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    scale={1.2}
                    className="border border-gray-300 max-w-full"
                    loading={
                      <div className="flex items-center justify-center h-96 bg-gray-100">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#e3e7f7] border-t-[#162048] mx-auto mb-2"></div>
                          <span className="text-[#162048] text-sm">Loading page {currentPage + 1}...</span>
                        </div>
                      </div>
                    }
                    error={
                      <div className="flex items-center justify-center h-96 bg-red-50">
                        <div className="text-center text-red-600">
                          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01"></path>
                          </svg>
                          <span className="text-sm">Error loading page {currentPage + 1}</span>
                        </div>
                      </div>
                    }
                  />
                </Document>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow-xl border-4 border-[#162048]">
                <svg className="w-16 h-16 text-[#162048] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span className="text-[#162048] font-bold text-lg">No PDF Available</span>
                <span className="text-gray-600 text-sm mt-2">Unable to load magazine content</span>
              </div>
            )}
          </div>
        </div>




        {/* Navigation Controls */}
        {numPages && (
          <div className="flex justify-center items-center space-x-6 mb-8">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`px-8 py-4 rounded-lg font-bold transition-all duration-300 transform flex items-center ${
                currentPage === 0
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-[#162048] hover:bg-black text-white hover:scale-105 shadow-lg'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Previous Page
            </button>

            <div className="text-[#162048] text-center bg-[#e3e7f7] px-8 py-4 rounded-lg shadow-lg border-2 border-[#162048]">
              <p className="text-xl font-bold">
                Page {currentPage + 1} of {numPages}
              </p>
              <p className="text-sm text-gray-600">Digital Magazine Experience</p>
              <div className="flex justify-center mt-2 space-x-1">
                {Array.from({ length: Math.min(numPages || 5, 5) }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === Math.floor((currentPage / (numPages || 1)) * 5)
                        ? 'bg-[#162048] scale-125'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage === numPages - 1}
              className={`px-8 py-4 rounded-lg font-bold transition-all duration-300 transform flex items-center ${
                currentPage === numPages - 1
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-[#162048] hover:bg-black text-white hover:scale-105 shadow-lg'
              }`}
            >
              Next Page
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        )}

        {/* Page Indicators */}
        {numPages && (
          <div className="flex justify-center space-x-2 mb-8 max-w-4xl mx-auto flex-wrap">
            {Array.from({ length: Math.min(numPages, 20) }, (_, index) => {
              const pageNum = Math.floor((index / Math.min(numPages, 20)) * numPages);
              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 m-1 transform ${
                    Math.abs(currentPage - pageNum) <= 2
                      ? 'bg-[#162048] scale-125 shadow-lg animate-pulse'
                      : 'bg-gray-300 hover:bg-[#162048] hover:scale-110'
                  }`}
                  aria-label={`Go to page ${pageNum + 1}`}
                />
              );
            })}
          </div>
        )}

        {/* Enhanced Controls */}
        {pdfFile && (
          <div className="flex justify-center space-x-4 mb-8 flex-wrap">
            <a
              href={pdfFile}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#ffe000] text-[#162048] font-extrabold px-6 py-3 rounded-full hover:bg-yellow-400 transition-colors border-2 border-[#162048] shadow-lg inline-flex items-center transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open PDF
            </a>
            <a
              href={pdfFile}
              download="Magazine.pdf"
              className="bg-[#162048] text-white font-extrabold px-6 py-3 rounded-full hover:bg-black transition-colors border-2 border-[#162048] shadow-lg inline-flex items-center transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download
            </a>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center text-gray-600 text-sm max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl border-4 border-[#162048] p-6">
            <h3 className="text-[#162048] font-bold text-lg mb-4">
              How to Master Your Reading Experience
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
              <div className="text-center bg-[#e3e7f7] rounded-lg p-4 shadow-md">
                <div className="flex justify-center mb-2">
                  <svg className="w-8 h-8 text-[#162048] animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </div>
                <span className="text-[#162048] font-semibold">Zoom In/Out</span><br />
                Use browser zoom or pinch to zoom in/out
              </div>
              <div className="text-center bg-[#e3e7f7] rounded-lg p-4 shadow-md">
                <div className="flex justify-center mb-2">
                  <svg className="w-8 h-8 text-[#162048] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                  </svg>
                </div>
                <span className="text-[#162048] font-semibold">Navigate Pages</span><br />
                Use Previous/Next buttons to change pages
              </div>
              <div className="text-center bg-[#e3e7f7] rounded-lg p-4 shadow-md">
                <div className="flex justify-center mb-2">
                  <svg className="w-8 h-8 text-[#162048] animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <span className="text-[#162048] font-semibold">Jump to Page</span><br />
                Click on page indicators to jump to specific pages
              </div>
              <div className="text-center bg-[#e3e7f7] rounded-lg p-4 shadow-md">
                <div className="flex justify-center mb-2">
                  <svg className="w-8 h-8 text-[#162048] animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <span className="text-[#162048] font-semibold">Mobile Friendly</span><br />
                Touch and swipe gestures work perfectly
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-[#162048]">
              <p className="text-gray-700">
                <span className="font-semibold text-[#162048]">Pro Tip:</span> Use the "Open PDF" button to view in full screen or "Download" to save for offline reading
              </p>
              <div className="flex justify-center mt-4 space-x-1">
                <svg className="w-5 h-5 text-[#ffe000]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <svg className="w-5 h-5 text-[#ffe000]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <svg className="w-5 h-5 text-[#ffe000]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <svg className="w-5 h-5 text-[#ffe000]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flipbook;