import React, { Suspense, lazy, useEffect } from "react";
import CustomLoader from "./helperComponents/CustomLoader";

const Certifications = lazy(() => import("./Certifications"));
const About = lazy(() => import("./About"));
const Education = lazy(() => import("./Educations"));
const FrontMain = lazy(() => import("./FrontMain"));
const Contact = lazy(() => import("./Contact"));
const Skills = lazy(() => import("./Skills"));
const Projects = lazy(() => import("./Projects"));

const Home = () => {
  useEffect(() => {
    document.title = "Akshit Kamboj | Portfolio";
  },[]);
  
  return (
    <div className="bg-custom-blue text-white">
      <section id="hero" className="relative w-full h-screen">
        <Suspense fallback={<CustomLoader />}>
          <FrontMain />
        </Suspense>
      </section>
      
      <main className="relative w-full">
        <Suspense fallback={<CustomLoader />}>
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
        </Suspense>
      </main>
      
      <footer className="bg-gray-900 py-8 text-center text-sm text-gray-400">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Akshit Kamboj. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
