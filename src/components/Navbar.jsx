import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./css/Navbar.css";
import Titles from "./config/Title";

const navList = [
  { id: 1, title: "Home", url: "/" },
  { id: 2, title: "About", url: "/about" },
  { id: 3, title: "Skills", url: "/skills" },
  { id: 4, title: "Educations", url: "/educations" },
  { id: 5, title: "Certifications", url: "/certifications" },
  { id: 6, title: "Projects", url: "/projects" },
  // { id: 7, title: "Experience", url: "/experience" },
  { id: 8, title: "Contact", url: "/contact" },
];

const NavItem = ({ title, url, isActive, onClick }) => {
  return (
    <li className="relative group">
      <Link
        to={url}
        className={`text-white transition-colors py-2 px-1 text-base font-medium custom-cursor-pointer inline-block relative ${
          isActive ? 'text-blue-400' : 'hover:text-blue-400'
        }`}
        onClick={onClick}
      >
        {title}
        <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300 ${isActive ? 'w-full' : ''}`}></span>
      </Link>
    </li>
  );
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  const title = Titles[Math.floor(Math.random() * Titles.length)];
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMenu = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <div className="w-full">
      <nav
        className={`navbar ${scrolled ? 'bg-custom-blue shadow-lg' : 'bg-custom-blue bg-opacity-70'} 
        fixed top-0 w-full z-50 transition-all duration-300 py-4 px-5 backdrop-blur-md border-b border-gray-800/20`}
      >
        <div className="navbar__container max-w-7xl mx-auto flex items-center justify-between">
          <div className="navbar__logo">
            <Link 
              to="/" 
              className="text-white text-xl md:text-2xl font-bold custom-cursor-pointer relative group"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 group-hover:from-blue-500 group-hover:to-purple-600 transition-all">
                {title}
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
          
          <div className="navbar__menu hidden md:block">
            <ul className="flex space-x-8">
              {navList.map((nav) => (
                <NavItem 
                  key={nav.id} 
                  {...nav} 
                  isActive={location.pathname === nav.url} 
                />
              ))}
            </ul>
          </div>
          
          <button
            className="navbar__toggle md:hidden text-white flex items-center justify-center p-2 rounded-md hover:bg-blue-600/20 transition-all duration-300"
            onClick={handleMenu}
            aria-label="Toggle menu"
            style={{ background: 'transparent' }}
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        
        {menuOpen && (
          <div className="navbar__mobile-menu open">
            <button
              className="absolute top-5 right-5 p-2 text-white hover:bg-blue-600/20 rounded-full transition-all duration-300"
              onClick={handleMenu}
              aria-label="Close menu"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <ul className="flex flex-col items-center space-y-6 py-12 stagger-animation">
              {navList.map((nav, index) => (
                <li key={nav.id} style={{ '--i': index + 1 }}>
                  <Link
                    to={nav.url}
                    className={`text-white text-2xl transition-colors relative ${
                      location.pathname === nav.url ? 'text-blue-400' : 'hover:text-blue-400'
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {nav.title}
                    <span className={`absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 ${
                      location.pathname === nav.url ? 'w-full' : 'w-0'
                    }`}></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
