import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';
import Select from 'react-select';
import OptimizedImage from "@/components/ui/optimized-image";
import { supabase } from '@/integrations/supabase/client';

interface Service {
  id: number;
  title: string;
  description: string;
  category: string;
  is_active: boolean;
}

const Hero = React.memo(() => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = React.useState(null);
  const [postalCode, setPostalCode] = React.useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Load services from database
  useEffect(() => {
    const loadServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('id, title, description, category, is_active')
          .eq('is_active', true)
          .order('category', { ascending: true })
          .order('title', { ascending: true });

        if (error) {
          console.error('Error loading services:', error);
          return;
        }

        setServices(data || []);
      } catch (error) {
        console.error('Error loading services:', error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  // Convert services to options format for react-select, grouped by category
  const serviceOptions = services.reduce((acc, service) => {
    const existingGroup = acc.find(group => group.label === service.category);
    const option = {
      value: service.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      label: service.title,
    };

    if (existingGroup) {
      existingGroup.options.push(option);
    } else {
      acc.push({
        label: service.category,
        options: [option]
      });
    }
    return acc;
  }, [] as Array<{ label: string; options: Array<{ value: string; label: string }> }>);

  // Custom format for group labels
  const formatGroupLabel = (data: any) => (
    <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200 font-medium text-gray-700 text-sm">
      <span>{data.label}</span>
      <span className="text-gray-500 text-xs">({data.options.length})</span>
    </div>
  );

  const handleGetStarted = () => {
    navigate('/service-booking');
  };

  const handleViewServices = () => {
    navigate('/services');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to services page with search parameters
    const searchParams = new URLSearchParams();
    if (selectedService) {
      searchParams.append('service', selectedService.value);
    }
    if (postalCode.trim()) {
      searchParams.append('location', postalCode.trim());
    }
    
    navigate(`/services${searchParams.toString() ? `?${searchParams.toString()}` : ''}`);
  };

  return (
    <section className="relative min-h-[700px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px] w-full flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <OptimizedImage
          src="/lovable-uploads/3f1c1c8b-28bc-492c-9013-026112f96e8e.png"
          alt="Professional cleaning team providing specialized services"
          className="w-full h-full object-cover"
          priority={true}
          width={1920}
          height={800}
        />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 w-full">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-10 lg:px-0 flex items-center min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px]">
          <div className="max-w-4xl text-center lg:text-left">
            <p className="text-gray-600 text-base sm:text-lg mb-3 sm:mb-4 font-medium">
              Quality cleaning at a fair price.
            </p>

            <h1 className="text-gray-900 text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-4 sm:mb-6">
              Specialized, efficient,
              <br className="hidden sm:block" />
              and thorough cleaning
              <br className="hidden sm:block" />
              services
            </h1>

            <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
              We provide performing cleaning tasks using the least amount of time, energy, and money.
            </p>

            {/* Search Form */}
            <form
              onSubmit={handleSearch}
              className="bg-white rounded-lg shadow-lg p-4 mb-6 flex flex-col sm:flex-row gap-4 sm:gap-2 items-stretch sm:items-center"
            >
              <div className="flex-1">
                <Select
                  options={serviceOptions}
                  placeholder={loading ? "Loading services..." : "Select Your Service"}
                  isLoading={loading}
                  isDisabled={loading}
                  value={selectedService}
                  onChange={(selected) => setSelectedService(selected)}
                  formatGroupLabel={formatGroupLabel}
                  maxMenuHeight={300}
                  isSearchable={true}
                  classNames={{
                    control: (state) =>
                      `border border-gray-300 rounded-md text-sm ${
                        state.isFocused ? 'ring-2 ring-[#58C0D7] border-[#58C0D7]' : ''
                      }`,
                    menu: () => 'z-[9999] bg-white border border-gray-200 rounded-md shadow-xl',
                    menuList: () => 'bg-white rounded-md max-h-[300px] overflow-y-auto py-1',
                    option: (state) => 
                      `px-3 py-2 cursor-pointer text-sm ${
                        state.isSelected 
                          ? 'bg-[#58C0D7] text-white' 
                          : state.isFocused 
                            ? 'bg-gray-100 text-gray-900' 
                            : 'text-gray-700 hover:bg-gray-50'
                      }`,
                    placeholder: () => 'text-gray-500 text-sm',
                    singleValue: () => 'text-gray-900 text-sm',
                    input: () => 'text-gray-900 text-sm',
                    noOptionsMessage: () => 'text-gray-500 text-sm px-3 py-2',
                    loadingMessage: () => 'text-gray-500 text-sm px-3 py-2',
                  }}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      padding: '4px 8px',
                      backgroundColor: 'white',
                      minHeight: '42px',
                      boxShadow: 'none',
                      '&:hover': {
                        borderColor: '#58C0D7',
                      },
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                      backgroundColor: 'white',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    }),
                    menuList: (base) => ({
                      ...base,
                      backgroundColor: 'white',
                      maxHeight: '300px',
                      padding: 0,
                    }),
                    groupHeading: (base) => ({
                      ...base,
                      backgroundColor: '#f9fafb',
                      borderBottom: '1px solid #e5e7eb',
                      color: '#374151',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      padding: '8px 12px',
                      margin: 0,
                      textTransform: 'none',
                    }),
                    indicatorSeparator: () => ({
                      display: 'none',
                    }),
                    dropdownIndicator: (base) => ({
                      ...base,
                      color: '#9ca3af',
                      '&:hover': {
                        color: '#58C0D7',
                      },
                    }),
                  }}
                  components={{
                    NoOptionsMessage: ({ children, ...props }: any) => (
                      <div {...props.innerProps} className="px-3 py-2 text-gray-500 text-sm">
                        {children || 'No services found'}
                      </div>
                    ),
                    LoadingMessage: ({ children, ...props }: any) => (
                      <div {...props.innerProps} className="px-3 py-2 text-gray-500 text-sm">
                        Loading services...
                      </div>
                    ),
                  }}
                />
              </div>

              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter Postal Code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#58C0D7] pl-10"
                />
                <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center bg-[#58C0D7] text-white px-6 py-2 rounded-md hover:bg-[#4aa8c0] transition-colors"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </button>
            </form>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <button
                onClick={handleGetStarted}
                className="bg-[#58C0D7] hover:bg-[#4aa8c0] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-colors"
              >
                Get Start Now
              </button>

              <button
                onClick={handleViewServices}
                className="border border-[#666666] hover:border-gray-400 text-gray-700 hover:text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-colors bg-transparent"
              >
                View all Services
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Hero;
