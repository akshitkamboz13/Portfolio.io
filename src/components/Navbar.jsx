import React, { useState } from "react";
// import { useEffect } from "react";
import { Link } from "react-router-dom";
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

const Navbar = () => {
  // const [show, handleShow] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const title = Titles[Math.floor(Math.random() * Titles.length)];
    
  
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY > 100) {
  //       handleShow(true);
  //     } else {
  //       handleShow(false);
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  const handleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="w-full">
      <nav
      //className={`navbar ${show ? "bg-gray-900 shadow-lg" : "bg-transparent"}  fixed top-0 w-full z-50 transition-colors duration-300 py-10 px-5 ${
        className={`navbar bg-custom-blue opacity-90
           fixed top-0 w-full z-50 transition-colors duration-300 py-10 px-5`}
      >
        <div className="navbar__container flex items-center justify-between ">
          <div className="navbar__logo text-white custom-cursor-pointer">
            <h2>{title}</h2>
          </div>
          
          <div className={`navbar__menu ${menuOpen ? "hidden" : "block"} md:flex`}>
            <ul className="hidden md:flex  ">
              {navList.map((nav) => (
                <li key={nav.id}>
                  <Link
                    to={nav.url}
                    className="text-white hover:text-gray-300 hover:border-b-2 border-transparent custom-cursor-pointer"
                  >
                    {nav.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div
            className="navbar__toggle md:hidden text-white"
            onClick={handleMenu}
          >
            {menuOpen ? "" : "MENU"}
          </div>
        </div>
        {menuOpen && (
          <div className="navbar__mobile-menu open">
            <div className="navbar__close text-white" onClick={handleMenu}>
              &times;
            </div>
            <ul className="flex flex-col items-center ">
              {navList.map((nav) => (
                <li key={nav.id}>
                  <Link
                    to={nav.url}
                    className="text-white hover:text-gray-300 text-2xl"
                    onClick={() => setMenuOpen(false)}
                  >
                    {nav.title}
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
