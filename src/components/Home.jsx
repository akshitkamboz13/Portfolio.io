import React, { useEffect } from "react";
import Certifications from "./Certifications";
import About from "./About";
import Education from "./Educations";
import FrontMain from "./FrontMain";
import Contact from "./Contact";
import Skills from "./Skills";
import Projects from "./Projects";

const Home = () => {
  useEffect(() => {
    document.title = "Akshit Kamboj | Portfolio";
  },[]);
  
  return (
    <div className="bg-custom-blue text-white">
      <section id="hero" className="relative w-full h-screen">
        <FrontMain />
      </section>
      
      <main className="relative w-full">
        <div id="about-section">
          <About />
        </div>
        
        <div id="skills-section" className="py-12 md:py-20">
          <Skills isHomePage={true} maxSkills={6} />
        </div>
        
        <div id="education-section" className="py-12 md:py-20 bg-gray-900 bg-opacity-30">
          <Education />
        </div>
        
        <div id="certifications-section" className="py-12 md:py-20">
          <Certifications count={3} />
        </div>
        
        <div id="projects-section" className="py-12 md:py-20 bg-gray-900 bg-opacity-30">
          <Projects isHomePage={true} maxProjects={3} />
        </div>
        
        <div id="contact-section" className="py-12 md:py-20">
          <Contact />
        </div>
      </main>
    </div>
  );
};

export default Home;
