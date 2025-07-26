import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, DollarSign, Settings, Percent } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  price_per_hour: number;
  category: string;
  is_active: boolean;
}

interface PricingTier {
  id: string;
  name: string;
  description: string;
  service_multiplier: number;
  membership_discount: number;
  is_active: boolean;
}

interface SpecialOffer {
  id: string;
  name: string;
  description: string;
  type: string;
  value: number;
  code: string;
  min_order_amount: number;
  max_uses: number;
  uses_count: number;
  is_active: boolean;
  expires_at: string;
}

const AdvancedServiceManager = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [specialOffers, setSpecialOffers] = useState<SpecialOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'services' | 'pricing' | 'offers'>('services');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, pricingRes, offersRes] = await Promise.all([
        supabase.from('service_addons').select('*').order('name'),
        supabase.from('pricing_tiers').select('*').order('name'),
        supabase.from('special_offers').select('*').order('created_at', { ascending: false })
      ]);

      if (servicesRes.error) throw servicesRes.error;
      if (pricingRes.error) throw pricingRes.error;
      if (offersRes.error) throw offersRes.error;

      setServices(servicesRes.data || []);
      setPricingTiers(pricingRes.data || []);
      setSpecialOffers(offersRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch service data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePricingTier = async (tierData: Partial<PricingTier>) => {
    try {
      const { error } = await supabase.functions.invoke('admin-action', {
        body: {
          action: 'updatePricingTier',
          ...tierData
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Pricing tier created successfully"
      });

      fetchData();
    } catch (error) {
      console.error('Error creating pricing tier:', error);
      toast({
        title: "Error",
        description: "Failed to create pricing tier",
        variant: "destructive"
      });
    }
  };

  const handleCreateSpecialOffer = async (offerData: Partial<SpecialOffer>) => {
    try {
      const { error } = await supabase.functions.invoke('admin-action', {
        body: {
          action: 'createSpecialOffer',
          ...offerData
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Special offer created successfully"
      });

      fetchData();
    } catch (error) {
      console.error('Error creating special offer:', error);
      toast({
        title: "Error",
        description: "Failed to create special offer",
        variant: "destructive"
      });
    }
  };

  const PricingTierForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      serviceMultiplier: 1.0,
      membershipDiscount: 0.0,
      isActive: true
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleCreatePricingTier(formData);
      setFormData({
        name: '',
        description: '',
        serviceMultiplier: 1.0,
        membershipDiscount: 0.0,
        isActive: true
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Tier Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Premium, Standard"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe this pricing tier..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="multiplier">Service Multiplier</Label>
            <Input
              id="multiplier"
              type="number"
              step="0.01"
              min="0.5"
              max="3.0"
              value={formData.serviceMultiplier}
              onChange={(e) => setFormData({ ...formData, serviceMultiplier: parseFloat(e.target.value) })}
            />
            <p className="text-xs text-gray-500 mt-1">1.0 = base price, 1.5 = 50% increase</p>
          </div>

          <div>
            <Label htmlFor="discount">Membership Discount</Label>
            <Input
              id="discount"
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={formData.membershipDiscount}
              onChange={(e) => setFormData({ ...formData, membershipDiscount: parseFloat(e.target.value) })}
            />
            <p className="text-xs text-gray-500 mt-1">0.2 = 20% off for members</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="active"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
          <Label htmlFor="active">Active</Label>
        </div>

        <Button type="submit" className="w-full">
          Create Pricing Tier
        </Button>
      </form>
    );
  };

  const SpecialOfferForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      type: 'percentage',
      value: 0,
      code: '',
      minOrderAmount: 0,
      maxUses: null,
      expiresAt: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleCreateSpecialOffer(formData);
      setFormData({
        name: '',
        description: '',
        type: 'percentage',
        value: 0,
        code: '',
        minOrderAmount: 0,
        maxUses: null,
        expiresAt: ''
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="offerName">Offer Name</Label>
          <Input
            id="offerName"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., First Clean Special"
            required
          />
        </div>

        <div>
          <Label htmlFor="offerDescription">Description</Label>
          <Textarea
            id="offerDescription"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe this offer..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="offerType">Discount Type</Label>
            <select
              id="offerType"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-2 border rounded-md"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed_amount">Fixed Amount</option>
              <option value="first_clean">First Clean Special</option>
            </select>
          </div>

          <div>
            <Label htmlFor="offerValue">Value</Label>
            <Input
              id="offerValue"
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) })}
              placeholder={formData.type === 'percentage' ? '10 (for 10%)' : '2000 (for $20)'}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="offerCode">Promo Code</Label>
          <Input
            id="offerCode"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            placeholder="FIRST20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minAmount">Min Order Amount ($)</Label>
            <Input
              id="minAmount"
              type="number"
              value={formData.minOrderAmount}
              onChange={(e) => setFormData({ ...formData, minOrderAmount: parseInt(e.target.value) })}
            />
          </div>

          <div>
            <Label htmlFor="maxUses">Max Uses (optional)</Label>
            <Input
              id="maxUses"
              type="number"
              value={formData.maxUses || ''}
              onChange={(e) => setFormData({ ...formData, maxUses: e.target.value ? parseInt(e.target.value) : null })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="expiresAt">Expires At (optional)</Label>
          <Input
            id="expiresAt"
            type="datetime-local"
            value={formData.expiresAt}
            onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
          />
        </div>

        <Button type="submit" className="w-full">
          Create Special Offer
        </Button>
      </form>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Advanced Service Management</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Advanced Service Management</CardTitle>
          <CardDescription>Manage services, pricing tiers, and special offers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-1 mb-6">
            {(['services', 'pricing', 'offers'] as const).map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'default' : 'outline'}
                onClick={() => setActiveTab(tab)}
                className="capitalize"
              >
                {tab === 'services' && <Settings className="h-4 w-4 mr-2" />}
                {tab === 'pricing' && <DollarSign className="h-4 w-4 mr-2" />}
                {tab === 'offers' && <Percent className="h-4 w-4 mr-2" />}
                {tab}
              </Button>
            ))}
          </div>

          {activeTab === 'services' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Services & Add-ons</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price/Hour</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>{service.category}</TableCell>
                      <TableCell>${(service.price_per_hour / 100).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={service.is_active ? 'default' : 'secondary'}>
                          {service.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Pricing Tiers</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Pricing Tier
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Pricing Tier</DialogTitle>
                      <DialogDescription>
                        Set up a new pricing tier with custom multipliers and discounts
                      </DialogDescription>
                    </DialogHeader>
                    <PricingTierForm />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pricingTiers.map((tier) => (
                  <Card key={tier.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {tier.name}
                        <Badge variant={tier.is_active ? 'default' : 'secondary'}>
                          {tier.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Service Multiplier:</span>
                          <span className="font-medium">{tier.service_multiplier}x</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Member Discount:</span>
                          <span className="font-medium">{(tier.membership_discount * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'offers' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Special Offers</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Offer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create Special Offer</DialogTitle>
                      <DialogDescription>
                        Set up a promotional offer or discount code
                      </DialogDescription>
                    </DialogHeader>
                    <SpecialOfferForm />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specialOffers.map((offer) => (
                  <Card key={offer.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {offer.name}
                        <Badge variant={offer.is_active ? 'default' : 'secondary'}>
                          {offer.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{offer.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Code:</span>
                          <span className="font-mono font-medium">{offer.code}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Discount:</span>
                          <span className="font-medium">
                            {offer.type === 'percentage' ? `${offer.value}%` : `$${(offer.value / 100).toFixed(2)}`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Uses:</span>
                          <span className="font-medium">
                            {offer.uses_count}/{offer.max_uses || '∞'}
                          </span>
                        </div>
                        {offer.expires_at && (
                          <div className="flex justify-between">
                            <span>Expires:</span>
                            <span className="font-medium text-xs">
                              {new Date(offer.expires_at).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedServiceManager;