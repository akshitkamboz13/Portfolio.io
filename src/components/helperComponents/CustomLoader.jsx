import React from 'react';
import '../css/Loader.css';

const CustomLoader = () => {
  return (
    <div className="loader-container">
      <div className="loader-content">
        <div className="relative h-24 w-24 flex items-center justify-center">
          <div className="pacman-loader scale-150"></div>
        </div>
      </div>
    </div>
  );
};

export default CustomLoader; 