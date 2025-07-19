import React from 'react';

const Membership = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Membership Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold mb-4">Basic Membership</h3>
          <p className="text-3xl font-bold text-[#58C0D7] mb-4">$29/month</p>
          <p className="text-gray-600 mb-4">Save up to 50% on all services</p>
          <button className="w-full bg-[#58C0D7] text-white py-2 px-4 rounded-lg hover:bg-[#4aa8c0] transition-colors">
            Subscribe
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold mb-4">Premium Membership</h3>
          <p className="text-3xl font-bold text-[#58C0D7] mb-4">$49/month</p>
          <p className="text-gray-600 mb-4">Save up to 50% + Priority booking</p>
          <button className="w-full bg-[#58C0D7] text-white py-2 px-4 rounded-lg hover:bg-[#4aa8c0] transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default Membership;