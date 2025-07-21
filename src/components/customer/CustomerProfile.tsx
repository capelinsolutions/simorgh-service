import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Phone, Mail, MapPin, Plus, Edit3, Trash2 } from 'lucide-react';

interface CustomerProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  profile_image_url: string;
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

const CustomerProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    phone: ''
  });

  const [addressForm, setAddressForm] = useState({
    label: '',
    street_address: '',
    city: '',
    state: '',
    zip_code: ''
  });

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
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    // Load profile
    const { data: profileData } = await supabase
      .from('customer_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
      setProfileForm({
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        phone: profileData.phone || ''
      });
    }

    // Load addresses
    const { data: addressData } = await supabase
      .from('customer_addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });

    if (addressData) {
      setAddresses(addressData);
    }
  };

  const handleProfileSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('customer_profiles')
        .upsert({
          user_id: user.id,
          ...profileForm,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      setEditingProfile(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSave = async (addressId?: string) => {
    if (!user) return;

    setLoading(true);
    try {
      if (addressId) {
        // Update existing address
        const { data, error } = await supabase
          .from('customer_addresses')
          .update({
            ...addressForm,
            updated_at: new Date().toISOString()
          })
          .eq('id', addressId)
          .select()
          .single();

        if (error) throw error;

        setAddresses(prev => prev.map(addr => addr.id === addressId ? data : addr));
        setEditingAddress(null);
      } else {
        // Create new address
        const { data, error } = await supabase
          .from('customer_addresses')
          .insert({
            user_id: user.id,
            ...addressForm,
            is_default: addresses.length === 0
          })
          .select()
          .single();

        if (error) throw error;

        setAddresses(prev => [...prev, data]);
        setShowNewAddress(false);
      }

      setAddressForm({ label: '', street_address: '', city: '', state: '', zip_code: '' });
      toast({
        title: "Address Saved",
        description: "Your address has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: "Error",
        description: "Failed to save address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddressDelete = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const { error } = await supabase
        .from('customer_addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;

      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      toast({
        title: "Address Deleted",
        description: "Address has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: "Error",
        description: "Failed to delete address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const setDefaultAddress = async (addressId: string) => {
    try {
      // First, unset all default addresses
      await supabase
        .from('customer_addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);

      // Then set the selected address as default
      const { data, error } = await supabase
        .from('customer_addresses')
        .update({ is_default: true })
        .eq('id', addressId)
        .select()
        .single();

      if (error) throw error;

      setAddresses(prev => prev.map(addr => ({
        ...addr,
        is_default: addr.id === addressId
      })));

      toast({
        title: "Default Address Updated",
        description: "Default address has been updated successfully.",
      });
    } catch (error) {
      console.error('Error setting default address:', error);
      toast({
        title: "Error",
        description: "Failed to update default address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startEditAddress = (address: CustomerAddress) => {
    setAddressForm({
      label: address.label,
      street_address: address.street_address,
      city: address.city,
      state: address.state,
      zip_code: address.zip_code
    });
    setEditingAddress(address.id);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and addresses</p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditingProfile(!editingProfile)}
          >
            <Edit3 className="h-4 w-4 mr-2" />
            {editingProfile ? 'Cancel' : 'Edit'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {editingProfile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input
                  value={profileForm.first_name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, first_name: e.target.value }))}
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  value={profileForm.last_name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, last_name: e.target.value }))}
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleProfileSave} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label className="text-sm text-muted-foreground">Name</Label>
                  <p className="font-medium">
                    {profile?.first_name || profile?.last_name 
                      ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
                      : 'Not set'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label className="text-sm text-muted-foreground">Phone</Label>
                  <p className="font-medium">{profile?.phone || 'Not set'}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Addresses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            My Addresses
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNewAddress(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* New Address Form */}
          {showNewAddress && (
            <div className="border rounded-lg p-4 space-y-4">
              <h4 className="font-medium">Add New Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Label</Label>
                  <Input
                    placeholder="Home, Office, etc."
                    value={addressForm.label}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, label: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>ZIP Code</Label>
                  <Input
                    placeholder="12345"
                    value={addressForm.zip_code}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, zip_code: e.target.value }))}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Street Address</Label>
                  <Input
                    placeholder="123 Main St"
                    value={addressForm.street_address}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, street_address: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>City</Label>
                  <Input
                    placeholder="New York"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>State</Label>
                  <Input
                    placeholder="NY"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleAddressSave()} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Address'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowNewAddress(false);
                    setAddressForm({ label: '', street_address: '', city: '', state: '', zip_code: '' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Address List */}
          {addresses.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No addresses added yet. Add your first address to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div key={address.id} className="border rounded-lg p-4">
                  {editingAddress === address.id ? (
                    <div className="space-y-4">
                      <h4 className="font-medium">Edit Address</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Label</Label>
                          <Input
                            value={addressForm.label}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, label: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>ZIP Code</Label>
                          <Input
                            value={addressForm.zip_code}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, zip_code: e.target.value }))}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Street Address</Label>
                          <Input
                            value={addressForm.street_address}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, street_address: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>City</Label>
                          <Input
                            value={addressForm.city}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>State</Label>
                          <Input
                            value={addressForm.state}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleAddressSave(address.id)} disabled={loading}>
                          {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setEditingAddress(null);
                            setAddressForm({ label: '', street_address: '', city: '', state: '', zip_code: '' });
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{address.label}</h4>
                          {address.is_default && (
                            <Badge variant="secondary" className="text-xs">Default</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {address.street_address}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {address.city}, {address.state} {address.zip_code}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {!address.is_default && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDefaultAddress(address.id)}
                          >
                            Set Default
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditAddress(address)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddressDelete(address.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerProfile;