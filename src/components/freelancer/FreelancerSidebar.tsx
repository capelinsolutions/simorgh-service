import React from 'react';
import { NavLink } from 'react-router-dom';

const FreelancerSidebar = () => (
  <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
    <div className="p-6"><h2 className="text-lg font-semibold">Freelancer Portal</h2></div>
    <nav className="mt-6">
      <NavLink to="/freelancer" end className={({ isActive }) => `flex items-center px-6 py-3 text-sm font-medium ${isActive ? 'bg-[#58C0D7] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>Active Jobs</NavLink>
      <NavLink to="/freelancer/history" className={({ isActive }) => `flex items-center px-6 py-3 text-sm font-medium ${isActive ? 'bg-[#58C0D7] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>Job History</NavLink>
      <NavLink to="/freelancer/profile" className={({ isActive }) => `flex items-center px-6 py-3 text-sm font-medium ${isActive ? 'bg-[#58C0D7] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>Profile</NavLink>
    </nav>
  </div>
);

export default FreelancerSidebar;