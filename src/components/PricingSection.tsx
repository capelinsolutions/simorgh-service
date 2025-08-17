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
      className="relative w-full overflow-hidden bg-no-repeat bg-contain"
      style={{
        backgroundImage: `url(${pricingBg})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top',
        backgroundSize: '100% 900px',
      }}
    >
      {/* Header */}
      <div className="h-full w-full flex items-center justify-center pt-20 text-center text-white px-4">
        <div>
          <h4 className="text-sm uppercase mb-2 font-semibold">Our Pricing</h4>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Choose From Our Lowest <br className="hidden md:block" />
            Plans and Prices
          </h2>

          {/* Toggle Buttons */}
          <div className="inline-flex mb-6 rounded-full bg-white p-1">
            <button
              onClick={() => setActivePlan('monthly')}
              className={`px-6 py-2 rounded-full font-medium ${
                activePlan === 'monthly'
                  ? 'bg-[#58C0D7] text-white'
                  : 'bg-white text-[#58C0D7]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setActivePlan('yearly')}
              className={`px-6 py-2 rounded-full font-medium ${
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
      <div className="py-16 px-4 -mt-16 z-10 relative rounded-t-3xl">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 text-gray-800">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-md p-6 md:p-8 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold mb-6 text-center uppercase">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className={`text-center mb-8 py-2 rounded ${plan.priceBg}`}>
                  <span className="text-xl font-semibold">${plan.price}</span>
                  <span className="text-sm ml-1">{plan.period}</span>
                </div>

                <ul className="text-sm text-gray-700 space-y-3 text-left leading-[300%] font-['Be_Vietnam_Pro'] font-[400]">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>• {feature}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <button
                  onClick={() => handleBookNow(plan.name)}
                  className={`w-full py-3 rounded-md font-medium transition-all ${plan.buttonStyle}`}
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
