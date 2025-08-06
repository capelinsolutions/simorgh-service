import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, Upload, X, FileText, Award, MapPin, Clock, DollarSign, User, Building2 } from 'lucide-react';
import { services } from '@/data/services';

const FreelancerSignup = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal & Business Info
    businessName: '',
    contactPhone: '',
    bio: '',
    experienceYears: 0,
    hourlyRate: 25,
    
    // Service Areas (ZIP codes)
    serviceAreas: [''],
    
    // Services Offered
    servicesOffered: [] as string[],
    
    // Availability
    availability: {
      monday: { available: false, startTime: '09:00', endTime: '17:00' },
      tuesday: { available: false, startTime: '09:00', endTime: '17:00' },
      wednesday: { available: false, startTime: '09:00', endTime: '17:00' },
      thursday: { available: false, startTime: '09:00', endTime: '17:00' },
      friday: { available: false, startTime: '09:00', endTime: '17:00' },
      saturday: { available: false, startTime: '09:00', endTime: '17:00' },
      sunday: { available: false, startTime: '09:00', endTime: '17:00' },
    },
    
    // Certifications & Documents
    certifications: [''],
    documents: [] as File[],
  });

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Authentication required",
        description: "Please sign up first to apply as a cleaner.",
        variant: "destructive"
      });
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addServiceArea = () => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: [...prev.serviceAreas, '']
    }));
  };

  const removeServiceArea = (index: number) => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.filter((_, i) => i !== index)
    }));
  };

  const updateServiceArea = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.map((area, i) => i === index ? value : area)
    }));
  };

  const toggleService = (serviceName: string) => {
    setFormData(prev => ({
      ...prev,
      servicesOffered: prev.servicesOffered.includes(serviceName)
        ? prev.servicesOffered.filter(s => s !== serviceName)
        : [...prev.servicesOffered, serviceName]
    }));
  };

  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, '']
    }));
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const updateCertification = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => i === index ? value : cert)
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type === 'application/pdf' || file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      
      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: "Please upload only PDF or image files.",
          variant: "destructive"
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: "File too large",
          description: "Please upload files smaller than 5MB.",
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });

    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...validFiles]
    }));
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const updateAvailability = (day: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to apply.",
        variant: "destructive"
      });
      return;
    }

    if (formData.servicesOffered.length === 0) {
      toast({
        title: "Services required",
        description: "Please select at least one service you can provide.",
        variant: "destructive"
      });
      return;
    }

    if (formData.serviceAreas.filter(area => area.trim()).length === 0) {
      toast({
        title: "Service areas required",
        description: "Please add at least one ZIP code where you can provide services.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Upload documents to Supabase storage if any
      let documentUrls: string[] = [];
      if (formData.documents.length > 0) {
        for (const doc of formData.documents) {
          const fileName = `${user.id}/${Date.now()}_${doc.name}`;
          const { data, error } = await supabase.storage
            .from('cleaner-documents')
            .upload(fileName, doc);
          
          if (error) throw error;
          documentUrls.push(data.path);
        }
      }

      // Create freelancer profile
      const { error } = await supabase
        .from('freelancers')
        .insert({
          user_id: user.id,
          business_name: formData.businessName,
          contact_phone: formData.contactPhone,
          bio: formData.bio,
          experience_years: formData.experienceYears,
          hourly_rate: formData.hourlyRate,
          service_areas: formData.serviceAreas.filter(area => area.trim()),
          services_offered: formData.servicesOffered,
          availability: formData.availability,
          certifications: formData.certifications.filter(cert => cert.trim()),
          documents: documentUrls,
          verification_status: 'pending',
          is_active: false // Will be activated after admin approval
        });

      if (error) throw error;

      toast({
        title: "Application submitted!",
        description: "Your cleaner application has been submitted for review. You'll be notified once approved.",
      });

      navigate('/freelancer');
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto p-6 pt-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Our Cleaning Team</h1>
          <p className="text-gray-600 mb-4">Complete your application to start earning with Simorgh</p>
          
          {/* Progress Steps */}
          <div className="flex justify-center items-center space-x-2 mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-[#58C0D7] text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step < currentStep ? 'bg-[#58C0D7]' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 1 && <><User className="h-5 w-5" /> Personal & Business Information</>}
              {currentStep === 2 && <><MapPin className="h-5 w-5" /> Service Areas & Offerings</>}
              {currentStep === 3 && <><Clock className="h-5 w-5" /> Availability & Rates</>}
              {currentStep === 4 && <><Award className="h-5 w-5" /> Certifications & Documents</>}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about yourself and your cleaning business"}
              {currentStep === 2 && "Where do you serve and what services do you offer?"}
              {currentStep === 3 && "Set your schedule and pricing"}
              {currentStep === 4 && "Upload your certifications and documents (optional)"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: Personal & Business Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      placeholder="Your Cleaning Service"
                      value={formData.businessName}
                      onChange={(e) => updateFormData('businessName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone *</Label>
                    <Input
                      id="contactPhone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.contactPhone}
                      onChange={(e) => updateFormData('contactPhone', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio *</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell customers about your experience, specialties, and what makes you stand out..."
                    value={formData.bio}
                    onChange={(e) => updateFormData('bio', e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Select onValueChange={(value) => updateFormData('experienceYears', parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Less than 1 year</SelectItem>
                      <SelectItem value="1">1 year</SelectItem>
                      <SelectItem value="2">2 years</SelectItem>
                      <SelectItem value="3">3 years</SelectItem>
                      <SelectItem value="4">4 years</SelectItem>
                      <SelectItem value="5">5+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Service Areas & Offerings */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-4 block">Service Areas (ZIP Codes) *</Label>
                  <p className="text-sm text-gray-600 mb-4">Add ZIP codes where you can provide services</p>
                  {formData.serviceAreas.map((area, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <Input
                        placeholder="Enter ZIP code (e.g., 10001)"
                        value={area}
                        onChange={(e) => updateServiceArea(index, e.target.value)}
                        className="flex-1"
                      />
                      {formData.serviceAreas.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeServiceArea(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addServiceArea} className="mt-2">
                    Add ZIP Code
                  </Button>
                </div>

                <div>
                  <Label className="text-base font-medium mb-4 block">Services You Offer *</Label>
                  <p className="text-sm text-gray-600 mb-4">Select all services you can provide</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {services.map((service, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={service}
                          checked={formData.servicesOffered.includes(service)}
                          onCheckedChange={() => toggleService(service)}
                        />
                        <Label htmlFor={service} className="text-sm">
                          {service}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {formData.servicesOffered.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Selected services:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.servicesOffered.map((service) => (
                          <Badge key={service} variant="outline">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Availability & Rates */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Hourly Rate (USD) *
                  </Label>
                  <Input
                    type="number"
                    min="15"
                    max="100"
                    step="0.50"
                    value={formData.hourlyRate}
                    onChange={(e) => updateFormData('hourlyRate', parseFloat(e.target.value))}
                    placeholder="25.00"
                  />
                  <p className="text-xs text-gray-500">Recommended: $20-$40 per hour</p>
                </div>

                <div>
                  <Label className="text-base font-medium mb-4 block">Weekly Availability</Label>
                  <p className="text-sm text-gray-600 mb-4">Set your working hours for each day</p>
                  <div className="space-y-4">
                    {Object.entries(formData.availability).map(([day, schedule]) => (
                      <div key={day} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="w-20">
                          <Checkbox
                            checked={schedule.available}
                            onCheckedChange={(checked) => updateAvailability(day, 'available', checked)}
                          />
                          <Label className="ml-2 capitalize">{day}</Label>
                        </div>
                        {schedule.available && (
                          <div className="flex items-center gap-2">
                            <Input
                              type="time"
                              value={schedule.startTime}
                              onChange={(e) => updateAvailability(day, 'startTime', e.target.value)}
                              className="w-32"
                            />
                            <span>to</span>
                            <Input
                              type="time"
                              value={schedule.endTime}
                              onChange={(e) => updateAvailability(day, 'endTime', e.target.value)}
                              className="w-32"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Certifications & Documents */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-4 block">Certifications (Optional)</Label>
                  <p className="text-sm text-gray-600 mb-4">List any relevant certifications you have</p>
                  {formData.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <Input
                        placeholder="e.g., ISSA Cleaning Certification"
                        value={cert}
                        onChange={(e) => updateCertification(index, e.target.value)}
                        className="flex-1"
                      />
                      {formData.certifications.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeCertification(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addCertification} className="mt-2">
                    Add Certification
                  </Button>
                </div>

                <div>
                  <Label className="text-base font-medium mb-4 block">Supporting Documents (Optional)</Label>
                  <p className="text-sm text-gray-600 mb-4">Upload certifications, insurance, or other relevant documents (PDF or images, max 5MB each)</p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Click to upload or drag and drop files here
                    </p>
                    <Input
                      type="file"
                      multiple
                      accept=".pdf,image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <Button type="button" variant="outline">
                        Choose Files
                      </Button>
                    </Label>
                  </div>

                  {formData.documents.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Uploaded files:</p>
                      <div className="space-y-2">
                        {formData.documents.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{file.name}</span>
                              <span className="text-xs text-gray-500">
                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDocument(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && (!formData.businessName || !formData.contactPhone || !formData.bio)) ||
                    (currentStep === 2 && (formData.servicesOffered.length === 0 || formData.serviceAreas.filter(a => a.trim()).length === 0))
                  }
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-[#58C0D7] hover:bg-[#4aa8c0]"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </div>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreelancerSignup;