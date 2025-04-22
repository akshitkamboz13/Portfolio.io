import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope, FaCode, FaHeart, FaCoffee } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 bg-opacity-70 backdrop-blur-md border-t border-gray-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 premium-gradient-text inline-block">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  About
                </Link>
              </li>
              <li>
                <Link to="/skills" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  Skills
                </Link>
              </li>
              <li>
                <Link to="/educations" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  Education
                </Link>
              </li>
              <li>
                <Link to="/certifications" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  Certifications
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 premium-gradient-text inline-block">Get in Touch</h3>
            <ul className="space-y-2">
              <li className="text-gray-300 flex items-center gap-2">
                <FaEnvelope className="text-blue-400" />
                <a 
                  href="mailto:siakshitkamboj@gmail.com" 
                  className="hover:text-blue-400 transition-colors duration-300"
                >
                  siakshitkamboj@gmail.com
                </a>
              </li>
              <li className="text-gray-300 flex items-center gap-2">
                <FaLinkedin className="text-blue-400" />
                <a 
                  href="https://www.linkedin.com/in/akshitkamboz13" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors duration-300"
                >
                  LinkedIn
                </a>
              </li>
              <li className="text-gray-300 flex items-center gap-2">
                <FaGithub className="text-blue-400" />
                <a 
                  href="https://www.github.com/akshitkamboz13" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors duration-300"
                >
                  GitHub
                </a>
              </li>
              <li className="text-gray-300 flex items-center gap-2">
                <FaTwitter className="text-blue-400" />
                <a 
                  href="https://www.twitter.com/siakshit" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors duration-300"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>
          
          {/* About */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 premium-gradient-text inline-block">About</h3>
            <p className="text-gray-300 mb-4">
              Portfolio showcasing my skills, projects, and experience as a Full Stack Developer. 
              Built with React, Tailwind CSS, and a passion for creating beautiful user experiences.
            </p>
            <div className="flex space-x-4 mt-4">
              <a 
                href="https://www.linkedin.com/in/akshitkamboz13" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>
              <a 
                href="https://www.github.com/akshitkamboz13" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
                aria-label="GitHub"
              >
                <FaGithub size={20} />
              </a>
              <a 
                href="https://www.twitter.com/siakshit" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-6"></div>
        
        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Akshit Kamboj. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center mt-2 md:mt-0">
            Built with <FaCode className="mx-1 text-blue-400" /> and <FaHeart className="mx-1 text-red-400" /> and <FaCoffee className="mx-1 text-yellow-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 