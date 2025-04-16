import React, { Suspense, lazy, useEffect } from "react";

const Certifications = lazy(() => import("./Certifications"));
const About = lazy(() => import("./About"));
const Education = lazy(() => import("./Educations"));
const FrontMain = lazy(() => import("./FrontMain"));
const Contact = lazy(() => import("./Contact"));
const Skills = lazy(() => import("./Skills"));
const Projects = lazy(() => import("./Projects"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="relative">
      <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-blue-accent animate-spin"></div>
      <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-l-4 border-r-4 border-purple-accent animate-spin animate-pulse"></div>
    </div>
  </div>
);

const Home = () => {
  useEffect(() => {
    document.title = "Akshit Kamboj | Portfolio";
  },[]);
  
  return (
    <div className="bg-custom-blue text-white">
      <section id="hero" className="relative w-full h-screen">
        <Suspense fallback={<LoadingFallback />}>
          <FrontMain />
        </Suspense>
      </section>
      
      <main className="relative w-full">
        <Suspense fallback={<LoadingFallback />}>
          <div id="about-section">
            <About />
          </div>
          
          <div id="skills-section" className="py-12 md:py-20">
            <Skills />
          </div>
          
          <div id="education-section" className="py-12 md:py-20 bg-gray-900 bg-opacity-30">
            <Education />
          </div>
          
          <div id="certifications-section" className="py-12 md:py-20">
            <Certifications count={3} />
          </div>
          
          <div id="projects-section" className="py-12 md:py-20 bg-gray-900 bg-opacity-30">
            <Projects />
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
