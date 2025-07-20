import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { services, Service } from '@/data/services';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ShoppingCart, CreditCard, User, Mail, MessageCircle } from 'lucide-react';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

const ServiceBooking = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);
  const [filteredServices, setFilteredServices] = useState(services);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(services.map(s => s.category).filter(Boolean)))];

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = services;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredServices(filtered);
  }, [searchQuery, selectedCategory]);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
  };

  const handleBookService = async () => {
    if (!selectedService) return;
    
    if (!user && !isGuest) {
      toast({
        title: "Authentication required",
        description: "Please sign in or continue as guest to book a service.",
        variant: "destructive"
      });
      return;
    }

    if (isGuest && !guestEmail) {
      toast({
        title: "Email required",
        description: "Please provide your email address.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          serviceName: selectedService.title,
          serviceDescription: `${selectedService.description}${specialRequests ? ` - Special requests: ${specialRequests}` : ''}`,
          amount: selectedService.regularPrice * 100, // Convert to cents
          isGuest,
          customerEmail: isGuest ? guestEmail : user?.email,
        },
        headers: session ? {
          Authorization: `Bearer ${session.access_token}`,
        } : undefined,
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
        title: "Booking failed",
        description: error.message || "Failed to create payment session",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Book a Service</h1>
          <p className="text-xl text-muted-foreground">Choose from our wide range of professional services</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Services Grid */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              {filteredServices.map((service) => (
                <Card 
                  key={service.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedService?.id === service.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleServiceSelect(service)}
                >
                  <CardHeader className="p-4">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-32 object-cover rounded-md mb-3"
                    />
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <CardDescription className="text-sm">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-primary">${service.regularPrice}</p>
                        <p className="text-sm text-muted-foreground">
                          Member: ${service.membershipPrice}
                        </p>
                      </div>
                      {service.category && (
                        <Badge variant="secondary" className="text-xs">
                          {service.category}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Booking Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Book Service
                </CardTitle>
                <CardDescription>
                  {selectedService ? 'Complete your booking' : 'Select a service to continue'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedService ? (
                  <>
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-semibold">{selectedService.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedService.description}
                      </p>
                      <p className="text-2xl font-bold text-primary mt-2">
                        ${selectedService.regularPrice}
                      </p>
                    </div>

                    {!user && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="guest-checkout"
                            checked={isGuest}
                            onChange={(e) => setIsGuest(e.target.checked)}
                            className="rounded"
                          />
                          <Label htmlFor="guest-checkout" className="text-sm">
                            Continue as guest
                          </Label>
                        </div>
                        
                        {isGuest && (
                          <div className="space-y-2">
                            <Label htmlFor="guest-email">Email Address</Label>
                            <Input
                              id="guest-email"
                              type="email"
                              placeholder="your@email.com"
                              value={guestEmail}
                              onChange={(e) => setGuestEmail(e.target.value)}
                              required
                            />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="special-requests">
                        <MessageCircle className="h-4 w-4 inline mr-1" />
                        Special Requests (Optional)
                      </Label>
                      <Textarea
                        id="special-requests"
                        placeholder="Any special instructions or requests..."
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <Button
                      onClick={handleBookService}
                      disabled={loading || (!user && (!isGuest || !guestEmail))}
                      className="w-full"
                      size="lg"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      {loading ? 'Processing...' : `Book for $${selectedService.regularPrice}`}
                    </Button>

                    {!user && !isGuest && (
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">
                          Have an account?
                        </p>
                        <Button variant="outline" asChild>
                          <a href="/auth">
                            <User className="h-4 w-4 mr-2" />
                            Sign In
                          </a>
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a service from the list to start booking</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceBooking;