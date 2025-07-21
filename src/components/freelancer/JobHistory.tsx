import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Search,
  Filter,
  TrendingUp
} from 'lucide-react';

interface CompletedJob {
  id: string;
  order_id: string;
  freelancer_id: string;
  status: string;
  assigned_at: string;
  accepted_at: string;
  orders: {
    id: string;
    service_name: string;
    service_description: string;
    amount: number;
    currency: string;
    status: string;
    preferred_date: string;
    preferred_time: string;
    duration_hours: number;
    special_instructions: string;
    customer_zip_code: string;
    customer_email: string;
    selected_addons: any;
    created_at: string;
    updated_at: string;
  };
}

interface Earnings {
  totalEarnings: number;
  monthlyEarnings: number;
  averageJobValue: number;
  totalJobs: number;
}

const JobHistory = () => {
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<CompletedJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<CompletedJob[]>([]);
  const [earnings, setEarnings] = useState<Earnings>({
    totalEarnings: 0,
    monthlyEarnings: 0,
    averageJobValue: 0,
    totalJobs: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const { toast } = useToast();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadJobHistory();
      loadEarnings();
    }
  }, [user]);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, statusFilter, dateFilter]);

  const loadJobHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('order_assignments')
        .select(`
          *,
          orders (
            id,
            service_name,
            service_description,
            amount,
            currency,
            status,
            preferred_date,
            preferred_time,
            duration_hours,
            special_instructions,
            customer_zip_code,
            customer_email,
            selected_addons,
            created_at,
            updated_at
          )
        `)
        .eq('freelancer_id', user.id)
        .in('status', ['accepted'])
        .in('orders.status', ['completed', 'cancelled', 'failed'])
        .order('accepted_at', { ascending: false });

      if (error) throw error;

      setJobs(data || []);
    } catch (error) {
      console.error('Error loading job history:', error);
      toast({
        title: "Error",
        description: "Failed to load job history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadEarnings = async () => {
    if (!user) return;

    try {
      // Get all completed jobs for this freelancer
      const { data: completedJobs, error } = await supabase
        .from('order_assignments')
        .select(`
          orders (
            amount,
            status,
            updated_at
          )
        `)
        .eq('freelancer_id', user.id)
        .eq('status', 'accepted')
        .eq('orders.status', 'completed');

      if (error) throw error;

      const jobs = completedJobs || [];
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const totalEarnings = jobs.reduce((sum, job) => sum + (job.orders?.amount || 0), 0);
      const monthlyJobs = jobs.filter(job => {
        const jobDate = new Date(job.orders?.updated_at || '');
        return jobDate.getMonth() === currentMonth && jobDate.getFullYear() === currentYear;
      });
      const monthlyEarnings = monthlyJobs.reduce((sum, job) => sum + (job.orders?.amount || 0), 0);
      const averageJobValue = jobs.length > 0 ? totalEarnings / jobs.length : 0;

      setEarnings({
        totalEarnings: totalEarnings / 100, // Convert from cents
        monthlyEarnings: monthlyEarnings / 100,
        averageJobValue: averageJobValue / 100,
        totalJobs: jobs.length
      });
    } catch (error) {
      console.error('Error loading earnings:', error);
    }
  };

  const filterJobs = () => {
    let filtered = jobs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.orders.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.orders.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.orders.customer_zip_code.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.orders.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(job => 
        new Date(job.orders.updated_at) >= filterDate
      );
    }

    setFilteredJobs(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled', icon: XCircle },
      failed: { color: 'bg-red-100 text-red-800', label: 'Failed', icon: AlertCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.completed;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'Not set';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Please log in to view your job history.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading your job history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Job History & Earnings</h1>
        <p className="text-muted-foreground">Track your completed jobs and earnings</p>
      </div>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">${earnings.totalEarnings.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">${earnings.monthlyEarnings.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Job Value</p>
                <p className="text-2xl font-bold">${earnings.averageJobValue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
                <p className="text-2xl font-bold">{earnings.totalJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs, customers, or ZIP codes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last 3 Months</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job History */}
      {filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {jobs.length === 0 ? 'No completed jobs yet' : 'No jobs match your filters'}
            </h3>
            <p className="text-muted-foreground">
              {jobs.length === 0 
                ? "Complete your first job to see it in your history!"
                : "Try adjusting your search or filter criteria."
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {job.orders.service_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {job.orders.service_description}
                        </p>
                      </div>
                      {getStatusBadge(job.orders.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{job.orders.preferred_date ? formatDate(job.orders.preferred_date) : 'Date TBD'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{formatTime(job.orders.preferred_time)} ({job.orders.duration_hours}h)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>ZIP: {job.orders.customer_zip_code}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Customer: {job.orders.customer_email}</span>
                    </div>

                    {job.orders.selected_addons && Array.isArray(job.orders.selected_addons) && job.orders.selected_addons.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-foreground">Add-ons:</p>
                        <div className="flex flex-wrap gap-1">
                          {job.orders.selected_addons.map((addon: any, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {addon.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="lg:text-right space-y-2">
                    <div className="flex items-center gap-2 lg:justify-end">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-lg font-bold">
                        ${(job.orders.amount / 100).toFixed(2)}
                      </span>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Completed: {formatDate(job.orders.updated_at)}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Job ID: {job.orders.id.slice(-8).toUpperCase()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobHistory;