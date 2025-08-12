import React, { useRef, useState, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Document, Page, pdfjs } from 'react-pdf';

// Set up PDF.js worker with better configuration
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// Configure PDF.js for better performance
const pdfOptions = {
  cMapUrl: `//unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  cMapPacked: true,
  standardFontDataUrl: `//unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
};

const Flipbook = () => {
  const flipBookRef = useRef();
  const [currentPage, setCurrentPage] = useState(0);
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageWidth, setPageWidth] = useState(600);
  const [pageHeight, setPageHeight] = useState(800);

  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }, []);

  const onDocumentLoadError = useCallback((error) => {
    console.error('Error loading PDF:', error);
    setError('Failed to load magazine PDF');
    setLoading(false);
  }, []);

  const nextPage = useCallback(() => {
    if (flipBookRef.current && currentPage < numPages - 1) {
      flipBookRef.current.pageFlip().flipNext();
    }
  }, [currentPage, numPages]);

  const prevPage = useCallback(() => {
    if (flipBookRef.current && currentPage > 0) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  }, [currentPage]);

  const goToPage = useCallback((pageNumber) => {
    if (flipBookRef.current && pageNumber >= 0 && pageNumber < numPages) {
      flipBookRef.current.pageFlip().flip(pageNumber);
    }
  }, [numPages]);

  const onFlip = useCallback((e) => {
    setCurrentPage(e.data);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Magazine...</h2>
          <p className="text-gray-300 mb-4">Please wait while we prepare your digital magazine</p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-gray-400 mb-2">Loading PDF file (5.8 MB)</p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">This may take a moment for large files...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">📖</div>
          <h2 className="text-2xl font-bold text-white mb-2">Unable to Load Magazine</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#162048] hover:bg-[#1a237e] text-white px-6 py-3 rounded-lg font-bold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          DIGITAL MAGAZINE
        </h1>
        <p className="text-xl text-gray-300 mb-2">Interactive Flipbook Experience</p>
        <p className="text-lg text-gray-400">Professional Magazine Reader</p>
      </div>

      {/* Flipbook Container */}
      <div className="flex justify-center items-center mb-8">
        <div className="relative">
          <Document
            file="/book.pdf"
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading=""
            error=""
            options={pdfOptions}
          >
            <HTMLFlipBook
              ref={flipBookRef}
              width={pageWidth}
              height={pageHeight}
              size="stretch"
              minWidth={400}
              maxWidth={800}
              minHeight={500}
              maxHeight={1000}
              maxShadowOpacity={0.5}
              showCover={true}
              mobileScrollSupport={false}
              onFlip={onFlip}
              className="magazine-flipbook shadow-2xl"
              startPage={0}
              drawShadow={true}
              flippingTime={800}
              usePortrait={true}
              startZIndex={0}
              autoSize={false}
              clickEventForward={true}
              useMouseEvents={true}
              swipeDistance={50}
              showPageCorners={true}
              disableFlipByClick={false}
            >
              {numPages && Array.from({ length: numPages }, (_, index) => (
                <div key={index + 1} className="page-container">
                  <Page
                    pageNumber={index + 1}
                    width={pageWidth}
                    height={pageHeight}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    loading={
                      <div className="flex items-center justify-center h-full bg-white">
                        <div className="animate-pulse text-gray-400">Loading page...</div>
                      </div>
                    }
                    error={
                      <div className="flex items-center justify-center h-full bg-white text-red-500">
                        <p>Error loading page {index + 1}</p>
                      </div>
                    }
                  />
                </div>
              ))}
            </HTMLFlipBook>
          </Document>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center items-center space-x-6 mb-8">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className={`px-8 py-4 rounded-lg font-bold transition-all duration-300 ${
            currentPage === 0
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-white/20 hover:bg-white/30 text-white hover:scale-105 shadow-lg'
          }`}
        >
          ← Previous Page
        </button>
        
        <div className="text-white text-center bg-white/10 px-6 py-4 rounded-lg backdrop-blur-sm shadow-lg">
          <p className="text-lg font-bold">Page {currentPage + 1} of {numPages}</p>
          <p className="text-sm opacity-80">Digital Magazine</p>
        </div>
        
        <button
          onClick={nextPage}
          disabled={currentPage === numPages - 1}
          className={`px-8 py-4 rounded-lg font-bold transition-all duration-300 ${
            currentPage === numPages - 1
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-white/20 hover:bg-white/30 text-white hover:scale-105 shadow-lg'
          }`}
        >
          Next Page →
        </button>
      </div>

      {/* Page Indicators */}
      {numPages && (
        <div className="flex justify-center space-x-2 mb-8 max-w-4xl mx-auto flex-wrap">
          {Array.from({ length: Math.min(numPages, 20) }, (_, index) => {
            const pageNum = Math.floor((index / 20) * numPages);
            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`w-4 h-4 rounded-full transition-all duration-300 m-1 ${
                  Math.abs(currentPage - pageNum) <= 2
                    ? 'bg-white scale-125 shadow-lg' 
                    : 'bg-white/30 hover:bg-white/50 hover:scale-110'
                }`}
                aria-label={`Go to page ${pageNum + 1}`}
              />
            );
          })}
        </div>
      )}

      {/* Enhanced Controls */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => goToPage(0)}
          className="bg-[#162048] hover:bg-[#1a237e] text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 shadow-lg"
        >
          First Page
        </button>
        <button
          onClick={() => goToPage(numPages - 1)}
          className="bg-[#162048] hover:bg-[#1a237e] text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 shadow-lg"
        >
          Last Page
        </button>
        <a
          href="/book.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 shadow-lg inline-flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Open PDF
        </a>
        <a
          href="/book.pdf"
          download="Magazine.pdf"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 shadow-lg inline-flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download
        </a>
      </div>

      {/* Instructions */}
      <div className="text-center text-white/60 text-sm max-w-4xl mx-auto px-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="text-white/80 font-bold text-lg mb-4">📖 How to Read the Magazine</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-2">🖱️</div>
              <span className="text-white/80 font-semibold">Click</span><br />
              Click on page edges to flip pages
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">👆</div>
              <span className="text-white/80 font-semibold">Drag</span><br />
              Drag page corners for realistic page turning
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🎯</div>
              <span className="text-white/80 font-semibold">Navigate</span><br />
              Use buttons or dots to jump to specific pages
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📱</div>
              <span className="text-white/80 font-semibold">Mobile</span><br />
              Swipe left/right on mobile devices
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-white/20">
            <p className="text-white/70">
              <span className="font-semibold">Pro Tip:</span> Use the "Open PDF" button to view in full screen or "Download" to save for offline reading
            </p>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .page-container {
          background: white;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .magazine-flipbook {
          margin: 0 auto;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .magazine-flipbook canvas {
          border-radius: 8px;
          box-shadow: none !important;
        }
        
        /* Smooth page flip animations */
        .magazine-flipbook * {
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Loading states */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .page-container {
          animation: fadeIn 0.5s ease-out;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .magazine-flipbook {
            width: 350px !important;
            height: 500px !important;
          }
        }
        
        @media (max-width: 480px) {
          .magazine-flipbook {
            width: 300px !important;
            height: 400px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Flipbook;