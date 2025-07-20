import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Plus, DollarSign, Users, TrendingUp, RefreshCw } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  activeSubscriptions: number;
}

const ServiceManager = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [ordersQuery, subscribersQuery] = await Promise.all([
        supabase.from('orders').select('amount'),
        supabase.from('subscribers').select('subscribed, subscription_tier'),
      ]);

      const orders = ordersQuery.data || [];
      const subscribers = subscribersQuery.data || [];

      const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
      const activeSubscriptions = subscribers.filter(sub => sub.subscribed).length;

      setStats({
        totalUsers: subscribers.length,
        totalOrders: orders.length,
        totalRevenue: totalRevenue / 100,
        activeSubscriptions,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statsCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Active Subscriptions',
      value: stats.activeSubscriptions,
      icon: Badge,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Monitor your platform's performance and key metrics</p>
        </div>
        <Button onClick={fetchStats} disabled={loading} variant="outline" size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`h-10 w-10 lg:h-12 lg:w-12 ${stat.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 ml-4`}>
                  <stat.icon className={`h-5 w-5 lg:h-6 lg:w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button className="h-16 lg:h-20 flex-col gap-2 text-xs lg:text-sm" variant="outline">
            <Users className="h-5 w-5 lg:h-6 lg:w-6" />
            <span>Manage Users</span>
          </Button>
          <Button className="h-16 lg:h-20 flex-col gap-2 text-xs lg:text-sm" variant="outline">
            <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6" />
            <span>View Reports</span>
          </Button>
          <Button className="h-16 lg:h-20 flex-col gap-2 text-xs lg:text-sm" variant="outline">
            <DollarSign className="h-5 w-5 lg:h-6 lg:w-6" />
            <span>Payment Settings</span>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest platform activities and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Plus className="h-4 w-4 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">New user registration</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <Badge variant="secondary" className="ml-2 flex-shrink-0">User</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">Payment processed</p>
                  <p className="text-xs text-gray-500">5 minutes ago</p>
                </div>
              </div>
              <Badge variant="secondary" className="ml-2 flex-shrink-0">Payment</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">New subscription activated</p>
                  <p className="text-xs text-gray-500">10 minutes ago</p>
                </div>
              </div>
              <Badge variant="secondary" className="ml-2 flex-shrink-0">Subscription</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceManager;