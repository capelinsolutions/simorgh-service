import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Crown, Star, Check, CreditCard, Settings, RefreshCw } from 'lucide-react';
import type { User, Session } from '@supabase/supabase-js';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
}

const Membership = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null,
  });

  const membershipTiers = [
    {
      name: 'Basic',
      price: 29,
      description: 'Perfect for individuals and small households',
      features: [
        '50% off all residential services',
        'Priority booking',
        'Monthly service reports',
        'Email support',
        '2 free service changes per month'
      ],
      color: 'bg-blue-50 border-blue-200',
      popular: false,
    },
    {
      name: 'Premium',
      price: 49,
      description: 'Ideal for families and frequent service users',
      features: [
        '55% off all services',
        'Priority booking & 24/7 support',
        'Weekly service reports',
        'Dedicated account manager',
        'Unlimited service changes',
        'Emergency service access',
        'Luxury services included'
      ],
      color: 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200',
      popular: true,
    },
  ];

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          checkSubscriptionStatus();
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkSubscriptionStatus();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSubscriptionStatus = async () => {
    if (!session) return;
    
    setCheckingSubscription(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      if (data) {
        setSubscriptionData(data);
      }
    } catch (error: any) {
      console.error('Error checking subscription:', error);
      toast({
        title: "Status check failed",
        description: "Could not verify subscription status. API keys may not be configured.",
        variant: "destructive"
      });
    } finally {
      setCheckingSubscription(false);
    }
  };

  const handleSubscribe = async (tier: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to subscribe to a membership plan.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: { tier },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        toast({
          title: "Redirecting to payment",
          description: "Opening Stripe checkout in a new tab..."
        });
      }
    } catch (error: any) {
      toast({
        title: "Subscription failed",
        description: error.message || "Failed to create subscription session",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!session) return;

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
    } catch (error: any) {
      toast({
        title: "Portal access failed",
        description: error.message || "Could not access customer portal",
        variant: "destructive"
      });
    }
  };

  const isCurrentTier = (tierName: string) => {
    return subscriptionData.subscribed && subscriptionData.subscription_tier === tierName;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Crown className="h-6 w-6 text-primary" />
              Membership Required
            </CardTitle>
            <CardDescription>
              Please sign in to view and manage your membership
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/auth">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Membership Plans</h1>
          <p className="text-xl text-muted-foreground">
            Get exclusive discounts and priority access to our services
          </p>
        </div>

        {/* Current Subscription Status */}
        {subscriptionData.subscribed && (
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Crown className="h-5 w-5" />
                Active Membership
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-green-800">
                    {subscriptionData.subscription_tier} Plan
                  </p>
                  {subscriptionData.subscription_end && (
                    <p className="text-sm text-green-600">
                      Renews: {new Date(subscriptionData.subscription_end).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={checkSubscriptionStatus}
                    disabled={checkingSubscription}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${checkingSubscription ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleManageSubscription}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Membership Tiers */}
        <div className="grid md:grid-cols-2 gap-8">
          {membershipTiers.map((tier) => (
            <Card 
              key={tier.name} 
              className={`relative ${tier.color} ${tier.popular ? 'ring-2 ring-primary' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              {isCurrentTier(tier.name) && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-green-500 text-white">
                    <Check className="h-3 w-3 mr-1" />
                    Current Plan
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription className="text-base">{tier.description}</CardDescription>
                <div className="space-y-1">
                  <p className="text-4xl font-bold text-primary">
                    ${tier.price}
                    <span className="text-lg font-normal text-muted-foreground">/month</span>
                  </p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => handleSubscribe(tier.name)}
                  disabled={loading || isCurrentTier(tier.name)}
                  variant={isCurrentTier(tier.name) ? "outline" : "default"}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {isCurrentTier(tier.name) 
                    ? 'Current Plan'
                    : loading 
                    ? 'Processing...' 
                    : `Subscribe to ${tier.name}`
                  }
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <Card>
          <CardHeader>
            <CardTitle>Why Choose Membership?</CardTitle>
            <CardDescription>
              Unlock exclusive benefits and save money on all our services
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Exclusive Discounts</h3>
              <p className="text-sm text-muted-foreground">
                Save up to 55% on all services with our membership plans
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Priority Booking</h3>
              <p className="text-sm text-muted-foreground">
                Get first access to booking slots and premium time slots
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Dedicated Support</h3>
              <p className="text-sm text-muted-foreground">
                24/7 premium support and dedicated account management
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Membership;