import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, Calendar, TrendingUp, Star, UserCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalCustomers: number;
  totalFreelancers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  activeSubscriptions: number;
  averageRating: number;
  completedOrders: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalFreelancers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    activeSubscriptions: 0,
    averageRating: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-action', {
        body: { action: 'getDashboardStats' }
      });

      if (error) throw error;

      if (data) {
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      description: 'Registered customers',
      color: 'text-blue-600'
    },
    {
      title: 'Total Freelancers',
      value: stats.totalFreelancers,
      icon: UserCheck,
      description: 'Active freelancers',
      color: 'text-green-600'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: Calendar,
      description: 'All time orders',
      color: 'text-purple-600'
    },
    {
      title: 'Total Revenue',
      value: `$${(stats.totalRevenue / 100).toFixed(2)}`,
      icon: DollarSign,
      description: 'Gross revenue',
      color: 'text-green-600'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Calendar,
      description: 'Awaiting assignment',
      color: 'text-orange-600'
    },
    {
      title: 'Active Subscriptions',
      value: stats.activeSubscriptions,
      icon: TrendingUp,
      description: 'Current subscribers',
      color: 'text-blue-600'
    },
    {
      title: 'Average Rating',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      description: 'Customer satisfaction',
      color: 'text-yellow-600'
    },
    {
      title: 'Completed Orders',
      value: stats.completedOrders,
      icon: UserCheck,
      description: 'Successfully completed',
      color: 'text-green-600'
    }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your platform performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Order Completion Rate</span>
              <Badge variant="secondary">
                {stats.totalOrders > 0 ? 
                  `${((stats.completedOrders / stats.totalOrders) * 100).toFixed(1)}%` : 
                  '0%'
                }
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Active Freelancer Ratio</span>
              <Badge variant="secondary">
                {stats.totalFreelancers > 0 ? 
                  `${((stats.totalFreelancers / (stats.totalFreelancers + stats.totalCustomers)) * 100).toFixed(1)}%` : 
                  '0%'
                }
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Average Order Value</span>
              <Badge variant="secondary">
                ${stats.totalOrders > 0 ? 
                  ((stats.totalRevenue / 100) / stats.totalOrders).toFixed(2) : 
                  '0.00'
                }
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Use the navigation sidebar to:
            </div>
            <ul className="text-sm space-y-1 ml-4">
              <li>• Manage users and freelancer applications</li>
              <li>• Review and process orders</li>
              <li>• View detailed analytics and reports</li>
              <li>• Configure system settings</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;