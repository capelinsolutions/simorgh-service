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
      id: 'car-cleaning',
      title: 'Car Cleaning (Inside & Out)',
      description: 'Enjoy a fresh, spotless ride inside and out, like it\'s brand new. Interior vacuum & dashboard cleaning, exterior wash & polish.',
      price: '$22/hr with Membership (Normally $45)',
      image: '/lovable-uploads/d288aed5-5f0f-4c13-8024-b26b0c26a92f.png',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'kitchen-deep-cleaning',
      title: 'Kitchen Deep Cleaning',
      description: 'Where clean meets cuisine. Appliance degreasing and sanitizing, cabinet, countertop & sink cleaning.',
      price: '$22/hr with Membership (Normally $45)',
      image: '/lovable-uploads/c26855ad-f7bb-4cf4-8c38-a922d86f34cb.png',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'ventilation-filter-cleaning',
      title: 'Ventilation & Filter Cleaning',
      description: 'Breathe Easy with Clean Air. Cleans vents, ducts, and filters. Boosts HVAC efficiency.',
      price: '$24/hr with Membership (Normally $54)',
      image: '/lovable-uploads/68df079a-338a-4508-94d7-a22437ec21f3.png',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'sauna-deep-cleaning',
      title: 'Sauna Deep Cleaning',
      description: 'Wood-safe cleaning and disinfection. Bench, floor & wall treatment.',
      price: '$24/hr with Membership (Normally $54)',
      image: '/lovable-uploads/17b664a9-1923-4caf-b79e-fdc899421d46.png',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'janitorial-cleaning',
      title: 'Janitorial Cleaning',
      description: 'Keep your space spotless with routine janitorial care. Office and facility upkeep, trash removal and sanitizing.',
      price: '$22/hr with Membership (Normally $45)',
      image: '/lovable-uploads/81950838-d5cc-4aec-9e79-3313fc3f95fb.png',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'tile-deep-cleaning',
      title: 'Tile Deep Cleaning',
      description: 'Sparkling Tiles, Healthier Spaces. Grout and tile scrubbing, polishing for a fresh look.',
      price: '$24/hr with Membership (Normally $54)',
      image: '/lovable-uploads/c31aaf72-c255-4e3d-bacc-e2eb98585963.png',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'commercial-cleaning',
      title: 'Commercial Cleaning',
      description: 'A tidy workplace boosts productivity. Workspace and lobby cleaning, high-touch area disinfection.',
      price: '$24/hr with Membership (Normally $54)',
      image: '/lovable-uploads/b7749772-e75a-4b47-ac92-4629dbf457ed.png',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'warehouse-cleaning',
      title: 'Warehouse Cleaning',
      description: 'Keep your warehouse clean and safe. Floor and equipment dusting, safety zone maintenance.',
      price: '$24/hr with Membership (Normally $54)',
      image: '/lovable-uploads/9798ff63-dd7b-4655-9c35-5e3fa447c9ef.png',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'school-university-cleaning',
      title: 'School & University Hall Cleaning',
      description: 'Learning in a Clean Space. Hallway and common area cleaning, restroom and locker maintenance.',
      price: '$24/hr with Membership (Normally $54)',
      image: '/lovable-uploads/f65d5033-12e6-48cf-ac44-80914e9e2efd.png',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'sports-center-cleaning',
      title: 'Sports Center Cleaning',
      description: 'Play Hard And Stay Clean. Equipment and floor disinfection, locker room and restroom cleaning.',
      price: '$24/hr with Membership (Normally $54)',
      image: '/lovable-uploads/6e54915e-6b92-4236-98b4-68c306f94300.png',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'deep-cleaning',
      title: 'Deep Cleaning',
      description: 'Comprehensive deep cleaning for thorough sanitization. Perfect for seasonal cleaning or preparing for special events.',
      price: '$22/hr with Membership (Normally $45)',
      image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'residential-cleaning',
      title: 'Residential Cleaning',
      description: 'Professional residential cleaning services for homes and apartments. Comprehensive cleaning including all rooms, bathrooms, and common areas.',
      price: '$18/hr with Membership (Normally $36)',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'office-cleaning',
      title: 'Office Cleaning',
      description: 'Professional office and workspace cleaning services. Keep your work environment clean, healthy, and productive.',
      price: '$22/hr with Membership (Normally $45)',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'move-in-out-cleaning',
      title: 'Move In & Out Cleaning',
      description: 'Specialized cleaning for moving in or out of properties. Ensure your new home is spotless or leave your old one pristine.',
      price: '$24/hr with Membership (Normally $54)',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'disinfect-cleaning',
      title: 'Disinfect Cleaning',
      description: 'Professional disinfection and sanitization services. Hospital-grade cleaning for maximum safety and hygiene.',
      price: '$24/hr with Membership (Normally $54)',
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'emergency-cleaning',
      title: 'Emergency Cleaning Services 24/7',
      description: '24/7 emergency cleaning response services. Immediate professional help when you need it most.',
      price: '$45/hr with Membership (Normally $99)',
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'carpet-rug-cleaning',
      title: 'Carpet and Rug Cleaning',
      description: 'Deep carpet and rug cleaning services. Professional cleaning to restore your carpets and rugs to like-new condition.',
      price: '$24/hr with Membership (Normally $54)',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'window-cleaning',
      title: 'Glass and Window Cleaning',
      description: 'Professional window and glass surface cleaning. Crystal clear results for both interior and exterior windows.',
      price: '$22/hr with Membership (Normally $45)',
      image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'private-jet-cleaning',
      title: 'Private Jet & Aircraft Cleaning',
      description: 'Specialized aircraft and private jet cleaning services. Premium cleaning for luxury transportation.',
      price: '$42/hr with Membership (Normally $75)',
      image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'yacht-ship-cleaning',
      title: 'Yacht and Ship Cleaning',
      description: 'Marine vessel cleaning and maintenance services. Professional care for your watercraft investment.',
      price: '$32/hr with Membership (Normally $65)',
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80',
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
                <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  {service.price && (
                    <div className="mb-4">
                      <span className="text-[#58C0D7] font-semibold text-sm">
                        {service.price}
                      </span>
                    </div>
                  )}
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
              className="absolute -right-4 top-1/3 transform -translate-y-1/2 bg-[#58C0D7] hover:bg-[#4aa8c0] text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-lg z-10"
            >
              <ArrowRight size={20} className="text-white" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default BestServiceSection;