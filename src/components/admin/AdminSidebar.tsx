import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => (
  <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
    <div className="p-6"><h2 className="text-lg font-semibold">Admin Panel</h2></div>
    <nav className="mt-6">
      <NavLink to="/admin" end className={({ isActive }) => `flex items-center px-6 py-3 text-sm font-medium ${isActive ? 'bg-[#58C0D7] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>Services</NavLink>
      <NavLink to="/admin/users" className={({ isActive }) => `flex items-center px-6 py-3 text-sm font-medium ${isActive ? 'bg-[#58C0D7] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>Users</NavLink>
      <NavLink to="/admin/orders" className={({ isActive }) => `flex items-center px-6 py-3 text-sm font-medium ${isActive ? 'bg-[#58C0D7] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>Orders</NavLink>
    </nav>
  </div>
);

export default AdminSidebar;