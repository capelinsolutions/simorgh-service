import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  DollarSign,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  Pause,
  FileText
} from 'lucide-react';

interface JobAssignment {
  id: string;
  order_id: string;
  freelancer_id: string;
  status: string;
  assigned_at: string;
  accepted_at: string;
  rejected_at: string;
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
  };
}

const ActiveJobs = () => {
  const [user, setUser] = useState<any>(null);
  const [assignments, setAssignments] = useState<JobAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionDialog, setActionDialog] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingAction, setProcessingAction] = useState(false);

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
      loadAssignments();
    }
  }, [user]);

  const loadAssignments = async () => {
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
            created_at
          )
        `)
        .eq('freelancer_id', user.id)
        .in('status', ['offered', 'accepted'])
        .order('assigned_at', { ascending: false });

      if (error) throw error;

      setAssignments(data || []);
    } catch (error) {
      console.error('Error loading assignments:', error);
      toast({
        title: "Error",
        description: "Failed to load job assignments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptJob = async (assignmentId: string, orderId: string) => {
    setProcessingAction(true);
    try {
      const { error: assignmentError } = await supabase
        .from('order_assignments')
        .update({
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .eq('id', assignmentId);

      if (assignmentError) throw assignmentError;

      const { error: orderError } = await supabase
        .from('orders')
        .update({
          status: 'assigned',
          assigned_freelancer_id: user.id,
          assignment_status: 'assigned'
        })
        .eq('id', orderId);

      if (orderError) throw orderError;

      // Create notification for customer
      await supabase
        .from('notifications')
        .insert({
          user_id: assignments.find(a => a.id === assignmentId)?.orders?.customer_email,
          title: 'Cleaner Assigned',
          message: 'A cleaner has been assigned to your booking and will contact you soon.',
          type: 'assignment',
          related_id: orderId
        });

      toast({
        title: "Job Accepted",
        description: "You have successfully accepted this job.",
      });

      loadAssignments();
    } catch (error) {
      console.error('Error accepting job:', error);
      toast({
        title: "Error",
        description: "Failed to accept job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingAction(false);
    }
  };

  const handleRejectJob = async (assignmentId: string) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for rejecting this job.",
        variant: "destructive",
      });
      return;
    }

    setProcessingAction(true);
    try {
      const { error } = await supabase
        .from('order_assignments')
        .update({
          status: 'rejected',
          rejected_at: new Date().toISOString()
        })
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: "Job Rejected",
        description: "You have rejected this job assignment.",
      });

      setActionDialog(null);
      setRejectionReason('');
      loadAssignments();
    } catch (error) {
      console.error('Error rejecting job:', error);
      toast({
        title: "Error",
        description: "Failed to reject job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingAction(false);
    }
  };

  const handleStartJob = async (orderId: string) => {
    setProcessingAction(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      // Create notification for customer
      await supabase
        .from('notifications')
        .insert({
          user_id: assignments.find(a => a.orders.id === orderId)?.orders?.customer_email,
          title: 'Service Started',
          message: 'Your cleaner has started working on your service.',
          type: 'job_update',
          related_id: orderId
        });

      toast({
        title: "Job Started",
        description: "You have marked this job as in progress.",
      });

      loadAssignments();
    } catch (error) {
      console.error('Error starting job:', error);
      toast({
        title: "Error",
        description: "Failed to start job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingAction(false);
    }
  };

  const handleCompleteJob = async (orderId: string) => {
    setProcessingAction(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      // Create notification for customer
      await supabase
        .from('notifications')
        .insert({
          user_id: assignments.find(a => a.orders.id === orderId)?.orders?.customer_email,
          title: 'Service Completed',
          message: 'Your cleaning service has been completed. Please leave a review!',
          type: 'job_update',
          related_id: orderId
        });

      toast({
        title: "Job Completed",
        description: "You have marked this job as completed.",
      });

      loadAssignments();
    } catch (error) {
      console.error('Error completing job:', error);
      toast({
        title: "Error",
        description: "Failed to complete job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingAction(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      offered: { color: 'bg-blue-100 text-blue-800', label: 'New Offer', icon: AlertCircle },
      accepted: { color: 'bg-green-100 text-green-800', label: 'Accepted', icon: CheckCircle },
      in_progress: { color: 'bg-purple-100 text-purple-800', label: 'In Progress', icon: Play },
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed', icon: CheckCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.offered;
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

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Please log in to view your jobs.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading your jobs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Active Jobs</h1>
        <p className="text-muted-foreground">Manage your current job assignments and offers</p>
      </div>

      {assignments.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No active jobs</h3>
            <p className="text-muted-foreground">
              Check back soon for new job opportunities in your area!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {assignment.orders.service_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {assignment.orders.service_description}
                        </p>
                      </div>
                      {getStatusBadge(assignment.status === 'accepted' ? assignment.orders.status : assignment.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{assignment.orders.preferred_date ? formatDate(assignment.orders.preferred_date) : 'Date TBD'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{formatTime(assignment.orders.preferred_time)} ({assignment.orders.duration_hours}h)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>ZIP: {assignment.orders.customer_zip_code}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Customer: {assignment.orders.customer_email}</span>
                    </div>

                    {assignment.orders.selected_addons && Array.isArray(assignment.orders.selected_addons) && assignment.orders.selected_addons.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-foreground">Add-ons:</p>
                        <div className="flex flex-wrap gap-1">
                          {assignment.orders.selected_addons.map((addon: any, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {addon.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {assignment.orders.special_instructions && (
                      <div>
                        <p className="text-sm font-medium text-foreground">Special Instructions:</p>
                        <p className="text-sm text-muted-foreground">{assignment.orders.special_instructions}</p>
                      </div>
                    )}
                  </div>

                  <div className="lg:text-right space-y-2">
                    <div className="flex items-center gap-2 lg:justify-end">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-lg font-bold">
                        ${(assignment.orders.amount / 100).toFixed(2)}
                      </span>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Assigned: {formatDate(assignment.assigned_at)}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {assignment.status === 'offered' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => handleAcceptJob(assignment.id, assignment.orders.id)}
                            disabled={processingAction}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept
                          </Button>
                          <Dialog open={actionDialog === assignment.id} onOpenChange={(open) => 
                            setActionDialog(open ? assignment.id : null)
                          }>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reject Job Assignment</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="rejection-reason">Reason for rejection</Label>
                                  <Textarea
                                    id="rejection-reason"
                                    placeholder="Please explain why you're rejecting this job..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleRejectJob(assignment.id)}
                                    disabled={processingAction}
                                    variant="destructive"
                                  >
                                    Confirm Rejection
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => setActionDialog(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}

                      {assignment.status === 'accepted' && assignment.orders.status === 'assigned' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleStartJob(assignment.orders.id)}
                          disabled={processingAction}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Job
                        </Button>
                      )}

                      {assignment.status === 'accepted' && assignment.orders.status === 'in_progress' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleCompleteJob(assignment.orders.id)}
                          disabled={processingAction}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Complete Job
                        </Button>
                      )}

                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Contact Customer
                      </Button>
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

export default ActiveJobs;