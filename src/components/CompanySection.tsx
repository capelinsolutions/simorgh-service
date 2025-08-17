import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CompanySection = () => {
  return (
    <section className="py-16 px-5 sm:px-8 lg:px-0 bg-white">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
        
        {/* Image Section */}
        <div className="flex justify-center lg:justify-start">
            <img
              src="/lovable-uploads/company.png"
              alt="Simoragh Company Team"
              className="w-full h-full object-cover rounded-xl"
            />
        </div>

        {/* Text Content */}
        <div className="text-center lg:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-snug">
            Welcome To Our <br />
            <span className="text-black">Simoragh- Company!</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-lg mx-auto lg:mx-0">
            We make your space shine! Professional and reliable cleaning service company
            providing top-notch solutions for homes and businesses. Satisfaction guaranteed!
          </p>

          {/* Features */}
          <div className="rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {[
              'Vetted professionals',
              'Next day availability',
              'Standard cleaning tasks',
              'Affordable Prices',
              'Best Quality',
              'Affordable Prices',
            ].map((item, idx) => (
              <div key={idx} className="flex rounded-lg bg-[#F5F4F4] px-3 py-3 sm:px-4 sm:py-4 items-center gap-2">
                <CheckCircle className="text-[#58C0D7] w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-gray-700 text-xs sm:text-sm">{item}</span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4">
            <Button className="bg-[#58C0D7] hover:bg-[#4aa8c0] text-white px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base">
              Book Now
            </Button>
            <Button
              variant="outline"
              className="border border-gray-400 text-gray-800 hover:bg-gray-100 px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base"
            >
              Know More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanySection;
