import React from 'react';
import { services } from '@/data/services';

const ServiceBooking = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Book a Service</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.slice(0, 9).map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <img src={service.image} alt={service.title} className="w-full h-32 object-cover rounded-lg mb-4" />
            <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-bold text-[#58C0D7]">${service.membershipPrice}/h</span>
              <span className="text-sm text-gray-500 line-through">${service.regularPrice}/h</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">{service.description}</p>
            <button className="w-full bg-[#58C0D7] text-white py-2 px-4 rounded-lg hover:bg-[#4aa8c0] transition-colors">
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceBooking;