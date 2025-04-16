import React, { useRef, useEffect } from 'react';
import { FaCertificate, FaAward, FaMedal, FaChevronRight } from 'react-icons/fa';
import { Link } from "react-router-dom";
import certificateData from './helperComponents/CertificateData';
import AnimatedBackground from './helperComponents/AnimatedBackground';
import SectionObserver from './helperComponents/SectionObserver';

const CertificateCard = ({ certificate, index }) => {
  const cardRef = useRef(null);
  
  useEffect(() => {
    const card = cardRef.current;
    
    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 15;
      const rotateY = -(x - centerX) / 15;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px) scale3d(1.02, 1.02, 1.02)`;
    };
    
    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale3d(1, 1, 1)';
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Assign different icons and colors based on index
  const getIconAndColor = (index) => {
    const icons = [<FaCertificate />, <FaAward />, <FaMedal />];
    const colors = ["text-blue-500", "text-purple-500", "text-yellow-400", "text-green-500", "text-cyan-400", "text-orange-500"];
    
    return {
      icon: icons[index % icons.length],
      color: colors[index % colors.length],
      gradientFrom: index % 2 === 0 ? '#3b82f6' : '#8b5cf6',
      gradientTo: index % 2 === 0 ? '#2563eb' : '#7c3aed'
    };
  };
  
  const { icon, color, gradientFrom, gradientTo } = getIconAndColor(index);

  return (
    <div 
      ref={cardRef} 
      className="card group scale-in premium-glass"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="absolute inset-0 opacity-10 rounded-xl" 
        style={{ 
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
          filter: 'blur(20px)',
          transform: 'translate3d(0, 0, -1px)'
        }} 
      />
      
      <div className="relative">
        <div className="flex items-center gap-4 mb-5">
          <div className={`text-4xl ${color} group-hover:scale-110 transition-transform duration-300`}>{icon}</div>
          <h3 className="text-lg font-semibold">{certificate.title}</h3>
        </div>
        
        <p className="text-gray-300 mb-6 text-sm">{certificate.description}</p>
        
        <div className="mt-auto pt-4 flex justify-end">
          <button
            onClick={() => window.open(certificate.link)}
            className={`px-4 py-2 rounded-full ${color} bg-opacity-20 hover:bg-opacity-30 transition-all duration-300 group-hover:translate-x-1`}
          >
            View Certificate
            <FaChevronRight className="inline-block ml-2 text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
};

const CircleDecoration = ({ size, top, left, color, delay }) => (
  <div 
    className="absolute rounded-full opacity-20 pulse"
    style={{ 
      width: size,
      height: size,
      top,
      left,
      backgroundColor: color,
      animationDelay: delay
    }}
  />
);

const Certificates = ({ count }) => {
  const displayedCertificates = count ? certificateData.slice(0, count) : certificateData;

  return (
    <SectionObserver>
      <section id="certificates" className="section-container relative overflow-hidden">
        <AnimatedBackground color1="#8b5cf6" color2="#ec4899" density={0.00008} />
        
        {/* Decorative elements */}
        <CircleDecoration size="300px" top="-100px" left="-150px" color="#3b82f6" delay="0s" />
        <CircleDecoration size="200px" top="80%" right="-100px" color="#8b5cf6" delay="1s" />
        
        <div className="relative z-10">
          <h2 className="section-title text-center mb-16">My <span className="premium-gradient-text shimmer">Certifications</span></h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger-animation">
            {displayedCertificates.map((certificate, index) => (
              <CertificateCard 
                key={certificate.id} 
                certificate={certificate} 
                index={index} 
              />
            ))}
          </div>
          
          {count && (
            <div className="flex justify-center mt-12">
              <Link
                to="/certifications"
                className="premium-button primary flex items-center gap-2 transform transition-all duration-300 hover:scale-105"
              >
                <FaCertificate className="text-white" />
                <span>View All Certifications</span>
              </Link>
            </div>
          )}
        </div>
      </section>
    </SectionObserver>
  );
};

export default Certificates;
