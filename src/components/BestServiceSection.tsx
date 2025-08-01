import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
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
    },
    {
      id: 'carpet',
      title: 'Carpet Cleaning',
      description: 'While we can customize your cleaning plan to suit your needs, most clients schedule regular cleaning services:',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'industrial',
      title: 'Industrial Cleaning',
      description: 'While we can customize your cleaning plan to suit your needs, most clients schedule regular cleaning services:',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'disinfection',
      title: 'Disinfection Services',
      description: 'While we can customize your cleaning plan to suit your needs, most clients schedule regular cleaning services:',
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'movein',
      title: 'Move-in/Move-out Cleaning',
      description: 'While we can customize your cleaning plan to suit your needs, most clients schedule regular cleaning services:',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'event',
      title: 'Event Cleaning',
      description: 'While we can customize your cleaning plan to suit your needs, most clients schedule regular cleaning services:',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'medical',
      title: 'Medical Facility Cleaning',
      description: 'While we can customize your cleaning plan to suit your needs, most clients schedule regular cleaning services:',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'school',
      title: 'School Cleaning',
      description: 'While we can customize your cleaning plan to suit your needs, most clients schedule regular cleaning services:',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'restaurant',
      title: 'Restaurant Cleaning',
      description: 'While we can customize your cleaning plan to suit your needs, most clients schedule regular cleaning services:',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'warehouse',
      title: 'Warehouse Cleaning',
      description: 'While we can customize your cleaning plan to suit your needs, most clients schedule regular cleaning services:',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'hotel',
      title: 'Hotel Cleaning',
      description: 'While we can customize your cleaning plan to suit your needs, most clients schedule regular cleaning services:',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'janitorial',
      title: 'Janitorial Services',
      description: 'While we can customize your cleaning plan to suit your needs, most clients schedule regular cleaning services:',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'floor',
      title: 'Floor Cleaning & Polishing',
      description: 'While we can customize your cleaning plan to suit your needs, most clients schedule regular cleaning services:',
      image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'pressure',
      title: 'Pressure Washing',
      description: 'While we can customize your cleaning plan to suit your needs, most clients schedule regular cleaning services:',
      image: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'upholstery',
      title: 'Upholstery Cleaning',
      description: 'While we can customize your cleaning plan to suit your needs, most clients schedule regular cleaning services:',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    }
  ];

  const visibleItems = 3;
  const maxSlides = services.length - visibleItems;

  const nextSlide = () => {
    setCurrentSlide((prev) => prev >= maxSlides ? 0 : prev + 1);
  };

  const getVisibleServices = () => {
    return services.slice(currentSlide, currentSlide + visibleItems);
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
            {getVisibleServices().map((service) => (
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
          {maxSlides > 0 && (
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#58C0D7] hover:bg-[#4aa8c0] text-white w-16 h-16 rounded-full flex items-center justify-center transition-colors"
            >
              <img src="/lovable-uploads/1ee07c93-c687-459f-969d-e35bf8c4bd94.png" alt="Next" className="w-8 h-8" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default BestServiceSection;