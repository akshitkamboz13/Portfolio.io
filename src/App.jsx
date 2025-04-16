import React, { useRef, useEffect, useState, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Skills from './components/Skills';
import Educations from './components/Educations';
import Certifications from './components/Certifications';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import CustomLoader from './components/helperComponents/CustomLoader';
// import CustomCursor from './components/cursor/CustomCursor';
import './components/css/PremiumStyles.css';

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
};

// Button to scroll back to top
const ScrollTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button 
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 p-3 rounded-full z-50 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
      aria-label="Scroll to top"
      style={{
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        boxShadow: '0 4px 20px rgba(59, 130, 246, 0.5)'
      }}
    >
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
      </svg>
    </button>
  );
};

// Page transition wrapper with SEO
const PageTransition = ({ children, title, description }) => {
  const pageRef = useRef(null);
  
  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    
    page.classList.add('fade-in');
    
    return () => {
      page.classList.remove('fade-in');
    };
  }, []);
  
  return (
    <>
      <Helmet>
        <title>{title} | Akshit Kamboj</title>
        <meta name="description" content={description} />
      </Helmet>
      <div ref={pageRef} className="opacity-0 transition-opacity duration-500">
        {children}
      </div>
    </>
  );
};

const App = () => {
  return (
    <div className="relative font-sans">
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>
      
      <Router basename="/Portfolio.io">
        <ScrollToTop />
        <Navbar />
        <Suspense fallback={<CustomLoader />}>
          <Routes>
            <Route 
              path="/" 
              element={
                <PageTransition 
                  title="Home" 
                  description="Akshit Kamboj - Full Stack Developer specializing in modern web applications with a focus on user experience, performance, and scalability."
                >
                  <Home />
                </PageTransition>
              } 
            />
            <Route 
              path="/about" 
              element={
                <PageTransition 
                  title="About Me" 
                  description="Learn about Akshit Kamboj, a passionate Full Stack Developer with expertise in building modern web applications."
                >
                  <About />
                </PageTransition>
              } 
            />
            <Route 
              path="/skills" 
              element={
                <PageTransition 
                  title="Skills" 
                  description="Explore Akshit Kamboj's technical skills and expertise in frontend, backend, and development technologies."
                >
                  <Skills />
                </PageTransition>
              } 
            />
            <Route 
              path="/educations" 
              element={
                <PageTransition 
                  title="Education" 
                  description="Akshit Kamboj's educational background and qualifications in Computer Engineering and related fields."
                >
                  <Educations />
                </PageTransition>
              } 
            />
            <Route 
              path="/certifications" 
              element={
                <PageTransition 
                  title="Certifications" 
                  description="Certifications and credentials earned by Akshit Kamboj in various technologies and development areas."
                >
                  <Certifications />
                </PageTransition>
              } 
            />
            <Route 
              path="/projects" 
              element={
                <PageTransition 
                  title="Projects" 
                  description="Portfolio of projects developed by Akshit Kamboj, showcasing practical applications of technical skills."
                >
                  <Projects />
                </PageTransition>
              } 
            />
            <Route 
              path="/experience" 
              element={
                <PageTransition 
                  title="Experience" 
                  description="Professional experience and work history of Akshit Kamboj in the field of web development."
                >
                  <Experience />
                </PageTransition>
              } 
            />
            <Route 
              path="/contact" 
              element={
                <PageTransition 
                  title="Contact" 
                  description="Get in touch with Akshit Kamboj for collaboration, job opportunities, or any queries related to web development."
                >
                  <Contact />
                </PageTransition>
              } 
            />
            <Route 
              path="*" 
              element={
                <PageTransition 
                  title="404 - Page Not Found" 
                  description="The page you are looking for does not exist."
                >
                  <NotFound />
                </PageTransition>
              } 
            />
          </Routes>
        </Suspense>
        <ScrollTopButton />
      </Router>
    </div>
  );
};

export default App;
