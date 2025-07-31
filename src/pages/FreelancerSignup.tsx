import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const FreelancerSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    businessName: '',
    contactPhone: '',
    bio: '',
    serviceAreas: [] as string[],
    servicesOffered: [] as string[],
    hourlyRate: '',
    experienceYears: ''
  });
  const [newServiceArea, setNewServiceArea] = useState('');
  const [newService, setNewService] = useState('');

  const availableServices = [
    'House Cleaning',
    'Office Cleaning',
    'Deep Cleaning',
    'Move-in/Move-out Cleaning',
    'Post-Construction Cleanup',
    'Window Cleaning',
    'Carpet Cleaning',
    'Pressure Washing'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/freelancer`,
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create freelancer profile
        const { error: profileError } = await supabase.from('freelancers').insert({
          user_id: authData.user.id,
          business_name: formData.businessName,
          contact_phone: formData.contactPhone,
          bio: formData.bio,
          service_areas: formData.serviceAreas,
          services_offered: formData.servicesOffered,
          hourly_rate: parseFloat(formData.hourlyRate) || null,
          experience_years: parseInt(formData.experienceYears) || 0,
          verification_status: 'pending',
          is_active: true
        });

        if (profileError) throw profileError;

        toast({
          title: "Registration Successful!",
          description: "Please check your email to verify your account, then you can access your freelancer dashboard.",
        });

        navigate('/auth');
      }
    } catch (error: any) {
      console.error('Error during signup:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addServiceArea = () => {
    if (newServiceArea.trim() && !formData.serviceAreas.includes(newServiceArea.trim())) {
      setFormData(prev => ({
        ...prev,
        serviceAreas: [...prev.serviceAreas, newServiceArea.trim()]
      }));
      setNewServiceArea('');
    }
  };

  const removeServiceArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.filter(a => a !== area)
    }));
  };

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      servicesOffered: prev.servicesOffered.includes(service)
        ? prev.servicesOffered.filter(s => s !== service)
        : [...prev.servicesOffered, service]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Join as a Cleaner</CardTitle>
            <CardDescription>
              Start earning by providing cleaning services in your area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">About Your Business</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell customers about your cleaning business and experience..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Service Areas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Service Areas (Zip Codes)</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter zip code (e.g., 10001)"
                    value={newServiceArea}
                    onChange={(e) => setNewServiceArea(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addServiceArea())}
                  />
                  <Button type="button" onClick={addServiceArea}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.serviceAreas.map((area) => (
                    <Badge key={area} variant="secondary" className="flex items-center gap-1">
                      {area}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeServiceArea(area)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Services Offered */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Services You Offer</h3>
                <div className="grid grid-cols-2 gap-2">
                  {availableServices.map((service) => (
                    <label key={service} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.servicesOffered.includes(service)}
                        onChange={() => toggleService(service)}
                        className="rounded"
                      />
                      <span className="text-sm">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience & Rate */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Experience & Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="experienceYears">Years of Experience</Label>
                    <Input
                      id="experienceYears"
                      type="number"
                      min="0"
                      value={formData.experienceYears}
                      onChange={(e) => setFormData(prev => ({ ...prev, experienceYears: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                      placeholder="e.g., 25.00"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating Account...' : 'Register as Cleaner'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default FreelancerSignup;