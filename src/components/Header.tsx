import React, { useState } from 'react';

const Header = () => {
  const [activeNav, setActiveNav] = useState('Home');

  const navItems = ['Home', 'Service', 'Agencies', 'About us', 'Contact us'];

  return (
    <header className="bg-white flex w-full items-center gap-[40px_100px] text-base justify-between flex-wrap px-[120px] max-md:max-w-full max-md:px-5">
      <img
        src="https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/11d27c766350de61f072c43b85f52036de041534?placeholderIfAbsent=true"
        alt="Simorgh Service Group Logo"
        className="aspect-[1.5] object-contain w-[120px] self-stretch shrink-0 my-auto"
      />
      
      <nav className="bg-[rgba(134,134,134,0.1)] self-stretch flex min-w-60 items-center gap-2 text-[rgba(40,40,40,1)] font-normal flex-wrap my-auto rounded-[48px] max-md:max-w-full">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => setActiveNav(item)}
            className={`self-stretch flex min-h-12 items-center gap-2 whitespace-nowrap justify-center my-auto px-4 py-[13px] ${
              activeNav === item 
                ? 'text-[#58C0D7] font-semibold' 
                : 'text-[rgba(40,40,40,1)] font-normal'
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="self-stretch flex items-center gap-2 font-semibold whitespace-nowrap w-[233px] my-auto">
        <button className="justify-center items-center rounded border self-stretch flex min-h-12 gap-2 text-[#58C0D7] w-[97px] my-auto px-4 py-[13px] border-solid border-[#58C0D7] hover:bg-[#58C0D7] hover:text-white transition-colors">
          Login
        </button>
        <button className="justify-center items-center rounded self-stretch flex min-h-12 gap-2 text-white w-[127px] bg-[#58C0D7] my-auto px-4 py-[13px] hover:bg-[#4aa8c0] transition-colors">
          Register
        </button>
      </div>
    </header>
  );
};

export default Header;
