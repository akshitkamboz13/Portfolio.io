import React from 'react';
import { FaCertificate } from 'react-icons/fa';
import CertificateCard from './helperComponents/CertificateCard';
import certificateData from './helperComponents/CertificateData';
import { Link } from "react-router-dom";

const Certificates = ({ count }) => {
  const icon = <FaCertificate className="h-10 w-10 text-white" />;
  
  const displayedCertificates = count ? certificateData.slice(0, count) : certificateData;

  return (
    <section className="certificates w-full h-max bg-custom-blue py-24 " id="certificates">
      <div className="text-start ml-20">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-10">Certificates</h1>
        
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-8">
        {displayedCertificates.map(({ id, title, description, link }) => (
          <CertificateCard
            key={id}
            title={title}
            description={description}
            link={link}
            icon={icon}
          />
        ))}
      </div>
      <div className='text-center m-36 '>
      {count && (
          <Link
          to= "/certifications" 
          className="bg-white text-custom-blue font-bold py-2 px-4 rounded custom-cursor-pointer hover:bg-custom-blue hover:text-white transition-colors duration-300 hover:scale-110 hover:shadow-lg hover:border-l-2 hover:transform hover:border-r-2 border-white 
          "
        >
          View All
        </Link>
        )}
      </div>
    </section>
  );
};

export default Certificates;
