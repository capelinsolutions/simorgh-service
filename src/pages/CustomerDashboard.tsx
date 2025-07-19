import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceBooking from '@/components/customer/ServiceBooking';
import MyBookings from '@/components/customer/MyBookings';
import Membership from '@/components/customer/Membership';
import CustomerSidebar from '@/components/customer/CustomerSidebar';

const CustomerDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <CustomerSidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route index element={<ServiceBooking />} />
            <Route path="bookings" element={<MyBookings />} />
            <Route path="membership" element={<Membership />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerDashboard;