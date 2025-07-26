import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, MapPin, User, DollarSign, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface LiveBooking {
  id: string;
  service_name: string;
  customer_email: string;
  amount: number;
  status: string;
  assignment_status: string;
  customer_zip_code: string;
  preferred_date: string;
  preferred_time: string;
  created_at: string;
  assigned_freelancer_id?: string;
}

const LiveBookingFeed = () => {
  const [bookings, setBookings] = useState<LiveBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentBookings();
    
    // Set up real-time subscription for new bookings
    const channel = supabase
      .channel('live-bookings')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('New booking received:', payload);
          const newBooking = payload.new as LiveBooking;
          setBookings(prev => [newBooking, ...prev.slice(0, 9)]); // Keep only latest 10
          
          toast({
            title: 'New Booking Received!',
            description: `${newBooking.service_name} booking for ${newBooking.customer_email}`,
            duration: 5000,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Booking updated:', payload);
          const updatedBooking = payload.new as LiveBooking;
          setBookings(prev => 
            prev.map(booking => 
              booking.id === updatedBooking.id ? updatedBooking : booking
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRecentBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch recent bookings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-orange-100 text-orange-800',
      assigned: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getAssignmentBadge = (assignmentStatus: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      no_freelancers_available: 'bg-red-100 text-red-800',
      freelancers_overbooked: 'bg-orange-100 text-orange-800'
    };

    return (
      <Badge className={colors[assignmentStatus as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {assignmentStatus.replace(/_/g, ' ').toUpperCase()}
      </Badge>
    );
  };

  const handleManualAssign = async (orderId: string) => {
    try {
      const { error } = await supabase.functions.invoke('auto-assign-order', {
        body: { orderId }
      });

      if (error) throw error;

      toast({
        title: "Assignment Triggered",
        description: "Manual assignment process initiated",
      });

      // Refresh the bookings
      fetchRecentBookings();
    } catch (error) {
      console.error('Error triggering assignment:', error);
      toast({
        title: "Error",
        description: "Failed to trigger manual assignment",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Booking Feed</CardTitle>
          <CardDescription>Real-time booking updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          Live Booking Feed
        </CardTitle>
        <CardDescription>Real-time booking updates and assignment status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No recent bookings</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{booking.service_name}</h4>
                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                      <User className="h-3 w-3" />
                      {booking.customer_email}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    {getStatusBadge(booking.status)}
                    {getAssignmentBadge(booking.assignment_status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    ${(booking.amount / 100).toFixed(2)}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {booking.customer_zip_code}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {booking.preferred_date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {booking.preferred_time}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {new Date(booking.created_at).toLocaleString()}
                  </span>
                  
                  {(booking.assignment_status === 'pending' || 
                    booking.assignment_status === 'no_freelancers_available' ||
                    booking.assignment_status === 'freelancers_overbooked') && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleManualAssign(booking.id)}
                      className="text-xs"
                    >
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Manual Assign
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveBookingFeed;