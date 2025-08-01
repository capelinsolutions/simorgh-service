import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/service-booking');
  };

  const handleViewServices = () => {
    navigate('/service-booking');
  };

  return (
    <section className="relative min-h-[800px] w-full flex items-center justify-center overflow-hidden">
      <img
        src="/lovable-uploads/3f1c1c8b-28bc-492c-9013-026112f96e8e.png"
        alt="Professional cleaning team"
        className="absolute inset-0 w-full h-full object-cover scale-110"
      />
      
      <div className="relative z-10 w-full flex items-center justify-start h-full min-h-[800px] pl-[120px] max-md:pl-5">
        <div className="max-w-4xl">
          <p className="text-gray-600 text-lg mb-4 font-medium">
            Quality cleaning at a fair price.
          </p>
          
          <h1 className="text-gray-900 text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6">
            Specialized, efficient,<br />and thorough cleaning<br />services
          </h1>
          
          <p className="text-gray-600 text-lg mb-8 leading-relaxed max-w-lg">
            We provide Performing cleaning tasks using the least amount of time, energy, and money.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleGetStarted}
              className="bg-[#58C0D7] hover:bg-[#4aa8c0] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Get Start Now
            </button>
            
            <button
              onClick={handleViewServices}
              className="border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-colors bg-white/80 backdrop-blur-sm"
            >
              View all Services
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
