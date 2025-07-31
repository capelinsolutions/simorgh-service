import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      name: "BASIC PACKAGE",
      price: "29.00",
      period: "/monthly",
      features: [
        "House cleaning service",
        "Bathroom cleaning",
        "2+ bathroom clean extra",
        "Oven cleaning",
        "Ironing service",
        "Dishes clean and tidy up",
        "Cleaning of kitchen",
        "Cleaning of kitchen"
      ]
    },
    {
      name: "WELCOME PACKAGE", 
      price: "69.00",
      period: "/monthly",
      features: [
        "All from Basic Package",
        "Discount 10% off service",
        "Upholstery cleaning",
        "24/7 customer support",
        "Priority booking",
        "Deep cleaning service",
        "Window cleaning",
        "Carpet cleaning"
      ],
      popular: true
    },
    {
      name: "PREMIUM PACKAGE",
      price: "89.00", 
      period: "/monthly",
      features: [
        "All from Welcome Package",
        "Discount 20% off service",
        "Unlimited house visits",
        "Emergency cleaning service",
        "Same day service",
        "Professional equipment",
        "Eco-friendly products",
        "Quality guarantee"
      ]
    }
  ];

  return (
    <section className="py-16 px-4 bg-[#58C0D7]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose From Our Lowest Plans and Prices
          </h2>
          <div className="flex justify-center gap-4 mt-8">
            <button className="bg-white text-[#58C0D7] px-6 py-2 rounded-full font-medium">
              Monthly
            </button>
            <button className="bg-transparent border border-white text-white px-6 py-2 rounded-full font-medium hover:bg-white hover:text-[#58C0D7] transition-colors">
              Yearly
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-2xl p-8 ${plan.popular ? 'ring-4 ring-yellow-400 relative' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-4xl font-bold text-[#58C0D7]">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600">
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#58C0D7] flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full py-3 ${
                  plan.popular 
                    ? 'bg-[#58C0D7] hover:bg-[#4aa8c0] text-white' 
                    : 'bg-gray-100 hover:bg-[#58C0D7] hover:text-white text-gray-700'
                }`}
              >
                Get Plan
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;