import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  User, 
  MessageSquare, 
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Booking {
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
  assignment_status: string;
  assigned_freelancer_id: string;
  created_at: string;
  selected_addons: any;
  has_membership_discount: boolean;
  original_amount: number;
}

interface Review {
  rating: number;
  review_text: string;
}

const MyBookings = () => {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewDialog, setReviewDialog] = useState<string | null>(null);
  const [review, setReview] = useState<Review>({ rating: 5, review_text: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

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
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setBookings(data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending', icon: Clock },
      paid: { color: 'bg-blue-100 text-blue-800', label: 'Confirmed', icon: CheckCircle },
      assigned: { color: 'bg-green-100 text-green-800', label: 'Assigned', icon: User },
      in_progress: { color: 'bg-purple-100 text-purple-800', label: 'In Progress', icon: Clock },
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled', icon: XCircle },
      failed: { color: 'bg-red-100 text-red-800', label: 'Failed', icon: AlertCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
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
      month: 'long',
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

  const handleReviewSubmit = async (bookingId: string) => {
    if (!user || !review.rating) {
      toast({
        title: "Missing Information",
        description: "Please provide a rating.",
        variant: "destructive",
      });
      return;
    }

    setSubmittingReview(true);
    try {
      const { error } = await supabase
        .from('booking_reviews')
        .insert({
          booking_id: bookingId,
          customer_id: user.id,
          rating: review.rating,
          review_text: review.review_text
        });

      if (error) throw error;

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });

      setReviewDialog(null);
      setReview({ rating: 5, review_text: '' });
      loadBookings(); // Refresh to show updated status
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Please log in to view your bookings.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Bookings</h1>
        <p className="text-muted-foreground">Track and manage your cleaning service bookings</p>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
            <p className="text-muted-foreground mb-4">
              Book your first cleaning service to get started!
            </p>
            <Button onClick={() => window.location.href = '/customer'}>
              Browse Services
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {booking.service_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {booking.service_description}
                        </p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.preferred_date ? formatDate(booking.preferred_date) : 'Date TBD'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{formatTime(booking.preferred_time)} ({booking.duration_hours}h)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>ZIP: {booking.customer_zip_code}</span>
                      </div>
                    </div>

                    {booking.selected_addons && Array.isArray(booking.selected_addons) && booking.selected_addons.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-foreground">Add-ons:</p>
                        <div className="flex flex-wrap gap-1">
                          {booking.selected_addons.map((addon: any, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {addon.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {booking.special_instructions && (
                      <div>
                        <p className="text-sm font-medium text-foreground">Special Instructions:</p>
                        <p className="text-sm text-muted-foreground">{booking.special_instructions}</p>
                      </div>
                    )}
                  </div>

                  <div className="lg:text-right space-y-2">
                    <div className="flex items-center gap-2 lg:justify-end">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-lg font-bold">
                          ${(booking.amount / 100).toFixed(2)}
                        </span>
                        {booking.has_membership_discount && booking.original_amount && (
                          <div className="text-xs text-muted-foreground">
                            <span className="line-through">
                              ${(booking.original_amount / 100).toFixed(2)}
                            </span>
                            <span className="text-primary ml-1">50% OFF</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Booked: {formatDate(booking.created_at)}
                    </div>

                    {booking.status === 'completed' && (
                      <Dialog open={reviewDialog === booking.id} onOpenChange={(open) => 
                        setReviewDialog(open ? booking.id : null)
                      }>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full lg:w-auto">
                            <Star className="h-4 w-4 mr-2" />
                            Leave Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Rate Your Experience</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Rating</Label>
                              <Select 
                                value={review.rating.toString()} 
                                onValueChange={(value) => setReview(prev => ({ ...prev, rating: parseInt(value) }))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {[5, 4, 3, 2, 1].map(rating => (
                                    <SelectItem key={rating} value={rating.toString()}>
                                      {'⭐'.repeat(rating)} ({rating} star{rating !== 1 ? 's' : ''})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Review (Optional)</Label>
                              <Textarea
                                placeholder="Share your experience with this cleaning service..."
                                value={review.review_text}
                                onChange={(e) => setReview(prev => ({ ...prev, review_text: e.target.value }))}
                                rows={4}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleReviewSubmit(booking.id)}
                                disabled={submittingReview}
                                className="flex-1"
                              >
                                {submittingReview ? 'Submitting...' : 'Submit Review'}
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => setReviewDialog(null)}
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
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

export default MyBookings;