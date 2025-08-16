import React from 'react';

const Footer = () => {
  const handleApplyClick = () => {
    console.log('Apply to become an agent clicked');
  };

  const handleSocialClick = (platform: string) => {
    console.log(`${platform} clicked`);
  };

  return (
    <footer className="bg-black w-full py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-[100px] justify-between">
        {/* Left Column */}
        <div className="flex flex-col text-white max-w-md">
          <img
            src="https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/f36bfae74dcefd87a82e36827c0a3872deb3c501?placeholderIfAbsent=true"
            alt="Simorgh Service Group Logo"
            className="w-[104px] object-contain"
          />
          <p className="mt-3 text-sm sm:text-base">
            Become your own boss, choose your own schedule, and work in your preferred areas.
          </p>
          <button
            onClick={handleApplyClick}
            className="bg-[#58C0D7] hover:bg-[#4aa8c0] text-white mt-6 px-5 sm:px-6 py-2 sm:py-[9px] rounded-lg font-semibold transition-colors w-fit text-sm sm:text-base"
          >
            Apply to become an agent
          </button>
        </div>

        {/* Right Column */}
        <div className="flex flex-col sm:flex-row gap-8 lg:gap-[100px] flex-wrap text-white text-sm sm:text-base">
          {/* First Links */}
          <nav>
            <ul className="space-y-2">
              <li><a href="#service" className="hover:text-[#58C0D7] transition-colors">Service</a></li>
              <li><a href="#contact" className="hover:text-[#58C0D7] transition-colors">Contact Us</a></li>
              <li><a href="#faq" className="hover:text-[#58C0D7] transition-colors">FAQ</a></li>
              <li><a href="#about" className="hover:text-[#58C0D7] transition-colors">About us</a></li>
            </ul>
          </nav>

          {/* Second Links */}
          <nav className="whitespace-nowrap">
            <ul className="space-y-2">
              <li><a href="#register" className="hover:text-[#58C0D7] transition-colors">Registration</a></li>
              <li><a href="#login" className="hover:text-[#58C0D7] transition-colors">Login</a></li>
            </ul>
          </nav>

          {/* Social Icons */}
          <div className="flex gap-3 sm:gap-4 items-center">
            <button onClick={() => handleSocialClick('Facebook')} className="hover:opacity-80 transition-opacity">
              <img
                src="https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/4a67b3ba305268296f80bc7e0618bd2d83fa6f43?placeholderIfAbsent=true"
                alt="Facebook"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
              />
            </button>
            <button onClick={() => handleSocialClick('Twitter')} className="hover:opacity-80 transition-opacity">
              <img
                src="https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/96acd8101c0cf7a116e223040af9aeb6c52ba576?placeholderIfAbsent=true"
                alt="Twitter"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
              />
            </button>
            <button onClick={() => handleSocialClick('LinkedIn')} className="hover:opacity-80 transition-opacity">
              <img
                src="https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/a22d3ac1bf3f0a42b2d736169db754d4f289bb3e?placeholderIfAbsent=true"
                alt="LinkedIn"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-white border-t border-[#353E43] mt-12 pt-6 text-xs sm:text-sm gap-3 px-4 sm:px-6 lg:px-0">
        <p className="text-center md:text-left">
          © ALL right and Copyright reserved by Simorgh Service Group LLC
        </p>
        <p className="text-center md:text-left">
          <a href="#privacy" className="underline hover:text-[#58C0D7] transition-colors">Privacy</a> and{" "}
          <a href="#policy" className="underline hover:text-[#58C0D7] transition-colors">Policy</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
