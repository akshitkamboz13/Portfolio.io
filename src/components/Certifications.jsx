import React, { useRef, useEffect } from 'react';
import { FaCertificate, FaAward, FaMedal } from 'react-icons/fa';
import { Link } from "react-router-dom";
import certificateData from './helperComponents/CertificateData';

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
      color: colors[index % colors.length]
    };
  };
  
  const { icon, color } = getIconAndColor(index);

  return (
    <div 
      ref={cardRef} 
      className="card group scale-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center gap-4 mb-5">
        <div className={`text-4xl ${color} group-hover:scale-110 transition-transform duration-300`}>{icon}</div>
        <h3 className="text-lg font-semibold">{certificate.title}</h3>
      </div>
      
      <p className="text-gray-300 mb-6 text-sm">{certificate.description}</p>
      
      <div className="mt-auto pt-4 flex justify-end">
        <button
          onClick={() => window.open(certificate.link)}
          className={`px-4 py-2 rounded-full ${color} bg-opacity-20 hover:bg-opacity-30 transition-all duration-300`}
        >
          View Certificate
        </button>
      </div>
    </div>
  );
};

const Certificates = ({ count }) => {
  const displayedCertificates = count ? certificateData.slice(0, count) : certificateData;

  return (
    <section id="certificates" className="section-container">
      <h2 className="section-title text-center mb-16">My <span className="premium-gradient-text">Certifications</span></h2>
      
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
    </section>
  );
};

export default Certificates;
