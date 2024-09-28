import React from "react";
import "../css/Certificate.scss";

const CertificateCard = ({ title, description, link, icon }) => {
  return (
    <div>
      <div className="box">
        <div className="box-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="42"
            height="42"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
          </svg>
        </div>
        <div className="box-label">{title} </div>
        <div className="box-title">
          CERTIFICATE
        </div>
        
        
        <div className="box-image ">{description}</div>
        <button
          className="view-button custom-cursor-pointer"
          onClick={() => window.open(link)}
        >
          <div className="view-button-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
            </svg>
          </div>
          <div className="view-button-label ">View</div>
        </button>
      </div>
    </div>
  );
};

export default CertificateCard;
