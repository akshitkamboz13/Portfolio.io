import React, { useEffect, useRef } from 'react';

const SectionObserver = ({ children, threshold = 0.2, rootMargin = '0px', className = '' }) => {
  const sectionRef = useRef(null);
  
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    
    const staggerContainers = section.querySelectorAll('.stagger-animation');
    
    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add animation classes to the section
          entry.target.classList.add('fade-in');
          
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
    <div ref={sectionRef} className={`opacity-0 ${className}`}>
      {children}
    </div>
  );
};

export default SectionObserver; 