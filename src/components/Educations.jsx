import React, { useRef, useEffect } from 'react';
import { FaGraduationCap, FaSchool, FaUniversity } from 'react-icons/fa';
import rbuIMG from '../assets/images/rbu.jpeg';
import GSSSIMG from '../assets/images/GSSS.jpg';
import NISDIMG from '../assets/images/NISD.png';
import ACHIMG from '../assets/images/ACHS.jpg';

const educationData = [
  {
    id: 1,
    title: 'Bachelor of Technology | Computer Engineering',
    institution: 'Rayat Bahra University | Kharar, Punjab',
    period: '2021-2025 | Pursuing',
    image: rbuIMG,
    location: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50370.81755847352!2d76.60476664952671!3d30.79598956828193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ffa9485c539a5%3A0x7e32a159650281bc!2sRayat-Bahra%20University!5e0!3m2!1sen!2sin!4v1724941051806!5m2!1sen!2sin',
    icon: <FaUniversity />,
    color: "text-blue-500"
  },
  {
    id: 2,
    title: 'Post Matriculation | Non-Medical',
    institution: 'Government Senior Secondary School | Garhi Birbal, Haryana',
    period: '2020-2021 | Completed',
    image: GSSSIMG,
    location: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1266.2649596374745!2d77.15596286466648!3d29.911006772930975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390e5fce54e0fea7%3A0xa60a2ce296837dc2!2sW564%2B8RH%2C%20Garhi%20Birbal%20Rd%2C%20Kharak%2C%20Haryana%20132054!5e0!3m2!1sen!2sin!4v1724940988765!5m2!1sen!2sin',
    icon: <FaSchool />,
    color: "text-purple-500"
  },
  {
    id: 3,
    title: 'Computer Application & Internet',
    institution: 'National Institute of Skill Development | Indri, Haryana',
    period: '2019-2020 | Completed',
    image: NISDIMG,
    location: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d432.4548871233336!2d77.06067535278925!3d29.87468042185499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390e671f9e5bb163%3A0x5613d8c3cc3bd6eb!2sNational%20Paramedical%20Sciences%20Society(NPSS)!5e0!3m2!1sen!2sin!4v1724953272912!5m2!1sen!2sin',
    icon: <FaGraduationCap />,
    color: "text-green-500"
  },
  {
    id: 4,
    title: 'Matriculation',
    institution: 'Aneja City Heart School | Indri, Haryana',
    period: '2018-2019 | Completed',
    image: ACHIMG,
    location: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3459.5089750087095!2d77.05054257996969!3d29.878431661996423!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390e6781867d20fd%3A0xa21d332eb8812bad!2sAneja%20City%20Heart%20School!5e0!3m2!1sen!2sin!4v1724940725517!5m2!1sen!2sin',
    icon: <FaSchool />,
    color: "text-yellow-400"
  }
];

const EducationCard = ({ data, index }) => {
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

  return (
    <div 
      ref={cardRef}
      className="card group scale-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="overflow-hidden rounded-lg h-40 md:w-1/3">
          <img className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" src={data.image} alt={data.title} />
        </div>
        <div className="md:w-2/3">
          <div className="flex items-center gap-3 mb-3">
            <div className={`text-3xl ${data.color} group-hover:scale-110 transition-transform duration-300`}>{data.icon}</div>
            <h3 className="text-lg font-semibold">{data.title}</h3>
          </div>
          
          <p className="text-gray-300 mb-2">{data.institution}</p>
          <p className={`${data.color} font-medium`}>{data.period}</p>
          
          <div className="mt-4 hidden md:block relative h-24 w-full overflow-hidden rounded-lg">
            <iframe
              src={data.location}
              className="w-full h-full border-0 rounded-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300"
              loading="lazy"
              title={`Map for ${data.institution}`}
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

const Education = () => {
  return (
    <section id="education" className="section-container">
      <h2 className="section-title text-center mb-16">My <span className="premium-gradient-text">Education</span></h2>
      
      <div className="space-y-6 stagger-animation">
        {educationData.map((edu, index) => (
          <EducationCard key={edu.id} data={edu} index={index} />
        ))}
      </div>
    </section>
  );
};

export default Education;
