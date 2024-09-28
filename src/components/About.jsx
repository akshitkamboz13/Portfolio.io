import React from 'react';
import Si4kImg from '../assets/AkshitRes11.jpg';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

const About = () => {
  return (
    <section className="w-full h-screen bg-custom-blue flex flex-col lg:flex-row items-center justify-around p-10  md:pt-12 gap-3">
      <div className="flex justify-center w-full mb-6 md:mb-0 ">
        <img 
          src={Si4kImg} 
          alt="Si4k" 
          loading="lazy"
          className="rounded-full h-40 w-40 md:h-72 md:w-72 shadow-lg transform transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="text-white text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">About Me</h1>
        <p className="text-xl md:text-2xl mb-4">I'm a Human</p>
        <p className="text-lg md:text-xl mb-6">
          I am a Full Stack Developer with a passion for creating dynamic and responsive web applications. I excel in both front-end and back-end development, ensuring seamless and scalable solutions. Dedicated to staying current with the latest technologies, I thrive on solving problems and delivering high-quality, user-centric projects.
        </p>
        <div className="flex justify-center md:justify-start gap-6">
          <a href="https://www.linkedin.com/in/akshitkamboz13" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transform transition-transform duration-300 hover:scale-110 custom-cursor-pointer">
            <FaLinkedin size={24} />
          </a>
          <a href="https://www.github.com/akshitkamboz13" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transform transition-transform duration-300 hover:scale-110 custom-cursor-pointer">
            <FaGithub size={24} />
          </a>
          <a href="https://www.twitter.com/siakshit" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transform transition-transform duration-300 hover:scale-110 custom-cursor-pointer">
            <FaTwitter size={24} />
          </a>
        </div>
      </div>
    </section>
  );
}

export default About;
