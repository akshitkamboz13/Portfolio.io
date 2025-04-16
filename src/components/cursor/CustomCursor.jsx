import React, { useEffect, useState } from 'react';
import '../css/PremiumStyles.css';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if cursor is over a clickable element
      const target = e.target;
      const isTargetClickable = 
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' ||
        target.classList.contains('custom-cursor-pointer') ||
        target.closest('a') || 
        target.closest('button') ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsPointer(isTargetClickable);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    
    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Disable default cursor
    document.documentElement.classList.add('custom-cursor');

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      
      // Re-enable default cursor
      document.documentElement.classList.remove('custom-cursor');
    };
  }, []);

  const dotClasses = `cursor-dot ${isHidden ? 'opacity-0' : 'opacity-100'} 
    ${isClicking ? 'scale-50' : 'scale-100'} 
    transition-all duration-150`;

  const outlineClasses = `cursor-outline ${isHidden ? 'opacity-0' : 'opacity-100'} 
    ${isPointer ? 'scale-150 bg-white bg-opacity-20' : 'scale-100 bg-transparent'} 
    ${isClicking ? 'scale-90' : ''}
    transition-all duration-300`;

  return (
    <>
      <div 
        className={dotClasses}
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          background: isPointer ? 'transparent' : '#fff' 
        }}
      />
      <div 
        className={outlineClasses}
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          borderColor: isPointer ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.5)'
        }}
      />
    </>
  );
};

export default CustomCursor; 