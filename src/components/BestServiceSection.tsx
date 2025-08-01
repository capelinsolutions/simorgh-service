import React, { useState } from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BestServiceSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleBookNow = (service: string) => {
    navigate(`/service-booking?service=${service}`);
  };

  const services = [
    {
      id: 'office',
      title: 'Office Cleaning',
      description: 'While we can customize your cleaning plan to suit your needs, most clients schedule regular cleaning services:',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'construction',
      title: 'Construction Cleaning',
      description: 'While we can customize your cleaning plan to suit your needs, most clients schedule regular cleaning services:',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'deep',
      title: 'Deep Cleaning',
      description: 'While we can customize your cleaning plan to suit your needs, most clients schedule regular cleaning services:',
      image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'residential',
      title: 'Residential Cleaning',
      description: 'While we can customize your cleaning plan to suit your needs, most clients schedule regular cleaning services:',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'commercial',
      title: 'Commercial Cleaning',
      description: 'While we can customize your cleaning plan to suit your needs, most clients schedule regular cleaning services:',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'window',
      title: 'Window Cleaning',
      description: 'While we can customize your cleaning plan to suit your needs, most clients schedule regular cleaning services:',
      image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    }
  ];

  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(services.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const getCurrentServices = () => {
    const startIndex = currentSlide * itemsPerSlide;
    return services.slice(startIndex, startIndex + itemsPerSlide);
  };

  return (
    <section className="py-24 px-[120px] max-md:px-5 bg-white w-full">
      <div className="w-full">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 mb-16">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              We Always Provide The<br />Best Service
            </h2>
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Services</h3>
            <p className="text-gray-600 leading-relaxed">
              While we can customize your cleaning plan to suit your needs, most clients schedule regular cleaning services:
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#83A790] mb-16"></div>

        {/* Services Grid */}
        <div className="relative overflow-hidden">
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {getCurrentServices().map((service) => (
              <div key={service.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <button
                    onClick={() => handleBookNow(service.id)}
                    className={`${service.buttonStyle} px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2`}
                  >
                    Book Now
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation Arrow */}
          {totalSlides > 1 && (
            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#58C0D7] hover:bg-[#4aa8c0] text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default BestServiceSection;