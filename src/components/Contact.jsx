
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import Map from './helperComponents/Map';

const Contact = () => {
  return (
    <div id='Contact'>
    <div className="h-screen bg-custom-blue flex text-white items-center justify-center sm:pt-10">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-custom-blue rounded-lg overflow-hidden">
        {/* Contact Information */}
        <div className="p-8 md:p-16 gap-5">
          <p className="text-green-200 text-sm mb-4">How can I help you?</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact me</h1>
          <p className="text-lg mb-8">
            I&apos;m here to help and answer any questions you might have. I look forward to hearing from you!
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-white min-w-6 min-h-6 mr-4" />
              <p className="text-lg">Nanhera, 132041 Karnal(HR)</p>
            </div>
            <div className="flex items-center">
              <FaPhone className="text-white min-w-6 min-h-6 mr-4 custom-cursor-pointer" />
              <p className="text-lg custom-cursor-pointer">+91 70560 60406</p>
            </div>
            <div className="flex items-center">
              <FaEnvelope className="text-white min-w-6 min-h-6 mr-4 custom-cursor-pointer" />
              <p className="text-lg">
                <a href="mailto:siakshitkamboj@gmail.com" className="text-white custom-cursor-pointer">siakshitkamboj@gmail.com</a>
              </p>
            </div>
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
        </div>
      
        <form className="p-8 md:p-16 bg-custom-blue" action="https://formsubmit.co/akshitkamboz13@gmail.com" method="POST" >
  <div className="space-y-4">
    <h1 className="text-4xl md:text-4xl mt-4 font-bold">Get in touch</h1>
    <div className="flex flex-col">
      <input type="text" id="name" name="name" className="p-2 py-4 bg-transparent border-b border-white custom-cursor-I decoration-none focus:outline-none" placeholder='Name' required />
    </div>
    <div className="flex flex-col">
      <input type="email" name="email" id="email" className="p-2 py-4 bg-transparent border-b border-white custom-cursor-I decoration-none focus:outline-none" placeholder='Email' required />
    </div>
    <div className="flex flex-col">
      <textarea id="message" name="message" className="p-2 py-4 bg-transparent border-b h-36 border-white custom-cursor-I decoration-none focus:outline-none" placeholder='Message' required />
    </div>
    <input type="submit" name="send" className="bg-white text-custom-blue font-bold py-2 px-4 rounded custom-cursor-pointer" value="Send" />
  </div>
</form>

      </div>
    </div>
    <Map />
  </div>
  );
};

export default Contact;
