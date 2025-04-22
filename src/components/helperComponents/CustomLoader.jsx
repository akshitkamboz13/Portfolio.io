import React from 'react';
import '../css/Loader.css';

const CustomLoader = () => {
  return (
    <div 
      className="loader-container" 
      role="status" 
      aria-live="polite" 
      aria-label="Loading content"
    >
      <div className="loader-content">
        <div className="relative h-24 w-24 flex items-center justify-center">
          <div className="pacman-loader scale-150"></div>
        </div>
        <span className="sr-only">Loading, please wait...</span>
      </div>
    </div>
  );
};

export default CustomLoader; 