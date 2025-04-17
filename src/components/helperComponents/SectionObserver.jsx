import React, { useEffect, useRef, useState } from 'react';

const SectionObserver = ({ children, threshold = 0.2, rootMargin = '0px', className = '' }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Add a fallback timer to ensure content becomes visible even if intersection observer fails
  useEffect(() => {
    // Force visibility after a short delay (fallback)
    const fallbackTimer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    return () => clearTimeout(fallbackTimer);
  }, []);
  
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    
    const staggerContainers = section.querySelectorAll('.stagger-animation');
    
    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add animation classes to the section
          entry.target.classList.add('fade-in');
          setIsVisible(true);
          
          // Animate all staggered containers inside the section
          staggerContainers.forEach(container => {
            container.classList.add('animate');
          });
          
          // Disconnect observer after animation triggered
          observer.disconnect();
        }
      });
    };
    
    // Create intersection observer
    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin
    });
    
    // Start observing the section
    observer.observe(section);
    
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [threshold, rootMargin]);
  
  return (
    <div 
      ref={sectionRef} 
      className={`${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 ${className}`}
    >
      {children}
    </div>
  );
};

export default SectionObserver; 