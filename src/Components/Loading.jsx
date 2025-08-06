import React from 'react';

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-red-600 animate-spin"></div>
          <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-4 border-b-4 border-gray-200 animate-ping opacity-20"></div>
        </div>
        <h2 className="mt-6 text-2xl font-bold text-gray-800">Echo</h2>
        <p className="mt-2 text-gray-600">Loading amazing content...</p>
      </div>
    </div>
  );
};

export default Loading;