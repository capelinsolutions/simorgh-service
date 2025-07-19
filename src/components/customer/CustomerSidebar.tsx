import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, User, CreditCard } from 'lucide-react';

const CustomerSidebar = () => {
  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">Customer Portal</h2>
      </div>
      <nav className="mt-6">
        <NavLink
          to="/customer"
          end
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-sm font-medium ${
              isActive ? 'bg-[#58C0D7] text-white' : 'text-gray-600 hover:bg-gray-50'
            }`
          }
        >
          <Calendar className="mr-3 h-5 w-5" />
          Book Service
        </NavLink>
        <NavLink
          to="/customer/bookings"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-sm font-medium ${
              isActive ? 'bg-[#58C0D7] text-white' : 'text-gray-600 hover:bg-gray-50'
            }`
          }
        >
          <User className="mr-3 h-5 w-5" />
          My Bookings
        </NavLink>
        <NavLink
          to="/customer/membership"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-sm font-medium ${
              isActive ? 'bg-[#58C0D7] text-white' : 'text-gray-600 hover:bg-gray-50'
            }`
          }
        >
          <CreditCard className="mr-3 h-5 w-5" />
          Membership
        </NavLink>
      </nav>
    </div>
  );
};

export default CustomerSidebar;