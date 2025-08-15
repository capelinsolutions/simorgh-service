import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import FreelancerSidebar from '@/components/freelancer/FreelancerSidebar';
import ActiveJobs from '@/components/freelancer/ActiveJobs';
import JobHistory from '@/components/freelancer/JobHistory';
import FreelancerProfile from '@/components/freelancer/FreelancerProfile';
import CleanerNotifications from '@/components/freelancer/CleanerNotifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Star, DollarSign, Clock, TrendingUp, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const FreelancerDashboard = () => {
  const { user, loading } = useAuth();
  const [freelancerData, setFreelancerData] = useState<any>(null);
  const [stats, setStats] = useState({
    activeJobs: 0,
    completedJobs: 0,
    totalEarnings: 0,
    rating: 0,
    pendingOffers: 0
  });

  useEffect(() => {
    if (user) {
      fetchFreelancerData();
      fetchFreelancerStats();
    }
  }, [user]);

  const fetchFreelancerData = async () => {
    try {
      const { data, error } = await supabase
        .from('freelancers')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setFreelancerData(data);
    } catch (error) {
      console.error('Error fetching freelancer data:', error);
    }
  };

  const fetchFreelancerStats = async () => {
    try {
      // Fetch assignments
      const { data: assignments, error: assignmentsError } = await supabase
        .from('order_assignments')
        .select('*, orders(*)')
        .eq('freelancer_id', user?.id);

      if (assignmentsError) throw assignmentsError;

      // Fetch earnings
      const { data: earnings, error: earningsError } = await supabase
        .from('cleaner_earnings')
        .select('*')
        .eq('cleaner_id', user?.id);

      if (earningsError) throw earningsError;

      const activeJobs = assignments?.filter(a => a.status === 'accepted').length || 0;
      const pendingOffers = assignments?.filter(a => a.status === 'offered').length || 0;
      const totalEarnings = earnings?.reduce((sum, earning) => sum + (earning.amount || 0), 0) || 0;

      setStats({
        activeJobs,
        completedJobs: freelancerData?.total_jobs || 0,
        totalEarnings: totalEarnings / 100, // Convert from cents
        rating: freelancerData?.rating || 0,
        pendingOffers
      });
    } catch (error) {
      console.error('Error fetching freelancer stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#58C0D7] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your freelancer dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user is a freelancer
  if (!freelancerData && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have freelancer access. Please apply to become a cleaner.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => window.location.href = '/freelancer-signup'}>
              Apply as Cleaner
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <Header />
      <div className="flex flex-col lg:flex-row">
        <FreelancerSidebar />
        <main className="flex-1 p-4 lg:p-6">
          <Routes>
            <Route index element={<FreelancerDashboardHome stats={stats} freelancerData={freelancerData} />} />
            <Route path="jobs" element={<ActiveJobs />} />
            <Route path="history" element={<JobHistory />} />
            <Route path="profile" element={<FreelancerProfile />} />
            <Route path="notifications" element={<CleanerNotifications />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

interface FreelancerDashboardHomeProps {
  stats: {
    activeJobs: number;
    completedJobs: number;
    totalEarnings: number;
    rating: number;
    pendingOffers: number;
  };
  freelancerData: any;
}

const FreelancerDashboardHome: React.FC<FreelancerDashboardHomeProps> = ({ stats, freelancerData }) => {
  const { user } = useAuth();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              🧽 Cleaner Hub
            </h1>
            <p className="text-orange-100 text-lg mb-2">
              Welcome back, {freelancerData?.business_name || user?.email?.split('@')[0]}! Your professional command center.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm">Status:</span>
              {getStatusBadge(freelancerData?.verification_status)}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{stats.rating.toFixed(1)} ⭐</div>
              <div className="text-sm text-orange-100">Your Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeJobs}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Offers</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingOffers}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedJobs}</div>
            <p className="text-xs text-muted-foreground">Total completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hourly Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${freelancerData?.hourly_rate || 0}</div>
            <p className="text-xs text-muted-foreground">Per hour</p>
          </CardContent>
        </Card>
      </div>

      {/* Service Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Service Areas
          </CardTitle>
          <CardDescription>Areas where you provide cleaning services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {freelancerData?.service_areas?.map((area: string, index: number) => (
              <Badge key={index} variant="outline">
                {area}
              </Badge>
            )) || <p className="text-gray-500">No service areas specified</p>}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#58C0D7]" />
              View Active Jobs
            </CardTitle>
            <CardDescription>
              Check your current assignments and schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-[#58C0D7] hover:bg-[#4aa8c0]" onClick={() => window.location.href = '/freelancer/jobs'}>
              View Jobs
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-green-600" />
              Job History
            </CardTitle>
            <CardDescription>
              Review your completed jobs and earnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/freelancer/history'}>
              View History
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Update Profile
            </CardTitle>
            <CardDescription>
              Manage your business information and rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/freelancer/profile'}>
              Edit Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreelancerDashboard;