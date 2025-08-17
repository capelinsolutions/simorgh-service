import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';

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

const BestServiceSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const handleBookNow = (serviceId: number) => {
    navigate(`/service-booking?serviceId=${serviceId}`);
  };

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
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const visibleItems = 3;
  const maxSlides = services.length - visibleItems;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev >= maxSlides ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev <= 0 ? maxSlides : prev - 1));
  };

  return (
    <section className="py-16 md:py-24 px-5 w-full bg-white">
      <div className="max-w-screen-xl mx-auto w-full">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 md:gap-12 mb-12 md:mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              We Always Provide The
              <br />
              Best Service
            </h2>
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
              Services
            </h3>
            <p className="text-gray-600 leading-relaxed">
              While we can customize your cleaning plan to suit your needs, most
              clients schedule regular cleaning services:
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#83A790] mb-12 md:mb-16"></div>

        
        {/* Slider */}
        <div className="relative">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Loading services...</div>
            </div>
          ) : services.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">No services available</div>
            </div>
          ) : (
            <>
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${
                      currentSlide * (100 / visibleItems)
                    }%)`,
                  }}
                >
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 bg-white rounded-2xl overflow-hidden shadow-sm"
                    >
                      <div className="overflow-hidden px-4 rounded-2xl h-64 md:h-80">
                        <img
                          src={service.image_url || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80"}
                          alt={service.title}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      </div>
                      <div className="p-4 md:p-6">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 md:mb-6">
                          {service.description}
                        </p>
                        <button
                          onClick={() => handleBookNow(service.id)}
                          className="bg-white border border-gray-300 text-gray-700 px-5 md:px-6 py-2.5 md:py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-[#58C0D7] hover:text-white hover:border-[#58C0D7] transition-all"
                        >
                          Book Now
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Arrows */}
          {services.length > visibleItems && (
            <>
              <button
                onClick={prevSlide}
                className="absolute -left-3 md:-left-4 top-1/3 transform -translate-y-1/2 bg-[#58C0D7] hover:bg-[#4aa8c0] text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg z-10"
              >
                <ArrowRight size={18} className="rotate-180" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute -right-3 md:-right-4 top-1/3 transform -translate-y-1/2 bg-[#58C0D7] hover:bg-[#4aa8c0] text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg z-10"
              >
                <ArrowRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default BestServiceSection;
