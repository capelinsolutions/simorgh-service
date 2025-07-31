import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CompanySection = () => {
  const features = [
    "Expert Professional",
    "Premium Efficiency",
    "Trusted Company",
    "Best Price",
    "Award Winning",
    "Premium Quality"
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="bg-[#58C0D7] rounded-2xl p-8 relative overflow-hidden">
              <img 
                src="https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/company-team?placeholderIfAbsent=true"
                alt="Simorgh+ Company Team"
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Welcome To Our Simorgh+ Company!
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              We take pride in being one of the leading cleaning service providers, offering exceptional quality and reliability. Our commitment to excellence has earned us the trust of countless satisfied customers.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#58C0D7] rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="flex gap-4">
              <Button 
                className="bg-[#58C0D7] hover:bg-[#4aa8c0] text-white px-6 py-3"
              >
                Book Now
              </Button>
              <Button 
                variant="outline"
                className="border-[#58C0D7] text-[#58C0D7] hover:bg-[#58C0D7] hover:text-white px-6 py-3"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanySection;