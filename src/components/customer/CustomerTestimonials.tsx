import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Star, Quote, Users, TrendingUp, Heart, CheckCircle } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  review_text: string;
  is_featured: boolean;
  created_at: string;
  customer: {
    first_name: string;
    last_name: string;
  } | null;
  booking: {
    service_name: string;
  } | null;
}

const CustomerTestimonials = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'featured' | '5-star'>('all');

  const { toast } = useToast();

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('booking_reviews')
        .select(`
          *,
          customer:customer_id (
            first_name,
            last_name
          ),
          booking:booking_id (
            service_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Cast the data to our Review type since Supabase types might not match exactly
      setReviews((data as any[])?.map(item => ({
        id: item.id,
        rating: item.rating,
        review_text: item.review_text,
        is_featured: item.is_featured,
        created_at: item.created_at,
        customer: item.customer,
        booking: item.booking
      })) || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load testimonials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getFilteredReviews = () => {
    let filtered = reviews;
    
    switch (filter) {
      case 'featured':
        filtered = reviews.filter(review => review.is_featured);
        break;
      case '5-star':
        filtered = reviews.filter(review => review.rating === 5);
        break;
      default:
        filtered = reviews;
    }
    
    return filtered;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getCustomerInitials = (customer: any) => {
    if (!customer?.first_name && !customer?.last_name) return 'A';
    return `${customer.first_name?.[0] || ''}${customer.last_name?.[0] || ''}`.toUpperCase();
  };

  const getCustomerName = (customer: any) => {
    if (!customer?.first_name && !customer?.last_name) return 'Anonymous Customer';
    return `${customer.first_name || ''} ${customer.last_name || ''}`.trim();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredReviews = getFilteredReviews();
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
  const fiveStarCount = reviews.filter(review => review.rating === 5).length;
  const featuredCount = reviews.filter(review => review.is_featured).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading testimonials...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Customer Testimonials</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          See what our customers are saying about our cleaning services. 
          Real reviews from real customers who trust us with their homes and businesses.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="h-6 w-6 text-yellow-400 fill-current" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {averageRating.toFixed(1)}
            </div>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {reviews.length}
            </div>
            <p className="text-sm text-muted-foreground">Total Reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {fiveStarCount}
            </div>
            <p className="text-sm text-muted-foreground">5-Star Reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Heart className="h-6 w-6 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {featuredCount}
            </div>
            <p className="text-sm text-muted-foreground">Featured Reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All Reviews ({reviews.length})
            </Button>
            <Button
              variant={filter === 'featured' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('featured')}
            >
              <Heart className="h-4 w-4 mr-2" />
              Featured ({featuredCount})
            </Button>
            <Button
              variant={filter === '5-star' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('5-star')}
            >
              <Star className="h-4 w-4 mr-2" />
              5-Star ({fiveStarCount})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Grid */}
      {filteredReviews.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Quote className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {filter === 'all' ? 'No reviews yet' : `No ${filter} reviews yet`}
            </h3>
            <p className="text-muted-foreground">
              {filter === 'all' 
                ? "Be the first to leave a review after your cleaning service!"
                : "Check back later for more reviews in this category."
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <Card 
              key={review.id} 
              className={`hover:shadow-lg transition-shadow ${
                review.is_featured ? 'ring-2 ring-primary/20 bg-primary/5' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getCustomerInitials(review.customer)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-foreground">
                          {getCustomerName(review.customer)}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(review.created_at)}
                        </p>
                      </div>
                    </div>
                    
                    {review.is_featured && (
                      <Badge className="bg-primary text-primary-foreground">
                        <Heart className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    {renderStars(review.rating)}
                    <span className="text-sm font-medium">
                      {review.rating}/5
                    </span>
                  </div>

                  {/* Service */}
                  {review.booking?.service_name && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-muted-foreground">
                        {review.booking.service_name}
                      </span>
                    </div>
                  )}

                  {/* Review Text */}
                  {review.review_text && (
                    <div className="relative">
                      <Quote className="h-8 w-8 text-muted-foreground/20 absolute -top-2 -left-2" />
                      <p className="text-sm text-foreground italic pl-6">
                        "{review.review_text}"
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Trust Indicators */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <h3 className="text-xl font-semibold text-foreground">
              Trusted by {reviews.length}+ Happy Customers
            </h3>
          </div>
          <p className="text-muted-foreground mb-6">
            Join thousands of satisfied customers who trust us with their cleaning needs. 
            Every review helps us improve our service quality.
          </p>
          <Button onClick={() => window.location.href = '/customer'}>
            Book Your Service Today
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerTestimonials;