import React from 'react';
import projects from '../assets/Projects.json';

const Projects = () => {

  return (
    <section className="projects w-full bg-custom-blue py-20" id="projects">
      <div className="text-start ml-20">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-10">Projects</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-20">
        {projects.projects.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded-lg shadow-lg relative">
            <h2 className="text-2xl font-semibold text-gray-800">{project.name}</h2>
            <p className="text-gray-600 mt-2">{project.description}</p>
            <div className="flex mt-4">
              {project.technologies.map((tech) => (
                <span key={tech} className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                  {tech}
                </span>
              ))}
            </div>
            <div className="mt-4">
              <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                GitHub
              </a>
              {project.links.live.main && (
                <a href={project.links.live.main} target="_blank" rel="noopener noreferrer" className="ml-4 text-blue-600 underline">
                  Live Demo
                </a>
              )}
              {project.links.live.alternative && (
                <a href={project.links.live.alternative} target="_blank" rel="noopener noreferrer" className="ml-4 text-blue-600 underline">
                  Alternative Demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
