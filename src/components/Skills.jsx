import React, { useEffect, useRef, useState } from "react";
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNode, FaPython, FaDatabase, FaGitAlt, FaDocker, FaAws, FaFigma, FaLaptopCode, FaCode, FaGithub, FaServer } from "react-icons/fa";
import { SiTypescript, SiTailwindcss, SiMongodb, SiPostgresql, SiGraphql, SiRedux, SiNextdotjs, SiExpress, SiFirebase } from "react-icons/si";
import AnimatedBackground from './helperComponents/AnimatedBackground';
import SectionObserver from './helperComponents/SectionObserver';
import { Link } from "react-router-dom";

const SkillCard = ({ icon, name, level, color, index }) => {
  const cardRef = useRef(null);
  const progressRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  
  // Add loading animation when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 300 + index * 100); // Staggered loading effect
    
    return () => clearTimeout(timer);
  }, [index]);
  
  useEffect(() => {
    const card = cardRef.current;
    
    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = -(x - centerX) / 10;
      
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

  // Generate random sparkles
  const sparkles = Array.from({ length: 3 }, (_, i) => {
    const delay = Math.random() * 3;
    const duration = 1 + Math.random();
    const left = 20 + Math.random() * 60; // Position within progress bar
    return { id: i, delay, duration, left };
  });

  return (
    <div 
      ref={cardRef}
      className="card group hover:-translate-y-2 transition-all duration-300 scale-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center gap-4 mb-5">
        <div className={`text-4xl ${color} group-hover:scale-110 transition-transform duration-300`}>{icon}</div>
        <h3 className="text-lg font-semibold">{name}</h3>
      </div>
      
      <div className="relative">
        {/* Enhanced gradient background with animation */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full animate-gradient-x" 
          style={{ height: '8px' }}
        ></div>
        
        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
          <div 
            ref={progressRef}
            className={`h-full rounded-full transition-all duration-1000 relative ${loaded ? '' : 'w-0'}`} 
            style={{ 
              width: loaded ? `${level}%` : '0%',
              background: `linear-gradient(90deg, ${getColorValue(color)} 0%, rgba(255, 255, 255, 0.5) 100%)`,
              boxShadow: `0 0 10px ${getColorValue(color)}`,
              animation: 'pulse 2s infinite'
            }}
          >
            {/* Inner glow effect */}
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-white opacity-30 animate-[pulse_2s_infinite]"></div>
            
            {/* Sparkle effects */}
            {sparkles.map(sparkle => (
              <div 
                key={sparkle.id}
                className="absolute top-0 h-full w-[2px] bg-white opacity-0 animate-sparkle"
                style={{ 
                  left: `${sparkle.left}%`, 
                  animationDelay: `${sparkle.delay}s`, 
                  animationDuration: `${sparkle.duration}s` 
                }}
              ></div>
            ))}
            
            {/* Progress shine effect */}
            <div 
              className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 skew-x-[-20deg] animate-shine"
            ></div>
            </div>
        </div>
      </div>
      
      <div className="mt-3 text-right text-sm text-gray-400 flex justify-between items-center">
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs text-gray-500">Experience level</span>
        <span className="font-medium" style={{ color: getColorValue(color) }}>{level}%</span>
      </div>
    </div>
  );
};

// Helper function to convert Tailwind color classes to actual color values
const getColorValue = (colorClass) => {
  const colorMap = {
    'text-orange-500': '#f97316',
    'text-blue-500': '#3b82f6',
    'text-yellow-400': '#facc15',
    'text-blue-600': '#2563eb',
    'text-cyan-400': '#22d3ee',
    'text-purple-500': '#a855f7',
    'text-white': '#ffffff',
    'text-teal-400': '#2dd4bf',
    'text-green-500': '#22c55e',
    'text-gray-400': '#9ca3af',
    'text-green-600': '#16a34a',
    'text-blue-700': '#1d4ed8',
    'text-pink-600': '#db2777',
    'text-yellow-500': '#eab308',
    'text-orange-600': '#ea580c',
    'text-purple-400': '#c084fc',
  };

  return colorMap[colorClass] || '#3b82f6'; // Default to blue if color not found
};

const FloatingParticle = ({ color, size, delay, duration, top, left }) => (
  <div 
    className="absolute rounded-full opacity-20 floating"
    style={{ 
      backgroundColor: color,
      width: size,
      height: size,
      top: top,
      left: left,
      animationDelay: delay,
      animationDuration: duration
    }}
  />
);

const skillsData = [
  // Frontend Skills
  { name: "HTML5", icon: <FaHtml5 />, level: 95, color: "text-orange-500", category: "frontend" },
  { name: "CSS3", icon: <FaCss3Alt />, level: 90, color: "text-blue-500", category: "frontend" },
  { name: "JavaScript", icon: <FaJs />, level: 92, color: "text-yellow-400", category: "frontend" },
  { name: "TypeScript", icon: <SiTypescript />, level: 85, color: "text-blue-600", category: "frontend" },
  { name: "React", icon: <FaReact />, level: 90, color: "text-cyan-400", category: "frontend" },
  { name: "Redux", icon: <SiRedux />, level: 85, color: "text-purple-500", category: "frontend" },
  { name: "Next.js", icon: <SiNextdotjs />, level: 80, color: "text-white", category: "frontend" },
  { name: "Tailwind CSS", icon: <SiTailwindcss />, level: 90, color: "text-teal-400", category: "frontend" },
  { name: "Bootstrap", icon: <FaCode />, level: 85, color: "text-purple-600", category: "frontend" },
  { name: "REST APIs", icon: <FaServer />, level: 88, color: "text-green-600", category: "frontend" },
  { name: "JSON", icon: <FaCode />, level: 90, color: "text-yellow-500", category: "frontend" },
  { name: "AJAX", icon: <FaCode />, level: 82, color: "text-blue-400", category: "frontend" },
  
  // Backend Skills
  { name: "Node.js", icon: <FaNode />, level: 88, color: "text-green-500", category: "backend" },
  { name: "Express.js", icon: <SiExpress />, level: 85, color: "text-gray-400", category: "backend" },
  { name: "MongoDB", icon: <SiMongodb />, level: 80, color: "text-green-600", category: "backend" },
  { name: "PostgreSQL", icon: <SiPostgresql />, level: 75, color: "text-blue-700", category: "backend" },
  { name: "GraphQL", icon: <SiGraphql />, level: 70, color: "text-pink-600", category: "backend" },
  { name: "Python", icon: <FaPython />, level: 75, color: "text-blue-500", category: "backend" },
  { name: "Firebase", icon: <SiFirebase />, level: 80, color: "text-yellow-500", category: "backend" },
  { name: "SQL", icon: <FaDatabase />, level: 78, color: "text-blue-500", category: "backend" },
  { name: "Java", icon: <FaCode />, level: 75, color: "text-red-500", category: "backend" },
  { name: "Spring Boot", icon: <FaCode />, level: 70, color: "text-green-600", category: "backend" },
  { name: "C++", icon: <FaCode />, level: 75, color: "text-blue-700", category: "backend" },
  { name: "RESTful API", icon: <FaServer />, level: 85, color: "text-indigo-500", category: "backend" },
  
  // DevOps & Tools Skills
  { name: "Git", icon: <FaGitAlt />, level: 88, color: "text-orange-600", category: "devops" },
  { name: "GitHub", icon: <FaGithub />, level: 90, color: "text-gray-400", category: "devops" },
  { name: "Docker", icon: <FaDocker />, level: 70, color: "text-blue-500", category: "devops" },
  { name: "AWS", icon: <FaAws />, level: 65, color: "text-yellow-500", category: "devops" },
  { name: "UI/UX Design", icon: <FaFigma />, level: 75, color: "text-purple-400", category: "devops" },
  { name: "VS Code", icon: <FaCode />, level: 92, color: "text-blue-500", category: "devops" },
  { name: "Postman", icon: <FaCode />, level: 85, color: "text-orange-500", category: "devops" },
  { name: "Thunder Client", icon: <FaCode />, level: 80, color: "text-purple-500", category: "devops" },
  { name: "Data Structures", icon: <FaCode />, level: 80, color: "text-green-600", category: "devops" },
  { name: "Linux", icon: <FaCode />, level: 75, color: "text-yellow-600", category: "devops" },
  { name: "Windows", icon: <FaCode />, level: 85, color: "text-blue-600", category: "devops" },
  
  // Additional Technologies
  { name: "Vite", icon: <FaCode />, level: 80, color: "text-purple-500", category: "frontend" },
  { name: "Matter.js", icon: <FaCode />, level: 75, color: "text-pink-500", category: "frontend" },
  { name: "Blockchain", icon: <FaCode />, level: 65, color: "text-orange-500", category: "backend" },
  { name: "Cloud Computing", icon: <FaCode />, level: 70, color: "text-blue-400", category: "devops" },
  { name: "Terminal", icon: <FaCode />, level: 85, color: "text-gray-500", category: "devops" },
];

const Skills = ({ isHomePage = false, maxSkills = 0 }) => {
  // Filter and limit skills for different sections
  const frontendSkills = skillsData.filter(skill => 
    skill.category === "frontend"
  );
  
  const backendSkills = skillsData.filter(skill => 
    skill.category === "backend"
  );
  
  const devOpsSkills = skillsData.filter(skill => 
    skill.category === "devops"
  );

  // For homepage, show a limited selection of top skills
  const homepageSkills = isHomePage ? 
    [...frontendSkills, ...backendSkills, ...devOpsSkills]
      .sort((a, b) => b.level - a.level)
      .slice(0, maxSkills) : 
    null;

  return (
    <SectionObserver>
      <section id="skills" className="section-container relative">
        <AnimatedBackground color1="#a855f7" color2="#6366f1" density={0.00005} />
        
        {/* Decorative floating particles - hide on mobile */}
        <div className="hidden md:block">
          <FloatingParticle color="#a855f7" size="85px" delay="0.2s" duration="4.5s" top="8%" left="12%" />
          <FloatingParticle color="#6366f1" size="65px" delay="0.8s" duration="5s" top="65%" left="88%" />
          <FloatingParticle color="#c084fc" size="45px" delay="1.5s" duration="3.8s" top="35%" left="5%" />
          <FloatingParticle color="#818cf8" size="55px" delay="0.5s" duration="4.2s" top="20%" left="85%" />
          <FloatingParticle color="#6366f1" size="35px" delay="1.2s" duration="3.5s" top="80%" left="20%" />
        </div>
        
        <div className="relative z-10">
          <h2 className="section-title text-center mb-16">My <span className="premium-gradient-text">Skills</span></h2>
          
          {isHomePage ? (
            <>
              <div className="mb-8">
                <div className="card-grid">
                  {homepageSkills.map((skill, index) => (
                    <SkillCard key={index} {...skill} index={index} />
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center mt-12">
                <Link 
                  to="/skills" 
                  className="premium-button primary flex items-center gap-2 transform transition-all duration-300 hover:scale-105"
                >
                  <FaCode className="text-white" />
                  <span>View All Skills</span>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="mb-20">
                <div className="section-header">
                  <div className="section-icon-container" style={{'--from-color': '#3b82f6', '--to-color': '#2563eb'}}>
                    <FaLaptopCode className="text-white text-xl" />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ color: '#3b82f6' }}>Frontend Development</h3>
                </div>
                
                <div className="card-grid">
                  {frontendSkills.map((skill, index) => (
                    <SkillCard key={index} {...skill} index={index} />
                  ))}
                </div>
              </div>
              
              <div className="mb-20">
                <div className="section-header">
                  <div className="section-icon-container" style={{'--from-color': '#a855f7', '--to-color': '#9333ea'}}>
                    <FaServer className="text-white text-xl" />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ color: '#a855f7' }}>Backend Development</h3>
                </div>
                
                <div className="card-grid">
                  {backendSkills.map((skill, index) => (
                    <SkillCard key={index} {...skill} index={index} />
                  ))}
                </div>
              </div>
              
              <div>
                <div className="section-header">
                  <div className="section-icon-container" style={{'--from-color': '#6366f1', '--to-color': '#4f46e5'}}>
                    <FaCode className="text-white text-xl" />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ color: '#6366f1' }}>DevOps & Design</h3>
                </div>
                
                <div className="card-grid">
                  {devOpsSkills.map((skill, index) => (
                    <SkillCard key={index} {...skill} index={index} />
                  ))}
                </div>
              </div>
            </>
          )}
      </div>
    </section>
    </SectionObserver>
  );
};

export default Skills;
