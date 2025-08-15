import React from 'react';
import { Link } from 'react-router-dom';
import simorghLogo from '/lovable-uploads/32449588-adb2-4190-98ac-fccbb7dc6557.png';
import socialIconsImg from '../assets/social-icons.jpg';

const Footer = () => {
  const handleApplyClick = () => {
    console.log('Apply to become an agent clicked');
  };

  const handleSocialClick = (platform: string) => {
    console.log(`${platform} clicked`);
  };

  return (
    <footer className="bg-black w-full px-[120px] py-20 max-md:max-w-full max-md:px-5">
      <div className="flex w-full gap-[40px_100px] justify-between flex-wrap max-md:max-w-full">
        <div className="flex min-w-60 flex-col items-stretch text-base text-white w-[327px]">
          <div className="flex max-w-full w-[327px] flex-col items-stretch font-normal justify-center">
            <img
              src={simorghLogo}
              alt="Simorgh Service Group Logo"
              className="aspect-[2.16] object-contain w-[104px] max-w-full"
            />
            <p className="text-white mt-2">
              Become your own boss, choose your own schedule, and work in your preferred areas.
            </p>
          </div>
          
          <button 
            onClick={handleApplyClick}
            className="justify-center items-center flex min-h-10 gap-2 font-semibold bg-[#58C0D7] mt-6 px-6 py-[9px] rounded-lg max-md:px-5 hover:bg-[#4aa8c0] transition-colors"
          >
            Apply to become an agent
          </button>
        </div>
        
        <div className="flex min-w-60 gap-[40px_100px] justify-between flex-wrap w-[503px] max-md:max-w-full">
          <nav className="text-base text-white font-normal">
            <ul className="space-y-2">
              <li><a href="#service" className="text-white hover:text-[#58C0D7] transition-colors">Service</a></li>
              <li><a href="#contact" className="text-white hover:text-[#58C0D7] transition-colors">Contact Us</a></li>
              <li><a href="#faq" className="text-white hover:text-[#58C0D7] transition-colors">FAQ</a></li>
              <li><a href="#about" className="text-white hover:text-[#58C0D7] transition-colors">About us</a></li>
            </ul>
          </nav>
          
          <nav className="text-base text-white font-normal whitespace-nowrap">
            <ul className="space-y-2">
              <li><a href="#register" className="text-white hover:text-[#58C0D7] transition-colors">Registration</a></li>
              <li><a href="#login" className="text-white hover:text-[#58C0D7] transition-colors">Login</a></li>
            </ul>
          </nav>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleSocialClick('Facebook')}
              className="hover:opacity-80 transition-opacity"
              aria-label="Facebook"
            >
              <img
                src={socialIconsImg}
                alt="Facebook"
                className="aspect-[1] object-contain w-9 self-stretch shrink-0 my-auto"
              />
            </button>
            <button 
              onClick={() => handleSocialClick('Twitter')}
              className="hover:opacity-80 transition-opacity"
              aria-label="Twitter"
            >
              <img
                src={socialIconsImg}
                alt="Twitter"
                className="aspect-[1] object-contain w-9 self-stretch shrink-0 my-auto"
              />
            </button>
            <button 
              onClick={() => handleSocialClick('LinkedIn')}
              className="hover:opacity-80 transition-opacity"
              aria-label="LinkedIn"
            >
              <img
                src={socialIconsImg}
                alt="LinkedIn"
                className="aspect-[1] object-contain w-9 self-stretch shrink-0 my-auto"
              />
            </button>
          </div>
        </div>
      </div>
      
      <div className="justify-between items-center flex w-full gap-[40px_100px] text-base text-white font-normal flex-wrap mt-12 pt-6 border-t-[#353E43] border-t border-solid max-md:max-w-full max-md:mt-10">
        <p className="text-white self-stretch my-auto max-md:max-w-full">
          ©ALL right and Copyright reserved by Simorgh Service Group LLC
        </p>
        <p className="text-white self-stretch my-auto">
          <a href="#privacy" className="underline hover:text-[#58C0D7] transition-colors">Privacy</a> and{" "}
          <a href="#policy" className="underline hover:text-[#58C0D7] transition-colors">policy</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
