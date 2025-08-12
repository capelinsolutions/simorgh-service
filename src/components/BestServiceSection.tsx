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
      id: 'staircase-cleaning',
      title: 'Staircase Cleaning',
      description: 'Clean every step, book your Staircase Cleaning today. Dust and debris removal, handrail sanitizing, stain and mark cleaning.',
      price: '$22/hr with Membership (Normally $45)',
      image: '/lovable-uploads/8ef865af-f8b9-45c5-b20b-e48d7a32578d.png',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'airbnb-cleaning',
      title: 'Airbnb Cleaning',
      description: 'Five-Star Clean for Every Guest. Fresh linens and supplies, full home turnaround.',
      price: '$24/hr with Membership (Normally $54)',
      image: '/lovable-uploads/ca8b6d5f-2078-44b7-affd-27463c75bf50.png',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'hospital-practice-cleaning',
      title: 'Hospital & Practice Cleaning',
      description: 'A healthy space for healing. Maintains a spotless and calm environment that supports recovery and care.',
      price: '$24/hr with Membership (Normally $54)',
      image: '/lovable-uploads/5071d900-e393-4f87-9302-b297cabf8c60.png',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'industrial-cleaning',
      title: 'Industrial Cleaning',
      description: 'Heavy-duty equipment and surface cleaning. Grease, oil, and debris removal for factories, warehouses, and production areas.',
      price: '$24/hr with Membership (Normally $54)',
      image: '/lovable-uploads/63775cf9-1b3d-40f5-8e86-7a30bc35172d.png',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'housekeeping-services',
      title: 'Housekeeping Services',
      description: 'Your home deserves consistent, gentle care, just like family. General home cleaning and tidying.',
      price: '$18/hr with Membership (Normally $36)',
      image: '/lovable-uploads/837222c4-0f81-4646-a5c6-c7315a0c3202.png',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'winter-garden-cleaning',
      title: 'Winter Garden Cleaning',
      description: 'Keep your garden clean and tidy, even in winter. Remove fallen leaves and debris, prepares your garden for winter rest.',
      price: '$24/hr with Membership (Normally $54)',
      image: '/lovable-uploads/521f3954-e6c6-4e8c-a3b2-db1700b1bc5f.png',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'pool-cleaning',
      title: 'Pool Cleaning',
      description: 'Clear water. Clean peace of mind. Checks and balances pool chemicals, keeps your pool ready for a swim.',
      price: '$24/hr with Membership (Normally $54)',
      image: '/lovable-uploads/90024f2c-f5b7-4917-8761-ddb35630d53c.png',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'private-jet-cleaning',
      title: 'Private Jet & Aircraft Cleaning',
      description: 'High-altitude hygiene, done right. Interior seat, floor, and cockpit care.',
      price: '$42/hr with Membership (Normally $75)',
      image: '/lovable-uploads/cd3cf549-d113-40ab-95e5-015c4eb6576b.png',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'yacht-ship-cleaning',
      title: 'Yacht and Ship Cleaning',
      description: 'Building/deck and interior polishing, saltwater damage removal. Professional care for your watercraft investment.',
      price: '$32/hr with Membership (Normally $65)',
      image: '/lovable-uploads/db76486a-1783-4ca6-a126-0e0a835eac1e.png',
      buttonStyle: 'bg-white border border-gray-300 text-gray-700 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all duration-300'
    },
    {
      id: 'hotel-service',
      title: 'Hotel Service Cleaning',
      description: 'Let us handle the mess so your guests feel at home. Room turnaround and deep clean, guest-ready standards every time.',
      price: '$24/hr with Membership (Normally $54)',
      image: '/lovable-uploads/63d17ca7-9239-4014-8c05-7eb9090ff428.png',
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