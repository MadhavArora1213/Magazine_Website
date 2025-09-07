import React, { useState } from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaEnvelope, FaCopy, FaReddit, FaTelegram, FaPinterest, FaShare } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ShareButtons = ({ 
  article, 
  shareCount, 
  onShare, 
  variant = 'default',
  showLabels = true,
  showCount = true,
  className = '' 
}) => {
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  const currentUrl = window.location.href;
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(article.title);
  const encodedDescription = encodeURIComponent(article.subtitle || article.excerpt || 'Check out this article');
  
  const shareData = {
    facebook: {
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: FaFacebook,
      label: 'Facebook',
      color: 'text-blue-600 hover:text-blue-700',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    twitter: {
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=YourMagazine`,
      icon: FaTwitter,
      label: 'Twitter',
      color: 'text-blue-400 hover:text-blue-500',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    linkedin: {
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: FaLinkedin,
      label: 'LinkedIn',
      color: 'text-blue-700 hover:text-blue-800',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    whatsapp: {
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: FaWhatsapp,
      label: 'WhatsApp',
      color: 'text-green-600 hover:text-green-700',
      bgColor: 'bg-green-50 hover:bg-green-100'
    },
    reddit: {
      url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      icon: FaReddit,
      label: 'Reddit',
      color: 'text-orange-600 hover:text-orange-700',
      bgColor: 'bg-orange-50 hover:bg-orange-100'
    },
    telegram: {
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: FaTelegram,
      label: 'Telegram',
      color: 'text-blue-500 hover:text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    pinterest: {
      url: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}&media=${encodeURIComponent(article.featuredImage || '')}`,
      icon: FaPinterest,
      label: 'Pinterest',
      color: 'text-red-600 hover:text-red-700',
      bgColor: 'bg-red-50 hover:bg-red-100'
    },
    email: {
      url: `mailto:?subject=${encodedTitle}&body=I thought you might be interested in this article: ${encodedTitle}%0A%0A${encodedUrl}`,
      icon: FaEnvelope,
      label: 'Email',
      color: 'text-gray-600 hover:text-gray-700',
      bgColor: 'bg-gray-50 hover:bg-gray-100'
    }
  };

  const handleShare = async (platform) => {
    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        toast.error('Failed to copy link');
      }
    } else if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.subtitle || article.excerpt,
          url: currentUrl
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      const shareInfo = shareData[platform];
      if (shareInfo) {
        window.open(shareInfo.url, '_blank', 'width=600,height=400');
        if (onShare) onShare(platform);
      }
    }
  };

  const renderDefaultShare = () => (
    <div className={`flex flex-wrap gap-3 py-6 border-y border-gray-200 ${className}`}>
      <div className="flex items-center gap-2 mr-4">
        <FaShare className="text-gray-500" />
        <span className="font-medium text-gray-900">Share this article</span>
        {showCount && shareCount > 0 && (
          <span className="text-gray-500">({shareCount} shares)</span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {Object.entries(shareData).map(([platform, data]) => {
          const IconComponent = data.icon;
          return (
            <button
              key={platform}
              onClick={() => handleShare(platform)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${data.bgColor} ${data.color}`}
              title={`Share on ${data.label}`}
            >
              <IconComponent className="w-4 h-4" />
              {showLabels && <span className="text-sm font-medium">{data.label}</span>}
            </button>
          );
        })}
        
        <button
          onClick={() => handleShare('copy')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            copied 
              ? 'bg-green-50 text-green-600' 
              : 'bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-700'
          }`}
          title="Copy link"
        >
          <FaCopy className="w-4 h-4" />
          {showLabels && <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy'}</span>}
        </button>
        
        {navigator.share && (
          <button
            onClick={() => handleShare('native')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-700"
            title="Share via device"
          >
            <FaShare className="w-4 h-4" />
            {showLabels && <span className="text-sm font-medium">More</span>}
          </button>
        )}
      </div>
    </div>
  );

  const renderCompactShare = () => (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-600 mr-2">Share:</span>
      {['facebook', 'twitter', 'linkedin', 'whatsapp'].map(platform => {
        const data = shareData[platform];
        const IconComponent = data.icon;
        return (
          <button
            key={platform}
            onClick={() => handleShare(platform)}
            className={`p-2 rounded-full transition-colors ${data.color}`}
            title={`Share on ${data.label}`}
          >
            <IconComponent className="w-4 h-4" />
          </button>
        );
      })}
      <button
        onClick={() => handleShare('copy')}
        className={`p-2 rounded-full transition-colors ${
          copied ? 'text-green-600' : 'text-gray-600 hover:text-gray-700'
        }`}
        title="Copy link"
      >
        <FaCopy className="w-4 h-4" />
      </button>
    </div>
  );

  const renderStickyShare = () => (
    <div className={`fixed left-4 top-1/2 transform -translate-y-1/2 z-40 ${className}`}>
      <div className="flex flex-col gap-2 bg-white rounded-lg shadow-lg p-2">
        {['facebook', 'twitter', 'linkedin', 'whatsapp'].map(platform => {
          const data = shareData[platform];
          const IconComponent = data.icon;
          return (
            <button
              key={platform}
              onClick={() => handleShare(platform)}
              className={`p-3 rounded-lg transition-colors ${data.bgColor} ${data.color}`}
              title={`Share on ${data.label}`}
            >
              <IconComponent className="w-5 h-5" />
            </button>
          );
        })}
        <button
          onClick={() => handleShare('copy')}
          className={`p-3 rounded-lg transition-colors ${
            copied 
              ? 'bg-green-50 text-green-600' 
              : 'bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-700'
          }`}
          title="Copy link"
        >
          <FaCopy className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const renderFloatingShare = () => (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <div className="relative">
        <button
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
          title="Share article"
        >
          <FaShare className="w-5 h-5" />
        </button>
        
        {showShareMenu && (
          <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-4 min-w-[200px]">
            <div className="text-sm font-medium text-gray-900 mb-3">Share this article</div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(shareData).slice(0, 6).map(([platform, data]) => {
                const IconComponent = data.icon;
                return (
                  <button
                    key={platform}
                    onClick={() => {
                      handleShare(platform);
                      setShowShareMenu(false);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${data.bgColor} ${data.color}`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-xs">{data.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <button
                onClick={() => {
                  handleShare('copy');
                  setShowShareMenu(false);
                }}
                className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors ${
                  copied 
                    ? 'bg-green-50 text-green-600' 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-700'
                }`}
              >
                <FaCopy className="w-4 h-4" />
                <span className="text-xs">{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Overlay to close menu */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );

  const renderMinimalShare = () => (
    <div className={`flex items-center gap-3 ${className}`}>
      {['facebook', 'twitter', 'linkedin'].map(platform => {
        const data = shareData[platform];
        const IconComponent = data.icon;
        return (
          <button
            key={platform}
            onClick={() => handleShare(platform)}
            className={`p-1.5 rounded-full transition-colors ${data.color}`}
            title={`Share on ${data.label}`}
          >
            <IconComponent className="w-4 h-4" />
          </button>
        );
      })}
      <button
        onClick={() => handleShare('copy')}
        className={`p-1.5 rounded-full transition-colors ${
          copied ? 'text-green-600' : 'text-gray-600 hover:text-gray-700'
        }`}
        title="Copy link"
      >
        <FaCopy className="w-4 h-4" />
      </button>
    </div>
  );

  // Render based on variant
  switch (variant) {
    case 'compact':
      return renderCompactShare();
    case 'sticky':
      return renderStickyShare();
    case 'floating':
      return renderFloatingShare();
    case 'minimal':
      return renderMinimalShare();
    default:
      return renderDefaultShare();
  }
};

export default ShareButtons;