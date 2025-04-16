import React, { useRef, useEffect } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaLinkedin, FaGithub, FaTwitter, FaUser, FaPaperPlane } from 'react-icons/fa';
import Map from './helperComponents/Map';

const ContactCard = ({ children, icon, title, color }) => {
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

  return (
    <div 
      ref={cardRef} 
      className="card group scale-in"
    >
      <div className="flex items-center gap-4 mb-5">
        <div className={`text-4xl ${color} group-hover:scale-110 transition-transform duration-300`}>{icon}</div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      
      <div className="text-gray-300">
        {children}
      </div>
    </div>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="section-container">
      <h2 className="section-title text-center mb-16">Get in <span className="premium-gradient-text">Touch</span></h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8 stagger-animation">
          <p className="text-lg text-gray-300">
            I'm here to help and answer any questions you might have. I look forward to hearing from you!
          </p>
          
          <ContactCard 
            icon={<FaMapMarkerAlt />} 
            title="Location" 
            color="text-blue-500"
          >
            <p className="text-lg">Nanhera, 132041 Karnal(HR)</p>
          </ContactCard>
          
          <ContactCard 
            icon={<FaPhone />} 
            title="Phone" 
            color="text-green-500"
          >
            <p className="text-lg custom-cursor-pointer">+91 70560 60406</p>
          </ContactCard>
          
          <ContactCard 
            icon={<FaEnvelope />} 
            title="Email" 
            color="text-purple-500"
          >
            <p className="text-lg">
              <a href="mailto:siakshitkamboj@gmail.com" className="text-gray-300 hover:text-white transition-colors duration-300">
                siakshitkamboj@gmail.com
              </a>
            </p>
          </ContactCard>
          
          <ContactCard 
            icon={<FaUser />} 
            title="Social Profiles" 
            color="text-yellow-400"
          >
            <div className="flex gap-6 mt-4">
              <a 
                href="https://www.linkedin.com/in/akshitkamboz13" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-blue-400 transform transition-transform duration-300 hover:scale-110"
                aria-label="LinkedIn Profile"
              >
                <FaLinkedin size={24} />
              </a>
              <a 
                href="https://www.github.com/akshitkamboz13" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-gray-400 transform transition-transform duration-300 hover:scale-110"
                aria-label="GitHub Profile"
              >
                <FaGithub size={24} />
              </a>
              <a 
                href="https://www.twitter.com/siakshit" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-blue-300 transform transition-transform duration-300 hover:scale-110"
                aria-label="Twitter Profile"
              >
                <FaTwitter size={24} />
              </a>
            </div>
          </ContactCard>
        </div>
        
        <div className="card group scale-in p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl text-blue-500 group-hover:scale-110 transition-transform duration-300">
              <FaPaperPlane />
            </div>
            <h3 className="text-xl font-semibold">Send Me a Message</h3>
          </div>
          
          <form className="space-y-6" action="https://formsubmit.co/akshitkamboz13@gmail.com" method="POST">
            <div className="relative">
              <input 
                type="text" 
                id="name" 
                name="name" 
                className="w-full p-3 bg-gray-900 bg-opacity-40 border-b border-gray-700 focus:border-blue-500 transition-colors duration-300 outline-none" 
                placeholder="Your Name" 
                required 
              />
            </div>
            
            <div className="relative">
              <input 
                type="email" 
                name="email" 
                id="email" 
                className="w-full p-3 bg-gray-900 bg-opacity-40 border-b border-gray-700 focus:border-blue-500 transition-colors duration-300 outline-none" 
                placeholder="Your Email" 
                required 
              />
            </div>
            
            <div className="relative">
              <textarea 
                id="message" 
                name="message" 
                className="w-full p-3 bg-gray-900 bg-opacity-40 border-b border-gray-700 focus:border-blue-500 transition-colors duration-300 h-36 outline-none" 
                placeholder="Your Message" 
                required 
              />
            </div>
            
            <div>
              <button 
                type="submit" 
                className="premium-button primary"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-16 overflow-hidden rounded-xl card scale-in">
        <Map />
      </div>
    </section>
  );
};

export default Contact;
