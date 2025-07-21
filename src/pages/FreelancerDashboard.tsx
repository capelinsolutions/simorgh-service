import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ActiveJobs from '@/components/freelancer/ActiveJobs';
import JobHistory from '@/components/freelancer/JobHistory';
import FreelancerProfile from '@/components/freelancer/FreelancerProfile';
import FreelancerSidebar from '@/components/freelancer/FreelancerSidebar';
import CleanerNotifications from '@/components/freelancer/CleanerNotifications';

const FreelancerDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <FreelancerSidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route index element={<ActiveJobs />} />
            <Route path="history" element={<JobHistory />} />
            <Route path="profile" element={<FreelancerProfile />} />
            <Route path="notifications" element={<CleanerNotifications />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default FreelancerDashboard;