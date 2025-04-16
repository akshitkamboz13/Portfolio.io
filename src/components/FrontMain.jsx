import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ParticleBackground from "./ParticleBackground";
import { FaArrowDown, FaCode, FaLaptopCode, FaMobileAlt } from "react-icons/fa";

const FloatingIcon = ({ icon, position, delay, duration }) => {
  return (
    <div 
      className={`absolute text-6xl animate-float`} 
      style={{ 
        animationDelay: `${delay}s`, 
        animationDuration: `${duration}s`,
        ...position,
        opacity: 0.2,
      }}
    >
      {icon}
    </div>
  );
};

const FrontMain = () => {
  const textRef = useRef(null);
  const rafRef = useRef(null);
  const lastMoveTime = useRef(0);
  const [showArrow, setShowArrow] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    // Hide arrow if not on homepage
    if (location.pathname !== '/') {
      setShowArrow(false);
      return;
    } else {
      setShowArrow(true);
    }
    
    // Throttle handler for better performance
    const handleMouseMove = (e) => {
      if (!textRef.current) return;
      
      // Only process every 30ms (approximately 30fps instead of potentially 60+fps)
      const now = Date.now();
      if (now - lastMoveTime.current < 30) return;
      lastMoveTime.current = now;
      
      // Use requestAnimationFrame to align with the browser's render cycle
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        // Calculate movement percentage (-5 to 5)
        const moveX = (clientX / innerWidth - 0.5) * 10;
        const moveY = (clientY / innerHeight - 0.5) * 10;
        
        // Apply 3D transform to text - using a less intensive transform
        if (textRef.current) {
          textRef.current.style.transform = `perspective(1000px) rotateX(${moveY}deg) rotateY(${moveX}deg)`;
        }
      });
    };
    
    // Handle scroll to hide arrow when scrolling past the hero section
    const handleScroll = () => {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        const aboutSectionTop = aboutSection.getBoundingClientRect().top;
        // Hide arrow when About section is close to viewport top
        if (aboutSectionTop < window.innerHeight * 0.8) {
          setShowArrow(false);
        } else {
          setShowArrow(true);
        }
      }
    };
    
    // Call once to initialize
    handleScroll();
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [location.pathname]);
  
  // Handle smooth scroll to About section
  const scrollToAbout = (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <>
      <div className="relative w-full h-screen bg-transparent overflow-hidden">
        <ParticleBackground />
        
        {/* Floating tech icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <FloatingIcon 
            icon={<FaCode className="text-blue-400" />} 
            position={{ top: '15%', left: '10%' }}
            delay={0}
            duration={6}
          />
          
          <FloatingIcon 
            icon={<FaLaptopCode className="text-purple-400" />} 
            position={{ top: '25%', right: '15%' }}
            delay={1}
            duration={7}
          />
          
          <FloatingIcon 
            icon={<FaMobileAlt className="text-indigo-400" />} 
            position={{ bottom: '25%', left: '15%' }}
            delay={2}
            duration={8}
          />
        </div>
        
        {/* Main content */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center w-full max-w-4xl px-6">
          <div ref={textRef} className="transform-gpu transition-transform duration-300 ease-out">
            <div className="fade-in" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                <span className="inline-block relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-500 animate-gradient-x">
                    Hello, I'm Akshit
                  </span>
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 heading-underline"></span>
                </span>
              </h1>
            </div>
            
            <div className="slide-up" style={{ animationDelay: '0.5s' }}>
              <h2 className="text-2xl md:text-3xl font-medium mb-6 text-gray-300">
                Full Stack Developer & Problem Solver
              </h2>
            </div>
            
            <div className="fade-in" style={{ animationDelay: '0.8s' }}>
              <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-gray-400 leading-relaxed">
                I build responsive web applications with modern technologies and a 
                focus on <span className="text-blue-400">user experience</span>,{" "}
                <span className="text-purple-400">performance</span>, and{" "}
                <span className="text-indigo-400">scalability</span>.
              </p>
            </div>
          </div>
          
          <div className="slide-up" style={{ animationDelay: '1s' }}>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Link
                to="/projects"
                className="premium-button primary group relative overflow-hidden"
              >
                <span className="relative z-10">View My Work</span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-blue-700/80 group-hover:opacity-0 transition-opacity duration-300"></span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
              
              <Link
                to="/contact"
                className="premium-button primary flex items-center justify-center gap-2 transform transition-all duration-300 hover:scale-105"
              >
                <span className="text-white">Get In Touch</span>
              </Link>
            </div>
          </div>
        </div>
        
        {showArrow && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 fade-in" style={{ animationDelay: '1.5s', zIndex: 20 }}>
            <a 
              href="#about" 
              className="inline-block group"
              aria-label="Scroll down"
              onClick={scrollToAbout}
            >
              <FaArrowDown className="text-3xl text-white opacity-70 group-hover:opacity-100 group-hover:text-blue-400 animate-bounce transition-all duration-300" />
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default FrontMain;