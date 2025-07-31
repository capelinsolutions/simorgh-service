import React from 'react';
import { Button } from '@/components/ui/button';

const QualitySection = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              High-Quality and Friendly Services at Fair Prices
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              We provide comprehensive cleaning services for both commercial and residential properties. Our experienced team uses eco-friendly products and modern equipment to ensure the best results every time. Trust us to keep your space clean, healthy, and welcoming.
            </p>
            <Button 
              className="bg-[#58C0D7] hover:bg-[#4aa8c0] text-white px-8 py-3 text-lg"
            >
              Get Quote
            </Button>
          </div>
          <div className="relative">
            <div className="bg-[#58C0D7] rounded-2xl p-8 relative overflow-hidden">
              <img 
                src="https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/quality-cleaning-service?placeholderIfAbsent=true"
                alt="Professional cleaning service"
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QualitySection;