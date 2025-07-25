import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const [activeNav, setActiveNav] = useState('Home');

  const getActiveClass = (path: string) => {
    const isActive = location.pathname === path;
    return isActive 
      ? 'text-[#58C0D7] font-semibold' 
      : 'text-[rgba(40,40,40,1)] font-normal';
  };

  return (
    <header className="bg-white flex w-full items-center gap-[40px_100px] text-base justify-between flex-wrap px-[120px] max-md:max-w-full max-md:px-5">
      <img
        src="https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/11d27c766350de61f072c43b85f52036de041534?placeholderIfAbsent=true"
        alt="Simorgh Service Group Logo"
        className="aspect-[1.5] object-contain w-[120px] self-stretch shrink-0 my-auto"
      />
      
      <nav className="bg-[rgba(134,134,134,0.1)] self-stretch flex min-w-60 items-center gap-2 text-[rgba(40,40,40,1)] font-normal flex-wrap my-auto rounded-[48px] max-md:max-w-full">
        <Link
          to="/"
          className={`self-stretch flex min-h-12 items-center gap-2 whitespace-nowrap justify-center my-auto px-4 py-[13px] ${getActiveClass('/')}`}
        >
          Home
        </Link>
        <Link
          to="/service-booking"
          className={`self-stretch flex min-h-12 items-center gap-2 whitespace-nowrap justify-center my-auto px-4 py-[13px] ${getActiveClass('/service-booking')}`}
        >
          Services
        </Link>
        <Link
          to="/membership"
          className={`self-stretch flex min-h-12 items-center gap-2 whitespace-nowrap justify-center my-auto px-4 py-[13px] ${getActiveClass('/membership')}`}
        >
          Pricing
        </Link>
        {[
          { name: 'About us', href: '#about' },
          { name: 'Contact us', href: '#contact' }
        ].map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="self-stretch flex min-h-12 items-center gap-2 whitespace-nowrap justify-center my-auto px-4 py-[13px] text-[rgba(40,40,40,1)] font-normal hover:text-[#58C0D7] transition-colors"
          >
            {item.name}
          </a>
        ))}
      </nav>

      <div className="self-stretch flex items-center gap-2 font-semibold whitespace-nowrap w-[280px] my-auto">
        <Link 
          to="/auth" 
          className="justify-center items-center rounded border self-stretch flex min-h-12 gap-2 text-[#58C0D7] w-[97px] my-auto px-4 py-[13px] border-solid border-[#58C0D7] hover:bg-[#58C0D7] hover:text-white transition-colors"
        >
          Login
        </Link>
        <Link 
          to="/auth" 
          className="justify-center items-center rounded self-stretch flex min-h-12 gap-2 text-white w-[127px] bg-[#58C0D7] my-auto px-4 py-[13px] hover:bg-[#4aa8c0] transition-colors"
        >
          Register
        </Link>
        <Link 
          to="/admin" 
          className="justify-center items-center rounded border self-stretch flex min-h-12 gap-2 text-[#666] w-[56px] my-auto px-2 py-[13px] border-solid border-[#666] hover:bg-[#666] hover:text-white transition-colors text-xs"
        >
          Admin
        </Link>
      </div>
    </header>
  );
};

export default Header;
