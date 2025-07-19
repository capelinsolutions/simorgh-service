import React, { useState } from 'react';
import { services, locations } from '@/data/services';
import { Calendar, MapPin, Clock, User, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BookingData {
  serviceId: number;
  date: string;
  time: string;
  duration: number;
  location: string;
  address: string;
  zipCode: string;
  specialInstructions: string;
  hasMembership: boolean;
}

const ServiceBooking = () => {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [bookingData, setBookingData] = useState<BookingData>({
    serviceId: 0,
    date: '',
    time: '',
    duration: 2,
    location: '',
    address: '',
    zipCode: '',
    specialInstructions: '',
    hasMembership: false
  });
  const [step, setStep] = useState(1);

  const selectedServiceData = selectedService ? services.find(s => s.id === selectedService) : null;
  const pricePerHour = selectedServiceData ? 
    (bookingData.hasMembership ? selectedServiceData.membershipPrice : selectedServiceData.regularPrice) : 0;
  const totalPrice = pricePerHour * bookingData.duration;

  const handleServiceSelect = (serviceId: number) => {
    setSelectedService(serviceId);
    setBookingData(prev => ({ ...prev, serviceId }));
    setStep(2);
  };

  const handleBookingSubmit = () => {
    setStep(3); // Move to payment step
  };

  const handlePayment = () => {
    // Payment processing will be implemented here
    console.log('Processing payment for:', bookingData);
    alert('Payment integration coming next!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className={`flex items-center ${step >= 1 ? 'text-[#58C0D7]' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-[#58C0D7] text-white' : 'bg-gray-200'}`}>1</div>
          <span className="ml-2">Select Service</span>
        </div>
        <div className="w-16 h-px bg-gray-300"></div>
        <div className={`flex items-center ${step >= 2 ? 'text-[#58C0D7]' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-[#58C0D7] text-white' : 'bg-gray-200'}`}>2</div>
          <span className="ml-2">Book Details</span>
        </div>
        <div className="w-16 h-px bg-gray-300"></div>
        <div className={`flex items-center ${step >= 3 ? 'text-[#58C0D7]' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-[#58C0D7] text-white' : 'bg-gray-200'}`}>3</div>
          <span className="ml-2">Payment</span>
        </div>
      </div>

      {/* Step 1: Service Selection */}
      {step === 1 && (
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Select a Service</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 12).map((service) => (
              <Card key={service.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleServiceSelect(service.id)}>
                <CardContent className="p-4">
                  <img src={service.image} alt={service.title} className="w-full h-32 object-cover rounded-lg mb-4" />
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{service.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-[#58C0D7]">${service.membershipPrice}/h</span>
                    <span className="text-sm text-gray-500 line-through">${service.regularPrice}/h</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
                  <Button className="w-full bg-[#58C0D7] hover:bg-[#4aa8c0]">
                    Select Service
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Booking Details */}
      {step === 2 && selectedServiceData && (
        <div>
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => setStep(1)}>← Back to Services</Button>
            <h1 className="text-2xl font-bold text-gray-900">Book: {selectedServiceData.title}</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Booking Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Date & Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Preferred Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={bookingData.date}
                        onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Preferred Time</Label>
                      <Select onValueChange={(value) => setBookingData(prev => ({ ...prev, time: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="08:00">8:00 AM</SelectItem>
                          <SelectItem value="09:00">9:00 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="11:00">11:00 AM</SelectItem>
                          <SelectItem value="12:00">12:00 PM</SelectItem>
                          <SelectItem value="13:00">1:00 PM</SelectItem>
                          <SelectItem value="14:00">2:00 PM</SelectItem>
                          <SelectItem value="15:00">3:00 PM</SelectItem>
                          <SelectItem value="16:00">4:00 PM</SelectItem>
                          <SelectItem value="17:00">5:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (hours)</Label>
                    <Select onValueChange={(value) => setBookingData(prev => ({ ...prev, duration: parseInt(value) }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="2">2 hours</SelectItem>
                        <SelectItem value="3">3 hours</SelectItem>
                        <SelectItem value="4">4 hours</SelectItem>
                        <SelectItem value="6">6 hours</SelectItem>
                        <SelectItem value="8">8 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="location">City/Area</Label>
                    <Select onValueChange={(value) => setBookingData(prev => ({ ...prev, location: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location.toLowerCase()}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="address">Full Address</Label>
                    <Input
                      id="address"
                      placeholder="Enter complete address"
                      value={bookingData.address}
                      onChange={(e) => setBookingData(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="Enter ZIP code"
                      value={bookingData.zipCode}
                      onChange={(e) => setBookingData(prev => ({ ...prev, zipCode: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="instructions">Special Instructions</Label>
                    <Textarea
                      id="instructions"
                      placeholder="Any special requirements or instructions..."
                      value={bookingData.specialInstructions}
                      onChange={(e) => setBookingData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="membership"
                      checked={bookingData.hasMembership}
                      onChange={(e) => setBookingData(prev => ({ ...prev, hasMembership: e.target.checked }))}
                      className="w-4 h-4 text-[#58C0D7] border-gray-300 rounded"
                    />
                    <Label htmlFor="membership">I have a membership (save up to 50%)</Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Price Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Booking Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span className="font-medium">{selectedServiceData.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{bookingData.duration} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate per hour:</span>
                      <span>${pricePerHour}</span>
                    </div>
                    {bookingData.hasMembership && (
                      <div className="flex justify-between text-green-600">
                        <span>Membership savings:</span>
                        <span>-${(selectedServiceData.regularPrice - selectedServiceData.membershipPrice) * bookingData.duration}</span>
                      </div>
                    )}
                    <hr />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-[#58C0D7] hover:bg-[#4aa8c0]" 
                    onClick={handleBookingSubmit}
                    disabled={!bookingData.date || !bookingData.time || !bookingData.location || !bookingData.address}
                  >
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && selectedServiceData && (
        <div>
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => setStep(2)}>← Back to Details</Button>
            <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-medium">{selectedServiceData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date & Time:</span>
                    <span>{bookingData.date} at {bookingData.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{bookingData.duration} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span>{bookingData.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Address:</span>
                    <span>{bookingData.address}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total Amount:</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-[#58C0D7] hover:bg-[#4aa8c0] h-12 text-lg" 
                  onClick={handlePayment}
                >
                  Pay ${totalPrice} with Stripe
                </Button>
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Secure payment processing powered by Stripe
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceBooking;