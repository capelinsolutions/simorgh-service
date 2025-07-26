import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import ServiceManager from '@/components/admin/ServiceManager';
import UserManager from '@/components/admin/UserManager';
import OrderManager from '@/components/admin/OrderManager';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminDashboardComponent from '@/components/admin/AdminDashboard';
import CleanerApproval from '@/components/admin/CleanerApproval';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-col lg:flex-row">
        <AdminSidebar />
        <main className="flex-1 p-4 lg:p-6">
          <Routes>
            <Route index element={<AdminDashboardComponent />} />
            <Route path="services" element={<ServiceManager />} />
            <Route path="users" element={<UserManager />} />
            <Route path="orders" element={<OrderManager />} />
            <Route path="cleaners" element={<CleanerApproval />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;