import React, { useRef, useEffect } from 'react';

const ParallaxImage = ({ src, alt, className = '', speed = 0.05, ...rest }) => {
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    let offsetY = 0;
    let frameId = null;
    let prevScrollY = window.scrollY;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (rect.top < windowHeight && rect.bottom > 0) {
        // Element is in view
        const scrollDiff = window.scrollY - prevScrollY;
        offsetY += scrollDiff * speed;
        
        // Set transform with a limit to prevent excessive movement
        const maxOffset = 50; // Maximum pixels to move
        const limitedOffset = Math.max(Math.min(offsetY, maxOffset), -maxOffset);
        img.style.transform = `translateY(${limitedOffset}px)`;
      }
      
      prevScrollY = window.scrollY;
      frameId = requestAnimationFrame(handleScroll);
    };

    frameId = requestAnimationFrame(handleScroll);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [speed]);

  return (
    <div 
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      {...rest}
    >
      <img 
        ref={imgRef}
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover transition-transform duration-300"
      />
    </div>
  );
};

export default ParallaxImage; 