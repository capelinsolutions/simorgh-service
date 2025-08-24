import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import serviceArrowIconImg from '../assets/service-arrow-icon.jpg';
import bookNowIconImg from '../assets/book-now-icon.jpg';

interface Service {
  id: number;
  title: string;
  description: string;
  regular_price: number;
  membership_price: number;
  image_url: string;
  category: string;
  is_active: boolean;
}

const ServicesGrid = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All Services');
  const [showAll, setShowAll] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceCategories, setServiceCategories] = useState<string[]>(['All Services']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('title', { ascending: true });

      if (error) throw error;
      
      setServices(data || []);
      
      // Extract unique categories
      const categories = ['All Services', ...new Set(data?.map(service => service.category) || [])];
      setServiceCategories(categories);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceClick = (serviceId: number) => {
    navigate(`/service/${serviceId}`);
  };

  const handleBookNow = (serviceId: number) => {
    navigate(`/service/${serviceId}`);
  };

  const filteredServices = selectedCategory === 'All Services' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  const displayedServices = showAll ? filteredServices : filteredServices.slice(0, 12);

  return (
    <section className="flex w-full flex-col items-center justify-center bg-[#EEF9FB] mt-4 sm:mt-6 lg:mt-8 px-4 sm:px-6 lg:px-12 xl:px-20 py-12 sm:py-16">
      <div className="flex w-full max-w-[1200px] flex-col items-stretch">
        <div className="self-center flex flex-col items-center">
          <h2 className="text-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-center leading-tight">
            Here are the services we offer
          </h2>
          <p className="text-gray-800 text-base sm:text-lg lg:text-xl font-normal text-center mt-3 max-w-4xl">
            Choose from our 50+ professional cleaning services with membership savings up to 50%
          </p>
          
          {/* Service Categories Filter */}
          <div className="flex flex-wrap gap-2 mt-6 sm:mt-8 justify-center max-w-4xl">
            {serviceCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#58C0D7] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64 mt-[63px]">
            <div className="text-gray-500">Loading services...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 lg:mt-16 w-full">
            {displayedServices.map((service, index) => (
              <article key={service.id} className="bg-white text-center rounded-lg hover:shadow-lg transition-shadow border border-gray-100 cursor-pointer h-full flex flex-col" onClick={() => handleServiceClick(service.id)}>
                <img
                  src={service.image_url || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80"}
                  alt={service.title}
                  className="aspect-[1.57] object-cover w-full rounded-t-lg"
                />
              <div className="flex w-full flex-col items-center justify-between px-3 sm:px-4 py-4 sm:py-6 flex-1">
                <div className="w-full">
                  <h3 className="text-lg sm:text-xl font-semibold line-clamp-2 min-h-[3rem] mb-3">
                    {service.title}
                  </h3>
                  
                  <div className="flex flex-col items-center mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl sm:text-2xl font-bold text-[#58C0D7]">
                        ${service.membership_price}/h
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 line-through">
                        ${service.regular_price}/h
                      </span>
                    </div>
                    <div className="bg-[#58C0D7] text-white text-xs px-2 py-1 rounded-full text-center">
                      Save ${service.regular_price - service.membership_price}/h with membership
                    </div>
                  </div>
                  
                  <p className="text-xs sm:text-sm font-normal text-gray-600 line-clamp-2 mb-4">
                    {service.description}
                  </p>
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookNow(service.id);
                  }}
                  className="w-full bg-[#58C0D7] text-white py-2 px-4 rounded-lg hover:bg-[#4aa8c0] transition-colors text-sm sm:text-base"
                >
                  Book Now
                </button>
                </div>
              </article>
            ))}
            
            {!showAll && filteredServices.length > 12 && (
              <div className="col-span-full flex justify-center mt-6">
                <button 
                  onClick={() => setShowAll(true)}
                  className="justify-center items-center rounded flex gap-2 text-sm sm:text-base text-white font-semibold bg-[#58C0D7] px-4 py-3 hover:bg-[#4aa8c0] transition-colors"
                >
                  <span>
                    Show More ({filteredServices.length - 12} more services)
                  </span>
                  <img
                    src={bookNowIconImg}
                    alt=""
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesGrid;
