import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, Receipt, Calendar, Clock, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PaymentSuccess = () => {
  const { toast } = useToast();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const searchParams = new URLSearchParams(window.location.search);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      loadOrderDetails();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const loadOrderDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('stripe_session_id', sessionId)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
      toast({
        title: "Error",
        description: "Unable to load order details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-background flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading order details...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardHeader className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-3xl text-green-800">Payment Successful!</CardTitle>
                <CardDescription className="text-base">
                  Thank you for your booking. We'll be in touch soon to confirm your service.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Order Details */}
                {order && (
                  <div className="border rounded-lg p-4 space-y-4 text-left">
                    <h3 className="font-semibold text-lg text-center">Order Summary</h3>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{order.service_name}</h4>
                        <p className="text-sm text-muted-foreground">{order.service_description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">${(order.amount / 100).toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.duration_hours} hours
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Duration: {order.duration_hours} hours</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Order Date: {new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>Service will be scheduled at your location</span>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">What's Next?</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• You'll receive a confirmation email shortly</li>
                        <li>• Our team will contact you within 24 hours to schedule</li>
                        <li>• A professional cleaner will be assigned to your area</li>
                        <li>• You'll receive cleaner details before the appointment</li>
                      </ul>
                    </div>
                  </div>
                )}
                
                {/* Session ID Reference */}
                {sessionId && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Reference ID:</p>
                    <p className="font-mono text-xs break-all">{sessionId}</p>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link to="/">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Home
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/services">
                      <Receipt className="w-4 h-4 mr-2" />
                      Book Another Service
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;