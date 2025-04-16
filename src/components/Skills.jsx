import React, { useEffect, useRef } from "react";
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNode, FaPython, FaDatabase, FaGitAlt, FaDocker, FaAws, FaFigma, FaLaptopCode, FaServer, FaCode } from "react-icons/fa";
import { SiTypescript, SiTailwindcss, SiMongodb, SiPostgresql, SiGraphql, SiRedux, SiNextdotjs, SiExpress, SiFirebase } from "react-icons/si";

const SkillCard = ({ icon, name, level, color, index }) => {
  const cardRef = useRef(null);
  
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
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" style={{ height: '8px' }}></div>
        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-700 group-hover:animate-pulse relative`} 
            style={{ 
              width: `${level}%`, 
              background: `linear-gradient(90deg, ${getColorValue(color)} 0%, rgba(255, 255, 255, 0.5) 100%)`,
              boxShadow: `0 0 10px ${getColorValue(color)}`
            }}
          >
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-white opacity-30 animate-[pulse_2s_infinite]"></div>
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

const skillsData = [
  { name: "HTML5", icon: <FaHtml5 />, level: 95, color: "text-orange-500" },
  { name: "CSS3", icon: <FaCss3Alt />, level: 90, color: "text-blue-500" },
  { name: "JavaScript", icon: <FaJs />, level: 92, color: "text-yellow-400" },
  { name: "TypeScript", icon: <SiTypescript />, level: 85, color: "text-blue-600" },
  { name: "React", icon: <FaReact />, level: 90, color: "text-cyan-400" },
  { name: "Redux", icon: <SiRedux />, level: 85, color: "text-purple-500" },
  { name: "Next.js", icon: <SiNextdotjs />, level: 80, color: "text-white" },
  { name: "Tailwind CSS", icon: <SiTailwindcss />, level: 90, color: "text-teal-400" },
  { name: "Node.js", icon: <FaNode />, level: 88, color: "text-green-500" },
  { name: "Express", icon: <SiExpress />, level: 85, color: "text-gray-400" },
  { name: "MongoDB", icon: <SiMongodb />, level: 80, color: "text-green-600" },
  { name: "PostgreSQL", icon: <SiPostgresql />, level: 75, color: "text-blue-700" },
  { name: "GraphQL", icon: <SiGraphql />, level: 70, color: "text-pink-600" },
  { name: "Python", icon: <FaPython />, level: 75, color: "text-blue-500" },
  { name: "Firebase", icon: <SiFirebase />, level: 80, color: "text-yellow-500" },
  { name: "Git", icon: <FaGitAlt />, level: 88, color: "text-orange-600" },
  { name: "Docker", icon: <FaDocker />, level: 70, color: "text-blue-500" },
  { name: "AWS", icon: <FaAws />, level: 65, color: "text-yellow-500" },
  { name: "UI/UX Design", icon: <FaFigma />, level: 75, color: "text-purple-400" },
];

const Skills = () => {
  const frontendSkills = skillsData.filter(skill => 
    ["HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Redux", "Next.js", "Tailwind CSS"].includes(skill.name)
  );
  
  const backendSkills = skillsData.filter(skill => 
    ["Node.js", "Express", "MongoDB", "PostgreSQL", "GraphQL", "Python", "Firebase"].includes(skill.name)
  );
  
  const devOpsSkills = skillsData.filter(skill => 
    ["Git", "Docker", "AWS", "UI/UX Design"].includes(skill.name)
  );

  return (
    <section id="skills" className="section-container">
      <h2 className="section-title text-center mb-16">My <span className="premium-gradient-text">Skills</span></h2>
      
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
    </section>
  );
};

export default Skills;
