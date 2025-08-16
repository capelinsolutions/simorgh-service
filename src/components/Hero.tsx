import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';
import Select from 'react-select';

const serviceOptions = [
  { value: 'hospital', label: 'Hospital & Practice Cleaning' },
  { value: 'industrial', label: 'Industrial Cleaning' },
  { value: 'housekeeping', label: 'Housekeeping Services' },
  { value: 'winter', label: 'Winter Garden Cleaning' },
  { value: 'pool', label: 'Pool Cleaning' },
  { value: 'jet', label: 'Private Jet & Aircraft Cleaning' },
];

const Hero = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = React.useState(null);

  const handleGetStarted = () => {
    navigate('/service-booking');
  };

  const handleViewServices = () => {
    navigate('/service-booking');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Selected service:', selectedService);
  };

  return (
    <section className="relative min-h-[700px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px] w-full flex items-center overflow-hidden">
      {/* Background Image */}
      <img
        src="/lovable-uploads/3f1c1c8b-28bc-492c-9013-026112f96e8e.png"
        alt="Professional cleaning team"
        className="absolute inset-0 w-full h-full object-cover"
      />

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
                  placeholder="Select Your Service"
                  onChange={(selected) => setSelectedService(selected)}
                  classNames={{
                    control: () =>
                      'border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#58C0D7]',
                    menu: () => 'z-50',
                  }}
                  styles={{
                    control: (base) => ({
                      ...base,
                      padding: '2px 4px',
                    }),
                  }}
                />
              </div>

              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter Postal Code"
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
};

export default Hero;
