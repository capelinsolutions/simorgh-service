import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Star, 
  User, 
  MessageSquare, 
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit3,
  CalendarX,
  Receipt,
  Download
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
  const [rescheduleDialog, setRescheduleDialog] = useState<string | null>(null);
  const [invoiceDialog, setInvoiceDialog] = useState<string | null>(null);
  const [review, setReview] = useState<Review>({ rating: 5, review_text: '' });
  const [rescheduleData, setRescheduleData] = useState({
    date: undefined as Date | undefined,
    time: '',
    reason: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [processingReschedule, setProcessingReschedule] = useState(false);

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

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const canReschedule = (booking: Booking) => {
    if (!booking.preferred_date) return false;
    const bookingDate = new Date(booking.preferred_date);
    const now = new Date();
    const timeDiff = bookingDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    return hoursDiff > 24 && ['pending', 'paid', 'assigned'].includes(booking.status);
  };

  const canCancel = (booking: Booking) => {
    return ['pending', 'paid', 'assigned'].includes(booking.status);
  };

  const handleReschedule = async (bookingId: string) => {
    if (!rescheduleData.date || !rescheduleData.time) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time.",
        variant: "destructive",
      });
      return;
    }

    setProcessingReschedule(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          preferred_date: rescheduleData.date.toISOString().split('T')[0],
          preferred_time: rescheduleData.time,
          admin_notes: `Rescheduled by customer. Reason: ${rescheduleData.reason}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      // Create notification for customer
      await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: 'Booking Rescheduled',
          message: `Your booking has been rescheduled to ${formatDate(rescheduleData.date.toISOString())} at ${formatTime(rescheduleData.time)}.`,
          type: 'booking',
          related_id: bookingId
        });

      toast({
        title: "Booking Rescheduled",
        description: "Your booking has been rescheduled successfully.",
      });

      setRescheduleDialog(null);
      setRescheduleData({ date: undefined, time: '', reason: '' });
      loadBookings(); // Refresh bookings
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      toast({
        title: "Error",
        description: "Failed to reschedule booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingReschedule(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'cancelled',
          admin_notes: 'Cancelled by customer',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      // Create notification for customer
      await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: 'Booking Cancelled',
          message: 'Your booking has been cancelled. You will receive a refund within 3-5 business days.',
          type: 'booking',
          related_id: bookingId
        });

      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });

      loadBookings(); // Refresh bookings
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const generateInvoice = (booking: Booking) => {
    const invoiceData = {
      invoiceNumber: `INV-${booking.id.slice(-8).toUpperCase()}`,
      date: new Date(booking.created_at).toLocaleDateString(),
      dueDate: booking.preferred_date || 'TBD',
      service: booking.service_name,
      description: booking.service_description,
      duration: booking.duration_hours,
      amount: booking.amount,
      originalAmount: booking.original_amount,
      hasMembershipDiscount: booking.has_membership_discount,
      addons: booking.selected_addons,
      customerEmail: user?.email || 'N/A',
      zipCode: booking.customer_zip_code
    };

    return invoiceData;
  };

  const downloadInvoice = (booking: Booking) => {
    const invoice = generateInvoice(booking);
    const invoiceText = `
INVOICE #${invoice.invoiceNumber}

Date: ${invoice.date}
Service Date: ${invoice.dueDate}
Customer: ${invoice.customerEmail}

Service: ${invoice.service}
Description: ${invoice.description}
Duration: ${invoice.duration} hours
Location: ZIP ${invoice.zipCode}

${invoice.hasMembershipDiscount && invoice.originalAmount ? 
  `Subtotal: $${(invoice.originalAmount / 100).toFixed(2)}
Membership Discount (50%): -$${((invoice.originalAmount - invoice.amount) / 100).toFixed(2)}` : ''}
Total: $${(invoice.amount / 100).toFixed(2)}

Thank you for choosing our service!
    `.trim();

    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoice.invoiceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
            <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
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
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
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

                    <div className="flex flex-wrap gap-2">
                      {/* Reschedule Button */}
                      {canReschedule(booking) && (
                        <Dialog open={rescheduleDialog === booking.id} onOpenChange={(open) => 
                          setRescheduleDialog(open ? booking.id : null)
                        }>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit3 className="h-4 w-4 mr-2" />
                              Reschedule
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Reschedule Booking</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>New Date</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="w-full justify-start text-left font-normal"
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {rescheduleData.date ? 
                                        formatDate(rescheduleData.date.toISOString()) : 
                                        "Pick a date"
                                      }
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={rescheduleData.date}
                                      onSelect={(date) => setRescheduleData(prev => ({ ...prev, date }))}
                                      disabled={(date) => date < new Date()}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                              <div>
                                <Label>New Time</Label>
                                <Select 
                                  value={rescheduleData.time} 
                                  onValueChange={(time) => setRescheduleData(prev => ({ ...prev, time }))}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select time" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {timeSlots.map(time => (
                                      <SelectItem key={time} value={time}>
                                        {formatTime(time)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Reason (Optional)</Label>
                                <Textarea
                                  placeholder="Why are you rescheduling?"
                                  value={rescheduleData.reason}
                                  onChange={(e) => setRescheduleData(prev => ({ ...prev, reason: e.target.value }))}
                                  rows={3}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  onClick={() => handleReschedule(booking.id)}
                                  disabled={processingReschedule}
                                  className="flex-1"
                                >
                                  {processingReschedule ? 'Rescheduling...' : 'Reschedule'}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={() => setRescheduleDialog(null)}
                                  className="flex-1"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}

                      {/* Cancel Button */}
                      {canCancel(booking) && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCancel(booking.id)}
                        >
                          <CalendarX className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      )}

                      {/* Invoice Button */}
                      {booking.status === 'paid' || booking.status === 'completed' ? (
                        <Dialog open={invoiceDialog === booking.id} onOpenChange={(open) => 
                          setInvoiceDialog(open ? booking.id : null)
                        }>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Receipt className="h-4 w-4 mr-2" />
                              Invoice
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Invoice Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              {(() => {
                                const invoice = generateInvoice(booking);
                                return (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <strong>Invoice #:</strong> {invoice.invoiceNumber}
                                      </div>
                                      <div>
                                        <strong>Date:</strong> {invoice.date}
                                      </div>
                                      <div>
                                        <strong>Service:</strong> {invoice.service}
                                      </div>
                                      <div>
                                        <strong>Duration:</strong> {invoice.duration}h
                                      </div>
                                    </div>
                                    
                                    <div className="border-t pt-4">
                                      <h4 className="font-medium mb-2">Amount Breakdown</h4>
                                      <div className="space-y-1 text-sm">
                                        {invoice.hasMembershipDiscount && invoice.originalAmount ? (
                                          <>
                                            <div className="flex justify-between">
                                              <span>Subtotal:</span>
                                              <span>${(invoice.originalAmount / 100).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-green-600">
                                              <span>Membership Discount (50%):</span>
                                              <span>-${((invoice.originalAmount - invoice.amount) / 100).toFixed(2)}</span>
                                            </div>
                                          </>
                                        ) : null}
                                        <div className="flex justify-between font-medium text-lg border-t pt-2">
                                          <span>Total:</span>
                                          <span>${(invoice.amount / 100).toFixed(2)}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <Button 
                                      onClick={() => downloadInvoice(booking)}
                                      className="w-full"
                                    >
                                      <Download className="h-4 w-4 mr-2" />
                                      Download Invoice
                                    </Button>
                                  </div>
                                );
                              })()}
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : null}

                      {/* Review Button */}
                      {booking.status === 'completed' && (
                        <Dialog open={reviewDialog === booking.id} onOpenChange={(open) => 
                          setReviewDialog(open ? booking.id : null)
                        }>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Star className="h-4 w-4 mr-2" />
                              Review
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