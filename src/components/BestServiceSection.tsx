import React from 'react';
import { Button } from '@/components/ui/button';

const BestServiceSection = () => {
  const services = [
    {
      title: "Office Cleaning",
      description: "Office and commercial cleaning is essential for health and productivity as clean environment improves mood and focus.",
      image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/a1234567890abcdef1234567890abcdef?placeholderIfAbsent=true"
    },
    {
      title: "Construction Cleaning",
      description: "Office and commercial cleaning is essential for health and productivity as clean environment improves mood and focus.",
      image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/b1234567890abcdef1234567890abcdef?placeholderIfAbsent=true"
    },
    {
      title: "Deep Cleaning",
      description: "Office and commercial cleaning is essential for health and productivity as clean environment improves mood and focus.",
      image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/c1234567890abcdef1234567890abcdef?placeholderIfAbsent=true"
    }
  ];

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          We Always Provide The Best Service
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          We focus on providing professional excellent, and fast thorough cleaning services to meet your expectations and help you maintain a clean, healthy, and organized environment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <img 
                src={service.image} 
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {service.description}
              </p>
              <Button 
                variant="outline" 
                className="w-full border-[#58C0D7] text-[#58C0D7] hover:bg-[#58C0D7] hover:text-white"
              >
                Read More
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BestServiceSection;