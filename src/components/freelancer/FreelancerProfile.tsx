import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  MapPin, 
  Clock, 
  Star, 
  Upload, 
  FileText, 
  DollarSign,
  Shield,
  Camera,
  Plus,
  X,
  CheckCircle
} from 'lucide-react';

interface FreelancerProfile {
  id: string;
  user_id: string;
  business_name: string;
  bio: string;
  experience_years: number;
  hourly_rate: number;
  contact_phone: string;
  services_offered: string[];
  service_areas: string[];
  availability: any;
  certifications: string[];
  profile_image_url: string;
  verification_status: string;
  documents: any[];
  is_active: boolean;
  rating: number;
  total_jobs: number;
  stripe_account_id: string;
}

const AVAILABLE_SERVICES = [
  'Regular Cleaning',
  'Deep Cleaning', 
  'Move-in/Move-out Cleaning',
  'Post-Construction Cleaning',
  'Office Cleaning',
  'Carpet Cleaning',
  'Window Cleaning',
  'Apartment Cleaning',
  'House Cleaning'
];

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const FreelancerProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newZipCode, setNewZipCode] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [connectingStripe, setConnectingStripe] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('freelancers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // No profile exists, create a new one
        const { data: newProfile, error: createError } = await supabase
          .from('freelancers')
          .insert({
            user_id: user.id,
            business_name: '',
            bio: '',
            experience_years: 0,
            hourly_rate: 25,
            contact_phone: '',
            services_offered: [],
            service_areas: [],
            availability: {
              Monday: { available: false, hours: { start: '09:00', end: '17:00' } },
              Tuesday: { available: false, hours: { start: '09:00', end: '17:00' } },
              Wednesday: { available: false, hours: { start: '09:00', end: '17:00' } },
              Thursday: { available: false, hours: { start: '09:00', end: '17:00' } },
              Friday: { available: false, hours: { start: '09:00', end: '17:00' } },
              Saturday: { available: false, hours: { start: '09:00', end: '17:00' } },
              Sunday: { available: false, hours: { start: '09:00', end: '17:00' } }
            },
            certifications: [],
            verification_status: 'pending',
            documents: [],
            is_active: false
          })
          .select()
          .single();

        if (createError) throw createError;
        setProfile({
          ...newProfile,
          documents: Array.isArray(newProfile.documents) ? newProfile.documents : [],
          stripe_account_id: newProfile.stripe_account_id || ''
        });
      } else if (error) {
        throw error;
      } else {
        setProfile({
          ...data,
          documents: Array.isArray(data.documents) ? data.documents : [],
          stripe_account_id: data.stripe_account_id || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile || !user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('freelancers')
        .update({
          business_name: profile.business_name,
          bio: profile.bio,
          experience_years: profile.experience_years,
          hourly_rate: profile.hourly_rate,
          contact_phone: profile.contact_phone,
          services_offered: profile.services_offered,
          service_areas: profile.service_areas,
          availability: profile.availability,
          certifications: profile.certifications,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/profile.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('cleaner-documents')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('cleaner-documents')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('freelancers')
        .update({ profile_image_url: urlData.publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setProfile(prev => prev ? { ...prev, profile_image_url: urlData.publicUrl } : null);

      toast({
        title: "Image Uploaded",
        description: "Profile image has been updated successfully.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user || !profile) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/documents/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('cleaner-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('cleaner-documents')
        .getPublicUrl(fileName);

      const newDocument = {
        name: file.name,
        url: urlData.publicUrl,
        uploaded_at: new Date().toISOString(),
        type: file.type
      };

      const updatedDocuments = [...profile.documents, newDocument];

      const { error: updateError } = await supabase
        .from('freelancers')
        .update({ documents: updatedDocuments })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setProfile(prev => prev ? { ...prev, documents: updatedDocuments } : null);

      toast({
        title: "Document Uploaded",
        description: "Document has been uploaded successfully.",
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleStripeConnect = async () => {
    setConnectingStripe(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-connect-account');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
        toast({
          title: "Stripe Connect",
          description: "Opening Stripe Connect setup in a new tab.",
        });
      }
    } catch (error) {
      console.error('Error connecting to Stripe:', error);
      toast({
        title: "Error",
        description: "Failed to connect to Stripe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConnectingStripe(false);
    }
  };

  const addZipCode = () => {
    if (!newZipCode.trim() || !profile) return;
    
    const zipCode = newZipCode.trim();
    const serviceAreas = profile.service_areas || [];
    if (serviceAreas.includes(zipCode)) return;

    setProfile(prev => prev ? {
      ...prev,
      service_areas: [...serviceAreas, zipCode]
    } : null);
    setNewZipCode('');
  };

  const removeZipCode = (zipCode: string) => {
    setProfile(prev => prev ? {
      ...prev,
      service_areas: (prev.service_areas || []).filter(zip => zip !== zipCode)
    } : null);
  };

  const addCertification = () => {
    if (!newCertification.trim() || !profile) return;
    
    const cert = newCertification.trim();
    const certifications = profile.certifications || [];
    if (certifications.includes(cert)) return;

    setProfile(prev => prev ? {
      ...prev,
      certifications: [...certifications, cert]
    } : null);
    setNewCertification('');
  };

  const removeCertification = (cert: string) => {
    setProfile(prev => prev ? {
      ...prev,
      certifications: (prev.certifications || []).filter(c => c !== cert)
    } : null);
  };

  const toggleService = (service: string) => {
    setProfile(prev => {
      if (!prev) return null;
      
      const servicesOffered = prev.services_offered || [];
      const services = servicesOffered.includes(service)
        ? servicesOffered.filter(s => s !== service)
        : [...servicesOffered, service];
      
      return { ...prev, services_offered: services };
    });
  };

  const updateAvailability = (day: string, field: string, value: any) => {
    setProfile(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        availability: {
          ...prev.availability,
          [day]: {
            ...prev.availability[day],
            [field]: value
          }
        }
      };
    });
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><X className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">Not Verified</Badge>;
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Please log in to view your profile.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Failed to load profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your cleaner profile and preferences</p>
        </div>
        <div className="flex items-center gap-2">
          {getVerificationBadge(profile.verification_status)}
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Profile Image & Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {profile.profile_image_url ? (
                  <img 
                    src={profile.profile_image_url} 
                    alt="Profile" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Camera className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90">
                <Upload className="h-3 w-3" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="business_name">Business Name</Label>
                  <Input
                    id="business_name"
                    value={profile.business_name}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, business_name: e.target.value } : null)}
                    placeholder="Your cleaning business name"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_phone">Phone Number</Label>
                  <Input
                    id="contact_phone"
                    value={profile.contact_phone}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, contact_phone: e.target.value } : null)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => prev ? { ...prev, bio: e.target.value } : null)}
                  placeholder="Tell customers about your experience and what makes you special..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Experience & Rates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Experience & Pricing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="experience_years">Years of Experience</Label>
              <Input
                id="experience_years"
                type="number"
                min="0"
                value={profile.experience_years}
                onChange={(e) => setProfile(prev => prev ? { ...prev, experience_years: parseInt(e.target.value) || 0 } : null)}
              />
            </div>
            <div>
              <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
              <Input
                id="hourly_rate"
                type="number"
                min="0"
                step="0.01"
                value={profile.hourly_rate}
                onChange={(e) => setProfile(prev => prev ? { ...prev, hourly_rate: parseFloat(e.target.value) || 0 } : null)}
              />
            </div>
            <div>
              <Label>Rating</Label>
              <div className="flex items-center gap-2 pt-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{profile.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({profile.total_jobs} jobs)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Offered */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Services Offered
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {AVAILABLE_SERVICES.map((service) => (
              <div key={service} className="flex items-center space-x-2">
                <Checkbox
                  id={service}
                  checked={profile.services_offered?.includes(service) || false}
                  onCheckedChange={() => toggleService(service)}
                />
                <Label htmlFor={service} className="text-sm">{service}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Service Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Service Areas (ZIP Codes)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newZipCode}
              onChange={(e) => setNewZipCode(e.target.value)}
              placeholder="Enter ZIP code"
              onKeyPress={(e) => e.key === 'Enter' && addZipCode()}
            />
            <Button onClick={addZipCode} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.service_areas && Array.isArray(profile.service_areas) ? (
              profile.service_areas.map((zipCode) => (
                <Badge key={zipCode} variant="outline" className="flex items-center gap-1">
                  {zipCode}
                  <button onClick={() => removeZipCode(zipCode)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No service areas added yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Availability
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="flex items-center gap-4">
              <div className="w-24">
                <Checkbox
                  checked={profile.availability[day]?.available || false}
                  onCheckedChange={(checked) => updateAvailability(day, 'available', checked)}
                />
                <Label className="ml-2">{day}</Label>
              </div>
              {profile.availability[day]?.available && (
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={profile.availability[day]?.hours?.start || '09:00'}
                    onChange={(e) => updateAvailability(day, 'hours', {
                      ...profile.availability[day]?.hours,
                      start: e.target.value
                    })}
                    className="w-24"
                  />
                  <span>to</span>
                  <Input
                    type="time"
                    value={profile.availability[day]?.hours?.end || '17:00'}
                    onChange={(e) => updateAvailability(day, 'hours', {
                      ...profile.availability[day]?.hours,
                      end: e.target.value
                    })}
                    className="w-24"
                  />
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Certifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              placeholder="Enter certification name"
              onKeyPress={(e) => e.key === 'Enter' && addCertification()}
            />
            <Button onClick={addCertification} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.certifications && Array.isArray(profile.certifications) ? (
              profile.certifications.map((cert) => (
                <Badge key={cert} variant="outline" className="flex items-center gap-1">
                  {cert}
                  <button onClick={() => removeCertification(cert)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No certifications added yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents & Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="document-upload">Upload Documents (Certifications, Resume, etc.)</Label>
            <div className="mt-2">
              <label className="flex items-center gap-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 hover:border-muted-foreground/50 cursor-pointer">
                <Upload className="h-5 w-5" />
                <span>Click to upload documents</span>
                <input
                  id="document-upload"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleDocumentUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>
          
          {profile.documents && profile.documents.length > 0 && (
            <div className="space-y-2">
              <Label>Uploaded Documents</Label>
              {profile.documents.map((doc, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <FileText className="h-4 w-4" />
                  <span className="flex-1">{doc.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(doc.uploaded_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stripe Connect */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Setup
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profile.stripe_account_id ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Stripe account connected</span>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Connect your Stripe account to receive payments for completed jobs.
              </p>
              <Button 
                onClick={handleStripeConnect}
                disabled={connectingStripe}
                variant="outline"
              >
                {connectingStripe ? 'Connecting...' : 'Connect Stripe Account'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FreelancerProfile;