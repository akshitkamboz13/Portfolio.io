import React, { useRef, useEffect } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaLinkedin, FaGithub, FaTwitter, FaUser, FaPaperPlane } from 'react-icons/fa';
import Map from './helperComponents/Map';
import AnimatedBackground from './helperComponents/AnimatedBackground';
import SectionObserver from './helperComponents/SectionObserver';

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
      
      const rotateX = (y - centerY) / 20;
      const rotateY = -(x - centerX) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    };
    
    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
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
      className="card premium-glass"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`text-2xl ${color} group-hover:scale-105 transition-transform duration-300`}>{icon}</div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      
      <div className="text-gray-300">
        {children}
      </div>
    </div>
  );
};

// Animated wave decoration - more subtle
const WaveDecoration = () => {
  return (
    <div className="absolute left-0 right-0 bottom-0 h-32 overflow-hidden z-0 opacity-50">
      <svg 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
        className="absolute bottom-0 w-full h-full transform rotate-180"
      >
        <path 
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
          className="fill-current text-blue-500 opacity-5"
        ></path>
        <path 
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
          className="fill-current text-purple-500 opacity-5"
        ></path>
      </svg>
    </div>
  );
};

const Contact = () => {
  return (
    <SectionObserver>
      <section id="contact" className="section-spacing section-container relative">
        <AnimatedBackground color1="#3b82f6" color2="#4f46e5" density={0.00003} />
        <WaveDecoration />
        
        <div className="relative z-10">
          <h2 className="section-title text-center mb-12">Get in <span className="premium-gradient-text">Touch</span></h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-6 stagger-animation">
              <p className="text-lg text-gray-300 mb-8">
                I'm always open to new opportunities and collaborations. Feel free to reach out!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ContactCard 
                  icon={<FaMapMarkerAlt />} 
                  title="Location" 
                  color="text-blue-500"
                >
                  <p>Nanhera, 132041 Karnal(HR)</p>
                </ContactCard>
                
                <ContactCard 
                  icon={<FaPhone />} 
                  title="Phone" 
                  color="text-green-500"
                >
                  <p className="custom-cursor-pointer">+91 70560 60406</p>
                </ContactCard>
                
                <ContactCard 
                  icon={<FaEnvelope />} 
                  title="Email" 
                  color="text-purple-500"
                >
                  <a href="mailto:siakshitkamboj@gmail.com" className="text-gray-300 hover:text-white transition-colors duration-300">
                    siakshitkamboj@gmail.com
                  </a>
                </ContactCard>
                
                <ContactCard 
                  icon={<FaUser />} 
                  title="Social Profiles" 
                  color="text-yellow-400"
                >
                  <div className="flex gap-6 mt-2">
                    <a 
                      href="https://www.linkedin.com/in/akshitkamboz13" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-white hover:text-blue-400 transition-colors duration-300"
                      aria-label="LinkedIn Profile"
                    >
                      <FaLinkedin size={20} />
                    </a>
                    <a 
                      href="https://www.github.com/akshitkamboz13" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-white hover:text-gray-400 transition-colors duration-300"
                      aria-label="GitHub Profile"
                    >
                      <FaGithub size={20} />
                    </a>
                    <a 
                      href="https://www.twitter.com/siakshit" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-white hover:text-blue-300 transition-colors duration-300"
                      aria-label="Twitter Profile"
                    >
                      <FaTwitter size={20} />
                    </a>
                  </div>
                </ContactCard>
              </div>
            </div>
          
            <div className="card premium-glass p-6 relative overflow-hidden">
              {/* Subtle decorative elements */}
              <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-blue-500 opacity-5 blur-xl"></div>
              <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-purple-500 opacity-5 blur-lg"></div>
              
              <div className="relative p-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-2xl text-blue-500">
                    <FaPaperPlane />
                  </div>
                  <h3 className="text-xl font-semibold">Send Me a Message</h3>
                </div>
                
                <form className="space-y-5" action="https://formsubmit.co/akshitkamboz13@gmail.com" method="POST">
                  <div className="relative">
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      className="glass-input" 
                      placeholder="Your Name" 
                      required 
                    />
                  </div>
                  
                  <div className="relative">
                    <input 
                      type="email" 
                      name="email" 
                      id="email" 
                      className="glass-input" 
                      placeholder="Your Email" 
                      required 
                    />
                  </div>
                  
                  <div className="relative">
                    <textarea 
                      id="message" 
                      name="message" 
                      className="glass-input h-32" 
                      placeholder="Your Message" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <button 
                      type="submit" 
                      className="premium-button primary w-full sm:w-auto"
                    >
                      <span className="flex items-center justify-center">
                        Send Message
                        <FaPaperPlane className="ml-2 text-sm" />
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <div className="mt-12 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md border border-blue-500/20 shadow-lg z-10 relative h-[450px] hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 z-0"></div>
            <Map />
          </div>
        </div>
      </section>
    </SectionObserver>
  );
};

export default Contact;
