import React, { useEffect, useRef } from 'react';
import Si4kImg from '../assets/AkshitRes11.jpg';
import { FaLinkedin, FaGithub, FaTwitter, FaCode, FaServer, FaLaptopCode, FaDownload } from 'react-icons/fa';

const AboutCard = ({ icon, title, description, delay }) => {
  return (
    <div className="card flex flex-col items-center p-6 hover:scale-105 transform-gpu scale-in" style={{ animationDelay: `${delay}s` }}>
      <div className="mb-4 w-16 h-16 rounded-full flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-md"></div>
        <div className="relative text-4xl">
          {icon}
        </div>
      </div>
      <h3 className="font-semibold text-lg mb-3">{title}</h3>
      <p className="text-gray-400 text-center text-sm">{description}</p>
    </div>
  );
};

const SocialLink = ({ href, bgColor, icon }) => {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-white p-3 rounded-full transform transition-all duration-300 hover:scale-110 hover:shadow-lg custom-cursor-pointer"
      style={{ 
        background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}CC 100%)`,
        boxShadow: `0 4px 14px ${bgColor}50` 
      }}
    >
      {icon}
    </a>
  );
};

const About = () => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (imageRef.current) {
        const { left, top, width, height } = imageRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        
        // Subtle movement effect
        imageRef.current.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale3d(1.05, 1.05, 1.05)`;
      }
    };
    
    const handleMouseLeave = () => {
      if (imageRef.current) {
        imageRef.current.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale3d(1, 1, 1)';
      }
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);
  
  return (
    <section id="about" className="section-container relative">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-20">
        <div ref={containerRef} className="flex justify-center w-full lg:w-1/3 mb-6 lg:mb-0 fade-in">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 opacity-75 blur-xl rounded-full animate-pulse"></div>
            <div className="relative z-10 transition-all duration-300" ref={imageRef}>
              <img 
                src={Si4kImg} 
                alt="Akshit Kamboj" 
                loading="lazy"
                className="rounded-full h-64 w-64 md:h-80 md:w-80 object-cover shadow-2xl border-4 border-blue-800"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 mix-blend-overlay"></div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300">
              <a href="#" className="text-white flex items-center gap-2 font-medium">
                <FaDownload className="text-white" />
                <span className="text-sm">Resume</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="text-white text-center lg:text-left lg:w-2/3 slide-up">
          <h2 className="section-title">About <span className="premium-gradient-text">Me</span></h2>
          <p className="text-xl md:text-2xl mb-6 text-blue-400 font-medium">Full Stack Developer & Tech Enthusiast</p>
          
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md p-6 rounded-xl mb-8 border border-blue-500/20">
            <p className="text-lg md:text-xl mb-2 text-gray-300 leading-relaxed">
              I am a passionate Full Stack Developer with expertise in building modern web applications. 
              I combine technical skills with creative problem-solving to deliver seamless user experiences.
            </p>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              My goal is to create innovative solutions that make a positive impact.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 stagger-animation">
            <AboutCard 
              icon={<FaLaptopCode className="text-blue-500" />}
              title="Frontend"
              description="Creating responsive and intuitive user interfaces with modern frameworks"
              delay={0.1}
            />
            
            <AboutCard 
              icon={<FaServer className="text-purple-500" />}
              title="Backend"
              description="Building robust APIs and server-side applications with scalable architecture"
              delay={0.2}
            />
            
            <AboutCard 
              icon={<FaCode className="text-indigo-500" />}
              title="Development"
              description="Architecting comprehensive software solutions from concept to deployment"
              delay={0.3}
            />
          </div>
          
          <div className="flex justify-center lg:justify-start gap-6">
            <SocialLink 
              href="https://www.linkedin.com/in/akshitkamboz13"
              bgColor="#0077b5"
              icon={<FaLinkedin size={20} />}
            />
            
            <SocialLink 
              href="https://www.github.com/akshitkamboz13"
              bgColor="#333"
              icon={<FaGithub size={20} />}
            />
            
            <SocialLink 
              href="https://www.twitter.com/siakshit"
              bgColor="#1da1f2"
              icon={<FaTwitter size={20} />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
