import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Crown, Star, Check, CreditCard, Settings, RefreshCw, Users, Briefcase, Zap, Shield, TrendingUp, Award } from 'lucide-react';
import type { User, Session } from '@supabase/supabase-js';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  membership_type: string | null;
}

const MembershipPlans = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null,
    membership_type: null,
  });
  const [activeTab, setActiveTab] = useState('customer');

  const customerPlans = [
    {
      name: 'Basic',
      price: 29,
      originalPrice: 50,
      savings: '42%',
      description: 'Perfect for individuals and small households',
      features: [
        'Up to 50% off all residential services',
        'Priority booking access',
        'Monthly service reports',
        'Email support during business hours',
        '2 free service changes per month',
        'Basic customer protection',
        'Mobile app access'
      ],
      color: 'bg-blue-50 border-blue-200',
      popular: false,
      icon: Users,
    },
    {
      name: 'Premium',
      price: 49,
      originalPrice: 80,
      savings: '39%',
      description: 'Ideal for families and frequent service users',
      features: [
        'Up to 60% off all services',
        'Priority booking & 24/7 support',
        'Weekly detailed service reports',
        'Dedicated account manager',
        'Unlimited service changes',
        'Emergency service access',
        'Premium insurance coverage',
        'Early access to new services',
        'Luxury services included',
        'Family member accounts (up to 4)'
      ],
      color: 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200',
      popular: true,
      icon: Crown,
    },
  ];

  const freelancerPlans = [
    {
      name: 'Freelancer Basic',
      price: 19,
      originalPrice: 35,
      savings: '46%',
      description: 'Perfect for individual freelancers starting out',
      features: [
        'Access to customer orders in your area',
        'Basic profile listing',
        'Up to 5 active bids',
        'Standard commission rate (8%)',
        'Email notifications',
        'Basic customer communication tools',
        'Payment processing included'
      ],
      color: 'bg-green-50 border-green-200',
      popular: false,
      icon: Briefcase,
    },
    {
      name: 'Freelancer Pro',
      price: 39,
      originalPrice: 65,
      savings: '40%',
      description: 'For established freelancers growing their business',
      features: [
        'Priority access to high-value orders',
        'Enhanced profile with portfolio',
        'Up to 15 active bids',
        'Reduced commission rate (6%)',
        'SMS & email notifications',
        'Advanced customer communication',
        'Performance analytics dashboard',
        'Customer review management',
        'Flexible scheduling tools',
        'Basic marketing boost'
      ],
      color: 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200',
      popular: true,
      icon: TrendingUp,
    },
    {
      name: 'Freelancer Enterprise',
      price: 79,
      originalPrice: 120,
      savings: '34%',
      description: 'For agencies and high-volume freelancers',
      features: [
        'First priority on premium orders',
        'Featured profile placement',
        'Unlimited active bids',
        'Lowest commission rate (4%)',
        'Priority customer support',
        'Team management tools',
        'Advanced analytics & insights',
        'Custom branding options',
        'Lead generation tools',
        'Marketing campaign support',
        'Dedicated account manager',
        'API access for integrations',
        'White-label options'
      ],
      color: 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200',
      popular: false,
      icon: Award,
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

  const handleSubscribe = async (tier: string, membershipType: 'customer' | 'freelancer') => {
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
        body: { tier, membershipType },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
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

  const PricingCard = ({ plan, membershipType }: { plan: any; membershipType: 'customer' | 'freelancer' }) => {
    const IconComponent = plan.icon;
    
    return (
      <Card 
        className={`relative ${plan.color} ${plan.popular ? 'ring-2 ring-primary' : ''}`}
      >
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-primary text-primary-foreground">
              <Star className="h-3 w-3 mr-1" />
              Most Popular
            </Badge>
          </div>
        )}
        
        {isCurrentTier(plan.name) && (
          <div className="absolute -top-3 right-4">
            <Badge className="bg-green-500 text-white">
              <Check className="h-3 w-3 mr-1" />
              Current Plan
            </Badge>
          </div>
        )}

        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <IconComponent className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">{plan.name}</CardTitle>
          <CardDescription className="text-base">{plan.description}</CardDescription>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground line-through">
                ${plan.originalPrice}/month
              </span>
              <Badge variant="destructive" className="text-xs">
                Save {plan.savings}
              </Badge>
            </div>
            <p className="text-4xl font-bold text-primary">
              ${plan.price}
              <span className="text-lg font-normal text-muted-foreground">/month</span>
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <ul className="space-y-3">
            {plan.features.map((feature: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            className="w-full"
            size="lg"
            onClick={() => handleSubscribe(plan.name, membershipType)}
            disabled={loading || isCurrentTier(plan.name)}
            variant={isCurrentTier(plan.name) ? "outline" : "default"}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {isCurrentTier(plan.name) 
              ? 'Current Plan'
              : loading 
              ? 'Processing...' 
              : `Subscribe to ${plan.name}`
            }
          </Button>
        </CardContent>
      </Card>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Crown className="h-6 w-6 text-primary" />
              Membership Plans
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
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Membership Plans</h1>
          <p className="text-lg sm:text-xl text-muted-foreground px-4">
            Choose the perfect plan for your needs - whether you're a customer or freelancer
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
                  <p className="text-sm text-green-600 capitalize">
                    {subscriptionData.membership_type} Membership
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

        {/* Membership Type Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="customer" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Customer Plans
            </TabsTrigger>
            <TabsTrigger value="freelancer" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Freelancer Plans
            </TabsTrigger>
          </TabsList>

          {/* Customer Plans */}
          <TabsContent value="customer" className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Customer Membership Plans</h2>
              <p className="text-muted-foreground">
                Save money on services and get priority access to our network of professionals
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
              {customerPlans.map((plan) => (
                <PricingCard key={plan.name} plan={plan} membershipType="customer" />
              ))}
            </div>

            {/* Customer Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Why Choose Customer Membership?</CardTitle>
                <CardDescription>
                  Unlock exclusive benefits and save money on all our services
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <Crown className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Massive Savings</h3>
                  <p className="text-sm text-muted-foreground">
                    Save up to 60% on all services with our membership plans
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Priority Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Get first access to booking slots and premium time slots
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Protection & Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Premium insurance coverage and dedicated support
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Freelancer Plans */}
          <TabsContent value="freelancer" className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Freelancer Membership Plans</h2>
              <p className="text-muted-foreground">
                Grow your business with access to customers and reduced commission rates
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {freelancerPlans.map((plan) => (
                <PricingCard key={plan.name} plan={plan} membershipType="freelancer" />
              ))}
            </div>

            {/* Freelancer Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Why Choose Freelancer Membership?</CardTitle>
                <CardDescription>
                  Build your business with access to customers and professional tools
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-4 gap-6">
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">More Orders</h3>
                  <p className="text-sm text-muted-foreground">
                    Access to premium orders and priority placement
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <Crown className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Lower Fees</h3>
                  <p className="text-sm text-muted-foreground">
                    Reduced commission rates as low as 4%
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Pro Tools</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced analytics, marketing tools, and API access
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Dedicated Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Priority support and dedicated account management
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action for Freelancers */}
            <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
              <CardHeader className="text-center">
                <CardTitle className="text-purple-800">Ready to Start Your Freelance Journey?</CardTitle>
                <CardDescription className="text-purple-600">
                  Set up your freelancer profile to start receiving orders automatically
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button asChild size="lg">
                  <a href="/freelancer-profile">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Setup Freelancer Profile
                  </a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MembershipPlans;