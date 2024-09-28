import React, { Suspense, lazy, useEffect } from "react";

const Certifications = lazy(() => import("./Certifications"));
const About = lazy(() => import("./About"));
const Education = lazy(() => import("./Educations"));
const FrontMain = lazy(() => import("./FrontMain"));
const Contact = lazy(() => import("./Contact"));
const Skills = lazy(() => import("./Skills"));
const Map = lazy(() => import("./helperComponents/Map"));

const Home = () => {
  useEffect(() => {
    document.title = "Akshit Kamboj";
  },[]);
  return (
    <> 
      <div className="relative w-full h-screen bg-custom-blue">
        <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
          <FrontMain />
        </Suspense>
      </div>
      <div className="relative w-full h-[100%] bg-custom-blue">
        <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
          <About />
          <Skills />
          <Education />
          <Certifications count={3} />
          <Contact />
        </Suspense>
      </div>
    </>
  );
};

export default Home;
