import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Clock, Star, CheckCircle, MapPin, ArrowLeft, Calendar } from 'lucide-react';

interface Service {
  id: number;
  title: string;
  description: string;
  regular_price: number;
  membership_price: number;
  image_url: string;
  category: string;
  is_active: boolean;
}

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadService();
    }
  }, [id]);

  const loadService = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', parseInt(id!))
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setService(data);
    } catch (error) {
      console.error('Error loading service:', error);
      toast({
        title: "Error",
        description: "Service not found or unavailable",
        variant: "destructive",
      });
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    navigate(`/service-booking?selectedService=${id}`);
  };

  if (loading) {
    return (
      <div className="bg-background flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading service details...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="bg-background flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-foreground">Service Not Found</h1>
            <Button onClick={() => navigate('/services')}>
              Back to Services
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const features = [
    "Professional certified cleaners",
    "Eco-friendly cleaning products",
    "100% satisfaction guarantee", 
    "Fully insured and bonded",
    "Flexible scheduling",
    "Same-day availability"
  ];

  const savings = service.regular_price - service.membership_price;
  const savingsPercentage = Math.round((savings / service.regular_price) * 100);

  return (
    <div className="bg-background flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/services')}
                className="mb-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All Services
              </Button>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div>
                    <Badge variant="secondary" className="mb-4">
                      {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                    </Badge>
                    <h1 className="text-4xl font-bold text-foreground mb-4">
                      {service.title}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-primary">
                      <Star className="h-5 w-5 fill-current" />
                      <Star className="h-5 w-5 fill-current" />
                      <Star className="h-5 w-5 fill-current" />
                      <Star className="h-5 w-5 fill-current" />
                      <Star className="h-5 w-5 fill-current" />
                      <span className="ml-2 text-foreground">4.9 (124 reviews)</span>
                    </div>
                  </div>
                </div>
                
                <div className="lg:justify-self-end">
                  <img
                    src={service.image_url || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80"}
                    alt={service.title}
                    className="rounded-lg shadow-lg w-full max-w-md object-cover aspect-[4/3]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* What's Included */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        What's Included
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <CheckCircle className="h-4 w-4 text-primary" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* How It Works */}
                  <Card>
                    <CardHeader>
                      <CardTitle>How It Works</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                            1
                          </div>
                          <div>
                            <h4 className="font-semibold">Book Online</h4>
                            <p className="text-sm text-muted-foreground">Select your preferred date and time</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                            2
                          </div>
                          <div>
                            <h4 className="font-semibold">We Match You</h4>
                            <p className="text-sm text-muted-foreground">Professional cleaner assigned to your area</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                            3
                          </div>
                          <div>
                            <h4 className="font-semibold">Relax & Enjoy</h4>
                            <p className="text-sm text-muted-foreground">Sit back while we make your space sparkle</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Sidebar - Booking Card */}
                <div className="space-y-6">
                  <Card className="sticky top-6">
                    <CardHeader>
                      <CardTitle className="text-center">Book This Service</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Pricing */}
                      <div className="text-center space-y-2">
                        <div className="text-3xl font-bold text-foreground">
                          ${service.regular_price}/hr
                        </div>
                        <p className="text-sm text-muted-foreground">Minimum 2 hours</p>
                        
                        {/* Membership Savings */}
                        <div className="bg-primary/10 rounded-lg p-3 space-y-2">
                          <div className="text-primary font-semibold">
                            💎 Member Price: ${service.membership_price}/hr
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Save ${savings}/hr ({savingsPercentage}% off) with membership
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Service Details */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Duration
                          </span>
                          <span>2-6 hours</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Service Area
                          </span>
                          <span>Local</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Availability
                          </span>
                          <span>Same day</span>
                        </div>
                      </div>

                      <Button 
                        onClick={handleBookNow}
                        className="w-full"
                        size="lg"
                      >
                        Book Now
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        100% satisfaction guaranteed or your money back
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetail;