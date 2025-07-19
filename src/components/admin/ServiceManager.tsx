import React from 'react';
import { services } from '@/data/services';

const ServiceManager = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 mb-6">Service Management</h1>
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold mb-4">All Services ({services.length})</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Service</th>
              <th className="text-left py-2">Regular Price</th>
              <th className="text-left py-2">Member Price</th>
              <th className="text-left py-2">Category</th>
            </tr>
          </thead>
          <tbody>
            {services.slice(0, 10).map((service) => (
              <tr key={service.id} className="border-b">
                <td className="py-2">{service.title}</td>
                <td className="py-2">${service.regularPrice}/h</td>
                <td className="py-2">${service.membershipPrice}/h</td>
                <td className="py-2">{service.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default ServiceManager;