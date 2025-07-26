import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Users, ShoppingCart } from 'lucide-react';

const AdminSidebar = () => {
  const navItems = [
    { to: '/admin', icon: BarChart3, label: 'Dashboard', end: true },
    { to: '/admin/services', icon: ShoppingCart, label: 'Services' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-gray-200 lg:min-h-screen">
      <div className="p-4 lg:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              <span className="hidden lg:block">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;