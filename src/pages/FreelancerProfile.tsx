import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { MapPin, Briefcase, Star, Plus, Trash2, Save } from 'lucide-react';
import type { User, Session } from '@supabase/supabase-js';

interface FreelancerProfile {
  id: string;
  business_name: string;
  contact_phone: string;
  service_areas: string[];
  services_offered: string[];
  hourly_rate: number;
  rating: number;
  total_jobs: number;
  is_active: boolean;
}

const FreelancerProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [businessName, setBusinessName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number | ''>('');
  const [serviceAreas, setServiceAreas] = useState<string[]>([]);
  const [servicesOffered, setServicesOffered] = useState<string[]>([]);
  const [newZipCode, setNewZipCode] = useState('');
  const [newService, setNewService] = useState('');

  const serviceOptions = [
    'Cleaning of the house and apartment',
    'Deep Cleaning',
    'Office Cleaning',
    'Move in & out Cleaning',
    'Glass and Window Cleaning',
    'Disinfect cleaning',
    'Maid service',
    'Event cleaning',
    'Construction cleaning',
    'Pool Cleaning',
    'Car Cleaning',
    'Laundry and Ironing Service'
  ];

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          loadProfile();
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('freelancers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setBusinessName(data.business_name || '');
        setContactPhone(data.contact_phone || '');
        setHourlyRate(data.hourly_rate || '');
        setServiceAreas(data.service_areas || []);
        setServicesOffered(data.services_offered || []);
      } else {
        // No profile exists, enable editing mode
        setIsEditing(true);
      }
    } catch (error: any) {
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    
    setLoading(true);

    try {
      const profileData = {
        user_id: user.id,
        business_name: businessName,
        contact_phone: contactPhone,
        hourly_rate: hourlyRate ? Number(hourlyRate) : null,
        service_areas: serviceAreas,
        services_offered: servicesOffered,
        is_active: true,
      };

      const { error } = await supabase
        .from('freelancers')
        .upsert(profileData, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: "Profile saved",
        description: "Your freelancer profile has been updated successfully."
      });

      setIsEditing(false);
      loadProfile();
    } catch (error: any) {
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addZipCode = () => {
    if (newZipCode.trim() && !serviceAreas.includes(newZipCode.trim())) {
      setServiceAreas([...serviceAreas, newZipCode.trim()]);
      setNewZipCode('');
    }
  };

  const removeZipCode = (zipCode: string) => {
    setServiceAreas(serviceAreas.filter(z => z !== zipCode));
  };

  const addService = () => {
    if (newService.trim() && !servicesOffered.includes(newService.trim())) {
      setServicesOffered([...servicesOffered, newService.trim()]);
      setNewService('');
    }
  };

  const removeService = (service: string) => {
    setServicesOffered(servicesOffered.filter(s => s !== service));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access your freelancer profile</CardDescription>
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
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Freelancer Profile</h1>
            <p className="text-muted-foreground">Manage your service areas and offerings</p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => {
                  setIsEditing(false);
                  loadProfile();
                }}>
                  Cancel
                </Button>
                <Button onClick={saveProfile} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Profile'}
                </Button>
              </>
            )}
          </div>
        </div>

        {profile && !isEditing && (
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Star className="h-5 w-5" />
                Profile Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-800">{profile.rating || 0}</p>
                <p className="text-sm text-green-600">Rating</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-800">{profile.total_jobs || 0}</p>
                <p className="text-sm text-green-600">Total Jobs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-800">
                  {profile.is_active ? 'Active' : 'Inactive'}
                </p>
                <p className="text-sm text-green-600">Status</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Business Information
              </CardTitle>
              <CardDescription>Your business details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business-name">Business Name</Label>
                <Input
                  id="business-name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  disabled={!isEditing}
                  placeholder="Your business name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Contact Phone</Label>
                <Input
                  id="contact-phone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  disabled={!isEditing}
                  placeholder="Your contact phone number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hourly-rate">Hourly Rate ($)</Label>
                <Input
                  id="hourly-rate"
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value ? Number(e.target.value) : '')}
                  disabled={!isEditing}
                  placeholder="Your hourly rate"
                  min="0"
                  step="0.01"
                />
              </div>
            </CardContent>
          </Card>

          {/* Service Areas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Service Areas
              </CardTitle>
              <CardDescription>Zip codes where you provide services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    value={newZipCode}
                    onChange={(e) => setNewZipCode(e.target.value)}
                    placeholder="Enter zip code"
                    maxLength={10}
                  />
                  <Button onClick={addZipCode} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {serviceAreas.map((zipCode, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {zipCode}
                    {isEditing && (
                      <button
                        onClick={() => removeZipCode(zipCode)}
                        className="ml-1 hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              
              {serviceAreas.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  No service areas added yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Services Offered */}
        <Card>
          <CardHeader>
            <CardTitle>Services Offered</CardTitle>
            <CardDescription>Select the types of services you provide</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing && (
              <>
                <div className="flex gap-2">
                  <Input
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    placeholder="Enter custom service"
                  />
                  <Button onClick={addService} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm font-medium mb-2">Quick Add Common Services:</p>
                  <div className="flex flex-wrap gap-2">
                    {serviceOptions.map((service) => (
                      <Button
                        key={service}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (!servicesOffered.includes(service)) {
                            setServicesOffered([...servicesOffered, service]);
                          }
                        }}
                        disabled={servicesOffered.includes(service)}
                      >
                        {service}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Separator />
              </>
            )}
            
            <div className="flex flex-wrap gap-2">
              {servicesOffered.map((service, index) => (
                <Badge key={index} variant="default" className="flex items-center gap-1">
                  {service}
                  {isEditing && (
                    <button
                      onClick={() => removeService(service)}
                      className="ml-1 hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            
            {servicesOffered.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                No services added yet. Add service areas to start receiving job assignments!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">How Auto-Assignment Works</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <ul className="space-y-2 text-sm">
              <li>• Orders are automatically assigned to freelancers based on customer zip code</li>
              <li>• You'll receive assignments for orders in your service areas</li>
              <li>• Higher-rated freelancers with fewer active jobs get priority</li>
              <li>• Up to 3 freelancers receive each order for competitive bidding</li>
              <li>• Make sure to keep your service areas and offerings up to date</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreelancerProfile;