import React from 'react';
import '../css/Loader.css';

const CustomLoader = () => {
  return (
    <div className="loader-container">
      <div className="loader-content">
        <div className="relative h-24 w-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-purple-500 border-b-pink-500 border-l-blue-500 animate-spin opacity-20"></div>
          <div className="pacman-loader scale-150"></div>
        </div>
      </div>
    </div>
  );
};

export default CustomLoader; 