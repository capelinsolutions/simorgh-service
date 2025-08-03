import React from 'react';
import { Button } from '@/components/ui/button';

const QualitySection = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm text-gray-500 mb-4 font-medium">
              Affordable cleaning solutions
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              High-Quality and Friendly Services at Fair Prices
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              We provide comprehensive cleaning services tailored to your needs. From eco-residential cleaning services
            </p>
            <Button 
              className="bg-[#58C0D7] hover:bg-[#4aa8c0] text-white px-6 py-3 rounded-lg font-medium"
            >
              Get a quote
            </Button>
          </div>
          <div className="relative">
            <div className="relative">
              {/* Background decorative element */}
              <div className="absolute top-4 right-4 w-64 h-48 bg-[#58C0D7] rounded-2xl opacity-20"></div>
              
              {/* Main image container */}
              <div className="relative bg-white rounded-2xl p-4 shadow-lg">
                <img 
                  src="/lovable-uploads/e2664ec8-0e6e-4d41-b080-0120dc3d9a91.png"
                  alt="Professional cleaning team"
                  className="w-full h-64 object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QualitySection;