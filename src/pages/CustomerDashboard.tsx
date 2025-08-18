
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import CustomerSidebar from '@/components/customer/CustomerSidebar';
import MyBookings from '@/components/customer/MyBookings';
import CustomerProfile from '@/components/customer/CustomerProfile';
import Membership from '@/components/customer/Membership';
import ServiceBooking from '@/components/customer/ServiceBooking';
import CustomerNotifications from '@/components/customer/CustomerNotifications';

const CustomerDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <CustomerSidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<MyBookings />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/book-service" element={<ServiceBooking />} />
            <Route path="/profile" element={<CustomerProfile />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/notifications" element={<CustomerNotifications />} />
          </Routes>
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default CustomerDashboard;
