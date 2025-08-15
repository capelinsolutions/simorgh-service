import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import CustomerSidebar from '@/components/customer/CustomerSidebar';
import CustomerProfile from '@/components/customer/CustomerProfile';
import MyBookings from '@/components/customer/MyBookings';
import ServiceBooking from '@/components/customer/ServiceBooking';
import CustomerNotifications from '@/components/customer/CustomerNotifications';
import Membership from '@/components/customer/Membership';
import CustomerTestimonials from '@/components/customer/CustomerTestimonials';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Star, CreditCard, Bell, User, Home, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const CustomerDashboard = () => {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    upcomingBookings: 0,
    totalSpent: 0
  });

  useEffect(() => {
    if (user) {
      fetchCustomerStats();
    }
  }, [user]);

  const fetchCustomerStats = async () => {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;

      const completed = orders?.filter(order => order.status === 'completed') || [];
      const upcoming = orders?.filter(order => order.status === 'pending' || order.status === 'confirmed') || [];
      const totalSpent = orders?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0;

      setStats({
        totalBookings: orders?.length || 0,
        completedBookings: completed.length,
        upcomingBookings: upcoming.length,
        totalSpent: totalSpent / 100 // Convert from cents
      });
    } catch (error) {
      console.error('Error fetching customer stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#58C0D7] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Header />
      <div className="flex flex-col lg:flex-row">
        <CustomerSidebar />
        <main className="flex-1 p-4 lg:p-6">
          <Routes>
            <Route index element={<CustomerDashboardHome stats={stats} />} />
            <Route path="profile" element={<CustomerProfile />} />
            <Route path="bookings" element={<MyBookings />} />
            <Route path="book-service" element={<ServiceBooking />} />
            <Route path="notifications" element={<CustomerNotifications />} />
            <Route path="membership" element={<Membership />} />
            <Route path="testimonials" element={<CustomerTestimonials />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

interface CustomerDashboardHomeProps {
  stats: {
    totalBookings: number;
    completedBookings: number;
    upcomingBookings: number;
    totalSpent: number;
  };
}

const CustomerDashboardHome: React.FC<CustomerDashboardHomeProps> = ({ stats }) => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              🏠 Customer Portal
            </h1>
            <p className="text-emerald-100 text-lg">
              Welcome back, {user?.email?.split('@')[0]}! Your personal cleaning service hub.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">⭐ VIP</div>
              <div className="text-sm text-emerald-100">Member Status</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">All time bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedBookings}</div>
            <p className="text-xs text-muted-foreground">Services completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingBookings}</div>
            <p className="text-xs text-muted-foreground">Scheduled services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Lifetime spending</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#58C0D7]" />
              Book New Service
            </CardTitle>
            <CardDescription>
              Schedule a new cleaning service for your home or office
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-[#58C0D7] hover:bg-[#4aa8c0]" onClick={() => window.location.href = '/customer/book-service'}>
              Book Now
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              My Bookings
            </CardTitle>
            <CardDescription>
              View and manage your current and past bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/customer/bookings'}>
              View Bookings
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-purple-600" />
              Profile Settings
            </CardTitle>
            <CardDescription>
              Update your personal information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/customer/profile'}>
              Edit Profile
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest bookings and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No recent activity to display</p>
            <Button variant="outline" onClick={() => window.location.href = '/customer/book-service'}>
              Book Your First Service
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDashboard;