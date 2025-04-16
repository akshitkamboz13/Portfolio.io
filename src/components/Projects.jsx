import React, { useRef, useEffect } from 'react';
import { FaGithub, FaExternalLinkAlt, FaLaptopCode, FaCode, FaFolder, FaCodeBranch } from 'react-icons/fa';
import projects from '../assets/Projects.json';
import AnimatedBackground from './helperComponents/AnimatedBackground';
import SectionObserver from './helperComponents/SectionObserver';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project, index }) => {
  const cardRef = useRef(null);
  
  useEffect(() => {
    const card = cardRef.current;
    
    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 15;
      const rotateY = -(x - centerX) / 15;
      
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

  // Get a color based on the project index
  const getColor = (index) => {
    const colors = ["text-blue-500", "text-purple-500", "text-green-500", "text-yellow-400", "text-cyan-400", "text-orange-500"];
    const bgColors = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-yellow-400", "bg-cyan-400", "bg-orange-500"];
    
    return {
      text: colors[index % colors.length],
      bg: bgColors[index % bgColors.length]
    };
  };
  
  // Get an icon based on technologies
  const getIcon = (technologies) => {
    if (technologies.includes("React")) return <FaReactIcon />;
    if (technologies.includes("HTML")) return <FaCode />;
    return <FaFolder />;
  };
  
  const FaReactIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em">
      <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85-1.03 0-1.87-.85-1.87-1.85 0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 01-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9c-.6 0-1.17 0-1.71.03-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03.6 0 1.17 0 1.71-.03.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68 0 1.69-1.83 2.93-4.37 3.68.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68 0-1.69 1.83-2.93 4.37-3.68-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26 0-.73-1.18-1.63-3.28-2.26-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26 0 .73 1.18 1.63 3.28 2.26.25-.76.55-1.51.89-2.26m9 2.26l-.3.51c.31-.05.61-.1.88-.16-.07-.28-.18-.57-.29-.86l-.29.51m-2.89 4.04c1.59 1.5 2.97 2.08 3.59 1.7.64-.35.83-1.82.32-3.96-.77.16-1.58.28-2.4.36-.48.67-.99 1.31-1.51 1.9M8.08 9.74l.3-.51c-.31.05-.61.1-.88.16.07.28.18.57.29.86l.29-.51m2.89-4.04C9.38 4.2 8 3.62 7.37 4c-.63.35-.82 1.82-.31 3.96a22.7 22.7 0 012.4-.36c.48-.67.99-1.31 1.51-1.9z" />
    </svg>
  );
  
  const color = getColor(index);
  const icon = getIcon(project.technologies);

  return (
    <div 
      ref={cardRef}
      className="card group scale-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="absolute -top-2 -right-2 w-16 h-16 rounded-br-xl rounded-tl-xl overflow-hidden">
        <div className={`${color.bg} absolute rotate-45 w-24 h-3 -left-2 top-5 opacity-80`}></div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`text-3xl ${color.text} group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <h3 className="text-lg font-semibold">{project.name}</h3>
        </div>
      </div>
      
      <p className="text-gray-300 mb-6 text-sm">{project.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {project.technologies.map((tech, i) => (
          <span
            key={i}
            className={`text-xs px-2 py-1 rounded-full ${color.text} bg-opacity-10 ${color.bg} bg-opacity-10 backdrop-blur-sm`}
          >
            {tech}
          </span>
        ))}
      </div>
      
      <div className="mt-auto pt-4 flex gap-4 justify-end">
        <a
          href={project.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-blue-400 transition-colors duration-300 group-hover:animate-bounce"
          aria-label={`GitHub repository for ${project.name}`}
        >
          <FaGithub className="text-xl" />
        </a>
        
        {project.links.live.main && (
          <a
            href={project.links.live.main}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-400 transition-colors duration-300 group-hover:animate-bounce"
            aria-label={`Live demo for ${project.name}`}
          >
            <FaExternalLinkAlt className="text-xl" />
          </a>
        )}
      </div>
    </div>
  );
};

const HexGrid = ({ color, opacity }) => {
  const hexSize = 30;
  const hexagons = [];
  const rows = 5;
  const cols = 15;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * hexSize * 1.5;
      const y = row * hexSize * 1.732 + (col % 2) * (hexSize * 0.866);
      
      hexagons.push(
        <polygon 
          key={`${row}-${col}`}
          points={`${hexSize},0 ${hexSize * 0.5},${hexSize * 0.866} ${-hexSize * 0.5},${hexSize * 0.866} ${-hexSize},0 ${-hexSize * 0.5},${-hexSize * 0.866} ${hexSize * 0.5},${-hexSize * 0.866}`}
          transform={`translate(${x}, ${y})`}
          fill={color}
          fillOpacity={opacity}
          className="transition-opacity duration-1000"
          style={{ animationDelay: `${(row + col) * 0.1}s` }}
        />
      );
    }
  }
  
  return (
    <svg 
      className="absolute top-0 left-0 w-full h-full z-0 opacity-30" 
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 700 400"
    >
      <g>{hexagons}</g>
    </svg>
  );
};

const Projects = ({ isHomePage = false, maxProjects = 0 }) => {
  // For homepage, show only top featured projects
  const featuredProjects = isHomePage ? 
    projects.projects.slice(0, maxProjects) : 
    projects.projects.slice(0, 6);
    
  const otherProjects = projects.projects.slice(6, 12);

  return (
    <SectionObserver>
      <section id="projects" className="section-container relative">
        <AnimatedBackground color1="#3b82f6" color2="#ec4899" density={0.00007} />
        <HexGrid color="#3b82f6" opacity={0.1} />
        
        <div className="relative z-10">
          <h2 className="section-title text-center mb-16">My <span className="premium-gradient-text">Projects</span></h2>
          
          <div className="mb-12">
            <div className="section-header">
              <div className="section-icon-container" style={{'--from-color': '#3b82f6', '--to-color': '#2563eb'}}>
                <FaLaptopCode className="text-white text-xl" />
              </div>
              <h3 className="text-2xl font-bold premium-heading glow-effect" style={{ color: '#3b82f6' }}>Featured Projects</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-animation">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </div>
          
          {isHomePage ? (
            <div className="flex justify-center mt-12">
              <Link 
                to="/projects" 
                className="premium-button primary flex items-center gap-2 transform transition-all duration-300 hover:scale-105"
              >
                <FaFolder className="text-white" />
                <span>View All Projects</span>
              </Link>
            </div>
          ) : (
            <div>
              <div className="section-header">
                <div className="section-icon-container" style={{'--from-color': '#a855f7', '--to-color': '#9333ea'}}>
                  <FaCodeBranch className="text-white text-xl rotate-slow" />
                </div>
                <h3 className="text-2xl font-bold premium-heading glow-effect" style={{ color: '#a855f7' }}>Other Projects</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-animation">
                {otherProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index + 6} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </SectionObserver>
  );
};

export default Projects;
