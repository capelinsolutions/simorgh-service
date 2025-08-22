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

  const handleBookNow = (serviceId: number) => {
    navigate(`/service-booking?selectedService=${serviceId}`);
  };

  const filteredServices = selectedCategory === 'All Services' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  const displayedServices = showAll ? filteredServices : filteredServices.slice(0, 12);

  return (
    <section className="flex w-full flex-col items-center justify-center bg-[#EEF9FB] mt-[76px] px-20 py-[111px] max-md:max-w-full max-md:mt-10 max-md:pb-[100px] max-md:px-5">
      <div className="flex w-full max-w-[1200px] flex-col items-stretch -mb-6 max-md:max-w-full max-md:mb-2.5">
        <div className="self-center flex flex-col items-center max-md:max-w-full">
          <h2 className="text-black text-5xl font-semibold max-md:max-w-full max-md:text-[40px]">
            Here are the services we offer
          </h2>
          <p className="text-[rgba(15,15,15,1)] text-xl font-normal text-center mt-3 max-md:max-w-full">
            Choose from our 50+ professional cleaning services with membership savings up to 50%
          </p>
          
          {/* Service Categories Filter */}
          <div className="flex flex-wrap gap-2 mt-8 justify-center">
            {serviceCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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
          <div className="flex w-full items-center gap-6 text-[rgba(15,15,15,1)] justify-center flex-wrap mt-[63px] max-md:max-w-full max-md:mt-10">
            {displayedServices.map((service, index) => (
              <article key={service.id} className="bg-white self-stretch min-w-60 text-center grow shrink w-[350px] my-auto rounded-lg hover:shadow-lg transition-shadow border border-gray-100">
                <img
                  src={service.image_url || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80"}
                  alt={service.title}
                  className="aspect-[1.57] object-contain w-full rounded-t-lg"
                />
              <div className="flex w-full flex-col items-center justify-center px-4 py-7">
                <h3 className="text-xl font-semibold self-stretch line-clamp-2 min-h-[3rem]">
                  {service.title}
                </h3>
                
                <div className="flex flex-col items-center mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-[#58C0D7]">
                      ${service.membership_price}/h
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ${service.regular_price}/h
                    </span>
                  </div>
                  <div className="bg-[#58C0D7] text-white text-xs px-2 py-1 rounded-full">
                    Save ${service.regular_price - service.membership_price}/h with membership
                  </div>
                </div>
                
                <img
                  src={serviceArrowIconImg}
                  alt=""
                  className="object-contain w-[59px] stroke-[3px] stroke-[#58C0D7] mt-4"
                />
                <p className="text-sm font-normal mt-3 text-gray-600 line-clamp-2">
                  {service.description}
                </p>
                
                <button 
                  onClick={() => handleBookNow(service.id)}
                  className="mt-4 w-full bg-[#58C0D7] text-white py-2 px-4 rounded-lg hover:bg-[#4aa8c0] transition-colors"
                >
                  Book Now
                </button>
                </div>
              </article>
            ))}
            
            {!showAll && filteredServices.length > 12 && (
            <button 
              onClick={() => setShowAll(true)}
              className="justify-center items-center rounded self-stretch flex min-h-12 gap-2 text-base text-white font-semibold bg-[#58C0D7] my-auto px-4 py-3 hover:bg-[#4aa8c0] transition-colors"
            >
              <span className="self-stretch my-auto">
                Show More ({filteredServices.length - 12} more services)
              </span>
              <img
                src={bookNowIconImg}
                alt=""
                className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto"
              />
            </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesGrid;
