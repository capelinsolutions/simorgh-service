import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import OptimizedImage from "@/components/ui/optimized-image";
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
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get search parameters from URL
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    const locationParam = urlParams.get('location');
    
    if (serviceParam) {
      // Map service parameter to category if possible
      const serviceMapping: Record<string, string> = {
        'hospital': 'Medical',
        'industrial': 'Industrial',
        'housekeeping': 'Residential',
        'winter': 'Specialized',
        'pool': 'Specialized',
        'jet': 'Specialized',
      };
      const mappedCategory = serviceMapping[serviceParam];
      if (mappedCategory) {
        setSelectedCategory(mappedCategory);
      }
    }
    
    if (locationParam) {
      console.log('Search location:', locationParam);
      // Note: Location filtering would require geocoding implementation
    }
  }, []);

  useEffect(() => {
    console.log('ServicesGrid: Component mounted, calling loadServices');
    loadServices();
  }, []);

  const loadServices = async () => {
    console.log('ServicesGrid: Starting loadServices API call');
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('title', { ascending: true });

      if (error) throw error;
      
      console.log('ServicesGrid: API call successful, loaded', data?.length || 0, 'services');
      setServices(data || []);
      
      // Extract unique categories
      const categories = ['All Services', ...new Set(data?.map(service => service.category) || [])];
      setServiceCategories(categories);
    } catch (error) {
      console.error('ServicesGrid: Error loading services:', error);
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

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'All Services' || service.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
          
          {/* Search Bar */}
          <div className="w-full max-w-md mt-6">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#58C0D7] focus:border-transparent text-gray-700 placeholder-gray-400"
            />
          </div>
          
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 mt-8 sm:mt-12 lg:mt-16 w-full">
            {displayedServices.map((service, index) => (
              <article key={service.id} className="bg-white text-center rounded-lg hover:shadow-lg transition-shadow border border-gray-100 cursor-pointer h-full flex flex-col" onClick={() => handleServiceClick(service.id)}>
               <div className="w-full aspect-[5/5] overflow-hidden rounded-t-lg">
    <OptimizedImage
      src={
        service.image_url ||
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80"
      }
      alt={service.title}
      className="w-full h-full object-cover"
    />
  </div>
              <div className="flex w-full flex-col justify-between p-4 flex-1">
                <div className="w-full">
                  <h3 className="text-lg sm:text-xl font-bold text-black uppercase mb-3 line-clamp-2">
                    {service.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 text-left">
                    {service.description}
                  </p>
                  
                  <div className="mb-4 text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-black mb-1">
                      ${service.membership_price}/h/session
                    </div>
                    <div className="text-sm text-gray-500 line-through mb-1">
                      Regular: ${service.regular_price}/h
                    </div>
                    <div className="text-green-600 text-sm font-medium">
                      Save {Math.round(((service.regular_price - service.membership_price) / service.regular_price) * 100)}% with membership
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookNow(service.id);
                  }}
                  className="w-full bg-[#58C0D7] text-white py-3 px-4 rounded-lg hover:bg-[#4aa8c0] transition-colors text-base font-medium uppercase"
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
                  <OptimizedImage
                    src={bookNowIconImg}
                    alt=""
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    width={24}
                    height={24}
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
