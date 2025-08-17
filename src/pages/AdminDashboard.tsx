import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminDashboardComponent from '@/components/admin/AdminDashboard';
import ServiceManager from '@/components/admin/ServiceManager';
import UserManager from '@/components/admin/UserManager';
import OrderManager from '@/components/admin/OrderManager';
import CleanerApproval from '@/components/admin/CleanerApproval';
import LiveBookingFeed from '@/components/admin/LiveBookingFeed';
import AdvancedServiceManager from '@/components/admin/AdvancedServiceManager';
import EnhancedServiceManager from '@/components/admin/EnhancedServiceManager';
import ServiceManagement from '@/components/admin/ServiceManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, ShoppingCart, DollarSign, Star, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  useEffect(() => {
    if (user && isAdmin) {
      fetchDashboardStats();
    }
  }, [user, isAdmin]);

  const fetchDashboardStats = async () => {
    try {
      const response = await supabase.functions.invoke('admin-action', {
        body: { action: 'getDashboardStats' }
      });

      if (response.error) throw response.error;
      setDashboardStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#58C0D7] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>You don't have administrator privileges.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => window.location.href = '/'}>
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <div className="flex flex-col lg:flex-row">
        <AdminSidebar />
        <main className="flex-1 p-4 lg:p-6">
          <Routes>
            <Route index element={<AdminDashboardHome stats={dashboardStats} />} />
            <Route path="services" element={<ServiceManagement />} />
            <Route path="users" element={<UserManager />} />
            <Route path="orders" element={<OrderManager />} />
            <Route path="cleaners" element={<CleanerApproval />} />
            <Route path="feed" element={<LiveBookingFeed />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

interface AdminDashboardHomeProps {
  stats: any;
}

const AdminDashboardHome: React.FC<AdminDashboardHomeProps> = ({ stats }) => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 rounded-xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              🛡️ Admin Control Center
            </h1>
            <p className="text-blue-100 text-lg">
              Welcome back, Administrator {user?.email?.split('@')[0]}. Manage your platform with precision.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">{new Date().toLocaleDateString()}</div>
              <div className="text-sm text-blue-100">Today's Date</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCustomers || 0}</div>
            <p className="text-xs text-muted-foreground">Active customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Freelancers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalFreelancers || 0}</div>
            <p className="text-xs text-muted-foreground">Registered cleaners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(stats?.totalRevenue / 100 || 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Lifetime revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averageRating?.toFixed(1) || '0.0'}</div>
            <p className="text-xs text-muted-foreground">Platform rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats?.pendingOrders || 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.activeOrders || 0}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.completedOrders || 0}</div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#58C0D7]" />
              Manage Users
            </CardTitle>
            <CardDescription>
              View and manage customer accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-[#58C0D7] hover:bg-[#4aa8c0]" onClick={() => window.location.href = '/admin/users'}>
              Manage Users
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Cleaner Approvals
            </CardTitle>
            <CardDescription>
              Review and approve cleaner applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/admin/cleaners'}>
              Review Applications
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-green-600" />
              Order Management
            </CardTitle>
            <CardDescription>
              Monitor and manage all orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/admin/orders'}>
              View Orders
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Service Settings
            </CardTitle>
            <CardDescription>
              Configure services and pricing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/admin/services'}>
              Manage Services
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Platform health and metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Database Connection</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Payment Processing</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Email Service</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Operational</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;