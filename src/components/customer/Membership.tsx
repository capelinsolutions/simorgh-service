import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Loader2 } from 'lucide-react';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  membership_type: string;
}

const Membership = () => {
  const { user, session } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [checkingSubscription, setCheckingSubscription] = useState(true);

  useEffect(() => {
    if (user) {
      checkSubscriptionStatus();
    }
  }, [user]);

  const checkSubscriptionStatus = async () => {
    if (!user || !session) return;
    
    setCheckingSubscription(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      setSubscriptionData(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
      toast({
        title: "Error",
        description: "Failed to check subscription status",
        variant: "destructive",
      });
    } finally {
      setCheckingSubscription(false);
    }
  };

  const handleSubscribe = async (tier: string) => {
    if (!user || !session) return;
    
    setLoadingTier(tier);
    try {
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: { 
          tier,
          membership_type: 'customer'
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        toast({
          title: "Redirecting to Payment",
          description: "Opening Stripe checkout in a new tab...",
        });
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast({
        title: "Subscription Failed",
        description: "There was an error processing your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingTier(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!user || !session) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error accessing customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to access customer portal",
        variant: "destructive",
      });
    }
  };

  const isCurrentTier = (tierName: string) => {
    return subscriptionData?.subscribed && subscriptionData?.subscription_tier === tierName;
  };

  if (checkingSubscription) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading subscription status...</span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Membership Plans</h1>
      
      {subscriptionData?.subscribed && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              Active Subscription
            </CardTitle>
            <CardDescription className="text-green-700">
              You have an active {subscriptionData.subscription_tier} subscription
              {subscriptionData.subscription_end && (
                <> that expires on {new Date(subscriptionData.subscription_end).toLocaleDateString()}</>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleManageSubscription} variant="outline">
              Manage Subscription
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={`${isCurrentTier('Basic') ? 'border-primary ring-2 ring-primary/20' : ''}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Basic Membership</CardTitle>
              {isCurrentTier('Basic') && <Badge>Current Plan</Badge>}
            </div>
            <div className="text-3xl font-bold text-primary">$29/month</div>
            <CardDescription>Save up to 50% on all services</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => handleSubscribe('Basic')}
              disabled={loadingTier === 'Basic' || isCurrentTier('Basic')}
            >
              {loadingTier === 'Basic' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isCurrentTier('Basic') ? 'Current Plan' : 'Subscribe'}
            </Button>
          </CardContent>
        </Card>

        <Card className={`${isCurrentTier('Premium') ? 'border-primary ring-2 ring-primary/20' : ''}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Premium Membership</CardTitle>
              {isCurrentTier('Premium') && <Badge>Current Plan</Badge>}
            </div>
            <div className="text-3xl font-bold text-primary">$49/month</div>
            <CardDescription>Save up to 50% + Priority booking</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => handleSubscribe('Premium')}
              disabled={loadingTier === 'Premium' || isCurrentTier('Premium')}
            >
              {loadingTier === 'Premium' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isCurrentTier('Premium') ? 'Current Plan' : 'Subscribe'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Membership;