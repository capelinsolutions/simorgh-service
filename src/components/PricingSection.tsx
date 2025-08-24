import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import pricingBg from '../../public/lovable-uploads/pricing.png';

const monthlyPlans = [
  {
    name: 'Basic Package',
    price: '59.00',
    period: '/Monthly',
    features: [
      'Dusting of all surfaces',
      'Sweeping and mopping floors',
      'Vacuuming carpets and rugs',
      'Cleaning of kitchen surfaces',
      'Cleaning of bathroom surfaces',
      'Emptying trash bins',
    ],
    buttonStyle:
      'border border-black text-black hover:bg-[#58C0D7] hover:border-none hover:text-white',
    priceBg: 'bg-[#58C0D7] text-white',
  },
  {
    name: 'Enterprise Package',
    price: '69.00',
    period: '/Monthly',
    features: [
      'All services in the Basic Plan',
      'Detailed dusting',
      'Wiping down of kitchen appt',
      'Cleaning inside the microwave',
      'Changing bed linens',
      'Spot cleaning walls and doors',
    ],
    buttonStyle:
      'border border-black text-black hover:bg-[#58C0D7] hover:border-none hover:text-white',
    priceBg: 'bg-[#58C0D7] text-white',
  },
  {
    name: 'Premium Package',
    price: '99.00',
    period: '/Monthly',
    features: [
      'All services in the Clean Plan',
      'Deep cleaning of kitchen appt',
      'baseboards, door frames, & vents',
      'Organization of closets pantries',
      'Carpet, upholstery spot cleaning',
      'Detailed bathroom cleaning',
    ],
    buttonStyle:
      'border border-black text-black hover:bg-[#58C0D7] hover:border-none hover:text-white',
    priceBg: 'bg-[#58C0D7] text-white',
  },
];

const yearlyPlans = [
  {
    name: 'Basic Package',
    price: '699.00',
    period: '/Yearly',
    features: [
      'Dusting of all surfaces',
      'Sweeping and mopping floors',
      'Vacuuming carpets and rugs',
      'Cleaning of kitchen surfaces',
      'Cleaning of bathroom surfaces',
      'Emptying trash bins',
      '2 months free cleaning',
    ],
    buttonStyle:
      'border border-black text-black hover:bg-[#58C0D7] hover:border-none hover:text-white',
    priceBg: 'bg-[#58C0D7] text-white',
  },
  {
    name: 'Enterprise Package',
    price: '799.00',
    period: '/Yearly',
    features: [
      'All services in the Basic Plan',
      'Detailed dusting',
      'Wiping down of kitchen appt',
      'Cleaning inside the microwave',
      'Changing bed linens',
      'Spot cleaning walls and doors',
      '3 months free cleaning',
    ],
    buttonStyle:
      'border border-black text-black hover:bg-[#58C0D7] hover:border-none hover:text-white',
    priceBg: 'bg-[#58C0D7] text-white',
  },
  {
    name: 'Premium Package',
    price: '999.00',
    period: '/Yearly',
    features: [
      'All services in the Clean Plan',
      'Deep cleaning of kitchen appt',
      'baseboards, door frames, & vents',
      'Organization of closets pantries',
      'Carpet, upholstery spot cleaning',
      'Detailed bathroom cleaning',
      '4 months free cleaning',
    ],
    buttonStyle:
      'border border-black text-black hover:bg-[#58C0D7] hover:border-none hover:text-white',
    priceBg: 'bg-[#58C0D7] text-white',
  },
];

const PricingSection = () => {
  const [activePlan, setActivePlan] = useState<'monthly' | 'yearly'>('monthly');
  const navigate = useNavigate();
  const plans = activePlan === 'monthly' ? monthlyPlans : yearlyPlans;

  const handleBookNow = (planName: string) => {
    navigate('/membership');
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        backgroundImage: `url(${pricingBg})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top center',
        backgroundSize: 'cover',
        minHeight: '600px'
      }}
    >
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Header */}
      <div className="relative z-10 h-full w-full flex items-center justify-center pt-12 sm:pt-16 lg:pt-20 text-center text-white px-4">
        <div>
          <h4 className="text-xs sm:text-sm uppercase mb-2 font-semibold">Our Pricing</h4>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
            Choose From Our Lowest <br className="hidden sm:block" />
            Plans and Prices
          </h2>

          {/* Toggle Buttons */}
          <div className="inline-flex mb-4 sm:mb-6 rounded-full bg-white p-1">
            <button
              onClick={() => setActivePlan('monthly')}
              className={`px-4 sm:px-6 py-2 rounded-full font-medium text-sm sm:text-base transition-all ${
                activePlan === 'monthly'
                  ? 'bg-[#58C0D7] text-white'
                  : 'bg-white text-[#58C0D7]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setActivePlan('yearly')}
              className={`px-4 sm:px-6 py-2 rounded-full font-medium text-sm sm:text-base transition-all ${
                activePlan === 'yearly'
                  ? 'bg-[#58C0D7] text-white'
                  : 'bg-white text-[#58C0D7]'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="relative z-10 py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 lg:-mt-16 rounded-t-3xl">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 text-gray-800">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl lg:rounded-3xl shadow-md p-4 sm:p-6 lg:p-8 flex flex-col justify-between h-full"
            >
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-center uppercase">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className={`text-center mb-6 sm:mb-8 py-2 rounded ${plan.priceBg}`}>
                  <span className="text-lg sm:text-xl font-semibold">${plan.price}</span>
                  <span className="text-xs sm:text-sm ml-1">{plan.period}</span>
                </div>

                <ul className="text-xs sm:text-sm text-gray-700 space-y-2 sm:space-y-3 text-left leading-relaxed">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-[#58C0D7] mr-2 flex-shrink-0">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 sm:mt-8 lg:mt-10">
                <button
                  onClick={() => handleBookNow(plan.name)}
                  className={`w-full py-2.5 sm:py-3 rounded-md font-medium transition-all text-sm sm:text-base ${plan.buttonStyle}`}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
