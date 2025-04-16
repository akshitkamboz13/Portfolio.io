import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';
import AnimatedBackground from './helperComponents/AnimatedBackground';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative bg-custom-blue text-white">
      <AnimatedBackground color1="#3b82f6" color2="#8b5cf6" density={0.00008} />
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="z-10 text-center max-w-xl p-8 premium-glass rounded-xl">
        <div className="text-8xl mb-6 text-red-400 flex justify-center">
          <FaExclamationTriangle className="animate-pulse" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl mb-6 text-gray-300">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
          to="/" 
          className="premium-button primary flex items-center gap-2 mx-auto w-max"
        >
          <FaHome />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound; 