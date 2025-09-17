import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  FileText, 
  Download,
  Eye,
  MapPin,
  Star
} from 'lucide-react';

interface Freelancer {
  id: string;
  user_id: string;
  business_name: string;
  contact_phone: string;
  bio: string;
  experience_years: number;
  hourly_rate: number;
  service_areas: string[];
  services_offered: string[];
  verification_status: string;
  documents: any;
  is_active: boolean;
  created_at: string;
  total_jobs: number;
  rating: number;
}

const CleanerApproval = () => {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null);
  const [approvalReason, setApprovalReason] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'view'>('view');

  const { toast } = useToast();

  useEffect(() => {
    loadFreelancers();
  }, []);

  const loadFreelancers = async () => {
    try {
      console.log('Loading freelancers...');
      
      const { data, error } = await supabase
        .from('freelancers')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Freelancers loaded:', { count: data?.length, error });

      if (error) throw error;
      setFreelancers(data || []);
    } catch (error) {
      console.error('Error loading freelancers:', error);
      toast({
        title: "Error",
        description: "Failed to load freelancers for approval.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedFreelancer) return;

    setActionLoading(true);
    try {
      console.log('Starting approval process for freelancer:', selectedFreelancer.id);
      
      const { data, error } = await supabase
        .from('freelancers')
        .update({
          verification_status: 'approved',
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedFreelancer.id)
        .select();

      console.log('Update result:', { data, error });

      if (error) {
        console.error('Database update error:', error);
        throw error;
      }

      // Send notification to freelancer
      await supabase.functions.invoke('send-notification', {
        body: {
          user_id: selectedFreelancer.user_id,
          title: 'Application Approved!',
          message: `Congratulations! Your cleaner application has been approved. You can now start receiving job assignments.`,
          type: 'approval',
          related_id: selectedFreelancer.id
        }
      });

      toast({
        title: "Freelancer Approved",
        description: `${selectedFreelancer.business_name} has been approved and activated.`,
      });

      setDialogOpen(false);
      setApprovalReason('');
      loadFreelancers();
    } catch (error) {
      console.error('Error approving freelancer:', error);
      toast({
        title: "Error",
        description: "Failed to approve freelancer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedFreelancer || !rejectionReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(true);
    try {
      console.log('Starting rejection process for freelancer:', selectedFreelancer.id);
      
      const { data, error } = await supabase
        .from('freelancers')
        .update({
          verification_status: 'rejected',
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedFreelancer.id)
        .select();

      console.log('Rejection update result:', { data, error });

      if (error) {
        console.error('Database rejection error:', error);
        throw error;
      }

      // Send notification to freelancer
      await supabase.functions.invoke('send-notification', {
        body: {
          user_id: selectedFreelancer.user_id,
          title: 'Application Status Update',
          message: `Your cleaner application has been reviewed. Reason: ${rejectionReason}`,
          type: 'rejection',
          related_id: selectedFreelancer.id
        }
      });

      toast({
        title: "Freelancer Rejected",
        description: `${selectedFreelancer.business_name} application has been rejected.`,
      });

      setDialogOpen(false);
      setRejectionReason('');
      loadFreelancers();
    } catch (error) {
      console.error('Error rejecting freelancer:', error);
      toast({
        title: "Error",
        description: "Failed to reject freelancer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const isPending = (status: string | null | undefined) => {
    return !status || status === 'pending' || status === 'pending_review' || status === '';
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending Review' },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Approved' },
      verified: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' }
    };

    // If it's a pending status or null/undefined, show as pending
    if (isPending(status)) {
      const config = configs.pending;
      const Icon = config.icon;
      return (
        <Badge className={`${config.color} flex items-center gap-1`}>
          <Icon className="h-3 w-3" />
          {config.label}
        </Badge>
      );
    }

    const config = configs[status as keyof typeof configs] || configs.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const openDialog = (freelancer: Freelancer, type: 'approve' | 'reject' | 'view') => {
    setSelectedFreelancer(freelancer);
    setActionType(type);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading freelancer applications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Cleaner Approval</h1>
        <p className="text-muted-foreground">Review and approve cleaner applications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Applications ({freelancers.filter(f => isPending(f.verification_status)).length})</CardTitle>
          <CardDescription>
            Review cleaner applications and approve or reject them
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Service Areas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {freelancers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      <div className="flex flex-col items-center gap-2">
                        <User className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No applications found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  freelancers.map((freelancer) => {
                    // Debug log to see the verification status
                    console.log('Freelancer:', freelancer.business_name, 'Status:', freelancer.verification_status);
                    return (
                      <TableRow key={freelancer.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{freelancer.business_name || 'N/A'}</p>
                            <p className="text-sm text-muted-foreground">{freelancer.contact_phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{freelancer.experience_years || 0} years</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{freelancer.service_areas?.length || 0} areas</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(freelancer.verification_status)}
                        </TableCell>
                        <TableCell>
                          {new Date(freelancer.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openDialog(freelancer, 'view')}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {isPending(freelancer.verification_status) && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => openDialog(freelancer, 'approve')}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  title="Approve"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => openDialog(freelancer, 'reject')}
                                  title="Reject"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Approval/Rejection Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'view' && 'Freelancer Details'}
              {actionType === 'approve' && 'Approve Freelancer'}
              {actionType === 'reject' && 'Reject Freelancer'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedFreelancer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Business Name</Label>
                  <p className="text-sm">{selectedFreelancer.business_name || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm">{selectedFreelancer.contact_phone || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Experience</Label>
                  <p className="text-sm">{selectedFreelancer.experience_years || 0} years</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Hourly Rate</Label>
                  <p className="text-sm">${selectedFreelancer.hourly_rate || 0}/hour</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Bio</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedFreelancer.bio || 'No bio provided'}
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Service Areas</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedFreelancer.service_areas?.map((area, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Services Offered</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedFreelancer.services_offered?.map((service, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              {actionType === 'approve' && (
                <div>
                  <Label htmlFor="approval-reason">Approval Notes (Optional)</Label>
                  <Textarea
                    id="approval-reason"
                    placeholder="Add any notes about the approval..."
                    value={approvalReason}
                    onChange={(e) => setApprovalReason(e.target.value)}
                  />
                </div>
              )}

              {actionType === 'reject' && (
                <div>
                  <Label htmlFor="rejection-reason">Rejection Reason *</Label>
                  <Textarea
                    id="rejection-reason"
                    placeholder="Please explain why you're rejecting this application..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>
              )}

              <div className="flex gap-2 pt-4">
                {actionType === 'approve' && (
                  <Button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Freelancer
                  </Button>
                )}
                
                {actionType === 'reject' && (
                  <Button
                    onClick={handleReject}
                    disabled={actionLoading}
                    variant="destructive"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Application
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  {actionType === 'view' ? 'Close' : 'Cancel'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CleanerApproval;