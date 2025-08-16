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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Settings, Upload, Search, Filter, Image as ImageIcon, X } from 'lucide-react';
import { services as staticServices } from '@/data/services';

interface ServiceAddon {
  id: string;
  name: string;
  description: string;
  price_per_hour: number;
  category: string;
  is_active: boolean;
  image_url?: string;
  created_at: string;
}

const EnhancedServiceManager = () => {
  const [serviceAddons, setServiceAddons] = useState<ServiceAddon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    fetchServiceAddons();
  }, []);

  const fetchServiceAddons = async () => {
    try {
      const { data, error } = await supabase
        .from('service_addons')
        .select('*')
        .order('name');

      if (error) throw error;
      setServiceAddons(data || []);
    } catch (error) {
      console.error('Error fetching service addons:', error);
      toast({
        title: "Error",
        description: "Failed to fetch services",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(new Set(staticServices.map(s => s.category).filter(Boolean))) as string[];
  
  const filteredServices = serviceAddons.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const AddServiceForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      pricePerHour: 0,
      category: '',
      isActive: true,
      imageUrl: ''
    });
    const [selectedStaticService, setSelectedStaticService] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>('');

    const handleStaticServiceSelect = (serviceId: string) => {
      const service = staticServices.find(s => s.id.toString() === serviceId);
      if (service) {
        setFormData({
          name: service.title,
          description: service.description,
          pricePerHour: service.regularPrice * 100, // Convert to cents
          category: service.category || 'General',
          isActive: true,
          imageUrl: service.image
        });
        setImagePreview(service.image);
        setSelectedStaticService(serviceId);
      }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error", 
          description: "Image size must be less than 5MB",
          variant: "destructive"
        });
        return;
      }

      setUploading(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `services/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('service-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('service-images')
          .getPublicUrl(filePath);

        setFormData({ ...formData, imageUrl: publicUrl });
        setImagePreview(publicUrl);

        toast({
          title: "Success",
          description: "Image uploaded successfully"
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive"
        });
      } finally {
        setUploading(false);
      }
    };

    const removeImage = () => {
      setFormData({ ...formData, imageUrl: '' });
      setImagePreview('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      try {
        const { error } = await supabase
          .from('service_addons')
          .insert({
            name: formData.name,
            description: formData.description,
            price_per_hour: formData.pricePerHour,
            category: formData.category,
            is_active: formData.isActive,
            image_url: formData.imageUrl || null
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Service added successfully"
        });

        fetchServiceAddons();
        setIsAddDialogOpen(false);
        setFormData({
          name: '',
          description: '',
          pricePerHour: 0,
          category: '',
          isActive: true,
          imageUrl: ''
        });
        setSelectedStaticService('');
        setImagePreview('');
      } catch (error) {
        console.error('Error adding service:', error);
        toast({
          title: "Error",
          description: "Failed to add service",
          variant: "destructive"
        });
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quick Select from Static Services */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <Label htmlFor="staticService" className="text-sm font-medium text-blue-900">
            Quick Add from Service Catalog
          </Label>
          <Select value={selectedStaticService} onValueChange={handleStaticServiceSelect}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select a service from our catalog..." />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {staticServices.map((service) => (
                <SelectItem key={service.id} value={service.id.toString()}>
                  <div className="flex flex-col">
                    <span className="font-medium">{service.title}</span>
                    <span className="text-xs text-gray-500">{service.category} - ${service.regularPrice}/hr</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-blue-600 mt-1">
            Select a service to auto-fill the form, or create a custom service below
          </p>
        </div>

        {/* Manual Service Form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Service Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Deep Kitchen Cleaning"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this service includes..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price per Hour ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.pricePerHour / 100}
                onChange={(e) => setFormData({ ...formData, pricePerHour: Math.round(parseFloat(e.target.value) * 100) })}
                placeholder="25.00"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

            {/* Image Upload Section */}
            <div className="space-y-3">
              <Label>Service Image</Label>
              
              {imagePreview ? (
                <div className="relative inline-block">
                  <img 
                    src={imagePreview} 
                    alt="Service preview" 
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={removeImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-4">Upload a service image</p>
                  <Label htmlFor="image-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" disabled={uploading} asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Choose Image'}
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="active">Active (available for booking)</Label>
            </div>
          </div>

        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
          <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  const toggleServiceStatus = async (serviceId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('service_addons')
        .update({ is_active: !currentStatus })
        .eq('id', serviceId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Service ${!currentStatus ? 'activated' : 'deactivated'} successfully`
      });

      fetchServiceAddons();
    } catch (error) {
      console.error('Error updating service status:', error);
      toast({
        title: "Error",
        description: "Failed to update service status",
        variant: "destructive"
      });
    }
  };

  const deleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('service_addons')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Service deleted successfully"
      });

      fetchServiceAddons();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Service Management
          </CardTitle>
          <CardDescription>Loading services...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Service Management
              </CardTitle>
              <CardDescription>
                Manage your cleaning services and pricing
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Service</DialogTitle>
                  <DialogDescription>
                    Add a new cleaning service to your platform
                  </DialogDescription>
                </DialogHeader>
                <AddServiceForm />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{serviceAddons.filter(s => s.is_active).length}</div>
            <p className="text-sm text-gray-600">Active Services</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{serviceAddons.filter(s => !s.is_active).length}</div>
            <p className="text-sm text-gray-600">Inactive Services</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
            <p className="text-sm text-gray-600">Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">${serviceAddons.length > 0 ? (serviceAddons.reduce((sum, s) => sum + s.price_per_hour, 0) / serviceAddons.length / 100).toFixed(2) : '0.00'}</div>
            <p className="text-sm text-gray-600">Avg. Price/Hr</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>Services ({filteredServices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredServices.length === 0 ? (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No services found</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Service
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price/Hour</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {service.image_url ? (
                          <img 
                            src={service.image_url} 
                            alt={service.name}
                            className="w-12 h-12 object-cover rounded-lg border"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{service.name}</div>
                          {service.description && (
                            <div className="text-sm text-gray-500 line-clamp-2">
                              {service.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{service.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">${(service.price_per_hour / 100).toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={service.is_active ? 'default' : 'secondary'}>
                        {service.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleServiceStatus(service.id, service.is_active)}
                        >
                          {service.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteService(service.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedServiceManager;