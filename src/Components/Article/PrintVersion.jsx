import React, { useEffect, useState } from 'react';
import { FaTimes, FaPrint, FaDownload } from 'react-icons/fa';

const PrintVersion = ({ article, onClose, className = '' }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [printSettings, setPrintSettings] = useState({
    includeImages: true,
    includeComments: false,
    includeTags: true,
    includeAuthorBio: true,
    fontSize: 'medium',
    margins: 'normal'
  });
  useEffect(() => {
    // Disable body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handlePrint = () => {
    setIsPrinting(true);
    
    // Create print window
    const printWindow = window.open('', '_blank');
    const printContent = generatePrintHTML();
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for images to load
    printWindow.addEventListener('load', () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        setIsPrinting(false);
      }, 500);
    });
  };

  const handleSavePDF = async () => {
    try {
      setIsPrinting(true);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/public/articles/${article.id}/pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings: printSettings,
          format: 'A4',
          orientation: 'portrait'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${article.slug}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsPrinting(false);
    }
  };

  const generatePrintHTML = () => {
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const calculateReadingTime = (content) => {
      const wordsPerMinute = 200;
      const wordCount = content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
      return Math.ceil(wordCount / wordsPerMinute);
    };

    const cleanContent = (html) => {
      // Remove interactive elements and clean up HTML for print
      return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<button\b[^>]*>.*?<\/button>/gi, '')
        .replace(/<form\b[^>]*>.*?<\/form>/gi, '')
        .replace(/style="[^"]*"/gi, '')
        .replace(/class="[^"]*"/gi, '');
    };

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${article.title} - Print Version</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Times New Roman', Times, serif;
          font-size: ${printSettings.fontSize === 'small' ? '12px' : printSettings.fontSize === 'large' ? '16px' : '14px'};
          line-height: 1.6;
          color: #333;
          margin: ${printSettings.margins === 'narrow' ? '0.5in' : printSettings.margins === 'wide' ? '1.5in' : '1in'};
          max-width: none;
        }
        
        .print-header {
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .print-title {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
          line-height: 1.2;
        }
        
        .print-subtitle {
          font-size: 16px;
          color: #666;
          margin-bottom: 15px;
          font-style: italic;
        }
        
        .print-meta {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          font-size: 12px;
          color: #666;
        }
        
        .print-author {
          font-weight: bold;
        }
        
        .print-content {
          margin: 30px 0;
        }
        
        .print-content h1, .print-content h2, .print-content h3, 
        .print-content h4, .print-content h5, .print-content h6 {
          margin: 20px 0 10px 0;
          font-weight: bold;
          page-break-after: avoid;
        }
        
        .print-content h1 { font-size: 24px; }
        .print-content h2 { font-size: 20px; }
        .print-content h3 { font-size: 18px; }
        .print-content h4 { font-size: 16px; }
        
        .print-content p {
          margin: 12px 0;
          text-align: justify;
          orphans: 2;
          widows: 2;
        }
        
        .print-content ul, .print-content ol {
          margin: 12px 0 12px 30px;
        }
        
        .print-content li {
          margin: 6px 0;
        }
        
        .print-content blockquote {
          margin: 20px 30px;
          padding: 15px 20px;
          border-left: 4px solid #ccc;
          background: #f9f9f9;
          font-style: italic;
        }
        
        .print-content img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 20px auto;
          page-break-inside: avoid;
        }
        
        .print-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          page-break-inside: avoid;
        }
        
        .print-content th, .print-content td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        
        .print-content th {
          background: #f2f2f2;
          font-weight: bold;
        }
        
        .print-featured-image {
          width: 100%;
          height: auto;
          margin: 20px 0;
          page-break-inside: avoid;
        }
        
        .print-tags {
          margin: 30px 0;
          padding: 15px 0;
          border-top: 1px solid #ddd;
        }
        
        .print-tags-title {
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .print-tag {
          display: inline-block;
          background: #f0f0f0;
          padding: 3px 8px;
          margin: 3px;
          border-radius: 3px;
          font-size: 12px;
        }
        
        .print-author-bio {
          margin: 30px 0;
          padding: 20px;
          background: #f9f9f9;
          border: 1px solid #ddd;
          page-break-inside: avoid;
        }
        
        .print-author-bio-title {
          font-weight: bold;
          margin-bottom: 10px;
          font-size: 16px;
        }
        
        .print-footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #333;
          font-size: 12px;
          color: #666;
        }
        
        .print-url {
          word-break: break-all;
        }
        
        @media print {
          body { 
            margin: 0;
            font-size: 12pt;
          }
          
          .print-header {
            page-break-after: avoid;
          }
          
          .print-content img {
            max-width: 100% !important;
            page-break-inside: avoid;
          }
          
          .page-break {
            page-break-before: always;
          }
          
          a {
            color: #000 !important;
            text-decoration: none !important;
          }
          
          a[href]:after {
            content: " (" attr(href) ")";
            font-size: 10pt;
            color: #666;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-header">
        <h1 class="print-title">${article.title}</h1>
        ${article.subtitle ? `<div class="print-subtitle">${article.subtitle}</div>` : ''}
        <div class="print-meta">
          <div>
            ${article.author ? `<span class="print-author">By ${article.author.name}</span>` : ''}
            ${article.category ? ` • ${article.category.name}` : ''}
          </div>
          <div>
            Published: ${formatDate(article.publishedAt || article.createdAt)} 
            • ${calculateReadingTime(article.content)} min read
          </div>
        </div>
      </div>

      ${printSettings.includeImages && article.featuredImage ? `
        <img src="${article.featuredImage}" alt="${article.title}" class="print-featured-image">
      ` : ''}

      <div class="print-content">
        ${printSettings.includeImages ? article.content : cleanContent(article.content).replace(/<img[^>]*>/gi, '')}
      </div>

      ${printSettings.includeTags && article.tags && article.tags.length > 0 ? `
        <div class="print-tags">
          <div class="print-tags-title">Tags:</div>
          ${article.tags.map(tag => `<span class="print-tag">#${tag.name}</span>`).join('')}
        </div>
      ` : ''}

      ${printSettings.includeAuthorBio && article.author && article.author.bio ? `
        <div class="print-author-bio">
          <div class="print-author-bio-title">About ${article.author.name}</div>
          <p>${article.author.bio}</p>
        </div>
      ` : ''}

      <div class="print-footer">
        <div>© ${new Date().getFullYear()} Your Magazine. All rights reserved.</div>
        <div class="print-url">Original article: ${window.location.href}</div>
        <div>Printed on ${new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit'
        })}</div>
      </div>
    </body>
    </html>
    `;
  };

  const PreviewContent = () => (
    <div className="bg-white p-8 max-w-4xl mx-auto" style={{ 
      fontFamily: 'Times New Roman, Times, serif',
      fontSize: printSettings.fontSize === 'small' ? '12px' : printSettings.fontSize === 'large' ? '16px' : '14px'
    }}>
      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-6 mb-8">
        <h1 className="text-3xl font-bold mb-3 leading-tight">{article.title}</h1>
        {article.subtitle && (
          <div className="text-lg text-gray-600 mb-4 italic">{article.subtitle}</div>
        )}
        <div className="flex justify-between items-center text-sm text-gray-600 flex-wrap">
          <div>
            {article.author && <span className="font-bold">By {article.author.name}</span>}
            {article.category && <span> • {article.category.name}</span>}
          </div>
          <div>
            Published: {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {printSettings.includeImages && article.featuredImage && (
        <img
          src={article.featuredImage}
          alt={article.title}
          className="w-full h-auto mb-8"
        />
      )}

      {/* Content */}
      <div 
        className="prose max-w-none mb-8 leading-relaxed"
        dangerouslySetInnerHTML={{ 
          __html: printSettings.includeImages 
            ? article.content 
            : article.content.replace(/<img[^>]*>/gi, '') 
        }}
      />

      {/* Tags */}
      {printSettings.includeTags && article.tags && article.tags.length > 0 && (
        <div className="mb-8 pt-6 border-t border-gray-300">
          <div className="font-bold mb-3">Tags:</div>
          <div className="flex flex-wrap gap-2">
            {article.tags.map(tag => (
              <span key={tag.id} className="bg-gray-200 px-2 py-1 rounded text-sm">
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Author Bio */}
      {printSettings.includeAuthorBio && article.author && article.author.bio && (
        <div className="mb-8 p-6 bg-gray-50 border border-gray-200">
          <div className="font-bold mb-3 text-lg">About {article.author.name}</div>
          <p className="leading-relaxed">{article.author.bio}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 pt-6 border-t-2 border-gray-800 text-sm text-gray-600">
        <div className="mb-2">© {new Date().getFullYear()} Your Magazine. All rights reserved.</div>
        <div className="mb-2 break-all">Original article: {window.location.href}</div>
        <div>
          Print preview generated on {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 ${className}`}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Print Preview</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Settings Panel */}
          <div className="w-80 bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-4">Print Settings</h3>
            
            <div className="space-y-4">
              {/* Include Images */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeImages"
                  checked={printSettings.includeImages}
                  onChange={(e) => setPrintSettings(prev => ({
                    ...prev,
                    includeImages: e.target.checked
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="includeImages" className="ml-2 text-sm text-gray-700">
                  Include images
                </label>
              </div>

              {/* Include Tags */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeTags"
                  checked={printSettings.includeTags}
                  onChange={(e) => setPrintSettings(prev => ({
                    ...prev,
                    includeTags: e.target.checked
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="includeTags" className="ml-2 text-sm text-gray-700">
                  Include tags
                </label>
              </div>

              {/* Include Author Bio */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeAuthorBio"
                  checked={printSettings.includeAuthorBio}
                  onChange={(e) => setPrintSettings(prev => ({
                    ...prev,
                    includeAuthorBio: e.target.checked
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="includeAuthorBio" className="ml-2 text-sm text-gray-700">
                  Include author bio
                </label>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size
                </label>
                <select
                  value={printSettings.fontSize}
                  onChange={(e) => setPrintSettings(prev => ({
                    ...prev,
                    fontSize: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="small">Small (12px)</option>
                  <option value="medium">Medium (14px)</option>
                  <option value="large">Large (16px)</option>
                </select>
              </div>

              {/* Margins */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Margins
                </label>
                <select
                  value={printSettings.margins}
                  onChange={(e) => setPrintSettings(prev => ({
                    ...prev,
                    margins: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="narrow">Narrow (0.5 inch)</option>
                  <option value="normal">Normal (1 inch)</option>
                  <option value="wide">Wide (1.5 inch)</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              <button
                onClick={handlePrint}
                disabled={isPrinting}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPrint className="w-4 h-4" />
                {isPrinting ? 'Printing...' : 'Print Article'}
              </button>
              
              <button
                onClick={handleSavePDF}
                disabled={isPrinting}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaDownload className="w-4 h-4" />
                {isPrinting ? 'Generating...' : 'Save as PDF'}
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
            <div className="bg-white shadow-lg min-h-full">
              <PreviewContent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintVersion;