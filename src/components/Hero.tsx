import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { services, locations } from '@/data/services';

const Hero = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [service, setService] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build search params
    const searchParams = new URLSearchParams();
    if (location) searchParams.set('location', location);
    if (service) searchParams.set('service', service);
    if (searchQuery) searchParams.set('search', searchQuery);
    
    // Navigate to service booking page with search parameters
    navigate(`/service-booking?${searchParams.toString()}`);
  };

  return (
    <section className="flex flex-col relative min-h-[716px] w-full items-stretch justify-center py-[178px] max-md:max-w-full max-md:py-[100px]">
      <img
        src="https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/dd3ad9c96af0fbd7a67028d8292b5bd505fb07ab?placeholderIfAbsent=true"
        alt="Cleaning service background"
        className="absolute h-full w-full object-cover inset-0"
      />
      
      <div className="relative justify-center items-stretch backdrop-blur-[4.5px] bg-[rgba(88,192,215,0.10)] flex mb-[-35px] w-full flex-col px-12 py-8 max-md:max-w-full max-md:mb-2.5 max-md:px-5">
        <div className="flex w-full flex-col items-center font-bold text-center justify-center max-md:max-w-full">
          <h1 className="text-white text-[88px] max-md:max-w-full max-md:text-[40px]">
            Simorgh Service
          </h1>
          <p className="text-white text-[32px] w-[636px] mt-3 max-md:max-w-full">
            Your trusted cleaning service partner, private and commercial cleaning
          </p>
        </div>
        
        <form onSubmit={handleSearch} className="self-center flex w-[852px] max-w-full items-stretch gap-4 justify-center flex-wrap mt-[21px]">
          <div className="flex min-w-60 items-stretch gap-4 text-sm text-[#333] font-normal h-full">
            <div className="bg-neutral-50 border flex items-center gap-[40px_54px] overflow-hidden whitespace-nowrap justify-between h-full w-[164px] px-4 py-6 rounded-lg border-[rgba(0,0,0,0.08)] border-solid">
              <select 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-white border-none outline-none self-stretch my-auto text-[#333] z-50"
                style={{ backgroundColor: 'white' }}
              >
                <option value="" style={{ backgroundColor: 'white', color: '#333' }}>Location</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc.toLowerCase()} style={{ backgroundColor: 'white', color: '#333' }}>{loc}</option>
                ))}
              </select>
              <img
                src="https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/3f5f495de87889a60ffbdc7438ef8189344efc37?placeholderIfAbsent=true"
                alt="Dropdown arrow"
                className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
              />
            </div>
            
            <div className="bg-neutral-50 border flex items-center gap-[40px_50px] overflow-hidden justify-between h-full w-[151px] px-4 py-6 rounded-lg border-[rgba(0,0,0,0.08)] border-solid">
              <select 
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="bg-white border-none outline-none self-stretch my-auto text-[#333] z-50"
                style={{ backgroundColor: 'white' }}
              >
                <option value="" style={{ backgroundColor: 'white', color: '#333' }}>Select Service</option>
                {services.slice(0, 20).map((svc) => (
                  <option key={svc.id} value={svc.id} style={{ backgroundColor: 'white', color: '#333' }}>{svc.title}</option>
                ))}
                <option value="more" style={{ backgroundColor: 'white', color: '#333' }}>+ View All Services</option>
              </select>
              <img
                src="https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/3f5f495de87889a60ffbdc7438ef8189344efc37?placeholderIfAbsent=true"
                alt="Dropdown arrow"
                className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
              />
            </div>
          </div>
          
          <div className="bg-neutral-50 border flex min-w-60 min-h-14 items-center gap-2 overflow-hidden flex-wrap flex-1 shrink basis-[0%] my-auto pl-4 rounded-lg border-[rgba(0,0,0,0.08)] border-solid max-md:max-w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search here..."
              className="text-[#333] text-base font-normal self-stretch flex-1 shrink basis-8 my-auto bg-transparent border-none outline-none"
            />
            <button 
              type="submit"
              className="justify-center items-center bg-[#58C0D7] self-stretch flex min-h-14 gap-2 w-16 my-auto p-4 hover:bg-[#4aa8c0] transition-colors"
            >
              <img
                src="https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/5a45123e5c19e51aed4c425c82ab82fcf22f6a87?placeholderIfAbsent=true"
                alt="Search"
                className="aspect-[1] object-contain w-6 self-stretch my-auto"
              />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Hero;
