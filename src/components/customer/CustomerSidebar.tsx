
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, User, CreditCard, Bell, Plus } from 'lucide-react';

const CustomerSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/customer', label: 'My Bookings', icon: Calendar },
    { path: '/customer/book-service', label: 'Book a Service', icon: Plus },
    { path: '/customer/profile', label: 'Profile', icon: User },
    { path: '/customer/membership', label: 'Membership', icon: CreditCard },
    { path: '/customer/notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="w-64 min-h-screen bg-muted/30 border-r">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">Customer Portal</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path === '/customer' && location.pathname === '/customer/bookings');
            
            return (
              <Button
                key={item.path}
                asChild
                variant={isActive ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <Link to={item.path}>
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default CustomerSidebar;
