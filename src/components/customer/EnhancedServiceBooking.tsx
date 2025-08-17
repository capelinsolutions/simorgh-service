import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
// Remove static import - will fetch from database
import { Calendar as CalendarIcon, Clock, MapPin, Plus, CreditCard, Users, Star } from 'lucide-react';

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

interface ServiceAddon {
  id: string;
  name: string;
  description: string;
  price_per_hour: number;
  category: string;
}

interface CustomerAddress {
  id: string;
  label: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  is_default: boolean;
}

interface BookingData {
  serviceId: number;
  duration: number;
  date: Date | undefined;
  time: string;
  addressId: string;
  selectedAddons: string[];
  specialInstructions: string;
  hasMembership: boolean;
}

const EnhancedServiceBooking = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [services_list, setServicesList] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [addons, setAddons] = useState<ServiceAddon[]>([]);
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [bookingData, setBookingData] = useState<BookingData>({
    serviceId: 0,
    duration: 2,
    date: undefined,
    time: '',
    addressId: '',
    selectedAddons: [],
    specialInstructions: '',
    hasMembership: false
  });
  const [loading, setLoading] = useState(false);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '',
    street_address: '',
    city: '',
    state: '',
    zip_code: ''
  });
  const [subscription, setSubscription] = useState<any>(null);
  
  const { toast } = useToast();

  // Time slots for booking
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserData();
      checkSubscription();
    }
  }, [user]);

  useEffect(() => {
    filterServices();
  }, [searchQuery, selectedCategory, services_list]);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('title', { ascending: true });

      if (error) throw error;
      
      setServicesList(data || []);
      setFilteredServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive",
      });
    }
  };

  const loadUserData = async () => {
    if (!user) return;

    // Load user addresses
    const { data: addressData } = await supabase
      .from('customer_addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });

    if (addressData) {
      setAddresses(addressData);
      if (addressData.length > 0) {
        setBookingData(prev => ({ ...prev, addressId: addressData[0].id }));
      }
    }
  };

  const loadAddons = async () => {
    const { data } = await supabase
      .from('service_addons')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true });

    if (data) {
      setAddons(data);
    }
  };

  const checkSubscription = async () => {
    if (!user) return;

    try {
      const { data } = await supabase.functions.invoke('check-subscription');
      if (data) {
        setSubscription(data);
        setBookingData(prev => ({ ...prev, hasMembership: data.subscribed }));
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const filterServices = () => {
    let filtered = services_list;

    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    setFilteredServices(filtered);
  };

  const categories = Array.from(new Set(services_list.map(service => service.category)));

  const handleServiceSelect = (serviceId: number) => {
    setBookingData(prev => ({ ...prev, serviceId }));
    setStep(2);
    loadAddons();
  };

  const calculateTotal = () => {
    const selectedService = services_list.find(s => s.id === bookingData.serviceId);
    if (!selectedService) return 0;

    const basePrice = selectedService.regular_price * 100; // Convert to cents
    const addonTotal = bookingData.selectedAddons.reduce((total, addonId) => {
      const addon = addons.find(a => a.id === addonId);
      return total + (addon ? addon.price_per_hour : 0);
    }, 0);

    const subtotal = (basePrice + addonTotal) * bookingData.duration;
    return bookingData.hasMembership ? Math.round(subtotal * 0.5) : subtotal;
  };

  const handleAddressSubmit = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('customer_addresses')
        .insert({
          user_id: user.id,
          ...newAddress,
          is_default: addresses.length === 0
        })
        .select()
        .single();

      if (error) throw error;

      setAddresses(prev => [...prev, data]);
      setBookingData(prev => ({ ...prev, addressId: data.id }));
      setShowNewAddress(false);
      setNewAddress({ label: '', street_address: '', city: '', state: '', zip_code: '' });
      
      toast({
        title: "Address Added",
        description: "Your new address has been saved successfully.",
      });
    } catch (error) {
      console.error('Error adding address:', error);
      toast({
        title: "Error",
        description: "Failed to add address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBookingSubmit = async () => {
    if (!user || !bookingData.date || !bookingData.time || !bookingData.addressId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const selectedService = services_list.find(s => s.id === bookingData.serviceId);
      const selectedAddress = addresses.find(a => a.id === bookingData.addressId);
      
      if (!selectedService || !selectedAddress) throw new Error('Service or address not found');

      const total = calculateTotal();
      const originalTotal = bookingData.hasMembership ? total * 2 : total;

      console.log('Booking Data:', {
        total,
        originalTotal,
        serviceName: selectedService.title,
        hasMembership: bookingData.hasMembership
      });

      const paymentData = {
        serviceName: selectedService.title,
        serviceDescription: selectedService.description,
        amount: total, // Amount in cents
        isGuest: false,
        customerEmail: user.email,
        zipCode: selectedAddress.zip_code,
        duration_hours: bookingData.duration,
        preferred_date: bookingData.date.toISOString().split('T')[0],
        preferred_time: bookingData.time,
        selected_addons: bookingData.selectedAddons.map(id => {
          const addon = addons.find(a => a.id === id);
          return { id, name: addon?.name, price: addon?.price_per_hour };
        }),
        special_instructions: bookingData.specialInstructions,
        customer_address_id: bookingData.addressId,
        has_membership_discount: bookingData.hasMembership,
        original_amount: originalTotal
      };

      console.log('Payment Data being sent:', paymentData);

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: paymentData
      });

      console.log('Response from create-payment:', { data, error });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        toast({
          title: "Redirecting to Payment",
          description: "Opening Stripe checkout in a new tab...",
        });
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: `There was an error processing your booking: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services_list.find(s => s.id === bookingData.serviceId);

  if (step === 1) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Choose Your Cleaning Service</h1>
          <p className="text-muted-foreground">Browse our 50+ professional cleaning services</p>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Membership Banner */}
        {subscription?.subscribed && (
          <Card className="border-primary bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-primary">
                <Star className="h-5 w-5" />
                <span className="font-semibold">ForeverClean Member - 50% OFF all services!</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{service.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{service.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      {subscription?.subscribed ? (
                        <div>
                          <span className="text-sm text-muted-foreground line-through">
                            ${service.regular_price.toFixed(2)}/hr
                          </span>
                          <div className="text-xl font-bold text-primary">
                            ${service.membership_price.toFixed(2)}/hr
                          </div>
                        </div>
                      ) : (
                        <div className="text-xl font-bold text-foreground">
                          ${service.regular_price.toFixed(2)}/hr
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">Minimum 2 hours</p>
                    </div>
                    <Badge variant="secondary">{service.category}</Badge>
                  </div>
                  
                  <Button 
                    onClick={() => handleServiceSelect(service.id)}
                    className="w-full"
                  >
                    Select Service
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setStep(1)}>
            ← Back to Services
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Book Your Service</h1>
            <p className="text-muted-foreground">{selectedService?.title}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date & Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={bookingData.date}
                    onSelect={(date) => setBookingData(prev => ({ ...prev, date }))}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>
                
                <div>
                  <Label>Select Time</Label>
                  <Select value={bookingData.time} onValueChange={(time) => setBookingData(prev => ({ ...prev, time }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Duration (hours)</Label>
                  <Select value={bookingData.duration.toString()} onValueChange={(duration) => setBookingData(prev => ({ ...prev, duration: parseInt(duration) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[2, 3, 4, 5, 6, 7, 8].map(hours => (
                        <SelectItem key={hours} value={hours.toString()}>{hours} hours</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Service Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {addresses.length > 0 ? (
                  <div>
                    <Label>Select Address</Label>
                    <Select value={bookingData.addressId} onValueChange={(addressId) => setBookingData(prev => ({ ...prev, addressId }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose address" />
                      </SelectTrigger>
                      <SelectContent>
                        {addresses.map(address => (
                          <SelectItem key={address.id} value={address.id}>
                            {address.label} - {address.street_address}, {address.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}

                {!showNewAddress ? (
                  <Button
                    variant="outline"
                    onClick={() => setShowNewAddress(true)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Address
                  </Button>
                ) : (
                  <div className="space-y-4 border rounded-lg p-4">
                    <h4 className="font-medium">Add New Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Label</Label>
                        <Input
                          placeholder="Home, Office, etc."
                          value={newAddress.label}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, label: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>ZIP Code</Label>
                        <Input
                          placeholder="12345"
                          value={newAddress.zip_code}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, zip_code: e.target.value }))}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Street Address</Label>
                        <Input
                          placeholder="123 Main St"
                          value={newAddress.street_address}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, street_address: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>City</Label>
                        <Input
                          placeholder="New York"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>State</Label>
                        <Input
                          placeholder="NY"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddressSubmit}>Save Address</Button>
                      <Button variant="outline" onClick={() => setShowNewAddress(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add-ons */}
            {addons.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Optional Add-ons</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {addons.map(addon => (
                      <div key={addon.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={addon.id}
                          checked={bookingData.selectedAddons.includes(addon.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setBookingData(prev => ({
                                ...prev,
                                selectedAddons: [...prev.selectedAddons, addon.id]
                              }));
                            } else {
                              setBookingData(prev => ({
                                ...prev,
                                selectedAddons: prev.selectedAddons.filter(id => id !== addon.id)
                              }));
                            }
                          }}
                        />
                        <div className="flex-1">
                          <Label htmlFor={addon.id} className="text-sm font-medium">
                            {addon.name} - ${(addon.price_per_hour / 100).toFixed(2)}/hr
                          </Label>
                          <p className="text-xs text-muted-foreground">{addon.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Special Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Special Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Any special requests or instructions for the cleaner..."
                  value={bookingData.specialInstructions}
                  onChange={(e) => setBookingData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">{selectedService?.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {bookingData.duration} hours × ${selectedService?.regular_price || 0}/hr
                  </p>
                  <p className="font-medium">
                    ${((selectedService?.regular_price || 0) * bookingData.duration).toFixed(2)}
                  </p>
                </div>

                {bookingData.selectedAddons.length > 0 && (
                  <div>
                    <h5 className="font-medium text-sm">Add-ons</h5>
                    {bookingData.selectedAddons.map(addonId => {
                      const addon = addons.find(a => a.id === addonId);
                      return addon ? (
                        <div key={addon.id} className="text-sm text-muted-foreground">
                          {addon.name}: ${((addon.price_per_hour * bookingData.duration) / 100).toFixed(2)}
                        </div>
                      ) : null;
                    })}
                  </div>
                )}

                {bookingData.hasMembership && (
                  <div className="text-primary">
                    <p className="text-sm font-medium">ForeverClean Discount (50% OFF)</p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold">${(calculateTotal() / 100).toFixed(2)}</span>
                  </div>
                  {bookingData.hasMembership && (
                    <p className="text-xs text-muted-foreground">
                      Original price: ${(calculateTotal() * 2 / 100).toFixed(2)}
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleBookingSubmit}
                  disabled={loading || !bookingData.date || !bookingData.time || !bookingData.addressId}
                  className="w-full"
                >
                  {loading ? (
                    "Processing..."
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Book & Pay ${(calculateTotal() / 100).toFixed(2)}
                    </>
                  )}
                </Button>

                {!subscription?.subscribed && (
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-2">
                      Save 50% with ForeverClean membership
                    </p>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/membership'}>
                      <Users className="h-4 w-4 mr-2" />
                      View Plans
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default EnhancedServiceBooking;